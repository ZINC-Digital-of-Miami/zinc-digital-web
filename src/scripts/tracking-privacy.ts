const privacyStatus=document.querySelector<HTMLElement>('[data-tracking-status]');
const choices=document.querySelectorAll<HTMLButtonElement>('[data-tracking-choice]');
const state=window as typeof window & {zincTrackingAllowed?:boolean;zincPrivacySignal?:boolean};
if(privacyStatus){
 privacyStatus.textContent=state.zincPrivacySignal?'Tracking is off because your browser sends a privacy signal. This site honors Global Privacy Control and Do Not Track.':state.zincTrackingAllowed?'Analytics and replay are allowed for this browser.':'Analytics and replay are off for this browser.';
 for(const button of choices){
  button.hidden=state.zincPrivacySignal===true||(button.dataset.trackingChoice==='on')===state.zincTrackingAllowed;
  button.addEventListener('click',()=>{
   try{localStorage.setItem('zinc-tracking',button.dataset.trackingChoice!);}
   catch{privacyStatus.textContent='Your browser could not save this choice. Enable Global Privacy Control or block tracking in your browser settings.';return;}
   // Stop our event producers immediately; reloading prevents third-party scripts from loading again.
   if(button.dataset.trackingChoice==='off'){state.zincTrackingAllowed=false;window.gtag=()=>{};window.clarity=()=>{};}
   location.reload();
  });
 }
}
window.addEventListener('storage',event=>{if(event.key==='zinc-tracking'||event.key===null)location.reload();});
