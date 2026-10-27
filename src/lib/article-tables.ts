import layouts from '../data/article-table-layouts.json' with { type: 'json' };
type Block = {type:string;runs?:{text:string;href?:string}[]};
export type ArticleTable = {headers:string[];rows:string[][];caption:string};
/** Restore only the inventoried tables whose migration flattened cells into prose. */
export function articleTables(slug:string, blocks:readonly Block[]) {
 const tables = new Map<number,ArticleTable>();
 const skipped = new Set<number>();
 const specs = (layouts as Record<string,(string|number)[][]>)[slug] || [];
 for (const [header,count] of specs) {
  const index=blocks.findIndex(b=>b.type==='p'&&b.runs?.map(r=>r.text).join('')===header);
  if(index<0) continue;
  const headers=String(header).split(' · '), length=Number(count);
  const rows=blocks.slice(index+1,index+1+length);
  if(rows.length!==length || [blocks[index],...rows].some(b=>b.type!=='p'||b.runs?.some(r=>r.href)||b.runs?.map(r=>r.text).join('').split(' · ').length!==headers.length)) continue;
  const previous=blocks.slice(0,index).findLast(b=>b.type==='heading');
  tables.set(index,{headers,rows:rows.map(b=>b.runs!.map(r=>r.text).join('').split(' · ')),caption:previous?.runs?.map(r=>r.text).join('')||'Comparison'});
  for(let i=index+1;i<=index+length;i++) skipped.add(i);
 }
 return {tables,skipped};
}
