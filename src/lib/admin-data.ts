import type { APIContext, AstroGlobal } from 'astro';
import { createServerClient } from './supabase';
import { routes, posts, describe, excerpt } from '../data/site';
import { seoScore } from './seo-score';
import { mergeAdminContent } from './admin-content-model';

export type ContentItem = {
  kind: 'page' | 'post'; key: string; path: string; title: string; template: string; status: string;
  meta_title: string; meta_description: string; focus_keyword: string; noindex: boolean;
  layer: string; body: string; excerpt: string; author: string; origin: string;
  updated_at?: string; live_at?: string; live?: Record<string, unknown> | null; saved: boolean; pending?: boolean;
};
export type InquiryRow = {
  id: string; company: string; name: string; email: string; website: string; services: string[];
  budget: string; timeline: string; message: string; notes: string; next_step: string; stage: string;
  source_path: string; created_at: string; archived_at: string | null; notify_status: string;
};
export const stages = [['new','New','Reply within 24h'],['contacted','Contacted','Book discovery call'],['qualified','Qualified','Send proposal'],['closed','Closed','Archive']] as const;
export const when = (value: string | null | undefined) => value ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' }).format(new Date(value)) + ' CT' : '—';
export function repositoryContent(): ContentItem[] {
  const pages: ContentItem[] = routes.filter(r => r.template !== 'article').map(r => ({ kind: 'page', key: r.path, path: r.path, title: r.title, template: r.template, status: 'published', meta_title: r.title, meta_description: describe(r), focus_keyword: '', noindex: r.template === 'thanks', layer: r.layer || '', body: '', excerpt: '', author: '', origin: 'repo', saved: false }));
  return [...pages, ...posts.map(p => ({ kind: 'post' as const, key: p.slug, path: '/blog/' + p.slug + '/', title: p.title, template: 'article', status: 'published', meta_title: p.title, meta_description: excerpt(p,160), focus_keyword: '', noindex: false, layer: p.layer, body: '', excerpt: excerpt(p,2000), author: p.author.name, origin: 'repo', saved: false }))];
}
export async function contentList(ctx: APIContext | AstroGlobal) {
  const sb = createServerClient(ctx);
  const [pageResult, postResult] = await Promise.all([sb.from('pages').select('*'), sb.from('posts').select('*')]);
  if (pageResult.error || postResult.error) throw new Error('Content could not be loaded.');
  return mergeAdminContent(repositoryContent(), pageResult.data || [], postResult.data || []);
}
export function score(item: ContentItem) { return seoScore({ title: item.meta_title || item.title, desc: item.meta_description || '', status: item.status }); }
export function unpublished(items: ContentItem[]) {
  return items.filter(x => x.pending ?? (x.saved && (!x.live_at || !x.updated_at || new Date(x.updated_at) > new Date(x.live_at)))).length;
}
export async function shellData(ctx: APIContext | AstroGlobal) {
  const sb = createServerClient(ctx);
  const [inquiries, staff, projects,content] = await Promise.all([
    sb.from('inquiries').select('id', { count: 'exact', head: true }).is('archived_at',null),
    sb.from('staff').select('user_id', { count:'exact',head:true }),
    sb.schema('research').from('projects').select('id', { count:'exact',head:true }),
    contentList(ctx).catch(()=>null),
  ]);
  return { connected: !inquiries.error && !staff.error, counts: { inquiries: inquiries.error ? null : inquiries.count, staff: staff.error ? null : staff.count, research: projects.error ? null : projects.count, pages: content?.filter(x=>x.kind==='page').length??null, posts: content?.filter(x=>x.kind==='post').length??null } };
}
export async function inquiries(ctx: APIContext | AstroGlobal) {
  const { data, error } = await createServerClient(ctx).from('inquiries').select('*').order('created_at',{ascending:false}).limit(1000);
  if (error) throw new Error('Inquiries could not be loaded. Refresh to try again.');
  return (data || []) as InquiryRow[];
}
