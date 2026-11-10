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

const PASSWORD_LIMIT = 8;
const tried = new Map<string, number[]>();

/**
 * At most 8 password attempts per address per 15 minutes, counted in this server instance and separately
 * from sign-in links. Supabase's own Auth limits apply across instances.
 */
export function passwordAttemptAllowed(email: string, now = Date.now()): boolean {
  const recent = (tried.get(email) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PASSWORD_LIMIT) { tried.set(email, recent); return false; }
  recent.push(now);
  tried.set(email, recent);
  if (tried.size > 1000) for (const [k, v] of tried) if (v.every((t) => now - t >= WINDOW_MS)) tried.delete(k);
  return true;
}

/** Why a new password is refused, or '' when it is acceptable. Length is the rule; no character quotas. */
export function passwordProblem(password: unknown, email = ''): string {
  if (typeof password !== 'string' || password.length < 12) return 'Use at least 12 characters.';
  if (password.length > 200) return 'Use 200 characters or fewer.';
  const lower = password.toLowerCase(), name = email.toLowerCase().split('@')[0];
  if (email && (lower === email.toLowerCase() || (name.length >= 4 && lower.includes(name)))) return 'Do not use your email address in the password.';
  if (new Set(password).size < 5) return 'Use a less repetitive password.';
  return '';
}
