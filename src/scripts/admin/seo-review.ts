export {};
let running=false;
const requestIds=new WeakMap<HTMLButtonElement,string>();
// The admin shell replaces this region on focus and every minute. Delegate to the current controls.
document.addEventListener('click',async event=>{
 const button=event.target instanceof Element?event.target.closest<HTMLButtonElement>('[data-run-scan],[data-run-review]'):null;
 const root=button?.closest<HTMLElement>('[data-seo-review]');
 const status=root?.querySelector<HTMLElement>('[data-review-status]');
 if(!button||!root||!status||button.disabled||running)return;
 const mode=button.hasAttribute('data-run-scan')?'scan':'review';
 const requestId=requestIds.get(button)||crypto.randomUUID();requestIds.set(button,requestId);
 const controls=[...root.querySelectorAll<HTMLButtonElement>('[data-run-scan],[data-run-review]')];
 const originalDisabled=new Map(controls.map(control=>[control,control.disabled]));
 running=true;controls.forEach(control=>control.disabled=true);root.setAttribute('aria-busy','true');root.dataset.seoActive='true';
 status.textContent=mode==='scan'?'Refreshing rendered-page checks and native Google evidence. No Claude tokens are used.':'Reading ZINC evidence, then reviewing with Opus 5.5 High. This can take several minutes.';
 try{
  const res=await fetch('/api/admin/seo-review/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({requestId,mode})});
  const data=await res.json();if(!res.ok)throw new Error(data.error||'The analysis could not be completed.');
  const url=new URL('/admin/analysis/',location.origin);url.searchParams.set('review',data.key);url.hash='weekly-review';location.assign(url);
 }catch(e){status.textContent=e instanceof Error?e.message:'The connection was interrupted. Refresh to inspect the saved analysis before retrying.';controls.forEach(control=>control.disabled=originalDisabled.get(control)||false);}
 finally{running=false;root.removeAttribute('aria-busy');delete root.dataset.seoActive;}
});
