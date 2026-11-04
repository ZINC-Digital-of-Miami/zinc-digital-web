/** Preserve calendar spacing. A date absent from Google's report is unreported, not an invented zero. */
export function metricSeries(rows:{date:string;sessions:number}[],range:{start:string;end:string}){
 const values=new Map(rows.map(row=>[row.date.replace(/-/g,''),row.sessions]));
 const first=Date.parse(range.start+'T00:00:00Z'),last=Date.parse(range.end+'T00:00:00Z');
 if(!Number.isFinite(first)||!Number.isFinite(last)||last<first||last-first>366*86400000)throw new Error('The reporting period is invalid.');
 const series:{date:string;sessions:number|null}[]=[];
 for(let day=first;day<=last;day+=86400000){
  const date=new Date(day).toISOString().slice(0,10),value=values.get(date.replace(/-/g,''));
  series.push({date,sessions:typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null});
 }
 return series;
}
