import {openAiApiKey} from '../../../lib/provider-keys';
export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {reply} from '../../../lib/admin-http';
import {createServerClient} from '../../../lib/supabase';
import {savedGoogleSettings,verifyGoogleService} from '../../../lib/google';
import {deployments,deploymentConfig} from '../../../lib/vercel';
import {verifyMailConnection} from '../../../lib/mail';

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
  Promise.resolve({name:'Fable High',status:import.meta.env.ZINC_ANTHROPIC_API_KEY?'configured':'unavailable',detail:'Use Test Fable High for a saved execution receipt.'} as ConnectionCheck),
  Promise.resolve({name:'Terra High',status:openAiApiKey()?'configured':'unavailable',detail:'Use Test Terra High for a saved execution receipt.'} as ConnectionCheck),
  ...(staff.role==='owner'?[connectionCheck('Workspace notifications',async()=>{await verifyMailConnection();return 'SMTP login verified. No email was sent.';})]:[Promise.resolve({name:'Workspace notifications',status:'unavailable',detail:'An owner can verify the notification connection.'} as ConnectionCheck)]),
 ]);
 const hook=deploymentConfig().hook;
 let valid=false;try{const url=new URL(hook);valid=url.origin==='https://api.vercel.com'&&url.pathname.startsWith('/v1/integrations/deploy/');}catch{}
 checks.push({name:'Publishing',status:valid?'configured':'failed',detail:valid?'Deploy hook configured. Publishing is verified when an owner publishes a draft.':'The production deploy hook is missing or invalid.'});
 return reply({checks,checkedAt:new Date().toISOString()});
};
