import {post} from './shell';
document.addEventListener('click',async event=>{
 const button=(event.target as Element).closest<HTMLButtonElement>('[data-square-action]');if(!button)return;
 const panel=button.closest('section')!;const result=panel.querySelector<HTMLElement>('[data-square-result]')!;
 button.disabled=true;panel.dataset.seoActive='true';result.textContent='Checking Square…';
 try{const data=await post('/api/admin/square/',JSON.parse(button.dataset.body||'{}'));result.textContent=data.message;}
 catch(e){result.textContent=e instanceof Error?e.message:'Square unavailable.';}finally{button.disabled=false;delete panel.dataset.seoActive;}
});
