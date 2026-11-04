export const prerender = false;
import type { APIRoute } from 'astro';
import { requireStaff } from '../../../lib/auth';
import { createServerClient } from '../../../lib/supabase';
import { input, reply, fail } from '../../../lib/admin-http';
import { inquiryInput, uuid } from '../../../lib/admin-input';
export const POST: APIRoute = async ctx => {
  const staff = requireStaff(ctx); if (staff instanceof Response) return staff;
  try {
    const body = await input(ctx); if (!uuid(body.id)) return fail('Choose a valid inquiry.');
    if(typeof body.updated_at!=='string')return fail('Refresh this inquiry before saving.');
    const patch = inquiryInput(body);
    const { data, error } = await createServerClient(ctx).from('inquiries').update(patch).eq('id',body.id).eq('updated_at',body.updated_at).select('id,updated_at').maybeSingle();
    if (error) return reply({ error:'The inquiry could not be saved. Try again.' },502);
    if (!data) return reply({error:'This inquiry changed. Refresh before saving so another staff member’s work is preserved.'},409);
    return reply({ok:true,updated_at:data.updated_at});
  } catch (e) { return fail(e instanceof Error ? e.message : undefined); }
};
