import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeAdminContent} from '../src/lib/admin-content-model.ts';
import {articleEditorial} from '../src/data/article-editorial.ts';
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
test('saved null SEO fields inherit article defaults without losing explicit edits',()=>{
 const editorial=articleEditorial['google-search-console-the-operators-guide'];
 const repository:any[]=[{...base[1],meta_title:editorial.title,meta_description:editorial.description,focus_keyword:editorial.keywords[0]}];
 const inherited=mergeAdminContent(repository,[],[{slug:'story',meta_title:null,meta_description:null,focus_keyword:null,noindex:null}])[0];
 assert.equal(inherited.meta_title,editorial.title);
 assert.equal(inherited.meta_description,editorial.description);
 assert.equal(inherited.focus_keyword,editorial.keywords[0]);
 assert.equal(inherited.noindex,false);
 const edited=mergeAdminContent(repository,[],[{slug:'story',meta_title:'Custom title',meta_description:'',focus_keyword:'',noindex:true}])[0];
 assert.equal(edited.meta_title,'Custom title');assert.equal(edited.meta_description,'');assert.equal(edited.focus_keyword,'');assert.equal(edited.noindex,true);
 assert.equal(repository[0].meta_title,editorial.title);
});
