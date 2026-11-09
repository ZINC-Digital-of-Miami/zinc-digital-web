import receipt from '../../../docs/editorial/research/2026-11-09-pillar-search-demand.json';
/** A dated retained research observation, never a live demand or ranking feed. */
export const pillarSearchResearch={
 id:'hypd:pillar-demand:2026-11-09',
 source:'HYPD research_get_search_volume; underlying provider not identified in response',
 retrievedAt:receipt.retrievedAt,
 request:receipt.request,
 result:receipt.response.structuredContent.result,
 limits:'US/English market estimates for 13 selected phrases, not exhaustive pillar demand, Miami/Panama City ranks or ZINC traffic. Months October 2025–September 2026. Advertising competition is not organic difficulty. No live SERP/intent inspection or client-experience evidence is included. Use this dated receipt; new research must retain its own receipt. Do not add overlapping keyword volumes into an audience estimate.',
};
