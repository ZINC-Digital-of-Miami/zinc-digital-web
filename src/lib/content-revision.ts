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
 // One SQL statement sees one MVCC snapshot, including an empty pages/posts collection.
 const {data,error}=await sb.rpc('read_published_content').abortSignal(AbortSignal.timeout(10000));
 if(error||!data||!Array.isArray(data.pages)||!Array.isArray(data.posts))throw new Error('Published content could not be read. Build stopped to preserve the current deployment.');
 const {pages,posts}=data as {pages:Snapshot[];posts:Snapshot[]};
 const versions=[...pages,...posts].filter(x=>x.live).map(x=>Date.parse(x.live_at||''));
 if(versions.some(x=>!Number.isFinite(x))||new Set(versions).size>1)throw new Error('Published content has inconsistent publication versions. Build stopped to preserve the current deployment.');
 if(at&&[...pages,...posts].some(x=>x.live&&Date.parse(x.live_at||'')!==Date.parse(at)))throw new Error('Another publication changed the snapshot. Refresh publishing status before trying again.');
 return{pages,posts,revision:contentRevision(pages,posts)};
}
