import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {Builder,By,Key,logging} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import {gzipSync} from 'node:zlib';

const args=process.argv.slice(2);
const valueFlags=new Set(['--mode','--pairings','--base']);
const booleanFlags=new Set(['--self-test','--tracer','--parity','--selected']);
for(let i=0;i<args.length;i++){
  assert.ok(valueFlags.has(args[i])||booleanFlags.has(args[i]),'unknown option: '+args[i]);
  if(valueFlags.has(args[i])){assert.ok(args[i+1]&&!args[i+1].startsWith('--'),'missing value: '+args[i]);i++;}
}
const option=(name,fallback)=>args.includes(name)?args[args.indexOf(name)+1]:fallback;
const mode=option('--mode','quick');
assert.ok(['quick','full'].includes(mode),'mode must be quick or full');
assert.ok(!(args.includes('--selected')&&args.includes('--parity')),'selected site has no comparison aliases');
const root=process.cwd();
const out=path.join(root,'.scratch/phase01-mockup');
const posts=JSON.parse(await fs.readFile('src/data/posts.preview.json','utf8')).posts;
const slugs=['shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence'];
const routeRecords=[['/','home'],['/services/','services'],...slugs.map(s=>['/services/'+s+'/','service']),['/work/','work'],['/work/once-upon-a-book-club/','case'],['/work/us-oil-solutions/','case'],['/about/','about'],['/contact/','contact'],['/thanks/','thanks'],['/blog/','blog'],...posts.map(p=>['/blog/'+p.slug+'/','article']),['/privacy/','privacy'],['/terms/','terms']];
const tracerPaths=new Set(['/','/services/shopify/','/contact/','/thanks/']);
const inventory=args.includes('--tracer')?routeRecords.filter(([route])=>tracerPaths.has(route)):routeRecords;
export function validateObservation(o){
  assert.equal(o.status,o.expectedStatus??200,'HTTP status');
  assert.ok(o.body,'route has complete body');
  assert.ok(!o.brokenLinks,'local links resolve');
  assert.ok(!o.underlines,'links have no underline');
  assert.ok(!o.blurredImages,'images have 2x sources');
  assert.ok(!o.networkLeak,'demo sends no data');
  assert.ok(!o.scriptExecuted,'source scripts cannot run');
  assert.ok(!o.overflow,'page has no horizontal overflow');
  assert.ok(!o.invalidTheme,'bands have valid themes');
}
if(args.includes('--self-test')){
  const good={status:200,body:true};validateObservation(good);
  for(const [field,value] of Object.entries({status:404,body:false,brokenLinks:1,underlines:1,blurredImages:1,networkLeak:1,scriptExecuted:1,overflow:1,invalidTheme:1})) assert.throws(()=>validateObservation({...good,[field]:value}),undefined,'detected '+field);
  console.log('PASS: nine fault-injection directions detected');process.exit(0);
}
assert.equal(option('--pairings','a'),'a','this stage implements Pairing A only; B/C gate belongs to01-03');
await fs.mkdir(path.join(out,'screenshots'),{recursive:true});
await fs.mkdir(path.join(out,'tmp'),{recursive:true});
const save=(name,value)=>fs.writeFile(path.join(out,name),JSON.stringify(value,null,2)+'\n');
let server;let driver;
const suppliedBase=option('--base','');
const base=suppliedBase||'http://127.0.0.1:4329';
const result={mode,base,tracer:args.includes('--tracer'),selected:args.includes('--selected'),parity:args.includes('--parity'),startedAt:new Date().toISOString(),routes:[],links:0,images:0,browserChecks:0,axe:[],screenshots:[],states:[],failures:[]};
const check=(condition,message)=>{if(!condition)result.failures.push(message);};
async function waitReady(){for(let i=0;i<80;i++){try{if((await fetch(base)).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error('preview did not become ready');}
async function capture(route,template,width,state='default'){
  const metrics=await driver.sendAndGetDevToolsCommand('Page.getLayoutMetrics',{});
  const height=Math.ceil(metrics.cssContentSize.height);
  const name=(route==='/'?'home':route.replace(/^\/|\/$/g,'').replaceAll('/','--'))+'--'+width+'--'+state+'.png';
  const artifacts=[];
  // Keep each native capture below Chrome's 16384 physical-pixel surface limit.
  // Preserve every part at DPR 2; never truncate or resample a long page.
  for(let y=0,part=1;y<height;y+=6000,part++){
    const partHeight=Math.min(6000,height-y);
    const partName=height>6000?name.replace('.png','--part-'+part+'.png'):name;
    const screenshot=await driver.sendAndGetDevToolsCommand('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,fromSurface:true,clip:{x:0,y,width,height:partHeight,scale:1}});
    await fs.writeFile(path.join(out,'screenshots',partName),Buffer.from(screenshot.data,'base64'));
    artifacts.push({artifact:'screenshots/'+partName,y,height:partHeight});
  }
  const entry={route,template,width,height,pairing:'a',state,dpr:2,artifact:artifacts[0].artifact,artifacts};result.screenshots.push(entry);return entry;
}
async function viewport(width){await driver.sendAndGetDevToolsCommand('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:2,mobile:false});}
async function settle(){await driver.executeAsyncScript('const done=arguments[arguments.length-1]; document.fonts.ready.then(()=>Promise.all(Array.from(document.images).map(i=>{i.loading="eager";return i.decode().catch(()=>{});}))).then(()=>requestAnimationFrame(()=>requestAnimationFrame(done)));');}
async function observation(){return driver.executeScript(function(){
  const visible=el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
  const anchors=Array.from(document.querySelectorAll('a')).filter(visible);
  const images=Array.from(document.images).filter(visible).map(img=>{const b=img.getBoundingClientRect();return{src:img.currentSrc,width:b.width,height:b.height,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,ratio:Math.abs(b.width/b.height-img.naturalWidth/img.naturalHeight),reserved:img.hasAttribute('width')&&img.hasAttribute('height')};});
  const bands=Array.from(document.querySelectorAll('.band')).map(el=>({theme:el.getAttribute('data-theme'),ground:getComputedStyle(el).backgroundColor,rect:{top:el.getBoundingClientRect().top+scrollY,bottom:el.getBoundingClientRect().bottom+scrollY},nested:!!el.querySelector('.band[data-theme]')}));
  const h=document.querySelector('h1');return{body:!!h,underlines:anchors.filter(el=>getComputedStyle(el).textDecorationLine!=='none').length,blurredImages:images.filter(i=>i.naturalWidth+1<i.width*2||i.naturalHeight+1<i.height*2||!i.reserved||i.ratio>.02),images,overflow:document.documentElement.scrollWidth>innerWidth+1,invalidTheme:bands.filter(b=>!['dark','light'].includes(b.theme)||b.nested).length,bands,h1Top:h?.getBoundingClientRect().top+scrollY,homeBands:Array.from(document.querySelectorAll('[data-home-band]')).map(el=>el.getAttribute('data-theme')),text:document.body.innerText};
});}
async function load(route,width=1440){await viewport(width);await driver.get(base+route);await settle();}
try{
  if(!suppliedBase){server=spawn(process.execPath,['node_modules/astro/bin/astro.mjs','preview','--host','127.0.0.1','--port','4329','--ignore-lock'],{cwd:root,env:{...process.env,TMPDIR:path.join(out,'tmp'),XDG_CACHE_HOME:path.join(out,'cache')},stdio:'ignore'});await waitReady();}
  const options=new chrome.Options().addArguments('--headless=new','--no-first-run','--disable-background-networking','--user-data-dir='+path.join(out,'verify-browser'));
  const preferences=new logging.Preferences();preferences.setLevel(logging.Type.PERFORMANCE,logging.Level.ALL);options.setLoggingPrefs(preferences);
  driver=await new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(new chrome.ServiceBuilder(path.join(root,'node_modules/chromedriver/lib/chromedriver/chromedriver'))).build();
  await driver.get('about:blank');
  const htmlMap=new Map();
  for(const [route,template] of [...inventory,...(args.includes('--selected')?[]:[['/design-preview/a/','home']]),['/not-a-real-page/','404']]){
    const response=await fetch(base+route);const html=await response.text();
    const data=await driver.executeScript(function(html){const doc=new DOMParser().parseFromString(html,'text/html');const body=doc.querySelector('main')?.cloneNode(true);body?.querySelectorAll('script,style').forEach(el=>el.remove());return{title:doc.title,h1:doc.querySelector('h1')?.textContent,main:body?.textContent||'',meta:doc.querySelector('meta[name="robots"]')?.getAttribute('content'),links:Array.from(doc.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')),ids:Array.from(doc.querySelectorAll('[id]')).map(e=>e.id),blocks:doc.querySelector('[data-source-blocks]')?.getAttribute('data-source-blocks'),inline:Array.from(doc.querySelectorAll('script:not([src])')).map(s=>s.textContent).join('\n'),scripts:Array.from(doc.querySelectorAll('script[src]')).map(s=>s.getAttribute('src'))};},html);
    check(response.status===(template==='404'?404:200),route+' status '+response.status);
    check(!!data.h1&&data.main.length>300,route+' meaningful page body');
    check(data.meta==='noindex, nofollow',route+' noindex meta');
    if(suppliedBase)check(/noindex.*nofollow/.test(response.headers.get('x-robots-tag')||''),route+' noindex header');
    const post=posts.find(p=>route==='/blog/'+p.slug+'/');
    if(post){check(Number(data.blocks)===post.blocks.length,route+' complete article block inventory');for(const block of post.blocks){const text=(block.runs||block.items?.flat()||[]).map(r=>r.text).join('');if(text.trim())check(data.main.includes(text),route+' source text missing '+text.slice(0,55));}}
    let js=data.inline;for(const script of data.scripts){const response=await fetch(new URL(script,base));js+=await response.text();}
    check(gzipSync(js).length<=15*1024,route+' JS gzip budget');
    htmlMap.set(route,data);result.routes.push({route,template,status:response.status,bodyCharacters:data.main.length,jsGzip:gzipSync(js).length});
  }
  if(args.includes('--parity'))check(htmlMap.get('/').main.replace(/\s+/g,' ')===htmlMap.get('/design-preview/a/').main.replace(/\s+/g,' '),'A homepage alias content parity');
  const checked=new Set();
  for(const [route,data] of htmlMap)for(const href of data.links){const url=new URL(href,base+route);if(url.origin!==new URL(base).origin)continue;result.links++;const key=url.pathname+url.hash;if(checked.has(key))continue;checked.add(key);let target=htmlMap.get(url.pathname);if(!target){const res=await fetch(url);check(res.ok,route+' broken link '+href);const text=await res.text();target={ids:Array.from(text.matchAll(/\bid="([^"]+)"/g),m=>m[1])};}if(url.hash)check(target.ids.includes(decodeURIComponent(url.hash.slice(1))),route+' missing fragment '+href);}
  const templates=[...new Map(inventory.map(r=>[r[1],r])).values()];
  const samples=[...templates,['/services/ai-search-optimization/','service-long'],['/services/shopping-ads/','service-long'],['/work/once-upon-a-book-club/','case-ouabc'],['/not-a-real-page/','404']];
  const axeSource=await fs.readFile('node_modules/axe-core/axe.min.js','utf8');
  for(const [route,template] of (mode==='full'?samples:[['/','home'],['/services/shopify/','service'],['/contact/','contact'],['/blog/','blog']])){
    for(const width of mode==='full'?[1440,375]:[375]){
      await load(route,width);const obs=await observation();result.browserChecks++;result.images+=obs.images.length;
      check(!obs.overflow,route+' overflow at '+width);check(obs.underlines===0,route+' underlines at '+width);check(obs.blurredImages.length===0,route+' image2x/ratio '+JSON.stringify(obs.blurredImages));check(obs.invalidTheme===0,route+' invalid/nested band theme');check(obs.h1Top<250,route+' content starts at top');
      if(route==='/'){check(obs.homeBands.join(',')==='light,dark,light,dark,light,dark,light,dark,light','home band order');for(let i=1;i<obs.bands.length;i++)check(Math.abs(obs.bands[i].rect.top-obs.bands[i-1].rect.bottom)<1,'home gap/overlap');check(obs.text.replace(/\s+/g,' ').includes('Other agencies deliver the scope. ZINC delivers the business.'),'decoded core line');}
      await driver.executeScript(axeSource);const audit=await driver.executeAsyncScript('const done=arguments[arguments.length-1];axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}}).then(r=>done({violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),passes:r.passes.length}));');
      result.axe.push({route,width,...audit});check(audit.violations.length===0,route+' axe '+JSON.stringify(audit.violations));
      if(mode==='full')await capture(route,template,width);
      const defaultGrounds=obs.bands.map(b=>b.ground);await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]});const dark=await observation();check(JSON.stringify(defaultGrounds)===JSON.stringify(dark.bands.map(b=>b.ground)),route+' OS-theme drift');await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia',{features:[]});
      const focusLinks=await driver.findElements(By.css('a'));for(const anchor of focusLinks.slice(0,8)){if(!await anchor.isDisplayed())continue;await driver.executeScript('arguments[0].focus()',anchor);check(await driver.executeScript('return getComputedStyle(arguments[0]).textDecorationLine',anchor)==='none',route+' focus underline');}
    }
  }
  if(mode==='full'){
    for(const [route] of [['/'],['/services/ai-search-optimization/'],['/services/shopping-ads/'],['/about/'],['/contact/'],['/blog/']])for(const width of [320,375,768,1024,1440,2560]){await load(route,width);check(!(await observation()).overflow,route+' overflow at '+width);result.browserChecks++;}
    await load('/services/shopify/',375);for(const count of [0,1,2,6]){await driver.executeScript('const l=document.querySelector(".spec-grid ul");l.replaceChildren(...Array.from({length:arguments[0]},(_,i)=>{const x=document.createElement("li");x.textContent="Long deliverable description with operational requirements and explicit acceptance checks "+i;return x}));',count);check(!(await observation()).overflow,'deliverables count '+count);}
    await load('/',375);await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await driver.navigate().refresh();await settle();await capture('/','home',375,'reduced-motion');await driver.sendAndGetDevToolsCommand('Emulation.setEmulatedMedia',{features:[]});
    await load('/',375);const toggle=await driver.findElement(By.css('.menu-toggle'));await toggle.click();check(await toggle.getAttribute('aria-expanded')==='true','menu opens');await toggle.sendKeys(Key.ESCAPE);check(await toggle.getAttribute('aria-expanded')==='false','menu Escape closes');
  }
  for(const slug of [...slugs,'unknown','<img src=x onerror=alert(1)>','shopify&service=seo']){
    const query=slug==='shopify&service=seo'?slug:encodeURIComponent(slug);await load('/contact/?service='+query,375);const selected=await driver.executeScript('return Array.from(document.querySelectorAll("[data-service]:checked")).map(x=>x.value)');check(JSON.stringify(selected)===JSON.stringify(slugs.includes(slug)?[slug]:[]),'service preselection '+slug);
  }
  await load('/contact/?service=shopify',375);
  await driver.manage().logs().get(logging.Type.PERFORMANCE);
  const initialStorage=await driver.executeScript('return {local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}');
  await driver.findElement(By.css('[data-next]')).click();check((await driver.findElement(By.css('[data-form-error]')).getText()).length>0,'invalid step announces error');if(mode==='full')await capture('/contact/','contact',375,'error');
  for(const [id,value] of [['name','Demo Reviewer'],['company','Sample Company'],['email','reviewer@example.test'],['website','https://example.test']])await driver.findElement(By.id('inquiry-'+id)).sendKeys(value);
  await driver.findElement(By.css('[data-next]')).click();if(mode==='full')await capture('/contact/','contact',375,'services');
  await driver.executeScript('document.getElementById("inquiry-budget").selectedIndex=2;document.getElementById("inquiry-timeline").selectedIndex=1');await driver.findElement(By.css('[data-next]')).click();if(mode==='full')await capture('/contact/','contact',375,'message');
  await driver.findElement(By.id('inquiry-message')).sendKeys('Sample inquiry for local review only.');await driver.findElement(By.css('[data-next]')).click();await settle();check(await driver.getCurrentUrl()===base+'/thanks/','safe confirmation URL');check((await driver.findElement(By.css('main')).getText()).includes('Demo only — nothing was sent'),'honest thanks');
  const requests=(await driver.manage().logs().get(logging.Type.PERFORMANCE)).map(l=>JSON.parse(l.message).message).filter(m=>m.method==='Network.requestWillBeSent').map(m=>m.params.request);
  check(requests.every(r=>r.method==='GET'&&!r.postData&&!/Demo%20Reviewer|reviewer%40|Sample%20Company/.test(r.url)),'contact network PII or submission');
  const finalStorage=await driver.executeScript('return {local:localStorage.length,session:sessionStorage.length,cookie:document.cookie}');check(JSON.stringify(initialStorage)===JSON.stringify(finalStorage),'contact storage unchanged');result.states.push({name:'contact-demo',requests:requests.map(r=>({method:r.method,url:r.url})),storageUnchanged:JSON.stringify(initialStorage)===JSON.stringify(finalStorage),preselections:14});
  await load('/blog/',375);for(const layer of ['Build','Demand','Intelligence','All']){await driver.findElement(By.css('[data-filter="'+layer+'"]')).click();const state=await driver.executeScript('return {count:document.querySelector("[data-result-count]").textContent,visible:Array.from(document.querySelectorAll("[data-blog-list] article")).filter(x=>!x.hidden).map(x=>x.dataset.layer)}');check(state.visible.every(l=>layer==='All'||l===layer),'blog filter '+layer);result.states.push({name:'filter-'+layer,...state});}
  await driver.executeScript('document.querySelector("[data-filter=Build]").dataset.filter="Empty"');await driver.findElement(By.css('[data-filter="Empty"]')).click();check(await driver.findElement(By.css('[data-empty]')).isDisplayed(),'empty recovery visible');if(mode==='full')await capture('/blog/','blog',375,'empty');await driver.findElement(By.css('[data-clear-filter]')).click();check((await driver.findElement(By.css('[data-result-count]')).getText())==='18 articles','clear filter recovers');
  if(mode==='full'){
    await driver.sendAndGetDevToolsCommand('Emulation.setScriptExecutionDisabled',{value:true});await driver.get(base+'/contact/?service=shopify');const fallback=await driver.findElements(By.css('fieldset'));check((await Promise.all(fallback.map(f=>f.isDisplayed()))).every(Boolean),'noJS all fields');check(await driver.findElement(By.css('noscript a')).isDisplayed(),'noJS confirmation link');await capture('/contact/','contact',375,'no-js');await driver.sendAndGetDevToolsCommand('Emulation.setScriptExecutionDisabled',{value:false});
  }
  await save('screenshots.json',result.screenshots);await save('route-results.json',result.routes);
  result.completedAt=new Date().toISOString();await save('verification-'+mode+'.json',result);
  console.log(JSON.stringify({mode,routes:result.routes.length,links:result.links,images:result.images,browserChecks:result.browserChecks,axeRuns:result.axe.length,screenshots:result.screenshots.length,failures:result.failures},null,2));
  if(result.failures.length)process.exitCode=1;
}catch(error){result.failures.push(error.stack);await save('verification-'+mode+'.json',result);throw error;}finally{if(driver)await driver.quit();if(server)server.kill('SIGTERM');}
