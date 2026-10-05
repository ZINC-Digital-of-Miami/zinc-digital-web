import {post} from './shell';
async function connectionState(){
 const region=document.querySelector('[data-google-connection]');if(!region?.querySelector('[data-google-account]'))return;
 try{
  const res=await fetch('/api/admin/google/'),data=await res.json();if(!res.ok)throw new Error(data.error);
  for(const kind of ['ga4','gsc']){
   const status=region.querySelector<HTMLElement>('[data-kind="'+kind+'"] [data-google-result]')!;
   status.textContent=data[kind].connected?'Connected · verified with Google.':data[kind].error||(kind==='gsc'?'Choose and verify your property after granting access.':'Grant access in Google, then verify this connection.');
  }
  const select=region.querySelector<HTMLSelectElement>('[name=site]');
  if(select)for(const site of data.sites)if(!Array.from(select.options).some(o=>o.value===site))select.add(new Option(site,site));
 }catch(e){region.querySelector<HTMLElement>('[data-google-status]')!.textContent=(e as Error).message;}
}
void connectionState();
document.addEventListener('admin:refresh',()=>void connectionState());
document.addEventListener('click',async e=>{
 const button=(e.target as Element).closest<HTMLButtonElement>('[data-copy-google-account],[data-google-discover]');if(!button)return;
 const region=button.closest('[data-google-connection]')!,status=region.querySelector<HTMLElement>('[data-google-status]')!;
 try{
  if(button.hasAttribute('data-copy-google-account')){
   const email=region.querySelector<HTMLInputElement>('[data-google-account]')!.value;
   await navigator.clipboard.writeText(email);status.textContent='Website account address copied.';
  }else{
   button.disabled=true;status.textContent='Checking your Google access…';
   const res=await fetch('/api/admin/google/'),data=await res.json();if(!res.ok)throw new Error(data.error);
   const select=region.querySelector<HTMLSelectElement>('[name=site]')!;select.replaceChildren();
   const blank=new Option('Choose your property','');select.add(blank);
   for(const site of data.sites)select.add(new Option(site,site));
   select.value=data.settings.site;
   status.textContent=data.sites.length?'Choose a property, then verify and save the connection.':'No ZINC property is accessible yet. Add the website account in Search Console, then check again.';
  }
 }catch(e){status.textContent=(e as Error).message;}finally{button.disabled=false;}
});
document.addEventListener('submit',async e=>{
 const form=e.target as HTMLFormElement;if(!form.matches('[data-google-form]'))return;e.preventDefault();
 const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!,status=form.querySelector<HTMLElement>('[data-google-result]')!;
 button.disabled=true;status.textContent='Checking Google…';
 try{
  const values=Object.fromEntries(new FormData(form));await post('/api/admin/google/',{kind:form.dataset.kind,...values});
  delete form.dataset.dirty;status.textContent='Connected · verified with Google. Reports will use this property.';
 }catch(e){status.textContent=(e as Error).message;}finally{button.disabled=false;}
});
