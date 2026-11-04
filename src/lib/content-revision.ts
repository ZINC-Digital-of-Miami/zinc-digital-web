import {createHash} from 'node:crypto';
import type {SupabaseClient} from '@supabase/supabase-js';
type Snapshot={live:Record<string,unknown>|null;live_at?:string|null};
const canonical=(value:any):string=>value===null||typeof value!=='object'?JSON.stringify(value):Array.isArray(value)?'['+value.map(canonical).join(',')+']':'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
/** Hash only published snapshots, never drafts. Row/key ordering cannot change a receipt. */
export function contentRevision(pages:Snapshot[],posts:Snapshot[]){
 const rows=(items:Snapshot[])=>items.filter(x=>x.live).map(x=>canonical(x)).sort();
 return createHash('sha256').update(JSON.stringify([rows(pages),rows(posts)])).digest('hex');
}
export async function readContentSnapshots(sb:SupabaseClient,at?:string){
 const results=await Promise.all(['pages','posts'].map(table=>sb.from(table).select('live,live_at').abortSignal(AbortSignal.timeout(10000))));
 if(results.some(x=>x.error))throw new Error('Published content could not be read. Build stopped to preserve the current deployment.');
 const [pages,posts]=results.map(x=>(x.data||[]) as Snapshot[]);
 if(at&&[...pages,...posts].some(x=>x.live&&Date.parse(x.live_at||'')!==Date.parse(at)))throw new Error('Another publication changed the snapshot. Refresh publishing status before trying again.');
 return{pages,posts,revision:contentRevision(pages,posts)};
}
