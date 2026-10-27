import {test} from 'node:test';
import assert from 'node:assert/strict';
import snapshot from '../src/data/posts.preview.json' with {type:'json'};
import edits from '../src/data/article-copy-edits.json' with {type:'json'};
import {reviseArticle} from '../src/data/article-copy.ts';
import {articleSources} from '../src/data/article-sources.ts';

test('reviewed copy edits match the archived source and preserve its primary references',()=>{
  for(const post of snapshot.posts){
    const revision=edits[post.slug as keyof typeof edits];
    assert.ok(revision,post.slug);
    for(const edit of revision.replace) assert.deepEqual(post.blocks[edit.index],edit.original,post.slug+' source changed');
    const before=JSON.stringify(post.blocks);
    const blocks=reviseArticle(post.slug,post.blocks);
    assert.equal(JSON.stringify(post.blocks),before,'source must stay unchanged');
    const retained=new Set(articleSources({blocks}).map(source=>source.url));
    for(const source of articleSources(post)) assert.ok(retained.has(source.url),post.slug+' lost '+source.url);
    const prose=blocks.flatMap(block=>block.runs || []).map(run=>run.text).join(' ').replace(/\s+/g,' ');
    assert.doesNotMatch(prose,/For this ZINC article|Before approval, this post|model-standard posts|The Prompt To Use|Advanced Prompt|all but two people here at ZINC/);
    assert.ok(blocks.some(block=>block.type==='heading'),'article still has structure');
  }
});
