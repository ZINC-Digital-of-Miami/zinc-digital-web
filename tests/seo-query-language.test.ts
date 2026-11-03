import{test}from'node:test';import assert from'node:assert/strict';
import{queryLanguageGroups}from'../src/lib/seo-query-language.ts';
test('wording evidence retains only generic groups and recomputes weighted rates',()=>{
 const rows=[{keys:['AI search optimization for private person'],clicks:2,impressions:10,position:2},{keys:['ai search optimisation agency'],clicks:8,impressions:90,position:12},{keys:['geo miami maps'],clicks:1000,impressions:10000,position:1}];
 const groups=queryLanguageGroups(rows),ai=groups[0];assert.equal(ai.clicks,10);assert.equal(ai.impressions,100);assert.equal(ai.ctr,.1);assert.equal(ai.position,11);assert.equal(groups[1].clicks,null);assert.doesNotMatch(JSON.stringify(groups),/private person|miami maps/);
});
test('missing returned wording rows differ from measured zero; ambiguous bare acronyms are excluded',()=>{
 const empty=queryLanguageGroups([]);assert.equal(empty[0].impressions,null);
 const zero=queryLanguageGroups([{keys:['AI SEO'],clicks:0,impressions:1,position:4},{keys:['GEO'],clicks:10,impressions:50,position:1}]);assert.equal(zero[4].clicks,0);assert.equal(zero[1].impressions,null);
});
