import {parseFragment} from 'parse5';

type Node={nodeName:string;value?:string;attrs?:{name:string;value:string}[];childNodes?:Node[]};
const text=(node:Node):string=>node.nodeName==='#text'?node.value||'':['script','style','svg'].includes(node.nodeName)?'':(node.childNodes||[]).map(text).join(' ');

/** Supporting image entities come from the same rendered public markup the visitor receives. */
export function publicImageEntities(html:string,canonical:string):Record<string,unknown>[] {
 const page=new URL(canonical),images=new Map<string,Record<string,unknown>>();
 const walk=(node:Node,ancestors:Node[]=[])=>{
  if(['script','style','template','noscript','form','dialog'].includes(node.nodeName))return;
  const attrs=Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
  // An inactive carousel may hide a published photograph from the accessibility tree.
  // Its nonempty description still belongs in the public image graph.
  const decorative=attrs['aria-hidden']==='true'||attrs.role==='presentation';
  if(node.nodeName==='img'&&!decorative&&attrs.alt?.trim()&&attrs.src){
   try{
    const url=new URL(attrs.src,page);url.searchParams.delete('dpl');url.hash='';
    if(url.protocol==='https:'&&url.origin===page.origin&&!/^\/(?:admin|api)(?:\/|$)/.test(url.pathname)&&!images.has(url.href)){
     const figure=[...ancestors].reverse().find(n=>n.nodeName==='figure');
     const findCaption=(n:Node):Node|undefined=>n.nodeName==='figcaption'?n:(n.childNodes||[]).map(findCaption).find(Boolean);
     const caption=figure&&findCaption(figure);const label=caption?text(caption).replace(/\s+/g,' ').trim():'';
     const image:Record<string,unknown>={'@type':'ImageObject','@id':url.href+'#image',url:url.href,contentUrl:url.href,description:attrs.alt.trim(),isPartOf:{'@id':canonical+'#webpage'}};
     for(const key of ['width','height']){const value=Number(attrs[key]);if(Number.isSafeInteger(value)&&value>0)image[key]=value;}
     if(label)image.caption=label;
     images.set(url.href,image);
    }
   }catch{/* A malformed source is not published as an image entity. */}
  }
  for(const child of node.childNodes||[])walk(child,[...ancestors,node]);
 };
 walk(parseFragment(html) as Node);return [...images.values()];
}
