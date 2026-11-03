import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewSlot,cronAuthorized,reviewWithClaude,validateReview,savedReview,REVIEW_AREAS} from '../src/lib/seo-review.ts';
import {storeReview} from '../src/lib/seo-review-store.ts';
import {reviewSignals} from '../src/lib/seo-review-signals.ts';

test('weekly review runs at Monday 8 AM CT in winter and summer, once per local date',()=>{
 for(const date of ['2026-11-09T14:00:00Z','2027-07-05T13:00:00Z','2027-03-15T13:04:00Z']) assert.ok(reviewSlot(new Date(date)));
 for(const date of ['2026-11-09T13:00:00Z','2027-07-05T14:00:00Z','2026-11-10T14:00:00Z']) assert.equal(reviewSlot(new Date(date)),null);
 assert.equal(reviewSlot(new Date('2026-11-09T14:00:00Z')),'2026-11-09');
});
test('cron denies missing or incorrect secrets',()=>{
 assert.equal(cronAuthorized(null,''),false);
 assert.equal(cronAuthorized('Bearer wrong','right'),false);
 assert.equal(cronAuthorized('Bearer right','right'),true);
});
test('public signals preserve deployed canonical/social settings and exclude executable scripts',()=>{
 const data=reviewSignals('<title>Page | ZINC</title><link rel="canonical" href="https://www.zincdigital.co/"><meta property="og:image:alt" content="A useful diagram"><meta name="private" content="excluded"><script>private runtime data</script><img src="/missing-alt.png">');
 assert.equal(data.title,'Page | ZINC');assert.deepEqual(data.imagesMissingAlt,['/missing-alt.png']);assert.equal(data.metadata[0].content,'A useful diagram');assert.doesNotMatch(JSON.stringify(data),/private/);
});
const valid=()=>({summary:'Review complete; traffic access unavailable.',checks:REVIEW_AREAS.map(area=>({area,status:'unavailable',detail:'Further evidence is required.',evidenceIds:['settings']})),recommendations:[{priority:'high',area:'settings',path:'/',problem:'Connection unverified.',action:'Verify the native Google connection.',reason:'Traffic conclusions require verified evidence.',evidenceIds:['settings'],validation:'Read the verified property details.'}]});
test('model output must cover every review area and cite only supplied evidence and paths',()=>{
 assert.ok(validateReview(valid(),new Map([['settings',{}]]),new Set(['/'])));
 const missing=valid();missing.checks.pop();assert.throws(()=>validateReview(missing,new Map([['settings',{}]]),new Set(['/'])));
 const invented=valid();invented.recommendations[0].evidenceIds=['made-up'];assert.throws(()=>validateReview(invented,new Map([['settings',{}]]),new Set(['/'])));
 const external=valid();external.recommendations[0].path='https://client.example/';assert.throws(()=>validateReview(external,new Map([['settings',{}]]),new Set(['/'])));
 const falsePass=valid();falsePass.checks.find(c=>c.area==='performance')!.status='checked';
 assert.throws(()=>validateReview(falsePass,new Map([['settings',{}],['performance',{available:false}]]),new Set(['/'])),/Performance/);
 const falseTraffic=valid();falseTraffic.checks.find(c=>c.area==='traffic behavior')!.status='checked';
 assert.throws(()=>validateReview(falseTraffic,new Map([['settings',{}],['ga4',{available:false}],['gsc',{available:false}]]),new Set(['/'])),/Google/);
 const stored={status:'complete',startedAt:new Date().toISOString(),completedAt:new Date().toISOString(),model:'claude-opus-5-5',effort:'high',report:valid(),evidence:[{id:'settings'}]};
 assert.equal(savedReview(stored).status,'complete');
 assert.throws(()=>savedReview({...stored,report:{}}),/review/);
 assert.throws(()=>savedReview({...stored,completedAt:'invalid'}),/completion time/);
 assert.throws(()=>savedReview({...stored,completedAt:undefined}),/execution/);
});
test('Claude verifies exact model access, sets High effort, records usage and never silently falls back',async()=>{
 const calls:{url:string;body?:Record<string,unknown>}[]=[];
 const send:typeof fetch=async (url,init)=>{
  calls.push({url:String(url),body:init?.body?JSON.parse(String(init.body)):undefined});
  return Response.json(calls.length===1?{id:'claude-opus-5-5'}:{id:'msg_test',model:'claude-opus-5-5',stop_reason:'end_turn',usage:{input_tokens:10,output_tokens:20},content:[{type:'text',text:JSON.stringify(valid())}]});
 };
 const result=await reviewWithClaude('test-key','trusted instructions',{id:'settings'},send);
 assert.equal(calls[0].url,'https://api.anthropic.com/v1/models/claude-opus-5-5');
 assert.deepEqual(calls[1].body?.output_config,{effort:'high'});
 assert.equal(calls[1].body?.model,'claude-opus-5-5');
 assert.deepEqual(result.usage,{input_tokens:10,output_tokens:20});
 await assert.rejects(()=>reviewWithClaude('','','',send),/key/);
 await assert.rejects(()=>reviewWithClaude('test','',{},async()=>new Response('',{status:403})),/access/);
 await assert.rejects(()=>reviewWithClaude('test','',{},async(url)=>Response.json(String(url).includes('/models/')?{id:'claude-opus-5-5'}:{model:'other',stop_reason:'end_turn',content:[]})),/model/);
});
test('duplicate scheduled deliveries cannot repeat the paid operation; failures remain visible',async()=>{
 const rows=new Map<string,unknown>();let executions=0;
 const sb={from:(table:string)=>{assert.equal(table,'admin_cache');return {
  insert:(row:{key:string;value:unknown})=>({abortSignal:async()=>{if(rows.has(row.key))return {error:{code:'23505'}};rows.set(row.key,row.value);return {error:null};}}),
  update:(row:{value:unknown})=>({eq:(_:string,key:string)=>({abortSignal:async()=>{rows.set(key,row.value);return {error:null};}})}),
 };}};
 const task=async()=>{executions++;return {summary:'saved'};};
 const results=await Promise.all([storeReview(sb as any,'seo_review:weekly:2026-11-09',task),storeReview(sb as any,'seo_review:weekly:2026-11-09',task)]);
 assert.equal(executions,1);assert.equal(results.filter(x=>x.duplicate).length,1);
 assert.equal((rows.get('seo_review:weekly:2026-11-09') as any).status,'complete');
 await assert.rejects(()=>storeReview(sb as any,'failed',async()=>{throw new Error('Native evidence unavailable');}),/Native evidence/);
 assert.equal((rows.get('failed') as any).status,'failed');
 await assert.rejects(()=>storeReview(sb as any,'invalid-result',async receipt=>{await receipt({messageId:'msg_paid',usage:{input_tokens:10,output_tokens:20}});throw new Error('Invalid result');}),/Invalid result/);
 assert.equal((rows.get('invalid-result') as any).messageId,'msg_paid');
});
