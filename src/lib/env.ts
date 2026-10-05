// Typed access to configuration (design section 12). Values come from Vercel or the git-ignored .env;
// nothing here logs or returns them to a client. The port's older names (SUPABASE_URL,
// PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE) are read as fallbacks until every route uses these.
const e = import.meta.env as Record<string, string | undefined>;
const read = (...names: string[]) => names.map((n) => (e[n] || '').trim()).find(Boolean) || '';

export const env = {
  supabaseUrl: () => read('PUBLIC_SUPABASE_URL', 'SUPABASE_URL').replace(/\/$/, ''),
  supabasePublishableKey: () => read('PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'PUBLIC_SUPABASE_ANON_KEY'),
  supabaseSecretKey: () => read('SUPABASE_SECRET_KEY', 'SUPABASE_SERVICE_ROLE'),
  siteOrigin: () => read('SITE_ORIGIN') || 'https://www.zincdigital.co',
  inquiryHashSalt: () => read('INQUIRY_HASH_SALT'),
  smtp: () => ({ user: read('SMTP_USER'), pass: read('SMTP_PASS'), to: read('INQUIRY_NOTIFY_TO') }),
};

export type Feature = 'supabase' | 'admin' | 'smtp';

/** True when every value a feature needs is present. Callers show what is missing instead of failing. */
export function isConfigured(feature: Feature): boolean {
  switch (feature) {
    case 'supabase': return !!env.supabaseUrl() && !!env.supabasePublishableKey();
    case 'admin': return isConfigured('supabase') && !!env.supabaseSecretKey();
    case 'smtp': { const s = env.smtp(); return !!s.user && !!s.pass; } // INQUIRY_NOTIFY_TO has a default
  }
}
