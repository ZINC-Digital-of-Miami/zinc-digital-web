import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,rmSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {validateReview,REVIEW_AREAS} from '../src/lib/seo-review.ts';

test('site scans honour canonical noindex intent without excusing unexpected public noindex',async()=>{
 mkdirSync('.scratch',{recursive:true});
 const dir=mkdtempSync(path.resolve('.scratch/seo-evidence-test-')),original=globalThis.fetch;
 try{
  await build({entryPoints:['src/lib/seo-review-evidence.ts'],outfile:path.join(dir,'evidence.mjs'),bundle:true,format:'esm',platform:'node',packages:'external',define:{'import.meta.env':'{}'},plugins:[{name:'evidence-fixtures',setup(b){
   b.onResolve({filter:/^\.\/(content|google|seo-review-google|seo-review-performance)$/},args=>({path:args.path,namespace:'fixture'}));
   b.onLoad({filter:/.*/,namespace:'fixture'},args=>({loader:'js',contents:args.path==='./content'?`export const loadPublished=async()=>({routes:[{path:'/',template:'home'},{path:'/thanks/',template:'thanks'},{path:'/unexpected/',template:'home'}],posts:[]});`:args.path==='./google'?`export const savedGoogleSettings=async()=>({property:'123',site:'sc-domain:zincdigital.co'});`:args.path==='./seo-review-google'?`export const reviewGoogle=async()=>[];`:`export const collectPagePerformance=async()=>({id:'page-performance',available:false});`}));
  }}]});
  globalThis.fetch=(async input=>{
   const url=new URL(String(input)),p=url.pathname;
   if(p==='/sitemap.xml')return new Response('<urlset><url><loc>https://www.zincdigital.co/</loc></url><url><loc>https://www.zincdigital.co/unexpected/</loc></url></urlset>');
   if(p==='/robots.txt'||p==='/llms.txt')return new Response('Public fixture');
   return new Response(`<html><head><title>A useful page title for the site scan</title><meta name="description" content="A useful page description with enough context to explain the page to readers before they choose whether to visit."><link rel="canonical" href="${url}">${p==='/'?'':'<meta name="robots" content="noindex,nofollow">'}</head><body><main><h1>Useful page</h1><p>A concrete answer and useful next step.</p></main></body></html>`,{headers:{'content-type':'text/html'}});
  }) as typeof fetch;
  const sb={from:()=>({select:()=>({abortSignal:async()=>({data:[],error:null})})})};
  const {collectReviewEvidence}=await import(pathToFileURL(path.join(dir,'evidence.mjs')).href);
  const {evidence,paths}=await collectReviewEvidence(sb);
  assert.equal(evidence.find((e:any)=>e.path==='/thanks/').analysis.grade,'excluded');
  assert.equal(evidence.find((e:any)=>e.path==='/unexpected/').analysis.grade,'blocked');
  assert.equal(evidence.find((e:any)=>e.id==='crawl-coverage').available,true);
  const cited=evidence.find((e:any)=>e.id==='research:ahrefs');assert.equal(cited.url,'https://ahrefs.com/blog/ai-marketing-trends/');
  const report={summary:'Fixture review.',checks:REVIEW_AREAS.map(area=>({area,status:'unavailable',detail:'Fixture evidence only.',evidenceIds:['research:ahrefs']})),recommendations:[]};
  assert.doesNotThrow(()=>validateReview(report,new Map(evidence.map((e:any)=>[e.id,e])),paths));
 }finally{globalThis.fetch=original;rmSync(dir,{recursive:true,force:true});}
});
