// Gates /admin/* and the staff API routes. Public routes pass through untouched (static output).
// /admin/login/ and /admin/callback/ are public so staff can sign in.
import { defineMiddleware } from 'astro:middleware';
import { staffFromRequest } from './lib/supabase';

const STAFF_API = ['/api/research/', '/api/inquiries/email'];
export const onRequest = defineMiddleware(async ({ request, url, redirect }, next) => {
  const p = url.pathname;
  const isAdmin = p.startsWith('/admin/') && p !== '/admin/login/' && p !== '/admin/callback/';
  const isStaffApi = STAFF_API.some((x) => p.startsWith(x));
  if (!isAdmin && !isStaffApi) return next();
  const staff = await staffFromRequest(request);
  if (staff) { const res = await next(); res.headers.set('x-robots-tag', 'noindex, nofollow'); res.headers.set('cache-control', 'no-store'); return res; }
  if (isStaffApi) return new Response(JSON.stringify({ error: 'staff session required' }), { status: 401, headers: { 'content-type': 'application/json' } });
  return redirect('/admin/login/?next=' + encodeURIComponent(p), 302);
});
