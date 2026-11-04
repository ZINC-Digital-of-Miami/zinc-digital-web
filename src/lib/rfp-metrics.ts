// First complete property-local day after the November 4 tracking release.
export const RFP_FIRST_FULL_DAY='2026-11-05';
export function rfpFunnelPeriod(startDate:string,endDate:string) {
 const start=startDate>RFP_FIRST_FULL_DAY?startDate:RFP_FIRST_FULL_DAY;
 return start<=endDate?{startDate:start,endDate}:null;
}
export const RFP_STEPS = [
 ['page_view','Visited the site'],['rfp_form_view','Viewed proposal form'],['rfp_form_start','Started proposal form'],
 ['rfp_scope_view','Reached project scope'],['rfp_context_view','Reached project context'],['generate_lead','Submitted request'],
] as const;
export function rfpFunnelRequest(startDate:string,endDate:string) {
 return {dateRanges:[{startDate,endDate}],funnel:{isOpenFunnel:false,steps:RFP_STEPS.map(([eventName])=>({name:eventName,filterExpression:{andGroup:{expressions:[{funnelEventFilter:{eventName}},{funnelFieldFilter:{fieldName:'hostName',stringFilter:{matchType:'FULL_REGEXP',value:'(www\\.)?zincdigital\\.co',caseSensitive:false}}}]}}}))}};
}
/** Missing stage rows stay unavailable: absence before tagging is not measured abandonment. */
export function parseRfpFunnel(data:unknown) {
 const d=data as {funnelTable?:{metricHeaders?:{name:string}[];rows?:{dimensionValues?:{value:string}[];metricValues?:{value:string}[]}[];metadata?:unknown}};
 const table=d?.funnelTable;
 if(!table||!Array.isArray(table.rows)||!Array.isArray(table.metricHeaders))throw new Error('The native funnel response is unavailable.');
 const column=table.metricHeaders.findIndex(h=>h.name==='activeUsers');
 if(column<0)throw new Error('The native funnel user metric is unavailable.');
 const steps=RFP_STEPS.map(([event,label],i)=>{
  const row=table.rows!.find(r=>r.dimensionValues?.[0]?.value===`${i+1}. ${event}`);
  const raw=row?.metricValues?.[column]?.value;
  const users=raw!==undefined&&/^\d+$/.test(raw)&&Number.isSafeInteger(Number(raw))?Number(raw):null;
  return {event,label,users};
 });
 for(let i=1;i<steps.length;i++)if(steps[i].users!==null&&steps[i-1].users!==null&&steps[i].users!>steps[i-1].users!)throw new Error('The native funnel population is inconsistent.');
 return {steps,metadata:table.metadata||{}};
}
