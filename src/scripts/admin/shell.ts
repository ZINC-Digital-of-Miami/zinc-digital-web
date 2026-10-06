let undo: (()=>Promise<void>) | undefined;
let timer: ReturnType<typeof setTimeout>;
let lastFocus: HTMLElement|null=null;
const confirmAction=(message:string,action='Discard changes',cancel='Keep editing')=>new Promise<boolean>(resolve=>{
  const dialog=document.querySelector<HTMLDialogElement>('[data-confirm-dialog]')!;
  if(dialog.open){resolve(false);return;}
  const previous=document.activeElement as HTMLElement|null;
  dialog.querySelector('[data-confirm-message]')!.textContent=message;
  dialog.querySelector('[value=continue]')!.textContent=action;
  dialog.querySelector('[value=cancel]')!.textContent=cancel;
  dialog.returnValue='';
  dialog.addEventListener('close',()=>{previous?.focus();resolve(dialog.returnValue==='continue');},{once:true});
  dialog.showModal();
  dialog.querySelector<HTMLButtonElement>('[value=cancel]')!.focus();
});
export function openDialog(dialog:HTMLDialogElement,trigger:HTMLElement){lastFocus=trigger;dialog.showModal();}
const placeToast=()=>{
  const host=document.querySelector<HTMLElement>('[data-toast]');
  if(host)(document.querySelector<HTMLDialogElement>('dialog[open]')||document.body).append(host);
};
const applyListFilters=()=>{
  const term=document.querySelector<HTMLInputElement>('[data-list-search]')?.value.trim().toLowerCase()||'';
  const filter=document.querySelector<HTMLSelectElement>('[data-list-filter]')?.value||'';
  for(const row of document.querySelectorAll<HTMLElement>('[data-search-row]'))row.hidden=!row.dataset.searchRow!.includes(term)||(filter!==''&&row.dataset.status!==filter&&row.dataset.layer!==filter);
  const rows=[...document.querySelectorAll<HTMLElement>('[data-search-row]')];
  const visible=rows.filter(row=>!row.hidden).length;
  const results=document.querySelector<HTMLElement>('[data-list-results]');
  if(results)results.textContent=`${visible} of ${rows.length} results`;
  const empty=document.querySelector<HTMLElement>('[data-list-empty]');
  if(empty){empty.hidden=visible>0;if(!visible)empty.textContent=term||filter?'No results match your search or status. Clear the filters to see all items.':'No content found.';}
};
const toast=(text:string,action?:()=>Promise<void>)=>{
  const host=document.querySelector<HTMLElement>('[data-toast]')!;
  host.querySelector('[data-toast-text]')!.textContent=text;host.hidden=false;
  (host.querySelector('[data-toast-undo]') as HTMLElement).hidden=!action;undo=action;
  placeToast(); // A modal makes controls outside it inert, including Undo.
  clearTimeout(timer);timer=setTimeout(()=>{if(!host.contains(document.activeElement))host.hidden=true;},8000);
};
export async function post(endpoint:string,body:unknown){
  const res=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  const data=await res.json().catch(()=>({error:'The server could not be reached. Try again.'}));
  if(!res.ok)throw new Error(data.error||'The change could not be saved.');return data;
}
let refreshing=false;
async function refresh(){
  if(refreshing||document.querySelector('[data-dirty]'))return;refreshing=true;
  try{
    const res=await fetch(location.href,{headers:{'x-admin-refresh':'1'}});if(res.redirected){location.assign(res.url);return;}if(!res.ok)throw new Error('The view could not be refreshed.');
    const next=new DOMParser().parseFromString(await res.text(),'text/html').querySelector('[data-admin-region]');
    if(!next)throw new Error('The view could not be refreshed.');
    // Input may have changed while the request was in flight. Never replace a draft.
    if(document.querySelector('[data-dirty]'))return;
    const open=document.querySelector<HTMLDialogElement>('dialog[open]');const id=open?.id;
    const active=(document.activeElement as HTMLInputElement|null)?.name;
    const trigger=lastFocus?.dataset.openDialog;
    const search=document.querySelector<HTMLInputElement>('[data-list-search]');
    const filter=document.querySelector<HTMLSelectElement>('[data-list-filter]');
    const listState={search:search?.value||'',filter:filter?.value||'',focus:document.activeElement===search?'search':document.activeElement===filter?'filter':''};
    const toastHost=document.querySelector<HTMLElement>('[data-toast]');if(toastHost)document.body.append(toastHost);
    open?.close();document.querySelector('[data-admin-region]')!.replaceWith(document.importNode(next,true));
    const restoredSearch=document.querySelector<HTMLInputElement>('[data-list-search]');if(restoredSearch)restoredSearch.value=listState.search;
    const restoredFilter=document.querySelector<HTMLSelectElement>('[data-list-filter]');if(restoredFilter)restoredFilter.value=listState.filter;
    applyListFilters();
    if(id){const restored=document.getElementById(id) as HTMLDialogElement|null;restored?.showModal();if(active)(restored?.querySelector('[name="'+active+'"]') as HTMLElement|null)?.focus();}
    else if(listState.focus)(listState.focus==='search'?restoredSearch:restoredFilter)?.focus();
    if(trigger)lastFocus=document.querySelector<HTMLElement>('[data-open-dialog="'+CSS.escape(trigger)+'"]');
    placeToast();
    document.dispatchEvent(new Event('admin:refresh'));
  }catch(e){toast(e instanceof Error?e.message:'Refresh failed.');}finally{refreshing=false;}
}
const close=async(dialog:HTMLDialogElement)=>{
  if(dialog.querySelector('[data-dirty]')&&!await confirmAction('Discard the changes you have not saved?'))return;
  for(const form of dialog.querySelectorAll<HTMLFormElement>('form[data-dirty]')){form.reset();delete form.dataset.dirty;}
  dialog.close();lastFocus?.focus();
  placeToast();
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
    if(target.dataset.confirm&&!await confirmAction(target.dataset.confirm,target.textContent?.trim()||'Confirm','Cancel'))return;
    target.setAttribute('disabled','');try{
      const body=JSON.parse(target.dataset.body||'{}');await post(target.dataset.endpoint,body);
      const reversible=body.archived===true?()=>post(target.dataset.endpoint!,{id:body.id,archived:false}):undefined;
      toast(target.dataset.success||'Saved.',reversible);await refresh();
    }catch(e){toast((e as Error).message);}finally{target.removeAttribute('disabled');}
  }
});
document.addEventListener('cancel',e=>{if((e.target as Element).matches('[data-confirm-dialog]'))return;e.preventDefault();void close(e.target as HTMLDialogElement);},true);
document.addEventListener('click',async e=>{
  const anchor=(e.target as Element).closest<HTMLAnchorElement>('a[href]');
  if(e.defaultPrevented||!anchor||anchor.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||anchor.hash&&anchor.pathname===location.pathname&&anchor.search===location.search||!document.querySelector('[data-dirty]'))return;
  e.preventDefault();if(await confirmAction('Leave this page and discard the changes you have not saved?','Discard and leave')){document.querySelectorAll('[data-dirty]').forEach(form=>form.removeAttribute('data-dirty'));location.assign(anchor.href);}
});
window.addEventListener('beforeunload',e=>{if(document.querySelector('[data-dirty]')){e.preventDefault();e.returnValue='';}});
document.addEventListener('input',e=>{
  const field=e.target as HTMLInputElement;const form=field.closest<HTMLFormElement>('[data-admin-form],[data-google-form]');
  if(form)form.dataset.dirty='true';
  const counter=form?.querySelector('[data-counter="'+field.name+'"]');if(counter)counter.textContent=(field.value.length+(field.name==='meta_title'?7:0))+' / '+(field.name==='meta_title'?60:160);
  if(field.matches('[data-seo-title]')){const preview=document.querySelector('[data-search-title]');if(preview)preview.textContent=field.value+' | ZINC';}
  if(field.matches('[data-seo-description]')){const preview=document.querySelector('[data-search-description]');if(preview)preview.textContent=field.value;}
  if(field.matches('[data-list-search]')){
    applyListFilters();
  }
});
document.addEventListener('change',e=>{
 const field=e.target as HTMLSelectElement;
 if(!field.matches('[data-list-filter]'))return;
 applyListFilters();
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
const idleRefresh=()=>{if(document.visibilityState==='visible'&&!document.querySelector('[data-dirty],dialog[open]')&&!document.querySelector('[data-chat-sending]')&&!document.querySelector<HTMLTextAreaElement>('[data-chat-form] [name=text]')?.value.trim())void refresh();};
window.addEventListener('focus',idleRefresh);setInterval(idleRefresh,60000);

// A compact mobile shell keeps the current task above the fold; no-JS keeps all navigation visible.
const adminMenu=document.querySelector<HTMLButtonElement>('[data-admin-menu-toggle]');
const adminSide=document.querySelector<HTMLElement>('.a-side');
if(adminMenu&&adminSide){
 const mobile=matchMedia('(max-width:760px)');
 const setMenu=(expanded:boolean)=>{adminSide.classList.toggle('is-collapsed',!expanded);adminMenu.setAttribute('aria-expanded',String(expanded));};
 setMenu(!mobile.matches);
 mobile.addEventListener('change',e=>setMenu(!e.matches));
 adminMenu.addEventListener('click',()=>setMenu(adminMenu.getAttribute('aria-expanded')!=='true'));
}
