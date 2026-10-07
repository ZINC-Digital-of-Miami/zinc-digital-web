// Existing articles form the hubs; publishing a new page is not required.
export const blogPillars = [
  {
    id: 'seo',
    title: 'Search & SEO',
    slug: 'four-pillars-of-seo-operators-view',
    description: 'Crawling, content, authority and the pages people actually use. Start with the framework, then trace the bottleneck.',
    members: [
      'four-pillars-of-seo-operators-view',
      'technical-seo-ten-fixes-that-move-rankings',
      'duplicate-content-isnt-a-penalty-but-its-a-tax',
      'google-search-console-the-operators-guide',
      'search-console-canonical-indexing-debugging',
      'search-console-query-page-review',
      'internal-link-audit',
      'content-refresh-review',
      'service-page-content-checklist',
      'google-core-update-review',
      'ai-search-content-strategy',
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
      'content-marketing-plan-that-produces-pipeline',
      'ga4-ecommerce-event-validation',
      'ga4-utm-naming-conventions',
      'paid-media-landing-page-checklist',
      'ecommerce-seasonal-campaign-plan',
      'research-consensus-report',
      'ai-research-workflow',
      'ai-competitor-research-prompts',
      'tiktok-ads-basics',
      'meta-ads-basics',
      'business-intelligence-basics',
      'content-briefs-search-intent-internal-links',
      'marketing-budgets-during-economic-stress',
      'when-web-design-trends-actually-matter',
    ],
  },
] as const;

export const pillarFor = (slug: string) => blogPillars.find(pillar => (pillar.members as readonly string[]).includes(slug));

// Use only currently published articles, including after an admin draft change.
export function readingPath<T extends { slug: string }>(slug: string, published: T[]) {
  const pillar = pillarFor(slug);
  if (!pillar) return [];
  const slugs = pillar.slug === slug ? pillar.members : [pillar.slug, ...pillar.members];
  const available = slugs.filter((candidate, i, all) => candidate !== slug && all.indexOf(candidate) === i)
    .flatMap(candidate => published.find(post => post.slug === candidate) || []);
  return pillar.slug === slug ? available : available.slice(0, 3);
}
