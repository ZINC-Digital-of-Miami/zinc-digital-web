// Read snapshots only: a saved draft never changes the prerendered public site.
import {createAdminClient} from './supabase';
import {env} from './env';
import {routes,posts} from '../data/site';
import {publishedContent} from './content-model';
let loading:Promise<ReturnType<typeof publishedContent>>|undefined;
export function loadPublished(){
  if(!loading)loading=(async()=>{
    if(!env.supabaseSecretKey()){console.info('Content: no build key configured; using repository content.');return {routes,posts};}
    const sb=createAdminClient();
    const results=await Promise.all([sb.from('pages').select('live,live_at').abortSignal(AbortSignal.timeout(10000)),sb.from('posts').select('live,live_at').abortSignal(AbortSignal.timeout(10000))]);
    if(results.some(x=>x.error))throw new Error('Published content could not be read. Build stopped to preserve the current deployment.');
    return publishedContent(routes,posts,results[0].data||[],results[1].data||[]);
  })();
  return loading;
}
