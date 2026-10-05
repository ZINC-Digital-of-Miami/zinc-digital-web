async function load(){
 const region=document.querySelector('[data-google-metrics]');if(!region)return;
 const error=region.querySelector<HTMLElement>('[data-google-error]')!;
 try{
  const res=await fetch('/api/admin/metrics/'),data=await res.json();if(!res.ok)throw new Error(data.error);
  const set=(key:string,value:string)=>{for(const x of region.querySelectorAll('[data-metric="'+key+'"]'))x.textContent=value;};
  set('sessions',data.sessions.toLocaleString());set('engagement',Math.round(data.engagement)+' s');set('clicks',data.clicks==null?'Unavailable':data.clicks.toLocaleString());set('period',data.range.start+' – '+data.range.end);set('updated',new Date(data.fetched_at).toLocaleString('en-US',{timeZone:'America/Chicago'})+' CT');
  const chart=region.querySelector('[data-series]');if(chart){chart.replaceChildren();const max=Math.max(1,...data.series.map((x:{sessions:number})=>x.sessions));for(const point of data.series){const bar=document.createElement('i');bar.style.height=(point.sessions/max*100)+'%';bar.title=point.date+': '+point.sessions+' organic sessions';chart.append(bar);}if(!data.series.length)chart.textContent='No organic sessions in this period.';}
  const top=region.querySelector('[data-top-pages]');if(top){top.replaceChildren();for(const page of data.topPages){const li=document.createElement('li');li.className='a-actions';const path=document.createElement('span');path.textContent=page.path;const views=document.createElement('strong');views.textContent=page.views.toLocaleString()+' views';li.append(path,views);top.append(li);}if(!data.topPages.length){const empty=document.createElement('li');empty.textContent='No page views in this period.';top.append(empty);}}
  error.textContent=data.searchError||'';error.hidden=!data.searchError;
 }catch(e){for(const card of region.querySelectorAll('[data-metric]'))if(card.textContent==='Loading…')card.textContent='Unavailable';error.textContent=(e as Error).message;error.hidden=false;}
 const card=region.querySelector('[data-metric=indexed]');if(card){try{const res=await fetch('/api/admin/metrics/?kind=indexed'),data=await res.json();if(!res.ok)throw new Error(data.error);card.textContent=data.count+' / '+data.total;}catch{card.textContent='Unavailable';}}
}
void load();
document.addEventListener('admin:refresh',()=>void load());
