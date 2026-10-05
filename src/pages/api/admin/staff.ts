export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createServerClient,createAdminClient} from '../../../lib/supabase';
import {input,reply,fail} from '../../../lib/admin-http';
import {uuid} from '../../../lib/admin-input';
import {isStaffAddress} from '../../../lib/signin';
export const GET: APIRoute=async ctx=>{
  const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
  const {data,error}=await createServerClient(ctx).from('staff').select('*').order('created_at');
  if(error)return reply({error:'Staff could not be loaded.'},502);
  if(staff.role!=='owner')return reply({staff:data});
  const admin=createAdminClient();
  const members=await Promise.all((data||[]).map(async row=>{
    const user=await admin.auth.admin.getUserById(row.user_id);
    return {...row,confirmed:!!user.data.user?.email_confirmed_at,last_sign_in_at:user.data.user?.last_sign_in_at||null};
  }));
  return reply({staff:members});
};
export const POST: APIRoute=async ctx=>{
  const actor=requireStaff(ctx,'owner');if(actor instanceof Response)return actor;
  try{
    const body=await input(ctx),admin=createAdminClient();
    if(body.action==='invite'){
      const email=String(body.email||'').trim().toLowerCase(), name=String(body.name||'').trim(), role=body.role==='owner'?'owner':'editor';
      if(!isStaffAddress(email)||email.length>254||name.length>100)return fail('Use a ZINC work email and a name up to 100 characters.');
      const prior=await admin.from('staff').select('user_id').eq('email',email).maybeSingle();
      if(prior.error)return reply({error:'Staff could not be checked.'},502);
      if(prior.data)return fail('This person is already on the staff list.');
      const invited=await admin.auth.admin.inviteUserByEmail(email,{redirectTo:ctx.url.origin+'/admin/auth/confirm/',data:{name}});
      if(invited.error||!invited.data.user)return reply({error:'The invitation could not be sent. Check the mail connection.'},502);
      const saved=await admin.from('staff').insert({user_id:invited.data.user.id,email,name,role});
      if(saved.error){await admin.auth.admin.deleteUser(invited.data.user.id);return reply({error:'The invitation could not be completed.'},502);}
      return reply({ok:true});
    }
    if(!uuid(body.id))return fail('Choose a valid staff member.');
    const member=await admin.from('staff').select('*').eq('user_id',body.id).maybeSingle();
    if(member.error)return reply({error:'Staff could not be loaded.'},502);
    if(!member.data)return reply({error:'Staff member not found.'},404);
    if(body.action==='role'){
      if(!['owner','editor'].includes(String(body.role)))return fail('Choose a valid role.');
      const result=await admin.from('staff').update({role:body.role}).eq('user_id',body.id);
      if(result.error)return fail('Keep at least one owner. The role change could not be saved.');
    }else if(['resend','revoke','offboard'].includes(String(body.action))){
      const user=await admin.auth.admin.getUserById(body.id);
      if(user.error)return reply({error:'The account could not be loaded.'},502);
      const confirmed=!!user.data.user.email_confirmed_at;
      if(body.action==='resend'){
        if(confirmed)return fail('This invitation has already been accepted. Use sign-in to request a new link.');
        const resent=await admin.auth.admin.inviteUserByEmail(member.data.email,{redirectTo:ctx.url.origin+'/admin/auth/confirm/'});
        if(resent.error)return reply({error:'The invitation could not be resent.'},502);
      }else{
        if(body.confirm!==true)return fail('Confirm removal first.');
        if(body.action==='revoke'&&confirmed)return fail('This person has accepted. Use Offboard instead.');
        const removed=await admin.from('staff').delete().eq('user_id',body.id);
        if(removed.error)return fail('Keep at least one owner. The staff member could not be removed.');
        const deleted=await admin.auth.admin.deleteUser(body.id);
        if(deleted.error)return reply({error:'Admin access was removed, but the account could not be deleted. Contact the owner to finish removal.'},502);
      }
    }else return fail('Choose a valid staff action.');
    return reply({ok:true});
  }catch(e){return fail(e instanceof Error?e.message:undefined);}
};
