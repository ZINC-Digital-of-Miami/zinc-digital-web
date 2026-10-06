import type { ContentItem } from './admin-data';

type SavedRow = Record<string, any>;
const hasPending = (row: SavedRow) => !row.live_at || !row.updated_at || new Date(row.updated_at) > new Date(row.live_at);
const seoFields = ['meta_title', 'meta_description', 'focus_keyword', 'noindex'] as const;

export function effectiveSeo(legacy: SavedRow = {}, post: SavedRow = {}) {
  return Object.fromEntries(seoFields.map(field => [field, post[field] ?? legacy[field]]));
}

/** Article URLs have one owner: Posts. Retain SEO saved by the former page editor. */
export function mergeAdminContent(repository: ContentItem[], pages: SavedRow[], posts: SavedRow[]): ContentItem[] {
  const items = repository.map(item => ({ ...item }));
  const articlePaths = new Set(items.filter(item => item.kind === 'post').map(item => item.path));
  for (const row of posts) articlePaths.add('/blog/' + row.slug + '/');
  const legacyPages = new Map(pages.filter(row => articlePaths.has(row.path)).map(row => [row.path, row]));
  for (const [kind, rows] of [['page', pages.filter(row => !articlePaths.has(row.path))], ['post', posts]] as const) {
    for (const row of rows) {
      const key = kind === 'page' ? row.path : row.slug;
      const index = items.findIndex(item => item.kind === kind && item.key === key);
      const item = { ...(index >= 0 ? items[index] : {}), ...row, kind, key, path: kind === 'page' ? key : '/blog/' + key + '/', template: row.template || 'article', saved: true, pending: hasPending(row) } as ContentItem;
      if (index >= 0) items[index] = item; else items.push(item);
    }
  }
  for (const item of items) {
    if (item.kind !== 'post') continue;
    const legacy = legacyPages.get(item.path);
    if (!legacy) continue;
    const post = posts.find(row => row.slug === item.key);
    // Public snapshots apply page SEO first, then saved post fields (including explicit clears).
    for (const [field, value] of Object.entries(effectiveSeo(legacy, post))) if (value != null) (item as any)[field] = value;
    item.pending = !!item.pending || hasPending(legacy);
    if (!post) {
      item.saved = true;
      item.updated_at = legacy.updated_at;
      item.live_at = legacy.live_at;
      item.live = legacy.live;
    }
  }
  return items;
}
