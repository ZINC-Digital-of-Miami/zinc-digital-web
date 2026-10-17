type PublicRoute={path:string;template:string;title?:string;metaTitle?:string;metaDescription?:string;noindex?:boolean;published?:string;modified?:string};
export const brandTitle=(title:string)=>/\|\s*ZINC\s*$/i.test(title)?title:title+' | ZINC';
export const serializeSchema=(value:unknown)=>JSON.stringify(value).replace(/[<>&\u2028\u2029]/g,char=>'\\u'+char.charCodeAt(0).toString(16).padStart(4,'0'));
const xml=(value:string)=>value.replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]!));
export function pageEntity(site:string,route:PublicRoute,title:string,description:string,image:string):Record<string,unknown>{
 const canonical=site+route.path;
 const type=route.template==='about'?'AboutPage':route.template==='contact'?'ContactPage':route.template==='author'?'ProfilePage':['services','work','blog'].includes(route.template)?'CollectionPage':'WebPage';
 return {'@type':type,'@id':canonical+'#webpage',url:canonical,name:title,description,inLanguage:'en-US',isPartOf:{'@id':site+'/#site'},publisher:{'@id':site+'/#org'},breadcrumb:{'@id':canonical+'#breadcrumb'},primaryImageOfPage:{'@type':'ImageObject',url:image},...(route.template==='article'?{mainEntity:{'@id':canonical+'#article'}}:{})};
}
function indexable(routes:PublicRoute[],excluded:ReadonlySet<string>){return routes.filter(route=>!route.noindex&&!excluded.has(route.path)&&/^\/(?:[a-z0-9-]+\/)*$/.test(route.path)&&!/^\/(?:admin|api)\//.test(route.path));}
export function sitemapDocument(site:string,routes:PublicRoute[],excluded:ReadonlySet<string>){
 const urls=[...new Map(indexable(routes,excluded).map(route=>[route.path,route])).values()].map(route=>{
  const date=route.modified||route.published;
  const modified=date&&/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(date)&&Number.isFinite(Date.parse(date))?'<lastmod>'+date.slice(0,10)+'</lastmod>':'';
  return '  <url><loc>'+xml(site+route.path)+'</loc>'+modified+'</url>';
 });
 return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.join('\n')+'\n</urlset>\n';
}
type Business={email:string;phone:string;studios:ReadonlyArray<{name:string;street:string;city:string;zip:string}>;layers?:ReadonlyArray<{name:string;line:string}>};
export function discoveryDocument(site:string,routes:PublicRoute[],business:Business,excluded:ReadonlySet<string>){
 const visible=indexable(routes,excluded);
 const line=(route:PublicRoute)=>'- ['+(route.metaTitle||route.title||route.path).replace(/[\r\n[\]]/g,' ')+']('+site+route.path+')'+(route.metaDescription?': '+route.metaDescription.replace(/[\r\n]/g,' '):'');
 const section=(heading:string,templates:string[])=>['','## '+heading,...visible.filter(route=>templates.includes(route.template)).map(line)];
 return ['# ZINC Digital','','> ZINC Digital connects Build, Demand and Intelligence: websites and applications, search and paid media, and business intelligence. Miami HQ, Panama City satellite, working nationwide.','','This directory reflects published, indexable pages. It is a navigation aid, not an indexing guarantee. Published page content is the source of truth for scope, project status and authorship.',...section('Company',['home','about','contact']),...(business.layers?.length?['','## Layers',...business.layers.map(layer=>'- '+layer.name+': '+layer.line)]:[]),...section('Services',['services','service']),...section('Work',['work','case']),...section('Insights',['blog','article']),...section('Authors',['author']),'','## Locations',...business.studios.map(studio=>'- '+studio.name+': '+studio.street+', '+studio.city+', FL '+studio.zip+', United States.'),'','## Contact','- Email: '+business.email,'- Telephone: '+business.phone,'','## Site discovery','- [XML sitemap]('+site+'/sitemap.xml)','- [Crawler directives]('+site+'/robots.txt)',''].join('\n');
}
