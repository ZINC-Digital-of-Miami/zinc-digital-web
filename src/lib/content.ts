// Read snapshots only: a saved draft never changes the prerendered public site.
import {createAdminClient} from './supabase';
import {env} from './env';
import {routes,posts} from '../data/site';
import {publishedContent} from './content-model';
import {readContentSnapshots} from './content-revision';
let loading:Promise<ReturnType<typeof publishedContent>&{revision:string|null}>|undefined;
export function loadPublished(){
  if(!loading)loading=(async()=>{
    if(!env.supabaseSecretKey()){console.info('Content: no build key configured; using repository content.');return {routes,posts,revision:null};}
    const sb=createAdminClient();
    const {pages,posts:snapshots,revision}=await readContentSnapshots(sb);
    return {...publishedContent(routes,posts,pages,snapshots),revision};
  })().catch(error=>{
    // Fail this request closed, but let a later request recover from a transient read failure.
    loading=undefined;
    throw error;
  });
  return loading;
}
