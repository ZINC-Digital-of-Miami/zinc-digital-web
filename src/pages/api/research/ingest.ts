// POST /api/research/ingest — staff-only. Inserts the document immediately (status 'pending'),
// extracts text, chunks (~800 tokens ≈ 3200 chars, 480-char overlap), embeds in batches of 64,
// inserts research.chunks, sets status 'ready'. Implemented kinds: Note, URL.
// Cost gate: requires RESEARCH_PROVIDERS_APPROVED=true (OpenAI embeddings are billable) — returns 503 otherwise.
// SERP and File return 501 until a SERP provider / storage upload path is configured (see PORT.md).
export const prerender = false;
import type { APIRoute } from 'astro';
import { db, json, serverConfigured } from '../../../lib/supabase';
import { requireStaff } from '../../../lib/auth';

const S = { key: 'service' as const, schema: 'research' };
const MAX_BYTES = 2 * 1024 * 1024, FETCH_MS = 10000, MAX_REDIRECTS = 3, MAX_CHUNKS = 120, MAX_TEXT = 200000;
const BLOCKED_HOST = /^(localhost|.*\.local|.*\.internal|.*\.localhost)$/i;
function privateIp(h: string) {
  const v4 = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (v4) { const [a, b] = [Number(v4[1]), Number(v4[2])]; return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a >= 224; }
  if (h.includes(':')) { const x = h.replace(/^\[|\]$/g, '').toLowerCase(); return x === '::1' || x === '::' || /^(fc|fd|fe[89ab])/.test(x) || x.startsWith('::ffff:'); }
  return false;
}
function allowedUrl(raw: string): URL {
  const u = new URL(raw);
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error('only http(s) urls');
  if (u.username || u.password) throw new Error('credentials in url not allowed');
  const h = u.hostname.toLowerCase();
  if (BLOCKED_HOST.test(h) || privateIp(h) || !h.includes('.')) throw new Error('host not allowed');
  return u;
}
/** Manual redirects (each hop re-validated), 10 s timeout, 2 MB cap, text content-types only.
 *  Not covered: DNS rebinding to a private address after validation — run behind an egress proxy for full SSRF protection (PORT.md E6). */
async function safeFetchText(raw: string): Promise<string> {
  let u = allowedUrl(raw);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), FETCH_MS);
    try {
      const r = await fetch(u, { redirect: 'manual', signal: ctrl.signal, headers: { 'user-agent': 'ZINC-Research/1.0 (+https://www.zincdigital.co)', accept: 'text/html,text/plain;q=0.9,*/*;q=0.1' } });
      if ([301, 302, 303, 307, 308].includes(r.status)) { const loc = r.headers.get('location'); if (!loc) throw new Error('redirect without location'); u = allowedUrl(new URL(loc, u).href); continue; }
      if (!r.ok) throw new Error('fetch ' + r.status);
      const ct = r.headers.get('content-type') || '';
      if (!/text\/html|text\/plain|application\/xhtml/.test(ct)) throw new Error('unsupported content-type ' + ct.split(';')[0]);
      if (Number(r.headers.get('content-length') || 0) > MAX_BYTES) throw new Error('response too large');
      const reader = r.body!.getReader(); const parts: Uint8Array[] = []; let total = 0;
      while (true) { const { value, done } = await reader.read(); if (done) break; total += value.byteLength; if (total > MAX_BYTES) { await reader.cancel(); throw new Error('response too large'); } parts.push(value); }
      return new TextDecoder().decode(Buffer.concat(parts.map((x) => Buffer.from(x))));
    } finally { clearTimeout(timer); }
  }
  throw new Error('too many redirects');
}
const strip = (html: string) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<\/(p|div|li|h[1-6]|br|tr|section|article)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
function chunk(text: string, size = 3200, overlap = 480) { const out: string[] = []; for (let i = 0; i < text.length; i += size - overlap) { out.push(text.slice(i, i + size)); if (i + size >= text.length) break; } return out; }
async function embedAll(inputs: string[]): Promise<number[][]> {
  const key = import.meta.env.OPENAI_API_KEY; if (!key) throw new Error('OPENAI_API_KEY not configured');
  const out: number[][] = [];
  for (let i = 0; i < inputs.length; i += 64) {
    const r = await fetch('https://api.openai.com/v1/embeddings', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify({ model: 'text-embedding-3-small', input: inputs.slice(i, i + 64) }) });
    if (!r.ok) throw new Error('embeddings ' + r.status);
    out.push(...((await r.json()) as { data: { embedding: number[] }[] }).data.map((d) => d.embedding));
  }
  return out;
}

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  const staff = requireStaff(ctx);
  if (staff instanceof Response) return staff;
  if (!serverConfigured()) return json({ error: 'server supabase not configured' }, 503);
  if (import.meta.env.RESEARCH_PROVIDERS_APPROVED !== 'true') return json({ error: 'research providers not approved (set RESEARCH_PROVIDERS_APPROVED=true after owner sign-off on OpenAI embedding costs)' }, 503);
  const { project_id, kind, title, url, content } = (await request.json()) as { project_id: string; kind: 'URL' | 'SERP' | 'File' | 'Note'; title: string; url?: string; content?: string };
  if (!project_id || !kind || !title) return json({ error: 'project_id, kind, title required' }, 400);
  if (kind === 'SERP' || kind === 'File') return json({ error: kind + ' ingestion is not configured in this build (needs SERP provider / storage upload)' }, 501);
  const [doc] = (await db.insert('documents', { project_id, kind, title, url: url || null, status: 'pending', created_by: staff.id }, S)) as { id: string }[];
  try {
    let text = content || '';
    if (kind === 'URL') { if (!url) throw new Error('url required'); text = strip(await safeFetchText(url)); }
    if (!text.trim()) throw new Error('no text extracted');
    text = text.slice(0, MAX_TEXT);
    const parts = chunk(text).slice(0, MAX_CHUNKS); // ≤120 chunks ≈ 100k tokens embedded per document
    const vecs = await embedAll(parts);
    await db.insert('chunks', parts.map((c, idx) => ({ document_id: doc.id, idx, content: c, embedding: vecs[idx] })), { ...S, prefer: 'return=minimal' });
    await db.update('documents?id=eq.' + doc.id, { content: text, status: 'ready' }, { ...S, prefer: 'return=minimal' });
    return json({ document_id: doc.id, status: 'ready', chunks: parts.length });
  } catch (e) {
    await db.update('documents?id=eq.' + doc.id, { status: 'error', meta: { error: (e as Error).message } }, { ...S, prefer: 'return=minimal' }).catch(() => {});
    return json({ document_id: doc.id, status: 'error', error: (e as Error).message }, 502);
  }
};
