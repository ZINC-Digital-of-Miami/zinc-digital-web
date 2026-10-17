import type {APIRoute} from 'astro';
import {SITE,EMAIL,PHONE,STUDIOS,layers,layerMeta,noindexPaths,describe,excerpt} from '../data/site';
import {loadPublished} from '../lib/content';
import {discoveryDocument} from '../lib/public-seo';

export const GET: APIRoute = async () => {
 const {routes,posts}=await loadPublished();
 const pages=routes.map(route=>({...route,metaDescription:route.metaDescription||(route.template==='article'?excerpt(posts.find(post=>post.slug===route.slug)!,155):describe(route))}));
 return new Response(discoveryDocument(SITE,pages,{email:EMAIL,phone:PHONE,studios:STUDIOS,layers:layers.map(name=>({name,line:layerMeta[name].line}))},noindexPaths),{headers:{'content-type':'text/plain; charset=utf-8'}});
};
