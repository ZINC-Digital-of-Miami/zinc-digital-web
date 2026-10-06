import legacy from './legacy-urls.json' with {type:'json'};
// The complete WordPress/Search Console inventory. Review the proposed map before production cutover.
export const caseAliases: Record<string, string> = { 'summit-marine': 'summit-marine-development' };
export const redirects: Record<string, string> = {
  ...Object.fromEntries(legacy.filter(row => row.action === '301').map(row => [row.path.replace(/\/?$/, '/'), row.target as string])),
  ...Object.fromEntries(Object.entries(caseAliases).map(([from, to]) => ['/work/' + from + '/', '/work/' + to + '/'])),
};
export const retiredPaths = legacy.filter(row => row.action === '410').map(row => row.path);
const gone = new Set(retiredPaths.map(normalizeLegacyPath));
export function normalizeLegacyPath(path: string) {
  try { return decodeURIComponent(path).replace(/\/$/, ''); } catch { return path.replace(/\/$/, ''); }
}
export function isRetiredPath(path: string) { return gone.has(normalizeLegacyPath(path)); }

// Only owned URLs are rewritten; external sources, query parameters and fragments are preserved.
export function canonicalContentLink(href: string) {
  if (!href.startsWith('/') && !/^https?:\/\//i.test(href)) return href;
  let url: URL;
  try { url = new URL(href, 'https://www.zincdigital.co'); } catch { return href; }
  if (!['www.zincdigital.co', 'zincdigital.co'].includes(url.hostname)) return href;
  const path = url.pathname.replace(/\/?$/, '/');
  return (redirects[path] || url.pathname) + url.search + url.hash;
}
