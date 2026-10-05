import type { APIRoute } from 'astro';
import { SITE, noindexPaths } from '../data/site';
import {loadPublished} from '../lib/content';
export const GET: APIRoute = async () => {
  const {routes}=await loadPublished();
  const urls = routes.filter((r) => !r.noindex && !noindexPaths.has(r.path)).map((r) => '  <url><loc>' + SITE + r.path + '</loc>' + (r.published ? '<lastmod>' + r.published.slice(0, 10) + '</lastmod>' : '') + '</url>').join('\n');
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
