import {test} from 'node:test';
import assert from 'node:assert/strict';
import snapshot from '../src/data/posts.preview.json' with {type:'json'};
import {articleTables} from '../src/lib/article-tables.ts';
test('restored migrated tables preserve every original cell and cover all 76 inventoried tables',()=>{
 let count=0;
 for(const post of snapshot.posts){
  const {tables,skipped}=articleTables(post.slug,post.blocks);
  for(const [index,table] of tables){
   count++;
   const original=post.blocks.slice(index,index+table.rows.length+1).map(b=>b.runs?.map(r=>r.text).join(''));
   assert.deepEqual([table.headers,...table.rows].map(row=>row.join(' · ')),original);
   for(let i=index+1;i<=index+table.rows.length;i++)assert.ok(skipped.has(i));
  }
 }
 assert.equal(count,76);
});
test('unknown articles and malformed or linked rows stay untouched',()=>{
 const source=snapshot.posts.find(p=>p.slug==='how-long-seo-actually-takes')!;
 assert.equal(articleTables('unregistered',source.blocks).tables.size,0);
 const original=articleTables(source.slug,source.blocks), first=[...original.tables.keys()][0];
 for(const change of [{type:'p',runs:[{text:'incomplete'}]},{type:'p',runs:[{text:'cell · cell · cell',href:'https://example.com/'}]}]){
  const blocks=structuredClone(source.blocks);blocks[first+1]=change;
  const result=articleTables(source.slug,blocks);
  assert.equal(result.tables.has(first),false);assert.equal(result.skipped.has(first+1),false);
 }
});
