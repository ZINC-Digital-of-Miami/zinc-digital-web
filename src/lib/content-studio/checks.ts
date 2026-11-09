import {parseFragment} from 'parse5';
export function inspectDraftHtml(html:string){
 const findings:{area:string;observation:string;needsReview:boolean}[]=[],images:{src:string;alt:string}[]=[],links:string[]=[];let tables=0,headedTables=0,h2=0;
 const walk=(node:any)=>{const attr=(name:string)=>node.attrs?.find((a:any)=>a.name===name)?.value||'';if(node.tagName==='img')images.push({src:attr('src'),alt:attr('alt')});if(node.tagName==='a')links.push(attr('href'));if(node.tagName==='h2')h2++;if(node.tagName==='table'){tables++;const headers=(n:any):boolean=>n.tagName==='th'||(n.childNodes||[]).some(headers);if(headers(node))headedTables++;}for(const child of node.childNodes||[])walk(child);};walk(parseFragment(html));
 findings.push({area:'Structure',observation:`${h2} second-level headings; ${tables} tables, ${headedTables} with header cells. Counts do not establish usefulness.`,needsReview:true});
 findings.push({area:'Images',observation:`${images.length} inline images; ${images.filter(i=>!i.alt.trim()).length} without descriptive alt text. Inspect actual assets, captions and crops.`,needsReview:true});
 findings.push({area:'Links',observation:`${links.length} links found. Presence does not verify the destination or support for a claim.`,needsReview:true});
 return {findings,images,links,downloads:links.filter(l=>/\.(pdf|csv|xlsx|zip)(?:[?#]|$)/i.test(l)),sources:links.filter(l=>/^https:\/\//.test(l)&&!l.startsWith('https://www.zincdigital.co/'))};
}
