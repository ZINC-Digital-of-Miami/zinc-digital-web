// Owner-approved lane mockups, 8 October 2026. One project can appear in several lanes.
export type WorkLane = 'Build' | 'Demand' | 'Intelligence';
export type WorkProject = {
  slug: string; title?: string; label: string; summary: string; category: string[];
  scene?: string; asset?: string; href?: string; status?: string; dark?: boolean;
  flow?: string[]; community?: boolean;
};
export const workLanes: Record<WorkLane, {
  path: string; line: string; next: WorkLane; filters: string[]; projects: WorkProject[];
}> = {
  Build: {
    path: '/work/build/', line: 'Websites, commerce and applications.', next: 'Demand',
    filters: ['All builds', 'Websites', 'Ecommerce', 'Applications'],
    projects: [
      { slug: 'carla-funk-photography', label: 'Website + one-year upgrade', summary: 'The original photography website and a one-year upgrade with a private admin image uploader.', category: ['Websites'], asset: 'carla-home-desktop', status: 'Upgrade in development' },
      { slug: 'felon-motorwerk', label: 'Website + identity', summary: 'Website and identity work for Felon Motorwerk.', category: ['Websites'], asset: 'felon-web-mockup' },
      { slug: 'once-upon-a-book-club', label: 'Shopify website + BI application', summary: 'A rebuilt Shopify storefront for subscriptions, releases and gifts, with a separate business intelligence application in development.', category: ['Ecommerce','Applications'], asset: 'ouabc-site', status: 'BI application in development', href: '/work/once-upon-a-book-club/' },
      { slug: 'us-oil-solutions', label: 'Websites + operations app', summary: 'Public websites and a separate technician and supervisor app for assignments, fryer-service records, scheduling and reporting.', category: ['Websites','Applications'], scene: 'build-uos', dark: true, status: 'Second website in development', href: '/work/us-oil-solutions/#website' },
      { slug: 'fraim-cawley-company', label: 'Website', summary: 'Website design for Fraim, Cawley & Company.', category: ['Websites'], asset: 'fraim-cawley-company-presentation' },
      { slug: 'smoky-mountain-survival', label: 'Website', summary: 'Website design for Smoky Mountain Survival.', category: ['Websites'], asset: 'smoky-mountain-survival-presentation' },
      { slug: 'andrew-neese', label: 'Website', summary: 'Website design for Andrew Neese.', category: ['Websites'], asset: 'andrew-neese-presentation' },
      { slug: 'porsche-roanoke', label: 'Dealer website · Official Porsche merchandise website', summary: 'Dealer and official merchandise websites for the Porsche dealership in Roanoke, Virginia.', category: ['Websites'], asset: 'porsche-roanoke-presentation', status: 'Illustrative device presentation' },
      { slug: 'miami-tactical', label: 'Website + logo design', summary: 'A monochrome identity and a category-led website for Miami Tactical.', category: ['Websites'], asset: 'miami-tactical-website' },
      { slug: 'bear-claw-usa', label: 'Website design + development', summary: 'Product information, company background and a clear path to request a quote.', category: ['Websites'], asset: 'bear-claw-home-desktop' },
      { slug: 'las-vegas-safety', label: 'Website + ecommerce', summary: 'A wholesale catalog, account ordering and warehouse capabilities brought into one rebuild.', category: ['Ecommerce', 'Websites'], asset: 'lvs-case-devices-restaurant' },
      { slug: 'summit-marine-development', label: 'Website', summary: 'Seawalls, docks and waterfront construction, brought into view.', category: ['Websites'], asset: 'smd-devices' },
      { slug: 'zinc-fusion-v16', label: 'Forecasting application', summary: 'A dedicated workspace for commodity markets and procurement decisions.', category: ['Applications'], asset: 'fusion-v16-dashboard', status: 'In development' },
      { slug: 'the-lampstand-va', label: 'Pro bono website support', summary: 'Ongoing website management, hosting and Night of Hope support.', category: ['Websites'], asset: 'lampstand-home', community: true },
      { slug: 'straight-street-ministries', label: 'Pro bono website support', summary: 'Website management and support for the Roanoke youth ministry.', category: ['Websites'], asset: 'straight-street-home', community: true },
    ],
  },
  Demand: {
    path: '/work/demand/', line: 'Search. Campaigns. The path to a customer.', next: 'Intelligence',
    filters: ['All demand', 'SEO', 'Local search', 'Paid media', 'Content'],
    projects: [
      { slug: 'once-upon-a-book-club', label: 'SEO + Shopping + Meta + TikTok', summary: 'Search-led content and paid campaigns for subscriptions, pre-orders and gifts.', category: ['SEO', 'Paid media', 'Content'], scene: 'demand-ouabc', dark: true },
      { slug: 'summit-marine-development', label: 'Local SEO + Google + LSA + Meta', summary: 'Search and advertising for seawalls, docks and waterfront construction.', category: ['Local search', 'SEO', 'Paid media', 'Content'], scene: 'demand-summit', asset: 'smd-dock-ad-previews', flow: ['Local search', 'Service page', 'Inquiry'] },
      { slug: 'us-oil-solutions', label: 'Local SEO', summary: 'Local SEO within a broader relationship spanning websites and a separate operations app.', category: ['SEO', 'Local search'], asset: 'logo-us-oil', href: '/work/us-oil-solutions/#work-demand' },
      { slug: 'general-shale', label: 'National enterprise SEO', summary: 'A past national enterprise SEO engagement for General Shale.', category: ['SEO'], asset: 'seo-general-shale-current', status: 'Current website shown for context', href: '/work/general-shale/' },
      { slug: 'ballad-health', label: 'Enterprise SEO / 2018 merger', summary: 'SEO technician for the healthcare merger, spanning thousands of pages.', category: ['SEO'], asset: 'seo-ballad-health-current', status: 'Current website shown for context', href: '/work/ballad-health/' },
      { slug: 'meade-tractor', label: 'Enterprise local SEO', summary: 'A past enterprise local SEO engagement for the John Deere equipment dealer.', category: ['SEO','Local search'], asset: 'seo-meade-tractor-current', status: 'Current website shown for context', href: '/work/meade-tractor/' },
      { slug: 'las-vegas-safety', label: 'Product SEO', summary: 'Search-focused product content, indexing and redirects for a wholesale catalog.', category: ['SEO', 'Content'], asset: 'lvs-case-devices-restaurant', href: '/work/las-vegas-safety/#catalog' },
    ],
  },
  Intelligence: {
    path: '/work/intelligence/', line: 'See the business. Make the next decision.', next: 'Build',
    filters: ['All intelligence', 'Reporting', 'Forecasting', 'Operational intelligence'],
    projects: [
      { slug: 'once-upon-a-book-club', title: 'Once Upon a Book Club', label: 'OUABC BI Fusion · Business intelligence system', summary: 'A dedicated application for commerce, search visibility, advertising, customer journeys and seasonal outlooks. The system brings business records into one workspace for decisions.', category: ['Reporting'], scene: 'intelligence-ouabc', asset: 'ouabc-bi-demand-current', status: 'BI app · In development', flow: ['Sources', 'Context', 'Decisions'] },
      { slug: 'zinc-fusion-v16', label: 'Commodity forecasting for Chris Stacy', summary: 'Market dashboards, procurement scenarios, policy and sentiment in a dedicated forecasting platform.', category: ['Forecasting'], scene: 'intelligence-fusion', dark: true, status: 'In development', flow: ['Market evidence', 'Scenarios', 'Procurement'] },
      { slug: 'us-oil-solutions', label: 'Operational reporting', summary: 'Service records and reporting inside the operations app: technician visits, check-ins and fryer-service histories.', category: ['Operational intelligence', 'Reporting'], scene: 'intelligence-uos', asset: 'uos-current-technicians-desktop', flow: ['Visits', 'Service records', 'Reporting'] },
    ],
  },
};

export const laneNames = Object.keys(workLanes) as WorkLane[];
export function projectLink(slug: string, lane: WorkLane) {
  if (slug === 'once-upon-a-book-club' && lane !== 'Build') return '/work/' + slug + '/#' + (lane === 'Demand' ? 'campaigns' : 'reporting');
  return '/work/' + slug + '/' + (lane === 'Build' ? '' : slug === 'zinc-fusion-v16' ? '#case-content' : '#work-' + lane.toLowerCase());
}
