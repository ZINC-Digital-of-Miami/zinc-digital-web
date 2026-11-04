import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {trackingPrivacyScript,PRIVACY_KEY,PRIVACY_VERSION,PRIVACY_MAX_AGE} from '../src/lib/tracking-privacy.ts';
import {googleTagScript,clarityScript,GA4_TAG,ADS_TAG} from '../src/lib/analytics.ts';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const all={analytics:true,recordings:true,advertising:true};
const none={analytics:false,recordings:false,advertising:false};
const saved=(choices=all,extra={})=>JSON.stringify({...choices,version:PRIVACY_VERSION,savedAt:Date.now(),...extra});
function visit(preference:string|null,settings:Record<string,unknown>={}){
 const loaded:any[]=[],window:any={doNotTrack:settings.windowDnt};
 const context={window,navigator:settings,localStorage:{getItem(){if(settings.readError)throw Error('blocked');return preference;},setItem(){if(settings.writeError)throw Error('quota');},removeItem(){}},location:{hostname:'www.zincdigital.co',href:'https://www.zincdigital.co/contact/?utm_source=site&gclid=ad-click'},document:{referrer:'',documentElement:{dataset:{}},createElement:()=>({}),head:{appendChild:(x:unknown)=>loaded.push(x)}},URL,Date};
 runInNewContext(trackingPrivacyScript()+googleTagScript()+clarityScript(),context);
 return {window,loaded,calls:()=>Array.from(window.dataLayer||[],(args:any)=>Array.from(args)) as any[][]};
}
test('no tracking before permission, after expiry, or with malformed/unreadable preferences',()=>{
 for(const p of [null,'on','off','{}','null','{bad',saved(all,{version:0}),saved(all,{savedAt:Date.now()-PRIVACY_MAX_AGE}),saved(all,{savedAt:Date.now()+60000}),saved({...all,analytics:'true'} as any),saved(none)])assert.equal(visit(p).loaded.length,0,p||'missing');
 for(const signal of [{globalPrivacyControl:true},{doNotTrack:'1'},{msDoNotTrack:'1'},{windowDnt:'1'},{readError:true},{writeError:true}])assert.equal(visit(saved(),signal).loaded.length,0,JSON.stringify(signal));
});
test('each consent combination gates the matching loader, destination, event and provider consent',()=>{
 for(let mask=0;mask<8;mask++){
  const choices={analytics:!!(mask&1),recordings:!!(mask&2),advertising:!!(mask&4)};
  const {window,loaded,calls}=visit(saved(choices));
  assert.equal(loaded.filter(t=>t.src.includes('googletagmanager')).length,Number(choices.analytics||choices.advertising));
  assert.equal(loaded.filter(t=>t.src.includes('clarity')).length,Number(choices.recordings));
  assert.deepEqual(calls().filter(c=>c[0]==='config').map(c=>c[1]),[...(choices.analytics?[GA4_TAG]:[]),...(choices.advertising?[ADS_TAG]:[])]);
  if(window.gtag){
   assert.equal(calls()[0][0],'consent');assert.equal(calls()[0][1],'default');
   assert.equal(calls()[0][2].analytics_storage,choices.analytics?'granted':'denied');
   assert.equal(calls()[0][2].ad_user_data,choices.advertising?'granted':'denied');
   assert.equal(calls()[0][2].ad_personalization,choices.advertising?'granted':'denied');
   const page=calls().find(c=>c[0]==='set'&&typeof c[1]==='object')![1].page_location;
   assert.equal(new URL(page).searchParams.has('gclid'),choices.advertising);
   let callbacks=0;
   window.gtag('event','generate_lead',{send_to:GA4_TAG,event_callback:()=>callbacks++});
   window.gtag('event','conversion',{send_to:ADS_TAG+'/label',event_callback:()=>callbacks++});
   assert.equal(calls().filter(c=>c[0]==='event').length,Number(choices.analytics)+Number(choices.advertising));
   assert.equal(callbacks,Number(!choices.analytics)+Number(!choices.advertising));
  }
  if(window.clarity){const command=Array.from(window.clarity.q[0]) as any[];assert.equal(command[0],'consentv2');assert.equal(command[1].ad_Storage,choices.advertising?'granted':'denied');}
 }
});
function controls({savedChoice=false,signal=false,storageError=false,providerError=false}={}){
 const listeners:Record<string,Function>={},stored:any[]=[];let reloads=0;
 const element=(key:string)=>({hidden:true,disabled:false,checked:false,textContent:'',dataset:{privacyChoice:key},setAttribute(){},focus(){},addEventListener(_name:string,fn:Function){listeners[key]=fn;}});
 const status=element('status'),options=element('options'),settings=element('settings'),accept=element('accept'),reject=element('reject'),save=element('save'),close=element('close'),open=element('open');
 const fields=['analytics','recordings','advertising'].map(element);
 const selectors:any={'[data-privacy-status]':status,'#privacy-options':options,'[data-privacy-settings]':settings,'[data-privacy-accept]':accept,'[data-privacy-reject]':reject,'[data-privacy-save]':save,'[data-privacy-close]':close};
 const bar={hidden:true,querySelector:(s:string)=>selectors[s],querySelectorAll:()=>fields};
 const window:any={zincConsent:savedChoice?all:none,zincConsentSaved:savedChoice,zincPrivacySignal:signal,zincPrivacyStorage:!storageError,gtag(){if(providerError)throw Error('blocked')},clarity(){if(providerError)throw Error('blocked')},addEventListener(name:string,fn:Function){listeners[name]=fn;}};
 const document={body:{append(){}},querySelector:(s:string)=>s==='[data-consent-bar]'?bar:open};
 const code=stripTypeScriptTypes(readFileSync('src/scripts/tracking-privacy.ts','utf8')).replace(/^import .*;\n/,'');
 runInNewContext(code,{window,document,PRIVACY_KEY,PRIVACY_VERSION,localStorage:{setItem(k:string,v:string){if(storageError)throw Error('blocked');stored.push([k,JSON.parse(v)]);}},location:{reload(){reloads++;}},Date});
 return{window,bar,fields,open,status,accept,close,listeners,stored,reloads:()=>reloads};
}
test('first visit shows the bar, reject persists all-off, and settings reopen after a saved decision',()=>{
 const first=controls();assert.equal(first.bar.hidden,false);assert.equal(first.open.hidden,false);assert.equal(first.close.hidden,true);
 first.listeners.reject();assert.equal(first.reloads(),1);assert.deepEqual(first.stored[0][1],{...none,version:1,savedAt:first.stored[0][1].savedAt});
 const returning=controls({savedChoice:true});assert.equal(returning.bar.hidden,true);returning.listeners.open();assert.equal(returning.bar.hidden,false);
 returning.fields[0].checked=true;returning.fields[1].checked=false;returning.fields[2].checked=false;returning.listeners.save();
 assert.equal(returning.stored[0][1].analytics,true);assert.equal(returning.stored[0][1].recordings,false);assert.equal(returning.stored[0][1].advertising,false);
});
test('GPC disables grants; storage and provider failures cannot falsely save consent or prevent withdrawal',()=>{
 const signal=controls({signal:true});assert.equal(signal.accept.disabled,true);assert.ok(signal.fields.every(f=>f.disabled));signal.listeners.accept();assert.equal(signal.stored[0][1].analytics,false);
 const failed=controls({storageError:true});failed.listeners.accept();assert.equal(failed.stored.length,0);assert.equal(failed.reloads(),0);assert.match(failed.status.textContent,/could not save/);assert.equal(failed.window.zincConsent.analytics,false);
 const withdrawal=controls({savedChoice:true,providerError:true});assert.doesNotThrow(()=>withdrawal.listeners.reject());assert.equal(withdrawal.reloads(),1);
 const lostStorage=controls({savedChoice:true,storageError:true});lostStorage.listeners.reject();assert.equal(lostStorage.reloads(),1);
});
