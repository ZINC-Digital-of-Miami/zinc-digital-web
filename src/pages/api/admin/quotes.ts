export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createServerClient} from '../../../lib/supabase';
import {input,reply,fail} from '../../../lib/admin-http';
import {uuid} from '../../../lib/admin-input';
import {quoteInput} from '../../../lib/crm-model';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{
  const body=await input(ctx,12000);if(!uuid(body.inquiry_id))return fail('Choose an inquiry.');
  const patch=quoteInput(body),db=createServerClient(ctx);
  if(body.create===true){if(!uuid(body.id))return fail('Refresh the quote form.');
   const r=await db.from('crm_quotes').insert({...patch,id:body.id,inquiry_id:body.inquiry_id}).select('id').single();
   if(r.error)return reply({error:'The quote could not be created. Refresh to check whether it was already saved.'},409);
   return reply({ok:true,id:r.data.id});
  }
  if(!uuid(body.id)||typeof body.updated_at!=='string')return fail('Refresh the quote before editing.');
  const r=await db.from('crm_quotes').update(patch).eq('id',body.id).eq('inquiry_id',body.inquiry_id).eq('updated_at',body.updated_at).is('invoice_request',null).select('id,updated_at').maybeSingle();
  if(r.error)return reply({error:'The quote could not be saved.'},502);
  if(!r.data)return reply({error:'This quote changed or invoice creation has started. Refresh before continuing; create a new quote for revised terms.'},409);
  return reply({ok:true,...r.data});
 }catch(e){return fail(e instanceof Error?e.message:undefined);}
};
