// Project scope comes from the owner-provided case records in site.ts.
// Context explains the business problem; it does not assert unrecorded deliverables or metrics.
export const engagementStories: Record<string,{title:string;intro:string;sections:[string,string][];flow:string[]}> = {
 'ballad-health': {
  title:'Search through a healthcare merger.',
  intro:'A healthcare merger changes the organization behind the website. Patients still need to find care. Ballad Health’s 2018 merger brought those two realities together across thousands of pages.',
  sections:[
   ['The business context','Two regional health systems were coming together under the Ballad Health name. In that setting, search connects a changing organization with people looking for hospitals, providers and services across the Appalachian Highlands.'],
   ['The assignment','Kirk Musick served as the SEO technician managing the merger’s enterprise SEO work. The scope spanned thousands of pages across the merging healthcare organizations, making this a search-management engagement at system scale.'],
   ['Why the scale matters','A large healthcare website serves many distinct needs. Someone searching for a provider and someone searching for a service may enter through completely different pages. The significance of this engagement lies in that breadth: managing SEO through organizational change while the website continues to serve those different journeys.'],
  ],flow:['Healthcare merger','Thousands of pages','Enterprise SEO'],
 },
 'meade-tractor': {
  title:'An enterprise business. A local search.',
  intro:'Equipment buyers start with a practical need and a place. For a dealership business, enterprise search has to remain relevant to that local decision.',
  sections:[
   ['The business context','Meade Tractor operates in equipment sales and dealership service. A customer’s search can begin with the equipment itself, a nearby dealership or support for a machine already in use. Location is part of the decision, alongside the product.'],
   ['The assignment','ZINC’s engagement focused on enterprise local SEO for Meade Tractor. The work sits where a broad dealership business meets geographically specific demand: making local search a part of the enterprise search strategy.'],
   ['The customer journey','The useful connection is between a search and the relevant business destination. Equipment, location and service needs give this engagement its context, with local relevance carrying as much importance as the wider company presence.'],
  ],flow:['Equipment need','Local search','Dealership'],
 },
 'general-shale': {
  title:'A national business, found through search.',
  intro:'General Shale’s engagement brought a national scope to enterprise SEO. The search challenge reaches beyond a single local market or one customer entry point.',
  sections:[
   ['The business context','General Shale supplies brick, stone and concrete block for residential, commercial and architectural projects. Its audience includes people selecting a material for a home as well as professionals researching a building specification. Those journeys start with different questions about products, appearance and use.'],
   ['The assignment','ZINC worked with General Shale on enterprise SEO with a national scope. The assignment addressed the company’s wider search presence across markets, with the national business as its frame.'],
   ['The strategic distinction','Building-material research combines visual choice with practical requirements. A homeowner may begin with a brick color or finish; an architect or builder may need a product type or technical resource. A national search presence has to make sense across those kinds of inquiry. That breadth gives the enterprise SEO assignment its business context.'],
  ],flow:['Material selection','Enterprise search','Product discovery'],
 },
};

// Business context checked 2026-10-26: https://www.balladhealth.org/about-us and https://generalshale.com/company/. These sources establish context, not ZINC delivery claims.
