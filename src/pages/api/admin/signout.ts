// POST /api/admin/signout — ends the staff session (design section 6.2). signOut revokes the session and
// clears its cookies through the server client's cookie callback; any Supabase auth cookie left (for example
// when Auth is unreachable) is deleted here too. Reachable without a staff role, so any session can end.
export const prerender = false;
import type { APIRoute } from 'astro';
import { parseCookieHeader } from '@supabase/ssr';
import { createServerClient } from '../../../lib/supabase';
import { isConfigured } from '../../../lib/env';

export const POST: APIRoute = async (ctx) => {
  if (isConfigured('supabase')) {
    try { await createServerClient(ctx).auth.signOut(); } catch { /* fall through to the cookie sweep */ }
  }
  for (const { name } of parseCookieHeader(ctx.request.headers.get('cookie') || '')) {
    if (/^sb-[a-z0-9]+-auth-token(\.\d+)?$/.test(name)) ctx.cookies.delete(name, { path: '/' });
  }
  return ctx.redirect('/admin/login/', 303);
};
