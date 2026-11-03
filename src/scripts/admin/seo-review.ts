export {};
const root=document.querySelector<HTMLElement>('[data-seo-review]');
const status=root?.querySelector<HTMLElement>('[data-review-status]');
const controls=[...root?.querySelectorAll<HTMLButtonElement>('[data-run-scan],[data-run-review]')||[]];
const originalDisabled=new Map(controls.map(button=>[button,button.disabled]));
for(const button of controls){
 const mode=button.hasAttribute('data-run-scan')?'scan':'review',requestId=crypto.randomUUID();
 button.addEventListener('click',async()=>{
  if(!status||button.disabled)return;
  controls.forEach(control=>control.disabled=true);root?.setAttribute('aria-busy','true');
  status.textContent=mode==='scan'?'Refreshing rendered-page checks and native Google evidence. No Claude tokens are used.':'Reading ZINC evidence, then reviewing with Opus 5.5 High. This can take several minutes.';
  try{
   const res=await fetch('/api/admin/seo-review/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({requestId,mode})});
   const data=await res.json();if(!res.ok)throw new Error(data.error||'The analysis could not be completed.');
   const url=new URL('/admin/analysis/',location.origin);url.searchParams.set('review',data.key);url.hash='weekly-review';location.assign(url);
  }catch(e){status.textContent=e instanceof Error?e.message:'The connection was interrupted. Refresh to inspect the saved analysis before retrying.';controls.forEach(control=>control.disabled=originalDisabled.get(control)||false);}
  finally{root?.removeAttribute('aria-busy');}
 });
}
