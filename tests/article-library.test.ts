import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { authoredArticles } from '../src/data/article-library.ts';
import { articleSources } from '../src/data/article-sources.ts';
import { renderArticleMarkdown } from '../src/lib/markdown.ts';
import { blogPillars, pillarFor, readingPath } from '../src/data/blog-strategy.ts';
import { authors, authorFor } from '../src/data/authors.ts';

const migrated = JSON.parse(readFileSync(new URL('../src/data/posts.preview.json', import.meta.url), 'utf8')).posts;
const all = [...migrated, ...authoredArticles];
const serviceSlugs = new Set(['shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence']);

test('new guides are short, sourced and connected to published pillar and service pages', () => {
  assert.equal(authoredArticles.length, 23);
  assert.equal(new Set(all.map(p=>p.slug)).size, all.length);
  assert.equal(new Set(all.map(p=>p.id)).size, all.length);
  for (const post of authoredArticles) {
    const { html, sections } = renderArticleMarkdown(post.markdown);
    const words = html.replace(/<[^>]+>/g,' ').trim().split(/\s+/).length;
    assert.ok(words >= 250 && words <= 500, post.slug+' must stay a short useful guide');
    assert.ok(sections.filter(s=>/^(?:Step )?\d+[.:]/.test(s.label)).length >= 5, post.slug+' needs action steps');
    assert.ok(articleSources(post).length > 0, post.slug+' needs real source references');
    assert.equal(blogPillars.filter(p=>(p.members as readonly string[]).includes(post.slug)).length, 1);
    const pillar = pillarFor(post.slug)!;
    assert.ok(post.markdown.includes('/blog/'+pillar.slug+'/'), post.slug+' needs its pillar in the prose');
    assert.ok(readingPath(post.slug, all).length > 0);
    const author = authorFor(post.authorName);
    assert.ok(author && authors.includes(author), post.slug+' needs a known author');
    for (const [, href] of post.markdown.matchAll(/\]\((\/[^)]+)\)/g)) {
      if (href.startsWith('/blog/')) assert.ok(all.some(p=>href==='/blog/'+p.slug+'/'), post.slug+' links to an unavailable article');
      else if (href.startsWith('/services/')) assert.ok(serviceSlugs.has(href.split('/')[2]), post.slug+' links to an unavailable service');
      else assert.ok(['/work/once-upon-a-book-club/','/work/us-oil-solutions/'].includes(href), post.slug+' has an unexpected internal destination');
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
