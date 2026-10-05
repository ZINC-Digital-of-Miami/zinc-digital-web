// inquiry.ts — contact-form rules shared by POST /api/inquiries (script) and /contact/send/ (no JavaScript).
// Pure and dependency-free so `node --test` loads it directly (Node 24 type stripping). Storage, the rate
// limit and the staff notification join it with the live contact path (task 12.1).

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
