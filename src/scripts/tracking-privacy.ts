import {PRIVACY_KEY,PRIVACY_VERSION,type PrivacyChoices} from '../lib/tracking-privacy';
const bar=document.querySelector<HTMLElement>('[data-consent-bar]');
const open=document.querySelector<HTMLButtonElement>('[data-privacy-open]');
if(bar&&open){
 const status=bar.querySelector<HTMLElement>('[data-privacy-status]')!;
 const options=bar.querySelector<HTMLElement>('#privacy-options')!;
 const settings=bar.querySelector<HTMLButtonElement>('[data-privacy-settings]')!;
 const accept=bar.querySelector<HTMLButtonElement>('[data-privacy-accept]')!;
 const reject=bar.querySelector<HTMLButtonElement>('[data-privacy-reject]')!;
 const save=bar.querySelector<HTMLButtonElement>('[data-privacy-save]')!;
 const close=bar.querySelector<HTMLButtonElement>('[data-privacy-close]')!;
 const inputs=bar.querySelectorAll<HTMLInputElement>('[data-privacy-choice]');
 const denied:PrivacyChoices={analytics:false,recordings:false,advertising:false};
 const current=window.zincConsent||denied;
 for(const input of inputs){input.checked=current[input.dataset.privacyChoice as keyof PrivacyChoices];input.disabled=window.zincPrivacySignal===true;}
 open.hidden=false;
 // Place the fixed bar directly under body, outside footer transforms/overflow.
 document.body.append(bar);
 bar.hidden=window.zincConsentSaved===true||window.zincPrivacySignal===true;
 close.hidden=!window.zincConsentSaved&&!window.zincPrivacySignal;
 accept.disabled=window.zincPrivacySignal===true;
 if(window.zincPrivacySignal){status.hidden=false;status.textContent='Optional tracking is off because your browser sends a privacy signal. We honor Global Privacy Control and Do Not Track.';}
 else if(window.zincPrivacyStorage===false){status.hidden=false;status.textContent='Your browser cannot save a preference. Optional tracking is off.';}
 const expand=()=>{options.hidden=false;settings.setAttribute('aria-expanded','true');};
 open.addEventListener('click',()=>{bar.hidden=false;expand();settings.focus();});
 settings.addEventListener('click',()=>{expand();inputs[0]?.focus();});
 close.addEventListener('click',()=>{bar.hidden=true;open.focus();});
 const persist=(choices:PrivacyChoices)=>{
  const next=window.zincPrivacySignal?denied:choices;
  let saved=false;
  try{localStorage.setItem(PRIVACY_KEY,JSON.stringify({...next,version:PRIVACY_VERSION,savedAt:Date.now()}));saved=true;}
  catch{status.hidden=false;status.textContent='Your browser could not save this choice. Optional tracking is off. You can continue using the site.';}
  const effective=saved?next:denied;
  // Tell already-loaded providers about withdrawal before reloading; then stop local events.
  try{window.gtag?.('consent','update',{analytics_storage:effective.analytics?'granted':'denied',ad_storage:effective.advertising?'granted':'denied',ad_user_data:effective.advertising?'granted':'denied',ad_personalization:effective.advertising?'granted':'denied'});}catch{/* A blocked provider cannot prevent withdrawal. */}
  try{window.clarity?.('consentv2',{analytics_Storage:effective.recordings?'granted':'denied',ad_Storage:effective.advertising?'granted':'denied'});}catch{/* Continue to the reload even if the provider fails. */}
  window.zincConsent=effective;
  window.gtag=()=>{};window.clarity=()=>{};
  if(saved||Object.values(current).some(Boolean))location.reload();
 };
 reject.addEventListener('click',()=>persist(denied));
 accept.addEventListener('click',()=>persist({analytics:true,recordings:true,advertising:true}));
 save.addEventListener('click',()=>{const chosen={...denied};for(const input of inputs)chosen[input.dataset.privacyChoice as keyof PrivacyChoices]=input.checked;persist(chosen);});
}
window.addEventListener('storage',event=>{if(event.key===PRIVACY_KEY||event.key===null)location.reload();});
