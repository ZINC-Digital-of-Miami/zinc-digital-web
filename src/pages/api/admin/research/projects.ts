export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {input,reply,fail} from '../../../../lib/admin-http';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{const body=await input(ctx,4000);
  if(typeof body.name!=='string'||!body.name.trim()||body.name.length>120||typeof body.client!=='string'||body.client.length>120)throw new Error('Give the project a name up to 120 characters.');
  const result=await createServerClient(ctx).schema('research').from('projects').insert({name:body.name.trim(),client:body.client.trim(),created_by:staff.id}).select('id').single();
  if(result.error)return reply({error:'The project could not be saved.'},502);return reply({ok:true,project_id:result.data.id});
 }catch(e){return fail((e as Error).message);}
};
