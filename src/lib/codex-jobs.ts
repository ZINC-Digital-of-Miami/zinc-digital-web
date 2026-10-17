import type {APIContext} from 'astro';
import {requireStaff} from './auth';
import {createAdminClient,createServerClient} from './supabase';
import {codexStatus,jobRequest,type CodexKind,type RunnerState} from './codex-state';
export type CodexJob={id:string;requested_by:string;kind:CodexKind;payload:Record<string,any>;status:'queued'|'running'|'completed'|'failed';result:{text:string;model:string;reasoningEffort:string}|null;error:string|null;created_at:string;updated_at:string};
export async function codexConnection(ctx:APIContext){
 const staff=requireStaff(ctx);if(staff instanceof Response)throw new Error('Staff sign-in required.');
 const owner=staff.role==='owner';
 const {data,error}=await (owner?createAdminClient():createServerClient(ctx)).from('codex_runner_state').select('heartbeat_at,status,model,reasoning_effort,verified_at,message'+(owner?',auth_url':'')).eq('id','default').maybeSingle();
 if(error)throw new Error('Codex connection storage is not ready. Complete the subscription runner database setup.');
 const status=codexStatus(data as RunnerState|null);
 // Only the owner who can connect the subscription may see the authorization flow.
 if(staff.role!=='owner')status.authUrl=null;
 return status;
}
export async function enqueueCodexJob(ctx:APIContext,kind:CodexKind,payload:Record<string,unknown>):Promise<{id:string}>{
 const staff=requireStaff(ctx,kind==='connect'||kind==='verify'?'owner':undefined);if(staff instanceof Response)throw new Error('Staff authorization required.');
 const checked=jobRequest(kind,payload,staff.role),state=await codexConnection(ctx);
 if(!state.online)throw new Error(state.message);
 if(kind!=='connect'&&kind!=='verify'&&!state.ready)throw new Error('Connect your Codex subscription in Backend first.');
 const db=createAdminClient();
 const pending=await db.from('codex_jobs').select('id',{count:'exact',head:true}).eq('requested_by',staff.id).in('status',['queued','running']);
 if(pending.error)throw new Error('Codex requests could not be checked.');
 if((pending.count||0)>=4)throw new Error('Wait for your current Codex requests to finish before starting another.');
 const {data,error}=await db.from('codex_jobs').insert({requested_by:staff.id,kind,payload:checked}).select('id').single();
 if(error||!data)throw new Error('The Codex request could not be saved. Try again.');
 return{id:data.id};
}
export async function readCodexJob(ctx:APIContext,id:string):Promise<CodexJob>{
 const staff=requireStaff(ctx);if(staff instanceof Response)throw new Error('Staff sign-in required.');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))throw new Error('Choose a valid Codex request.');
 const {data,error}=await createServerClient(ctx).from('codex_jobs').select('*').eq('id',id).eq('requested_by',staff.id).maybeSingle();
 if(error||!data)throw new Error('This Codex request could not be loaded.');
 return data as CodexJob;
}
