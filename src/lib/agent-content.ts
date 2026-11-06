import {parse,serialize,type DefaultTreeAdapterMap} from 'parse5';
import {publicImageEntities} from './public-images.ts';

type Node={nodeName:string;value?:string;attrs?:{name:string;value:string}[];childNodes?:Node[]};
const attr=(node:Node,key:string)=>node.attrs?.find(a=>a.name===key)?.value;
const find=(node:Node,name:string):Node|undefined=>node.nodeName===name?node:(node.childNodes||[]).map(n=>find(n,name)).find(Boolean);
const plain=(node:Node):string=>node.nodeName==='#text'?node.value||'':(node.childNodes||[]).map(plain).join(' ');
const escapeText=(value:string)=>value.replace(/([\\\[\]*_`])/g,'\\$1');
const publicURL=(value:string,canonical:string)=>{try{const url=new URL(value,canonical);return ['https:','http:','mailto:'].includes(url.protocol)?url.href:'';}catch{return '';}};

/** A second representation of the exact built public main content, with no extra database reader. */
export function pageMarkdown(html:string,canonical:string):string {
 const tree=parse(html) as Node,main=find(tree,'main');
 if(!main)throw new Error('Published page has no main content: '+canonical);
 const title=find(tree,'title');const seenImages=new Set<string>();
 const imageURL=(value:string)=>{const src=publicURL(value,canonical);if(!src)return '';const url=new URL(src);url.searchParams.delete('dpl');url.hash='';return url.href;};
 const render=(node:Node,hidden=false):string=>{
  if(node.nodeName==='#text')return (node.value||'').replace(/\s+/g,' ');
  const decorative=hidden||attr(node,'aria-hidden')==='true';
  if(decorative||['script','style','template','noscript','svg','form','input','textarea','select','button','dialog'].includes(node.nodeName))return '';
  const children=()=> (node.childNodes||[]).map(n=>render(n,decorative)).join('');
  if(node.nodeName==='img'){
   const alt=attr(node,'alt')?.trim(),src=imageURL(attr(node,'src')||'');
   if(!alt||!src||seenImages.has(src))return '';
   seenImages.add(src);return '\n\n!['+escapeText(alt)+']('+src+')\n\n';
  }
  if(node.nodeName==='a'){
   const label=children().trim(),url=publicURL(attr(node,'href')||'',canonical);
   return label&&url?'['+label+']('+url+')':label;
  }
  if(/^h[1-6]$/.test(node.nodeName))return '\n\n'+'#'.repeat(Number(node.nodeName[1]))+' '+children().trim()+'\n\n';
  if(node.nodeName==='li')return '\n- '+children().trim();
  if(node.nodeName==='table'){
   const rows:Node[]=[];const collect=(n:Node)=>{if(n.nodeName==='tr')rows.push(n);else for(const c of n.childNodes||[])collect(c);};collect(node);
   return '\n\n'+rows.map((row,i)=>{
    const cells=(row.childNodes||[]).filter(n=>['td','th'].includes(n.nodeName)).map(n=>render(n).replace(/\s+/g,' ').trim().replace(/\|/g,'\\|'));
    const line='| '+cells.join(' | ')+' |';return i===0?line+'\n| '+cells.map(()=>'---').join(' | ')+' |':line;
   }).join('\n')+'\n\n';
  }
  const content=children();
  return ['p','section','article','div','figure','figcaption','ul','ol','aside','nav','details','summary','blockquote','dl','dt','dd','br'].includes(node.nodeName)?'\n\n'+content.trim()+'\n\n':content;
 };
 const body=render(main);
 // Inactive public galleries are still published. Include their images without exposing hidden form content.
 const additional=publicImageEntities(serialize(main as unknown as DefaultTreeAdapterMap['parentNode']),canonical).filter(image=>!seenImages.has(String(image.contentUrl)));
 const gallery=additional.length?'\n\n## Additional published images\n\n'+additional.map(image=>'!['+escapeText(String(image.description))+']('+String(image.contentUrl)+')').join('\n\n'):'';
 return '# '+(title?plain(title).replace(/\s+/g,' ').trim():new URL(canonical).pathname)+'\n\nSource: '+canonical+'\n\n'+(body+gallery).replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+'\n';
}

type Route={src:string;has?:{type:string;key:string;value:string}[];dest?:string;headers:Record<string,string>;continue?:boolean};
/** Explicit Markdown preference only; normal browser HTML requests never take this route. */
export function markdownRoutes(paths:string[]):Route[] {
 const routes:Route[]=[];
 for(const path of new Set(paths)){
  if(!/^\/(?:[a-z0-9-]+\/)*$/.test(path)||/^\/(?:admin|api)(?:\/|$)/.test(path)||['/thanks/','/404/','/subscribe/','/contact/send/'].includes(path))throw new Error('Not a public indexable page: '+path);
  const escape=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const headers={'Content-Type':'text/markdown; charset=utf-8',Vary:'Accept',Link:'<https://www.zincdigital.co'+path+'>; rel="canonical"'};
  routes.push({src:'^'+escape(path)+'$',headers:{Vary:'Accept'},continue:true});
  routes.push({src:'^'+escape(path)+'$',has:[{type:'header',key:'accept',value:'^\\s*text/markdown(?:\\s*;\\s*q=1(?:\\.0{1,3})?)?(?:\\s*,\\s*(?:text/html|\\*/\\*)(?:\\s*;\\s*q=(?:0(?:\\.\\d{1,3})?|1(?:\\.0{1,3})?))?)*\\s*$'}],dest:path+'index.md',headers});
  routes.push({src:'^'+escape(path+'index.md')+'$',headers,continue:true});
 }
 return routes;
}
