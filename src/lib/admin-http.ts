import type { APIContext } from 'astro';
export function reply(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store' } });
}
export async function input(ctx: APIContext, max = 220000): Promise<Record<string, unknown>> {
  if (ctx.request.headers.get('origin') !== ctx.url.origin) throw new Error('Refresh this page before trying again.');
  if (!ctx.request.headers.get('content-type')?.startsWith('application/json')) throw new Error('Send a JSON request.');
  if (Number(ctx.request.headers.get('content-length') || 0) > max) throw new Error('The request is too large.');
  const reader = ctx.request.body?.getReader();
  if (!reader) throw new Error('The request is empty.');
  let bytes = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
    if (bytes > max) { await reader.cancel(); throw new Error('The request is too large.'); }
    parts.push(value);
  }
  const parsed = JSON.parse(Buffer.concat(parts).toString());
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error('Invalid request.');
  return parsed;
}
export const fail = (message = 'The change could not be saved. Try again.') => reply({ error: message }, 400);
