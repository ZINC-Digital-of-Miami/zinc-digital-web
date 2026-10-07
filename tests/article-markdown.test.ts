import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderArticleMarkdown} from '../src/lib/markdown.ts';

test('article contents link to unique rendered headings with readable labels',()=>{
  const result=renderArticleMarkdown('## Read **the evidence** &amp; verify\n\nText.\n\n## Read **the evidence** &amp; verify');
  assert.deepEqual(result.sections,[{id:'article-section-0',label:'Read the evidence & verify'},{id:'article-section-1',label:'Read the evidence & verify'}]);
  for(const section of result.sections)assert.ok(result.html.includes('id="'+section.id+'"'));
});

test('article navigation preserves the Markdown sanitization boundary',()=>{
  const result=renderArticleMarkdown('## Useful [link](javascript:alert(1))\n\n<script>alert(1)</script>\n\n[Safe](/services/seo/)');
  assert.ok(!result.html.includes('<script>'));
  assert.ok(!result.html.includes('href="javascript:'));
  assert.ok(result.html.includes('href="/services/seo/"'));
  assert.equal(result.sections[0].label,'Useful link');
});
