#!/usr/bin/env node
// Read-only M6 inventory. Proposals need owner review before changing production routing.
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
import {authorizeGoogle} from '../src/lib/google-auth.ts';
import {googleInventoryRange} from '../src/lib/google-dates.ts';
const SITE='https://www.zincdigital.co';
const output='/Volumes/Satechi Hub/zinc-digital-web-review/redirects/proposed.json';
try{process.loadEnvFile('.env');}catch{}
const inventory=new Map(),sources=[];
const owned=url=>['www.zincdigital.co','zincdigital.co'].includes(new URL(url).hostname);
function add(url,source,metadata={}){
 if(!owned(url))return;
 const path=new URL(url).pathname;
 const item=inventory.get(path)||{path,sources:[],wordpress:[],clicks:0,impressions:0};
 if(!item.sources.includes(source))item.sources.push(source);
 if(metadata.wordpress)item.wordpress.push(metadata.wordpress);
 item.clicks+=metadata.clicks||0;item.impressions+=metadata.impressions||0;
 inventory.set(path,item);
}
async function get(url){
 if(!owned(url))throw Error('Inventory source must be the live ZINC site');
 const r=await fetch(url,{signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw Error('Live source returned '+r.status+' at '+new URL(url).pathname);
 if(!owned(r.url))throw Error('Live source redirected outside ZINC');
 return r;
}
const types=await(await get(SITE+'/wp-json/wp/v2/types')).json();
const bases=[...new Set(['posts','pages','categories','tags',...Object.values(types).filter(t=>t.rest_namespace==='wp/v2'&&/portfolio|project/i.test(t.slug||t.rest_base||'')).map(t=>t.rest_base)])];
for(const base of bases){
 let total=1,count=0;
 for(let page=1;page<=total;page++){
  const url=new URL(SITE+'/wp-json/wp/v2/'+base);
  for(const [key,value]of Object.entries({per_page:'100',page:String(page),_fields:'id,slug,link,name,title'}))url.searchParams.set(key,value);
  const r=await get(url),items=await r.json();
  if(!Array.isArray(items))throw Error('WordPress source is not an inventory');
  total=Number(r.headers.get('x-wp-totalpages')||1);if(total>100)throw Error('WordPress inventory exceeds its pagination limit');
  for(const item of items)if(item.link){add(item.link,'wordpress:'+base,{wordpress:{type:base,id:item.id,slug:item.slug,title:item.title?.rendered||item.name||''}});count++;}
 }
 sources.push({source:'wordpress:'+base,count});
}
const robots=await(await get(SITE+'/robots.txt')).text();
const queue=Array.from(robots.matchAll(/^Sitemap:\s*(\S+)/gmi),m=>m[1]);
if(!queue.length)queue.push(SITE+'/wp-sitemap.xml');
const visited=new Set();let sitemapCount=0;
while(queue.length){
 const url=queue.shift();if(visited.has(url))continue;visited.add(url);
 if(visited.size>100)throw Error('Sitemap inventory exceeds its crawl limit');
 const xml=await(await get(url)).text();
 if(!/<(?:sitemapindex|urlset)\b/.test(xml))throw Error('Live sitemap is not XML');
 const links=Array.from(xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g),m=>m[1].replaceAll('&amp;','&'));
 if(xml.includes('<sitemapindex'))queue.push(...links.filter(owned));
 else for(const link of links){add(link,'sitemap');sitemapCount++;}
}
sources.push({source:'sitemaps',count:sitemapCount,documents:visited.size});
const credential=process.env.GOOGLE_AUTHORIZED_USER_JSON||process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
if(!credential||!process.env.GSC_SITE)throw Error('The existing Google credentials and exact GSC_SITE are required');
const token=(await authorizeGoogle(credential)).value;
const range=googleInventoryRange();
let gscCount=0;
for(let offset=0;;offset+=25000){
 const r=await fetch('https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(process.env.GSC_SITE)+'/searchAnalytics/query',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({...range,dimensions:['page'],rowLimit:25000,startRow:offset}),signal:AbortSignal.timeout(20000)});
 if(!r.ok)throw Error('Search Console inventory returned '+r.status);
 const rows=(await r.json()).rows||[];
 for(const row of rows){add(row.keys[0],'search-console',{clicks:row.clicks,impressions:row.impressions});gscCount++;}
 if(rows.length<25000)break;if(offset>=1000000)throw Error('Search Console inventory exceeds its pagination limit');
}
sources.push({source:'search-console',count:gscCount,...range});
const sitemap=await readFile('dist/client/sitemap.xml','utf8');
const current=new Set(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),m=>new URL(m[1]).pathname));
const posts=JSON.parse(await readFile('src/data/posts.preview.json','utf8')).posts;
const postById=new Map(posts.map(post=>[post.id,'/blog/'+post.slug+'/']));
const proposals=Array.from(inventory.values()).sort((a,b)=>a.path.localeCompare(b.path)).map(item=>{
 const post=item.wordpress.find(w=>w.type==='posts');
 const target=post?postById.get(post.id):undefined;
 if(current.has(item.path))return {...item,action:'keep',target:item.path,reason:'Existing canonical route'};
 if(target&&current.has(target))return {...item,action:'301',target,reason:'Same WordPress post ID in the migrated content'};
 return {...item,action:'review',target:null,reason:'Owner decision needed; no replacement or retirement is assumed'};
});
await mkdir(dirname(output),{recursive:true});
await writeFile(output,JSON.stringify({site:SITE,generatedAt:new Date().toISOString(),status:'proposed; no routing applied',sources,summary:{inventoried:proposals.length,keep:proposals.filter(p=>p.action==='keep').length,redirects:proposals.filter(p=>p.action==='301').length,needsReview:proposals.filter(p=>p.action==='review').length},proposals},null,2)+'\n');
console.log(JSON.stringify({output,sources,inventory:proposals.length,needsReview:proposals.filter(p=>p.action==='review').length}));
