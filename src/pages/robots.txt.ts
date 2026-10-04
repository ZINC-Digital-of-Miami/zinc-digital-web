import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
export const GET: APIRoute = () => new Response('User-agent: *\nAllow: /\nDisallow: /thanks/\n\nSitemap: ' + SITE + '/sitemap.xml\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
