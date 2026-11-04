import {initForm} from './page';
export function initProposalDrawer(){
 const dialog=document.querySelector<HTMLDialogElement>('[data-proposal-drawer]');
 const trigger=document.querySelector<HTMLAnchorElement>('[data-proposal-open]');
 if(!dialog||!trigger||typeof dialog.showModal!=='function'||dialog.dataset.initialized)return;
 dialog.dataset.initialized='true';
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
 dialog.id='proposal-drawer';trigger.setAttribute('aria-controls',dialog.id);
 let previousOverflow='';
 trigger.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  if(dialog.open){event.preventDefault();return;}
  event.preventDefault();previousOverflow=document.documentElement.style.overflow;
  dialog.showModal();document.documentElement.style.overflow='hidden';trigger.setAttribute('aria-expanded','true');
  initForm(dialog.querySelector<HTMLFormElement>('[data-inquiry-form]'));
  dialog.querySelector<HTMLInputElement>('[data-step]:not([hidden]) input')?.focus({preventScroll:true});
 });
 dialog.querySelector('[data-proposal-close]')?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{if(dialog.open)return;document.documentElement.style.overflow=previousOverflow;trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});});
}
