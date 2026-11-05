import{test}from'node:test';import assert from'node:assert/strict';import{reviewContext}from'../src/lib/seo-review-context.ts';
test('model context preserves all page identities, issues and period totals while retaining complete source data',()=>{
 const evidence=[{id:'page:/blog/a/',path:'/blog/a/',analysis:{score:80,categories:[{name:'Metadata',score:100}],checks:[{id:'title',status:'pass'},{id:'canonical',status:'fail',detail:'Mismatch.'}]}},{id:'page-performance',pages:[{path:'/blog/a/',current:{views:5},previous:{views:2},series:{ga4:[{date:'2026-10-01',views:0},{date:'2026-10-03',views:5}],gsc:[]}}]}];
 const original=JSON.stringify(evidence),packed=reviewContext(evidence) as any[];
 assert.equal(JSON.stringify(evidence),original);assert.equal(packed[0].analysis.passedCount,1);assert.equal(packed[0].analysis.passedCheckIds,undefined);assert.equal(packed[0].analysis.checks[0].detail,'Mismatch.');assert.equal(packed[1].pages[0].current.views,5);assert.equal(packed[1].pages[0].previous.views,2);assert.equal(packed[1].pages[0].dailySummary.views.observedDays,2);assert.equal(packed[1].pages[0].dailySummary.views.median,2.5);assert.equal(packed[1].pages[0].dailySummary.views.maxDate,'2026-10-03');assert.equal(packed[1].pages[0].dailySummary.clicks.min,null);assert.equal(packed[1].pages[0].series,undefined);
});
test('grouped head values preserve duplicate fields, values and their original positions',()=>{
 const metadata=[{name:'description',content:'The same useful description.'},{name:'og:description',content:'The same useful description.'},{name:'description',content:'A conflicting duplicate.'},{name:'twitter:description',content:'The same useful description.'}];
 const signals={title:'Page title',metadata,canonical:['https://www.zincdigital.co/']};
 const source={id:'page:/',signals,analysis:{score:100,checks:[{id:'description',status:'warn'}]}};
 const packed=reviewContext([source])[0] as any;
 const restored=packed.signals.metadataValues.flatMap((v:any)=>v.fields.map((f:any)=>({...f,content:v.content}))).sort((a:any,b:any)=>a.position-b.position).map(({name,content}:any)=>({name,content}));
 assert.deepEqual(restored,metadata);assert.equal(packed.signals.metadataValues.length,2);assert.deepEqual(source.signals,signals);
 const malformed={...signals,metadata:[{name:'description',content:null}]};
 assert.deepEqual((reviewContext([{...source,signals:malformed}])[0] as any).signals,malformed);
});
