export const prerender = false;
import type { APIRoute } from 'astro';
import { requireStaff } from '../../../lib/auth';
import { input, reply, fail } from '../../../lib/admin-http';
import { contentList } from '../../../lib/admin-data';
import { contentInput } from '../../../lib/admin-input';
import { analyzeContent } from '../../../lib/seo-service';
export const POST: APIRoute = async ctx => {
  const staff = requireStaff(ctx); if (staff instanceof Response) return staff;
  try {
    let body: Record<string,unknown>;
    try { body = await input(ctx); } catch (error) { return fail(error instanceof Error?error.message:'Invalid analysis request.'); }
    const items = await contentList(ctx);
    const key = body.kind === 'page' ? body.path : body.slug;
    const item = items.find(item => item.kind === body.kind && item.key === key);
    if (!item) return fail('Choose an existing page or saved post.');
    let patch: Partial<typeof item>;
    try { ({ patch } = contentInput(body, items.filter(item=>item.kind==='page').map(item=>item.path))); } catch (error) { return fail(error instanceof Error?error.message:'Invalid draft fields.'); }
    return reply(await analyzeContent(item, patch));
  } catch (error) { return reply({error:error instanceof Error?error.message:'The page could not be analyzed.'},502); }
};
