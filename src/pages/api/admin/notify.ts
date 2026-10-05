// POST /api/admin/notify/ — staff re-send of an inquiry's notification (design section 5, task 12.2). Reads
// and updates the inquiry through the staff session (RLS applies), reuses notify(), and increments
// notify_attempts. Body: {"id": "<inquiry uuid>"}.
export const prerender = false;
import type { APIRoute } from 'astro';
import { createServerClient, json } from '../../../lib/supabase';
import { requireStaff } from '../../../lib/auth';
import { env } from '../../../lib/env';
import { sendMail } from '../../../lib/mail';
import { renotify, DEFAULT_NOTIFY_TO, type Inquiry } from '../../../lib/inquiry';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const POST: APIRoute = async (ctx) => {
  const staff = requireStaff(ctx);
  if (staff instanceof Response) return staff;
  const body = (await ctx.request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === 'string' ? body.id : '';
  if (!UUID.test(id)) return json({ error: 'a valid inquiry id is required' }, 400);
  const sb = createServerClient(ctx);
  const status = await renotify(id, {
    now: () => Date.now(),
    notifyTo: env.smtp().to || DEFAULT_NOTIFY_TO,
    send: sendMail,
    get: async (key) => {
      const { data, error } = await sb.from('inquiries').select('name,company,email,website,services,budget,timeline,message,source_path,notify_attempts').eq('id', key).maybeSingle();
      if (error) throw error;
      return data as (Inquiry & { notify_attempts: number | null }) | null;
    },
    update: async (key, patch) => { const { error } = await sb.from('inquiries').update(patch).eq('id', key); if (error) throw error; },
  }).catch(() => undefined);
  if (status === undefined) return json({ error: 'the inquiry could not be read' }, 502);
  if (status === null) return json({ error: 'inquiry not found' }, 404);
  return json({ ok: true, notify_status: status });
};
