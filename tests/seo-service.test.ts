import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { ContentItem } from '../src/lib/admin-data.ts';
import { analyzeContent, seoTarget } from '../src/lib/seo-service.ts';

const site = 'https://www.zincdigital.co';
const item: ContentItem = {
  kind: 'post', key: 'example', path: '/blog/example/', title: 'Example article', template: 'article', status: 'published',
  meta_title: 'A useful example article', meta_description: 'A practical example article with enough context to explain what readers can expect to learn about improving a real website.',
  focus_keyword: 'example', noindex: false, layer: 'Demand', body: '', excerpt: '', author: 'Kirk Musick', origin: 'repo', saved: false,
};
const html = `<!doctype html><html><head><title>Live article | ZINC</title><meta name="description" content="Live description"><link rel="canonical" href="${site}${item.path}"></head><body><header>Header words</header><main><h1>Example article</h1><article class="p-prose"><p>Existing content with <a href="/services/seo/">SEO services</a> and <a href="https://developers.google.com/search/">Google Search</a>.</p></article><section>Kirk Musick</section></main><footer>Footer words</footer></body></html>`;
const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${site}${item.path}</loc></url></urlset>`;
const response = (body = html, status = 200, type = 'text/html; charset=utf-8') => new Response(body, { status, headers: { 'content-type': type } });
const check = (result: Awaited<ReturnType<typeof analyzeContent>>, id: string) => result.analysis.checks.find(c => c.id === id)!;
function requester(replies: (Response | Error)[]) {
  const calls: { url: string; init: RequestInit | undefined }[] = [];
  const request: typeof fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    calls.push({ url, init });
    const next = replies.shift();
    if (next instanceof Error) throw next;
    if (!next) throw new Error('Unexpected request: ' + url);
    return next;
  };
  return { request, calls };
}

test('targets only public paths on the fixed ZINC live domain', () => {
  assert.equal(seoTarget('/'), site + '/');
  assert.equal(seoTarget('/services/seo/'), site + '/services/seo/');
  for (const path of ['https://evil.example/', '//evil.example/', '/admin/', '/api/inquiry/', '/admin/settings/', '/services/../admin/', '/services/%2e%2e/admin/', '/blog/x/?url=https://evil.example/', '/blog/x/#fragment', '/blog/x\\evil/', '/blog/ x/', '/blog/X/']) {
    assert.throws(() => seoTarget(path), /public page/);
  }
});

test('reads the fixed live page and sitemap without following redirects', async () => {
  const fake = requester([response(), response(sitemap, 200, 'application/xml')]);
  const result = await analyzeContent(item, {}, fake.request);
  assert.deepEqual(fake.calls.map(c => c.url), [site + item.path, site + '/sitemap.xml']);
  assert.ok(fake.calls.every(c => c.init?.redirect === 'manual' && c.init.signal instanceof AbortSignal));
  assert.equal(check(result, 'http-status').status, 'pass');
  assert.equal(check(result, 'sitemap').status, 'pass');
  assert.match(result.source, /Draft metadata.*live page structure/);
  assert.ok(Number.isFinite(Date.parse(result.checkedAt)));
});

test('draft metadata overlays leave live structure and the input item unchanged', async () => {
  const fake = requester([response(), response(sitemap, 200, 'text/xml')]);
  const patch = { meta_title: 'Draft example', meta_description: '', focus_keyword: 'draft example', path: '/admin/', kind: 'page' as const };
  const result = await analyzeContent(item, patch, fake.request);
  assert.equal(result.path, item.path);
  assert.equal(fake.calls[0].url, site + item.path);
  assert.equal(check(result, 'description').status, 'fail');
  assert.match(check(result, 'focus-keyword').detail, /title/);
  assert.equal(result.analysis.counts.externalLinks, 1);
  assert.equal(check(result, 'h1').status, 'pass');
  assert.equal(item.meta_title, 'A useful example article');
});

test('admin-origin article drafts overlay sanitized Markdown body without fetching its links', async () => {
  const fake = requester([response(), response(sitemap, 200, 'application/xml')]);
  const result = await analyzeContent({ ...item, origin: 'admin', live_at: '2026-10-05' }, { body: '## Draft section\n\nFresh draft with [the guide](/blog/four-pillars-of-seo-operators-view/).\n\n<script>globalThis.seoExecuted = true</script>\n\n[Unsafe](javascript:alert(1))' }, fake.request);
  assert.equal(check(result, 'h1').status, 'pass');
  assert.equal(result.analysis.counts.externalLinks, 0);
  assert.equal(result.analysis.counts.internalLinks, 1);
  assert.equal(fake.calls.length, 2);
  assert.equal((globalThis as { seoExecuted?: boolean }).seoExecuted, undefined);
  assert.match(result.source, /Draft metadata.*body.*live page structure/);
});

test('sitemap fetch errors remain unknown and never invent membership points', async () => {
  for (const next of [new Error('Sitemap unavailable'), response('Not found', 404), response('<html>Not an XML sitemap</html>')]) {
    const fake = requester([response(), next]);
    const result = await analyzeContent(item, {}, fake.request);
    assert.equal(check(result, 'sitemap').status, 'info');
    assert.equal(check(result, 'sitemap').points, 0);
    assert.equal(check(result, 'sitemap').maxPoints, 0);
  }
});

test('verified sitemap absence is distinct from unavailable sitemap data', async () => {
  const fake = requester([response(), response('<urlset><url><loc>https://www.zincdigital.co/other/</loc></url></urlset>', 200, 'application/xml')]);
  const result = await analyzeContent(item, {}, fake.request);
  assert.equal(check(result, 'sitemap').status, 'warn');
});

test('sitemap membership accepts whitespace around XML locations', async () => {
  const fake = requester([response(), response(`<urlset><url><loc>\n  ${site}${item.path}\n</loc></url></urlset>`, 200, 'application/xml')]);
  assert.equal(check(await analyzeContent(item, {}, fake.request), 'sitemap').status, 'pass');
});

test('new unpublished posts use draft content and exclude an invented live-page score', async () => {
  const draft: ContentItem = { ...item, origin: 'admin', status: 'draft', body: '## First section\n\nA new article with [the service](/services/seo/).', live_at: undefined };
  const fake = requester([response('Missing', 404)]);
  const result = await analyzeContent(draft, {}, fake.request);
  assert.equal(fake.calls.length, 1);
  assert.equal(result.analysis.score, null);
  assert.equal(result.analysis.grade, 'excluded');
  assert.equal(check(result, 'http-status').status, 'info');
  assert.equal(check(result, 'sitemap').status, 'info');
  assert.equal(check(result, 'h1').status, 'pass');
  assert.equal(result.analysis.counts.internalLinks, 1);
  assert.match(result.source, /Draft content.*live checks unavailable/);
});

test('pending draft indexing preferences are used instead of stale live directives', async () => {
  const fake = requester([response(), response(sitemap, 200, 'application/xml')]);
  const result = await analyzeContent(item, { noindex: true }, fake.request);
  assert.equal(result.analysis.score, null);
  assert.equal(result.analysis.grade, 'excluded');
  assert.equal(result.analysis.indexable, false);
  assert.equal(check(result, 'robots').status, 'info');
  assert.equal(check(result, 'sitemap').status, 'fail');
});

test('bad HTTP and redirects cannot masquerade as live SEO analysis', async () => {
  for (const status of [201, 301, 302, 403, 404, 500]) {
    const fake = requester([response('Unavailable', status)]);
    await assert.rejects(analyzeContent(item, {}, fake.request), new RegExp('live page.*' + status));
    assert.equal(fake.calls.length, 1);
  }
});

test('missing published admin posts do not get a synthetic draft analysis', async () => {
  const fake = requester([response('Missing', 404)]);
  await assert.rejects(analyzeContent({ ...item, origin: 'admin', live_at: '2026-10-05' }, {}, fake.request), /live page.*404/);
});

test('non-HTML and oversized page responses fail before scoring', async () => {
  const fake = requester([response('{"message":"Not a page"}', 200, 'application/json')]);
  await assert.rejects(analyzeContent(item, {}, fake.request), /HTML/);
  const tooLarge = requester([response('a'.repeat(2000001))]);
  await assert.rejects(analyzeContent(item, {}, tooLarge.request), /too large/);
});

test('transport errors return a useful live-page message without leaking their payload', async () => {
  const fake = requester([new Error('private network debug payload')]);
  await assert.rejects(analyzeContent(item, {}, fake.request), error => error instanceof Error && /live page could not be read/.test(error.message) && !error.message.includes('private network'));
});
