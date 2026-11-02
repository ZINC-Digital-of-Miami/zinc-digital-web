import {test} from 'node:test';
import assert from 'node:assert/strict';
import history from '../docs/editorial/article-history.json' with {type:'json'};
import {articleGuides,authoredArticles} from '../src/data/article-library.ts';
import {articleSources} from '../src/data/article-sources.ts';
import {renderArticleMarkdown} from '../src/lib/markdown.ts';

test('canonical articles preserve source identities, publication dates and complete revision observations',()=>{
 assert.equal(history.articles.length,18);
 for(const record of history.articles){
  const original=record.observations[0].value as any;
  const article=articleGuides.find(p=>p.id===record.id)!;
  assert.ok(article,record.slug);assert.equal(article.slug,original.slug);
  assert.equal(article.dateGmt,original.dateGmt);assert.equal(article.authorName,original.author.name);
  assert.ok(original.blocks.length>0);assert.equal(record.observations.length,2);
 }
});
test('editorial checks inspect the actual canonical bodies that publishing consumes',()=>{
 for(const article of authoredArticles){
  const rendered=renderArticleMarkdown(article.markdown);
  assert.ok(articleSources(article).length,article.slug);
  assert.ok(rendered.sections.length,article.slug);
  assert.doesNotMatch(rendered.html,/For this ZINC article|Before approval, this post|model-standard posts|We have not supplied a controlled dataset/);
 }
});
