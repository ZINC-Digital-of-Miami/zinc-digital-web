import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { blogPillars, pillarFor, readingPath } from '../src/data/blog-strategy.ts';

const posts: { slug: string; blocks: { type: string; runs?: { href?: string }[] }[] }[] = JSON.parse(readFileSync(new URL('../src/data/posts.preview.json', import.meta.url), 'utf8')).posts;

test('every current article has one published pillar and a useful reading path', () => {
  for (const post of posts) {
    assert.equal(blogPillars.filter(p => (p.members as readonly string[]).includes(post.slug)).length, 1);
    const pillar = pillarFor(post.slug)!;
    assert.ok(posts.some(p => p.slug === pillar.slug));
    const next = readingPath(post.slug, posts);
    assert.ok(next.length > 0);
    assert.ok(next.every(p => p.slug !== post.slug));
    assert.equal(new Set(next.map(p => p.slug)).size, next.length);
    if (post.slug !== pillar.slug) assert.equal(next[0].slug, pillar.slug);
    const links = post.blocks.filter(b => b.type === 'p').flatMap(b => b.runs || []).map(r => r.href).filter(Boolean);
    assert.ok(links.some(href => href!.startsWith('/services/')), post.slug + ' needs a contextual service link');
    if (post.slug !== pillar.slug) assert.ok(links.includes('/blog/' + pillar.slug + '/'), post.slug + ' needs its guide link in the prose');
  }
});

test('reading paths omit unpublished articles and fall back safely for new admin posts', () => {
  const slug = 'technical-seo-ten-fixes-that-move-rankings';
  const withoutHub = posts.filter(p => p.slug !== 'four-pillars-of-seo-operators-view');
  assert.ok(readingPath(slug, withoutHub).every(p => p.slug !== 'four-pillars-of-seo-operators-view'));
  assert.deepEqual(readingPath(slug, []), []);
  assert.deepEqual(readingPath('new-admin-article', posts), []);
});
