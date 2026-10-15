// Owner-approved lane mockups, 8 October 2026. Lanes are a service view of the client-first
// record in engagements.ts: a client appears in every lane where it has an engagement.
import { clientWork, laneHref } from './engagements.ts';

export type WorkLane = 'Build' | 'Demand' | 'Intelligence';
export type WorkProject = {
  slug: string; title?: string; label: string; summary: string; category: string[];
  scene?: string; asset?: string; href: string; status?: string; dark?: boolean;
  flow?: string[]; community?: boolean;
};
type LaneConfig = { path: string; line: string; next: WorkLane; filters: string[]; order: string[] };

const lanes: Record<WorkLane, LaneConfig> = {
  Build: {
    path: '/work/build/', line: 'Websites, commerce and applications.', next: 'Demand',
    filters: ['All builds', 'Websites', 'Ecommerce', 'Applications'],
    order: ['carla-funk-photography', 'felon-motorwerk', 'once-upon-a-book-club', 'us-oil-solutions', 'fraim-cawley-company', 'smoky-mountain-survival', 'andrew-neese', 'porsche-roanoke', 'miami-tactical', 'bear-claw-usa', 'las-vegas-safety', 'summit-marine-development', 'zinc-fusion-v16', 'the-lampstand-va', 'straight-street-ministries'],
  },
  Demand: {
    path: '/work/demand/', line: 'Search. Campaigns. The path to a customer.', next: 'Intelligence',
    filters: ['All demand', 'SEO', 'Local search', 'Paid media', 'Content'],
    order: ['once-upon-a-book-club', 'summit-marine-development', 'us-oil-solutions', 'general-shale', 'ballad-health', 'meade-tractor', 'las-vegas-safety'],
  },
  Intelligence: {
    path: '/work/intelligence/', line: 'See the business. Make the next decision.', next: 'Build',
    filters: ['All intelligence', 'Reporting', 'Forecasting', 'Operational intelligence'],
    order: ['once-upon-a-book-club', 'zinc-fusion-v16', 'us-oil-solutions'],
  },
};

const rank = (order: string[], slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length);

function laneProjects(lane: WorkLane): WorkProject[] {
  const { order } = lanes[lane];
  return clientWork
    .flatMap(({ slug, engagements }) => engagements.filter((e) => e.layer === lane).map((e) => ({ slug, e })))
    .sort((a, b) => rank(order, a.slug) - rank(order, b.slug))
    .map(({ slug, e }) => ({
      slug, label: e.label, summary: e.summary, category: e.category, href: laneHref(slug, e),
      scene: e.scene, asset: e.asset, status: e.status, dark: e.dark, flow: e.flow, community: e.community,
    }));
}

export const workLanes = Object.fromEntries(
  (Object.keys(lanes) as WorkLane[]).map((lane) => {
    const { order: _order, ...config } = lanes[lane];
    return [lane, { ...config, projects: laneProjects(lane) }];
  }),
) as Record<WorkLane, Omit<LaneConfig, 'order'> & { projects: WorkProject[] }>;

export const laneNames = Object.keys(workLanes) as WorkLane[];
