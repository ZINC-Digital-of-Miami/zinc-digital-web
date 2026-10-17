import {test} from 'node:test';
import assert from 'node:assert/strict';
import {brandTitle,serializeSchema,pageEntity,sitemapDocument,discoveryDocument} from '../src/lib/public-seo.ts';
import {pageEditorial} from '../src/data/page-editorial.ts';
const site='https://www.zincdigital.co';
test('search titles add one brand suffix while preserving an explicit saved title',()=>{
 assert.equal(brandTitle('SEO services'),'SEO services | ZINC');
 assert.equal(brandTitle('Saved SEO title | ZINC'),'Saved SEO title | ZINC');
});
test('JSON-LD cannot close its script element through published content',()=>{
 const value={description:'</script><script>alert(1)</script> & text\u2028'};
 const encoded=serializeSchema(value);assert.doesNotMatch(encoded,/[<>&\u2028]/);assert.deepEqual(JSON.parse(encoded),value);
});
test('page entities connect canonical page, image, breadcrumbs and organization without fabricated facts',()=>{
 const entity=pageEntity(site,{path:'/contact/',template:'contact'},'Contact ZINC','Talk about the work.',site+'/og/home.png');
 assert.equal(entity['@type'],'ContactPage');assert.equal(entity.url,site+'/contact/');assert.deepEqual(entity.isPartOf,{'@id':site+'/#site'});assert.deepEqual(entity.breadcrumb,{'@id':site+'/contact/#breadcrumb'});assert.deepEqual(entity.publisher,{'@id':site+'/#org'});
 for(const field of ['aggregateRating','review','openingHours','geo'])assert.equal(field in entity,false);
});
test('sitemap follows published route visibility and uses real modification dates without inventing freshness',()=>{
 const xml=sitemapDocument(site,[{path:'/',template:'home'},{path:'/blog/guide/',template:'article',published:'2025-01-01',modified:'2026-10-01T12:00:00Z'},{path:'/thanks/',template:'thanks'},{path:'/hidden/',template:'service',noindex:true},{path:'/admin/',template:'admin'}],new Set(['/thanks/']));
 assert.match(xml,/<loc>https:\/\/www.zincdigital.co\/blog\/guide\/<\/loc><lastmod>2026-10-01<\/lastmod>/);assert.doesNotMatch(xml,/thanks|hidden|admin/);assert.match(xml,/<url><loc>https:\/\/www.zincdigital.co\/<\/loc><\/url>/);
});
test('AI discovery uses only supplied published/indexable routes, including admin articles and both factual offices',()=>{
 const doc=discoveryDocument(site,[{path:'/',template:'home',title:'ZINC'},{path:'/about/',template:'about',title:'About'},{path:'/services/seo/',template:'service',title:'SEO',metaDescription:'Search services.'},{path:'/blog/new/',template:'article',title:'New published guide',metaDescription:'Real guide.'},{path:'/blog/hidden/',template:'article',title:'Hidden',noindex:true}],{email:'hello@zincdigital.co',phone:'+1-786-575-4837',studios:[{name:'Miami HQ',street:'1900 N Bayshore Dr',city:'Miami',zip:'33132'},{name:'Panama City satellite',street:'97 Oak Ave, Suite 7',city:'Panama City',zip:'32401'}]},new Set());
 assert.match(doc,/New published guide/);assert.match(doc,/Panama City satellite/);assert.match(doc,/Miami HQ/);assert.doesNotMatch(doc,/hidden|guaranteed rankings|GEO|training permission/i);assert.match(doc,/not an indexing guarantee/);
});
test('curated page metadata is distinct and preserves registered work and service names',()=>{
 const values=Object.values(pageEditorial);assert.equal(new Set(values.map(value=>value.metaTitle)).size,values.length);assert.equal(new Set(values.map(value=>value.metaDescription)).size,values.length);
 assert.match(pageEditorial['/services/ai-search-optimization/'].metaTitle,/Generative Search Optimization/);
 assert.match(pageEditorial['/'].metaDescription,/Miami.*Panama City/);
 assert.match(pageEditorial['/work/zinc-fusion-v16/'].metaDescription,/in development/i);
});
