/** Runs before either third-party loader, including on prerendered pages. */
export function trackingPrivacyScript():string{
 return `(function(){window.zincPrivacySignal=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||navigator.msDoNotTrack==='1'||window.doNotTrack==='1';window.zincTrackingAllowed=false;try{var choice=localStorage.getItem('zinc-tracking');localStorage.setItem('zinc-tracking-check','1');localStorage.removeItem('zinc-tracking-check');window.zincTrackingAllowed=!window.zincPrivacySignal&&choice!=='off'}catch{}})();`;
}
