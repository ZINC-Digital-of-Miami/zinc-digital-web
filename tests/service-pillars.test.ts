import {test} from 'node:test';
import assert from 'node:assert/strict';
import {categoryPosts} from '../src/data/blog-categories.ts';
import {proposalPillar} from '../src/lib/proposal-pillar.ts';
import {contentInput} from '../src/lib/admin-input.ts';
import {publishedContent} from '../src/lib/content-model.ts';

test('primary ownership alone controls membership and proposal selection',()=>{
 const article={primaryService:'tiktok-ads',related:['social-ads','business-intelligence']};
 assert.equal(categoryPosts('tiktok-ads',[article]).length,1);
 assert.equal(categoryPosts('social-ads',[article]).length,0);
 assert.equal(proposalPillar(article.primaryService),'tiktok-ads');
 assert.equal(proposalPillar(article.related),undefined);
 assert.equal(proposalPillar('invalid'),undefined);
});
test('admin accepts explicit service assignments and rejects unknown services',()=>{
 assert.equal(contentInput({kind:'post',slug:'story',primary_service:'apps'},[]).patch.primary_service,'apps');
 assert.equal(contentInput({kind:'post',slug:'story',primary_service:''},[]).patch.primary_service,null);
 assert.throws(()=>contentInput({kind:'post',slug:'story',primary_service:'invalid'},[]),/service/i);
});
test('published admin posts retain their explicit service, drafts never override it',()=>{
 const live={id:1,slug:'story',origin:'admin',status:'published',title:'Story',layer:'Build',primary_service:'apps',body:'A workflow',published_at:'2026-11-01T12:00:00Z'};
 const result=publishedContent([],[],[],[{live,...{primary_service:'seo'}}]);
 assert.equal(result.posts[0].primaryService,'apps');
 assert.throws(()=>publishedContent([],[],[],[{live:{...live,primary_service:null}}]),/primary service/i);
});
