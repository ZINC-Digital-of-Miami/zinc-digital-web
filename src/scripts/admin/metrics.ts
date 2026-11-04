import {metricSeries} from '../../lib/metric-series';
async function load(){
 const region=document.querySelector('[data-google-metrics]');if(!region)return;
 const error=region.querySelector<HTMLElement>('[data-google-error]')!;
 try{
  const res=await fetch('/api/admin/metrics/'),data=await res.json();if(!res.ok)throw new Error(data.error);
  const set=(key:string,value:string)=>{for(const x of region.querySelectorAll('[data-metric="'+key+'"]'))x.textContent=value;};
  set('source',data.source?'GA4 property '+data.source.analyticsProperty+' · Reporting days: '+(data.source.analyticsTimeZone||'timezone unavailable')+' · Search Console: '+(data.source.searchConsoleProperty||'not connected')+' (Pacific time)':'Google property details unavailable.');
  set('sessions',data.sessions.toLocaleString());set('engagement',Math.round(data.engagement)+' s');set('clicks',data.clicks==null?'Unavailable':data.clicks.toLocaleString());set('period',data.range.start+' – '+data.range.end);set('updated',new Date(data.fetched_at).toLocaleString('en-US',{timeZone:'America/Chicago'})+' CT');
  const chart=region.querySelector('[data-series]');if(chart){
   chart.replaceChildren();const series=metricSeries(data.series,data.range),max=Math.max(1,...series.map(x=>x.sessions??0));
   for(const point of series){const bar=document.createElement('i');bar.style.height=point.sessions===null||point.sessions===0?'2px':(point.sessions/max*100)+'%';bar.dataset.missing=String(point.sessions===null);bar.title=point.date+': '+(point.sessions===null?'Not reported':point.sessions+' organic sessions');bar.setAttribute('aria-hidden','true');chart.append(bar);}
   let detail=region.querySelector('[data-series-values]');if(!detail){detail=document.createElement('details');detail.setAttribute('data-series-values','');chart.after(detail);}
   detail.replaceChildren();const summary=document.createElement('summary');summary.textContent='Daily values · gaps mean not reported';detail.append(summary);
   const table=document.createElement('table');table.className='a-series-table';const caption=document.createElement('caption');caption.textContent='Organic sessions by reporting date';table.append(caption);
   const head=document.createElement('tr');for(const label of ['Date','Organic sessions']){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}table.append(head);
   for(const point of series){const row=document.createElement('tr'),date=document.createElement('td'),value=document.createElement('td');date.textContent=point.date;value.textContent=point.sessions===null?'Not reported':point.sessions.toLocaleString();row.append(date,value);table.append(row);}detail.append(table);
  }
  const top=region.querySelector('[data-top-pages]');if(top){top.replaceChildren();for(const page of data.topPages){const li=document.createElement('li');li.className='a-actions';const path=document.createElement('span');path.textContent=page.path;const views=document.createElement('strong');views.textContent=page.views.toLocaleString()+' views';li.append(path,views);top.append(li);}if(!data.topPages.length){const empty=document.createElement('li');empty.textContent='No page views in this period.';top.append(empty);}}
  error.textContent=data.searchError||'';error.hidden=!data.searchError;
 }catch(e){for(const card of region.querySelectorAll('[data-metric]'))if(card.textContent?.startsWith('Loading'))card.textContent='Unavailable';region.querySelector('[data-series-values]')?.remove();for(const selector of ['[data-series]','[data-top-pages]']){const target=region.querySelector(selector);if(target){target.replaceChildren();const message=document.createElement(selector==='[data-top-pages]'?'li':'span');message.textContent='Data could not be loaded. Refresh to try again.';target.append(message);}}error.textContent=(e as Error).message;error.hidden=false;}
 const card=region.querySelector('[data-metric=indexed]');if(card){try{const res=await fetch('/api/admin/metrics/?kind=indexed'),data=await res.json();if(!res.ok)throw new Error(data.error);card.textContent=data.count+' / '+data.total;}catch{card.textContent='Unavailable';}}
}
void load();
document.addEventListener('admin:refresh',()=>void load());
