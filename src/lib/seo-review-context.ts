const record=(v:unknown):Record<string,unknown>|null=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:null;
function seriesSummary(value:unknown,metric:string){
 if(!Array.isArray(value))return {observedDays:0,min:null,max:null,median:null,maxDate:null};
 const points=value.map(record).filter((p):p is Record<string,unknown>=>!!p&&typeof p.date==='string'&&typeof p[metric]==='number'&&Number.isFinite(p[metric]));
 const values=points.map(p=>p[metric] as number).sort((a,b)=>a-b),middle=Math.floor(values.length/2);
 const maximum=values.at(-1)??null;
 return {observedDays:values.length,min:values[0]??null,max:maximum,median:values.length?(values.length%2?values[middle]:(values[middle-1]+values[middle])/2):null,maxDate:points.find(p=>p[metric]===maximum)?.date??null};
}
function compactSignals(value:unknown){
 const s=record(value);if(!s||!Array.isArray(s.metadata))return value;
 const groups=new Map<string,{content:string;fields:{name:string;position:number}[]}>();
 for(const [position,entry] of s.metadata.entries()){
  const m=record(entry);if(!m||typeof m.content!=='string'||typeof m.name!=='string')return value;
  const group=groups.get(m.content)||{content:m.content,fields:[]};group.fields.push({name:m.name,position});groups.set(m.content,group);
 }
 const {metadata:_,...rest}=s;
 return {...rest,metadataValues:[...groups.values()]};
}
/** Keep every page/period and issue, without paying Claude to reread pass objects or entire daily-series tables. */
export function reviewContext(evidence:readonly {id:string;[key:string]:unknown}[]){
 return evidence.map(item=>{
  if(item.id.startsWith('page:')){
   const a=record(item.analysis);if(!a||!Array.isArray(a.checks))return item;
   const {categories:_,checks,...analysis}=a;
   return {...item,signals:compactSignals(item.signals),analysis:{...analysis,passedCheckIds:checks.filter(c=>record(c)?.status==='pass').map(c=>record(c)?.id),checks:checks.filter(c=>record(c)?.status!=='pass')}};
  }
  if(item.id==='page-performance'&&Array.isArray(item.pages))return {...item,pages:item.pages.map(value=>{
   const page=record(value);if(!page)return value;
   const {series,...rest}=page,s=record(series);
   return {...rest,dailySummary:{views:seriesSummary(s?.ga4,'views'),clicks:seriesSummary(s?.gsc,'clicks'),impressions:seriesSummary(s?.gsc,'impressions')}};
  }),contextNote:'Full native daily series is retained in the dashboard evidence. Claude receives per-page period totals, source limits and descriptive daily summaries over returned observations only. Missing dates are not zeros; no significance is inferred.'};
  return item;
 });
}
