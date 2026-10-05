// POST /api/inquiries — the contact form's script path (live mode): JSON in, JSON out, always no-store.
// The no-JavaScript path is /contact/send/. Both decide through src/lib/inquiry.ts (honeypot, demo mode,
// validation). Storage and the staff notification below are interim: task 12.1 moves them into
// inquiry.ts with Workspace SMTP and the rate limit.
// Note: the anon insert uses return=representation; RLS must allow anon SELECT of its own inserted row
// or PostgREST returns 401/empty — if the schema forbids that, switch to return=minimal and drop the notify event (PORT.md B2).
export const prerender = false;
import type { APIRoute } from 'astro';
import { db, configured, serverConfigured, json } from '../../lib/supabase';
import { INQUIRY_MODE } from '../../data/site';
import { intake, readBody, type Inquiry } from '../../lib/inquiry';

/** Returns 'sent' | 'skipped' | 'failed'. Never throws; the caller records the outcome. */
async function notify(row: Inquiry): Promise<'sent' | 'skipped' | 'failed'> {
  const key = import.meta.env.RESEND_API_KEY, to = import.meta.env.INQUIRY_NOTIFY_TO || 'hello@zincdigital.co';
  if (!key || import.meta.env.EMAIL_PROVIDER_APPROVED !== 'true') return 'skipped';
  const lines = ['Company: ' + row.company, 'Name: ' + row.name, 'Email: ' + row.email, 'Website: ' + row.website, 'Services: ' + row.services.join(', '), 'Budget: ' + row.budget, 'Timeline: ' + row.timeline, '', row.message];
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify({ from: 'ZINC Website <hello@zincdigital.co>', to: [to], reply_to: row.email, subject: 'New inquiry · ' + row.company, text: lines.join('\n') }) });
    return r.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}

/** Stores a validated inquiry and notifies staff. Shared with /contact/send/ until task 12.1. */
export async function accept(value: Inquiry): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!configured()) return { ok: false, status: 503, error: 'The inquiry service is not available right now' };
  let saved: { id?: string } | null = null;
  try { const out = (await db.insert('inquiries', { ...value, stage: 'new' }, { key: 'anon', prefer: 'return=representation' })) as { id: string }[]; saved = out?.[0] || null; } catch (e) { console.error('inquiry insert failed', e instanceof Error ? e.name : 'error'); return { ok: false, status: 502, error: 'Could not save the inquiry' }; }
  const notified = await notify(value);
  if (notified !== 'sent') {
    // The inquiry IS saved; the notification is not. Record it so the admin board can surface unnotified inquiries (inquiry_events kind='notify', payload.status). Needs the service key; skipped silently if absent.
    console.error('inquiry saved but notification ' + notified, saved?.id);
    if (saved?.id && serverConfigured()) await db.insert('inquiry_events', { inquiry_id: saved.id, kind: 'notify', payload: { status: notified } }, { key: 'service', prefer: 'return=minimal' }).catch(() => {});
  }
  return { ok: true };
}

export const POST: APIRoute = async ({ request }) => {
  const read = await readBody(request);
  if (!read.ok) return json({ error: read.error }, read.status);
  const r = intake(read.body, INQUIRY_MODE);
  if (r.kind === 'ignore') return json({ ok: true }); // honeypot or demo mode: nothing stored or sent
  if (r.kind === 'invalid') return json({ error: r.error, field: r.field }, 422);
  const out = await accept(r.value);
  return out.ok ? json({ ok: true }) : json({ error: out.error }, out.status);
};
