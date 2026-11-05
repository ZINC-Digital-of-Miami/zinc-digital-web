import {test} from 'node:test';
import assert from 'node:assert/strict';
import {authoredArticles as posts} from '../src/data/article-library.ts';
import {readingPath} from '../src/data/blog-strategy.ts';
test('read next keeps one service owner, excludes self and unpublished destinations',()=>{
 for(const post of posts){
  const next=readingPath(post.slug,posts);
  assert.ok(next.every(p=>p.slug!==post.slug && p.primaryService===post.primaryService));
  assert.equal(new Set(next.map(p=>p.slug)).size,next.length);
 }
 assert.deepEqual(readingPath('unknown',posts),[]);
 assert.deepEqual(readingPath(posts[0].slug,[posts[0]]),[]);
});
test('peer coverage is distributed rather than funnelled to the first articles',()=>{
 const articles=Array.from({length:8},(_,i)=>({slug:'peer-'+i,primaryService:'seo'}));
 const inbound=new Map(articles.map(p=>[p.slug,new Set<string>()]));
 for(const post of articles)for(const next of readingPath(post.slug,articles))inbound.get(next.slug)!.add(post.slug);
 for(const count of inbound.values())assert.ok(count.size>=3);
 const without=articles.slice(1);
 assert.ok(readingPath(without[0].slug,without).every(p=>p.slug!=='peer-0'));
});
