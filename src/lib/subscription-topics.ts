// Subscription choices follow the site's registered services. A page suggests one
// topic; it never opts the reader into its other related services.
export const subscriptionTopics = [
  {slug:'shopify', title:'Shopify Ecommerce', group:'Build'},
  {slug:'web-design', title:'Web Design', group:'Build'},
  {slug:'apps', title:'Apps', group:'Build'},
  {slug:'seo', title:'SEO', group:'Demand'},
  {slug:'local-seo', title:'Local SEO', group:'Demand'},
  {slug:'ai-search-optimization', title:'AI Search Optimization', group:'Demand'},
  {slug:'google-search-ads', title:'Google Search Ads', group:'Demand'},
  {slug:'shopping-ads', title:'Shopping / Merchant Center Ads', group:'Demand'},
  {slug:'social-ads', title:'Social Ads (Meta)', group:'Demand'},
  {slug:'tiktok-ads', title:'TikTok Ads', group:'Demand'},
  {slug:'business-intelligence', title:'Business Intelligence', group:'Intelligence'},
] as const;

export function subscriptionTopic(slug: string | null | undefined) {
  return subscriptionTopics.find(topic => topic.slug === slug);
}

export function subscriptionHref(slug?: string) {
  const topic = subscriptionTopic(slug);
  return topic ? '/subscribe/?topic=' + topic.slug : '/subscribe/';
}

