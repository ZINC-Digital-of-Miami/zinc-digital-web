export {};
const root=document.querySelector<HTMLElement>('[data-seo-review]');
const button=root?.querySelector<HTMLButtonElement>('[data-run-review]');
const status=root?.querySelector<HTMLElement>('[data-review-status]');
const requestId=crypto.randomUUID();
button?.addEventListener('click',async()=>{
 if(!status||button.disabled)return;
 button.disabled=true;root?.setAttribute('aria-busy','true');
 status.textContent='Reading ZINC pages and Google evidence, then reviewing with Opus 5.5 High. This can take a few minutes.';
 try{
  const res=await fetch('/api/admin/seo-review/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({requestId})});
  const data=await res.json();if(!res.ok)throw new Error(data.error||'The review could not be completed.');
  const url=new URL(location.href);url.searchParams.set('review',data.key);url.hash='weekly-review';location.assign(url);
 }catch(e){status.textContent=e instanceof Error?e.message:'The connection was interrupted. Refresh to inspect the saved review before retrying.';button.disabled=false;}
 finally{root?.removeAttribute('aria-busy');}
});
