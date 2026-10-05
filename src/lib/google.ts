import {createSign} from 'node:crypto';
import {SITE,routes,noindexPaths} from '../data/site';
export const googleConfig=()=>({account:import.meta.env.GOOGLE_SERVICE_ACCOUNT_JSON||'',property:import.meta.env.GA4_PROPERTY_ID||'494489814',site:import.meta.env.GSC_SITE||''});
type Report={rows?:{dimensionValues:{value:string}[];metricValues:{value:string}[]}[]};
let credential:{value:string;expires:number}|undefined;
async function token(){
 if(credential&&credential.expires>Date.now()+60000)return credential.value;
 let account:{client_email:string;private_key:string};
 try{account=JSON.parse(googleConfig().account);if(!account.client_email||!account.private_key)throw 0;}catch{throw new Error('Connect a valid Google service account.');}
 const now=Math.floor(Date.now()/1000),encode=(x:unknown)=>Buffer.from(JSON.stringify(x)).toString('base64url');
 const message=encode({alg:'RS256',typ:'JWT'})+'.'+encode({iss:account.client_email,scope:'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
 const assertion=message+'.'+createSign('RSA-SHA256').update(message).sign(account.private_key,'base64url');
 const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw new Error('Google authentication failed. Check the service account access.');
 const data=await res.json();credential={value:data.access_token,expires:Date.now()+data.expires_in*1000};return credential.value;
}
async function request(url:string,body:unknown){
 const res=await fetch(url,{method:'POST',headers:{authorization:'Bearer '+await token(),'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
 if(!res.ok)throw new Error('Google data could not be loaded. Check the property and account permissions.');return res.json();
}
export async function metrics(){
 const c=googleConfig(),fmt=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'});
 const range={start:fmt.format(Date.now()-30*86400000),end:fmt.format(Date.now()-86400000)};
 const url='https://analyticsdata.googleapis.com/v1beta/properties/'+c.property+':runReport',base={dateRanges:[{startDate:range.start,endDate:range.end}]};
 const [summary,daily,top]=await Promise.all([
 request(url,{...base,metrics:[{name:'sessions'},{name:'userEngagementDuration'},{name:'activeUsers'}]}),
 request(url,{...base,dimensions:[{name:'date'}],metrics:[{name:'sessions'}],dimensionFilter:{filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{matchType:'EXACT',value:'Organic Search'}}},orderBys:[{dimension:{dimensionName:'date'}}]}),
 request(url,{...base,dimensions:[{name:'pagePath'}],metrics:[{name:'screenPageViews'}],orderBys:[{metric:{metricName:'screenPageViews'},desc:true}],limit:10}),
 ]) as [Report,Report,Report];
 const values=summary.rows?.[0]?.metricValues.map(x=>Number(x.value))||[0,0,0];let clicks:number|null=null,impressions:number|null=null,searchError='';
 if(c.site){try{const search=await request('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(c.site)+'/searchAnalytics/query',{startDate:range.start,endDate:range.end});clicks=search.rows?.[0]?.clicks||0;impressions=search.rows?.[0]?.impressions||0;}catch(e){searchError=(e as Error).message;}}
 else searchError='Connect the Search Console property to load organic clicks.';
 return{sessions:values[0],engagement:values[2]?values[1]/values[2]:0,clicks,impressions,range,searchError,series:(daily.rows||[]).map(r=>({date:r.dimensionValues[0].value,sessions:Number(r.metricValues[0].value)})),topPages:(top.rows||[]).map(r=>({path:r.dimensionValues[0].value,views:Number(r.metricValues[0].value)}))};
}
export async function indexed(){
 const site=googleConfig().site;if(!site)throw new Error('Connect Search Console to inspect indexed pages.');
 const paths=routes.filter(r=>!noindexPaths.has(r.path)).map(r=>r.path);let count=0;
 for(let i=0;i<paths.length;i+=6){const results=await Promise.all(paths.slice(i,i+6).map(path=>request('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',{inspectionUrl:SITE+path,siteUrl:site,languageCode:'en-US'})));for(const result of results)if(result.inspectionResult?.indexStatusResult?.verdict==='PASS')count++;}
 return{count,total:paths.length};
}
