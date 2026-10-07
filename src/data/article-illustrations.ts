import assets from './assets.site.json';

export type ArticleIllustration = { asset: string; alt: string; caption: string };
const search: ArticleIllustration = { asset: 'article-search-console-page-review', alt: 'Illustrated Search Console page review with private figures omitted.', caption: 'Compare the same page and reporting view before choosing a repair.' };
const canonical: ArticleIllustration = { asset: 'article-duplicate-content-canonical-pages', alt: 'Illustrated duplicate product pages connected to one preferred canonical page.', caption: 'Keep the preferred URL consistent across page signals and internal links.' };
const feed: ArticleIllustration = { asset: 'article-merchant-center-product-sync', alt: 'Illustrated product feed connected to matching storefront product cards.', caption: 'The product record, landing page and purchase path need to agree.' };
const commerce: ArticleIllustration = { asset: 'article-shopify-seo-product-catalog', alt: 'Illustrated ecommerce catalog review and mobile collection page.', caption: 'Review the actual product journey, from collection to checkout.' };
const content: ArticleIllustration = { asset: 'article-content-brief-map', alt: 'Illustrated reader questions and article outlines connected to a content guide.', caption: 'One reader question, a clear answer and a useful next page.' };
const analytics: ArticleIllustration = { asset: 'article-marketing-channel-planning', alt: 'Illustrated traffic acquisition report beside channel decision cards, with values omitted.', caption: 'Connect the reporting view to the decision it needs to support.' };
const journey: ArticleIllustration = { asset: 'article-responsive-web-design-review', alt: 'Illustrated desktop and mobile storefronts beside a wireframe.', caption: 'Check the next action on a phone as carefully as the desktop layout.' };

const illustrations: Record<string, ArticleIllustration> = {
  'ai-search-results-and-generative-search-optimization': content,
  'google-shopping-ad-management-2026': commerce,
  'shopify-seo-launch-checklist': feed,
  'four-pillars-of-seo-operators-view': canonical,
  'technical-seo-ten-fixes-that-move-rankings': search,
  'local-seo-2026-operators-manual': journey,
  'content-marketing-plan-that-produces-pipeline': content,
  'when-web-design-trends-actually-matter': commerce,
  'shopify-seo-problems-real-fixes': canonical,
  'seven-digital-channels-which-to-skip': feed,
  'three-years-of-algorithm-updates-what-moved-rankings': search,
  'shopify-google-merchant-center-checklist': commerce,
  'marketing-budgets-during-economic-stress': analytics,
  'how-to-read-a-google-algorithm-update': canonical,
  'google-search-console-the-operators-guide': canonical,
  'how-long-seo-actually-takes': search,
  'seo-in-2026-what-changed-what-to-ignore': content,
  'duplicate-content-isnt-a-penalty-but-its-a-tax': search,
  'ga4-ecommerce-event-validation': commerce,
  'search-console-canonical-indexing-debugging': canonical,
  'merchant-center-feed-diagnostics': feed,
  'content-briefs-search-intent-internal-links': search,
  'ga4-utm-naming-conventions': analytics,
  'search-console-query-page-review': canonical,
  'shopify-product-page-seo': feed,
  'google-shopping-variant-feed-checklist': commerce,
  'internal-link-audit': content,
  'content-refresh-review': search,
  'service-page-content-checklist': journey,
  'paid-media-landing-page-checklist': analytics,
  'google-core-update-review': search,
  'holiday-ecommerce-preparation': feed,
  'ecommerce-seasonal-campaign-plan': analytics,
  'research-consensus-report': search,
  'ai-research-workflow': content,
  'ai-competitor-research-prompts': commerce,
  'merchant-center-basics': feed,
  'tiktok-ads-basics': journey,
  'meta-ads-basics': analytics,
  'ai-search-content-strategy': content,
  'business-intelligence-basics': analytics,
};

// Unprepared admin artwork stays out of the article instead of showing a broken asset.
export const articleIllustrations = Object.fromEntries(Object.entries(illustrations).filter(([, image]) => image.asset in assets));
