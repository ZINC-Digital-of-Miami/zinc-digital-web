/**
 * Dated, owner-commissioned review baseline (5 Nov 2026 CT). These are leads for the weekly
 * Claude review to confirm, close or flag as regressed against current live evidence; they
 * are never current measurements on their own.
 */
export const seoReviewBaseline={
 checkedAt:'2026-11-05',
 basis:'Live crawl of all 99 sitemap URLs at about 10:00 CT on 5 Nov 2026 (origin/main b314bdd), reconciled with the content-strategy and internal-linking reports of the same date. Findings those reports drew from a stale 25 Sep repository checkout were discarded.',
 reports:['docs/editorial/research/2026-11-05-seo-onpage-codex-brief.md','docs/editorial/research/2026-11-05-content-pillar-handoff.md'],
 rules:[
  'Once Upon a Book Club (OUABC) is removed from the public site. /work/once-upon-a-book-club/ returns 410 by design. Never recommend an OUABC case, link, logo, caption, copy or image.',
  'A page may cite a case study only where that case lists the same service.',
  'Content awaiting the owner renders nothing. Never recommend placeholder markers on public pages.',
  'Keep public URLs, redirects, authors and publication dates unless an owner decision changes them.',
  'Never recommend the acronym "GEO" in site copy. "AI search optimization" is the owner-approved service phrase (3 Nov 2026); changing it is an owner decision, not a routine fix.',
  'Never invent numbers, testimonials, results, profile URLs or author assignments.',
 ],
 findings:[
  {id:'B1',area:'content',paths:['/services/shopify/','/services/web-design/','/services/apps/','/services/seo/','/services/local-seo/','/services/ai-search-optimization/','/services/google-search-ads/','/services/shopping-ads/','/services/social-ads/','/services/tiktok-ads/','/services/business-intelligence/'],observed:'Service H1s are bare labels (for example "SEO", "Apps", "Social Ads (Meta)"); the business-intelligence H1 names no service.',intendedFix:'H1 states the service phrase, for example "SEO Services" or "Google Shopping and Merchant Center Management"; nav labels unchanged.',decision:'D9'},
  {id:'B2',area:'content',paths:['/services/'],observed:'Service pages carried 257-304 words in main against posts of about 1,000-2,800; the /services/ hub carried 82 words.',intendedFix:'Add included work, who it is for, how an engagement runs, matching proof and guide links from confirmed facts only. No word target.',decision:null},
  {id:'B3',area:'internal links',paths:['/blog/'],observed:'0 of 45 posts linked a case study.',intendedFix:'One in-body case link per post where the case lists the post\'s primary service.',decision:'D7'},
  {id:'B4',area:'internal links',paths:['/services/'],observed:'10 of 11 service pages linked their category hub but no post directly.',intendedFix:'Three direct guide links per service page, derived from category data.',decision:'D3'},
  {id:'B5',area:'content',paths:['/blog/how-to-read-a-google-algorithm-update/','/blog/google-core-update-review/'],observed:'Both target investigating a Google update with Search Console.',intendedFix:'Separate the intents (first-week response vs post-rollout comparison), or merge with a 301 if the owner chooses.',decision:'D6'},
  {id:'B6',area:'metadata',paths:['/blog/shopify-google-merchant-center-checklist/','/blog/google-search-console-the-operators-guide/','/blog/category/shopping-ads/','/blog/ai-search-results-and-generative-search-optimization/','/blog/content-briefs-search-intent-internal-links/','/locations/panama-city/','/blog/ga4-utm-naming-conventions/','/blog/duplicate-content-isnt-a-penalty-but-its-a-tax/','/blog/merchant-center-feed-diagnostics/','/blog/google-shopping-variant-feed-checklist/'],observed:'Titles of 63-69 characters including the site suffix.',intendedFix:'Shorter meta titles drafted by the Codex SEO specialist; visible H1s unchanged.',decision:null},
  {id:'B7',area:'metadata',paths:['/services/local-seo/','/services/ai-search-optimization/','/blog/category/shopify/','/blog/category/social-ads/','/work/demand/','/authors/kirk-musick/','/authors/jaymie-wilhoit/'],observed:'Descriptions of 161-167 characters, or under 122.',intendedFix:'Descriptions drafted by the Codex SEO specialist.',decision:null},
  {id:'B8',area:'structured data',paths:['/blog/content-marketing-plan-that-produces-pipeline/','/blog/when-web-design-trends-actually-matter/'],observed:'Article author is Organization "Team ZINC".',intendedFix:'Named Person author chosen by the owner.',decision:'D5'},
  {id:'B9',area:'structured data',paths:['/authors/kirk-musick/','/authors/jaymie-wilhoit/','/authors/wendy-funnell/','/'],observed:'Person schema lacks sameAs and knowsAbout; ProfessionalService lacks sameAs and areaServed.',intendedFix:'Add owner-supplied profile URLs and confirmed service areas only.',decision:'D11'},
  {id:'B10',area:'content',paths:['/blog/category/apps/','/blog/category/local-seo/','/blog/'],observed:'Apps and Local SEO hubs hold 1 post each (about 110 words). The blog index H1 "<insights.py/>" names no topic.',intendedFix:'Hub intro copy and more posts, or noindex,follow until three posts; descriptive blog H1.',decision:'D10'},
  {id:'B11',area:'local search',paths:['/','/services/local-seo/'],observed:'Location wording varies between "Based in Panama City, serving Miami" and the first ProfessionalService entity named "ZINC Digital — Miami".',intendedFix:'One location statement used consistently in copy, schema order and assistant instructions.',decision:'D12'},
 ],
 overlapGroups:[
  {id:'updates',paths:['/blog/how-to-read-a-google-algorithm-update/','/blog/google-core-update-review/','/blog/three-years-of-algorithm-updates-what-moved-rankings/','/blog/seo-in-2026-what-changed-what-to-ignore/'],intents:['first-week response to an update','post-rollout Search Console comparison','historical record of updates','current-year priorities']},
  {id:'ai-search',paths:['/blog/ai-search-results-and-generative-search-optimization/','/blog/ai-search-content-strategy/','/blog/what-ai-discovery-changes-editorial-plan/'],intents:['overview and sub-hub','what to publish and how to evidence it','editorial calendar, maintenance and measurement']},
  {id:'seasonal',paths:['/blog/holiday-ecommerce-preparation/','/blog/ecommerce-seasonal-campaign-plan/'],intents:['pre-launch quality checks','season planning calendar']},
  {id:'merchant-center',paths:['/blog/merchant-center-basics/','/blog/merchant-center-feed-diagnostics/','/blog/google-shopping-variant-feed-checklist/','/blog/shopify-google-merchant-center-checklist/','/blog/google-shopping-ad-management-2026/'],intents:['setup sub-hub','fixing product issues','variant feed checks','Shopify connection','campaign management']},
  {id:'shopify-seo',paths:['/blog/shopify-seo-launch-checklist/','/blog/shopify-seo-problems-real-fixes/','/blog/shopify-product-page-seo/'],intents:['before launch','repairing a live store','product page editing']},
  {id:'search-console',paths:['/blog/google-search-console-the-operators-guide/','/blog/search-console-query-page-review/','/blog/search-console-canonical-indexing-debugging/'],intents:['overview','query and page routine','canonical and indexing debugging']},
 ],
 pendingDecisions:{D2:'Primary service for the Search Console guide',D3:'Direct guide links on service pages',D5:'Named authors for two Team ZINC posts',D6:'Split or merge the two update-investigation posts',D7:'Case-to-service proof rule and eligible cases',D9:'Service, /services/ and /blog/ H1 wording',D10:'Thin category hubs',D11:'Author and company profile URLs',D12:'Location statement'},
} as const;
