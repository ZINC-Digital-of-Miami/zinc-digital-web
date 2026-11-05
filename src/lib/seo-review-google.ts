import {rfpFunnelRequest,parseRfpFunnel,rfpFunnelPeriod,RFP_FIRST_FULL_DAY} from './rfp-metrics';
import {request,verifyZincAnalytics} from './google';
import type {GoogleSettings} from './google-settings';
import {queryLanguageGroups} from './seo-query-language';

const range=(today:string,daysBack:number)=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-daysBack);return d.toISOString().slice(0,10);};
/** Aggregate ZINC evidence only: no user/session identifiers, search terms or query strings. */
export async function reviewGoogle(c:GoogleSettings,paths:Set<string>){
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const date=(daysBack:number)=>range(today,daysBack);
 const analytics=(async()=>{
  const identity=await verifyZincAnalytics(c.property);
  const url='https://analyticsdata.googleapis.com/v1beta/properties/'+c.property+':runReport';
  const dimensionFilter={filter:{fieldName:'hostName',stringFilter:{matchType:'FULL_REGEXP',value:'(www\\.)?zincdigital\\.co',caseSensitive:false}}};
  const metricNames=['sessions','engagedSessions','engagementRate','keyEvents'];
  const read=async(startDate:string,endDate:string,dimension?:string)=>{
   const limit=dimension==='landingPage'?1000:100;
   const data=await request(url,{dateRanges:[{startDate,endDate}],dimensionFilter,metrics:metricNames.map(name=>({name})),...(dimension?{dimensions:[{name:dimension}],orderBys:[{metric:{metricName:'sessions'},desc:true}],limit}:{})});
   let omittedRows=0;
   const rows=(data.rows||[]).flatMap((r:{dimensionValues?:{value:string}[];metricValues:{value:string}[]})=>{
    const raw=r.dimensionValues?.[0]?.value||'total';
    const dimensionValue=raw;
    if(dimension==='landingPage'&&!paths.has(dimensionValue)){omittedRows++;return [];}
    return [{dimension:dimensionValue,...Object.fromEntries(metricNames.map((m,i)=>[m,Number(r.metricValues[i]?.value)||0]))}];
   });
   return {period:{startDate,endDate},timeZone:data.metadata?.timeZone||null,metadata:data.metadata,rows,omittedRows,rowCount:data.rowCount,limit:dimension?limit:null};
  };
  const periods=await Promise.all([{name:'current',start:date(30),end:date(3)},{name:'previous',start:date(58),end:date(31)}].map(async p=>{const [summary,channels,landingPages,devices]=await Promise.all([read(p.start,p.end),read(p.start,p.end,'sessionDefaultChannelGroup'),read(p.start,p.end,'landingPage'),read(p.start,p.end,'deviceCategory')]);return {name:p.name,summary,channels,landingPages,devices};}));
  // Run after the eight summary reports to stay within the property's concurrent-request quota.
  const zone=periods[0].summary.timeZone;
  const day=(back:number)=>{if(!zone)throw new Error('GA4 reporting timezone unavailable.');const now=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const d=new Date(now+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-back);return d.toISOString().slice(0,10);};
  const rfp=await (async()=>{
   const current={startDate:day(28),endDate:day(1)},previous={startDate:day(56),endDate:day(29)};
   const funnelPeriod=rfpFunnelPeriod(current.startDate,current.endDate);
   const submissions=async(period:typeof current)=>{const data=await request(url,{dateRanges:[period],dimensionFilter:{andGroup:{expressions:[dimensionFilter,{filter:{fieldName:'eventName',stringFilter:{matchType:'EXACT',value:'generate_lead'}}}]}},metrics:[{name:'eventCount'}]});return {period,count:Number(data.rows?.[0]?.metricValues?.[0]?.value||0),metadata:data.metadata};};
   const results=await Promise.allSettled([submissions(current),submissions(previous),funnelPeriod?request('https://analyticsdata.googleapis.com/v1alpha/properties/'+c.property+':runFunnelReport',rfpFunnelRequest(funnelPeriod.startDate,funnelPeriod.endDate)).then(parseRfpFunnel):Promise.resolve(null),request(url,{dateRanges:[current],dimensionFilter:{andGroup:{expressions:[dimensionFilter,{filter:{fieldName:'eventName',stringFilter:{matchType:'EXACT',value:'generate_lead'}}}]}},dimensions:[{name:'sessionDefaultChannelGroup'}],metrics:[{name:'eventCount'}],orderBys:[{metric:{metricName:'eventCount'},desc:true}],limit:50}).then(data=>({rows:(data.rows||[]).map((r:{dimensionValues:{value:string}[];metricValues:{value:string}[]})=>({channel:r.dimensionValues[0]?.value||'(not set)',count:Number(r.metricValues[0]?.value)})),metadata:data.metadata,rowCount:data.rowCount}))]);
   const value=(i:number)=>results[i].status==='fulfilled'?(results[i] as PromiseFulfilledResult<unknown>).value:null;
   return {gaps:results.flatMap((r,i)=>r.status==='rejected'?[["Current proposal submissions could not be loaded.","Previous proposal submissions could not be loaded.","The ordered funnel could not be loaded.","Acquisition channels could not be loaded."][i]]:[]),timeZone:zone,funnelPeriod,funnelStartsOn:RFP_FIRST_FULL_DAY,current:value(0),previous:value(1),funnel:value(2),channels:value(3),period:current,note:'Proposal submissions count generate_lead events, independent of key-event configuration. Funnel stages count active users completing the ordered sequence in the separately stated instrumented period, with intervening events allowed. Tags begin November 4, 2026; earlier steps are unavailable. This is not a session conversion rate, qualified pipeline or revenue. Consent, blockers, source thresholds and sampling can limit coverage.'};
  })().catch(()=>null);
  return {id:'ga4',available:true,rfp,source:'Google Analytics Data API',identity,hostFilter:'zincdigital.co and www.zincdigital.co',periods,note:'Aggregate sessions/engagement/key events use the same calendar dates as Search Console; GA4 uses its property timezone and Search Console uses Pacific time, so daily boundaries differ. Proposal funnel dates are stated separately. Native landingPage grain excludes query strings; top 1,000 rows only, paths outside the public inventory omitted. Key events are not verified qualified enquiries. No individual session recordings or causal evidence.'};
 })();
 const search=(async()=>{
  if(!c.site)throw new Error('Search Console property is not connected.');
  const url='https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query';
  const periods=await Promise.all([{name:'current',start:30,end:3},{name:'previous',start:58,end:31}].map(async p=>{
   const base={startDate:date(p.start),endDate:date(p.end),dataState:'final',type:'web',dimensionFilterGroups:[{filters:[{dimension:'page',operator:'includingRegex',expression:'^https://(www\\.)?zincdigital\\.co/'}]}]};
   const [totals,pages,devices]=await Promise.all([request(url,base),request(url,{...base,dimensions:['page'],rowLimit:100}),request(url,{...base,dimensions:['device'],rowLimit:10})]);
   const safePages=(pages.rows||[]).flatMap((r:{keys:string[];clicks:number;impressions:number;ctr:number;position:number})=>{try{const u=new URL(r.keys[0]);if(!['www.zincdigital.co','zincdigital.co'].includes(u.hostname)||!paths.has(u.pathname))return [];return [{path:u.pathname,clicks:r.clicks,impressions:r.impressions,ctr:r.ctr,position:r.position}];}catch{return [];}});
   return {name:p.name,range:{start:base.startDate,end:base.endDate},totals:totals.rows||[],pages:safePages,devices:devices.rows||[],firstIncompleteDate:pages.metadata?.first_incomplete_date||null};
  }));
  return {id:'gsc',available:true,source:'Google Search Console API',property:c.site,timeZone:'America/Los_Angeles',dataState:'final',periods,note:'Matched 28-day periods end three days ago to allow reporting delay. Web search only. Page rows limited to top 100; privacy filtering/aggregation may omit data. Search Console clicks are distinct from GA4 sessions. URL inspection not performed.'};
 })();
 const language=(async()=>{
  if(!c.site)throw new Error('Search Console property is not connected.');
  const periods=await Promise.all([{name:'current',start:30,end:3},{name:'previous',start:58,end:31}].map(async p=>{
   const data=await request('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query',{startDate:date(p.start),endDate:date(p.end),dataState:'final',type:'web',dimensions:['query'],rowLimit:25000,dimensionFilterGroups:[{filters:[{dimension:'page',operator:'includingRegex',expression:'^https://(www\\.)?zincdigital\\.co/'}]}]});
   return {name:p.name,range:{start:date(p.start),end:date(p.end)},returnedRows:(data.rows||[]).length,atRowLimit:(data.rows||[]).length>=25000,groups:queryLanguageGroups(data.rows||[])};
  }));
  return {id:'search-language',available:true,source:'Google Search Console query-row aggregates',property:c.site,timeZone:'America/Los_Angeles',periods,note:'ZINC visibility only, not market search volume. Query privacy filters and top-row limits can omit demand. No matched returned rows is unavailable, not proof of zero searches. Buckets can overlap. Raw query text is discarded before storage or model context.'};
 })();
 const results=await Promise.allSettled([analytics,search,language]);
 return results.map((r,i)=>r.status==='fulfilled'?r.value:{id:['ga4','gsc','search-language'][i],available:false,gap:r.reason instanceof Error?r.reason.message:'Native Google evidence unavailable.'});
}
