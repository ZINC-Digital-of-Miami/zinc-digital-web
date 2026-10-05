// Admin and API requests (design sections 6.2 and 6.3). Creates the session client, validates the user with
// Auth (auth.getUser refreshes an expired access token through the cookie callback), sets locals.user and
// locals.staff, gates private paths, and marks every admin, auth and API response private and noindex.
// Public static pages pass straight through.
import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from './lib/supabase';
import { safeNext, staffRole } from './lib/auth';
import { isConfigured } from './lib/env';
import { isPrivatePath } from './data/private-routes';

export const onRequest = defineMiddleware(async (ctx, next) => {
  const p = ctx.url.pathname;
  ctx.locals.user = null;
  ctx.locals.staff = null;
  const admin = p.startsWith('/admin/');
  const api = p.startsWith('/api/');
  if (!admin && !api) return next();

  const gated = isPrivatePath(p);
  if (gated && isConfigured('supabase')) {
    try {
      const sb = createServerClient(ctx);
      const { data } = await sb.auth.getUser();
      if (data.user) {
        const email = (data.user.email || '').toLowerCase();
        ctx.locals.user = { id: data.user.id, email };
        const role = await staffRole(sb);
        if (role) ctx.locals.staff = { id: data.user.id, email, role };
      }
    } catch {
      // Auth unreachable: stay signed out, which denies below.
    }
  }

  // Each route also calls requireStaff; this is the second line.
  if (gated && !ctx.locals.staff) {
    if (api) return new Response(JSON.stringify({ error: 'staff session required' }), { status: 401, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' } });
    return new Response(null, { status: 302, headers: { location: '/admin/login/?next=' + encodeURIComponent(safeNext(p)), 'cache-control': 'private, no-store' } });
  }

  const res = await next();
  try {
    res.headers.set('cache-control', 'private, no-store');
    res.headers.set('x-robots-tag', 'noindex, nofollow');
    return res;
  } catch {
    // Some responses (Response.redirect) have read-only headers.
    const copy = new Response(res.body, res);
    copy.headers.set('cache-control', 'private, no-store');
    copy.headers.set('x-robots-tag', 'noindex, nofollow');
    return copy;
  }
});
