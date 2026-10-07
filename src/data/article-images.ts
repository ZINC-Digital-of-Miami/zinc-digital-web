// Topic-specific artwork in the owner's approved studio-mockup style.
// Source files use the site's existing Astro responsive image pipeline.
import siteAssets from './assets.site.json';

const topicArtwork: Record<string, { asset: string; alt: string }> = {
  "ga4-utm-naming-conventions": {"asset": "article-ga4-utm-naming", "alt": "Illustrated traffic acquisition report beside a UTM naming sheet, with source, medium and campaign fields."},
  "search-console-query-page-review": {"asset": "article-gsc-query-page", "alt": "Illustrated Search Console query and page review with a matching query-to-page worksheet and private values omitted."},
  "shopify-product-page-seo": {"asset": "article-shopify-product-seo", "alt": "Illustrated storefront product editor, search preview and matching mobile desk-lamp product page."},
  "google-shopping-variant-feed-checklist": {"asset": "article-shopping-variants", "alt": "Illustrated product variant feed beside compact and large white mug product cards."},
  "internal-link-audit": {"asset": "article-internal-links", "alt": "Overhead illustration of a guide linked to a how-to, checklist and service beside an internal-link audit."},
  "content-refresh-review": {"asset": "article-content-refresh", "alt": "Illustrated content review showing keep, update and combine choices beside printed article pages."},
  "service-page-content-checklist": {"asset": "article-service-page", "alt": "Illustrated desktop and mobile service pages organized around scope, process and questions."},
  "paid-media-landing-page-checklist": {"asset": "article-landing-page", "alt": "Illustrated matching product advertisement, desktop landing page and mobile page."},
  "google-core-update-review": {"asset": "article-google-update", "alt": "Illustrated search update review with unnumbered comparison trends and page review sheets."},
  "holiday-ecommerce-preparation": {"asset": "article-holiday-ecommerce", "alt": "Overhead illustration of a seasonal storefront, gift package and stock, delivery and checkout checklist."},
  "ecommerce-seasonal-campaign-plan": {"asset": "article-seasonal-plan", "alt": "Illustrated campaign planning board with prepare, launch and review columns beside a season timeline."},
  "research-consensus-report": {"asset": "article-consensus-report", "alt": "Illustrated evidence comparison showing agreement, conflicts and unknowns beside source and findings sheets."},
  "ai-research-workflow": {"asset": "article-ai-research", "alt": "Illustrated research workflow connecting primary sources to evidence, verification and a summary."},
  "ai-competitor-research-prompts": {"asset": "article-ai-competitor", "alt": "Illustrated competitor product comparison organized by offer, proof and gaps beside public source cards."},
  "merchant-center-basics": {"asset": "article-merchant-basics", "alt": "Illustrated Merchant Center product inventory and matching mobile shopping catalog, with private data omitted."},
  "tiktok-ads-basics": {"asset": "article-tiktok-basics", "alt": "Illustrated vertical TikTok unboxing ad beside campaign goal, creative and measurement setup."},
  "meta-ads-basics": {"asset": "article-meta-basics", "alt": "Illustrated Meta ad setup with goal, audience and creative beside a matching mobile advertisement."},
  "ai-search-content-strategy": {"asset": "article-ai-content-strategy", "alt": "Illustrated content plan connecting questions, evidence, answers and primary sources to a mobile how-to."},
  "business-intelligence-basics": {"asset": "article-bi-basics", "alt": "Illustrated business intelligence workspace connecting commerce, search, ads and products to a decision sheet."},
  'ga4-ecommerce-event-validation': { asset: 'article-ga4-ecommerce-validation', alt: 'Illustrated GA4 DebugView following product view, cart, checkout and purchase events beside a mobile order review; values are omitted.' },
  'search-console-canonical-indexing-debugging': { asset: 'article-gsc-canonical-debugging', alt: 'Illustrated Search Console URL inspection and canonical page review beside an indexing checklist.' },
  'merchant-center-feed-diagnostics': { asset: 'article-merchant-feed-diagnostics', alt: 'Illustrated Merchant Center product diagnostics beside matching mobile product listings, with private values omitted.' },
  'content-briefs-search-intent-internal-links': { asset: 'article-content-brief-map', alt: 'Illustrated content brief connecting search intent, reader questions, outlines and supporting articles to one guide.' },
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
