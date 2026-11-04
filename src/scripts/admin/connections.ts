import type {ConnectionCheck} from '../../lib/connection-checks';
let checking=false;
let result:{checks:ConnectionCheck[];checkedAt:string}|null=null;
let failure='';
function render(){
 const card=document.querySelector('[data-connection-checks]');if(!card)return;
 card.querySelector<HTMLButtonElement>('[data-check-connections]')!.disabled=checking;
 const error=card.querySelector<HTMLElement>('[data-connections-error]')!;
 error.hidden=!failure;error.textContent=failure;
 card.querySelector('[data-connections-time]')!.textContent=checking?'Checking connections…':failure?'Checks incomplete.':result?'Checked '+new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Chicago'}).format(new Date(result.checkedAt))+' CT':'';
 const list=card.querySelector('[data-connections-results]')!;list.replaceChildren();
 if(result)for(const check of result.checks){const row=document.createElement('li'),title=document.createElement('strong'),detail=document.createElement('p');title.textContent=check.name+' · '+check.status;detail.className='a-muted';detail.textContent=check.detail;row.append(title,detail);list.append(row);}
}
document.addEventListener('click',async event=>{
 if(!(event.target as Element).closest('[data-check-connections]')||checking)return;
 checking=true;failure='';result=null;render();
 try{
  const response=await fetch('/api/admin/connections/',{signal:AbortSignal.timeout(30000)}),data=await response.json();
  if(!response.ok)throw new Error(data.error||'Connections could not be checked.');
  result=data;
 }catch(e){failure=e instanceof Error?e.message:'Connections unavailable.';}
 finally{checking=false;render();}
});
// The shell replaces its content on focus and every minute. Keep the latest dated result,
// and render into the current card even when a refresh happens during the request.
document.addEventListener('admin:refresh',render);
