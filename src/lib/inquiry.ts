// inquiry.ts — the contact form's rules and live path, shared by POST /api/inquiries/ (script) and
// /contact/send/ (no JavaScript). Pure at load time so `node --test` imports it directly (Node 24 type
// stripping); the live dependencies are imported only inside liveDeps().

// The Design's options. tests/inquiry-validate.test.ts checks SERVICE_SLUGS against the services in site.ts.
export const SERVICE_SLUGS: readonly string[] = ['shopify', 'web-design', 'apps', 'seo', 'local-seo', 'ai-search-optimization', 'google-search-ads', 'shopping-ads', 'social-ads', 'tiktok-ads', 'business-intelligence'];
export const BUDGETS: readonly string[] = ['Under $5k/mo', '$5–10k/mo', '$10–25k/mo', '$25k+/mo'];
export const TIMELINES: readonly string[] = ['As soon as practical', 'Within three months', 'Three to six months', 'Exploring options'];
// Field length limits, matching the form's maxlength attributes.
export const LIMITS = { name: 120, company: 160, email: 254, website: 500, message: 3000, source_path: 200 } as const;
export const MAX_BODY_BYTES = 32 * 1024;
export const HONEYPOT = 'company_website';

export const MESSAGES = {
  required: 'Complete the required fields with valid information',
  service: 'Choose at least one service',
  choice: 'Choose a budget range and a timeline',
  tooLarge: 'The inquiry is too long',
  unreadable: 'The inquiry could not be read',
} as const;

export type Mode = 'demo' | 'live';
export type InquiryBody = Record<string, unknown>;
export interface Inquiry { name: string; company: string; email: string; website: string; services: string[]; budget: string; timeline: string; message: string; source_path: string }
export type Field = keyof Inquiry;
export type Validation = { ok: true; value: Inquiry } | { ok: false; field: Field; error: string };
export type Intake =
  | { kind: 'ignore'; reason: 'honeypot' | 'demo' } // answer as success, store and send nothing
  | { kind: 'invalid'; field: Field; error: string }
  | { kind: 'accept'; value: Inquiry };

const one = (v: unknown): string => (Array.isArray(v) ? one(v[0]) : typeof v === 'string' ? v.trim() : '');
const many = (v: unknown): string[] => (Array.isArray(v) ? v : v === undefined ? [] : [v]).map(one).filter(Boolean);
const httpUrl = (v: string) => { try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; } };

/** Checks every field against the Design's options and limits. Unknown fields, ids and stages are ignored. */
export function validate(body: InquiryBody): Validation {
  const v: Inquiry = {
    name: one(body.name), company: one(body.company), email: one(body.email).toLowerCase(), website: one(body.website),
    services: [...new Set(many(body.service ?? body.services))], budget: one(body.budget), timeline: one(body.timeline),
    message: one(body.message), source_path: one(body.source_path) || '/contact/',
  };
  const bad = (field: Field, error: string): Validation => ({ ok: false, field, error });
  for (const f of ['name', 'company', 'email', 'website'] as const) if (!v[f] || v[f].length > LIMITS[f]) return bad(f, MESSAGES.required);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email)) return bad('email', MESSAGES.required);
  if (!httpUrl(v.website)) return bad('website', MESSAGES.required);
  if (!v.services.length || v.services.some((s) => !SERVICE_SLUGS.includes(s))) return bad('services', MESSAGES.service);
  if (!BUDGETS.includes(v.budget)) return bad('budget', MESSAGES.choice);
  if (!TIMELINES.includes(v.timeline)) return bad('timeline', MESSAGES.choice);
  if (!v.message || v.message.length > LIMITS.message) return bad('message', MESSAGES.required);
  if (v.source_path.length > LIMITS.source_path || !v.source_path.startsWith('/')) v.source_path = '/contact/';
  return { ok: true, value: v };
}

/** The submitted values, trimmed and clipped, for re-rendering the form after a rejected no-JS post. */
export function formValues(body: InquiryBody): Partial<Inquiry> {
  return {
    name: one(body.name).slice(0, LIMITS.name), company: one(body.company).slice(0, LIMITS.company), email: one(body.email).slice(0, LIMITS.email),
    website: one(body.website).slice(0, LIMITS.website), services: many(body.service).filter((s) => SERVICE_SLUGS.includes(s)),
    budget: one(body.budget), timeline: one(body.timeline), message: one(body.message).slice(0, LIMITS.message),
  };
}

/** The first decision for every submission: a filled honeypot or demo mode sends nothing; otherwise validate. */
export function intake(body: InquiryBody, mode: Mode): Intake {
  if (one(body[HONEYPOT])) return { kind: 'ignore', reason: 'honeypot' };
  if (mode !== 'live') return { kind: 'ignore', reason: 'demo' };
  const r = validate(body);
  return r.ok ? { kind: 'accept', value: r.value } : { kind: 'invalid', field: r.field, error: r.error };
}

/** Reads a JSON, urlencoded or multipart body of at most MAX_BODY_BYTES. Repeated keys become arrays. */
export async function readBody(request: Request): Promise<{ ok: true; body: InquiryBody } | { ok: false; status: 400 | 413; error: string }> {
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY_BYTES) return { ok: false, status: 413, error: MESSAGES.tooLarge };
  const buf = await request.arrayBuffer().catch(() => null);
  if (!buf) return { ok: false, status: 400, error: MESSAGES.unreadable };
  if (buf.byteLength > MAX_BODY_BYTES) return { ok: false, status: 413, error: MESSAGES.tooLarge };
  const type = request.headers.get('content-type') || '';
  try {
    if (type.includes('application/json')) {
      const parsed: unknown = JSON.parse(new TextDecoder().decode(buf));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
      return { ok: true, body: parsed as InquiryBody };
    }
    const fd = await new Response(buf, { headers: { 'content-type': type } }).formData();
    const body: InquiryBody = {};
    for (const [k, val] of fd.entries()) {
      if (typeof val !== 'string') continue;
      const prev = body[k];
      body[k] = prev === undefined ? val : ([] as unknown[]).concat(prev, val);
    }
    return { ok: true, body };
  } catch { return { ok: false, status: 400, error: MESSAGES.unreadable }; }
}

// ---- Live contact path (design section 5, task 12.1). Every outside effect comes in through Deps, so the
// node tests drive each branch with fakes; liveDeps() wires the secret-key Supabase client, Workspace SMTP
// and the clock. Logs carry only the inquiry id and an error class.

export const RATE = { shortMs: 10 * 60 * 1000, short: 5, dayMs: 24 * 60 * 60 * 1000, day: 20 } as const;
export const NOTIFY_TIMEOUT_MS = 8000;
export const DEFAULT_NOTIFY_TO = 'jaymie@zincdigital.co';
export type NotifyStatus = 'pending' | 'sent' | 'failed';
export type MailErrorClass = 'auth' | 'timeout' | 'rejected' | 'network';
export interface Mail { to: string; replyTo: string; subject: string; text: string }
export interface Deps {
  now(): number;
  /** HMAC-SHA256(INQUIRY_HASH_SALT, clientAddress). */
  hash(clientAddress: string): string;
  /** created_at of this client's inquiries since the given time. */
  recent(clientHash: string, sinceIso: string): Promise<string[]>;
  insert(row: Record<string, unknown>): Promise<{ id: string }>;
  send(mail: Mail): Promise<void>;
  update(id: string, patch: Record<string, unknown>): Promise<void>;
  notifyTo: string;
}
export type Submit =
  | { kind: 'saved'; id: string; notified: NotifyStatus }
  | { kind: 'rate'; retryAfter: number }
  | { kind: 'error'; status: 502; error: string };

export const SUBMIT_MESSAGES = {
  origin: 'The inquiry could not be accepted from this page',
  rate: 'Too many inquiries from this connection. Try again later',
  unavailable: 'The inquiry service is not available right now',
  failed: 'The inquiry could not be saved. Try again',
} as const;

/** Origin (or Referer) must be the site origin, or the request's own host on a *.vercel.app preview. */
export function originAllowed(request: Request, siteOrigin: string): boolean {
  let from: URL;
  try { from = new URL(request.headers.get('origin') || request.headers.get('referer') || ''); } catch { return false; }
  try { if (from.origin === new URL(siteOrigin).origin) return true; } catch { /* fall through */ }
  const own = new URL(request.url);
  return own.hostname.endsWith('.vercel.app') && from.origin === own.origin;
}

export function inquiryMail(v: Inquiry, to: string): Mail {
  const text = [
    'Company: ' + v.company, 'Name: ' + v.name, 'Email: ' + v.email, 'Website: ' + v.website,
    'Services: ' + v.services.join(', '), 'Budget: ' + v.budget, 'Timeline: ' + v.timeline, 'Page: ' + v.source_path,
    '', v.message,
  ].join('\n');
  return { to, replyTo: v.email, subject: 'New inquiry · ' + v.company, text };
}

/** Maps a mail failure to the class stored in notify_error. */
export function mailErrorClass(e: unknown): MailErrorClass {
  const x = (e && typeof e === 'object' ? e : {}) as { code?: string; responseCode?: number };
  if (x.code === 'EAUTH') return 'auth';
  if (x.code === 'ETIMEDOUT' || x.code === 'ETIMEOUT') return 'timeout';
  if (x.code === 'EENVELOPE' || x.code === 'EMESSAGE' || (typeof x.responseCode === 'number' && x.responseCode >= 500)) return 'rejected';
  return 'network';
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const t = new Promise<never>((_, reject) => { timer = setTimeout(() => reject(Object.assign(new Error('mail timeout'), { code: 'ETIMEDOUT' })), ms); });
  return Promise.race([p, t]).finally(() => clearTimeout(timer));
}

/** Sends the staff notification (at most NOTIFY_TIMEOUT_MS) and records the outcome on the inquiry. Never throws. */
export async function notify(id: string, v: Inquiry, deps: Pick<Deps, 'send' | 'update' | 'notifyTo' | 'now'>, attempts: number): Promise<NotifyStatus> {
  let status: NotifyStatus = 'sent';
  let error: MailErrorClass | null = null;
  try { await withTimeout(deps.send(inquiryMail(v, deps.notifyTo)), NOTIFY_TIMEOUT_MS); }
  catch (e) { status = 'failed'; error = mailErrorClass(e); console.warn('inquiry ' + id + ' notification failed: ' + error); }
  const patch: Record<string, unknown> = { notify_status: status, notify_error: error, notify_attempts: attempts + 1 };
  if (status === 'sent') patch.notified_at = new Date(deps.now()).toISOString();
  try { await deps.update(id, patch); } catch { console.warn('inquiry ' + id + ' notification status not recorded'); }
  return status;
}

/** Rate limit, then insert (notify_status pending), then notify. A failed insert sends no email. */
export async function submit(v: Inquiry, clientAddress: string, deps: Deps): Promise<Submit> {
  const clientHash = deps.hash(clientAddress);
  const now = deps.now();
  let times: number[];
  try { times = (await deps.recent(clientHash, new Date(now - RATE.dayMs).toISOString())).map(Date.parse).filter(Number.isFinite); }
  catch { console.warn('inquiry rate check failed: database'); return { kind: 'error', status: 502, error: SUBMIT_MESSAGES.failed }; }
  const short = times.filter((t) => now - t < RATE.shortMs);
  if (short.length >= RATE.short) return { kind: 'rate', retryAfter: Math.max(1, Math.ceil((Math.min(...short) + RATE.shortMs - now) / 1000)) };
  if (times.length >= RATE.day) return { kind: 'rate', retryAfter: Math.max(1, Math.ceil((Math.min(...times) + RATE.dayMs - now) / 1000)) };
  let id: string;
  try { ({ id } = await deps.insert({ ...v, stage: 'new', client_hash: clientHash })); }
  catch { console.warn('inquiry insert failed: database'); return { kind: 'error', status: 502, error: SUBMIT_MESSAGES.failed }; }
  return { kind: 'saved', id, notified: await notify(id, v, deps, 0) };
}

/** Staff re-send of a notification (POST /api/admin/notify/). Returns null when the inquiry does not exist. */
export async function renotify(
  id: string,
  deps: Pick<Deps, 'send' | 'update' | 'notifyTo' | 'now'> & { get(id: string): Promise<(Inquiry & { notify_attempts?: number | null }) | null> },
): Promise<NotifyStatus | null> {
  const row = await deps.get(id);
  if (!row) return null;
  return notify(id, row, deps, row.notify_attempts || 0);
}

export type Outcome =
  | { kind: 'ok' } // saved, or a honeypot or demo-mode post that stores and sends nothing
  | { kind: 'reject'; status: 400 | 403 | 413 | 422 | 429 | 502 | 503; error: string; field?: Field; values?: Partial<Inquiry>; retryAfter?: number };

/** Every contact submission, from either route: size, honeypot and demo mode, origin, validation, then submit(). */
export async function handle(request: Request, clientAddress: string, opts: { mode: Mode; siteOrigin: string; deps: () => Promise<Deps | null> }): Promise<Outcome> {
  const read = await readBody(request);
  if (!read.ok) return { kind: 'reject', status: read.status, error: read.error };
  const r = intake(read.body, opts.mode);
  if (r.kind === 'ignore') return { kind: 'ok' };
  const values = formValues(read.body);
  if (!originAllowed(request, opts.siteOrigin)) return { kind: 'reject', status: 403, error: SUBMIT_MESSAGES.origin, values };
  if (r.kind === 'invalid') return { kind: 'reject', status: 422, error: r.error, field: r.field, values };
  const deps = await opts.deps();
  if (!deps) return { kind: 'reject', status: 503, error: SUBMIT_MESSAGES.unavailable, values };
  const out = await submit(r.value, clientAddress, deps);
  if (out.kind === 'rate') return { kind: 'reject', status: 429, error: SUBMIT_MESSAGES.rate, retryAfter: out.retryAfter, values };
  if (out.kind === 'error') return { kind: 'reject', status: out.status, error: out.error, values };
  return { kind: 'ok' }; // the visitor sees success whether or not the notification went out (R6.5)
}

const rejectHeaders = (o: Extract<Outcome, { kind: 'reject' }>): Record<string, string> => (o.retryAfter ? { 'retry-after': String(o.retryAfter) } : {});

/** POST /api/inquiries/ answers in JSON, never cached. */
export function jsonAnswer(o: Outcome): Response {
  const headers = { 'content-type': 'application/json', 'cache-control': 'no-store', ...(o.kind === 'reject' ? rejectHeaders(o) : {}) };
  if (o.kind === 'ok') return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  return new Response(JSON.stringify(o.field ? { error: o.error, field: o.field } : { error: o.error }), { status: o.status, headers });
}

/** /contact/send/ answers with a 303 to /thanks/, or the status, headers and form state for re-rendering the contact page. */
export function formAnswer(o: Outcome): { redirect: '/thanks/' } | { status: number; headers: Record<string, string>; form: { values?: Partial<Inquiry>; error: string } } {
  if (o.kind === 'ok') return { redirect: '/thanks/' };
  return { status: o.status, headers: rejectHeaders(o), form: { values: o.values, error: o.error } };
}

/** The production dependencies. Loaded lazily so this module stays importable by the node tests. */
export async function liveDeps(): Promise<Deps | null> {
  const [{ createAdminClient }, { env, isConfigured }, { sendMail }, { createHmac }] = await Promise.all([import('./supabase'), import('./env'), import('./mail'), import('node:crypto')]);
  if (!isConfigured('admin') || !env.inquiryHashSalt()) return null;
  const sb = createAdminClient();
  const salt = env.inquiryHashSalt();
  return {
    now: () => Date.now(),
    hash: (addr) => createHmac('sha256', salt).update(addr).digest('hex'),
    recent: async (hash, since) => {
      const { data, error } = await sb.from('inquiries').select('created_at').eq('client_hash', hash).gte('created_at', since);
      if (error) throw error;
      return (data || []).map((r: { created_at: string }) => r.created_at);
    },
    insert: async (row) => {
      const { data, error } = await sb.from('inquiries').insert(row).select('id').single();
      if (error || !data) throw error || new Error('no row');
      return { id: (data as { id: string }).id };
    },
    send: sendMail,
    update: async (id, patch) => { const { error } = await sb.from('inquiries').update(patch).eq('id', id); if (error) throw error; },
    notifyTo: env.smtp().to || DEFAULT_NOTIFY_TO,
  };
}
