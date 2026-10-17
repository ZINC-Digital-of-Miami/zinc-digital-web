import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { AppServerRpc, SubscriptionSession, safeAuthUrl, subscriptionEnvironment } from '../scripts/codex-runner/client.mjs';

class FakeRpc {
  calls: {method:string;params:any}[] = [];
  account:any = {type:'chatgpt'};
  status = 'completed';
  model = 'gpt-6.1-sol';
  text = 'Verified';
  async request(method:string, params:any) {
    this.calls.push({method, params});
    if(method==='account/read') return {account:this.account};
    if(method==='account/login/start') return {type:'chatgpt',loginId:'login-1',authUrl:'https://auth.openai.com/oauth/authorize?state=temporary'};
    if(method==='thread/start') return {thread:{id:'thread-1'},model:this.model,reasoningEffort:'medium'};
    if(method==='turn/start') return {turn:{id:'turn-1'}};
    return {};
  }
  async waitFor(method:string,predicate:(p:any)=>boolean) {
    const value = method==='account/login/completed'
      ? {loginId:'login-1',success:true}
      : {threadId:'thread-1',turn:{id:'turn-1',status:this.status,items:[{type:'agentMessage',text:this.text,phase:'final_answer'}]}};
    assert.ok(predicate(value));
    return value;
  }
}

test('subscription generation uses the requested model and medium and returns completed final text',async()=>{
  const rpc=new FakeRpc(); const session=new SubscriptionSession(rpc,'/empty');
  const result=await session.generate({instructions:'Use supplied facts.',input:'Hello'});
  assert.deepEqual(result,{text:'Verified',model:'gpt-6.1-sol',reasoningEffort:'medium'});
  assert.equal(rpc.calls.find(c=>c.method==='thread/start')?.params.model,'gpt-6.1-sol');
  const turn=rpc.calls.find(c=>c.method==='turn/start')?.params;
  assert.equal(turn.effort,'medium'); assert.equal(turn.model,'gpt-6.1-sol');
  assert.deepEqual(turn.sandboxPolicy,{type:'readOnly',networkAccess:false});
});

test('API-key accounts cannot run a subscription job',async()=>{
  const rpc=new FakeRpc(); rpc.account={type:'apiKey'};
  await assert.rejects(()=>new SubscriptionSession(rpc,'/empty').generate({instructions:'x',input:'y'}),/subscription/i);
  assert.equal(rpc.calls.some(c=>c.method==='thread/start'),false);
});

test('connect publishes only a validated auth URL and then verifies completed inference',async()=>{
  const rpc=new FakeRpc(); rpc.account=null; const updates:string[]=[];
  const original=rpc.waitFor.bind(rpc);
  rpc.waitFor=async(method,predicate)=>{const value=await original(method,predicate); if(method==='account/login/completed')rpc.account={type:'chatgpt'}; return value;};
  const session=new SubscriptionSession(rpc,'/empty');
  await session.connect(async(url:string|null)=>{updates.push(url??'cleared');});
  assert.deepEqual(updates,['https://auth.openai.com/oauth/authorize?state=temporary','cleared']);
  assert.ok(rpc.calls.some(c=>c.method==='turn/start'));
});

test('ready verification rejects a failed turn, empty output, or unexpected model',async()=>{
  for(const field of ['status','text','model']){
    const rpc=new FakeRpc(); (rpc as any)[field]=field==='status'?'failed':field==='text'?'':'different';
    await assert.rejects(()=>new SubscriptionSession(rpc,'/empty').verify());
  }
});

test('auth URLs exclude external hosts, userinfo, insecure links and bearer tokens',()=>{
  for(const value of ['https://evil.test/','http://auth.openai.com/','https://user:pass@auth.openai.com/','https://auth.openai.com/?access_token=secret'])assert.throws(()=>safeAuthUrl(value));
});

test('Codex child environment does not receive service credentials or paid API keys',()=>{
  const result=subscriptionEnvironment({HOME:'/local',PATH:'/bin',CODEX_HOME:'/original',OPENAI_API_KEY:'secret',SUPABASE_SERVICE_ROLE_KEY:'secret',ANTHROPIC_API_KEY:'secret'});
  assert.equal(result.HOME,'/local');assert.equal(result.CODEX_HOME,'/original');
  assert.equal(result.OPENAI_API_KEY,undefined);assert.equal(result.SUPABASE_SERVICE_ROLE_KEY,undefined);assert.equal(result.ANTHROPIC_API_KEY,undefined);
});

test('explicit reconnect starts fresh supported sign-in even with a current login',async()=>{
  const rpc=new FakeRpc(); const session=new SubscriptionSession(rpc,'/empty');
  await session.connect(async()=>{}, {reconnect:true});
  assert.deepEqual(rpc.calls.find(c=>c.method==='account/login/start')?.params,{type:'chatgpt'});
  assert.equal(rpc.calls.some(c=>c.method==='account/logout'),false);
});

test('a timed-out turn is interrupted before the worker releases its thread',async()=>{
  const rpc=new FakeRpc();rpc.waitFor=async()=>{throw new Error('timeout');};
  await assert.rejects(()=>new SubscriptionSession(rpc,'/empty').verify(),/timeout/);
  const interrupt=rpc.calls.findIndex(c=>c.method==='turn/interrupt');
  assert.ok(interrupt>=0);assert.ok(rpc.calls.findIndex(c=>c.method==='thread/unsubscribe')>interrupt);
});

test('stdio client preserves a completion notification that precedes its response',async()=>{
  const child:any=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new PassThrough();
  const rpc=new AppServerRpc(child);
  const pending=rpc.request('turn/start',{});
  child.stdout.write(JSON.stringify({method:'turn/completed',params:{threadId:'t',turn:{id:'v',status:'completed'}}})+'\n');
  child.stdout.write(JSON.stringify({id:1,result:{turn:{id:'v'}}})+'\n');
  assert.equal((await pending).turn.id,'v');
  const finished=await rpc.waitFor('turn/completed',(p:any)=>p.threadId==='t');
  assert.equal(finished.turn.status,'completed');
  child.emit('exit');
});

test('stdio client refuses tool requests instead of authorizing a command',async()=>{
  const child:any=new EventEmitter();child.stdout=new PassThrough();child.stderr=new PassThrough();child.stdin=new PassThrough();
  const rpc=new AppServerRpc(child);
  child.stdout.write(JSON.stringify({id:7,method:'item/commandExecution/requestApproval',params:{command:'dangerous'}})+'\n');
  const response=JSON.parse(child.stdin.read().toString());
  assert.equal(response.id,7);assert.equal(response.error.code,-32601);assert.equal(response.result,undefined);
  child.emit('exit');
});
