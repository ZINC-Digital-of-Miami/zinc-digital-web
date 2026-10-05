let undo: (()=>Promise<void>) | undefined;
let timer: ReturnType<typeof setTimeout>;
let lastFocus: HTMLElement|null=null;
const toast=(text:string,action?:()=>Promise<void>)=>{
  const host=document.querySelector<HTMLElement>('[data-toast]')!;
  host.querySelector('[data-toast-text]')!.textContent=text;host.hidden=false;
  (host.querySelector('[data-toast-undo]') as HTMLElement).hidden=!action;undo=action;
  clearTimeout(timer);timer=setTimeout(()=>{if(!host.contains(document.activeElement))host.hidden=true;},8000);
};
export async function post(endpoint:string,body:unknown){
  const res=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json().catch(()=>({error:'The server could not be reached. Try again.'}));
  if(!res.ok)throw new Error(data.error||'The change could not be saved.');return data;
}
let refreshing=false;
async function refresh(){
  if(refreshing)return;refreshing=true;
  const open=document.querySelector<HTMLDialogElement>('dialog[open]');const id=open?.id;
  const active=(document.activeElement as HTMLInputElement|null)?.name;
  try{
    const res=await fetch(location.href,{headers:{'x-admin-refresh':'1'}});if(res.redirected){location.assign(res.url);return;}if(!res.ok)throw new Error('The view could not be refreshed.');
    const next=new DOMParser().parseFromString(await res.text(),'text/html').querySelector('[data-admin-region]');
    if(!next)throw new Error('The view could not be refreshed.');
    open?.close();document.querySelector('[data-admin-region]')!.replaceWith(document.importNode(next,true));
    if(id){const restored=document.getElementById(id) as HTMLDialogElement|null;restored?.showModal();if(active)(restored?.querySelector('[name="'+active+'"]') as HTMLElement|null)?.focus();}
    document.dispatchEvent(new Event('admin:refresh'));
  }catch(e){toast(e instanceof Error?e.message:'Refresh failed.');}finally{refreshing=false;}
}
const close=(dialog:HTMLDialogElement)=>{
  if(dialog.querySelector('[data-dirty]')&&!confirm('Discard unsaved changes?'))return;
  dialog.close();lastFocus?.focus();
};
document.addEventListener('click',async e=>{
  const target=(e.target as Element).closest<HTMLElement>('button,[data-open-dialog]');if(!target)return;
  if(target.matches('[data-theme-toggle]')){
    const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;
    try{localStorage.setItem('zinc-theme',theme);}catch{}target.textContent=theme==='dark'?'Light mode':'Dark mode';
  }
  if(target.dataset.openDialog){lastFocus=target;(document.getElementById(target.dataset.openDialog) as HTMLDialogElement)?.showModal();}
  if(target.matches('[data-close-dialog]'))close(target.closest('dialog')!);
  if(target.matches('[data-toast-dismiss]'))(target.closest('[data-toast]') as HTMLElement).hidden=true;
  if(target.matches('[data-toast-undo]')&&undo){target.setAttribute('disabled','');try{await undo();toast('Restored.');await refresh();}catch(e){toast((e as Error).message);}finally{target.removeAttribute('disabled');}}
  if(target.dataset.endpoint){
    if(target.dataset.confirm&&!confirm(target.dataset.confirm))return;
    target.setAttribute('disabled','');try{
      const body=JSON.parse(target.dataset.body||'{}');await post(target.dataset.endpoint,body);
      const reversible=body.archived===true?()=>post(target.dataset.endpoint!,{id:body.id,archived:false}):undefined;
      toast(target.dataset.success||'Saved.',reversible);await refresh();
    }catch(e){toast((e as Error).message);}finally{target.removeAttribute('disabled');}
  }
});
document.addEventListener('cancel',e=>{e.preventDefault();close(e.target as HTMLDialogElement);},true);
document.addEventListener('input',e=>{
  const field=e.target as HTMLInputElement;const form=field.closest<HTMLFormElement>('[data-admin-form]');
  if(form)form.dataset.dirty='true';
  const counter=form?.querySelector('[data-counter="'+field.name+'"]');if(counter)counter.textContent=(field.value.length+(field.name==='meta_title'?7:0))+' / '+(field.name==='meta_title'?60:160);
  if(field.matches('[data-seo-title]')){const preview=document.querySelector('[data-search-title]');if(preview)preview.textContent=field.value+' | ZINC';}
  if(field.matches('[data-seo-description]')){const preview=document.querySelector('[data-search-description]');if(preview)preview.textContent=field.value;}
  if(field.matches('[data-list-search]')){
    const value=field.value.trim().toLowerCase();for(const row of document.querySelectorAll<HTMLElement>('[data-search-row]'))row.hidden=!row.dataset.searchRow!.includes(value);
  }
});
document.addEventListener('change',e=>{
 const field=e.target as HTMLSelectElement;
 if(!field.matches('[data-list-filter]'))return;
 for(const row of document.querySelectorAll<HTMLElement>('[data-search-row]')){
  const term=document.querySelector<HTMLInputElement>('[data-list-search]')?.value.trim().toLowerCase()||'';
  row.hidden=!row.dataset.searchRow!.includes(term)||(field.value!==''&&row.dataset.status!==field.value&&row.dataset.layer!==field.value);
 }
});
document.addEventListener('submit',async e=>{
  const form=e.target as HTMLFormElement;if(!form.matches('[data-admin-form]'))return;e.preventDefault();
  const error=form.querySelector<HTMLElement>('[data-form-error]')!;error.hidden=true;
  const buttons=form.querySelectorAll<HTMLButtonElement>('button[type=submit]');buttons.forEach(b=>b.disabled=true);
  try{
    const body=JSON.parse(form.dataset.body||'{}');for(const [name,value]of new FormData(form))body[name]=value;
    for(const check of form.querySelectorAll<HTMLInputElement>('input[type=checkbox]'))body[check.name]=check.checked;
    await post(form.dataset.endpoint!,body);delete form.dataset.dirty;toast('Saved.');await refresh();
  }catch(e){error.textContent=(e as Error).message;error.hidden=false;error.focus();}finally{buttons.forEach(b=>b.disabled=false);}
});
const theme=document.querySelector('[data-theme-toggle]');if(theme)theme.textContent=document.documentElement.dataset.theme==='dark'?'Light mode':'Dark mode';
const idleRefresh=()=>{if(document.visibilityState==='visible'&&!document.querySelector('[data-dirty],dialog[open]')&&!document.querySelector('[data-chat-sending]'))void refresh();};
window.addEventListener('focus',idleRefresh);setInterval(idleRefresh,60000);
