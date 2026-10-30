// Pillars are blog categories aligned with registered primary services.
// An article may be relevant to more than one service; reading guides sit within categories.
export const categoryPath = (service: string) => '/blog/category/' + service + '/';
export function categoryPosts<T extends {related: readonly string[]}>(service: string, posts: readonly T[]): T[] {
  return posts.filter(post => post.related.includes(service));
}
