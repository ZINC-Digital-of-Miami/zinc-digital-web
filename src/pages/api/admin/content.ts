export const prerender = false;
import type { APIRoute } from 'astro';
import { requireStaff } from '../../../lib/auth';
import { createServerClient } from '../../../lib/supabase';
import { input, reply, fail } from '../../../lib/admin-http';
import { contentInput } from '../../../lib/admin-input';
import { contentList } from '../../../lib/admin-data';
import { routes } from '../../../data/site';
export const POST: APIRoute = async ctx => {
  const staff = requireStaff(ctx); if (staff instanceof Response) return staff;
  try {
    const body = await input(ctx);
    // Older SEO links/forms may still identify an article as a page. Keep one write owner.
    const article = body.kind === 'page' && routes.find(r => r.path === body.path && r.template === 'article');
    if (article) { body.kind = 'post'; body.slug = article.slug; }
    const {kind,key,patch} = contentInput(body,routes.filter(r=>r.template!=='article').map(r=>r.path));
    const sb=createServerClient(ctx), table=kind==='page'?'pages':'posts', field=kind==='page'?'path':'slug';
    const existing=await sb.from(table).select('id').eq(field,key).maybeSingle();
    if(existing.error) return reply({error:'Content could not be loaded.'},502);
    const baseline=(await contentList(ctx)).find(x=>x.kind===kind&&x.key===key);
    if(body.create===true&&(baseline||existing.data))return fail('This post address already exists. Choose another slug.');
    let result;
    if(existing.data) result=await sb.from(table).update({...patch,updated_by:staff.id}).eq('id',existing.data.id).select('id').single();
    else {
      if(!baseline&&!patch.title) return fail('A new post needs a title.');
      const base=baseline ? {title:baseline.title,meta_title:baseline.meta_title,meta_description:baseline.meta_description,status:baseline.status,noindex:baseline.noindex} : {status:'draft',author:'Team ZINC'};
      const specific=kind==='page'?{path:key,template:baseline!.template}:{slug:key,origin:baseline?'repo':'admin',layer:baseline?.layer || patch.layer || 'Demand'};
      result=await sb.from(table).insert({...base,...specific,...patch,updated_by:staff.id}).select('id').single();
    }
    if(result.error) return reply({error:'The draft could not be saved. Try again.'},502);
    return reply({ok:true,id:result.data.id});
  } catch(e) {return fail(e instanceof Error?e.message:undefined);}
};
