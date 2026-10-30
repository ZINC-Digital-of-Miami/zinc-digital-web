import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {extractText} from 'unpdf';
import {categoryPosts,categoryPath} from '../src/data/blog-categories.ts';
import {renderArticleMarkdown} from '../src/lib/markdown.ts';
import {articleFeatures} from '../src/data/article-features.ts';
import {authoredArticles} from '../src/data/article-library.ts';
import {pillarFor,readingPath} from '../src/data/blog-strategy.ts';

test('content planning hub and published supporting guides link in both directions',()=>{
  const hub=articleFeatures.find(p=>p.slug==='build-a-content-hub-people-can-use')!;
  const cluster=pillarFor(hub.slug)!;
  assert.equal(cluster.slug,hub.slug);
  for(const slug of cluster.members.filter(s=>s!==hub.slug)){
    const child=authoredArticles.find(p=>p.slug===slug)!;
    assert.ok(child,slug+' is available');
    assert.ok(hub.markdown.includes('/blog/'+slug+'/'));
    assert.ok(child.markdown.includes('/blog/'+hub.slug+'/'));
    assert.equal(readingPath(slug,authoredArticles)[0].slug,hub.slug);
  }
});

test('promised downloadable PDFs contain their pages, checklist and fillable fields',async()=>{
  for(const [file,pages] of [['content-hub-workbook.pdf',6],['content-hub-architecture.pdf',2]] as const){
    const bytes=readFileSync(new URL('../public/downloads/'+file,import.meta.url));
    const result=await extractText(new Uint8Array(bytes),{mergePages:true});
    assert.equal(result.totalPages,pages);
    assert.match(result.text,/PILLAR/);
    if(pages===6){
      assert.match(bytes.toString('latin1'),/\/AcroForm/);
      assert.match(result.text,/24\./);
      assert.match(result.text,/Not applicable/);
      assert.match(result.text,/baseline/i);
    }
  }
});

test('in-article vector references are real, descriptive static assets',()=>{
  const hub=articleFeatures.find(p=>p.slug==='build-a-content-hub-people-can-use')!;
  for(const file of ['pillar-map.svg','link-plan.svg']){
    const path='/media/content-hub/'+file;
    assert.ok(hub.markdown.includes(']('+path+')'));
    const svg=readFileSync(new URL('../public'+path,import.meta.url),'utf8');
    const html=renderArticleMarkdown(hub.markdown).html;
    assert.ok(html.includes('src="'+path+'"'));
    const height=file==='pillar-map.svg'?1010:790;
    assert.ok(html.includes('width="560" height="'+height+'"'));
    assert.match(svg,/<title/);
    assert.match(svg,/<desc/);
    assert.doesNotMatch(svg,/<script|onload=|javascript:/i);
  }
});

// A pillar is a service-aligned category; a reading guide remains an article within it.
test('service-aligned pillar categories house relevant blogs without absorbing unrelated topics',()=>{
  assert.equal(categoryPath('seo'),'/blog/category/seo/');
  const members=categoryPosts('seo',authoredArticles);
  for(const slug of ['build-a-content-hub-people-can-use','content-briefs-search-intent-internal-links','internal-link-audit','content-refresh-review']) assert.ok(members.some(p=>p.slug===slug));
  assert.ok(members.every(p=>p.related.includes('seo')));
  assert.ok(!members.some(p=>p.slug==='merchant-center-feed-diagnostics'));
});
