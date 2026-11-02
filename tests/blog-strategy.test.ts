import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authoredArticles as posts} from '../src/data/article-library.ts';
import {readingGuides,guideFor,readingPath} from '../src/data/blog-strategy.ts';
test('each canonical article has a reading group and only published destinations',()=>{
 for(const post of posts){
  assert.equal(readingGuides.filter(p=>(p.members as readonly string[]).includes(post.slug)).length,1);
  const guide=guideFor(post.slug)!;assert.ok(posts.some(p=>p.slug===guide.slug));
  const next=readingPath(post.slug,posts);assert.ok(next.length>0);
  assert.ok(next.every(p=>p.slug!==post.slug));assert.equal(new Set(next.map(p=>p.slug)).size,next.length);
  if(post.slug!==guide.slug)assert.equal(next[0].slug,guide.slug);
 }
});
test('reading groups omit unavailable articles without substituting archived content',()=>{
 const withoutGuide=posts.filter(p=>p.slug!=='four-pillars-of-seo-operators-view');
 assert.ok(readingPath('technical-seo-ten-fixes-that-move-rankings',withoutGuide).every(p=>p.slug!=='four-pillars-of-seo-operators-view'));
 assert.deepEqual(readingPath('unknown',posts),[]);assert.deepEqual(readingPath(posts[0].slug,[]),[]);
});
