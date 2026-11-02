import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {authoredArticles,articleGuides} from '../src/data/article-library.ts';
import {articleSummaries} from '../src/data/article-summaries.ts';
import {articleSources} from '../src/data/article-sources.ts';
import {renderArticleMarkdown} from '../src/lib/markdown.ts';

const all=authoredArticles;
test('every published article has distinct useful takeaways rather than an excerpt fallback',()=>{
  assert.equal(Object.keys(articleSummaries).length,all.length);
  assert.equal(new Set(Object.values(articleSummaries)).size,all.length);
  for(const p of all){assert.ok(articleSummaries[p.slug],p.slug);if('description' in p)assert.notEqual(articleSummaries[p.slug],p.description);}
});
test('substantive rewrites retain safe source references and valid local resource destinations',()=>{
  const revisions=articleGuides;
  assert.equal(revisions.length,18);
  for(const p of revisions){
    assert.ok(p);assert.ok(Number.isFinite(Date.parse(p.modifiedGmt!)));
    const {html,sections}=renderArticleMarkdown(p.markdown);
    assert.ok(sections.every(section=>html.includes(`id="${section.id}"`)));assert.ok(articleSources(p).length>=2,p.title);
    assert.doesNotMatch(html,/The reporting question is: The question is:|one pillar article|a operating cadence/);
    for(const [,href] of p.markdown.matchAll(/\]\((\/[^)]+)\)/g)){
      if(href.startsWith('/downloads/')||href.startsWith('/media/'))assert.ok(existsSync(new URL('../public'+href,import.meta.url)),href);
      if(href.startsWith('/blog/')&&!href.startsWith('/blog/category/'))assert.ok(all.some(p=>href==='/blog/'+p.slug+'/'),href);
    }
  }
});
test('new download files are real PDFs and instructional SVGs have explicit dimensions',()=>{
  for(const file of ['campaign-test-brief','search-review-workbook'])assert.equal(readFileSync(new URL('../public/downloads/'+file+'.pdf',import.meta.url)).subarray(0,5).toString(),'%PDF-');
  for(const file of ['canonical-decisions','campaign-checkpoints']){
    const html=renderArticleMarkdown('![Instructional reference](/media/blog-review/'+file+'.svg)').html;
    assert.match(html,/width="560"/);assert.match(html,/height="\d+"/);assert.match(html,/alt="Instructional reference"/);
  }
});
