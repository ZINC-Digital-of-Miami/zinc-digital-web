import {post,openDialog} from './shell';
import {events} from '../../lib/research/sse';
const syncSourceFields=(form:HTMLFormElement)=>{
 const kind=form.querySelector<HTMLSelectElement>('[data-source-kind]');if(!kind)return;
 for(const label of form.querySelectorAll<HTMLElement>('[data-source-field]'))label.hidden=label.dataset.sourceField!==kind.value;
};
document.addEventListener('change',e=>{
 const field=e.target as HTMLSelectElement;
 if(field.matches('[data-source-kind]')&&field.form)syncSourceFields(field.form);
 if(field.matches('[data-chat-select]'))location.assign('/admin/research/?'+new URLSearchParams({project:field.dataset.project!,chat:field.value}));
});
document.addEventListener('reset',e=>{const form=e.target as HTMLFormElement;if(form.matches('[data-source-form]'))queueMicrotask(()=>syncSourceFields(form));});
document.addEventListener('input',e=>{const field=e.target as HTMLInputElement;const form=field.closest('[data-source-form]');if(form)(form as HTMLElement).dataset.dirty='true';});
document.addEventListener('click',async e=>{
 const button=(e.target as Element).closest<HTMLElement>('[data-source-id]');if(!button)return;
 const dialog=document.getElementById('source-detail') as HTMLDialogElement,host=dialog.querySelector('[data-source-detail]')!;
 openDialog(dialog,button);host.textContent='Loading…';
 try{const res=await fetch('/api/admin/research/source/?id='+encodeURIComponent(button.dataset.sourceId!)),data=await res.json();if(!res.ok)throw new Error(data.error);
  host.replaceChildren();const title=document.createElement('h3');title.textContent=data.source.title;const meta=document.createElement('p');meta.className='a-count';meta.textContent=data.source.kind+' · '+data.source.status;
  const body=document.createElement('pre');body.style.whiteSpace='pre-wrap';body.style.overflowWrap='anywhere';body.textContent=data.source.content||data.source.meta?.error||'The source has not finished processing.';host.append(title,meta,body);
  if(data.download){const link=document.createElement('a');link.href=data.download;link.textContent='Download source file';link.className='a-link';host.prepend(link);}
 }catch(e){host.textContent=(e as Error).message;}
});
document.addEventListener('submit',async e=>{
 const form=e.target as HTMLFormElement;
 if(form.matches('[data-source-form]')){
  e.preventDefault();const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!,error=form.querySelector<HTMLElement>('[data-form-error]')!,status=form.querySelector<HTMLElement>('[data-source-progress]')!;
  error.hidden=true;button.disabled=true;
  try{
   const values=new FormData(form),body:Record<string,unknown>={project_id:form.dataset.project};for(const [key,value]of values)if(key!=='file')body[key]=value;
   if(body.kind==='file'){
    const file=values.get('file') as File;if(!file?.size||file.size>10485760)throw new Error('Choose a file up to 10 MB.');
    status.textContent='Preparing private upload…';const signed=await post('/api/admin/research/upload-url/',{project_id:body.project_id,name:file.name,size:file.size,type:file.type});
    status.textContent='Uploading…';const uploaded=await fetch(signed.url,{method:'PUT',headers:{'content-type':signed.type},body:file});if(!uploaded.ok)throw new Error('The private upload failed. Try again.');
    Object.assign(body,{path:signed.path,name:file.name,size:file.size,type:signed.type});
   }
   status.textContent='Processing and saving source…';await post('/api/admin/research/ingest/',body);delete form.dataset.dirty;location.reload();
  }catch(e){error.textContent=(e as Error).message;error.hidden=false;status.textContent='';}finally{button.disabled=false;}
 }
 if(form.matches('[data-chat-form]')){
  e.preventDefault();if(form.dataset.chatSending)return;
  const error=form.querySelector<HTMLElement>('[data-chat-error]')!,question=form.querySelector<HTMLTextAreaElement>('[name=text]')!,model=form.querySelector<HTMLSelectElement>('[name=model]')!,button=form.querySelector<HTMLButtonElement>('button[type=submit]')!,log=document.querySelector<HTMLElement>('[data-chat-log]')!;
  const text=question.value.trim();if(!text)return;error.hidden=true;form.dataset.chatSending='true';button.disabled=true;model.disabled=true;question.disabled=true;
  const user=document.createElement('article');user.className='a-message';user.dataset.role='user';user.textContent=text;
  const assistant=document.createElement('article');assistant.className='a-message';assistant.textContent='Starting…';log.append(user,assistant);log.scrollTop=log.scrollHeight;let content='';
  try{
   const res=await fetch('/api/admin/research/chat/',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({project_id:form.dataset.project,chat_id:form.dataset.chat||null,text,model:model.value})});
   if(!res.ok||!res.body){const data=await res.json();throw new Error(data.error||'The chat could not be reached.');}
   let done=false;
   for await(const frame of events(res.body)){
    if(frame.chat_id){form.dataset.chat=frame.chat_id;const url=new URL(location.href);url.searchParams.set('chat',frame.chat_id);history.replaceState(null,'',url);}
    if(frame.delta){content+=frame.delta;assistant.textContent=content;log.scrollTop=log.scrollHeight;}
    if(frame.done||frame.error){done=true;assistant.textContent=frame.content||content;const chips=document.createElement('div');chips.className='a-actions a-section';for(const source of frame.sources||[]){const chip=document.createElement('button');chip.className='a-chip';chip.type='button';chip.dataset.sourceId=source.document_id;chip.textContent='['+source.n+'] '+source.title;chips.append(chip);}assistant.append(chips);if(frame.error)throw new Error(frame.error);}
   }
   if(!done)throw new Error('The answer stream ended early. Refresh to check its saved state.');question.value='';
  }catch(e){error.textContent=(e as Error).message;error.hidden=false;assistant.dataset.status='error';}
  finally{delete form.dataset.chatSending;button.disabled=false;model.disabled=false;question.disabled=false;question.focus();}
 }
});
document.addEventListener('keydown',e=>{const field=e.target as HTMLTextAreaElement;if(field.matches('[data-chat-form] [name=text]')&&(e.metaKey||e.ctrlKey)&&e.key==='Enter'){e.preventDefault();field.form?.requestSubmit();}});
