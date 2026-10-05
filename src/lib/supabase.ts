// Supabase access (design section 6.3). createServerClient carries the staff session in HttpOnly cookies, so
// RLS applies to staff reads and writes. createAdminClient uses the secret key; only the modules named in
// design section 6.3.5 may import it (tests/private-routes.test.ts enforces this).
import type { AstroCookies } from 'astro';
import { createServerClient as createSsrClient, parseCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { env, isConfigured } from './env';

export { STAFF_DOMAINS } from './signin';
export const configured = () => isConfigured('supabase');
export const serverConfigured = () => isConfigured('admin');

/** One per request: the session client for the visitor's cookies. Cookie writes go back through Astro. */
export function createServerClient(ctx: { request: Request; cookies: AstroCookies }) {
  return createSsrClient(env.supabaseUrl(), env.supabasePublishableKey(), {
    cookies: {
      getAll: () => parseCookieHeader(ctx.request.headers.get('cookie') || '').map(({ name, value }) => ({ name, value: value || '' })),
      setAll: (list) => {
        for (const { name, value, options } of list) ctx.cookies.set(name, value, { ...options, httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
      },
    },
  });
}

/** Secret-key client for named server operations only (invite, offboard, inquiries, publish, build content). */
export function createAdminClient() {
  return createClient(env.supabaseUrl(), env.supabaseSecretKey(), { auth: { persistSession: false, autoRefreshToken: false } });
}

// --- REST helper used by the routes ported from the Design package until tasks 11, 12 and 23 move them
// to the clients above. Every helper throws on non-2xx.
type Opts = { schema?: string; key?: 'anon' | 'service'; prefer?: string; jwt?: string };
async function rest(method: string, path: string, body?: unknown, o: Opts = {}) {
  const key = o.key === 'service' ? env.supabaseSecretKey() : env.supabasePublishableKey();
  const headers: Record<string, string> = { apikey: key, authorization: 'Bearer ' + (o.jwt || key), 'content-type': 'application/json' };
  if (o.schema) { headers[method === 'GET' ? 'accept-profile' : 'content-profile'] = o.schema; }
  if (o.prefer) headers.prefer = o.prefer;
  const r = await fetch(env.supabaseUrl() + '/rest/v1/' + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
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

export const unauthorized = () => new Response(JSON.stringify({ error: 'staff session required' }), { status: 401, headers: { 'content-type': 'application/json' } });
export const json = (data: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers } });
