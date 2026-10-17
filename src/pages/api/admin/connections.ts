export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {reply} from '../../../lib/admin-http';
import {createServerClient} from '../../../lib/supabase';
import {savedGoogleSettings,verifyGoogleService} from '../../../lib/google';
import {deployments,deploymentConfig} from '../../../lib/vercel';
import {verifyMailConnection} from '../../../lib/mail';
import {codexConnection} from '../../../lib/codex-jobs';
import {connectionCheck,type ConnectionCheck} from '../../../lib/connection-checks';
export const GET:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 const db=createServerClient(ctx),settings=savedGoogleSettings(db);
 // Observe the shared promise immediately even if either provider check fails early.
 const config=settings.then(value=>({value,error:null})).catch(()=>({value:null,error:'Google connection settings could not be loaded.'}));
 const checks=await Promise.all([
  connectionCheck('Supabase and staff access',async()=>{const r=await db.from('staff').select('user_id').limit(1);if(r.error)throw new Error('Staff data could not be read. Check Supabase and staff permissions.');return 'Authenticated staff read verified.';}),
  ...(['ga4','gsc'] as const).map(kind=>connectionCheck(kind==='ga4'?'Google Analytics':'Search Console',async()=>{const c=await config;if(!c.value)throw new Error(c.error!);await verifyGoogleService(kind,c.value);return 'Selected property access verified.';})),
  connectionCheck('Vercel deployment reporting',async()=>{await deployments();return 'Production deployment access verified.';}),
  connectionCheck('Codex subscription',async()=>{const state=await codexConnection(ctx);if(!state.ready)throw new Error(state.message);return 'GPT-6.1 Sol · Medium · completed request verified.';}),
  ...(staff.role==='owner'?[connectionCheck('Workspace notifications',async()=>{await verifyMailConnection();return 'SMTP login verified. No email was sent.';})]:[Promise.resolve({name:'Workspace notifications',status:'unavailable',detail:'An owner can verify the notification connection.'} as ConnectionCheck)]),
 ]);
 const hook=deploymentConfig().hook;
 let valid=false;try{const url=new URL(hook);valid=url.origin==='https://api.vercel.com'&&url.pathname.startsWith('/v1/integrations/deploy/');}catch{}
 checks.push({name:'Publishing',status:valid?'configured':'failed',detail:valid?'Deploy hook configured. Publishing is verified when an owner publishes a draft.':'The production deploy hook is missing or invalid.'});
 return reply({checks,checkedAt:new Date().toISOString()});
};
