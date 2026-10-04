// POST /api/inquiries — the public contact form (live mode).
// Anonymous insert into public.inquiries (RLS allows anon INSERT), honeypot, optional Turnstile,
// optional Resend notification to staff. Accepts form-encoded (no-JS) and multipart/JSON (fetch).
// Form posts without `accept: application/json` get a 303 to /thanks/ so the no-JS path works.
// Note: the anon insert uses return=representation; RLS must allow anon SELECT of its own inserted row
// or PostgREST returns 401/empty — if the schema forbids that, switch to return=minimal and drop the notify event (PORT.md B2).
export const prerender = false;
import type { APIRoute } from 'astro';
import { db, configured, serverConfigured, json } from '../../lib/supabase';
import { services } from '../../data/site';

const SLUGS = new Set(services.map((s) => s.slug));
const BUDGETS = new Set(['Under $5k/mo', '$5–10k/mo', '$10–25k/mo', '$25k+/mo']);
const TIMELINES = new Set(['As soon as practical', 'Within three months', 'Three to six months', 'Exploring options']);
const clip = (v: unknown, n: number) => String(v ?? '').trim().slice(0, n);

async function parse(req: Request): Promise<Record<string, string | string[]>> {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) return (await req.json()) as Record<string, string | string[]>;
  const fd = await req.formData();
  const out: Record<string, string | string[]> = {};
  for (const [k, v] of fd.entries()) { if (typeof v !== 'string') continue; if (k === 'service') out.service = [...((out.service as string[]) || []), v]; else out[k] = v; }
  return out;
}

async function turnstileOk(token: string, ip: string | null) {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → skip (honeypot + RLS still apply)
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }) });
  return r.ok && ((await r.json()) as { success: boolean }).success === true;
}

/** Returns 'sent' | 'skipped' | 'failed'. Never throws; the caller records the outcome. */
async function notify(row: Record<string, unknown>): Promise<'sent' | 'skipped' | 'failed'> {
  const key = import.meta.env.RESEND_API_KEY, to = import.meta.env.INQUIRY_NOTIFY_TO || 'hello@zincdigital.co';
  if (!key || import.meta.env.EMAIL_PROVIDER_APPROVED !== 'true') return 'skipped';
  const lines = ['Company: ' + row.company, 'Name: ' + row.name, 'Email: ' + row.email, 'Website: ' + row.website, 'Services: ' + (row.services as string[]).join(', '), 'Budget: ' + row.budget, 'Timeline: ' + row.timeline, '', String(row.message)];
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify({ from: 'ZINC Website <hello@zincdigital.co>', to: [to], reply_to: row.email, subject: 'New inquiry · ' + row.company, text: lines.join('\n') }) });
    return r.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const fail = (error: string, status = 400) => (wantsJson ? json({ error }, status) : redirect('/contact/?error=' + encodeURIComponent(error), 303));
  if (!configured()) return fail('Inquiry endpoint is not configured', 503);
  let b: Record<string, string | string[]>;
  try { b = await parse(request); } catch { return fail('Unreadable form body'); }
  if (clip(b.company_website, 10)) return wantsJson ? json({ ok: true }) : redirect('/thanks/', 303); // honeypot: pretend success
  const servicesIn = ([] as string[]).concat((b.service as string[]) || []).filter((s) => SLUGS.has(s));
  const row = {
    name: clip(b.name, 120), company: clip(b.company, 160), email: clip(b.email, 254).toLowerCase(), website: clip(b.website, 500),
    services: servicesIn, budget: clip(b.budget, 40), timeline: clip(b.timeline, 40), message: clip(b.message, 3000),
    source_path: clip(b.source_path, 200) || '/contact/', stage: 'new',
  };
  if (!row.name || !row.company || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email) || !/^https?:\/\//.test(row.website) || !row.message) return fail('Complete the required fields with valid information');
  if (!servicesIn.length) return fail('Choose at least one service');
  if (!BUDGETS.has(row.budget) || !TIMELINES.has(row.timeline)) return fail('Choose a budget range and a timeline');
  if (!(await turnstileOk(clip(b['cf-turnstile-response'], 2048), clientAddress || null))) return fail('Verification failed, try again', 403);
  let saved: { id?: string } | null = null;
  try { const out = (await db.insert('inquiries', row, { key: 'anon', prefer: 'return=representation' })) as { id: string }[]; saved = out?.[0] || null; } catch (e) { console.error(e); return fail('Could not save the inquiry', 502); }
  const notified = await notify(row);
  if (notified !== 'sent') {
    // The inquiry IS saved; the notification is not. Record it so the admin board can surface unnotified inquiries (inquiry_events kind='notify', payload.status). Needs the service key; skipped silently if absent.
    console.error('inquiry saved but notification ' + notified, saved?.id);
    if (saved?.id && serverConfigured()) await db.insert('inquiry_events', { inquiry_id: saved.id, kind: 'notify', payload: { status: notified } }, { key: 'service', prefer: 'return=minimal' }).catch(() => {});
  }
  return wantsJson ? json({ ok: true, notified }) : redirect('/thanks/', 303);
};
