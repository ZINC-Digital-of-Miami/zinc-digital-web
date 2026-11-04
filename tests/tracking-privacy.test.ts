import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {trackingPrivacyScript} from '../src/lib/tracking-privacy.ts';
import {googleTagScript,clarityScript} from '../src/lib/analytics.ts';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';

test('browser signals, saved opt-out and inaccessible storage prevent both providers from loading',()=>{
 for(const settings of [{globalPrivacyControl:true},{doNotTrack:'1'},{msDoNotTrack:'1'},{windowDnt:'1'},{choice:'off'},{storageError:true},{writeError:true},{globalPrivacyControl:true,choice:'on'},{}]){
  const loaded:unknown[]=[],window:any={doNotTrack:(settings as any).windowDnt};
  const context={window,navigator:settings,localStorage:{getItem(){if((settings as any).storageError)throw Error('blocked');return(settings as any).choice||null;},setItem(){if((settings as any).writeError)throw Error('quota');},removeItem(){}},location:{hostname:'www.zincdigital.co',href:'https://www.zincdigital.co/'},document:{referrer:'',documentElement:{dataset:{}},createElement:()=>({}),head:{appendChild:(x:unknown)=>loaded.push(x)}},URL};
  runInNewContext(trackingPrivacyScript()+googleTagScript()+clarityScript(),context);
  assert.equal(loaded.length,Object.keys(settings).length?0:2,JSON.stringify(settings));
  if(Object.keys(settings).length){assert.equal(window.gtag,undefined);assert.equal(window.clarity,undefined);}
 }
});

test('visitor opt-out persists, stops local event producers and reloads; storage failures stay explicit',()=>{
 for(const storageError of [false,true]){
  let reloads=0;const stored:any[]=[],clicks:Function[]=[];
  const status={textContent:''},off:any={dataset:{trackingChoice:'off'},hidden:true,addEventListener(_n:string,fn:Function){clicks.push(fn);}};
  const window:any={zincTrackingAllowed:true,zincPrivacySignal:false,gtag:()=>{throw Error('old tracker')},clarity:()=>{throw Error('old replay')},addEventListener(){}};
  const document={querySelector:()=>status,querySelectorAll:()=>[off]};
  runInNewContext(stripTypeScriptTypes(readFileSync('src/scripts/tracking-privacy.ts','utf8')),{window,document,localStorage:{setItem(k:string,v:string){if(storageError)throw Error('blocked');stored.push([k,v]);}},location:{reload(){reloads++;}}});
  assert.equal(off.hidden,false);clicks[0]();
  if(storageError){assert.equal(reloads,0);assert.match(status.textContent,/could not save/);}
  else{assert.deepEqual(stored,[['zinc-tracking','off']]);assert.equal(reloads,1);assert.equal(window.zincTrackingAllowed,false);assert.doesNotThrow(()=>{window.gtag();window.clarity();});}
 }
});
