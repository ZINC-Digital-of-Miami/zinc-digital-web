import {test} from 'node:test';
import assert from 'node:assert/strict';
import {siteStructure,internalPath} from '../src/lib/seo-review-structure.ts';
test('structural evidence checks exact ownership, eligibility, inbound peers and missing scans',()=>{
 const pages=[{path:'/blog/a/',template:'article',words:500,h1:['A'],targets:['/services/seo/','/blog/category/seo/','/work/approved/','/blog/b/'],authorTypes:['Organization']},{path:'/blog/b/',template:'article',words:600,h1:['B'],targets:['/services/seo/'],authorTypes:['Person']}];
 const result=siteStructure({pages,posts:[{slug:'a',primaryService:'seo'},{slug:'b',primaryService:'apps'}],services:[{slug:'seo'},{slug:'apps'}],cases:[{slug:'approved',services:['seo']}],inventory:new Set(pages.map(p=>p.path).concat('/work/approved/')),focusKeywords:[{path:'/blog/a/',keyword:'Same'},{path:'/blog/b/',keyword:'same'}],overlapGroups:[]});
 assert.deepEqual(result.postsWithoutPrimaryServiceLink,['/blog/b/']);
 assert.deepEqual(result.postsWithoutPrimaryPillarLink,['/blog/b/']);
 assert.deepEqual(result.postsWithoutEligibleCaseLink,[]);
 assert.deepEqual(result.postsWithoutEligibleCase,['/blog/b/']);
 assert.equal(result.articleInbound.find(p=>p.path==='/blog/b/')?.fromArticles,1);
 assert.equal(result.pillars.find(p=>p.slug==='apps')?.articles,1);
 assert.equal(result.duplicateFocusKeywords.length,1);
 assert.match(result.basis,/main/);
 assert.deepEqual(result.organizationBylines,['/blog/a/']);
});
test('internal paths drop tracking fragments but reject external URLs',()=>{
 assert.equal(internalPath('/blog/a/?utm_source=x#one'),'/blog/a/');
 assert.equal(internalPath('https://www.zincdigital.co/services/seo/'),'/services/seo/');
 assert.equal(internalPath('https://not-zinc.co/services/seo/'),null);
 assert.equal(internalPath('//not-zinc.co/'),null);
});
