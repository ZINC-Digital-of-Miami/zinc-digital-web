import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mergeAdminContent,contentChanged} from '../src/lib/admin-content-model.ts';
import {articleEditorial} from '../src/data/article-editorial.ts';
const base:any[]=[{kind:'page',key:'/',path:'/',title:'Home',saved:false},{kind:'post',key:'story',path:'/blog/story/',title:'Story',meta_title:'Story',meta_description:'Repository',noindex:false,saved:false}];
test('saving an unchanged repository article needs no override or new modification date',()=>{
 const article:any={...base[1],status:'published',primary_service:'seo',layer:'Demand',excerpt:'A practical guide.',author:'Team ZINC',focus_keyword:''};
 const submitted={title:article.title,status:article.status,primary_service:'seo',layer:'Demand',excerpt:article.excerpt,author:article.author,meta_title:'Story',meta_description:'Repository',focus_keyword:'',noindex:false};
 assert.equal(contentChanged(article,submitted),false);
 assert.equal(contentChanged(article,{...submitted,meta_description:'A substantively revised description.'}),true);
 assert.equal(article.saved,false);
});
test('change detection preserves intentional clears and indexing/service changes',()=>{
 const draft:any={...base[1],primary_service:null,focus_keyword:null};
 assert.equal(contentChanged(draft,{focus_keyword:'',primary_service:null}),false);
 assert.equal(contentChanged(draft,{meta_description:''}),true);
 assert.equal(contentChanged({...draft,noindex:true},{noindex:false}),true);
 assert.equal(contentChanged({...draft,primary_service:'seo'},{primary_service:null}),true);
 const cleared=mergeAdminContent(base,[],[{slug:'story',meta_title:'',author:'',live_at:'2026-11-01T12:00:00Z',updated_at:'2026-11-01T12:00:00Z'}]).find(item=>item.kind==='post')!;
 assert.equal(cleared.meta_title,'');
 assert.equal(contentChanged(cleared,{meta_title:'',author:''}),false);
 assert.equal(contentChanged(cleared,{author:'Team ZINC'}),true);
 assert.equal(contentChanged(cleared,{meta_title:'Story'}),true);
});
test('unchanged saved content keeps its stored timestamp while actual body edits remain saves',()=>{
 const saved:any={...base[1],body:'## Original guide',updated_at:'2026-11-01T12:00:00Z'};
 assert.equal(contentChanged(saved,{body:'## Original guide'}),false);
 assert.equal(contentChanged(saved,{body:'## Revised guide'}),true);
 assert.equal(saved.updated_at,'2026-11-01T12:00:00Z');
});
test('a new saved draft with null metadata keeps the untouched editor defaults',()=>{
 const draft=mergeAdminContent([],[],[{slug:'new-post',title:'New post',origin:'admin',meta_title:null,author:null,layer:null,primary_service:null,noindex:null}])[0];
 assert.equal(contentChanged(draft,{meta_title:'New post',author:'Team ZINC',layer:'Build',primary_service:null,noindex:false}),false);
 assert.equal(contentChanged(draft,{meta_title:''}),true);
 assert.equal(contentChanged(draft,{author:''}),true);
});
test('article metadata has one owner and cannot fall back to a page record',()=>{
 assert.throws(()=>mergeAdminContent(base,[{path:'/blog/story/',meta_title:'Wrong owner'}],[]),/must be stored in Posts/);
 const post=mergeAdminContent(base,[],[{slug:'story',meta_title:'Saved title',noindex:true,updated_at:'2026-10-06',live_at:'2026-10-05'}])[1];
 assert.equal(post.meta_title,'Saved title');assert.equal(post.noindex,true);assert.equal(post.pending,true);
});
test('admin-created posts are added once with their saved metadata',()=>{
 const items=mergeAdminContent(base,[],[{slug:'new',title:'New',origin:'admin',meta_title:'New title'}]);
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
