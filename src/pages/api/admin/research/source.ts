export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {reply,fail} from '../../../../lib/admin-http';
import {uuid} from '../../../../lib/admin-input';
export const GET:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 const id=ctx.url.searchParams.get('id');if(!uuid(id))return fail('Select a source.');
 const sb=createServerClient(ctx),{data,error}=await sb.schema('research').from('documents').select('id,title,kind,status,content,meta,source_url,project_id').eq('id',id).maybeSingle();
 if(error)return reply({error:'The source could not be loaded.'},502);if(!data)return reply({error:'Source not found.'},404);
 let download:string|null=null;
 if(data.kind==='file'&&typeof data.meta?.path==='string'&&data.meta.path.startsWith(data.project_id+'/')){
  const signed=await sb.storage.from('research').createSignedUrl(data.meta.path,60,{download:true});if(!signed.error)download=signed.data.signedUrl;
 }
 return reply({source:data,download});
};
