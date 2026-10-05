export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createServerClient} from '../../../lib/supabase';
import {reply} from '../../../lib/admin-http';
import {metrics,indexed,googleConfig} from '../../../lib/google';
export const GET:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 if(!googleConfig().account)return reply({error:'Connect a Google service account to load Analytics and Search Console.'},503);
 const sb=createServerClient(ctx),key=ctx.url.searchParams.get('kind')==='indexed'?'google_indexed':'google_metrics';
 try{
  const cached=await sb.from('admin_cache').select('value,fetched_at').eq('key',key).maybeSingle();
  if(cached.error)return reply({error:'Metrics cache is unavailable. Apply the admin migration first.'},503);
  const ttl=key==='google_indexed'?86400000:21600000;
  if(cached.data&&Date.now()-new Date(cached.data.fetched_at).getTime()<ttl)return reply({...cached.data.value,fetched_at:cached.data.fetched_at});
  const value=key==='google_indexed'?await indexed():await metrics(),fetched_at=new Date().toISOString();
  const saved=await sb.from('admin_cache').upsert({key,value,fetched_at});
  if(saved.error)return reply({error:'Google data loaded, but its cache could not be saved.'},502);
  return reply({...value,fetched_at});
 }catch(e){return reply({error:e instanceof Error?e.message:'Metrics could not be loaded.'},502);}
};
