// Sign-in helpers for /admin/login/ (design section 6.2). Pure, so the node tests load it directly.

export const STAFF_DOMAINS = ['zincdigital.co', 'zincmiami.com'];
/** Holds safeNext(next) between the sign-in request and the confirm link: 10 minutes, HttpOnly. */
export const NEXT_COOKIE = 'zinc-next';
export const NEXT_COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: 600 };

export function isStaffAddress(email: string): boolean {
  const m = /^[^@\s]+@([^@\s]+)$/.exec(email);
  return !!m && STAFF_DOMAINS.includes(m[1]);
}

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 3;
const sent = new Map<string, number[]>();

/**
 * At most 3 sign-in links per address per 15 minutes, counted in this server instance. Supabase's own
 * limits (one email per address per 60 s, 30 per hour) apply across instances.
 */
export function signInAllowed(email: string, now = Date.now()): boolean {
  const recent = (sent.get(email) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) { sent.set(email, recent); return false; }
  recent.push(now);
  sent.set(email, recent);
  if (sent.size > 1000) for (const [k, v] of sent) if (v.every((t) => now - t >= WINDOW_MS)) sent.delete(k);
  return true;
}
