// POST /api/research/chat — staff-only SSE stream, per admin/astro-endpoints.md.
// Frames: data:{"delta":"…"} … data:{"done":true,"sources":[…]} | data:{"error":"…"}
// Providers: 'claude' → Anthropic Messages API; 'gpt61' | 'sol' → the Codex bridge (CODEX_BRIDGE_URL).
// Falls back to Claude when the bridge is unreachable and ANTHROPIC_API_KEY exists; otherwise emits the error frame.
export const prerender = false;
import type { APIRoute } from 'astro';
import { db, json, serverConfigured } from '../../../lib/supabase';
import { requireStaff } from '../../../lib/auth';

type Chunk = { id: string; document_id: string; content: string; idx: number; title?: string; kind?: string; similarity?: number };
const SYSTEM = 'You are the ZINC Digital research assistant. Answer plainly and concretely in ZINC\'s voice: confident, matter-of-fact, no filler. Use only the numbered sources when they are relevant and cite them inline as [n]. If the sources do not cover the question, say so.';
const MODEL_IDS: Record<string, string> = { claude: 'claude-sonnet-4-5', gpt61: 'gpt-6.1', sol: 'gpt-6-sol' };

async function embed(text: string): Promise<number[]> {
  const key = import.meta.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not configured (embeddings)');
  const r = await fetch('https://api.openai.com/v1/embeddings', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' }, body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }) });
  if (!r.ok) throw new Error('embeddings ' + r.status);
  return ((await r.json()) as { data: { embedding: number[] }[] }).data[0].embedding;
}

async function* anthropic(messages: { role: string; content: string }[], system: string) {
  const key = import.meta.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not configured');
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: MODEL_IDS.claude, max_tokens: 2048, system, stream: true, messages }) });
  if (!r.ok || !r.body) throw new Error('anthropic ' + r.status);
  for await (const ev of sse(r.body)) { if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') yield ev.delta.text as string; }
}
async function* bridge(model: string, messages: { role: string; content: string }[], system: string) {
  const url = import.meta.env.CODEX_BRIDGE_URL, token = import.meta.env.CODEX_BRIDGE_TOKEN;
  if (!url) throw new Error('bridge offline');
  const r = await fetch(url.replace(/\/$/, '') + '/complete', { method: 'POST', headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify({ model: MODEL_IDS[model], system, messages, stream: true }) }).catch(() => null);
  if (!r || !r.ok || !r.body) throw new Error('bridge offline');
  for await (const ev of sse(r.body)) { if (typeof ev.delta === 'string') yield ev.delta; }
}
async function* sse(body: ReadableStream<Uint8Array>): AsyncGenerator<any> {
  const reader = body.getReader(), dec = new TextDecoder(); let buf = '';
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let i; while ((i = buf.indexOf('\n\n')) >= 0) { const frame = buf.slice(0, i); buf = buf.slice(i + 2); const line = frame.split('\n').find((l) => l.startsWith('data:')); if (!line) continue; const d = line.slice(5).trim(); if (d === '[DONE]') return; try { yield JSON.parse(d); } catch { /* skip */ } }
  }
}

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  const staff = requireStaff(ctx);
  if (staff instanceof Response) return staff;
  if (!serverConfigured()) return json({ error: 'server supabase not configured' }, 503);
  if (import.meta.env.RESEARCH_PROVIDERS_APPROVED !== 'true') return json({ error: 'research providers not approved (OpenAI embeddings / Anthropic are billable; set RESEARCH_PROVIDERS_APPROVED=true after owner sign-off)' }, 503);
  const { project_id, text, model = 'claude' } = (await request.json()) as { project_id: string; text: string; model?: string };
  if (!project_id || !text?.trim()) return json({ error: 'project_id and text required' }, 400);
  const S = { key: 'service' as const, schema: 'research' };
  // 1. chat row
  let [chat] = (await db.select('chats?project_id=eq.' + project_id + '&order=created_at.desc&limit=1&select=id', S)) as { id: string }[];
  if (!chat) [chat] = (await db.insert('chats', { project_id, created_by: staff.id }, S)) as { id: string }[];
  await db.insert('messages', { chat_id: chat.id, role: 'user', content: text, status: 'done' }, { ...S, prefer: 'return=minimal' });
  // 2. retrieval
  let chunks: Chunk[] = [];
  try { chunks = (await db.rpc('match_chunks', { query_embedding: await embed(text), match_count: 8, p_project_id: project_id }, S)) as Chunk[]; } catch (e) { console.error('retrieval skipped:', (e as Error).message); }
  const docIds = [...new Set(chunks.map((c) => c.document_id))];
  const docs = docIds.length ? ((await db.select('documents?id=in.(' + docIds.join(',') + ')&select=id,title,kind', S)) as { id: string; title: string; kind: string }[]) : [];
  const sources = chunks.map((c, i) => { const d = docs.find((x) => x.id === c.document_id); return { n: i + 1, document_id: c.document_id, title: d?.title || 'Source', kind: d?.kind || 'Note', idx: c.idx }; });
  const context = chunks.map((c, i) => '[' + (i + 1) + '] ' + (sources[i].title) + '\n' + c.content).join('\n\n');
  const history = ((await db.select('messages?chat_id=eq.' + chat.id + '&order=id.desc&limit=12&select=role,content', S)) as { role: string; content: string }[]).reverse().filter((m) => m.content);
  const messages = [...history.slice(0, -1).map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })), { role: 'user', content: (context ? 'Sources:\n' + context + '\n\nQuestion: ' : '') + text }];
  // 3. assistant row
  const [reply] = (await db.insert('messages', { chat_id: chat.id, role: 'assistant', content: '', status: 'streaming', model }, S)) as { id: number }[];
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const send = (o: unknown) => ctrl.enqueue(enc.encode('data: ' + JSON.stringify(o) + '\n\n'));
      let acc = '', usedModel = model;
      const run = async (gen: AsyncGenerator<string>) => { for await (const d of gen) { acc += d; send({ delta: d }); } };
      try {
        if (model === 'claude') await run(anthropic(messages, SYSTEM));
        else { try { await run(bridge(model, messages, SYSTEM)); } catch (e) { if ((e as Error).message === 'bridge offline' && import.meta.env.ANTHROPIC_API_KEY && !acc) { usedModel = 'claude'; send({ notice: 'Codex bridge offline — answered by Claude' }); await run(anthropic(messages, SYSTEM)); } else throw e; } }
        await db.update('messages?id=eq.' + reply.id, { content: acc, sources, status: 'done', model: usedModel }, { ...S, prefer: 'return=minimal' });
        send({ done: true, sources, model: usedModel });
      } catch (e) {
        const msg = (e as Error).message || 'provider error';
        await db.update('messages?id=eq.' + reply.id, { content: acc, status: 'error', sources }, { ...S, prefer: 'return=minimal' }).catch(() => {});
        send({ error: msg });
      } finally { ctrl.close(); }
    },
  });
  return new Response(stream, { headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store', connection: 'keep-alive' } });
};
