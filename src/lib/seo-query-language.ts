/** Aggregate wording buckets; raw search terms never leave this function. Buckets may overlap. */
export const QUERY_LANGUAGE_GROUPS=[
 {term:'AI search optimization',pattern:'\\bai[ -]+search[ -]+optimi[sz]ation\\b'},
 {term:'Generative engine optimization',pattern:'generative[ -]+engine[ -]+optimi[sz]ation'},
 {term:'Answer engine optimization',pattern:'answer[ -]+engine[ -]+optimi[sz]ation'},
 {term:'AI optimization',pattern:'\\bai[ -]+optimi[sz]ation\\b'},
 {term:'AI SEO',pattern:'\\bai[ -]+seo\\b'},
] as const;
export function queryLanguageGroups(rows:readonly unknown[]){
 return QUERY_LANGUAGE_GROUPS.map(group=>{
  const expression=new RegExp(group.pattern,'i');let clicks=0,impressions=0,weightedPosition=0,matchedRows=0;
  for(const value of rows){
   const row=value as {keys?:unknown[];clicks?:unknown;impressions?:unknown;position?:unknown}|null;
   const query=row?.keys?.[0];if(typeof query!=='string'||!expression.test(query))continue;
   if(typeof row?.clicks!=='number'||!Number.isFinite(row.clicks)||row.clicks<0||typeof row.impressions!=='number'||!Number.isFinite(row.impressions)||row.impressions<0||typeof row.position!=='number'||!Number.isFinite(row.position)||row.position<0)continue;
   matchedRows++;clicks+=row.clicks;impressions+=row.impressions;weightedPosition+=row.position*row.impressions;
  }
  return {term:group.term,matchedReturnedRows:matchedRows,clicks:matchedRows?clicks:null,impressions:matchedRows?impressions:null,ctr:matchedRows&&impressions?clicks/impressions:null,position:matchedRows&&impressions?weightedPosition/impressions:null};
 });
}
