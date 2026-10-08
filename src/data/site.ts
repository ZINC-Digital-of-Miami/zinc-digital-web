import { authoredArticles } from './article-library.ts';
import { authors, authorPath } from './authors.ts';
// site.ts — the redesign's data layer. Replaces the parts of mockup.ts that the
// Oct 2026 redesign changed (services copy, cases, clients with logos,
// case assets, layer copy, legal copy). posts.preview.json is untouched.
import snapshot from './posts.preview.json';
import assetData from './assets.preview.json';
import siteAssets from './assets.site.json';
import { privacyApproved, termsApproved } from './legal';
import { articleEditorial } from './article-editorial';

export const SITE = 'https://www.zincdigital.co';
export const PHONE = '+1-786-575-4837';
export const SMS = 'sms:+17865754837';
export const PHONE_LABEL = '(786) 575-4837';
export const EMAIL = 'hello@zincdigital.co';
// Footer "Admin" link (design: ZINC Site footer). /admin/ is an on-demand (server) route guarded by middleware.
export const ADMIN_PATH: string | null = '/admin/';
export const SOCIAL = [
  ['Facebook', 'https://www.facebook.com/zincdigitalofmiami'],
  ['Instagram', 'https://www.instagram.com/zincdigitalofmiami/'],
  ['X', 'https://x.com/zinc_of'],
  ['LinkedIn', 'https://www.linkedin.com/company/zinc-digital-of-miami/'],
] as const;
export const STUDIOS = [
  { id: 'miami', name: 'Miami HQ', street: '1900 N Bayshore Dr', city: 'Miami', zip: '33132' },
  { id: 'panama-city', name: 'Panama City satellite', street: '97 Oak Ave, Suite 7', streetLabel: '97 Oak Ave Suite 7', city: 'Panama City', zip: '32401' },
] as const;

export type Layer = 'Build' | 'Demand' | 'Intelligence';
export const layers: Layer[] = ['Build', 'Demand', 'Intelligence'];

type Asset = { src: string; width: number; height: number };
export const assets: Record<string, Asset> = { ...(assetData as Record<string, Asset>), ...(siteAssets as Record<string, Asset>) };
export const asset = (key: string): Asset => {
  const a = assets[key];
  if (!a) throw new Error('Unknown asset key: ' + key);
  return a;
};

export type Service = {
  slug: string; title: string; layer: Layer; line: string; deliverables: string[];
  cadence: string; owns: string; reported: string; questions: [string, string][]; related: string[]; caseSlug: string;
};
export const services: Service[] = [
  {slug:'shopify',title:'Shopify Ecommerce',layer:'Build',line:'A storefront built around the way your customers buy.',deliverables:['Storefront architecture and theme development','Product, collection and navigation structure','Checkout and app configuration','Performance and accessibility checks'],cadence:'A prioritized release plan with documented changes and a recurring review.',owns:'The store account, product data and approved theme code. Third-party app licenses remain with their respective providers.',reported:'Storefront changes alongside conversion, order value and revenue, with attribution limits identified.',questions:[['Can you work with our existing Shopify store?','Begin with the theme, catalog, installed apps and operational constraints. The build plan should preserve the workflows your team needs.'],['Will our team be able to edit the store?','Editable sections and a handover are scoped around the people maintaining the catalog.'],['Do we need new apps?','Evaluate the existing stack before recommending additions. App costs and data access need approval.'],['How are releases checked?','Review navigation, product selection, cart and checkout behavior before an approved release.']],related:['shopping-ads','web-design','business-intelligence'],caseSlug:'once-upon-a-book-club'},
  {slug:'web-design',title:'Web Design',layer:'Build',line:'A clear path from first visit to a useful conversation.',deliverables:['Information architecture and page design','Responsive frontend development','Content structure and inquiry journeys','Accessibility and page-speed verification'],cadence:'Milestone reviews from content structure through tested release.',owns:'Approved site code, domain access and original content.',reported:'Page performance, inquiry journeys and the behavior of key landing pages.',questions:[['Do you redesign or rebuild?','Inspect the current platform and content before choosing the smaller reliable path.'],['Who writes the content?','Copy responsibilities and approval rounds are defined before page production.'],['What happens to our existing URLs?','Useful URLs are retained or mapped to relevant replacements as part of release planning.'],['Can we review before launch?','A review environment shows complete pages and mobile behavior before approval.']],related:['seo','local-seo','apps'],caseSlug:'us-oil-solutions'},
  {slug:'apps',title:'Apps',layer:'Build',line:'Software built around the work your business needs to complete.',deliverables:['Workflow and data model definition','Application interfaces and permissions','Integrations with approved business systems','Task testing and operational handover'],cadence:'A working slice first, followed by agreed workflow increments.',owns:'Business data and the agreed code or platform workspace, subject to platform licensing.',reported:'Workflow completion, exceptions and the operational measures agreed for the application.',questions:[['What kind of apps do you build?','Business applications begin with a specific operational workflow and its users.'],['Can an app use our existing data?','Integration depends on the source system, permissions and reliable data access.'],['How are permissions designed?','Define who can view, change and approve each record before implementation.'],['What does a first release include?','One complete, testable workflow with a clear handover and the next priorities.']],related:['web-design','business-intelligence','shopify'],caseSlug:'us-oil-solutions'},
  {slug:'seo',title:'SEO',layer:'Demand',line:'Make the pages that matter easier to discover and understand.',deliverables:['Technical search audit and prioritized repairs','Search intent and page mapping','On-page content recommendations','Indexation and organic landing-page review'],cadence:'An agreed technical and content queue with a recurring performance review.',owns:'Search accounts, content and site changes.',reported:'Search visibility, relevant landing-page traffic and qualified outcomes, with seasonality noted.',questions:[['How do you choose what to fix first?','Prioritize indexation, important customer journeys and pages with a business purpose.'],['Does SEO include content?','Content needs are identified in the plan; writing and approval responsibilities are explicit.'],['Can you guarantee rankings?','Rankings are not guaranteed. Reporting separates completed work from observed search outcomes.'],['Will a redesign affect search?','URL mapping, content continuity and technical release checks need to be part of the build.']],related:['web-design','ai-search-optimization','business-intelligence'],caseSlug:'us-oil-solutions'},
  {slug:'local-seo',title:'Local SEO',layer:'Demand',line:'Connect each real location with the people searching around it.',deliverables:['Location and business-profile review','Local service-page structure','Business identity and listing consistency','Local search and inquiry measurement'],cadence:'Location-by-location priorities and recurring profile checks.',owns:'Business profiles, location content and listing access.',reported:'Location visibility and local inquiries, separating profile interactions from actual leads.',questions:[['Can you support multiple locations?','Each location needs accurate identity, service coverage and measurement.'],['Do you create location pages?','Pages should reflect real services and places, with useful distinct information.'],['Who owns the business profile?','The business should retain ownership; agency permissions are agreed separately.'],['How are calls measured?','Distinguish tracked call actions from connected or qualified inquiries.']],related:['seo','web-design','google-search-ads'],caseSlug:'us-oil-solutions'},
  {slug:'ai-search-optimization',title:'Generative Search Optimization',layer:'Demand',line:'Give search and answer systems clear, verifiable information about your business.',deliverables:['Business entity and source consistency review','Answer-focused content structure','Technical discoverability assessment','Query and citation observation'],cadence:'A defined query set and recurring evidence review.',owns:'Published content, research and approved measurement records.',reported:'Observed mentions and citations for the sampled queries; coverage limits remain explicit.',questions:[['Can you guarantee an AI recommendation?','No. Results vary across systems, prompts and time.'],['How is this connected to SEO?','Both depend on accessible pages, clear entities and useful source content.'],['What do you measure?','A documented query sample, observed answers, citations and changes over time.'],['Do we need to rewrite every page?','Start with the pages and business facts most relevant to customer questions.']],related:['seo','web-design','business-intelligence'],caseSlug:'us-oil-solutions'},
  {slug:'google-search-ads',title:'Google Search Ads',layer:'Demand',line:'Match a specific search with a relevant offer and landing page.',deliverables:['Search campaign and conversion review','Intent-led keyword and ad structure','Landing-page alignment','Search-term and budget analysis'],cadence:'Scheduled search-term, bid and conversion checks with an agreed reporting rhythm.',owns:'The ad account, billing relationship and conversion records.',reported:'Spend, qualified conversions and available revenue evidence, with attribution windows stated.',questions:[['Do you take over our account?','Access, ownership and approval rights are agreed before work starts.'],['How do you handle irrelevant searches?','Review query evidence and apply exclusions within campaign objectives.'],['Does ad management include landing pages?','Landing-page needs are identified; implementation belongs to an agreed build scope.'],['How is success defined?','Connect conversions to useful business outcomes rather than treating every click as a result.']],related:['web-design','local-seo','business-intelligence'],caseSlug:'once-upon-a-book-club'},
  {slug:'shopping-ads',title:'Shopping / Merchant Center Ads',layer:'Demand',line:'Bring the product catalog, feed and campaign into the same view.',deliverables:['Merchant Center account and feed review','Product eligibility and issue triage','Shopping campaign structure','Product-level performance analysis'],cadence:'Feed health and campaign reviews on an agreed schedule.',owns:'Merchant Center, product data, ad accounts and billing.',reported:'Product eligibility, spend and attributed sales alongside catalog and inventory context.',questions:[['What if products are disapproved?','Diagnose the specific account, feed or policy issue before changing product data.'],['Can you work with Shopify feeds?','Inspect the feed source and its update behavior before proposing changes.'],['How do you choose products to advertise?','Consider inventory, product economics and measured demand together.'],['Is Merchant Center separate from ads?','It supplies product information and eligibility; campaigns control paid distribution.']],related:['shopify','google-search-ads','business-intelligence'],caseSlug:'once-upon-a-book-club'},
  {slug:'social-ads',title:'Social Ads (Meta)',layer:'Demand',line:'Put the creative, audience and purchase journey in context.',deliverables:['Meta account and tracking review','Campaign and audience structure','Creative test planning','Delivery and conversion analysis'],cadence:'A defined creative-testing rhythm and recurring delivery review.',owns:'Ad accounts, business assets and approved creative.',reported:'Spend, delivery and attributed outcomes with creative and measurement context.',questions:[['Do you make the creative?','Creative inputs, production responsibilities and approval rounds are scoped upfront.'],['What counts as a useful test?','A test needs a clear question, sufficient evidence and a decision it can inform.'],['How do you handle attribution?','State the platform window and compare it carefully with store-level outcomes.'],['Can you use our existing campaigns?','Review current performance and structure before deciding what to retain.']],related:['shopify','tiktok-ads','business-intelligence'],caseSlug:'once-upon-a-book-club'},
  {slug:'tiktok-ads',title:'TikTok Ads',layer:'Demand',line:'A creative-led channel measured against the business it brings.',deliverables:['Account and event measurement review','Campaign and creative test structure','Delivery and creative-fatigue analysis','Purchase-journey and results reporting'],cadence:'Creative and delivery checks matched to campaign volume.',owns:'The ad account, business assets and approved source creative.',reported:'Spend, delivery, conversions and purchase value where the underlying source supports it.',questions:[['Do we need new videos?','Assess available footage, permissions and the creative questions to test.'],['How is creative fatigue identified?','Examine delivery and response over time rather than using age alone.'],['Can TikTok support ecommerce?','Campaign planning connects the creative and event setup to the actual store journey.'],['How do you compare it with other channels?','Use stated attribution windows and separate channel claims from store totals.']],related:['social-ads','shopify','business-intelligence'],caseSlug:'once-upon-a-book-club'},
  {slug:'business-intelligence',title:'Business Intelligence',layer:'Intelligence',line:'A common view of the numbers behind the next decision.',deliverables:['Source and metric definition','Data ingestion and reconciliation','Dashboards and reporting workflows','Freshness and exception checks'],cadence:'Refresh schedules matched to source availability and decision needs.',owns:'Agreed reporting code, metric definitions and business data.',reported:'Source lineage, freshness and reconciled business measures with known gaps visible.',questions:[['Can you combine our platforms?','Start with source access, data grain and compatible definitions.'],['Why do platform totals differ?','Attribution windows, timing, currencies and event definitions can differ. The report must show those limits.'],['Will the dashboard be live?','Freshness is defined per source; a recent screen refresh is not proof of recent data.'],['Who decides which metrics matter?','Define the decisions and owners first, then the measures needed to support them.']],related:['apps','shopify','shopping-ads'],caseSlug:'once-upon-a-book-club'},
];

export const layerMeta: Record<Layer, { kick: string; line: string; body: string; second: string; secondTitle: string }> = {
  Build: { kick: 'Layer 01 / Build', line: 'The machine the customer touches.', body: 'The storefront, the site, the app. Built to convert before any traffic reaches it, and handed over so your team can run it.', second: 'Release sequence', secondTitle: 'Working slices, reviewed in order.' },
  Demand: { kick: 'Layer 02 / Demand', line: 'Reach customers ready to act.', body: 'Search, AI answers, paid and social. Each channel is pointed at the pages that close and reported against the business it brings.', second: 'The measurement contract', secondTitle: 'What gets counted.' },
  Intelligence: { kick: 'Layer 03 / Intelligence', line: 'The numbers behind the next decision.', body: 'Source lineage, freshness and reconciled measures in one view. Known gaps stay visible instead of being smoothed over.', second: 'The readout', secondTitle: 'Every number carries its source.' },
};
export const contract: [string, string][] = [['Counted', 'Qualified conversions and the revenue evidence the source actually supports.'], ['Not treated as outcomes', 'Clicks or impressions alone, or unverified platform totals.'], ['Stated', 'The attribution window, the seasonality and the limits of the data.']];
export const readout: [string, string][] = [['Source', 'Named per metric, with lineage back to the system of record'], ['Freshness', 'Defined per source. A recent screen refresh is not recent data'], ['Owner', 'A person agreed before the dashboard exists'], ['Known gaps', 'Listed on the report, not hidden behind a total']];

export type Case = {
  slug: string; title: string; line: string; url: string; layers: Layer[]; situation: string;
  location: string; timeline: string; scope: string; receipts: string[]; challenge: string[]; approach: string[]; results: string[];
  before: string | null; brand: string[]; quote: { text: string; who: string; org: string } | null;
  work: Record<Layer, string>; hero: string; images: string[]; services: string[]; next: string;
  relatedSites?: {label:string;url:string}[];
  client?: string; contextLabel?: string; heroLabel?: string; application?: boolean; nonprofit?: boolean;
};
export const cases: Case[] = [
  {"slug":"once-upon-a-book-club","title":"Once Upon a Book Club","line":"A rebuilt Shopify website, ongoing SEO and paid campaigns, and a BI app in development.","url":"https://www.onceuponabookclub.com/","layers":["Build","Demand","Intelligence"],"situation":"Once Upon a Book Club brings stories to life through wrapped gifts readers open at marked pages in each book. Its store combines monthly Adult and Young Adult subscriptions with one-time boxes, limited pre-orders and bookish gifts. Each release changes the products being promoted, the pages readers need and the decisions the business has to make.","location":"Reading boxes · subscriptions · gifts","timeline":"Multi-year engagement","scope":"Shopify website rebuild · SEO and blog content · Google Shopping, Meta and TikTok ads · Monthly reporting · BI app in progress","receipts":["Product and collection metadata updated; crawl traps repaired","Shopping product groups reviewed against performance and availability","Monthly commerce, search and paid-channel reports produced"],"challenge":["Subscriptions, one-time boxes and pre-orders create different buying paths.","Campaign creative and product listings need to match availability and release timing.","Store sales, search traffic and platform-attributed purchases need distinct definitions."],"approach":["Rebuilt the Shopify website for subscription boxes, one-time releases and bookish gifts, with ongoing product and collection updates after launch.","Updated Shopify product and collection titles and descriptions, alongside checks on Google product publication.","Repaired crawl traps caused by tracking paths, recommendation parameters and repeated locale URLs.","Reviewed Shopping performance by product and category, separating sold-out inventory from feed defects and campaign decisions.","Manage Google Shopping, Meta and TikTok ads around the subscription boxes, pre-orders and seasonal products, alongside ongoing SEO and blog content.","Connected search research to article briefs, writing, client review, revision and publication.","Produced monthly reports covering commerce, search, paid channels and the next work priorities.","Proactively invested two months in a business-intelligence app to improve reporting and support better decisions. This work began on ZINC’s initiative, beyond the client’s requested scope, and remains in progress.","The current reporting interface connects order volume, average order value, first-time orders, returning revenue, refunds and paid-ad spend. Product pre-orders, search visibility and a seasonal demand calendar provide further context, with incomplete records and attribution limits shown explicitly.","The BI design package includes ad-creative comparisons by urgency, call to action, headline length and emoji use; a visit-to-purchase funnel; mobile and desktop checkout-behavior views; and modeled competitor traffic. These are views from the app in development, with private client figures removed from the portfolio images."],"results":["Product pages and collections have updated search titles and descriptions, with publication issues identified for follow-up.","Custom crawl rules keep tracking, recommendation and repeated-locale paths out of search crawls.","Shopping reviews distinguish product availability and feed issues from bidding and ad-group decisions.","Monthly report packets bring store, search and campaign evidence together while preserving each source’s attribution limits."],"before":"ouabc-website-before","brand":[],"quote":null,"work":{"Build":"Shopify website rebuild, followed by product and collection updates, publication checks and technical search maintenance.","Demand":"Ongoing Google Shopping, Meta and TikTok ads, SEO and search-led blog content for subscription boxes, pre-orders and gifts.","Intelligence":"Monthly reports connect commerce, search and advertising. ZINC initiated a two-month reporting-app build to make that evidence more useful for decisions; the app is still in progress."},"hero":"ouabc-website-after","images":["ouabc-site","ouabc-bi-products-current","ouabc-bi-demand-current","ouabc-bi-season-current","ouabc-bi-ads-current","ouabc-bi-bookmark-current","ouabc-bi-funnel-current","ouabc-bi-work-current","ouabc-bi-meetings-current","ouabc-bi-admin-current","ouabc-bi-creative-wip","ouabc-bi-checkout-wip","ouabc-bi-market-context-wip","ouabc-halloween-campaign-square","ouabc-bridgerton-campaign-product","ouabc-shopping-creative-2024","ouabc-mobile","ouabc-research-private-preview","ouabc-website-before","ouabc-website-after"],"services":["shopify","seo","shopping-ads","social-ads","tiktok-ads","business-intelligence"],"next":"us-oil-solutions"},
  {slug:'us-oil-solutions',title:'U.S. Oil Solutions',relatedSites:[{label:'First website · September 2022 archive',url:'https://web.archive.org/web/20220930171133/https://www.usoilsolutions.com/'},{label:'Second website · in progress',url:'https://usos-website-blush.vercel.app/'}],line:'A new public website in development. A separate operations app for technicians and supervisors.',url:'https://usoilsolutions.com/',layers:['Build','Demand','Intelligence'],situation:'U.S. Oil Solutions supports Las Vegas restaurants with fryer-oil management, filtration, fresh-oil delivery and used-oil pickup. Its website needed to explain those services clearly. A separate operations app addressed the field operation: which technician visits each restaurant, which fryers need service and how supervisors handle changes and issues. A second website is now in progress, presenting the complete oil-management program.',location:'Las Vegas, NV',timeline:'First website online by 2022 · App development 2024–2025 · Second website in progress',scope:'Public website · SEO · Separate technician and supervisor app · App reporting · Second website in progress',receipts:[],challenge:['Restaurants need to understand filtration, delivery and collection before choosing a service.','Technicians need restaurant assignments, service schedules and a history for each fryer.','Supervisors need to coordinate on-call visits, special tasks and unresolved issues.'],approach:['Built service pages around fryer-oil management, filtration, fresh-oil products and used-oil pickup, with clear paths to make an inquiry.','Developed commercial search content around Las Vegas restaurant oil-management questions and service needs.','Built a standalone workflow app, separate from the public website, for technicians and supervisors: restaurant groups, role-based assignments, scheduling and check-ins; fryer records with oil types and replacement thresholds; camera/photo capture, service histories and reporting; on-call visits, rescheduling, special tasks and issue tracking. Supervisor controls include oversight of technician visits and checkouts.','A second website is in progress, organizing filtration, top-offs, delivery, oil changes, used-oil collection and reporting around one service program.'],results:[],before:null,brand:[],quote:{text:'ZINC Digital delivered a fully functional and sleek website on time. The team communicated via email, text, and phone all hours of the day. Their attention to detail was exceptional, and they were always a pleasure to work with.',who:'Chris Stacy',org:'U.S. Oil Solutions'},work:{Build:'The public website explains oil-management services and products. A separate operations app connects restaurant schedules, technician assignments, fryer histories and supervisor controls.',Demand:'Las Vegas service content addresses fryer management, oil filtration, fresh-oil delivery and used-oil pickup.',Intelligence:'Operational reports are built into the service app, alongside visit records, check-ins and fryer-service histories.'},hero:'uos-second-site-desktop',images:['uos-current-technicians-desktop','uos-current-technicians-mobile','uos-current-schedule-mobile','uos-current-groups-mobile','uos-current-fryers-desktop','uos-current-fryers-mobile','uos-current-oncall-desktop','uos-current-oncall-mobile','uos-current-menu-mobile','uos-current-special-mobile','uos-second-site-desktop','uos-second-site-mobile'],services:['web-design','seo','apps'],next:'las-vegas-safety'},
  {slug:'las-vegas-safety',title:'Las Vegas Safety & Supply',line:'A wholesale catalog rebuilt around restaurant and safety-supply orders.',url:'https://lasvegassafety.net/',location:'Las Vegas, NV',timeline:'Oct 2024 – Apr 2025',scope:'Ecommerce and warehouse capabilities · Catalog and image rebuild · Wholesale functions · Brand identity · Enterprise SEO',layers:['Build','Demand'],situation:'Las Vegas Safety & Supply had paid a local agency for a site that came back as an offshore build with missing product data, low-quality images and no brand identity. More than 100 SKUs sat online without descriptions, MSDS sheets or manufacturer numbers. For a safety and restaurant-supply company that was a liability, not just lost revenue.',receipts:['100+ SKUs rebuilt with verified data, sheets and identifiers','New logo, service-line graphics and launch collateral','Mobile-specific product image sets across the catalog'],challenge:['A wholesale catalog, account ordering and warehouse capabilities needed to support business buyers together.','Product data missing or inconsistent across 100+ SKUs.','Images too small to sell, no backgrounds removed.','No logo, no brand system, no credibility in search.'],approach:['Rebuilt ecommerce functions, the wholesale backend and warehouse capabilities alongside the WooCommerce catalog, bringing the store’s products and ordering workflows into the same rebuild.','Created the main logo and separate service-line graphics for chemicals and training, alongside launch collateral.','Product image overhaul: every background removed, every image upscaled, separate mobile image sets.','Researched and rewrote product descriptions for Las Vegas restaurant-supply searches; submitted new products and categories for indexing and preserved existing routes with redirects.','SKU data rescue: 100+ product data sets found, cleaned and rebuilt.','Creative assets: banners, footers, QR codes and promotional PDFs for launch and ongoing campaigns.'],results:['The rebuild brought the wholesale catalog, account-ordering functions, warehouse capabilities and product presentation into one ecommerce project.','A rebrand that holds up next to national competitors.','Product content and images optimized for Las Vegas restaurant supply searches.','Product and category redirects, indexing submissions and readability corrections supported the rebuilt catalog’s launch.'],before:'lvs-before',brand:['lvs-logo-black','lvs-brand-1','lvs-brand-3','lvs-product-1','lvs-product-2','lvs-product-3'],quote:null,work:{Build:'WooCommerce ecommerce and wholesale functions, warehouse capabilities, rebuilt product data and images, plus the primary and service-line brand identities.',Demand:'Product content written for Las Vegas restaurant-supply searches and launch collateral for campaigns.',Intelligence:'Reporting scope not part of this engagement.'},hero:'lvs-hero',images:['lvs-storefront-first-aid','lvs-mobile','lvs-food-service-net30-banner','lvs-food-service-product-hero','lvs-launch-flyer'],services:['web-design','seo'],next:'summit-marine-development'},
  {slug:'summit-marine-development',title:'Summit Marine Development',line:'Seawalls, docks and waterfront construction made easier to find and understand.',url:'https://summitmarinedevelopment.com/',location:'Panama City, FL',timeline:'June 2024 – present',scope:'Site rebuild · Rebrand · Local SEO · Google, LSA and Meta ads',layers:['Build','Demand'],situation:'Summit Marine Development builds and repairs seawalls, docks and retaining walls along the Panama City waterfront. They came to ZINC with no website, no search presence and no brand, in a market where one competitor had held both the organic and paid results for decades.',receipts:['Ranking on page one for every core search term, often more than once','Google Ads and Local Service Ads outperforming the decades-old market leader','A brand identity now recognized across the Panama City waterfront'],challenge:['Zero digital footprint: no site, no listings, no brand.','A single entrenched competitor saturating organic and paid results.','High-ticket, local, service-based demand with long consideration.'],approach:['Built a site around seawalls, docks and retaining-wall services, using waterfront project imagery and clear estimate-inquiry paths.','Created a marine-construction identity, logo and supporting graphics that connect the company’s waterfront work with its online presence.','Developed local search and service content around seawall repair and dock construction in Panama City and the surrounding waterfront market.','Google Ads and Local Service Ads tuned for high-intent searches, consistently beating the incumbent on click-through and cost.','Meta campaigns built and tested to expand local awareness and recognition.'],results:['Ranking for every top keyword in the category, often multiple times on the same page.','Paid campaigns deliver higher click-through and conversions at lower cost than the incumbent.','A professional brand that backs the company’s authority with customers.','From invisible to a recognized regional leader through search and paid together.'],before:null,brand:['smd-cover','smd-hero','smd-brand-book'],quote:null,work:{Build:'Site rebuild and complete brand identity for a marine construction company.',Demand:'Local SEO plus Google, Local Service and Meta ads against an entrenched competitor.',Intelligence:'Reporting scope not part of this engagement.'},hero:'smd-devices',images:['smd-brand-book','smd-dock-ad-previews','smd-seawall-ad-previews','smd-home-1'],services:['web-design','local-seo','google-search-ads','social-ads'],next:'zinc-fusion-v16'},
  {
    slug: 'zinc-fusion-v16', title: 'ZINC Fusion v16', client: 'Chris Stacy',
    application: true, contextLabel: 'Market', heroLabel: 'Forecasting platform / In development',
    line: 'A commodity forecasting platform for Chris Stacy, connecting soybean-oil markets, procurement scenarios, policy and sentiment. In development.',
    url: '', layers: ['Build', 'Intelligence'],
    location: 'Soybean-oil procurement', timeline: '2026 · In development',
    scope: 'Forecasting application · Market dashboards · Procurement scenarios · Policy and sentiment intelligence',
    situation: 'For a soybean-oil buyer, a price chart is the start of the decision. Purchasing also depends on timing, market pressure, policy changes and the possible cost of waiting. ZINC Fusion v16 is a separate forecasting project for Chris Stacy, built to bring that evidence into a procurement-focused workspace.',
    receipts: [],
    challenge: [
      'A current market price needs context from energy, currencies, processing margins and fund positioning.',
      'Procurement decisions need a view across near-term and longer-term forecast horizons.',
      'Policy activity and headline sentiment need source dates and clear explanations of what each reading means.',
    ],
    approach: [
      'Built a market dashboard around soybean-oil futures, with related-market readings, a probability surface, risk factors and source intelligence.',
      'Developed a strategy view connecting forecast checkpoints, scenarios and purchasing timing with the buyer’s cost exposure.',
      'Created dedicated policy and sentiment views: government activity and source priority on one page; fund positioning, market mood and headline context on another.',
      'Connected the Next.js application with Supabase serving records and a Python modeling pipeline. Eleven specialist domains cover the market forces behind procurement decisions.',
    ],
    results: [], before: null, brand: [], quote: null,
    work: {
      Build: 'A dedicated forecasting application with connected dashboard, strategy, policy intelligence and sentiment pages.',
      Demand: 'Search and advertising management are outside this forecasting project.',
      Intelligence: 'Market evidence, specialist modeling and procurement scenarios presented with source dates, forecast horizons and data-availability context.',
    },
    hero: 'fusion-v16-dashboard',
    images: ['fusion-v16-dashboard', 'fusion-v16-strategy', 'fusion-v16-legislation', 'fusion-v16-sentiment'],
    services: ['apps', 'business-intelligence'], next: 'the-lampstand-va',
  },
  {
    slug: 'the-lampstand-va', title: 'The Lampstand VA', nonprofit: true,
    heroLabel: 'Nonprofit / Pro bono support',
    line: 'Pro bono website updates, hosting and ongoing support for a Virginia ministry serving people affected by sexual exploitation.',
    url: 'https://www.thelampstandva.org/', layers: ['Build'],
    relatedSites: [{ label: 'Night of Hope', url: 'https://www.thelampstandva.org/night-of-hope/' }],
    location: 'Roanoke & Southwest Virginia', timeline: 'Ongoing pro bono support',
    scope: 'Ongoing site changes · Hosting · Night of Hope support · Pro bono website management',
    situation: 'The Lampstand serves people vulnerable to and affected by sexual exploitation through prevention education, professional training, wraparound services and a residential safehome. Its website helps families, professionals and supporters understand the ministry and find the right next step.',
    receipts: [],
    challenge: [
      'Families and referring professionals need clear information about available support.',
      'Schools, churches and community organizations need a way to learn about education and training.',
      'Supporters need straightforward paths to current needs, volunteering, giving and events such as Night of Hope.'
    ],
    approach: [
      'Our ongoing pro bono work includes website management, hosting and site changes that support the ministry’s day-to-day needs.',
      'We support Night of Hope through website updates and event information, helping the community find the event and ways to take part.',
      'We continue to update the site as programs, community needs and supporter information evolve. The support carries on beyond a single event or website launch.',
      'This continuing commitment is rooted in Kirk Musick’s lifelong friendship with Keith Farmer and support for the ministry’s mission.'
    ],
    results: [], before: null, brand: [], quote: null,
    work: { Build: 'Ongoing pro bono website management, hosting, site changes and Night of Hope support.', Demand: '', Intelligence: '' },
    hero: 'lampstand-home', images: ['lampstand-home', 'lampstand-mobile'], services: [],
    next: 'straight-street-ministries'
  },
  {
    slug: 'straight-street-ministries', title: 'Straight Street Ministries', nonprofit: true,
    heroLabel: 'Nonprofit / Pro bono support',
    line: 'Pro bono website support for a Roanoke ministry helping young people build relationships, skills and faith.',
    url: 'https://www.straightstreet.org/', layers: ['Build'],
    location: 'Roanoke, Virginia', timeline: 'Ongoing pro bono support',
    scope: 'Website management · Ministry information · Community support',
    situation: 'Straight Street provides a positive Christian environment for at-risk youth in Roanoke. Its work supports young people physically, emotionally, intellectually and spiritually. The website introduces that mission and helps volunteers, churches and supporters find ways to participate.',
    receipts: [],
    challenge: [
      'Young people and families need to understand the ministry and the community it offers.',
      'Volunteers and churches need a clear route to getting involved.',
      'Supporters need accessible ministry information, contact details and giving paths.'
    ],
    approach: [
      'We manage the website pro bono, supporting the public information that connects the ministry with its community.',
      'The focus is practical: explain the mission, make involvement easy to find and keep the organization’s contact paths visible.',
      'Kirk Musick’s lifelong friendship with Keith Farmer is behind this ongoing commitment to the ministry.'
    ],
    results: [], before: null, brand: [], quote: null,
    work: { Build: 'Pro bono website management and support.', Demand: '', Intelligence: '' },
    hero: 'straight-street-home', images: ['straight-street-home', 'straight-street-mobile'], services: [],
    next: 'bear-claw-usa'
  },
  {
    slug: 'bear-claw-usa', title: 'Bear Claw USA',
    heroLabel: 'Website design / Responsive development',
    line: 'A product website that connects plant-based form release with its uses and a clear path to request a quote.',
    url: 'https://bear-claw-usa.vercel.app/', layers: ['Build'],
    location: 'Las Vegas, NV', timeline: '',
    scope: 'Website design and development · Product, about and quote pages · Desktop, tablet and mobile layouts',
    situation: 'Bear Claw USA makes plant-based form release for concrete forms, asphalt beds and tools. ZINC designed and built the website using Bear Claw’s existing brand identity, connecting product information, company background and quote requests across screen sizes.',
    receipts: [],
    challenge: [
      'Make the product and its uses clear from the first screen.',
      'Keep the product information and navigation usable across desktop, tablet and mobile.',
      'Give product buyers a direct path to request a quote.'
    ],
    approach: [
      'Built the website around the product, its applications and a visible quote-request path.',
      'Designed home, product, about and quote pages using Bear Claw’s existing logos, colors and product imagery.',
      'Adapted page layouts and navigation for desktop, tablet and mobile screens.'
    ],
    results: [], before: null,
    brand: [],
    quote: null,
    work: {
      Build: 'Website design and development, including product information, company background and quote requests across desktop, tablet and mobile.',
      Demand: 'Search and paid-media management are outside the work shown here.',
      Intelligence: 'Reporting and analytics are outside the work shown here.'
    },
    hero: 'bear-claw-home-desktop', images: ["bear-claw-home-desktop","bear-claw-home-tablet","bear-claw-home-mobile","bear-claw-product-desktop","bear-claw-product-tablet","bear-claw-product-mobile","bear-claw-about-desktop","bear-claw-about-tablet","bear-claw-about-mobile","bear-claw-quote-desktop","bear-claw-quote-tablet","bear-claw-quote-mobile"], services: ['web-design'],
    next: 'once-upon-a-book-club'
  },
];
// Legacy / short URL → canonical case slug. Astro redirects are generated from this.
export { caseAliases } from './redirects';

export type Client = { name: string; logo?: string };
export const clients: Client[] = [
  { name: 'Porsche', logo: 'logo-porsche' }, { name: 'Home Depot', logo: 'logo-home-depot' }, { name: 'John Deere', logo: 'logo-john-deere' }, { name: 'YMCA', logo: 'logo-ymca' },
  { name: 'General Shale', logo: 'logo-general-shale' }, { name: 'Once Upon a Book Club', logo: 'logo-ouabc' },
  { name: 'U.S. Oil Solutions', logo: 'logo-us-oil' }, { name: 'Summit Marine', logo: 'logo-summit-marine' }, { name: 'Straight Street', logo: 'logo-straight-street' },
  { name: 'Las Vegas Safety', logo: 'lvs-logo-black' },
  { name: 'Bear Claw USA', logo: 'bear-claw-wordmark-orange' },
];
export const partners = [{ name: 'Google Partner', logo: 'logo-google-partner' }, { name: 'Meta Business Partner' }];

export type TeamMember = { id: string; name: string; role: string; photo: string };
export const team: TeamMember[] = [
  { id: 'kirk-musick', name: 'Kirk Musick, MS, MBA', role: 'CEO', photo: 'team-kirk-musick' },
  { id: 'jaymie-wilhoit', name: 'Jaymie Wilhoit', role: 'Managing Partner', photo: 'team-jaymie-wilhoit' },
  { id: 'wendy-funnell', name: 'Wendy Funnell', role: 'Chief Content Officer', photo: 'team-wendy-funnell' },
  { id: 'bethany-mckinzie', name: 'Bethany McKinzie', role: 'Business Strategy & HR', photo: 'team-bethany-mckinzie' },
  { id: 'priya-nahar', name: 'Priya Nahar, MBA', role: 'Shopify Developer', photo: 'team-priya-nahar' },
  { id: 'martin-stewart', name: 'Martin Stewart', role: 'Glide Expert & App Developer', photo: 'team-martin-stewart' },
  { id: 'dr-basset', name: 'Dr. Basset', role: 'Code', photo: 'team-dr-basset' },
];
export const homeCommitments = ['You own your accounts, data and code.', 'Direct access to the people doing the work.', 'Reporting tied to revenue, not impressions.'];
export const sequence: [string, string][] = [['Understand', 'Agree on the business problem, the sources and the people responsible.'], ['Define', 'Set the scope, decision points and measures that will guide the work.'], ['Build and review', 'Bring complete working increments to a shared review.'], ['Measure and adjust', 'Check outcomes and choose the next priorities from evidence.']];

// Privacy and Terms: the owner-approved text in legal.ts. Empty sections render no legal body (R2.6).
export const privacy = privacyApproved.sections;
export const terms = termsApproved.sections;

export const lede: Record<string, string> = {
  services: 'One connected system. The customer experience, the demand behind it and the information that informs both.',
  about: 'Seven specialists connecting websites, marketing and business reporting.',
  blog: 'Source-backed thinking on building, reaching customers and measuring the work.',
  thanks: 'Your inquiry is in. We respond with the right starting point, usually within one business day.',
  '404': 'The address may have changed. Continue with the services, explore the work or return to the homepage.',
  work: 'Websites, commerce and applications, alongside the nonprofit communities we support pro bono.',
  contact: 'Tell us about the business. We’ll respond with the right starting point.',
  home: 'Other agencies deliver the scope. ZINC delivers the business. Build, Demand and Intelligence from Miami HQ, working nationwide.',
};

// ---- posts (unchanged source) ----
export type Run = { text: string; href?: string };
export type Block = { type: string; runs?: Run[]; items?: Run[][] };
export type Post = Omit<(typeof snapshot.posts)[number], 'blocks'> & { blocks: Block[]; layer: Layer; related: string[]; excerpt?: string; markdown?:string };
// Layer, related services and the excerpt per article, as written in the Design's POSTS list.
const articleMap: Record<number, { layer: Layer; related: string[]; excerpt: string }> = {
  56328:{layer:'Demand',related:['ai-search-optimization','seo'],excerpt:"AI search results are not a future footnote anymore. They are becoming part of the normal search experience: summaries, citations, follow-up answers, AI Overviews, AI Mode, generated comparisons, answer engines, and tools that can reason across multiple sources before a person ever clicks a blue link."},55980:{layer:'Demand',related:['shopping-ads','shopify'],excerpt:"Google Shopping usually breaks before the campaign ever gets interesting."},55886:{layer:'Demand',related:['seo','shopify'],excerpt:"Shopify gives stores a better technical starting point than a lot of custom ecommerce builds. It can create sitemaps, handle SSL, output canonical tags, support editable title tags…"},55722:{layer:'Demand',related:['seo','web-design'],excerpt:"SEO frameworks are useful until they become decorations."},55721:{layer:'Demand',related:['seo','web-design'],excerpt:"Technical SEO is where a lot of websites quietly lose."},55720:{layer:'Demand',related:['local-seo','seo'],excerpt:"Local SEO in 2026 is not an “ultimate guide” problem."},55719:{layer:'Demand',related:['seo','business-intelligence'],excerpt:"Most content marketing plans are calendars wearing a tiny strategy hat."},55718:{layer:'Build',related:['web-design','seo'],excerpt:"Web design trend lists are usually very pretty and not very helpful."},55717:{layer:'Demand',related:['seo','shopify'],excerpt:"Shopify SEO problems are rarely mysterious."},55716:{layer:'Demand',related:['google-search-ads','social-ads','seo'],excerpt:"Most channel-planning advice starts with a lie."},55715:{layer:'Demand',related:['seo','ai-search-optimization'],excerpt:"Most Google algorithm retrospectives are calendars."},55714:{layer:'Demand',related:['shopping-ads','shopify'],excerpt:"Most Shopify stores do not fail Google Merchant Center because the owner forgot to click one magic setup button."},55713:{layer:'Intelligence',related:['business-intelligence','google-search-ads'],excerpt:"When the economy gets tight, marketing gets interrogated."},55712:{layer:'Demand',related:['seo','business-intelligence'],excerpt:"Google algorithm updates do not need more hot takes."},55711:{layer:'Intelligence',related:['business-intelligence','seo'],excerpt:"Most teams open Google Search Console like it is a dashboard."},55710:{layer:'Demand',related:['seo','web-design'],excerpt:"Most answers to “how long does SEO take?” are too neat to be useful."},55709:{layer:'Demand',related:['seo','ai-search-optimization'],excerpt:"Most SEO trend posts are written like the calendar changed the algorithm."},55708:{layer:'Demand',related:['seo','web-design'],excerpt:"Duplicate content is usually not a penalty."},
};
export const posts: Post[] = [
  ...snapshot.posts.map((p) => ({ ...p, blocks: p.blocks as Block[], ...articleMap[p.id], excerpt: articleEditorial[p.slug]?.description || articleMap[p.id]?.excerpt })),
  ...authoredArticles.map(p => ({ id:p.id, slug:p.slug, title:p.title, date:p.dateGmt, dateGmt:p.dateGmt, modified:p.dateGmt, modifiedGmt:p.dateGmt, link:'/blog/'+p.slug+'/', author:{id:p.authorId,name:p.authorName,description:authors.find(a=>a.name===p.authorName)?.bio||''}, blocks:[], markdown:p.markdown, layer:p.layer, related:p.related, excerpt:p.description } as unknown as Post)),
].sort((a,b)=>b.dateGmt.localeCompare(a.dateGmt));
export const dateLabel = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Chicago' }).format(new Date(date.endsWith('Z') ? date : date + 'Z'));
// The Design's own excerpt when there is one; otherwise the first paragraph, cut at a word boundary.
export const excerpt = (p: Post, n = 180) => { if (p.excerpt) return p.excerpt; const t = p.blocks.find((b) => b.type === 'p')?.runs?.map((r) => r.text).join('') || ''; return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; };

// ---- routes ----
export type Template = 'home' | 'services' | 'service' | 'work' | 'case' | 'about' | 'contact' | 'thanks' | 'blog' | 'article' | 'author' | 'privacy' | 'terms' | '404';
export type Route = { path: string; template: Template; title: string; slug?: string; layer?: Layer; published?: string; metaTitle?:string; metaDescription?:string; noindex?:boolean };
const route = (path: string, template: Template, title: string, extra: Partial<Route> = {}): Route => ({ path, template, title, ...extra });
export const routes: Route[] = [
  route('/', 'home', 'ZINC — Build. Demand. Intelligence.'),
  route('/services/', 'services', 'Services'),
  ...services.map((s) => route('/services/' + s.slug + '/', 'service', s.title, { slug: s.slug, layer: s.layer })),
  route('/work/', 'work', 'Build — Websites, Ecommerce & Applications', {layer:'Build',metaDescription:'Explore ZINC’s website, ecommerce and application work in Build. Shopify storefronts, business apps and ongoing pro bono website support.'}),
  route('/work/demand/', 'work', 'Demand — Search & Campaigns', {layer:'Demand',metaDescription:'Explore SEO, content and paid campaigns for Once Upon a Book Club, Summit Marine, U.S. Oil Solutions and Las Vegas Safety & Supply.'}),
  route('/work/intelligence/', 'work', 'Intelligence — Reporting & Forecasting', {layer:'Intelligence',metaDescription:'Explore business reporting, OUABC BI Fusion, commodity forecasting and operational intelligence. See the applications and the decisions they support.'}),
  ...cases.map((c) => route('/work/' + c.slug + '/', 'case', c.title, { slug: c.slug, metaTitle: c.application ? c.title + ' Forecasting Platform' : c.nonprofit ? c.title + ' · Pro Bono Website Support' : undefined })),
  route('/about/', 'about', 'The people behind the work'),
  route('/contact/', 'contact', 'Start an Inquiry'),
  route('/thanks/', 'thanks', 'Inquiry received'),
  route('/blog/', 'blog', 'Notes on the work'),
  ...posts.map((p) => route('/blog/' + p.slug + '/', 'article', p.title, { slug: p.slug, layer: p.layer, published: p.date, metaTitle: articleEditorial[p.slug]?.title, metaDescription: articleEditorial[p.slug]?.description })),
  ...authors.map(a => route(authorPath(a.id), 'author', a.name, {slug:a.id,metaTitle:'Articles by '+a.schemaName,metaDescription:a.bio})),
  route('/privacy/', 'privacy', 'Privacy'),
  route('/terms/', 'terms', 'Terms'),
];
export const notFoundRoute: Route = { path: '/404/', template: '404', title: 'Page not found' };
// Pages excluded from sitemap / indexing (plus /admin/ and /api/ by prefix, see middleware).
export const noindexPaths = new Set(['/thanks/', '/404/']);

export const svcBy = (slug: string) => services.find((s) => s.slug === slug)!;
export const caseBy = (slug: string) => cases.find((c) => c.slug === slug)!;
export const pad = (i: number) => '0' + (i + 1);
export const link = (path: string, query?: Record<string, string>) => path + (query ? '?' + new URLSearchParams(query) : '');

export function describe(r: Route): string {
  if (r.metaDescription) return r.metaDescription;
  if (r.template === 'service') return serviceDescriptions[r.slug!] || svcBy(r.slug!).line;
  if (r.template === 'case') return caseBy(r.slug!).line;
  if (r.template === 'article') return excerpt(posts.find((p) => p.slug === r.slug)!, 155);
  if (r.template === 'privacy' || r.template === 'terms') {
    return (r.template === 'privacy' ? privacyApproved : termsApproved).description || r.title + ' | ZINC Digital';
  }
  return lede[r.template] || 'ZINC Digital';
}
const serviceDescriptions: Record<string,string> = {
  shopify:'Shopify stores built around clear product pages, dependable checkout and catalog operations. ZINC connects storefront development with search and paid media.',
  'web-design':'Custom websites with clear content, accessible navigation and fast page delivery. ZINC designs and develops the customer experience around the business.',
  apps:'Operations apps for assignments, scheduling and fieldwork. ZINC builds interfaces that connect the people doing the work with the information they need.',
  seo:'Technical SEO, useful content and internal links built around the pages your customers need. ZINC investigates search problems and verifies the repairs.',
  'local-seo':'Local SEO for service businesses: listings, location pages and search visibility connected to real customer demand. Explore ZINC’s approach and case work.',
  'google-search-ads':'Google Search campaigns built around customer intent, relevant landing pages and verified measurement. ZINC manages the account and the decisions behind it.',
  'shopping-ads':'Google Shopping management that connects product feeds, availability and campaigns. ZINC checks the catalog and storefront before interpreting ad performance.',
  'social-ads':'Meta paid social campaigns with creative, audience testing and verified measurement. ZINC connects campaign management with the customer experience.',
  'tiktok-ads':'TikTok campaign management with platform-specific creative, testing and measurement. Explore how ZINC connects paid social with the wider marketing program.',
  'business-intelligence':'Business reporting that connects commerce, search and paid media sources. ZINC builds dashboards and analysis around the decisions the business needs to make.',
};
export function ogKind(r: Route): string {
  if (r.template === 'service') return svcBy(r.slug!).layer.toLowerCase();
  if (r.template === 'article') return 'article';
  if (r.template === 'work' || r.template === 'case') return 'work';
  return 'home';
}
