/** Versioned, deterministic HTML checklist scores. These are not Google scores or ranking forecasts. */
export const SCORING_VERSION='seo-html-2026-11-03.1';
export type PageScore={path:string;score:number|null;grade:string;failed:number;warnings:number};
export type ScoreSnapshot={scoringVersion:string;total:number;scored:number;blocked:number;excluded:number;unavailable:number;mean:number|null;categories:{name:string;points:number;maxPoints:number;score:number;pages:number}[];pages:PageScore[]};
export type SnapshotComparison={available:boolean;reason:string;commonPages:number;meanDelta:number|null;improved:number|null;worsened:number|null;unchanged:number|null;pageDeltas:{path:string;before:number;after:number;delta:number}[]};
export type ScoreHistory={key:string;at:string;scorecard:ScoreSnapshot};
export type PerformanceMetrics={views:number|null;engagementSeconds:number|null;clicks:number|null;impressions:number|null};
export type PerformancePage={path:string;title:string;kind:'blog'|'service';pillars:string[];current:PerformanceMetrics;previous:PerformanceMetrics;series:{ga4:{date:string;views:number;engagementSeconds:number}[];gsc:{date:string;clicks:number;impressions:number}[]};serviceReferrals?:{current:number|null;previous:number|null}};
export type PagePerformance={id:'page-performance';available:boolean;range:{current:{start:string;end:string};previous:{start:string;end:string}};sources:{ga4:{available:boolean;gap?:string;timeZone?:string|null};gsc:{available:boolean;gap?:string;timeZone?:string|null};transitions?:{available:boolean;gap?:string}};pillars:{slug:string;title:string;servicePath:string;articlePaths:string[];serviceReferrals?:{current:number|null;previous:number|null}}[];pages:PerformancePage[];transitions?:{articlePath:string;servicePath:string;current:number|null;previous:number|null}[];notes:string[]};
const record=(v:unknown):Record<string,unknown>|null=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:null;
const score=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100;
const count=(v:unknown):v is number=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
const publicPath=(v:unknown):v is string=>typeof v==='string'&&/^\/(?:[a-z0-9-]+\/)*$/.test(v)&&!/^\/(admin|api)\//.test(v);
const calendarDay=(v:unknown):v is string=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T12:00:00Z'))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;

export function scoreSnapshot(evidence:readonly unknown[],scoringVersion=SCORING_VERSION):ScoreSnapshot{
 const pages:PageScore[]=[],categories=new Map<string,{points:number;maxPoints:number;pages:number}>();
 for(const value of evidence){
  const e=record(value);if(!e||typeof e.id!=='string'||!e.id.startsWith('page:')||!publicPath(e.path))continue;
  if(pages.some(p=>p.path===e.path))throw new Error('The SEO score snapshot contains duplicate pages.');
  const a=record(e.analysis),grade=typeof a?.grade==='string'?a.grade:'unavailable';
  const measured=grade!=='excluded'&&grade!=='blocked'&&score(a?.score)?a.score:null;
  const checks=Array.isArray(a?.checks)?a.checks.map(record).filter(Boolean):[];
  pages.push({path:e.path,score:measured,grade,failed:checks.filter(c=>c?.status==='fail').length,warnings:checks.filter(c=>c?.status==='warn').length});
  if(measured===null||!Array.isArray(a?.categories))continue;
  for(const value of a.categories){const c=record(value);if(!c||typeof c.name!=='string'||typeof c.points!=='number'||typeof c.maxPoints!=='number'||!Number.isFinite(c.points)||!Number.isFinite(c.maxPoints)||c.points<0||c.maxPoints<=0||c.points>c.maxPoints)continue;
   const row=categories.get(c.name)||{points:0,maxPoints:0,pages:0};row.points+=c.points;row.maxPoints+=c.maxPoints;row.pages++;categories.set(c.name,row);
  }
 }
 const measured=pages.filter(p=>p.score!==null),blocked=pages.filter(p=>p.grade==='blocked').length,excluded=pages.filter(p=>p.grade==='excluded').length;
 return {scoringVersion,total:pages.length,scored:measured.length,blocked,excluded,unavailable:pages.length-measured.length-blocked-excluded,mean:measured.length?Math.round(measured.reduce((n,p)=>n+p.score!,0)/measured.length*10)/10:null,categories:[...categories].map(([name,c])=>({name,...c,score:Math.round(c.points/c.maxPoints*1000)/10})),pages:pages.sort((a,b)=>Number(b.grade==='blocked')-Number(a.grade==='blocked')||((a.score??101)-(b.score??101))||a.path.localeCompare(b.path))};
}
export function scoreTrend(history:readonly ScoreHistory[]){
 const sorted=[...history].filter(h=>Number.isFinite(Date.parse(h.at))).sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 const version=sorted.at(-1)?.scorecard.scoringVersion;
 const rows=sorted.filter(h=>h.scorecard.scoringVersion===version);
 if(!rows.length)return {commonPages:0,points:[] as {key:string;at:string;mean:number}[]};
 const common=rows[0].scorecard.pages.filter(p=>p.score!==null&&rows.every(r=>r.scorecard.pages.some(q=>q.path===p.path&&q.score!==null))).map(p=>p.path);
 return {commonPages:common.length,points:common.length?rows.map(h=>({key:h.key,at:h.at,mean:Math.round(h.scorecard.pages.filter(p=>common.includes(p.path)).reduce((s,p)=>s+p.score!,0)/common.length*10)/10})):[]};
}
export function trafficComparisons(evidence:readonly unknown[]){
 const rows:{label:string;source:string;current:number|null;previous:number|null;percentage:boolean;currentPeriod:string;previousPeriod:string;note:string}[]=[];
 const source=(id:string)=>evidence.map(record).find(e=>e?.id===id);
 const finite=(v:unknown)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
 const periods=(e:Record<string,unknown>|undefined)=>Array.isArray(e?.periods)?e.periods.map(record).filter((p):p is Record<string,unknown>=>!!p):[];
 const ga4=source('ga4');
 if(ga4?.available===true){
  const p=periods(ga4),current=record(p.find(x=>x.name==='current')?.summary),previous=record(p.find(x=>x.name==='previous')?.summary);
  const total=(s:Record<string,unknown>|null)=>Array.isArray(s?.rows)?record(s.rows.find(v=>record(v)?.dimension==='total')):null;
  const c=total(current),b=total(previous),describe=(s:Record<string,unknown>|null)=>{const period=record(s?.period);return period?`${period.startDate} → ${period.endDate} · ${typeof s?.timeZone==='string'?s.timeZone:'timezone unavailable'}`:'Period unavailable';};
  for(const [metric,label,percentage] of [['sessions','Sessions',false],['engagementRate','Engagement rate',true],['keyEvents','Key events',false]] as const)rows.push({label,source:'GA4',current:finite(c?.[metric]),previous:finite(b?.[metric]),percentage,currentPeriod:describe(current),previousPeriod:describe(previous),note:metric==='keyEvents'?'Recorded key events are not verified qualified enquiries.':'ZINC host filter; source reporting periods.'});
 }
 const gsc=source('gsc');
 if(gsc?.available===true){
  const p=periods(gsc),current=p.find(x=>x.name==='current'),previous=p.find(x=>x.name==='previous');
  const total=(s:Record<string,unknown>|undefined)=>Array.isArray(s?.totals)?record(s.totals[0]):null;
  const c=total(current),b=total(previous),describe=(s:Record<string,unknown>|undefined)=>{const r=record(s?.range);return r?`${r.start} → ${r.end} · America/Los_Angeles`:'Period unavailable';};
  for(const [metric,label] of [['clicks','Search clicks'],['impressions','Search impressions']] as const)rows.push({label,source:'Search Console',current:finite(c?.[metric]),previous:finite(b?.[metric]),percentage:false,currentPeriod:describe(current),previousPeriod:describe(previous),note:'Final web-search data; source aggregation and privacy filtering apply.'});
 }
 return rows;
}
export function sparklineSegments(series:readonly {date:string;value:number}[],start:string,end:string){
 const begin=Date.parse(start+'T12:00:00Z'),finish=Date.parse(end+'T12:00:00Z');if(!Number.isFinite(begin)||!Number.isFinite(finish)||finish<begin)return [];
 const rows=series.filter(p=>calendarDay(p.date)&&typeof p.value==='number'&&Number.isFinite(p.value)&&p.value>=0&&Date.parse(p.date+'T12:00:00Z')>=begin&&Date.parse(p.date+'T12:00:00Z')<=finish).sort((a,b)=>a.date.localeCompare(b.date));
 const maximum=Math.max(1,...rows.map(p=>p.value));const segments:{date:string;value:number;x:number;y:number}[][]=[];let previous=0;
 for(const row of rows){const time=Date.parse(row.date+'T12:00:00Z');if(time===previous)continue;if(!segments.length||time-previous!==86400000)segments.push([]);segments.at(-1)!.push({...row,x:4+(finish===begin?.5:(time-begin)/(finish-begin))*112,y:30-row.value/maximum*26});previous=time;}
 return segments;
}
export function pagePerformanceEvidence(evidence:readonly unknown[]):PagePerformance|null{
 const data=evidence.map(record).find(e=>e?.id==='page-performance');if(!data||typeof data.available!=='boolean'||!Array.isArray(data.pages)||data.pages.length>300||!Array.isArray(data.pillars)||data.pillars.length>30||!record(data.range)||!record(data.sources)||!Array.isArray(data.notes))return null;
 const metric=(v:unknown)=>v===null||typeof v==='number'&&Number.isFinite(v)&&v>=0;
 const sources=record(data.sources)!;if(!record(sources.ga4)||!record(sources.gsc)||typeof record(sources.ga4)!.available!=='boolean'||typeof record(sources.gsc)!.available!=='boolean')return null;
 const range=record(data.range)!;for(const key of ['current','previous']){const r=record(range[key]);if(!r||!calendarDay(r.start)||!calendarDay(r.end)||r.start>r.end)return null;}
 if(data.notes.some(n=>typeof n!=='string'))return null;
 const paths=new Set<string>();
 for(const value of data.pages){const p=record(value);if(!p||!publicPath(p.path)||paths.has(p.path)||typeof p.title!=='string'||!['blog','service'].includes(String(p.kind))||!Array.isArray(p.pillars)||p.pillars.some(s=>typeof s!=='string')||!record(p.current)||!record(p.previous)||!record(p.series))return null;paths.add(p.path);for(const period of ['current','previous'])for(const key of ['views','engagementSeconds','clicks','impressions'])if(!metric(record(p[period])![key]))return null;const series=record(p.series)!;for(const source of ['ga4','gsc']){const points=series[source];if(!Array.isArray(points)||points.length>10000)return null;for(const point of points){const v=record(point);if(!v||!calendarDay(v.date))return null;for(const m of source==='ga4'?['views','engagementSeconds']:['clicks','impressions'])if(typeof v[m]!=='number'||!metric(v[m]))return null;}}if(p.serviceReferrals){const r=record(p.serviceReferrals);if(!r||!metric(r.current)||!metric(r.previous))return null;}}
 for(const value of data.pillars){const p=record(value);if(!p||typeof p.slug!=='string'||!/^[a-z0-9-]+$/.test(p.slug)||typeof p.title!=='string'||!publicPath(p.servicePath)||!Array.isArray(p.articlePaths)||p.articlePaths.some(v=>!publicPath(v)))return null;if(p.serviceReferrals!==undefined){const r=record(p.serviceReferrals);if(!r||!metric(r.current)||!metric(r.previous))return null;}}
 if(data.transitions!==undefined){if(!Array.isArray(data.transitions)||data.transitions.length>10000)return null;for(const value of data.transitions){const t=record(value);if(!t||!publicPath(t.articlePath)||!paths.has(t.articlePath)||!publicPath(t.servicePath)||!paths.has(t.servicePath)||!metric(t.current)||!metric(t.previous))return null;}}
 return data as PagePerformance;
}
export function compareSnapshots(current:ScoreSnapshot,previous?:ScoreSnapshot):SnapshotComparison{
 const unavailable=(reason:string):SnapshotComparison=>({available:false,reason,commonPages:0,meanDelta:null,improved:null,worsened:null,unchanged:null,pageDeltas:[]});
 if(!previous)return unavailable('This is the first recorded baseline.');
 if(current.scoringVersion!==previous.scoringVersion)return unavailable('The scoring method changed; these snapshots are not comparable.');
 const before=new Map(previous.pages.filter(p=>p.score!==null).map(p=>[p.path,p.score!]));
 const pageDeltas=current.pages.flatMap(p=>p.score!==null&&before.has(p.path)?[{path:p.path,before:before.get(p.path)!,after:p.score,delta:p.score-before.get(p.path)!}]:[]);
 if(!pageDeltas.length)return unavailable('No scored pages are shared by these snapshots.');
 return {available:true,reason:'Matching scored pages using the same checklist version.',commonPages:pageDeltas.length,meanDelta:Math.round(pageDeltas.reduce((s,p)=>s+p.delta,0)/pageDeltas.length*10)/10,improved:pageDeltas.filter(p=>p.delta>0).length,worsened:pageDeltas.filter(p=>p.delta<0).length,unchanged:pageDeltas.filter(p=>p.delta===0).length,pageDeltas};
}
/** Cache read guard: malformed scores cannot become a gauge or an invented historical point. */
export function parseScoreSnapshot(value:unknown):ScoreSnapshot|null{
 const v=record(value);if(!v||typeof v.scoringVersion!=='string'||!v.scoringVersion||!Array.isArray(v.pages)||v.pages.length>300||!Array.isArray(v.categories)||v.categories.length>30)return null;
 if(!['total','scored','blocked','excluded','unavailable'].every(k=>count(v[k]))||v.total!==v.pages.length||(v.mean!==null&&!score(v.mean)))return null;
 const paths=new Set<string>();
 for(const p of v.pages){const row=record(p);if(!row||!publicPath(row.path)||paths.has(row.path)||(row.score!==null&&!score(row.score))||typeof row.grade!=='string'||!count(row.failed)||!count(row.warnings))return null;paths.add(row.path);}
 const rows=v.pages as PageScore[];if(v.scored!==rows.filter(p=>p.score!==null).length||v.blocked!==rows.filter(p=>p.grade==='blocked').length||v.excluded!==rows.filter(p=>p.grade==='excluded').length||Number(v.scored)+Number(v.blocked)+Number(v.excluded)+Number(v.unavailable)!==v.total)return null;
 const categoryNames=new Set<string>();for(const c of v.categories){const row=record(c);if(!row||typeof row.name!=='string'||categoryNames.has(row.name)||!score(row.score)||typeof row.points!=='number'||!Number.isFinite(row.points)||typeof row.maxPoints!=='number'||!Number.isFinite(row.maxPoints)||row.points<0||row.maxPoints<=0||row.points>row.maxPoints||!count(row.pages)||row.pages<1||row.pages>Number(v.scored)||Math.round(row.points/row.maxPoints*1000)/10!==row.score)return null;categoryNames.add(row.name);}
 const expected=rows.filter(p=>p.score!==null);if(expected.length?(Math.round(expected.reduce((s,p)=>s+p.score!,0)/expected.length*10)/10)!==v.mean:v.mean!==null)return null;
 return v as ScoreSnapshot;
}
