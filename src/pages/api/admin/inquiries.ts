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
    const patch = inquiryInput(body);
    const { data, error } = await createServerClient(ctx).from('inquiries').update(patch).eq('id',body.id).select('id').maybeSingle();
    if (error) return reply({ error:'The inquiry could not be saved. Try again.' },502);
    if (!data) return reply({error:'Inquiry not found.'},404);
    return reply({ok:true});
  } catch (e) { return fail(e instanceof Error ? e.message : undefined); }
};
