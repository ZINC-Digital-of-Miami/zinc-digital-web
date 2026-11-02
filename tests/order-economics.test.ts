import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {extractText} from 'unpdf';
import {articleFeatures} from '../src/data/article-features.ts';
import {renderArticleMarkdown} from '../src/lib/markdown.ts';
import {articleSources} from '../src/data/article-sources.ts';

const post=articleFeatures.find(p=>p.slug==='what-can-you-afford-to-spend-on-an-order')!;
test('scheduled order economics article retains Jaymie, original example and complete sign-off',()=>{
  assert.equal(post.authorName,'Jaymie Wilhoit');
  assert.equal(post.authorId,2);
  assert.deepEqual(post.related,['shopify','shopping-ads','business-intelligence']);
  assert.equal(post.markdown.trim(),readFileSync(new URL('../docs/editorial/articles/'+post.slug+'.md',import.meta.url),'utf8').trim());
  assert.equal([...post.markdown.matchAll(/^\d+\. \*\*/gm)].length,12);
  assert.match(post.markdown,/invented USD examples, not ZINC or client results/);
  assert.match(post.markdown,/fully refunded order remains/);
  assert.match(post.markdown,/\$86 − \$50 − \$6 − \$12 = \$18/);
  assert.ok(articleSources(post).length===3);
});
test('promised worksheet has all twelve sign-offs, real form fields and four pages',async()=>{
  const bytes=readFileSync(new URL('../public/downloads/order-acquisition-worksheet.pdf',import.meta.url));
  const result=await extractText(new Uint8Array(bytes),{mergePages:true});
  assert.equal(result.totalPages,4);
  for(const title of ['Scope','Revenue','Recovery','Denominators','Reconciliation','Ownership']) assert.ok(result.text.includes(title));
  const raw=bytes.toString('latin1');
  assert.match(raw,/\/AcroForm/);
  for(let i=1;i<=12;i++) assert.ok(raw.includes('check_'+i+'_Pass')&&raw.includes('check_'+i+'_Fix')&&raw.includes('check_'+i+'_N/A'));
  assert.match(result.text,/It does not calculate/);
  const xlsx=readFileSync(new URL('../public/downloads/order-acquisition-calculator.xlsx',import.meta.url));
  assert.equal(xlsx.subarray(0,2).toString(),'PK');
});
test('instructional cost bridge has exact dimensions and accessible static content',()=>{
  const href='/media/order-economics/spending-bridge.svg';
  const svg=readFileSync(new URL('../public'+href,import.meta.url),'utf8');
  assert.match(svg,/<title/);assert.match(svg,/<desc/);
  assert.doesNotMatch(svg,/<script|onload=|javascript:/i);
  assert.ok(renderArticleMarkdown(post.markdown).html.includes('width="560" height="930"'));
  assert.match(svg,/\$86/);assert.match(svg,/\$18/);
});
