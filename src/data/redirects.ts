// Legacy / short URLs → canonical paths. astro.config.mjs turns these into 301s;
// site.ts re-exports them. Add WordPress-era paths here at cutover.
export const caseAliases: Record<string, string> = { 'summit-marine': 'summit-marine-development' };
