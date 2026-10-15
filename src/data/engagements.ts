// Owner, 14–15 October 2026 CT: Work is authored client-first. Each client is listed once,
// with every website, application, campaign and SEO engagement nested under it.
// /work/, the service lanes, the case-page rail and each case's layers and services derive from this file.
import type { Layer } from './site';

export type Engagement = {
  layer: Layer; label: string; summary: string;
  /** Service slugs delivered in this engagement; each must belong to the same layer. */
  services: string[];
  /** Lane filter categories. */
  category: string[];
  /** Section id on the client's case page that presents this engagement. */
  anchor: string;
  /** Lane links normally open a client's first engagement at the top of the case; set to open its section instead. */
  deepLink?: boolean;
  status?: string; scene?: string; asset?: string; dark?: boolean; flow?: string[]; community?: boolean;
};
export type ClientWork = { slug: string; engagements: Engagement[] };

/** One entry per client, in /work/ order. */
export const clientWork: ClientWork[] = [
  { slug: 'bear-claw-usa', engagements: [
    { layer: 'Build', label: 'Website design + development', summary: 'Product information, company background and a clear path to request a quote.', services: ['web-design'], category: ['Websites'], anchor: 'case-content', asset: 'bear-claw-home-desktop' },
  ] },
  { slug: 'smoky-mountain-survival', engagements: [
    { layer: 'Build', label: 'Website', summary: 'Website design for Smoky Mountain Survival.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'smoky-mountain-survival-presentation' },
  ] },
  { slug: 'fraim-cawley-company', engagements: [
    { layer: 'Build', label: 'Website', summary: 'Website design for Fraim, Cawley & Company.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'fraim-cawley-company-presentation' },
  ] },
  { slug: 'once-upon-a-book-club', engagements: [
    { layer: 'Build', label: 'Shopify website + BI application', summary: 'A rebuilt Shopify storefront for subscriptions, releases and gifts, with a separate business intelligence application in development.', services: ['shopify'], category: ['Ecommerce', 'Applications'], anchor: 'website', asset: 'ouabc-site', status: 'BI application in development' },
    { layer: 'Demand', label: 'SEO + Shopping + Meta + TikTok', summary: 'Search-led content and paid campaigns for subscriptions, pre-orders and gifts.', services: ['seo', 'shopping-ads', 'social-ads', 'tiktok-ads'], category: ['SEO', 'Paid media', 'Content'], anchor: 'campaigns', scene: 'demand-ouabc', dark: true },
    { layer: 'Intelligence', label: 'OUABC BI Fusion · Business intelligence system', summary: 'A dedicated application for commerce, search visibility, advertising, customer journeys and seasonal outlooks. The system brings business records into one workspace for decisions.', services: ['business-intelligence'], category: ['Reporting'], anchor: 'reporting', scene: 'intelligence-ouabc', asset: 'ouabc-bi-demand-current', status: 'BI app · In development', flow: ['Sources', 'Context', 'Decisions'] },
  ] },
  { slug: 'andrew-neese', engagements: [
    { layer: 'Build', label: 'Website', summary: 'Website design for Andrew Neese.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'andrew-neese-presentation' },
  ] },
  { slug: 'porsche-roanoke', engagements: [
    { layer: 'Build', label: 'Dealer website · Official Porsche merchandise website', summary: 'Dealer and official merchandise websites for the Porsche dealership in Roanoke, Virginia.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'porsche-roanoke-presentation', status: 'Illustrative device presentation' },
  ] },
  { slug: 'felon-motorwerk', engagements: [
    { layer: 'Build', label: 'Website + identity', summary: 'Website and identity work for Felon Motorwerk.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'felon-web-mockup' },
  ] },
  { slug: 'summit-marine-development', engagements: [
    { layer: 'Build', label: 'Website', summary: 'Seawalls, docks and waterfront construction, brought into view.', services: ['web-design'], category: ['Websites'], anchor: 'work-build', asset: 'smd-devices' },
    { layer: 'Demand', label: 'Local SEO + Google + LSA + Meta', summary: 'Search and advertising for seawalls, docks and waterfront construction.', services: ['local-seo', 'google-search-ads', 'social-ads'], category: ['Local search', 'SEO', 'Paid media', 'Content'], anchor: 'work-demand', scene: 'demand-summit', asset: 'smd-dock-ad-previews', flow: ['Local search', 'Service page', 'Inquiry'] },
  ] },
  { slug: 'us-oil-solutions', engagements: [
    { layer: 'Build', label: 'Websites + operations app', summary: 'Public websites and a separate technician and supervisor app for assignments, fryer-service records, scheduling and reporting.', services: ['web-design', 'apps'], category: ['Websites', 'Applications'], anchor: 'website', deepLink: true, scene: 'build-uos', dark: true, status: 'Second website in development' },
    { layer: 'Demand', label: 'Local SEO', summary: 'Local SEO within a broader relationship spanning websites and a separate operations app.', services: ['seo'], category: ['SEO', 'Local search'], anchor: 'work-demand', asset: 'logo-us-oil' },
    { layer: 'Intelligence', label: 'Operational reporting', summary: 'Service records and reporting inside the operations app: technician visits, check-ins and fryer-service histories.', services: [], category: ['Operational intelligence', 'Reporting'], anchor: 'work-intelligence', scene: 'intelligence-uos', asset: 'uos-current-technicians-desktop', flow: ['Visits', 'Service records', 'Reporting'] },
  ] },
  { slug: 'carla-funk-photography', engagements: [
    { layer: 'Build', label: 'Website + one-year upgrade', summary: 'The original photography website and a one-year upgrade with a private admin image uploader.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'carla-home-desktop', status: 'Upgrade in development' },
  ] },
  { slug: 'ballad-health', engagements: [
    { layer: 'Demand', label: 'Enterprise SEO / 2018 merger', summary: 'SEO technician for the healthcare merger, spanning thousands of pages.', services: ['seo'], category: ['SEO'], anchor: 'case-content', asset: 'seo-ballad-health-current', status: 'Current website shown for context' },
  ] },
  { slug: 'meade-tractor', engagements: [
    { layer: 'Demand', label: 'Enterprise local SEO', summary: 'A past enterprise local SEO engagement for the John Deere equipment dealer.', services: ['local-seo', 'seo'], category: ['SEO', 'Local search'], anchor: 'case-content', asset: 'seo-meade-tractor-current', status: 'Current website shown for context' },
  ] },
  { slug: 'general-shale', engagements: [
    { layer: 'Demand', label: 'National enterprise SEO', summary: 'A past national enterprise SEO engagement for General Shale.', services: ['seo'], category: ['SEO'], anchor: 'case-content', asset: 'seo-general-shale-current', status: 'Current website shown for context' },
  ] },
  { slug: 'las-vegas-safety', engagements: [
    { layer: 'Build', label: 'Website + ecommerce', summary: 'A wholesale catalog, account ordering and warehouse capabilities brought into one rebuild.', services: ['web-design'], category: ['Ecommerce', 'Websites'], anchor: 'website', asset: 'lvs-case-devices-restaurant' },
    { layer: 'Demand', label: 'Product SEO', summary: 'Search-focused product content, indexing and redirects for a wholesale catalog.', services: ['seo'], category: ['SEO', 'Content'], anchor: 'catalog', asset: 'lvs-case-devices-restaurant' },
  ] },
  { slug: 'zinc-fusion-v16', engagements: [
    { layer: 'Build', label: 'Forecasting application', summary: 'A dedicated workspace for commodity markets and procurement decisions.', services: ['apps'], category: ['Applications'], anchor: 'work-build', asset: 'fusion-v16-dashboard', status: 'In development' },
    { layer: 'Intelligence', label: 'Commodity forecasting for Chris Stacy', summary: 'Market dashboards, procurement scenarios, policy and sentiment in a dedicated forecasting platform.', services: ['business-intelligence'], category: ['Forecasting'], anchor: 'work-intelligence', scene: 'intelligence-fusion', dark: true, status: 'In development', flow: ['Market evidence', 'Scenarios', 'Procurement'] },
  ] },
  { slug: 'the-lampstand-va', engagements: [
    { layer: 'Build', label: 'Pro bono website support', summary: 'Ongoing website management, hosting and Night of Hope support.', services: [], category: ['Websites'], anchor: 'case-content', asset: 'lampstand-home', community: true },
  ] },
  { slug: 'straight-street-ministries', engagements: [
    { layer: 'Build', label: 'Pro bono website support', summary: 'Website management and support for the Roanoke youth ministry.', services: [], category: ['Websites'], anchor: 'case-content', asset: 'straight-street-home', community: true },
  ] },
  { slug: 'miami-tactical', engagements: [
    { layer: 'Build', label: 'Website + logo design', summary: 'A monochrome identity and a category-led website for Miami Tactical.', services: ['web-design'], category: ['Websites'], anchor: 'website', asset: 'miami-tactical-website' },
  ] },
];

const layerOrder: Layer[] = ['Build', 'Demand', 'Intelligence'];

export const workFor = (slug: string) => clientWork.find((c) => c.slug === slug)?.engagements ?? [];
/** The section of the client's case page that presents an engagement. */
export const sectionHref = (slug: string, e: Engagement) => '/work/' + slug + '/#' + e.anchor;
/** Lane destination: the case itself for a client's first engagement, otherwise the engagement's section. */
export const laneHref = (slug: string, e: Engagement) =>
  workFor(slug)[0] === e && !e.deepLink ? '/work/' + slug + '/' : sectionHref(slug, e);
export const clientLayers = (slug: string): Layer[] => layerOrder.filter((l) => workFor(slug).some((e) => e.layer === l));
export const clientServices = (slug: string) => [...new Set(workFor(slug).flatMap((e) => e.services))];
/** A client's engagements in Build → Demand → Intelligence order. */
export const engagementsByLayer = (slug: string) => layerOrder.flatMap((l) => workFor(slug).filter((e) => e.layer === l));
