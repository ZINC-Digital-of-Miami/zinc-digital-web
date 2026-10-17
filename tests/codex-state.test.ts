import {test} from 'node:test';
import assert from 'node:assert/strict';
import {codexStatus,authUrl,CODEX_MODEL,CODEX_EFFORT,jobRequest} from '../src/lib/codex-state.ts';
const now=Date.now();
const ready={heartbeat_at:new Date(now).toISOString(),status:'ready',model:'gpt-6.1-sol',reasoning_effort:'medium',verified_at:new Date(now-1000).toISOString(),auth_url:null,message:''};
test('readiness requires a fresh runner, completed verification, and exact model and effort',()=>{
 assert.equal(codexStatus(ready,now).ready,true);
 for(const patch of [{heartbeat_at:new Date(now-90000).toISOString()},{verified_at:null},{model:'gpt-6-sol'},{reasoning_effort:'high'},{status:'signed_out'}])assert.equal(codexStatus({...ready,...patch},now).ready,false);
 assert.equal(codexStatus(null,now).online,false);
});
test('authorization URLs accept only the official HTTPS authorization host',()=>{
 assert.equal(authUrl('https://auth.openai.com/oauth/authorize?state=abc'),'https://auth.openai.com/oauth/authorize?state=abc');
 for(const v of ['http://auth.openai.com/x','https://auth.openai.com.evil.test/x','javascript:alert(1)','https://user:password@auth.openai.com/x','https://auth.openai.com:9000/x','https://auth.openai.com/x#token','https://auth.openai.com/x?access_token=secret'])assert.equal(authUrl(v),null);
});
test('job requests enforce owner-only sign-in and bounded model inputs',()=>{
 assert.equal(CODEX_MODEL,'gpt-6.1-sol');assert.equal(CODEX_EFFORT,'medium');
 assert.throws(()=>jobRequest('connect',{},'editor'),/owner/);
 assert.deepEqual(jobRequest('verify',{},'owner'),{});
 assert.throws(()=>jobRequest('seo',{instructions:'',input:'test'},'editor'),/instructions/);
 assert.throws(()=>jobRequest('research',{instructions:'safe',input:'a'.repeat(200001)},'editor'),/input/);
 assert.deepEqual(jobRequest('seo',{instructions:'SEO',input:'page'},'editor'),{instructions:'SEO',input:'page'});
});
