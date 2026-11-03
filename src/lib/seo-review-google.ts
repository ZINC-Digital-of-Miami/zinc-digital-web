import {request,verifyZincAnalytics} from './google';
import type {GoogleSettings} from './google-settings';
import {queryLanguageGroups} from './seo-query-language';

const range=(daysBack:number)=>{const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-daysBack);return d.toISOString().slice(0,10);};
/** Aggregate ZINC evidence only: no user/session identifiers, search terms or query strings. */
export async function reviewGoogle(c:GoogleSettings,paths:Set<string>){
 const analytics=(async()=>{
  const identity=await verifyZincAnalytics(c.property);
  const url='https://analyticsdata.googleapis.com/v1beta/properties/'+c.property+':runReport';
  const dimensionFilter={filter:{fieldName:'hostName',stringFilter:{matchType:'FULL_REGEXP',value:'(www\\.)?zincdigital\\.co',caseSensitive:false}}};
  const metricNames=['sessions','engagedSessions','engagementRate','keyEvents'];
  const read=async(startDate:string,endDate:string,dimension?:string)=>{
   const data=await request(url,{dateRanges:[{startDate,endDate}],dimensionFilter,metrics:metricNames.map(name=>({name})),...(dimension?{dimensions:[{name:dimension}],orderBys:[{metric:{metricName:'sessions'},desc:true}],limit:100}:{})});
   let omittedRows=0;
   const rows=(data.rows||[]).flatMap((r:{dimensionValues?:{value:string}[];metricValues:{value:string}[]})=>{
    const raw=r.dimensionValues?.[0]?.value||'total';
    const dimensionValue=raw;
    if(dimension==='landingPage'&&!paths.has(dimensionValue)){omittedRows++;return [];}
    return [{dimension:dimensionValue,...Object.fromEntries(metricNames.map((m,i)=>[m,Number(r.metricValues[i]?.value)||0]))}];
   });
   return {period:{startDate,endDate},timeZone:data.metadata?.timeZone||null,metadata:data.metadata,rows,omittedRows,rowCount:data.rowCount,limit:dimension?100:null};
  };
  const periods=await Promise.all([{name:'current',start:'28daysAgo',end:'yesterday'},{name:'previous',start:'56daysAgo',end:'29daysAgo'}].map(async p=>{const [summary,channels,landingPages,devices]=await Promise.all([read(p.start,p.end),read(p.start,p.end,'sessionDefaultChannelGroup'),read(p.start,p.end,'landingPage'),read(p.start,p.end,'deviceCategory')]);return {name:p.name,summary,channels,landingPages,devices};}));
  return {id:'ga4',available:true,source:'Google Analytics Data API',identity,hostFilter:'zincdigital.co and www.zincdigital.co',periods,note:'Aggregate sessions/engagement/key events. Native landingPage grain excludes query strings; top 100 rows only, paths outside the public inventory omitted. Key events are not verified qualified enquiries. No individual session recordings or causal evidence.'};
 })();
 const search=(async()=>{
  if(!c.site)throw new Error('Search Console property is not connected.');
  const url='https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query';
  const periods=await Promise.all([{name:'current',start:30,end:3},{name:'previous',start:58,end:31}].map(async p=>{
   const base={startDate:range(p.start),endDate:range(p.end),dataState:'final',type:'web',dimensionFilterGroups:[{filters:[{dimension:'page',operator:'includingRegex',expression:'^https://(www\\.)?zincdigital\\.co/'}]}]};
   const [totals,pages,devices]=await Promise.all([request(url,base),request(url,{...base,dimensions:['page'],rowLimit:100}),request(url,{...base,dimensions:['device'],rowLimit:10})]);
   const safePages=(pages.rows||[]).flatMap((r:{keys:string[];clicks:number;impressions:number;ctr:number;position:number})=>{try{const u=new URL(r.keys[0]);if(!['www.zincdigital.co','zincdigital.co'].includes(u.hostname)||!paths.has(u.pathname))return [];return [{path:u.pathname,clicks:r.clicks,impressions:r.impressions,ctr:r.ctr,position:r.position}];}catch{return [];}});
   return {name:p.name,range:{start:base.startDate,end:base.endDate},totals:totals.rows||[],pages:safePages,devices:devices.rows||[],firstIncompleteDate:pages.metadata?.first_incomplete_date||null};
  }));
  return {id:'gsc',available:true,source:'Google Search Console API',property:c.site,timeZone:'America/Los_Angeles',dataState:'final',periods,note:'Matched 28-day periods end three days ago to allow reporting delay. Web search only. Page rows limited to top 100; privacy filtering/aggregation may omit data. Search Console clicks are distinct from GA4 sessions. URL inspection not performed.'};
 })();
 const language=(async()=>{
  if(!c.site)throw new Error('Search Console property is not connected.');
  const periods=await Promise.all([{name:'current',start:30,end:3},{name:'previous',start:58,end:31}].map(async p=>{
   const data=await request('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query',{startDate:range(p.start),endDate:range(p.end),dataState:'final',type:'web',dimensions:['query'],rowLimit:25000,dimensionFilterGroups:[{filters:[{dimension:'page',operator:'includingRegex',expression:'^https://(www\\.)?zincdigital\\.co/'}]}]});
   return {name:p.name,range:{start:range(p.start),end:range(p.end)},returnedRows:(data.rows||[]).length,atRowLimit:(data.rows||[]).length>=25000,groups:queryLanguageGroups(data.rows||[])};
  }));
  return {id:'search-language',available:true,source:'Google Search Console query-row aggregates',property:c.site,timeZone:'America/Los_Angeles',periods,note:'ZINC visibility only, not market search volume. Query privacy filters and top-row limits can omit demand. No matched returned rows is unavailable, not proof of zero searches. Buckets can overlap. Raw query text is discarded before storage or model context.'};
 })();
 const results=await Promise.allSettled([analytics,search,language]);
 return results.map((r,i)=>r.status==='fulfilled'?r.value:{id:['ga4','gsc','search-language'][i],available:false,gap:r.reason instanceof Error?r.reason.message:'Native Google evidence unavailable.'});
}
