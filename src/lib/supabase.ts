// Server-side Supabase access without the SDK: PostgREST + GoTrue over fetch.
// Service-role key never leaves the server. Every helper throws on non-2xx.
const URL_ = () => (import.meta.env.SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SERVICE = () => import.meta.env.SUPABASE_SERVICE_ROLE || '';
const ANON = () => import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';
export const STAFF_DOMAINS = ['zincdigital.co', 'zincmiami.com'];
export const configured = () => !!URL_() && !!ANON();
export const serverConfigured = () => !!URL_() && !!SERVICE();

type Opts = { schema?: string; key?: 'anon' | 'service'; prefer?: string; jwt?: string };
async function rest(method: string, path: string, body?: unknown, o: Opts = {}) {
  const key = o.key === 'service' ? SERVICE() : ANON();
  const headers: Record<string, string> = { apikey: key, authorization: 'Bearer ' + (o.jwt || key), 'content-type': 'application/json' };
  if (o.schema) { headers[method === 'GET' ? 'accept-profile' : 'content-profile'] = o.schema; }
  if (o.prefer) headers.prefer = o.prefer;
  const r = await fetch(URL_() + '/rest/v1/' + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!r.ok) throw new Error('supabase ' + method + ' ' + path + ' → ' + r.status + ' ' + (await r.text()).slice(0, 300));
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}
export const db = {
  select: (path: string, o?: Opts) => rest('GET', path, undefined, o),
  insert: (table: string, row: unknown, o?: Opts) => rest('POST', table, row, { prefer: 'return=representation', ...o }),
  update: (path: string, patch: unknown, o?: Opts) => rest('PATCH', path, patch, { prefer: 'return=representation', ...o }),
  rpc: (fn: string, args: unknown, o?: Opts) => rest('POST', 'rpc/' + fn, args, o),
};

// --- auth ---
export type StaffUser = { id: string; email: string };
export function readToken(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const m = /(?:^|;\s*)zinc-staff=([^;]+)/.exec(req.headers.get('cookie') || '');
  return m ? decodeURIComponent(m[1]) : null;
}
/** Name of the PostgREST-exposed RPC that returns boolean staff membership for the current JWT. */
export const STAFF_RPC = import.meta.env.STAFF_RPC || 'is_staff';
/**
 * Resolves the staff user for a request or null. Access requires ALL of:
 * valid Supabase session, allowed email domain, AND an explicit `true` from the staff RPC
 * evaluated under the caller's JWT. RPC errors, missing RPC, null or any non-boolean deny.
 * The RPC must be exposed to PostgREST (e.g. `public.is_staff()` wrapping `private.is_staff()`); see PORT.md D2.
 */
export async function staffFromRequest(req: Request): Promise<StaffUser | null> {
  const jwt = readToken(req);
  if (!jwt || !URL_() || !ANON()) return null;
  let u: { id?: string; email?: string };
  try { const r = await fetch(URL_() + '/auth/v1/user', { headers: { apikey: ANON(), authorization: 'Bearer ' + jwt } }); if (!r.ok) return null; u = (await r.json()) as typeof u; } catch { return null; }
  const email = (u.email || '').toLowerCase();
  if (!u.id || !STAFF_DOMAINS.some((d) => email.endsWith('@' + d))) return null;
  let ok: unknown;
  try { ok = await db.rpc(STAFF_RPC, {}, { jwt }); } catch (e) { console.warn('staff rpc failed:', (e as Error).message); return null; }
  if (ok !== true) return null;
  return { id: u.id, email };
}
export const unauthorized = () => new Response(JSON.stringify({ error: 'staff session required' }), { status: 401, headers: { 'content-type': 'application/json' } });
export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });
