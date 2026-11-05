// Subscription choices follow the site's registered services. A page suggests one
// topic; it never opts the reader into its other related services.
export const subscriptionTopics = [
  {slug:'shopify', title:'Shopify Ecommerce', listId:'6a91dcde-d93f-11f1-8b45-02420a320002', group:'Build'},
  {slug:'web-design', title:'Web Design', listId:'dc699668-d939-11f1-8205-02420a320002', group:'Build'},
  {slug:'apps', title:'Apps', listId:'736bb1c2-d93f-11f1-a8f0-02420a320002', group:'Build'},
  {slug:'seo', title:'SEO', listId:'750224f8-d93f-11f1-a8f0-02420a320002', group:'Demand'},
  {slug:'local-seo', title:'Local SEO', listId:'76d17fea-d93f-11f1-bed6-02420a320002', group:'Demand'},
  {slug:'ai-search-optimization', title:'AI Search Optimization', listId:'8c4f261a-d93f-11f1-8fb5-02420a320002', group:'Demand'},
  {slug:'google-search-ads', title:'Google Search Ads', listId:'995db2ae-d93f-11f1-8fb5-02420a320002', group:'Demand'},
  {slug:'shopping-ads', title:'Shopping / Merchant Center Ads', listId:'9b20a362-d93f-11f1-a8f0-02420a320002', group:'Demand'},
  {slug:'social-ads', title:'Social Ads (Meta)', listId:'9cff1ede-d93f-11f1-bd9c-02420a320002', group:'Demand'},
  {slug:'tiktok-ads', title:'TikTok Ads', listId:'9eaf1ad6-d93f-11f1-8fb5-02420a320002', group:'Demand'},
  {slug:'business-intelligence', title:'Business Intelligence', listId:'a0de1596-d93f-11f1-8792-02420a320002', group:'Intelligence'},
] as const;

export function subscriptionTopic(slug: string | null | undefined) {
  return subscriptionTopics.find(topic => topic.slug === slug);
}

export function subscriptionHref(slug?: string) {
  const topic = subscriptionTopic(slug);
  return topic ? '/subscribe/?topic=' + topic.slug : '/subscribe/';
}


// Public identifiers supplied by Constant Contact's install code; these are not credentials.
export const subscriptionProvider = {accountId:'38e6398aba9746f32332660656d7ade0', formId:'2781d4d0-5120-4d57-90aa-85d5fda4775c'} as const;
