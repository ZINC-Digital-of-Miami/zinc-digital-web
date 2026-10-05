import type {Post,Route,Layer} from '../data/site';
type Snapshot={live:Record<string,any>|null;live_at?:string|null};
export function publishedContent(repoRoutes:Route[],repoPosts:Post[],pages:Snapshot[],rows:Snapshot[]) {
  const pageMap=new Map(pages.filter(x=>x.live).map(x=>[x.live!.path,x.live!]));
  const postMap=new Map<string,Record<string,any>>(rows.filter(x=>x.live).map(x=>[x.live!.slug,{...x.live!,live_at:x.live_at}]));
  const posts:Post[]=repoPosts.filter(p=>postMap.get(p.slug)?.status!=='draft').map(p=>{
    const live=postMap.get(p.slug);if(!live)return p;
    return {...p,title:live.title||p.title,layer:live.layer||p.layer,excerpt:live.excerpt||p.excerpt,author:live.author?{...p.author,name:live.author}:p.author};
  });
  for(const live of postMap.values())if(live.origin==='admin'&&live.status==='published'&&!repoPosts.some(p=>p.slug===live.slug)) {
    const date=live.published_at||live.live_at;
    if(!date)throw new Error('Published post is missing its publication date.');
    posts.push({id:live.id,slug:live.slug,title:live.title,date,dateGmt:date,modified:date,modifiedGmt:date,link:'/blog/'+live.slug+'/',author:{id:0,name:live.author||'Team ZINC',description:''},blocks:[],layer:live.layer as Layer,related:[],excerpt:live.excerpt,markdown:live.body||''} as unknown as Post);
  }
  posts.sort((a,b)=>b.dateGmt.localeCompare(a.dateGmt));
  const routes=repoRoutes.filter(r=>r.template!=='article'||posts.some(p=>p.slug===r.slug)).map(r=>({...r}));
  for(const p of posts)if(!routes.some(r=>r.template==='article'&&r.slug===p.slug))routes.push({path:'/blog/'+p.slug+'/',template:'article',title:p.title,slug:p.slug,layer:p.layer,published:p.date});
  for(const route of routes){
    const p=route.template==='article'?posts.find(p=>p.slug===route.slug):null;
    if(p){route.title=p.title;route.layer=p.layer;route.published=p.date;}
    const fields={...pageMap.get(route.path),...(p?postMap.get(p.slug):null)};
    if(fields.meta_title)route.metaTitle=fields.meta_title;
    if(fields.meta_description)route.metaDescription=fields.meta_description;
    if(typeof fields.noindex==='boolean')route.noindex=fields.noindex;
  }
  return {routes,posts};
}
