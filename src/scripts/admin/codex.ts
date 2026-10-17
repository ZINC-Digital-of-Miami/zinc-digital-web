import {post} from './shell';
let checking=false,authWindow:Window|null=null,lastAuth='',pendingJob='';
async function check(){
 const card=document.querySelector<HTMLElement>('[data-codex-connection]');if(!card||checking||document.hidden)return;checking=true;
 try{
  const res=await fetch('/api/admin/codex/'+(pendingJob?'?id='+encodeURIComponent(pendingJob):'')),state=await res.json();if(!res.ok)throw new Error(state.error||'The Codex connection could not be checked.');
  const waiting=['queued','running'].includes(state.jobStatus);
  card.querySelector('[data-codex-status]')!.textContent=waiting&&state.jobStatus==='queued'?'Waiting for the Codex runner…':state.message;
  card.querySelector('[data-codex-verified]')!.textContent=state.verifiedAt?'Verified '+new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Chicago'}).format(new Date(state.verifiedAt))+' CT':state.online?'Runner online · subscription verification pending':'Runner offline';
  const button=card.querySelector<HTMLButtonElement>('[data-codex-connect]');if(button){button.textContent=state.ready?'Reconnect Codex':'Connect Codex';button.disabled=!state.online||waiting||['authenticating','verifying'].includes(state.status);}
  const verify=card.querySelector<HTMLButtonElement>('[data-codex-verify]');if(verify)verify.disabled=!state.online||waiting||['authenticating','verifying'].includes(state.status);
  const link=card.querySelector<HTMLAnchorElement>('[data-codex-auth]');
  if(link){link.hidden=!state.authUrl;if(state.authUrl){const url=new URL(state.authUrl);if(url.origin!=='https://auth.openai.com'||url.username||url.password)throw new Error('Codex returned an invalid sign-in address.');link.href=url.href;if(authWindow&&!authWindow.closed&&lastAuth!==url.href){authWindow.location.replace(url.href);lastAuth=url.href;}}}
  if(state.jobStatus==='failed'){pendingJob='';const error=card.querySelector<HTMLElement>('[data-codex-error]')!;error.textContent=state.jobError||'Codex could not connect. Retry sign-in.';error.hidden=false;}
  if(state.ready&&!waiting&&state.jobStatus!=='failed'){card.querySelector<HTMLElement>('[data-codex-error]')!.hidden=true;authWindow=null;lastAuth='';pendingJob='';}
 }catch(e){card.querySelector('[data-codex-status]')!.textContent=e instanceof Error?e.message:'Connection unavailable.';}
 finally{checking=false;}
}
document.addEventListener('click',async event=>{
 const button=(event.target as Element).closest<HTMLButtonElement>('[data-codex-connect],[data-codex-verify]');if(!button)return;
 const card=button.closest('[data-codex-connection]')!,error=card.querySelector<HTMLElement>('[data-codex-error]')!;error.hidden=true;button.disabled=true;
 const connect=button.matches('[data-codex-connect]');
 if(connect){authWindow=window.open('about:blank','_blank');if(authWindow){authWindow.opener=null;authWindow.document.body.textContent='Preparing Codex subscription sign-in…';}}
 try{const job=await post('/api/admin/codex/',{action:connect?'connect':'verify',reconnect:connect&&button.textContent?.includes('Reconnect')});pendingJob=job.id;card.querySelector('[data-codex-status]')!.textContent=connect?'Preparing sign-in on your Mac…':'Verifying your subscription…';await check();}
 catch(e){error.textContent=e instanceof Error?e.message:'Could not connect Codex.';error.hidden=false;authWindow?.close();authWindow=null;button.disabled=false;}
});
void check();setInterval(()=>void check(),3000);document.addEventListener('admin:refresh',()=>void check());
