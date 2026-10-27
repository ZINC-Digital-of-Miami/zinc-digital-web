import edits from './article-copy-edits.json' with {type:'json'};
import type {Block, Run} from './site';

type Revision = {remove:number[];replace:{index:number;text:string;runs?:Run[]}[];itemReplacements?:{index:number;item:number;text:string}[]};
export const ARTICLE_REVISION = '2026-10-27T10:04:00Z';

/** Reviewed copy changes over the retained migration snapshot. */
export function reviseArticle(slug:string, blocks:Block[]):Block[] {
  const revision=(edits as Record<string,Revision>)[slug];
  if(!revision) return blocks;
  const removed=new Set(revision.remove);
  const replacements=new Map(revision.replace.map(edit=>[edit.index,edit]));
  return blocks.flatMap((block,index)=>{
    if(removed.has(index)) return [];
    const replacement=replacements.get(index);
    if(replacement) return [{...block,runs:replacement.runs || [{text:replacement.text}]}];
    const items=revision.itemReplacements?.filter(edit=>edit.index===index);
    if(items?.length && block.items) return [{...block,items:block.items.map((runs,item)=>{
      const edit=items.find(edit=>edit.item===item);
      return edit ? [{text:edit.text}] : runs;
    })}];
    return [block];
  });
}
