export function chunk(text:string){
 if(!text.trim())throw new Error('The source has no readable text.');
 if(text.length>200000)throw new Error('Sources must contain at most 200,000 characters.');
 const parts:string[]=[];
 for(let start=0;start<text.length;start+=2720){parts.push(text.slice(start,start+3200));if(start+3200>=text.length)break;}
 if(parts.length>120)throw new Error('The source contains too many chunks.');
 return parts;
}
export function pageText(html:string){return html.replace(/<(script|style|noscript|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&#(x[\da-f]+|\d+);/gi,(_,x)=>{const n=parseInt(x.startsWith('x')?x.slice(1):x,x.startsWith('x')?16:10);return n>0&&n<=0x10ffff?String.fromCodePoint(n):' ';}).replace(/&(?:nbsp|amp|lt|gt|quot|apos);/g,x=>({'&nbsp;':' ','&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"}[x]||x)).replace(/\s+/g,' ').trim();}
export const FILE_LIMIT=10*1024*1024;
export const fileTypes:Record<string,string>={pdf:'application/pdf',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',txt:'text/plain',md:'text/markdown'};
export function fileInput(name:unknown,size:unknown,mime:unknown){
 if(typeof name!=='string'||name.length>180||!name.trim()||typeof size!=='number'||size<=0||size>FILE_LIMIT)throw new Error('Choose a PDF, DOCX, TXT or MD file up to 10 MB.');
 const ext=name.toLowerCase().split('.').pop()||'',type=fileTypes[ext];
 if(!type||(mime&&mime!==type&&!(ext==='md'&&mime==='text/plain')))throw new Error('Choose a PDF, DOCX, TXT or MD file.');
 return {name:name.replace(/[^a-zA-Z0-9._-]/g,'_'),type,ext};
}
