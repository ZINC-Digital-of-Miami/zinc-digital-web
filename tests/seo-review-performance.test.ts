import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';

mkdirSync('.scratch',{recursive:true});
const dir=mkdtempSync(path.resolve('.scratch/seo-performance-test-'));
after(()=>rmSync(dir,{recursive:true,force:true}));
await build({entryPoints:['src/lib/seo-review-performance.ts'],outfile:path.join(dir,'performance.mjs'),bundle:true,format:'esm',platform:'node',packages:'external',plugins:[{name:'native-source-fixtures',setup(b){
 b.onResolve({filter:/^\.\/google$/},()=>({path:'google',namespace:'fixture'}));
 b.onResolve({filter:/^\.\.\/data\/site$/},()=>({path:'site',namespace:'fixture'}));
 b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path==='site'?`export const services=[{slug:'seo',title:'SEO'},{slug:'ai-search-optimization',title:'AI Search'}];`:`export const request=(url,body)=>globalThis.__zincPerformanceFixture.request(url,body);export const verifyZincAnalytics=property=>globalThis.__zincPerformanceFixture.verify(property);`,loader:'js'}));
}}]});
const {collectPagePerformance}=await import(pathToFileURL(path.join(dir,'performance.mjs')).href);
const posts=[{slug:'a',title:'Article A',related:['seo','ai-search-optimization']},{slug:'b',title:'Article B',related:['seo']}];
const paths=new Set(['/blog/a/','/blog/b/','/services/seo/','/services/ai-search-optimization/','/blog/category/seo/','/blog/category/ai-search-optimization/']);
const settings={property:'123',site:'https://www.zincdigital.co/'};

test('native page performance preserves canonical pillars, source grain, missing rows and exact referrers',async()=>{
 const calls:{url:string;body:any}[]=[];let verified=0;
 (globalThis as any).__zincPerformanceFixture={verify:async()=>{verified++;},request:async(url:string,body:any)=>{
  calls.push({url,body});const dims=(body.dimensions||[]).map((d:any)=>typeof d==='string'?d:d.name),current=String(body.dateRanges?.[0]?.endDate||body.endDate)>new Date(Date.now()-15*86400000).toISOString().slice(0,10);
  if(url.includes('analyticsdata')){
   if(dims.includes('pageReferrer'))return {metadata:{subjectToThresholding:true},rows:[{dimensionValues:[{value:'/services/seo/'},{value:'https://www.zincdigital.co/blog/a/?email=private@example.com'}],metricValues:[{value:current?'4':'2'}]},{dimensionValues:[{value:'/services/seo/'},{value:'https://evil.example/blog/a/'}],metricValues:[{value:'999'}]}]};
   if(dims.includes('date'))return {metadata:{timeZone:'America/Chicago'},rows:[{dimensionValues:[{value:'/blog/a/'},{value:body.dateRanges[0].startDate.replaceAll('-','')}],metricValues:[{value:'10'},{value:'20'}]}]};
   return {metadata:{timeZone:'America/Chicago'},rows:[{dimensionValues:[{value:'/blog/a/'}],metricValues:[{value:current?'10':'8'},{value:'20'}]}]};
  }
  const row=(url:string,clicks:number)=>({keys:dims.includes('date')?[url,body.startDate]:[url],clicks,impressions:clicks*2});
  return {rows:[row('https://www.zincdigital.co/blog/a/',current?5:3),row('https://www.zincdigital.co/blog/a/?campaign=private',current?2:1),row('https://evil.example/blog/a/',999)]};
 }};
 const result=await collectPagePerformance(settings,posts,paths,Date.now()+10000,false);
 assert.equal(verified,1);assert.equal(result.pillars.length,2);assert.equal(result.pillars[0].articlePaths.length,2);
 const a=result.pages.find((p:any)=>p.path==='/blog/a/'),b=result.pages.find((p:any)=>p.path==='/blog/b/');
 assert.equal(a.current.views,10);assert.equal(a.previous.views,8);assert.equal(a.current.clicks,7);assert.equal(b.current.views,null);assert.equal(b.series.ga4.length,0);
 assert.equal(result.pillars.find((p:any)=>p.slug==='seo').serviceReferrals.current,4);
 assert.equal(result.pillars.find((p:any)=>p.slug==='ai-search-optimization').serviceReferrals.current,null);
 assert.deepEqual(result.transitions,[{articlePath:'/blog/a/',servicePath:'/services/seo/',current:4,previous:2}]);
 assert.ok(result.notes.some((note:string)=>/article-to-service.*thresholding/.test(note)));
 assert.doesNotMatch(JSON.stringify(result),/private@example|campaign=|evil\.example/);
 const analytics=calls.filter(c=>c.url.includes('analyticsdata'));assert.equal(analytics.length,5);assert.ok(analytics.every(c=>JSON.stringify(c.body.dimensionFilter).includes('hostName')));
 assert.ok(calls.filter(c=>!c.url.includes('analyticsdata')).every(c=>c.body.dataState==='final'));
});
test('expired evidence deadlines yield explicit gaps and no native data calls',async()=>{
 let calls=0;(globalThis as any).__zincPerformanceFixture={verify:async()=>{},request:async()=>{calls++;throw new Error('Unexpected call');}};
 const result=await collectPagePerformance(settings,posts,paths,Date.now()-1,true);
 assert.equal(calls,0);assert.equal(result.available,false);assert.equal(result.sources.ga4.available,false);assert.equal(result.sources.gsc.available,false);
 assert.ok(result.pages.every((p:any)=>p.current.views===null&&p.current.clicks===null));
});
