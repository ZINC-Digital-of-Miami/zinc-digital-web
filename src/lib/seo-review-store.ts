import {coordinationError} from './ai-work-lock.ts';
import type {SupabaseClient} from '@supabase/supabase-js';

/** A unique cache key claims the run atomically. Duplicate deliveries never repeat a paid call. */
export async function storeReview(sb:SupabaseClient,key:string,task:(receipt:(value:Record<string,unknown>)=>Promise<void>)=>Promise<Record<string,unknown>>){
 const startedAt=new Date().toISOString();
 const claimed=await sb.from('admin_cache').insert({key,value:{status:'running',startedAt},fetched_at:startedAt}).abortSignal(AbortSignal.timeout(10000));
 if(claimed.error){if(claimed.error.code==='23505')return {key,duplicate:true};const busy=coordinationError(claimed.error);if(busy){
  const saved=await sb.from('admin_cache').upsert({key:key.replace('seo_review:','seo_review:deferred:'),value:{status:'deferred',startedAt,source:key.includes(':weekly:')?'weekly':'manual',reviewKey:key,paidRunStarted:false,error:busy.message},fetched_at:startedAt},{onConflict:'key'}).abortSignal(AbortSignal.timeout(10000));
  if(saved.error)throw new Error('The review was deferred before any paid call, but its deferral receipt could not be saved.');
  throw busy;
 }throw new Error('The SEO review could not be reserved. No Claude call was made.');}
 let receipt:Record<string,unknown>={};
 try{
  const result=await task(async value=>{
   receipt=value;
   const saved=await sb.from('admin_cache').update({value:{status:'running',startedAt,...receipt},fetched_at:new Date().toISOString()}).eq('key',key).abortSignal(AbortSignal.timeout(10000));
   if(saved.error)throw new Error('Claude execution could not be recorded. Do not repeat the same run.');
  });
  const completedAt=new Date().toISOString();
  const saved=await sb.from('admin_cache').update({value:{...result,status:'complete',startedAt,completedAt},fetched_at:completedAt}).eq('key',key).abortSignal(AbortSignal.timeout(10000));
  if(saved.error)throw new Error('The review completed, but its report could not be saved. Do not repeat the same run.');
  return {key,duplicate:false};
 }catch(e){
  const error=e instanceof Error?e.message:'The SEO review failed.';
  await sb.from('admin_cache').update({value:{...receipt,status:'failed',startedAt,error,usageUnavailable:!receipt.usage},fetched_at:new Date().toISOString()}).eq('key',key).abortSignal(AbortSignal.timeout(10000));
  throw new Error(error);
 }
}

/** Eligibility is separate from the transactional paid claim: later slots cannot create a fresh run. */
export async function retryEligibility(sb:SupabaseClient,key:string):Promise<'reserved'|'deferred'|'not_deferred'>{
 const deferredKey=key.replace('seo_review:','seo_review:deferred:');
 const result=await sb.from('admin_cache').select('key,value').in('key',[key,deferredKey]).abortSignal(AbortSignal.timeout(10000));
 if(result.error)throw new Error('The weekly retry receipt could not be checked. No review was started.');
 if(result.data?.some(row=>row.key===key))return 'reserved';
 const receipt=result.data?.find(row=>row.key===deferredKey)?.value;
 return receipt?.status==='deferred'&&receipt.reviewKey===key&&receipt.paidRunStarted===false?'deferred':'not_deferred';
}
