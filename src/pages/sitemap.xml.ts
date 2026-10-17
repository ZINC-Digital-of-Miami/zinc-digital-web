import type { APIRoute } from 'astro';
import { SITE, noindexPaths } from '../data/site';
import {loadPublished} from '../lib/content';
import {sitemapDocument} from '../lib/public-seo';
export const GET: APIRoute = async () => {
  const {routes}=await loadPublished();
  const xml = sitemapDocument(SITE,routes,noindexPaths);
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
