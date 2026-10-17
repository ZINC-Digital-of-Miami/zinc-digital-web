export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {input,reply,fail} from '../../../lib/admin-http';
import {codexConnection,enqueueCodexJob,readCodexJob} from '../../../lib/codex-jobs';
export const GET:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{const state=await codexConnection(ctx),id=ctx.url.searchParams.get('id');if(!id)return reply(state);const job=await readCodexJob(ctx,id);if(job.kind!=='connect'&&job.kind!=='verify')return fail('Choose a connection request.');return reply({...state,jobStatus:job.status,jobError:job.error});}catch(e){return reply({error:e instanceof Error?e.message:'Codex could not be checked.'},503);}
};
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx,'owner');if(staff instanceof Response)return staff;
 try{const body=await input(ctx,1000);if(body.action!=='connect'&&body.action!=='verify')return fail('Choose Connect or Verify.');
 return reply(await enqueueCodexJob(ctx,body.action,body.action==='connect'?{reconnect:body.reconnect===true}:{}),202);
 }catch(e){return reply({error:e instanceof Error?e.message:'Codex could not be connected.'},503);}
};
