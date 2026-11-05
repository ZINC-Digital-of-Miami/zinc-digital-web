// Reading-guide groups within service-aligned blog categories.
export const readingGuides = [
  {
    id: 'content',
    title: 'Content hubs & planning',
    slug: 'build-a-content-hub-people-can-use',
    description: 'Plan the category, assign distinct answers, connect the pages and check the complete customer journey.',
    members: [
      'build-a-content-hub-people-can-use',
      'content-briefs-search-intent-internal-links',
      'internal-link-audit',
      'content-refresh-review',
      'service-page-content-checklist',
      'ai-search-content-strategy',
      'what-ai-discovery-changes-editorial-plan',
    ],
  },
  {
    id: 'seo',
    title: 'Search & SEO',
    slug: 'four-pillars-of-seo-operators-view',
    description: 'Crawling, content, authority and the pages people actually use. Start with the framework, then trace the bottleneck.',
    members: [
      'four-pillars-of-seo-operators-view',
      'wordpress-php-security-moving-to-astro',
      'technical-seo-ten-fixes-that-move-rankings',
      'duplicate-content-isnt-a-penalty-but-its-a-tax',
      'google-search-console-the-operators-guide',
      'search-console-canonical-indexing-debugging',
      'search-console-query-page-review',
      'google-core-update-review',
      'how-long-seo-actually-takes',
      'local-seo-2026-operators-manual',
      'ai-search-results-and-generative-search-optimization',
      'seo-in-2026-what-changed-what-to-ignore',
      'how-to-read-a-google-algorithm-update',
      'three-years-of-algorithm-updates-what-moved-rankings',
    ],
  },
  {
    id: 'commerce',
    title: 'Ecommerce & product feeds',
    slug: 'shopify-seo-launch-checklist',
    description: 'Connect the storefront, product catalog and shopping listings. An ad cannot rescue a product nobody can buy.',
    members: [
      'shopify-seo-launch-checklist',
      'what-can-you-afford-to-spend-on-an-order',
      'shopify-seo-problems-real-fixes',
      'shopify-google-merchant-center-checklist',
      'google-shopping-ad-management-2026',
      'merchant-center-feed-diagnostics',
      'shopify-product-page-seo',
      'google-shopping-variant-feed-checklist',
      'holiday-ecommerce-preparation',
      'merchant-center-basics',
    ],
  },
  {
    id: 'growth',
    title: 'Channels & measurement',
    slug: 'seven-digital-channels-which-to-skip',
    description: 'Choose the channels, content and measurement that support the business. The calendar is not the strategy.',
    members: [
      'seven-digital-channels-which-to-skip',
      'meta-ads-basics',
      'tiktok-ads-basics',
      'paid-media-landing-page-checklist',
      'ga4-ecommerce-event-validation',
      'ga4-utm-naming-conventions',
      'business-intelligence-basics',
      'research-consensus-report',
      'ai-research-workflow',
      'ai-competitor-research-prompts',
      'marketing-budgets-during-economic-stress',
      'ecommerce-seasonal-campaign-plan',
      'content-marketing-plan-that-produces-pipeline',
      'when-web-design-trends-actually-matter',
    ],
  },
] as const;

export const guideFor = (slug: string) => readingGuides.find(guide => (guide.members as readonly string[]).includes(slug));

// Published peers in the assigned service, ordered by the retained editorial guides.
// Sparse pillars show fewer links; they never borrow unrelated articles to meet a quota.
export function readingPath<T extends { slug: string; primaryService: string }>(slug: string, published: T[]): T[] {
  const current=published.find(p=>p.slug===slug);
  if(!current)return [];
  const order:readonly string[]=readingGuides.flatMap(guide=>[...guide.members]);
  const peers=published.filter(p=>p.primaryService===current.primaryService).sort((a,b)=>{
    const ai=order.indexOf(a.slug),bi=order.indexOf(b.slug);
    return (ai<0?order.length:ai)-(bi<0?order.length:bi)||a.slug.localeCompare(b.slug);
  });
  const index=peers.findIndex(p=>p.slug===slug);
  return [...new Set([-1,1,2].map(offset=>peers[(index+offset+peers.length)%peers.length]))].filter(p=>p.slug!==slug);
}
