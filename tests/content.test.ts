import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderMarkdown} from '../src/lib/markdown.ts';
import {publishedContent} from '../src/lib/content-model.ts';
test('Markdown escapes executable HTML, rejects unsafe links and external images',()=>{
 const html=renderMarkdown('<script>alert(1)</script>\n\n[bad](javascript:alert%281%29) ![remote](https://example.com/pixel) ![local](/assets/photo.webp) [safe](https://example.com/)');
 assert.ok(!html.includes('<script>'));assert.ok(!html.includes('href="javascript:'));assert.ok(!html.includes('src="https:'));assert.match(html,/src="\/assets\/photo.webp"/);assert.match(html,/href="https:\/\/example.com\//);
});
test('build uses live snapshots, excludes draft posts, adds published admin posts and SEO',()=>{
 const repo:any={id:1,slug:'old',title:'Old',date:'2026-09-01',dateGmt:'2026-09-01',author:{name:'Author'},layer:'Build',blocks:[],related:[]};
 const result=publishedContent([{path:'/',template:'home',title:'Home'},{path:'/blog/old/',template:'article',title:'Old',slug:'old'}],[repo],[{live:{path:'/',meta_title:'Live SEO',noindex:true}}],[{live:{slug:'old',status:'draft'}},{live:{slug:'new',id:'id',origin:'admin',status:'published',title:'Published',layer:'Demand',body:'# Real',meta_description:'Published description'},live_at:'2026-10-05T12:00:00Z'},{live:null}]);
 assert.deepEqual(result.posts.map(p=>p.slug),['new']);assert.equal(result.posts[0].markdown,'# Real');assert.equal(result.routes[0].metaTitle,'Live SEO');assert.equal(result.routes[0].noindex,true);assert.equal(result.routes.find(r=>r.slug==='new')?.metaDescription,'Published description');assert.ok(!result.routes.some(r=>r.slug==='old'));
});
test('unsnapshotted saved fields do not overwrite repository content',()=>{
 const routes:any=[{path:'/',title:'Home',template:'home'}];
 const result=publishedContent(routes,[],[{live:null,...{meta_title:'Unpublished'}}],[]);
 assert.equal(result.routes[0].title,'Home');assert.equal(result.routes[0].metaTitle,undefined);assert.notEqual(result.routes[0],routes[0]);
});
test('a published layer edit reaches the article route and preserves its first publication date',()=>{
 const date='2026-09-01T12:00:00Z';
 const post:any={slug:'existing',title:'Original',date,dateGmt:date,author:{name:'Team ZINC'},layer:'Build',blocks:[],related:[]};
 const result=publishedContent([{path:'/blog/existing/',template:'article',title:'Original',slug:'existing',layer:'Build',published:date}],[post],[],[{live:{slug:'existing',title:'Updated',layer:'Demand',status:'published',published_at:date},live_at:'2026-10-05T14:00:00Z'}]);
 assert.equal(result.posts[0].layer,'Demand');assert.equal(result.routes[0].layer,'Demand');
 assert.equal(result.routes[0].published,date);assert.equal(result.posts[0].date,date);
});
