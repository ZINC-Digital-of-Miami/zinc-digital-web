// Pillars are blog categories aligned with registered primary services.
// Each article belongs to one primary service; cross-links do not confer membership.
export const categoryPath = (service: string) => '/blog/category/' + service + '/';
export function categoryPosts<T extends {primaryService: string}>(service: string, posts: readonly T[]): T[] {
  return posts.filter(post => post.primaryService === service);
}

/** Describe the articles actually available in each service-aligned category. */
export const categoryEditorial: Record<string, {description: string; intro: string}> = {
  'seo': {
    description: 'Find and fix crawling, indexing, content and internal-link problems. ZINC’s SEO guides explain what to check, which evidence to use and what to do next.',
    intro: 'Which pages can search engines find, and do they answer the customer’s question? Start with the SEO foundations, then investigate indexing, content and links with evidence.',
  },
  'local-seo': {
    description: 'Review business profiles, location pages and local search measurement with ZINC’s Local SEO guide for businesses serving a defined area.',
    intro: 'Start with the facts customers need: where you operate, what you offer and how to reach you. Our local SEO guide connects business profiles, location pages and measurement.',
  },
  'ai-search-optimization': {
    description: 'Explore AI search optimization, source-backed research and useful content. Separate documented search controls from experiments and unverified citation claims.',
    intro: 'What can you verify about how search and answer systems encounter your business? These articles connect accessible content, accurate sources and careful observation without promising AI placement.',
  },
  'web-design': {
    description: 'Plan useful service pages and landing pages, review technical search issues, and assess a website rebuild with ZINC’s web design and site-structure guides.',
    intro: 'A website needs to help visitors understand the offer and take the next step. Review page content, landing-page journeys and the technical choices that support a dependable site.',
  },
  'shopify': {
    description: 'Check Shopify product pages, search visibility, Merchant Center feeds and ecommerce events. Practical guides connect store changes with customer buying journeys.',
    intro: 'Can customers find the right product, and does the data match what they can buy? Work through product-page SEO, feed consistency and ecommerce measurement before changing the store.',
  },
  'shopping-ads': {
    description: 'Diagnose Merchant Center feeds, compare product variants and plan Google Shopping campaigns with ZINC’s guides to catalog quality and campaign economics.',
    intro: 'Shopping campaigns depend on the catalog behind them. Check product eligibility, prices, availability and order economics before deciding what to promote.',
  },
  'google-search-ads': {
    description: 'Plan search-ad budgets, campaign tagging and useful landing pages. ZINC’s guides help connect paid-media decisions with a defined business outcome.',
    intro: 'Choose the outcome before the channel or budget. These guides cover campaign planning, landing pages and tagging so search-ad decisions have a clear business purpose.',
  },
  'social-ads': {
    description: 'Set up and review Meta campaigns, choose channels and check landing pages. Practical paid-social guides connect creative tests with business outcomes.',
    intro: 'A useful paid-social test needs a clear question, suitable creative and a working destination. Explore Meta campaign setup, channel selection and landing-page checks.',
  },
  'tiktok-ads': {
    description: 'Plan TikTok campaigns, creative and event measurement with practical guides connected to ZINC’s TikTok advertising service.',
    intro: 'Start with the customer, the creative question and the purchase journey. These guides cover TikTok campaign setup and the evidence needed to assess delivery and response.',
  },
  'business-intelligence': {
    description: 'Define business measures, validate analytics and interpret campaign or search changes. ZINC’s guides connect reporting evidence with decisions and next steps.',
    intro: 'What does the number measure, can you trust it, and which decision does it support? Start with reporting foundations, then investigate analytics, campaign economics and research evidence.',
  },
  'apps': {
    description: 'Business app planning: workflows, permissions, integrations and testing. Explore the service while dedicated app guides are being prepared.',
    intro: 'Start with the workflow, its users and the information they need. Our Apps service covers interfaces, permissions, integrations and testing. Dedicated articles for this pillar are being prepared.',
  },
};
