/** Deterministic site-wide link and depth facts, so Claude reads conclusions instead of every link. */
export type PageFacts={path:string;template:string;words:number|null;h1:string[];targets:string[];authorTypes:string[]};
type Input={pages:PageFacts[];posts:{slug:string;primaryService:string}[];services:{slug:string}[];cases:{slug:string;services:readonly string[]}[];inventory:ReadonlySet<string>;focusKeywords:{path:string;keyword:string|null|undefined}[];overlapGroups:readonly {id:string;paths:readonly string[]}[]};

export const internalPath=(href:string)=>{
 const raw=href.replace(/^https:\/\/www\.zincdigital\.co(?=\/)/,'');
 if(!/^\/(?!\/)/.test(raw))return null;
 const path=raw.split(/[?#]/)[0];
 return path.endsWith('/')||/\.[a-z0-9]+$/i.test(path)?path:path+'/';
};
const median=(values:number[])=>{if(!values.length)return null;const s=[...values].sort((a,b)=>a-b),m=Math.floor(s.length/2);return s.length%2?s[m]:Math.round((s[m-1]+s[m])/2);};
const LANES=['/work/build/','/work/demand/','/work/intelligence/'];
const isCase=(path:string)=>/^\/work\/[a-z0-9-]+\/$/.test(path)&&!LANES.includes(path);

export function siteStructure({pages,posts,services,cases,inventory,focusKeywords,overlapGroups}:Input){
 const byPath=new Map(pages.map(p=>[p.path,p]));
 // A link to a removed case (for example the 410 OUABC page) is not proof; only live inventory counts.
 const liveCase=(path:string)=>isCase(path)&&inventory.has(path);
 const postPaths=new Set(posts.map(p=>'/blog/'+p.slug+'/'));
 const articles=pages.filter(p=>p.template==='article'||postPaths.has(p.path));
 const servicePages=services.map(s=>{
  const page=byPath.get('/services/'+s.slug+'/');
  return page?{path:page.path,words:page.words,h1:page.h1,directPostLinks:page.targets.filter(t=>postPaths.has(t)).length,linksCategory:page.targets.includes('/blog/category/'+s.slug+'/'),caseLinks:page.targets.filter(liveCase)}:{path:'/services/'+s.slug+'/',gap:'Not scanned.'};
 });
 const hubs=pages.filter(p=>['/services/','/blog/','/work/',...LANES].includes(p.path)||/^\/blog\/category\/[a-z0-9-]+\/$/.test(p.path)).map(p=>{
  const slug=p.path.match(/^\/blog\/category\/([a-z0-9-]+)\/$/)?.[1];
  return {path:p.path,words:p.words,h1:p.h1,...(slug?{posts:posts.filter(x=>x.primaryService===slug).length}:{})};
 });
 const outside:{from:string;to:string}[]=[];
 for(const page of pages)for(const to of page.targets)if(!inventory.has(to)&&!/\.[a-z0-9]+$/i.test(to)&&outside.length<50)outside.push({from:page.path,to});
 const keywords=new Map<string,string[]>();
 for(const {path,keyword} of focusKeywords){const k=(keyword||'').trim().toLowerCase();if(k)keywords.set(k,[...(keywords.get(k)||[]),path]);}
 const ownership=new Map(posts.map(p=>['/blog/'+p.slug+'/',p.primaryService]));
 const eligible=(path:string)=>cases.filter(c=>c.services.includes(ownership.get(path)||'')&&liveCase('/work/'+c.slug+'/')).map(c=>'/work/'+c.slug+'/');
 const words=articles.map(p=>p.words).filter((n):n is number=>typeof n==='number');
 return {
  id:'site-structure',available:pages.length>0,
  basis:'Computed from scanned main-content links, including reading navigation; global header/footer excluded and the published post-to-service mapping. Counts are deterministic; they do not judge quality. This is not whole-site crawl depth. Organization bylines and duplicate keywords are review leads, not automatic defects.',
  articleWords:{count:words.length,median:median(words),min:words.length?Math.min(...words):null},
  servicePages,hubs,
  pillars:services.map(s=>({slug:s.slug,articles:posts.filter(p=>p.primaryService===s.slug).length})),
  articleInbound:articles.map(p=>({path:p.path,fromArticles:articles.filter(other=>other.path!==p.path&&other.targets.includes(p.path)).length})),
  postsWithoutEligibleCase:articles.filter(p=>!eligible(p.path).length).map(p=>p.path),
  postsWithoutEligibleCaseLink:articles.filter(p=>eligible(p.path).length&&!p.targets.some(t=>eligible(p.path).includes(t))).map(p=>p.path),
  postsWithoutPrimaryServiceLink:articles.filter(p=>!p.targets.includes('/services/'+ownership.get(p.path)+'/')).map(p=>p.path),
  postsWithoutPrimaryPillarLink:articles.filter(p=>!p.targets.includes('/blog/category/'+ownership.get(p.path)+'/')).map(p=>p.path),
  organizationBylines:articles.filter(p=>p.authorTypes.includes('Organization')).map(p=>p.path),
  linksOutsideInventory:outside,
  overlapGroups:overlapGroups.map(g=>({id:g.id,missingLinks:g.paths.flatMap(from=>byPath.has(from)?g.paths.filter(to=>to!==from&&byPath.has(to)&&!byPath.get(from)!.targets.includes(to)).map(to=>({from,to})):[])})),
  duplicateFocusKeywords:[...keywords].filter(([,paths])=>paths.length>1).map(([keyword,paths])=>({keyword,paths})),
 };
}
