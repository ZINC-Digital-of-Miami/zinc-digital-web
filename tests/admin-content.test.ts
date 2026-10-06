import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeAdminContent} from '../src/lib/admin-content-model.ts';
const base:any[]=[{kind:'page',key:'/',path:'/',title:'Home',saved:false},{kind:'post',key:'story',path:'/blog/story/',title:'Story',meta_title:'Story',meta_description:'Repository',noindex:false,saved:false}];
const legacy={path:'/blog/story/',meta_title:'Legacy',meta_description:'Legacy description',noindex:true,updated_at:'2026-10-06',live_at:'2026-10-05',live:{}};
test('legacy article page SEO is one post target and retains pending edits',()=>{
 const items=mergeAdminContent(base,[legacy],[]);
 assert.equal(items.length,2);assert.equal(new Set(items.map(x=>x.path)).size,2);
 const post=items.find(x=>x.kind==='post')!;assert.equal(post.meta_title,'Legacy');assert.equal(post.noindex,true);assert.equal(post.pending,true);
});
test('post metadata overrides legacy values without null fields losing inherited SEO',()=>{
 const post=mergeAdminContent(base,[legacy],[{slug:'story',meta_title:null,meta_description:'Post description',noindex:false,live_at:'2026-10-06',updated_at:'2026-10-06'}])[1];
 assert.equal(post.meta_title,'Legacy');assert.equal(post.meta_description,'Post description');assert.equal(post.noindex,false);
});
test('admin-created posts and their legacy page records cannot duplicate URLs',()=>{
 const items=mergeAdminContent(base,[{path:'/blog/new/',meta_title:'Previous'}],[{slug:'new',title:'New',origin:'admin',meta_title:'New title'}]);
 assert.equal(items.length,3);assert.equal(items.filter(x=>x.path==='/blog/new/').length,1);assert.equal(items[2].meta_title,'New title');
});
