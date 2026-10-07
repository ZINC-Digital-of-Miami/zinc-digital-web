export const authors = [
  { id: 'kirk-musick', name: 'Kirk Musick, MS, MBA', schemaName: 'Kirk Musick', suffix: 'MS, MBA', role: 'CEO', photo: 'team-kirk-musick', bio: 'Kirk Musick leads ZINC Digital. His articles cover technical SEO, measurement and the decisions behind the work.', topics: 'Technical SEO · Analytics · Business intelligence' },
  { id: 'jaymie-wilhoit', name: 'Jaymie Wilhoit', schemaName: 'Jaymie Wilhoit', suffix: '', role: 'Managing Partner', photo: 'team-jaymie-wilhoit', bio: 'Jaymie Wilhoit is ZINC Digital’s Managing Partner. Her work connects SEO, paid media, Shopify and local search execution.', topics: 'Shopify · Paid media · Search operations' },
  { id: 'wendy-funnell', name: 'Wendy Funnell', schemaName: 'Wendy Funnell', suffix: '', role: 'Chief Content Officer', photo: 'team-wendy-funnell', bio: 'Wendy Funnell is ZINC Digital’s Chief Content Officer. Her articles focus on content planning, editorial work and the questions a useful page should answer.', topics: 'Content strategy · Editorial planning · Search intent' },
] as const;
export const authorPath = (id: string) => '/authors/' + id + '/';
export const authorFor = (name: string) => authors.find(author => name.trim().toLowerCase() === author.name.toLowerCase() || name.trim().toLowerCase() === author.schemaName.toLowerCase());

