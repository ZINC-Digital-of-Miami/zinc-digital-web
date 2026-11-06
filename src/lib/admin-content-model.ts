import type { ContentItem } from './admin-data';

type SavedRow = Record<string, any>;
const hasPending = (row: SavedRow) => !row.live_at || !row.updated_at || new Date(row.updated_at) > new Date(row.live_at);
const seoFields = ['meta_title', 'meta_description', 'focus_keyword', 'noindex'] as const;

/** Compare the effective editor values before creating or touching a saved override. */
export function contentChanged(current:ContentItem,patch:Record<string,unknown>) {
  return Object.entries(patch).some(([field,value])=>{
    const previous=field==='primary_service' ? current.primary_service||null
      : field==='noindex' ? !!current.noindex
      : field==='layer' ? current.layer??'Build'
      : field==='meta_title' ? current.meta_title??current.title
      : field==='author' ? current.author??'Team ZINC' : current[field as keyof ContentItem]??'';
    return value!==previous;
  });
}

/** Article metadata is owned exclusively by Posts. */
export function mergeAdminContent(repository: ContentItem[], pages: SavedRow[], posts: SavedRow[]): ContentItem[] {
  const items = repository.map(item => ({ ...item }));
  const articlePaths = new Set(items.filter(item => item.kind === 'post').map(item => item.path));
  for (const row of posts) articlePaths.add('/blog/' + row.slug + '/');
  if (pages.some(row => articlePaths.has(row.path))) throw new Error('Article metadata must be stored in Posts.');
  for (const [kind, rows] of [['page', pages], ['post', posts]] as const) {
    for (const row of rows) {
      const key = kind === 'page' ? row.path : row.slug;
      const index = items.findIndex(item => item.kind === kind && item.key === key);
      const item = { ...(index >= 0 ? items[index] : {}), ...row, kind, key, path: kind === 'page' ? key : '/blog/' + key + '/', template: row.template || 'article', saved: true, pending: hasPending(row) } as ContentItem;
      // Null means no saved override; empty strings and false remain intentional edits.
      if (index >= 0) for (const field of seoFields) if (row[field] == null) (item as any)[field] = items[index][field];
      if (index >= 0) items[index] = item; else items.push(item);
    }
  }
  return items;
}
