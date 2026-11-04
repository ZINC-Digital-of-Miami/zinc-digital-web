import {randomUUID} from 'node:crypto';
import type {SupabaseClient} from '@supabase/supabase-js';
/** Serialize the product's Publish route across the RPC/read/hook boundary. */
export async function claimPublish(sb:SupabaseClient){
 const key='publish_lock';
 const seeded=await sb.from('admin_cache').upsert({key,value:{token:'initial',expiresAt:0}},{onConflict:'key',ignoreDuplicates:true}).abortSignal(AbortSignal.timeout(10000));
 if(seeded.error)throw new Error('Publishing lock could not be prepared.');
 const previous=await sb.from('admin_cache').select('value').eq('key',key).abortSignal(AbortSignal.timeout(10000)).single();
 if(previous.error||typeof previous.data?.value?.token!=='string'||!Number.isFinite(previous.data.value.expiresAt))throw new Error('Publishing lock could not be read.');
 if(previous.data.value.expiresAt>Date.now())throw new Error('Another publish is in progress. Refresh its status before trying again.');
 const token=randomUUID();
 // Database requests take at most ten seconds each; the hook has thirty. Total budget remains below two minutes.
 const claimed=await sb.from('admin_cache').update({value:{token,expiresAt:Date.now()+120000}}).eq('key',key).eq('value->>token',previous.data.value.token).select('key').abortSignal(AbortSignal.timeout(10000)).maybeSingle();
 if(claimed.error||!claimed.data)throw new Error('Another publish started. Refresh its status before trying again.');
 return async()=>{try{await sb.from('admin_cache').update({value:{token,expiresAt:0}}).eq('key',key).eq('value->>token',token).abortSignal(AbortSignal.timeout(10000));}catch{/* A failed release expires automatically. */}};
}
