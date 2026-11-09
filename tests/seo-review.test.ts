import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewSlot,cronAuthorized,reviewWithClaude,validateReview,savedReview,reviewsEnabled,REVIEW_AREAS,parseReviewResponse} from '../src/lib/seo-review.ts';
import {scoreSnapshot,SCORING_VERSION} from '../src/lib/seo-review-dashboard.ts';
import {storeReview} from '../src/lib/seo-review-store.ts';
import {reviewSignals} from '../src/lib/seo-review-signals.ts';
const frame=(value:unknown)=>'data: '+JSON.stringify(value)+'\n\n';
const streamed=(message:any)=>new Response([
 frame({type:'message_start',message:{...message,content:[],stop_reason:null,usage:{input_tokens:message.usage.input_tokens,output_tokens:0}}}),
 ...message.content.flatMap((block:any,index:number)=>[frame({type:'content_block_start',index,content_block:{type:block.type,text:''}}),frame({type:'content_block_delta',index,delta:{type:block.type==='text'?'text_delta':'thinking_delta',text:block.text}})]),
 frame({type:'message_delta',delta:{stop_reason:message.stop_reason},usage:message.usage}),frame({type:'message_stop'}),
].join(''),{headers:{'content-type':'text/event-stream','request-id':'req_test'}});

test('weekly review starts at Monday 8 AM CT with deferred slots sharing the date key',()=>{
 for(const date of ['2026-11-09T14:00:00Z','2027-07-05T13:00:00Z','2027-03-15T13:04:00Z']) assert.ok(reviewSlot(new Date(date)));
 for(const date of ['2026-11-09T13:00:00Z','2027-07-05T16:00:00Z','2026-11-10T14:00:00Z']) assert.equal(reviewSlot(new Date(date)),null);
 assert.equal(reviewSlot(new Date('2026-11-09T14:00:00Z')),'2026-11-09');
});
test('cron denies missing or incorrect secrets',()=>{
 assert.equal(cronAuthorized(null,''),false);
 assert.equal(cronAuthorized('Bearer wrong','right'),false);
 assert.equal(cronAuthorized('Bearer right','right'),true);
});
test('paid reviews require explicit activation; a deterministic scan is stored without a Claude execution',()=>{
 for(const flag of [undefined,'','false','TRUE','1'])assert.equal(reviewsEnabled(flag),false);
 assert.equal(reviewsEnabled('true'),true);
 const measured={source:'scan',status:'complete',startedAt:new Date().toISOString(),completedAt:new Date().toISOString(),measuredAt:new Date().toISOString(),scoringVersion:SCORING_VERSION,scorecard:scoreSnapshot([]),evidence:[]};
 assert.equal(savedReview(measured).source,'scan');assert.equal(savedReview(measured).model,undefined);
 assert.throws(()=>savedReview({...measured,model:'claude-fable-5-2'}),/snapshot/);
 assert.throws(()=>savedReview({...measured,partialUsage:{input_tokens:10,output_tokens:1}}),/snapshot/);
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
 const stored={status:'complete',startedAt:new Date().toISOString(),completedAt:new Date().toISOString(),model:'claude-fable-5-2',effort:'high',report:valid(),evidence:[{id:'settings'}]};
 assert.equal(savedReview(stored).status,'complete');
 assert.throws(()=>savedReview({...stored,report:{}}),/review/);
 assert.throws(()=>savedReview({...stored,completedAt:'invalid'}),/completion time/);
 assert.throws(()=>savedReview({...stored,completedAt:undefined}),/execution/);
});
test('Claude verifies exact model access, sets High effort, records usage and never silently falls back',async()=>{
 const calls:{url:string;body?:Record<string,unknown>}[]=[];
 const send:typeof fetch=async (url,init)=>{
  calls.push({url:String(url),body:init?.body?JSON.parse(String(init.body)):undefined});
  return calls.length===1?Response.json({id:'claude-fable-5-2'}):streamed({id:'msg_test',model:'claude-fable-5-2',stop_reason:'end_turn',usage:{input_tokens:10,output_tokens:20},content:[{type:'text',text:JSON.stringify(valid())}]});
 };
 const result=await reviewWithClaude('test-key','trusted instructions',{id:'settings'},send);
 assert.equal(calls[0].url,'https://api.anthropic.com/v1/models/claude-fable-5-2');
 assert.deepEqual(calls[1].body?.output_config,{effort:'high'});
 assert.equal(calls[1].body?.model,'claude-fable-5-2');
 assert.equal(calls[1].body?.max_tokens,48000);
 assert.equal(calls[1].body?.stream,true);
 assert.deepEqual(result.usage,{input_tokens:10,output_tokens:20});
 assert.equal(result.providerRequestId,'req_test');
 await assert.rejects(()=>reviewWithClaude('','','',send),/key/);
 await assert.rejects(()=>reviewWithClaude('test','',{},async()=>new Response('',{status:403})),/access/);
 await assert.rejects(()=>reviewWithClaude('test','',{},async(url)=>String(url).includes('/models/')?Response.json({id:'claude-fable-5-2'}):streamed({id:'msg_other',model:'other',stop_reason:'end_turn',usage:{input_tokens:10,output_tokens:20},content:[]})),/model/);
});
test('incomplete Claude responses retain the provider receipt and precise stop reason',async()=>{
 let receipt:Record<string,unknown>|undefined;
 const send:typeof fetch=async url=>String(url).includes('/models/')?Response.json({id:'claude-fable-5-2'}):streamed({id:'msg_budget',model:'claude-fable-5-2',stop_reason:'max_tokens',usage:{input_tokens:250000,output_tokens:16000},content:[{type:'text',text:'{"summary":"unfinished'}]});
 await assert.rejects(()=>reviewWithClaude('test','',{},send,async r=>{receipt=r;}),/max_tokens/);
 assert.equal(receipt?.messageId,'msg_budget');assert.equal(receipt?.stopReason,'max_tokens');assert.deepEqual(receipt?.usage,{input_tokens:250000,output_tokens:16000});
 assert.equal(receipt?.rawResponse,'{"summary":"unfinished');
});
test('an interrupted stream retains identity and partial usage without claiming final totals or retrying',async()=>{
 let calls=0,receipt:Record<string,unknown>|undefined;
 const send:typeof fetch=async url=>{calls++;return String(url).includes('/models/')?Response.json({id:'claude-fable-5-2'}):new Response(frame({type:'message_start',message:{id:'msg_interrupted',model:'claude-fable-5-2',content:[],usage:{input_tokens:10,output_tokens:1}}})+frame({type:'message_delta',delta:{stop_reason:'end_turn'},usage:{output_tokens:7}}),{headers:{'content-type':'text/event-stream'}});};
 await assert.rejects(()=>reviewWithClaude('test','',{},send,async r=>{receipt=r;}),/message_stop/);
 assert.equal(calls,2);assert.equal(receipt?.messageId,'msg_interrupted');assert.equal(receipt?.usage,undefined);assert.deepEqual(receipt?.partialUsage,{input_tokens:10,output_tokens:7});
 const saved=savedReview({status:'failed',startedAt:new Date().toISOString(),...receipt});assert.equal(saved.usage,undefined);assert.deepEqual(saved.partialUsage,{input_tokens:10,output_tokens:7});
});
test('a terminal marker without terminal output usage cannot promote provisional counters to final totals',async()=>{
 let receipt:Record<string,unknown>|undefined;
 const send:typeof fetch=async url=>String(url).includes('/models/')?Response.json({id:'claude-fable-5-2'}):new Response(frame({type:'message_start',message:{id:'msg_missing_usage',model:'claude-fable-5-2',content:[],usage:{input_tokens:10,output_tokens:1}}})+frame({type:'message_delta',delta:{stop_reason:'end_turn'}})+frame({type:'message_stop'}),{headers:{'content-type':'text/event-stream'}});
 await assert.rejects(()=>reviewWithClaude('test','',{},send,async r=>{receipt=r;}),/terminal usage/);
 assert.equal(receipt?.usage,undefined);assert.deepEqual(receipt?.partialUsage,{input_tokens:10,output_tokens:1});
});
test('only complete fenced JSON is normalized; surrounding prose and truncation remain invalid',()=>{
 const report=valid(),json=JSON.stringify(report);
 assert.deepEqual(parseReviewResponse(json),report);
 assert.deepEqual(parseReviewResponse('```json\n'+json+'\n```'),report);
 assert.throws(()=>parseReviewResponse('```json\n'+json.slice(0,-1)));
 assert.throws(()=>parseReviewResponse('Here is the review:\n'+json));
 assert.throws(()=>parseReviewResponse(json+'\nextra prose'));
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

test('Monday deferral window includes 9 and 10 CT in both DST offsets without changing the date key',()=>{
 assert.equal(reviewSlot(new Date('2026-11-09T15:00:00Z')),'2026-11-09');
 assert.equal(reviewSlot(new Date('2026-11-09T16:00:00Z')),'2026-11-09');
 assert.equal(reviewSlot(new Date('2026-11-09T17:00:00Z')),null);
 assert.equal(reviewSlot(new Date('2026-07-06T15:00:00Z')),'2026-07-06');
 assert.equal(reviewSlot(new Date('2026-07-06T16:00:00Z')),null);
});


test('Claude sends the selected workspace on both model access and generation',async()=>{
 const headers:Headers[]=[];
 const send:typeof fetch=async(url,init)=>{
  headers.push(new Headers(init?.headers));
  return String(url).includes('/models/')?Response.json({id:'claude-fable-5-2'}):streamed({id:'msg_workspace',model:'claude-fable-5-2',stop_reason:'end_turn',usage:{input_tokens:1,output_tokens:1},content:[{type:'text',text:'Verified'}]});
 };
 await reviewWithClaude('test-key','test',{},send,async()=>{},'wrkspc_test');
 assert.equal(headers.length,2);
 for(const header of headers)assert.equal(header.get('anthropic-workspace-id'),'wrkspc_test');
});
