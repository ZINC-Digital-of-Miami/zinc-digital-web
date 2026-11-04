import type {APIRoute} from 'astro';
import {loadPublished} from '../lib/content';
// Prerender with the same cached snapshots consumed by every public page.
// Expose only an opaque digest, never content, staff IDs or credentials.
export const GET:APIRoute=async()=>new Response(JSON.stringify({revision:(await loadPublished()).revision}),{headers:{'content-type':'application/json','cache-control':'no-cache','x-robots-tag':'noindex, nofollow'}});
