import {test} from 'node:test';
import assert from 'node:assert/strict';
import {executeJob, runnerError} from '../scripts/codex-runner/worker.mjs';
import {renderLaunchAgent} from '../scripts/install-codex-runner.mjs';

test('SEO worker returns generated text without saving content',async()=>{
  const states:any[]=[];
  const result=await executeJob({kind:'seo',payload:{instructions:'facts only',input:'page'}},{
    generate:async(payload:any)=>{assert.equal(payload.input,'page');return{text:'draft',model:'gpt-6.1-sol',reasoningEffort:'medium'};}
  },async(state:any)=>{states.push(state);});
  assert.equal(result.text,'draft'); assert.equal(states.at(-1).status,'ready');
});

test('connect clears authorization URL and verifies before ready',async()=>{
  const states:any[]=[];
  const result=await executeJob({kind:'connect',payload:{}},{connect:async(notify:any)=>{
    await notify('https://auth.openai.com/authorize');await notify(null);return{connected:true};
  }},async(state:any)=>{states.push(state);});
  assert.deepEqual(result,{connected:true});
  assert.deepEqual(states.map(s=>s.status),['authenticating','verifying','ready']);
  assert.equal(states.at(-1).auth_url,null);
});

test('unknown queue work is rejected and cloud errors never expose credentials',async()=>{
  await assert.rejects(()=>executeJob({kind:'publish',payload:{}},{},async()=>{}),/unsupported/i);
  assert.equal(runnerError(new Error('Bearer secret https://host/?token=sensitive')),'The local subscription request failed. Check Codex sign-in and subscription usage, then retry.');
});

test('launch agent uses absolute executables and keeps secrets out of plist',()=>{
  const plist=renderLaunchAgent({node:'/bin/node',runner:'/Volumes/Drive/a&b/runner.mjs',envFile:'/Volumes/Drive/.env',stateDir:'/Volumes/Drive/runtime',codex:'/bin/codex'});
  assert.match(plist,/<key>RunAtLoad<\/key><true\/>/);assert.match(plist,/<key>KeepAlive<\/key><true\/>/);
  assert.match(plist,/a&amp;b/);assert.match(plist,/--env/);assert.doesNotMatch(plist,/SUPABASE_SERVICE_ROLE_KEY/);
});
