export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createAdminClient} from '../../../lib/supabase';
import {input,reply,fail} from '../../../lib/admin-http';
import {deploymentConfig,triggerBuild} from '../../../lib/vercel';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx,'owner');if(staff instanceof Response)return staff;
 try{
  const body=await input(ctx);if(body.confirm!==true)return fail('Confirm publishing first.');
  if(!deploymentConfig().hook)return reply({error:'Connect the deploy hook for main before publishing.'},503);
  const sb=createAdminClient();const snapshot=await sb.rpc('publish_all',{p_actor:staff.id});
  if(snapshot.error)return reply({error:'Drafts could not be prepared for publishing. The live site is unchanged.'},502);
  const marker=await sb.from('admin_cache').select('value').eq('key','last_publish').single();
  const at=marker.data?.value?.at;
  if(marker.error||typeof at!=='string'||!Number.isFinite(Date.parse(at)))return reply({error:'The snapshot was prepared, but its publish time could not be read. A build has not been started.'},502);
  try{
    const job=await triggerBuild();const saved=await sb.from('admin_cache').update({value:{actor:staff.id,at,count:snapshot.data,status:'building',job:job.id}}).eq('key','last_publish');
    if(saved.error)return reply({error:'The build started, but its status could not be recorded. Check Vercel before trying again.'},502);
    return reply({ok:true,count:snapshot.data,job});
  }catch(e){await sb.from('admin_cache').update({value:{actor:staff.id,at,count:snapshot.data,status:'failed'}}).eq('key','last_publish');throw e;}
 }catch(e){return reply({error:e instanceof Error?e.message:'Publishing could not be started.'},502);}
};
