import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {googleTagScript, clarityScript, trackLead, analyticsEnabled} from '../src/lib/analytics.ts';

test('analytics requires both the production environment and the explicit on flag',()=>{
  assert.equal(analyticsEnabled('on','production'),true);
  for(const environment of ['preview','development',undefined]) assert.equal(analyticsEnabled('on',environment),false);
  for(const flag of ['off','',undefined]) assert.equal(analyticsEnabled(flag,'production'),false);
});

test('the tag configures the existing destinations only on the live ZINC hosts, with campaign attribution and without unrelated URL queries',()=>{
  for(const hostname of ['www.zincdigital.co','zincdigital.co','zinc-digital-web.vercel.app','localhost','zincdigital.co.evil.example']) {
    const window:Record<string,any>={};
    const loaded:any[]=[];
    runInNewContext(googleTagScript(''),{window,location:{hostname,origin:'https://'+hostname,pathname:'/contact/',href:'https://'+hostname+'/contact/?email=private@example.com&utm_source=google&utm_medium=cpc&utm_campaign=launch&gclid=click-id&gbraid=ios-click'},document:{referrer:'https://example.com/?email=private@example.com',createElement:()=>({}),head:{appendChild:(tag:unknown)=>loaded.push(tag)}},URL,Date});
    if(!['www.zincdigital.co','zincdigital.co'].includes(hostname)){assert.equal(window.gtag,undefined);assert.equal(loaded.length,0);continue;}
    const calls=Array.from(window.dataLayer,(args:any)=>Array.from(args));
    assert.deepEqual(calls.filter((c:any[])=>c[0]==='config').map((c:any[])=>c[1]),['G-BV43HRVJ18','AW-17071018445']);
    assert.ok(!JSON.stringify(calls).includes('private@example.com'));
    const page = new URL((calls.find((call:any[])=>call[0]==='set')![1] as Record<string,string>).page_location);
    for (const [name,value] of Object.entries({utm_source:'google',utm_medium:'cpc',utm_campaign:'launch',gclid:'click-id',gbraid:'ios-click'}))assert.equal(page.searchParams.get(name),value);
    assert.equal(page.searchParams.has('email'),false);
    assert.equal(loaded.length,1);assert.equal(loaded[0].async,true);assert.equal(loaded[0].src,'https://www.googletagmanager.com/gtag/js?id=GT-NNZRWNCF');
  }
});

test('a confirmed saved lead sends one GA4 event; spam and unsuccessful answers send nothing',async()=>{
  const calls:any[][]=[];
  const tag=(...args:any[])=>{calls.push(args);args[2].event_callback();};
  for(const result of [{ok:true},{ok:false,lead:true},{error:'invalid'},null])await trackLead(result,tag);
  assert.equal(calls.length,0);
  await trackLead({ok:true,lead:true},tag);
  assert.equal(calls.length,1);
  assert.equal(calls[0][1],'generate_lead');
  assert.equal(calls[0][2].send_to,'G-BV43HRVJ18');
  assert.ok(!JSON.stringify(calls).includes('email'));
});

test('Ads conversion requires an explicit valid label and blocked analytics never blocks confirmation',async(t)=>{
  const calls:any[][]=[];
  const tag=(...args:any[])=>{calls.push(args);args[2].event_callback();};
  await trackLead({ok:true,lead:true},tag,'owner_label-1');
  assert.equal(calls[1][1],'conversion');
  assert.equal(calls[1][2].send_to,'AW-17071018445/owner_label-1');
  calls.length=0;
  await trackLead({ok:true,lead:true},tag,'</script>');
  assert.equal(calls.length,1);
  await trackLead({ok:true,lead:true},undefined);
  await trackLead({ok:true,lead:true},()=>{throw new Error('blocked')});
  t.mock.timers.enable({apis:['setTimeout']});
  let completed=false;
  const pending=trackLead({ok:true,lead:true},()=>{}).then(()=>{completed=true;});
  assert.equal(completed,false);
  t.mock.timers.tick(1100);
  await pending;
  assert.equal(completed,true);
});

test('public page tags identify the content and suppress explicit QA visits',()=>{
  const loaded:unknown[]=[];
  const window:Record<string,any>={};
  const location={hostname:'www.zincdigital.co',pathname:'/services/seo/',href:'https://www.zincdigital.co/services/seo/?zinc_qa=1'};
  runInNewContext(googleTagScript(),{window,location,document:{referrer:'',createElement:()=>({}),head:{appendChild:(t:unknown)=>loaded.push(t)}},URL,Date});
  assert.equal(loaded.length,0);
  assert.equal(window.gtag,undefined);
});


test('Clarity loads only the ZINC project on live public URLs and labels the page without form values',()=>{
  for (const href of ['https://www.zincdigital.co/services/seo/','https://localhost/contact/','https://www.zincdigital.co/contact/?zinc_qa=1','https://www.zincdigital.co/contact/?email=private@example.com']) {
    const window:Record<string,any>={},loaded:any[]=[];
    const u=new URL(href);
    runInNewContext(clarityScript(),{window,location:{hostname:u.hostname,href},document:{documentElement:{dataset:{pageType:'service',serviceSlug:'seo'}},createElement:()=>({}),head:{appendChild:(v:unknown)=>loaded.push(v)}},URL});
    if(href==='https://www.zincdigital.co/services/seo/') {
      assert.equal(loaded[0]?.src,'https://www.clarity.ms/tag/p6dd6jjhx3');
      assert.deepEqual(Array.from(window.clarity.q,(v:any)=>Array.from(v)),[['set','page_type','service'],['set','service_slug','seo']]);
    } else {assert.equal(loaded.length,0);assert.equal(window.clarity,undefined);}
  }
});
