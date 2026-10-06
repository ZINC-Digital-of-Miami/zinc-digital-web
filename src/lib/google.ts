import {googleReportRange} from './google-range';
import {authorizeGoogle,googleAccount} from './google-auth';
import {SITE,noindexPaths} from '../data/site';
import {loadPublished} from './content';
import type {SupabaseClient} from '@supabase/supabase-js';
import {googleSettingsInput,type GoogleSettings} from './google-settings';
export const googleConfig=()=>({account:import.meta.env.GOOGLE_AUTHORIZED_USER_JSON||import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON||'',property:import.meta.env.GA4_PROPERTY_ID||'494489814',site:import.meta.env.GSC_SITE||''});
type Report={metadata?:{timeZone?:string};rows?:{dimensionValues:{value:string}[];metricValues:{value:string}[]}[]};
let credential:{value:string;expires:number}|undefined;
async function token(){
 if(credential&&credential.expires>Date.now()+60000)return credential.value;
 credential=await authorizeGoogle(googleConfig().account);return credential.value;
}
async function request(url:string,body:unknown){
 const res=await fetch(url,{method:'POST',headers:{authorization:'Bearer '+await token(),'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw new Error('Google data could not be loaded. Check the property and account permissions.');return res.json();
}
export async function metrics(c:GoogleSettings=googleConfig()){
 const requestedAt=Date.now();
 const url='https://analyticsdata.googleapis.com/v1beta/properties/'+c.property+':runReport',base={dateRanges:[{startDate:'30daysAgo',endDate:'yesterday'}]};
 const [summary,daily,top]=await Promise.all([
 request(url,{...base,metrics:[{name:'sessions'},{name:'userEngagementDuration'},{name:'activeUsers'}]}),
 request(url,{...base,dimensions:[{name:'date'}],metrics:[{name:'sessions'}],dimensionFilter:{filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{matchType:'EXACT',value:'Organic Search'}}},orderBys:[{dimension:{dimensionName:'date'}}]}),
 request(url,{...base,dimensions:[{name:'pagePath'}],metrics:[{name:'screenPageViews'}],orderBys:[{metric:{metricName:'screenPageViews'},desc:true}],limit:10}),
 ]) as [Report,Report,Report];
 const timeZone=summary.metadata?.timeZone;
 const range=googleReportRange(requestedAt,timeZone||'UTC');
 const source={analyticsProperty:c.property,analyticsTimeZone:timeZone||null,searchConsoleProperty:c.site,searchConsoleTimeZone:'America/Los_Angeles',inspectionOrigin:SITE};
 const values=summary.rows?.[0]?.metricValues.map(x=>Number(x.value))||[0,0,0];let clicks:number|null=null,impressions:number|null=null,searchError='';
 if(c.site){try{const search=await request('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query',{startDate:range.start,endDate:range.end});clicks=search.rows?.[0]?.clicks||0;impressions=search.rows?.[0]?.impressions||0;}catch(e){searchError=(e as Error).message;}}
 else searchError='Connect the Search Console property to load organic clicks.';
 return{source,sessions:values[0],engagement:values[2]?values[1]/values[2]:0,clicks,impressions,range,searchError,series:(daily.rows||[]).map(r=>({date:r.dimensionValues[0].value,sessions:Number(r.metricValues[0].value)})),topPages:(top.rows||[]).map(r=>({path:r.dimensionValues[0].value,views:Number(r.metricValues[0].value)}))};
}
export async function indexed(c:GoogleSettings=googleConfig()){
 const site=c.site;if(!site)throw new Error('Connect Search Console to inspect indexed pages.');
 const paths=(await loadPublished()).routes.filter(r=>!r.noindex&&!noindexPaths.has(r.path)).map(r=>r.path);let count=0;
 for(let i=0;i<paths.length;i+=6){const results=await Promise.all(paths.slice(i,i+6).map(path=>request('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',{inspectionUrl:SITE+path,siteUrl:site,languageCode:'en-US'})));for(const result of results)if(result.inspectionResult?.indexStatusResult?.verdict==='PASS')count++;}
 return{count,total:paths.length};
}

export function googleAccountEmail(){
 try{const account=googleAccount(googleConfig().account);return account.client_email||account.account_email||'';}catch{return '';}
}
export function googleUsesExistingLogin(){try{return googleAccount(googleConfig().account).type==='authorized_user';}catch{return false;}}
export async function savedGoogleSettings(sb:SupabaseClient):Promise<GoogleSettings>{
 const row=await sb.from('admin_cache').select('value').eq('key','google_connection').maybeSingle();
 if(row.error)throw new Error('Google connection settings could not be loaded.');
 return googleSettingsInput(row.data?.value||googleConfig());
}
export async function googleSites():Promise<string[]>{
 const res=await fetch('https://www.googleapis.com/webmasters/v3/sites',{headers:{authorization:'Bearer '+await token()},signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw new Error('Search Console access could not be checked. Grant the website account access in Google.');
 const data=await res.json();return (data.siteEntry||[]).map((s:{siteUrl:string})=>s.siteUrl).filter((site:string)=>{try{return !!googleSettingsInput({property:'1',site}).site;}catch{return false;}});
}
export async function verifyGoogleService(kind:string,c:GoogleSettings){
 if(kind==='ga4'){
  await request('https://analyticsdata.googleapis.com/v1beta/properties/'+c.property+':runReport',{dateRanges:[{startDate:'yesterday',endDate:'yesterday'}],metrics:[{name:'sessions'}]});
 }else if(kind==='gsc'){
  if(!c.site)throw new Error('Select the Search Console property after granting access.');
  const res=await fetch('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site),{headers:{authorization:'Bearer '+await token()},signal:AbortSignal.timeout(10000)});
  if(!res.ok)throw new Error('Google has not granted this account access to that Search Console property.');
 }else throw new Error('Choose Analytics or Search Console.');
}
