export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createServerClient} from '../../../lib/supabase';
import {input,reply} from '../../../lib/admin-http';
import {googleAccountEmail,savedGoogleSettings,googleSites,verifyGoogleService} from '../../../lib/google';
import {googleSettingsInput} from '../../../lib/google-settings';
export const GET:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{
  const settings=await savedGoogleSettings(createServerClient(ctx));
  const [analytics,search]=await Promise.allSettled([verifyGoogleService('ga4',settings),googleSites()]);
  const sites=search.status==='fulfilled'?search.value:[];
  return reply({settings,account:googleAccountEmail(),sites,
   ga4:{connected:analytics.status==='fulfilled',error:analytics.status==='rejected'?'Grant Viewer access to the website account, then verify GA4.':''},
   gsc:{connected:!!settings.site&&sites.includes(settings.site),error:search.status==='rejected'?'Google Search Console access could not be checked.':''}});
 }
 catch(e){return reply({error:e instanceof Error?e.message:'Google access could not be checked.'},502);}
};
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx,'owner');if(staff instanceof Response)return staff;
 try{
  const body=await input(ctx,2000),sb=createServerClient(ctx),current=await savedGoogleSettings(sb);
  if(typeof body.kind!=='string'||!['ga4','gsc'].includes(body.kind))return reply({error:'Choose Analytics or Search Console.'},422);
  const settings=googleSettingsInput({...current,...(body.kind==='ga4'?{property:body.property}:{site:body.site})});
  await verifyGoogleService(body.kind,settings);
  const saved=await sb.from('admin_cache').upsert({key:'google_connection',value:settings,fetched_at:new Date().toISOString()});
  if(saved.error)return reply({error:'Google access works, but its connection settings could not be saved.'},502);
  return reply({ok:true,kind:body.kind,checked_at:new Date().toISOString(),settings});
 }catch(e){return reply({error:e instanceof Error?e.message:'Google access could not be checked.'},502);}
};
