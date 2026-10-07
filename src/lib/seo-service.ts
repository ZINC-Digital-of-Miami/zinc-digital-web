import type { ContentItem } from './admin-data.ts';
import { analyzeSeo } from './seo-analysis.ts';
import { renderMarkdown } from './markdown.ts';
import { parseFragment, type DefaultTreeAdapterMap } from 'parse5';

// This boundary always reads the public ZINC host, never a request origin or editor-supplied URL.
const SITE = 'https://www.zincdigital.co';
const MAX_BYTES = 2_000_000;

const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const contentType = (response: Response) => (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();

async function boundedText(response: Response) {
  if (Number(response.headers.get('content-length') || 0) > MAX_BYTES) {
    await response.body?.cancel();
    throw new Error('This page is too large to analyze.');
  }
  const reader = response.body?.getReader();
  if (!reader) return '';
  let bytes = 0;
  const chunks: string[] = [];
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > MAX_BYTES) {
        await reader.cancel();
        throw new Error('This page is too large to analyze.');
      }
      chunks.push(decoder.decode(value, { stream: true }));
    }
    chunks.push(decoder.decode());
    return chunks.join('');
  } finally { reader.releaseLock(); }
}

function sitemapMembership(xml: string, url: string): boolean | undefined {
  // Parse markup with the existing parser; no entity expansion or network access.
  const root = parseFragment(xml).childNodes.find(node => 'tagName' in node && node.tagName === 'urlset');
  if (!root) return;
  const queue: DefaultTreeAdapterMap['node'][] = [root];
  while (queue.length) {
    const node = queue.pop()!;
    if ('tagName' in node && node.tagName === 'loc') {
      const value = node.childNodes.filter(child => child.nodeName === '#text').map(child => (child as DefaultTreeAdapterMap['textNode']).value).join('').trim();
      if (value === url) return true;
    }
    if ('childNodes' in node) queue.push(...node.childNodes);
  }
  return false;
}

export function seoTarget(path: string) {
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(path) || /^\/(admin|api)\//.test(path)) throw new Error('Choose a public page from the SEO editor.');
  return new URL(path, SITE).href;
}
export async function analyzeContent(item: ContentItem, patch: Partial<ContentItem> = {}, request: typeof fetch = fetch) {
  const url = seoTarget(item.path);
  const effective = { ...item, ...patch };
  const read = (target: string) => request(target, { redirect:'manual', cache:'no-store', signal:AbortSignal.timeout(10000) });
  let response: Response;
  try { response = await read(url); }
  catch { throw new Error('The live page could not be read. Try again.'); }
  const isNewDraft = item.kind === 'post' && item.origin === 'admin' && !item.live_at && response.status === 404;
  if (response.status !== 200 && !isNewDraft) {
    await response.body?.cancel();
    throw new Error('The live page could not be read (' + response.status + '). Try again.');
  }
  let html: string;
  if (isNewDraft) {
    await response.body?.cancel();
    html = '<!doctype html><html><head><title>' + escape(effective.title) + ' | ZINC</title><meta name="description" content="' + escape(effective.meta_description || '') + '"><link rel="canonical" href="' + url + '"></head><body><main><h1>' + escape(effective.title) + '</h1><article class="p-prose">' + renderMarkdown(effective.body || '') + '</article></main></body></html>';
  } else {
    if (!['text/html', 'application/xhtml+xml'].includes(contentType(response))) {
      await response.body?.cancel();
      throw new Error('The live page did not return HTML. Try again.');
    }
    try { html = await boundedText(response); }
    catch (error) {
      if (error instanceof Error && error.message === 'This page is too large to analyze.') throw error;
      throw new Error('The live page could not be read. Try again.');
    }
  }
  let sitemapIncluded: boolean | undefined;
  if (!isNewDraft) {
    try {
      const sitemap = await read(SITE + '/sitemap.xml');
      if (sitemap.status === 200 && ['text/xml', 'application/xml'].includes(contentType(sitemap))) sitemapIncluded = sitemapMembership(await boundedText(sitemap), url);
      else await sitemap.body?.cancel();
    } catch { /* Unknown is reported without points. */ }
  }
  const intendedNoindex = effective.noindex || effective.status === 'draft' || isNewDraft;
  const draftBody = item.kind === 'post' && item.origin === 'admin';
  const analysis = analyzeSeo(html, {
    url, kind:item.kind, focusKeyword:effective.focus_keyword, expectedNoindex:intendedNoindex,
    httpStatus:isNewDraft?undefined:response.status, sitemapIncluded,
    overrides:{title:(effective.meta_title || effective.title)+' | ZINC',description:effective.meta_description || '',noindex:intendedNoindex,...(draftBody?{bodyHtml:renderMarkdown(effective.body || '')}:{})},
  });
  return { analysis, path:item.path, source:isNewDraft?'Draft content · live checks unavailable':draftBody?'Draft metadata and body + live page structure':'Draft metadata + live page structure', checkedAt:new Date().toISOString() };
}
