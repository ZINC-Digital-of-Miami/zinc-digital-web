export const PRIVACY_KEY='zinc-privacy';
export const PRIVACY_VERSION=1;
export const PRIVACY_MAX_AGE=180*24*60*60*1000;
export type PrivacyChoices={analytics:boolean;recordings:boolean;advertising:boolean};
/** Runs before third-party loaders. Missing, malformed and expired permission all deny. */
export function trackingPrivacyScript():string{
 return `(function(){window.zincPrivacySignal=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||navigator.msDoNotTrack==='1'||window.doNotTrack==='1';window.zincConsent={analytics:false,recordings:false,advertising:false};window.zincConsentSaved=false;window.zincPrivacyStorage=false;try{var p=JSON.parse(localStorage.getItem('${PRIVACY_KEY}'));localStorage.setItem('zinc-privacy-check','1');localStorage.removeItem('zinc-privacy-check');window.zincPrivacyStorage=true;if(p&&p.version===${PRIVACY_VERSION}&&typeof p.savedAt==='number'&&p.savedAt<=Date.now()&&Date.now()-p.savedAt<${PRIVACY_MAX_AGE}&&['analytics','recordings','advertising'].every(function(k){return typeof p[k]==='boolean'})){window.zincConsentSaved=true;if(!window.zincPrivacySignal)window.zincConsent={analytics:p.analytics,recordings:p.recordings,advertising:p.advertising}}}catch{}})();`;
}
