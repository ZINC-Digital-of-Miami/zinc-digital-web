import {parse,type DefaultTreeAdapterMap} from 'parse5';
/** Public head/image signals only. Never follows links or exposes script bodies. */
export function reviewSignals(html:string){
 type Node=DefaultTreeAdapterMap['node'];
 const nodes:Node[]=[];const visit=(n:Node)=>{nodes.push(n);if('childNodes' in n)for(const c of n.childNodes)visit(c);};visit(parse(html));
 const attr=(n:DefaultTreeAdapterMap['element'],name:string)=>n.attrs.find(a=>a.name===name)?.value.slice(0,1200)||'';
 const plain=(n:Node):string=>n.nodeName==='#text'?(n as DefaultTreeAdapterMap['textNode']).value:'childNodes' in n?n.childNodes.map(plain).join(''):'';
 const elements=nodes.filter((n):n is DefaultTreeAdapterMap['element']=>'tagName' in n);
 const names=new Set(['description','robots','og:title','og:description','og:image','og:image:alt','twitter:title','twitter:description','twitter:image','twitter:image:alt']);
 return {title:plain(elements.find(n=>n.tagName==='title')||{nodeName:'#text',value:'',parentNode:null} as Node).slice(0,1200),canonical:elements.filter(n=>n.tagName==='link'&&attr(n,'rel')==='canonical').map(n=>attr(n,'href')),metadata:elements.filter(n=>n.tagName==='meta'&&names.has(attr(n,'name')||attr(n,'property'))).map(n=>({name:attr(n,'name')||attr(n,'property'),content:attr(n,'content')})),imagesMissingAlt:elements.filter(n=>n.tagName==='img'&&!n.attrs.some(a=>a.name==='alt')).slice(0,20).map(n=>attr(n,'src'))};
}
