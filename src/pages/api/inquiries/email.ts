// POST /api/inquiries/email — staff sends an email to an inquiry from the admin board via Resend,
// logs an inquiry_event. Falls back to 503 when RESEND_API_KEY is absent (the adapter then uses mailto:).
export const prerender = false;
import type { APIRoute } from 'astro';
import { db, json, serverConfigured } from '../../../lib/supabase';
import { requireStaff } from '../../../lib/auth';

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  const staff = requireStaff(ctx);
  if (staff instanceof Response) return staff;
  if (!serverConfigured()) return json({ error: 'server supabase not configured' }, 503);
  const key = import.meta.env.RESEND_API_KEY;
  if (!key || import.meta.env.EMAIL_PROVIDER_APPROVED !== 'true') return json({ error: 'email provider not configured/approved; use mailto' }, 503);
  const { inquiry_id, subject, body } = (await request.json()) as { inquiry_id: string; subject: string; body: string };
  if (!inquiry_id || !subject || !body) return json({ error: 'inquiry_id, subject, body required' }, 400);
  const [inq] = (await db.select('inquiries?id=eq.' + encodeURIComponent(inquiry_id) + '&select=id,email,company', { key: 'service' })) as { id: string; email: string; company: string }[];
  if (!inq) return json({ error: 'inquiry not found' }, 404);
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify({ from: 'ZINC Digital <hello@zincdigital.co>', to: [inq.email], reply_to: staff.email, subject, text: body }) });
  if (!r.ok) return json({ error: 'resend ' + r.status }, 502);
  await db.insert('inquiry_events', { inquiry_id, kind: 'email', payload: { subject, by: staff.email } }, { key: 'service', prefer: 'return=minimal' });
  return json({ ok: true });
};
