export const prerender=false;
import type {APIRoute} from 'astro';
import {randomUUID} from 'node:crypto';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {input,reply,fail} from '../../../../lib/admin-http';
import {uuid} from '../../../../lib/admin-input';
import {fileInput} from '../../../../lib/research/text';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{const body=await input(ctx,4000);if(!uuid(body.project_id))return fail('Choose a project.');
  const file=fileInput(body.name,body.size,body.type),sb=createServerClient(ctx);
  const project=await sb.schema('research').from('projects').select('id').eq('id',body.project_id).maybeSingle();
  if(project.error||!project.data)return fail('This project is unavailable.');
  const path=body.project_id+'/'+randomUUID()+'-'+file.name;
  const {data,error}=await sb.storage.from('research').createSignedUploadUrl(path);
  if(error)return reply({error:'The private upload could not be prepared.'},502);
  return reply({ok:true,path,url:data.signedUrl,type:file.type});
 }catch(e){return fail((e as Error).message);}
};
