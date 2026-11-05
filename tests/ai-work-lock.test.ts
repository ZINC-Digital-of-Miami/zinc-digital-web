import {test} from 'node:test';
import assert from 'node:assert/strict';
import {AiWorkBusy,CODEX_BUSY,CLAUDE_BUSY,coordinationError} from '../src/lib/ai-work-lock.ts';
import {storeReview} from '../src/lib/seo-review-store.ts';
test('only known coordination responses become deferrals',()=>{
 for(const message of [CODEX_BUSY,CLAUDE_BUSY])assert.ok(coordinationError({code:'P0001',message}) instanceof AiWorkBusy);
 assert.equal(coordinationError({code:'XX000',message:CODEX_BUSY}),null);
 assert.equal(coordinationError({code:'P0001',message:'Sensitive unrelated failure'}),null);
});
test('a deferred claim makes no paid call and can retry the same key',async()=>{
 let busy=true,calls=0;
 const sb:any={from:()=>({upsert:()=>({abortSignal:async()=>({error:null})}),insert:()=>({abortSignal:async()=>({error:busy?{code:'P0001',message:CODEX_BUSY}:null})}),update:()=>({eq:()=>({abortSignal:async()=>({error:null})})})})};
 await assert.rejects(()=>storeReview(sb,'seo_review:weekly:2026-11-09',async()=>{calls++;return {};}),AiWorkBusy);
 assert.equal(calls,0);busy=false;
 await storeReview(sb,'seo_review:weekly:2026-11-09',async()=>{calls++;return {};});assert.equal(calls,1);
});
test('deferral is recorded separately from the paid-run reservation',async()=>{
 let record:any;
 const sb:any={from:()=>({insert:()=>({abortSignal:async()=>({error:{code:'P0001',message:CODEX_BUSY}})}),upsert:(value:any)=>{record=value;return {abortSignal:async()=>({error:null})};}})};
 await assert.rejects(()=>storeReview(sb,'seo_review:weekly:2026-11-09',async()=>{throw Error('paid task must not start');}),AiWorkBusy);
 assert.equal(record.key,'seo_review:deferred:weekly:2026-11-09');
 assert.equal(record.value.status,'deferred');assert.equal(record.value.paidRunStarted,false);
 assert.equal(record.value.reviewKey,'seo_review:weekly:2026-11-09');
});
test('later weekly slots require a saved pre-paid deferral and respect any existing reservation',async()=>{
 const {retryEligibility}=await import('../src/lib/seo-review-store.ts');
 const key='seo_review:weekly:2026-11-09';
 const check=(rows:any[])=>retryEligibility({from:()=>({select:()=>({in:()=>({abortSignal:async()=>({data:rows,error:null})})})})} as any,key);
 assert.equal(await check([]),'not_deferred');
 assert.equal(await check([{key:'seo_review:deferred:weekly:2026-11-09',value:{status:'deferred',reviewKey:key,paidRunStarted:false}}]),'deferred');
 assert.equal(await check([{key,value:{status:'failed'}}]),'reserved');
 assert.equal(await check([{key:'seo_review:deferred:weekly:2026-11-09',value:{status:'deferred',reviewKey:key,paidRunStarted:true}}]),'not_deferred');
});
