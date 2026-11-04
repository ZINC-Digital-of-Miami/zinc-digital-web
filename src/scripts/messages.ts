import {trackRfp} from '../lib/rfp-tracking';

export function initMessages(){
 for(const form of document.querySelectorAll<HTMLFormElement>('[data-message-form]')){
  if(form.dataset.initialized)continue;
  form.dataset.initialized='true';
  form.addEventListener('submit',async event=>{
   event.preventDefault();
   if(form.dataset.sending || form.dataset.sent || !form.reportValidity())return;
   const button=form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
   const error=form.querySelector<HTMLElement>('[data-message-error]')!;
   const success=form.querySelector<HTMLElement>('[data-message-success]')!;
   const fields=Object.fromEntries(new FormData(form));
   form.dataset.sending='true';form.setAttribute('aria-busy','true');button.disabled=true;error.textContent='';
   try{
    const response=await fetch('/api/inquiries/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(fields)});
    const result=await response.json().catch(()=>null);
    if(!response.ok || result?.ok!==true)throw new Error(response.status===403?'Website messages are accepted from US connections only.':response.status===429?'Too many messages from this connection. Please try again later.':result?.error || 'Your message could not be saved. Please try again.');
    if(result.message===true)trackRfp(fields.intent==='content_question'?'content_question_sent':'contact_message_sent',{contact_method:'message'},window.gtag,window.clarity);
    form.dataset.sent='true';
    success.textContent=fields.intent==='content_question'?'Your question has been received for Wendy.':'Your message has been received for Jaymie.';
    success.hidden=false;button.textContent='Message received';
    for(const input of form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea'))input.disabled=true;
   }catch(e){error.textContent=e instanceof Error?e.message:'Your message could not be sent. Please try again.';button.disabled=false;}
   finally{delete form.dataset.sending;form.removeAttribute('aria-busy');}
  });
 }
 for(const dialog of document.querySelectorAll<HTMLDialogElement>('[data-message-dialog]')){
  if(dialog.dataset.initialized || typeof dialog.showModal!=='function')continue;
  dialog.dataset.initialized='true';
  let opener:HTMLElement|null=null,previousOverflow='';
  document.addEventListener('click',event=>{
   const trigger=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('[data-message-open]'):null;
   if(!trigger || trigger.dataset.messageOpen!==dialog.dataset.messageDialog || event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   // Never stack this drawer on another open dialog. The mobile menu closes before bubbling here.
   if(document.querySelector('dialog[open]'))return;
   event.preventDefault();opener=trigger.closest('#mobileMenu')?document.getElementById('mobileMenuToggle'):trigger;previousOverflow=document.documentElement.style.overflow;
   dialog.showModal();document.documentElement.style.overflow='hidden';
   dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus({preventScroll:true});
  });
  dialog.querySelector('[data-message-close]')?.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{if(dialog.open)return;document.documentElement.style.overflow=previousOverflow;opener?.focus({preventScroll:true});});
 }
}
