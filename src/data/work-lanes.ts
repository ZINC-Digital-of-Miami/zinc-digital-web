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
      { slug: 'once-upon-a-book-club', label: 'Shopify rebuild', summary: 'A rebuilt Shopify storefront for subscriptions, one-time releases and bookish gifts.', category: ['Ecommerce'], scene: 'build-ouabc' },
      { slug: 'once-upon-a-book-club', title: 'OUABC BI Fusion', label: 'Application + business intelligence', summary: 'A dedicated business intelligence application connecting commerce, search, advertising, customer journeys and seasonal outlooks.', category: ['Applications'], scene: 'intelligence-ouabc', dark: true, status: 'In development', href: '/work/once-upon-a-book-club/#reporting' },
      { slug: 'us-oil-solutions', label: 'Public website', summary: 'A new website for the complete oil-management program, from fresh supply to used-oil collection.', category: ['Websites'], scene: 'build-uos', dark: true, status: 'Second website in development', href: '/work/us-oil-solutions/#website' },
      { slug: 'us-oil-solutions', label: 'Technician + supervisor app', summary: 'A separate operations application for assignments, fryer-service records, scheduling and visit reporting.', category: ['Applications'], asset: 'uos-current-technicians-desktop', href: '/work/us-oil-solutions/#operations-app' },
      { slug: 'miami-tactical', label: 'Website + logo design', summary: 'A monochrome identity and a category-led website for Miami Tactical.', category: ['Websites'], asset: 'miami-tactical-website' },
      { slug: 'bear-claw-usa', label: 'Website design + development', summary: 'Product information, company background and a clear path to request a quote.', category: ['Websites'], asset: 'bear-claw-home-desktop' },
      { slug: 'las-vegas-safety', label: 'Website + ecommerce', summary: 'A wholesale catalog, account ordering and warehouse capabilities brought into one rebuild.', category: ['Ecommerce', 'Websites'], asset: 'case-lvs-home-desktop' },
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
      { slug: 'summit-marine-development', label: 'Local SEO + Google + LSA + Meta', summary: 'Search and advertising for seawalls, docks and waterfront construction.', category: ['Local search', 'SEO', 'Paid media', 'Content'], scene: 'demand-summit', flow: ['Local search', 'Service page', 'Inquiry'] },
      { slug: 'us-oil-solutions', label: 'SEO + service content', summary: 'SEO for restaurant oil management in Las Vegas.', category: ['SEO', 'Content'], asset: 'uos-second-site-desktop' },
      { slug: 'las-vegas-safety', label: 'Product SEO', summary: 'Search-focused product content, indexing and redirects for a wholesale catalog.', category: ['SEO', 'Content'], asset: 'case-lvs-home-desktop' },
    ],
  },
  Intelligence: {
    path: '/work/intelligence/', line: 'See the business. Make the next decision.', next: 'Build',
    filters: ['All intelligence', 'Reporting', 'Forecasting', 'Operational intelligence'],
    projects: [
      { slug: 'once-upon-a-book-club', title: 'OUABC BI Fusion', label: 'Business intelligence system', summary: 'A dedicated application for commerce, search visibility, advertising, customer journeys and seasonal outlooks. The system brings business records into one workspace for decisions.', category: ['Reporting'], scene: 'intelligence-ouabc', status: 'BI app · In development', flow: ['Sources', 'Context', 'Decisions'] },
      { slug: 'zinc-fusion-v16', label: 'Commodity forecasting for Chris Stacy', summary: 'Market dashboards, procurement scenarios, policy and sentiment in a dedicated forecasting platform.', category: ['Forecasting'], scene: 'intelligence-fusion', dark: true, status: 'In development', flow: ['Market evidence', 'Scenarios', 'Procurement'] },
      { slug: 'us-oil-solutions', label: 'Operational reporting', summary: 'Service records and reporting inside the operations app: technician visits, check-ins and fryer-service histories.', category: ['Operational intelligence', 'Reporting'], scene: 'intelligence-uos', flow: ['Visits', 'Service records', 'Reporting'] },
    ],
  },
};

export const laneNames = Object.keys(workLanes) as WorkLane[];
export function projectLink(slug: string, lane: WorkLane) {
  if (slug === 'once-upon-a-book-club' && lane !== 'Build') return '/work/' + slug + '/#' + (lane === 'Demand' ? 'campaigns' : 'reporting');
  return '/work/' + slug + '/' + (lane === 'Build' ? '' : '#work-' + lane.toLowerCase());
}
