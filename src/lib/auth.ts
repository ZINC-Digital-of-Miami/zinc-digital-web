// Staff authorization helpers (design sections 6.2 and 6.3). Pure: no Astro or Supabase imports, so the
// node tests can load this file directly. Middleware fills locals.staff; every admin page and staff API
// still calls requireStaff itself (R8.4).

export type Role = 'owner' | 'editor';
export type Staff = { id: string; email: string; role: Role };

const NEXT = /^\/admin\/[A-Za-z0-9/_-]*$/;

/** The post-sign-in destination. Only plain /admin/ paths survive; anything else becomes /admin/. */
export function safeNext(v: unknown): string {
  if (typeof v !== 'string') return '/admin/';
  const lower = v.toLowerCase();
  if (!NEXT.test(v) || v.startsWith('//') || v.includes('\\') || lower.includes('%2f') || lower.includes('%5c') || v.includes(':')) return '/admin/';
  return v;
}

const jsonError = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });

type Ctx = { url: URL; locals: { staff?: Staff | null } };

/**
 * Returns the signed-in staff member, or the Response to send instead: 401/403 JSON for /api/ paths,
 * a 302 to sign-in (or to /admin/ for an editor on an owner-only page) otherwise.
 * Usage: `const staff = requireStaff(Astro); if (staff instanceof Response) return staff;`
 */
export function requireStaff(ctx: Ctx, role?: Role): Staff | Response {
  const api = ctx.url.pathname.startsWith('/api/');
  const staff = ctx.locals.staff || null;
  if (!staff) {
    if (api) return jsonError(401, 'staff session required');
    return new Response(null, { status: 302, headers: { location: '/admin/login/?next=' + encodeURIComponent(safeNext(ctx.url.pathname)) } });
  }
  if (role === 'owner' && staff.role !== 'owner') {
    if (api) return jsonError(403, 'owner role required');
    return new Response(null, { status: 302, headers: { location: '/admin/' } });
  }
  return staff;
}

type RpcClient = { rpc: (fn: string) => PromiseLike<{ data: unknown; error: unknown }> };

/** staff_role() for the session user: 'owner', 'editor' or null. Errors, timeouts and any other value deny. */
export async function staffRole(client: RpcClient, timeoutMs = 3000): Promise<Role | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<null>((resolve) => { timer = setTimeout(() => resolve(null), timeoutMs); });
    const result = await Promise.race([Promise.resolve(client.rpc('staff_role')), timeout]);
    if (!result || result.error) return null;
    return result.data === 'owner' || result.data === 'editor' ? result.data : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
