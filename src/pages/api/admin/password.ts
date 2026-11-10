// POST /api/admin/password/ — a signed-in staff member sets or changes their own password. The session
// client makes the change, so it can only ever apply to the caller's own account.
export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {createServerClient} from '../../../lib/supabase';
import {input,reply,fail} from '../../../lib/admin-http';
import {passwordProblem} from '../../../lib/signin';
export const POST: APIRoute=async ctx=>{
  const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
  try{
    const body=await input(ctx,2000);
    const problem=passwordProblem(body.password,staff.email);
    if(problem)return fail(problem);
    if(body.password!==body.confirm)return fail('The two passwords do not match.');
    const sb=createServerClient(ctx);
    const {error}=await sb.auth.updateUser({password:body.password as string});
    if(error){
      console.warn('password not saved:',error.status||error.name,error.code||'');
      if(error.code==='same_password')return fail('That is already your password.');
      if(error.code==='weak_password')return fail('That password is too easy to guess. Choose a longer or less common one.');
      if(error.code==='reauthentication_needed')return fail('Sign out, sign in again with an emailed link, then set the password straight away.');
      return reply({error:'The password could not be saved. Try again.'},502);
    }
    // A new password ends every other session for this account; this one stays signed in.
    const others=await sb.auth.signOut({scope:"others"});
    if(others.error)console.warn("other sessions not ended:",others.error.status||others.error.name);
    return reply({ok:true});
  }catch(e){return fail(e instanceof Error?e.message:undefined);}
};
