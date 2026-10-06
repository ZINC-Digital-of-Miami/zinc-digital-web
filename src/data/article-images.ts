// Topic-specific artwork in the owner's approved studio-mockup style.
// Source files use the site's existing Astro responsive image pipeline.
import siteAssets from './assets.site.json';

const topicArtwork: Record<string, { asset: string; alt: string }> = {
  'ai-search-results-and-generative-search-optimization': { asset: 'article-ai-search-citations', alt: "Desktop search-answer mockup with cited source articles and the corresponding article on a phone." },
  'google-shopping-ad-management-2026': { asset: 'article-google-shopping-product-feed', alt: "Product feed mockup showing catalog availability beside matching mobile shopping listings." },
  'shopify-seo-launch-checklist': { asset: 'article-shopify-seo-store-launch', alt: "Desktop and mobile storefront mockups beside a Shopify SEO launch checklist." },
  'four-pillars-of-seo-operators-view': { asset: 'article-seo-four-pillars', alt: "Overhead illustration of a tablet and cards connecting technical SEO, content, authority and user experience." },
  'technical-seo-ten-fixes-that-move-rankings': { asset: 'article-technical-seo-crawl-review', alt: "Site crawl review mockup with page status and canonical checks beside a website structure diagram." },
  'local-seo-2026-operators-manual': { asset: 'article-local-seo-business-profile', alt: "Local business profile and map mockups beside a mobile services page and model shopfront." },
  'content-marketing-plan-that-produces-pipeline': { asset: 'article-content-marketing-editorial-plan', alt: "GA4 Pages and screens report illustrated beside research, publish and review cards, with metric values omitted." },
  'when-web-design-trends-actually-matter': { asset: 'article-responsive-web-design-review', alt: "Responsive ecommerce website mockups beside a wireframe and typography specimen." },
  'shopify-seo-problems-real-fixes': { asset: 'article-shopify-seo-product-catalog', alt: "Ecommerce catalog audit mockup beside a mobile collection page and product category diagram." },
  'seven-digital-channels-which-to-skip': { asset: 'article-marketing-channel-planning', alt: "Illustrated GA4 Traffic acquisition report beside keep, review and test cards, with metric values omitted." },
  'three-years-of-algorithm-updates-what-moved-rankings': { asset: 'article-search-update-history-review', alt: "Search update review mockup beside successive versions of an article for comparison." },
  'shopify-google-merchant-center-checklist': { asset: 'article-merchant-center-product-sync', alt: "Illustrated Merchant Center product overview connected to matching storefront product cards." },
  'marketing-budgets-during-economic-stress': { asset: 'article-marketing-budget-decisions', alt: "Illustrated GA4 Traffic acquisition report beside keep, cap and test budget decisions and a calculator." },
  'how-to-read-a-google-algorithm-update': { asset: 'article-search-update-investigation', alt: "Search update investigation mockup beside a printed article and magnifying glass." },
  'google-search-console-the-operators-guide': { asset: 'article-search-console-page-review', alt: "Close view of an illustrated Google Search Console Performance report and a page review checklist, with metric values omitted." },
  'how-long-seo-actually-takes': { asset: 'article-seo-work-timeline', alt: "Overhead illustration of a tablet showing crawl, repair, publish and review stages beside indexing, content and link checklists." },
  'seo-in-2026-what-changed-what-to-ignore': { asset: 'article-seo-search-changes-review', alt: "Illustrated search answer and Google Search Console Page indexing panel beside fix and verify cards." },
  'duplicate-content-isnt-a-penalty-but-its-a-tax': { asset: 'article-duplicate-content-canonical-pages', alt: "Canonical page mockup consolidating similar product pages into one preferred page." },
};

// Unregistered artwork stays out of the page while it is being prepared.
export const articleImages = Object.fromEntries(
  Object.entries(topicArtwork).filter(([, image]) => image.asset in siteAssets),
);
