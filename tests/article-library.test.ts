import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { authoredArticles,articleGuides } from '../src/data/article-library.ts';
import { articleSources } from '../src/data/article-sources.ts';
import { renderArticleMarkdown } from '../src/lib/markdown.ts';
import { readingGuides, readingPath } from '../src/data/blog-strategy.ts';
import { authors, authorFor } from '../src/data/authors.ts';

const all = authoredArticles;
const serviceSlugs = new Set(['shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence']);

test('articles retain sources and reading paths; short guides retain their instructional format', () => {
  assert.equal(authoredArticles.filter(p=>p.format!=='feature'&&!articleGuides.some(g=>g.id===p.id)).length, 23);
  assert.equal(authoredArticles.filter(p=>p.format==='feature').length, 5);
  assert.equal(new Set(all.map(p=>p.slug)).size, all.length);
  assert.equal(new Set(all.map(p=>p.id)).size, all.length);
  for (const post of authoredArticles) {
    const { html, sections } = renderArticleMarkdown(post.markdown);
    assert.ok(html.includes('<p>') && sections.length > 0, post.slug+' needs readable prose and section navigation');
    assert.ok(articleSources(post).length > 0, post.slug+' needs real source references');
    assert.equal(readingGuides.filter(p=>(p.members as readonly string[]).includes(post.slug)).length, 1);
    // Reading-guide groups are not service-aligned pillar categories. Do not
    // force an unrelated guide link or a uniform numbered outline into prose.
    assert.ok(readingPath(post.slug, all).every(p=>p.primaryService===post.primaryService));
    const author = authorFor(post.authorName);
    assert.ok(post.authorName==='Team ZINC'||(author && authors.includes(author)), post.slug+' needs a known author');
    for (const [, href] of post.markdown.matchAll(/\]\((\/[^)]+)\)/g)) {
      if (href.startsWith('/blog/category/')) { assert.ok(serviceSlugs.has(href.split('/')[3])); continue; }
      if (href.startsWith('/blog/')) assert.ok(all.some(p=>href==='/blog/'+p.slug+'/'), post.slug+' links to an unavailable article');
      else if (href.startsWith('/services/')) assert.ok(serviceSlugs.has(href.split('/')[2]), post.slug+' links to an unavailable service');
      else if(href.startsWith('/downloads/') || href.startsWith('/media/')) assert.ok(readFileSync(new URL('../public'+href,import.meta.url)).length>0,href);
      else if(href.startsWith('/locations/')) assert.ok(['/locations/miami/','/locations/panama-city/'].includes(href));
      else assert.ok(['/downloads/campaign-test-brief.pdf','/downloads/search-review-workbook.pdf','/media/blog-review/campaign-checkpoints.svg','/media/blog-review/canonical-decisions.svg','/work/us-oil-solutions/','/work/zinc-fusion-v16/','/downloads/order-acquisition-calculator.xlsx','/downloads/order-acquisition-worksheet.pdf','/media/order-economics/spending-bridge.svg','/downloads/content-hub-workbook.pdf','/downloads/content-hub-architecture.pdf','/media/content-hub/pillar-map.svg','/media/content-hub/link-plan.svg'].includes(href), post.slug+' has an unexpected internal destination');
    }
  }
});

test('all published articles retain sources without borrowing citations from metadata', () => {
  for (const post of all) assert.ok(articleSources(post).length > 0, post.slug+' lacks bottom sources');
});

test('platform references are safe public learning pages rather than ad account destinations', () => {
  assert.equal(articleSources({markdown:'[Meta objectives](https://www.facebookblueprint.com/student/path/211544-ads-manager-objectives)'}).length, 1);
  assert.equal(articleSources({markdown:'[Account](https://www.facebookblueprint.com/student/account/settings)'}).length, 0);
});
