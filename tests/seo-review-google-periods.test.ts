import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';

test('GA4 and Search Console use matched date windows while RFP reporting retains its own period',async()=>{
 mkdirSync('.scratch',{recursive:true});
 const dir=mkdtempSync(path.resolve('.scratch/google-periods-'));
 const RealDate=Date; let clocks=0;
 try{
  await build({entryPoints:['src/lib/seo-review-google.ts'],outfile:path.join(dir,'google.mjs'),bundle:true,format:'esm',platform:'node',plugins:[{name:'google-fixture',setup(b){
   b.onResolve({filter:/^\.\/google$/},()=>({path:'google',namespace:'fixture'}));
   b.onLoad({filter:/.*/,namespace:'fixture'},()=>({loader:'js',contents:`export const calls=[]; export const verifyZincAnalytics=async()=>({}); export const request=async(url,body)=>{calls.push({url,body});const landing=body.dimensions?.[0]?.name==='landingPage';return {rows:landing&&body.limit>100?Array.from({length:101},(_,i)=>({dimensionValues:[{value:'/page-'+i+'/'}],metricValues:[{value:'1'},{value:'1'},{value:'1'},{value:'0'}]})):[],metadata:{timeZone:'America/New_York'}};};`}));
  }}]});
  const {reviewGoogle}=await import(pathToFileURL(path.join(dir,'google.mjs')).href);
  globalThis.Date=class extends RealDate { constructor(...args:any[]){super(...(args.length?args:[clocks++ ? '2026-11-05T08:01:00Z' : '2026-11-05T07:59:00Z']) as [any]);} static now(){return RealDate.now();} } as DateConstructor;
  const [ga4,gsc]=await reviewGoogle({property:'123',site:'sc-domain:zincdigital.co'},new Set(Array.from({length:101},(_,i)=>'/page-'+i+'/')));
  assert.equal(ga4.available,true);assert.equal(gsc.available,true);
  for(let i=0;i<2;i++){
   assert.deepEqual(ga4.periods[i].summary.period,{startDate:gsc.periods[i].range.start,endDate:gsc.periods[i].range.end});
   assert.equal(ga4.periods[i].landingPages.limit,1000);
   assert.equal(ga4.periods[i].landingPages.rows.length,101);
  }
  assert.equal(gsc.periods[0].range.end,'2026-11-01');
  assert.notEqual(ga4.rfp.period.endDate,ga4.periods[0].summary.period.endDate);
  assert.match(ga4.note,/daily boundaries differ/);
 }finally{globalThis.Date=RealDate;rmSync(dir,{recursive:true,force:true});}
});
