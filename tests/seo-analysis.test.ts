import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSeo } from '../src/lib/seo-analysis.ts';

const url = 'https://www.zincdigital.co/blog/technical-seo-ten-fixes-that-move-rankings/';
const authorUrl = 'https://www.zincdigital.co/authors/kirk-musick/';
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': authorUrl + '#person', name: 'Kirk Musick', url: authorUrl },
    { '@type': 'Organization', '@id': 'https://www.zincdigital.co/#org', name: 'ZINC Digital', url: 'https://www.zincdigital.co/' },
    { '@type': 'Article', headline: 'Technical SEO fixes that help search engines find your site', datePublished: '2026-10-06', image: 'https://www.zincdigital.co/seo.webp', author: { '@id': authorUrl + '#person' }, publisher: { '@id': 'https://www.zincdigital.co/#org' }, mainEntityOfPage: url },
  ],
};
const good = `<!doctype html><html><head>
  <title>Technical SEO fixes that help search engines find your site</title>
  <meta name="description" content="Find the crawling, indexing and internal link issues that stop useful pages from appearing in search, with practical checks you can repeat.">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="Technical SEO fixes"><meta property="og:description" content="Practical crawling and indexing checks.">
  <meta property="og:url" content="${url}"><meta property="og:type" content="article">
  <meta property="og:image" content="https://www.zincdigital.co/seo.webp"><meta property="og:image:alt" content="Illustrated search console on a laptop">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head><body><header><h1>Navigation headline</h1><a href="/contact/">Contact</a></header>
  <main><h1>Technical SEO fixes that help search engines find your site</h1>
  <img src="/hero.webp" alt="Illustrated search console on a laptop" width="1536" height="1024">
  <article class="p-prose"><p>Crawling is only the beginning. Review the <a href="/blog/four-pillars-of-seo-operators-view/">search guide</a> and <a href="https://developers.google.com/search/docs/">Google documentation</a>.</p><h2>Check the record</h2><p>Look at the pages the server actually sends.</p></article>
  <section><h2>Author</h2><p>Kirk Musick</p></section></main><footer><h1>Footer headline</h1><img src="/footer.svg"><a href="/services/seo/">SEO</a></footer></body></html>`;
const options = { url, kind: 'post' as const, httpStatus: 200, sitemapIncluded: true };
const check = (html: string, id: string, extras = {}) => analyzeSeo(html, { ...options, ...extras }).checks.find(c => c.id === id)!;

test('a verified article earns all applicable points, with a resolved author identity', () => {
  const result = analyzeSeo(good, options);
  assert.equal(result.score, 100);
  assert.equal(result.grade, 'strong');
  assert.equal(result.indexable, true);
  assert.equal(result.counts.internalLinks, 1);
  assert.equal(result.counts.externalLinks, 1);
  assert.equal(result.counts.images, 1);
  assert.equal(check(good, 'article-author').status, 'pass');
  assert.doesNotThrow(() => JSON.stringify(result));
});

test('missing metadata and duplicate metadata cannot earn a passing check', () => {
  assert.equal(check(good.replace(/<title>.*?<\/title>/, ''), 'title').status, 'fail');
  assert.equal(check(good.replace('</head>', '<title>Another title</title></head>'), 'title').status, 'fail');
  assert.equal(check(good.replace('</head>', '<meta name="description" content="Duplicate"></head>'), 'description').status, 'fail');
  assert.equal(check(good.replace('</head>', `<link rel="canonical" href="${url}"></head>`), 'canonical').status, 'fail');
});

test('an unexpected blocked URL has no misleading numeric score', () => {
  const noindex = analyzeSeo(good.replace('</head>', '<meta name="robots" content="NOINDEX, follow"></head>'), options);
  assert.equal(noindex.score, null);
  assert.equal(noindex.grade, 'blocked');
  assert.equal(noindex.indexable, false);
  assert.equal(analyzeSeo(good, { ...options, httpStatus: 404 }).score, null);
  assert.equal(analyzeSeo(good.replace(url, 'https://www.zincdigital.co/other/'), options).grade, 'blocked');
});

test('intentional noindex drafts are excluded rather than ranked poorly', () => {
  const result = analyzeSeo('<head><meta name="robots" content="noindex"></head><main><h1>Draft</h1></main>', { url, kind: 'post', expectedNoindex: true });
  assert.equal(result.score, null);
  assert.equal(result.grade, 'excluded');
  assert.equal(result.indexable, false);
  assert.equal(result.checks.find(c => c.id === 'robots')?.status, 'info');
  assert.equal(result.checks.find(c => c.id === 'robots')?.maxPoints, 0);
  assert.equal(analyzeSeo(good, { ...options, expectedNoindex: true }).checks.find(c => c.id === 'robots')?.status, 'fail');
});

test('unknown network checks stay unverified and contribute no points', () => {
  const result = analyzeSeo(good, { url, kind: 'post' });
  for (const id of ['http-status', 'sitemap', 'image-availability', 'link-availability']) {
    const item = result.checks.find(c => c.id === id)!;
    assert.equal(item.status, 'info');
    assert.equal(item.maxPoints, 0);
    assert.equal(item.points, 0);
  }
  assert.match(result.summary, /not a ranking/);
});

test('headings are scoped to visible main content and report skipped levels', () => {
  assert.equal(check(good, 'h1').status, 'pass');
  assert.equal(check(good.replace('<h2>Check the record</h2>', '<h4>Check the record</h4>'), 'heading-order').status, 'warn');
  assert.equal(check(good.replace('</main>', '<h1>Second main title</h1></main>'), 'h1').status, 'fail');
  assert.equal(check(good.replace('</main>', '<div hidden><h1>Hidden title</h1></div></main>'), 'h1').status, 'pass');
});

test('navigation, footer, scripts and hidden markup never inflate content or link counts', () => {
  const result = analyzeSeo(good, options);
  const extra = good.replace('</main>', '<nav><a href="/fake/">Navigation words</a></nav><script>globalThis.executed = true; extra words</script><style>main { content: "words"; }</style><div hidden>Hidden words<a href="/hidden/">Hidden link</a></div></main>');
  assert.deepEqual(analyzeSeo(extra, options).counts, result.counts);
  assert.equal((globalThis as { executed?: boolean }).executed, undefined);
  assert.equal(check(good.replace(/<article class="p-prose">.*?<\/article>/s, '<article class="p-prose"><p>Just the article.</p></article>'), 'internal-links').status, 'warn');
});

test('the mapped pillar must be linked in the prose, rather than merely in related navigation', () => {
  assert.equal(check(good, 'pillar-links').status, 'pass');
  const without = good.replace('<a href="/blog/four-pillars-of-seo-operators-view/">search guide</a>', 'search guide');
  assert.equal(check(without.replace('</main>', '<nav><a href="/blog/four-pillars-of-seo-operators-view/">Guide</a></nav></main>'), 'pillar-links').status, 'warn');
  assert.equal(check(good, 'pillar-links', { url: 'https://www.zincdigital.co/blog/new-unmapped-article/' }).status, 'info');
});

test('image metadata distinguishes missing alt, intentional decoration and reserved geometry', () => {
  assert.equal(check(good.replace('alt="Illustrated search console on a laptop" width', 'width'), 'image-alt').status, 'fail');
  assert.equal(check(good.replace('alt="Illustrated search console on a laptop" width', 'alt="" width'), 'image-alt').status, 'pass');
  assert.equal(check(good.replace('width="1536" height="1024"', ''), 'image-dimensions').status, 'warn');
  assert.equal(check(good.replace('width="1536" height="1024"', 'style="aspect-ratio: 3 / 2"'), 'image-dimensions').status, 'pass');
  assert.equal(check(good.replace('https://www.zincdigital.co/seo.webp"><meta', 'javascript:alert(1)"><meta'), 'open-graph-image').status, 'fail');
});

test('author refs must resolve to the named author rather than an unrelated Person', () => {
  const broken = structuredClone(schema);
  broken['@graph'][2].author = { '@id': 'https://www.zincdigital.co/missing/#person' };
  assert.equal(check(good.replace(JSON.stringify(schema), JSON.stringify(broken)), 'article-author').status, 'fail');
  const noUrl = structuredClone(schema);
  delete (noUrl['@graph'][0] as { url?: string }).url;
  assert.equal(check(good.replace(JSON.stringify(schema), JSON.stringify(noUrl)), 'article-author').status, 'warn');
  const wrongPage = structuredClone(schema);
  wrongPage['@graph'][2].mainEntityOfPage = 'https://www.zincdigital.co/unrelated/';
  assert.equal(check(good.replace(JSON.stringify(schema), JSON.stringify(wrongPage)), 'article-schema').status, 'fail');
});

test('inline author nodes and arrays of JSON-LD work; malformed JSON never executes', () => {
  const inline = { ...structuredClone(schema['@graph'][2]), author: { '@type': 'Person', name: 'Kirk Musick', url: authorUrl }, publisher: { '@type': 'Organization', name: 'ZINC Digital' } };
  assert.equal(check(good.replace(JSON.stringify(schema), JSON.stringify([inline])), 'article-author').status, 'pass');
  assert.equal(check(good.replace(JSON.stringify(schema), '{"@type":"Article", "x": (() => { globalThis.executed = true })()}'), 'json-ld').status, 'fail');
  assert.equal((globalThis as { executed?: boolean }).executed, undefined);
});

test('keyword advice and article length do not create a density or word-count penalty', () => {
  const result = analyzeSeo(good, { ...options, focusKeyword: 'something unrelated' });
  assert.equal(result.score, 100);
  assert.equal(result.checks.find(c => c.id === 'focus-keyword')?.maxPoints, 0);
  assert.equal(result.checks.find(c => c.id === 'focus-keyword')?.status, 'info');
  assert.equal(result.checks.find(c => c.id === 'word-count')?.maxPoints, 0);
});

test('draft field overlays replace only the requested fields and the article body', () => {
  const result = analyzeSeo(good, { ...options, overrides: { title: '', description: 'A draft description.', bodyHtml: '<h2>Replacement body</h2><p>A new article with <a href="/services/seo/">SEO service detail</a>.</p>' } });
  assert.equal(result.checks.find(c => c.id === 'title')?.status, 'fail');
  assert.equal(result.checks.find(c => c.id === 'h1')?.status, 'pass');
  assert.equal(result.counts.externalLinks, 0);
  assert.equal(result.counts.internalLinks, 1);
  assert.match(result.summary, /Draft fields.*not a live-publish verification/);
  assert.equal(analyzeSeo(good, options).score, 100);
  const excluded = analyzeSeo(good, { ...options, expectedNoindex: true, sitemapIncluded: false, overrides: { noindex: true } });
  assert.equal(excluded.grade, 'excluded');
  assert.equal(excluded.checks.find(c => c.id === 'robots')?.status, 'info');
  const publicDraft = analyzeSeo(good.replace('</head>', '<meta name="googlebot" content="noindex"></head>'), { ...options, overrides: { noindex: false } });
  assert.equal(publicDraft.indexable, true);
});

test('a content header is measured while global headers stay excluded', () => {
  const articleHeader = good.replace('<main><h1>Technical SEO fixes that help search engines find your site</h1>', '<main><header><h1>Technical SEO fixes that help search engines find your site</h1></header>');
  assert.equal(check(articleHeader, 'h1').status, 'pass');
});

test('malformed geometry and impossible publication dates are not reported as valid', () => {
  assert.equal(check(good.replace('width="1536"', 'width="Infinity"'), 'image-dimensions').status, 'warn');
  const impossibleDate = good.replace('2026-10-06', '2026-02-31');
  assert.equal(check(impossibleDate, 'article-schema').status, 'fail');
});

test('an author graph without main content reports missing content without throwing', () => {
  const noMain = good.replace(/<main>.*?<\/main>/s, '');
  assert.equal(check(noMain, 'main-content').status, 'fail');
  assert.equal(check(noMain, 'article-author').status, 'fail');
});
