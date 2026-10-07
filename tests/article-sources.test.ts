import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { articleSources } from '../src/data/article-sources.ts';

const seo = 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide';
const product = 'https://support.google.com/merchants/answer/7052112';
const shopify = 'https://help.shopify.com/en/manual/online-store/seo';

test('collects official body references in paragraphs and list items with readable names', () => {
  const sources = articleSources({ blocks: [
    { runs: [{ text: 'Google SEO Starter Guide', href: seo }, { text: 'Our SEO service', href: '/services/seo/' }] },
    { items: [[{ text: 'Product data specification', href: product }], [{ text: 'Shopify SEO guidance', href: shopify }]] },
  ] });
  assert.deepEqual(sources, [
    { title: 'Google SEO Starter Guide', url: seo },
    { title: 'Product data specification', url: product },
    { title: 'Shopify SEO guidance', url: shopify },
  ]);
});

test('deduplicates the same document while retaining its first readable label', () => {
  const sources = articleSources({ blocks: [{ runs: [
    { text: 'Google SEO Starter Guide', href: seo + '#organize-your-site' },
    { text: 'Second mention', href: seo + '?utm_source=email&utm_campaign=internal#links' },
    { text: 'English guide', href: seo + '?hl=en' },
  ] }] });
  assert.deepEqual(sources, [{ title: 'Google SEO Starter Guide', url: seo + '#organize-your-site' }]);
});

test('extracts safe Markdown sources from admin article bodies without executing raw HTML', () => {
  const sources = articleSources({ slug: 'new-admin-article', markdown: `A [**Google** SEO guide](${seo}).\n\n- [Merchant Center specification](${product})\n\n<script>globalThis.sourceExecuted = true</script>\n<a href="${shopify}">Unapproved raw HTML</a>\n[Bad](javascript:alert(1))` });
  assert.deepEqual(sources, [{ title: 'Google SEO guide', url: seo }, { title: 'Merchant Center specification', url: product }]);
  assert.equal((globalThis as { sourceExecuted?: boolean }).sourceExecuted, undefined);
});

test('rejects private, local, credentialed, control-containing and deceptive destinations', () => {
  const urls = [
    'javascript:alert(1)', 'data:text/html,x', 'mailto:private@example.com', '/blog/our-guide/', '#sources',
    'https://docs.google.com/document/d/private/edit', 'https://drive.google.com/file/d/private/view',
    'https://www.zincdigital.co/blog/old/', 'https://localhost/reference', 'https://127.0.0.1/reference',
    'https://developers.google.com.evil.example/search/docs/guide', 'https://developers.google.com@evil.example/search/docs/guide',
    'https://user:password@developers.google.com/search/docs/guide', 'https://developers.google.com:444/search/docs/guide',
    'https://developers.google.com/search/docs/guide\n', 'https://developers.google.com/search/docs/guide%0a',
    'https://developers.google.com/search\\docs/guide', 'https://developers.google.com/search/docs/guide?access_token=private',
    'https://developers.google.com/search/docs/guide?company_email=private',
    'https://developers.google.com/search/docs/%ff', 'https://developers.google.com/search/docs/%C2%85',
  ];
  assert.deepEqual(articleSources({ blocks: [{ runs: urls.map(href => ({ text: 'Unsafe', href })) }] }), []);
});

test('sharing, account, ad destinations and secondary commentary are not presented as primary references', () => {
  const urls = [
    'https://www.facebook.com/sharer/sharer.php?u=private', 'https://www.linkedin.com/sharing/share-offsite/?url=private',
    'https://x.com/intent/post?text=private', 'https://ads.google.com/', 'https://accounts.google.com/',
    'https://support.google.com/share?url=private', 'https://www.shopify.com/pricing',
    'https://developers.google.com/search/docs/guide?url=https://evil.example/',
    'https://www.semrush.com/blog/seo/', 'https://searchengineland.com/seo-commentary',
  ];
  assert.deepEqual(articleSources({ blocks: [{ runs: urls.map(href => ({ text: 'Other destination', href })) }] }), []);
});

test('references are taken only from the article body, never metadata or unrelated arrays', () => {
  const post = { blocks: [{ runs: [{ text: 'SEO guide', href: seo }] }], author: { url: shopify }, related: [{ text: 'Unrelated', href: product }], sourceUrl: 'https://www.zincdigital.co/old-wordpress-article/' };
  assert.deepEqual(articleSources(post), [{ title: 'SEO guide', url: seo }]);
});

test('all 18 migrated articles already have primary references without fabricated fallbacks', () => {
  const posts = JSON.parse(readFileSync(new URL('../src/data/posts.preview.json', import.meta.url), 'utf8')).posts;
  assert.equal(posts.length, 18);
  for (const post of posts) {
    const sources = articleSources(post);
    assert.ok(sources.length > 0, post.slug + ' needs an official body reference');
    assert.equal(new Set(sources.map(source => source.url)).size, sources.length);
    assert.ok(sources.every(source => source.title && source.url.startsWith('https://')));
  }
});

test('unknown admin articles with no references stay empty instead of inventing citations', () => {
  assert.deepEqual(articleSources({ slug: 'unassigned-new-article', markdown: 'Original draft without sources.' }), []);
  assert.deepEqual(articleSources({}), []);
});

test('official accessibility and browser standards references remain available', () => {
  const urls = ['https://www.w3.org/TR/WCAG22/', 'https://web.dev/articles/vitals', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img'];
  assert.equal(articleSources({ blocks: [{ runs: urls.map(href => ({ text: 'Official standard', href })) }] }).length, 3);
});

test('official AI and Google Trends documentation can support new research guides', () => {
  const urls = ['https://developers.openai.com/api/docs/guides/tools-web-search', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool', 'https://ai.google.dev/gemini-api/docs/google-search', 'https://support.google.com/trends/answer/4365533'];
  assert.equal(articleSources({ blocks: [{ runs: urls.map(href => ({ text: 'Official tool documentation', href })) }] }).length, 4);
});

test('blank link labels receive a readable source name rather than a raw URL', () => {
  const sources = articleSources({ blocks: [{ runs: [{ text: ' \n ', href: seo }] }] });
  assert.equal(sources.length, 1);
  assert.match(sources[0].title, /Google.*seo starter guide/i);
  assert.ok(!sources[0].title.includes('https://'));
});
