// Email interests include the 11 services plus five narrower editorial subjects.
// These do not create service pillars. A page suggests one topic, never other lists.
export const subscriptionTopics = [
  {slug:'shopify', title:'Shopify Ecommerce', listId:'6a91dcde-d93f-11f1-8b45-02420a320002', group:'Build'},
  {slug:'web-design', title:'Web Design', listId:'dc699668-d939-11f1-8205-02420a320002', group:'Build'},
  {slug:'apps', title:'Apps', listId:'736bb1c2-d93f-11f1-a8f0-02420a320002', group:'Build'},
  {slug:'databases', title:'Databases', listId:'8a211f02-d96b-11f1-a160-02420a320002', group:'Build'},
  {slug:'brand-development', title:'Brand Development', listId:'96fc78fc-d96b-11f1-8fb5-02420a320002', group:'Build'},
  {slug:'seo', title:'SEO', listId:'750224f8-d93f-11f1-a8f0-02420a320002', group:'Demand'},
  {slug:'local-seo', title:'Local SEO', listId:'76d17fea-d93f-11f1-bed6-02420a320002', group:'Demand'},
  {slug:'ai-search-optimization', title:'AI Search Optimization', listId:'8c4f261a-d93f-11f1-8fb5-02420a320002', group:'Demand'},
  {slug:'google-search-ads', title:'Google Search Ads', listId:'995db2ae-d93f-11f1-8fb5-02420a320002', group:'Demand'},
  {slug:'shopping-ads', title:'Shopping / Merchant Center Ads', listId:'9b20a362-d93f-11f1-a8f0-02420a320002', group:'Demand'},
  {slug:'social-ads', title:'Social Ads (Meta)', listId:'9cff1ede-d93f-11f1-bd9c-02420a320002', group:'Demand'},
  {slug:'tiktok-ads', title:'TikTok Ads', listId:'9eaf1ad6-d93f-11f1-8fb5-02420a320002', group:'Demand'},
  {slug:'content-marketing', title:'Content Marketing', listId:'908545a8-d96b-11f1-8b45-02420a320002', group:'Demand'},
  {slug:'analytics', title:'Analytics', listId:'78959290-d96b-11f1-91d0-02420a320002', group:'Intelligence'},
  {slug:'market-analysis', title:'Market Analysis', listId:'829404d4-d96b-11f1-a160-02420a320002', group:'Intelligence'},
  {slug:'business-intelligence', title:'Business Intelligence', listId:'a0de1596-d93f-11f1-8792-02420a320002', group:'Intelligence'},
] as const;

export const subscriptionGroups = [
  {title:'Build', description:'Websites, stores & applications'},
  {title:'Demand', description:'Search, content & paid media'},
  {title:'Intelligence', description:'Data, research & decisions'},
] as const;

export function matchesSubscriptionLists(ids: string[]) {
  const expected = new Set<string>(subscriptionTopics.map(topic => topic.listId));
  return ids.length === expected.size && new Set(ids).size === expected.size && ids.every(id => expected.has(id));
}

export function subscriptionTopic(slug: string | null | undefined) {
  return subscriptionTopics.find(topic => topic.slug === slug);
}

export function subscriptionHref(slug?: string) {
  const topic = subscriptionTopic(slug);
  return topic ? '/subscribe/?topic=' + topic.slug : '/subscribe/';
}


// Public identifiers supplied by Constant Contact's install code; these are not credentials.
export const subscriptionProvider = {accountId:'38e6398aba9746f32332660656d7ade0', formId:'2781d4d0-5120-4d57-90aa-85d5fda4775c'} as const;
