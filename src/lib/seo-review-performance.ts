import {request,verifyZincAnalytics} from './google';
import {googleSettingsInput,type GoogleSettings} from './google-settings';
import {services} from '../data/site';
import {categoryPath,categoryPosts} from '../data/blog-categories';
import type {PagePerformance,PerformancePage,PerformanceMetrics} from './seo-review-dashboard';

type Post={slug:string;title:string;primaryService:string;related:readonly string[]};
type NativeRow={dimensionValues?:{value:string}[];metricValues?:{value:string}[];keys?:string[];clicks?:number;impressions?:number};
type NativeReport={rows?:NativeRow[];rowCount?:number;metadata?:{timeZone?:string;subjectToThresholding?:boolean;samplingMetadatas?:unknown[];dataLossFromOtherRow?:boolean}};
const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
const numeric=(v:unknown)=>typeof v==='string'&&v.trim()!==''?finite(Number(v)):null;
const missing=():PerformanceMetrics=>({views:null,engagementSeconds:null,clicks:null,impressions:null});
const day=(s:string)=>/^\d{8}$/.test(s)?s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6):/^\d{4}-\d{2}-\d{2}$/.test(s)?s:'';
const safeDate=(value:string)=>{const d=day(value);return d&&Number.isFinite(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d?d:'';};
const period=(now:number,startBack:number,endBack:number)=>{const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(now),base=new Date(today+'T12:00:00Z');const ago=(n:number)=>{const d=new Date(base);d.setUTCDate(d.getUTCDate()-n);return d.toISOString().slice(0,10);};return {start:ago(startBack),end:ago(endBack)};};
const sourcePath=(url:string,paths:ReadonlySet<string>)=>{try{const u=new URL(url);return u.protocol==='https:'&&['zincdigital.co','www.zincdigital.co'].includes(u.hostname)&&!u.port&&!u.username&&!u.password&&paths.has(u.pathname)?u.pathname:null;}catch{return null;}};

/** Native aggregate page views/search data. No user identifiers, raw referrer URLs or query strings persist. */
export async function collectPagePerformance(settings:GoogleSettings,posts:readonly Post[],publicPaths:ReadonlySet<string>,deadline=Date.now()+60000,ga4Verified=false):Promise<PagePerformance>{
 const c=googleSettingsInput(settings),now=Date.now(),range={current:period(now,30,3),previous:period(now,58,31)};
 const pillars=services.filter(s=>publicPaths.has(categoryPath(s.slug))).map(s=>({slug:s.slug,title:s.title,servicePath:'/services/'+s.slug+'/',articlePaths:categoryPosts(s.slug,posts).map(p=>'/blog/'+p.slug+'/').filter(p=>publicPaths.has(p))}));
 const pages:PerformancePage[]=[...posts.filter(p=>publicPaths.has('/blog/'+p.slug+'/')).map(p=>({path:'/blog/'+p.slug+'/',title:p.title,kind:'blog' as const,pillars:pillars.filter(g=>g.articlePaths.includes('/blog/'+p.slug+'/')).map(g=>g.slug),current:missing(),previous:missing(),series:{ga4:[],gsc:[]},serviceReferrals:{current:null,previous:null}})),...services.filter(s=>publicPaths.has('/services/'+s.slug+'/')).map(s=>({path:'/services/'+s.slug+'/',title:s.title,kind:'service' as const,pillars:pillars.filter(g=>g.servicePath==='/services/'+s.slug+'/').map(g=>g.slug),current:missing(),previous:missing(),series:{ga4:[],gsc:[]}}))];
 const byPath=new Map(pages.map(p=>[p.path,p])),articlePaths=new Set(pages.filter(p=>p.kind==='blog').map(p=>p.path)),servicePaths=pages.filter(p=>p.kind==='service').map(p=>p.path);
 const data:PagePerformance={id:'page-performance',available:false,range,sources:{ga4:{available:false},gsc:{available:false,timeZone:'America/Los_Angeles'},transitions:{available:false}},pillars,pages,notes:['Both performance windows contain 28 calendar days and end three days ago to allow Search Console finalization. GA4 uses its property timezone; Search Console uses Pacific time.','Page views, search clicks and impressions are different measurements. Engagement seconds are total foreground engagement time, not an average.','Missing returned rows/dates remain unavailable and gaps; no zero is inferred. Sparklines use current-period observed dates only.','Each article belongs to one explicit primary-service pillar. Pillar article sets are disjoint; traffic totals are not unique people across pages.','Referrer-based service page views can repeat and do not establish unique clicks, sessions, causality or qualified leads.']};
 const bounded=async<T>(task:()=>Promise<T>):Promise<T>=>{const remaining=deadline-Date.now();if(remaining<=0)throw new Error('The page-performance evidence deadline was reached.');let timer:ReturnType<typeof setTimeout>|undefined;try{return await Promise.race([task(),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(new Error('The page-performance evidence deadline was reached.')),remaining);})]);}finally{if(timer)clearTimeout(timer);}};
 const query=(url:string,body:unknown)=>bounded(()=>request(url,body)) as Promise<NativeReport>;
 const ga4=(async()=>{
  if(!ga4Verified)await bounded(()=>verifyZincAnalytics(c.property));
  const url='https://analyticsdata.googleapis.com/v1beta/properties/'+c.property+':runReport';
  const host={filter:{fieldName:'hostName',stringFilter:{matchType:'FULL_REGEXP',value:'(www\\.)?zincdigital\\.co',caseSensitive:false}}};
  const pageFilter={filter:{fieldName:'pagePath',inListFilter:{values:pages.map(p=>p.path),caseSensitive:true}}};
  const base=(r:{start:string;end:string})=>({dateRanges:[{startDate:r.start,endDate:r.end}],dimensionFilter:{andGroup:{expressions:[host,pageFilter]}},metrics:[{name:'screenPageViews'},{name:'userEngagementDuration'}],limit:10000});
  const reports=await Promise.allSettled([
   query(url,{...base(range.current),dimensions:[{name:'pagePath'}]}),
   query(url,{...base(range.previous),dimensions:[{name:'pagePath'}]}),
   query(url,{...base(range.current),dimensions:[{name:'pagePath'},{name:'date'}],orderBys:[{dimension:{dimensionName:'date'}}]}),
   ...(['current','previous'] as const).map(key=>query(url,{dateRanges:[{startDate:range[key].start,endDate:range[key].end}],dimensions:[{name:'pagePath'},{name:'pageReferrer'}],metrics:[{name:'screenPageViews'}],dimensionFilter:{andGroup:{expressions:[host,{filter:{fieldName:'pagePath',inListFilter:{values:servicePaths,caseSensitive:true}}},{filter:{fieldName:'pageReferrer',stringFilter:{matchType:'FULL_REGEXP',value:'https://(www\\.)?zincdigital\\.co/blog/.*',caseSensitive:false}}}]}},limit:10000})),
  ]);
  let any=false;for(let i=0;i<3;i++){const result=reports[i];if(result.status!=='fulfilled'){data.notes.push('GA4 '+['current page totals','previous page totals','daily page series'][i]+' unavailable.');continue;}any=true;const report=result.value;if(report.metadata?.timeZone)data.sources.ga4.timeZone=report.metadata.timeZone;
   if((report.rowCount||0)>(report.rows?.length||0))data.notes.push('GA4 page report truncated at 10000 returned rows.');
   if(report.metadata?.subjectToThresholding||report.metadata?.samplingMetadatas?.length||report.metadata?.dataLossFromOtherRow)data.notes.push('GA4 reports thresholding, sampling or other-row data loss; page metrics may be incomplete.');
   for(const row of report.rows||[]){const path=row.dimensionValues?.[0]?.value,p=path?byPath.get(path):undefined;if(!p)continue;const views=numeric(row.metricValues?.[0]?.value),engagement=numeric(row.metricValues?.[1]?.value);
    if(i<2){const target=i===0?p.current:p.previous;target.views=views;target.engagementSeconds=engagement;}else{const date=safeDate(row.dimensionValues?.[1]?.value||'');if(date&&views!==null&&engagement!==null)p.series.ga4.push({date,views,engagementSeconds:engagement});}
   }
  }
  data.sources.ga4.available=any;if(!any)data.sources.ga4.gap='Native GA4 page reports could not be read.';
  const transitionResults=reports.slice(3);let transitionsAvailable=true;
  for(let i=0;i<2;i++){const result=transitionResults[i];if(result.status!=='fulfilled'){transitionsAvailable=false;continue;}const report=result.value;if((report.rowCount||0)>(report.rows?.length||0))data.notes.push('GA4 article-to-service referrer report truncated at 10000 rows.');
   if(report.metadata?.subjectToThresholding||report.metadata?.samplingMetadatas?.length||report.metadata?.dataLossFromOtherRow)data.notes.push('GA4 article-to-service reports thresholding, sampling or other-row data loss; referred service views may be incomplete.');
   const key=i===0?'current':'previous';for(const p of pages.filter(p=>p.kind==='blog'))p.serviceReferrals![key]=null;
   const totals=new Map<string,number>();
   for(const row of report.rows||[]){const target=row.dimensionValues?.[0]?.value,from=sourcePath(row.dimensionValues?.[1]?.value||'',articlePaths),views=numeric(row.metricValues?.[0]?.value);if(!from||!target||!servicePaths.includes(target)||views===null)continue;for(const pillar of data.pillars.filter(g=>g.servicePath===target&&g.articlePaths.includes(from))){const groupKey=pillar.slug+'\n'+from;totals.set(groupKey,(totals.get(groupKey)||0)+views);}}
   for(const pillar of data.pillars){let total:number|null=null;for(const path of pillar.articlePaths){const observed=totals.get(pillar.slug+'\n'+path);if(observed===undefined)continue;total=(total??0)+observed;const p=byPath.get(path)!;p.serviceReferrals![key]=(p.serviceReferrals![key]??0)+observed;data.transitions??=[];let transition=data.transitions.find(t=>t.articlePath===path&&t.servicePath===pillar.servicePath);if(!transition){transition={articlePath:path,servicePath:pillar.servicePath,current:null,previous:null};data.transitions.push(transition);}transition[key]=observed;}pillar.serviceReferrals={current:pillar.serviceReferrals?.current??null,previous:pillar.serviceReferrals?.previous??null,[key]:total};}
  }
  data.sources.transitions={available:transitionsAvailable,...(!transitionsAvailable?{gap:'Native article-referrer service page reports could not be read for both periods.'}:{})};
 })().catch(e=>{data.sources.ga4={available:false,gap:e instanceof Error?e.message:'Native GA4 page evidence unavailable.'};data.sources.transitions={available:false,gap:'GA4 page access was not verified.'};});
 const search=(async()=>{
  if(!c.site)throw new Error('Search Console is not connected.');const url='https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query';
  const base=(r:{start:string;end:string})=>({startDate:r.start,endDate:r.end,dataState:'final',type:'web',rowLimit:10000,dimensionFilterGroups:[{filters:[{dimension:'page',operator:'includingRegex',expression:'^https://(www\\.)?zincdigital\\.co/(blog|services)/'}]}]});
  const reports=await Promise.allSettled([query(url,{...base(range.current),dimensions:['page']}),query(url,{...base(range.previous),dimensions:['page']}),query(url,{...base(range.current),dimensions:['page','date']})]);let any=false;
  for(let i=0;i<reports.length;i++){const result=reports[i];if(result.status!=='fulfilled'){data.notes.push('Search Console '+['current page totals','previous page totals','daily page series'][i]+' unavailable.');continue;}any=true;if((result.value.rows?.length||0)>=10000)data.notes.push('Search Console returned the 10000-row limit; further rows may be omitted.');
   for(const row of result.value.rows||[]){const path=sourcePath(row.keys?.[0]||'',publicPaths),p=path?byPath.get(path):undefined,clicks=finite(row.clicks),impressions=finite(row.impressions);if(!p||clicks===null||impressions===null)continue;
    if(i<2){const target=i===0?p.current:p.previous;target.clicks=(target.clicks??0)+clicks;target.impressions=(target.impressions??0)+impressions;}else{const date=safeDate(row.keys?.[1]||'');if(!date)continue;const existing=p.series.gsc.find(v=>v.date===date);if(existing){existing.clicks+=clicks;existing.impressions+=impressions;}else p.series.gsc.push({date,clicks,impressions});}
   }
  }
  data.sources.gsc.available=any;if(!any)data.sources.gsc.gap='Native Search Console page reports could not be read.';
 })().catch(e=>{data.sources.gsc={available:false,timeZone:'America/Los_Angeles',gap:e instanceof Error?e.message:'Search Console page evidence unavailable.'};});
 await Promise.all([ga4,search]);for(const p of pages){p.series.ga4.sort((a,b)=>a.date.localeCompare(b.date));p.series.gsc.sort((a,b)=>a.date.localeCompare(b.date));}
 for(const pillar of data.pillars)pillar.serviceReferrals={current:pillar.serviceReferrals?.current??null,previous:pillar.serviceReferrals?.previous??null};
 data.available=data.sources.ga4.available||data.sources.gsc.available;data.notes.push('Search Console can return only top rows and omits days without returned data. URL variants are grouped by approved path; impressions are not unique people.');return data;
}
