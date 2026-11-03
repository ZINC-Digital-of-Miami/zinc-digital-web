import type {SupabaseClient} from '@supabase/supabase-js';
import {SITE,services,STUDIOS,PHONE,EMAIL} from '../data/site';
import {loadPublished} from './content';
import {analyzeSeo} from './seo-analysis';
import {pageEvidence} from './seo-agent';
import {seoTarget,boundedText,sitemapMembership} from './seo-service';
import {savedGoogleSettings} from './google';
import {reviewGoogle} from './seo-review-google';
import {GA4_TAG} from './analytics';
import {reviewSignals} from './seo-review-signals';
import {collectPagePerformance} from './seo-review-performance';
import {seoResearch} from '../data/seo-review-research';

export type Evidence={id:string;available?:boolean;gap?:unknown;[key:string]:unknown};
/** Fixed-origin, bounded reads. Neither the model nor page content chooses network destinations. */
export async function readPublic(path:string,send:typeof fetch=fetch,deadline=Date.now()+10000){
 if(!['/sitemap.xml','/robots.txt','/llms.txt'].includes(path))seoTarget(path);
 const res=await send(SITE+path,{redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(Math.max(1,Math.min(10000,deadline-Date.now())))});
 const headers={contentType:res.headers.get('content-type'),robots:res.headers.get('x-robots-tag')};
 return {status:res.status,headers,text:await boundedText(res)};
}
export async function collectReviewEvidence(sb:SupabaseClient,deadline=Date.now()+60000):Promise<{evidence:Evidence[];paths:Set<string>}>{
 const published=await loadPublished();
 const routes=published.routes.filter(r=>!r.path.startsWith('/admin/')&&!r.path.startsWith('/api/'));
 if(routes.length>300)throw new Error('The public inventory exceeds 300 pages. Expand the reviewed scope before running Claude.');
 const paths=new Set(['/',...routes.map(r=>r.path)]);
 const evidence:Evidence[]=[];
 const [globals,[pages,posts],settings]=await Promise.all([
  Promise.all(['/sitemap.xml','/robots.txt','/llms.txt'].map(async path=>{try{return {id:path,path,...await readPublic(path,fetch,deadline)};}catch{return {id:path,path,available:false,gap:'Public file could not be read.'};}})),
  Promise.all([sb.from('pages').select('path,meta_title,meta_description,focus_keyword,canonical,noindex,status,updated_at,live_at').abortSignal(AbortSignal.timeout(10000)),sb.from('posts').select('slug,meta_title,meta_description,focus_keyword,noindex,status,updated_at,live_at').abortSignal(AbortSignal.timeout(10000))]),
  savedGoogleSettings(sb),
 ]);
 evidence.push(...globals.map(g=>({...g,...('text' in g?{text:g.text.slice(0,32000),truncated:g.text.length>32000}:{})})));
 const sitemap=globals.find(g=>g.path==='/sitemap.xml');
 if(pages.error||posts.error)throw new Error('Saved SEO settings could not be read. No review was requested.');
 evidence.push({id:'settings',source:'Current server configuration and saved SEO settings',origin:SITE,commit:import.meta.env.VERCEL_GIT_COMMIT_SHA||'local preparation',analyticsTag:GA4_TAG,analyticsEnabled:import.meta.env.PUBLIC_ANALYTICS==='on',google:{property:settings.property,site:settings.site},review:{model:'claude-opus-5-5',effort:'high',schedule:'Monday 8 AM America/Chicago',approval:'Recommendations only'},business:{principalBase:'Panama City',priorityGrowthMarket:'Miami',listedStudios:STUDIOS,phone:PHONE,email:EMAIL,services:services.map(s=>({title:s.title,path:'/services/'+s.slug+'/'}))},savedMetadata:{pages:pages.data,posts:posts.data},note:'Saved settings may await publication. Unpublished bodies, inquiries, staff records and secrets are excluded.'});
 const marketFresh=Date.now()-Date.parse(seoResearch.marketDemand.checkedAt+'T00:00:00Z')<=30*86400000;
 evidence.push({id:'industry-research',available:true,...seoResearch},{id:'market-demand',...seoResearch.marketDemand,available:marketFresh,...(!marketFresh?{gap:'The retained market-volume research is older than 30 days. Refresh research before claiming current demand; no automatic paid refresh was performed.'}:{})});
 const traffic=reviewGoogle(settings,paths).then(async sources=>{
  // Finish the first GA4 batch before the per-page batch; standard properties allow ten concurrent reports.
  const performance=await collectPagePerformance(settings,published.posts,paths,deadline,sources.some(s=>s.id==='ga4'&&s.available));
  return [...sources,{...performance}];
 });
 // Eight fixed workers cap origin pressure. Preserve inventory order for stable source IDs.
 const scanned:Evidence[]=new Array(routes.length);let next=0;
 await Promise.all(Array.from({length:Math.min(8,routes.length)},async()=>{
  while(next<routes.length){const i=next++,route=routes[i];
   const id='page:'+route.path;
   if(Date.now()>=deadline){scanned[i]={id,path:route.path,gap:'The evidence deadline was reached before this page was scanned.'};continue;}
   try{
    seoTarget(route.path);
    const live=await readPublic(route.path,fetch,deadline);
    if(live.status!==200||!live.headers.contentType?.includes('text/html')){scanned[i]={id,path:route.path,status:live.status,gap:'Live HTML unavailable; page checks were not completed.'};continue;}
    const analysis=analyzeSeo(live.text,{url:SITE+route.path,kind:route.template==='article'?'post':'page',expectedNoindex:!!route.noindex,httpStatus:live.status,sitemapIncluded:sitemap&&'text' in sitemap?sitemapMembership(sitemap.text,SITE+route.path):undefined});
    const categoryPoints=new Map<string,{name:string;points:number;maxPoints:number;score:number|null}>();
    for(const check of analysis.checks){const c=categoryPoints.get(check.category)||{name:check.category,points:0,maxPoints:0,score:null};c.points+=check.points;c.maxPoints+=check.maxPoints;c.score=c.maxPoints?Math.round(100*c.points/c.maxPoints):null;categoryPoints.set(check.category,c);}
    const content=pageEvidence(live.text);
    scanned[i]={id,path:route.path,status:live.status,headers:live.headers,signals:reviewSignals(live.text),analysis:{score:analysis.score,grade:analysis.grade,counts:analysis.counts,categories:[...categoryPoints.values()],checks:analysis.checks.map(c=>({id:c.id,status:c.status,...(c.status==='pass'?{}:{detail:c.detail})}))},content:{text:content.text.slice(0,1800),headings:content.headings.slice(0,12),internalLinks:content.internalLinks.slice(0,20),excerptOnly:true}};
   }catch{scanned[i]={id,path:route.path,gap:'The live page could not be read. Its SEO/content checks remain unverified.'};}
  }
 }));
 evidence.push(...await traffic,...scanned,{id:'crawl-coverage',available:scanned.every(e=>!e.gap),expected:routes.length,scanned:scanned.filter(e=>!e.gap).length,gap:scanned.some(e=>e.gap)?'Some live pages remain unverified. Their related review areas must not be marked checked.':undefined},{id:'performance',available:false,gap:'No current field Core Web Vitals, Lighthouse or interaction/accessibility run was collected. Static HTML checks do not verify these requirements.'},{id:'verification-gaps',gap:'Full article text, external citations, downloads, image delivery, redirect chains and Google URL inspection were not exhaustively fetched. Schema and HTML checks use the existing deterministic analyzer. Model suggestions require human/source verification before approval.'});
 return {evidence,paths};
}
