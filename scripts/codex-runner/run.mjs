#!/usr/bin/env node
import { loadEnvFile } from 'node:process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { createClient } from '@supabase/supabase-js';
import { startAppServer, SubscriptionSession, MODEL, EFFORT } from './client.mjs';
import { executeJob, runnerError } from './worker.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = name => { const i=process.argv.indexOf(name); return i<0 ? undefined : process.argv[i+1]; };
const stateDir = resolve(arg('--state-dir') || join(root,'.codex-runner'));
if (!stateDir.startsWith('/Volumes/Satechi Hub/')) throw new Error('Runner state must remain on the approved external drive.');
if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('The subscription runner requires Node 24.');
await mkdir(join(stateDir,'workspace'),{recursive:true,mode:0o700});
const envFile = arg('--env');
if(envFile) loadEnvFile(resolve(envFile));

let rpc;
let stop = false;
process.on('SIGTERM',()=>{stop=true;rpc?.close();});
process.on('SIGINT',()=>{stop=true;rpc?.close();});

async function identity() {
  const path=join(stateDir,'identity.json');
  try {
    const value=JSON.parse(await readFile(path,'utf8'));
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value.id)) throw new Error('Invalid runner identity.');
    return value.id;
  } catch(error) {
    if(error.code!=='ENOENT') throw error;
    const id=randomUUID(); await writeFile(path,JSON.stringify({id})+'\n',{mode:0o600,flag:'wx'}); return id;
  }
}

async function run() {
  rpc=await startAppServer({cwd:join(stateDir,'workspace')});
  const session=new SubscriptionSession(rpc,join(stateDir,'workspace'));
  if(process.argv.includes('--verify')) {
    await session.verify();
    console.log(JSON.stringify({connected:true,model:MODEL,reasoningEffort:EFFORT}));
    return;
  }
  const url=process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
  const key=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key) throw new Error('Configure the existing Supabase connection in the local runner environment file.');
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const runnerId=await identity();
  let state={id:'default',status:'signed_out',model:MODEL,reasoning_effort:EFFORT,auth_url:null,message:'Connect Codex from Backend.',verified_at:null};
  let pendingState=Promise.resolve();
  const update=patch=>{
    state={...state,...patch,heartbeat_at:new Date().toISOString()};
    const snapshot={...state};
    // Serialize heartbeat/auth transitions so a delayed heartbeat cannot resurrect an old auth URL.
    pendingState=pendingState.catch(()=>{}).then(async()=>{
      const {error}=await db.from('codex_runner_state').upsert(snapshot);
      if(error) throw new Error('Cannot update subscription connection status.');
    });
    return pendingState;
  };
  await update({});
  const heartbeat=setInterval(()=>{update({}).catch(()=>{ /* cloud availability is retried by the worker loop */ });},10_000);
  try {
    if(await session.hasSubscription()) {
      await update({status:'verifying',message:'Verifying existing Codex subscription access.'});
      try {
        await session.verify();
        await update({status:'ready',message:'Codex subscription connected.',verified_at:new Date().toISOString()});
      } catch { await update({status:'error',message:runnerError()}); }
    }
    while(!stop) {
      if(rpc.closed)throw new Error('Codex stopped; the runner must restart.');
      try {
        const {data,error}=await db.rpc('claim_codex_job',{p_runner:runnerId});
        if(error) throw new Error('Cannot claim subscription request.');
        const job=data?.[0];
        if(!job) { await delay(2000); continue; }
        let result=null; let failure=null;
        try { result=await executeJob(job,session,update); }
        catch {
          failure=runnerError();
          await update({status:await session.hasSubscription().catch(()=>false)?'error':'signed_out',auth_url:null,message:failure});
        }
        const finished=await db.rpc('finish_codex_job',{p_job:job.id,p_runner:runnerId,p_result:result,p_error:failure});
        if(finished.error || finished.data !== true) throw new Error('Subscription result could not be recorded.');
      } catch {
        if(!stop) { console.error('Subscription transport unavailable; retrying. No content was published.'); await delay(5000); }
      }
      if(rpc.closed && !stop) throw new Error('Codex stopped; the runner must restart.');
    }
  } finally {
    clearInterval(heartbeat);
    await update({status:'offline',auth_url:null,message:'The local runner is stopped.'}).catch(()=>{});
  }
}

try { await run(); }
catch(error) {
  const known = [
    'Cannot start the installed Codex CLI.','Codex stopped. Restart the local runner.',
    'Codex rejected the request. Reconnect or retry.','The requested Codex model and Medium reasoning are unavailable.',
    'Configure the existing Supabase connection in the local runner environment file.',
    'Sign in to your Codex ChatGPT subscription in Backend. API-key accounts are not supported.',
  ];
  console.error(known.includes(error.message) ? error.message : 'The subscription runner could not start or verify. Check local configuration and Codex sign-in.');
  process.exitCode=1;
}
finally { rpc?.close(); }
