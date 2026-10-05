import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {googleTagScript, trackLead, analyticsEnabled} from '../src/lib/analytics.ts';

test('analytics requires both the production environment and the explicit on flag',()=>{
  assert.equal(analyticsEnabled('on','production'),true);
  for(const environment of ['preview','development',undefined]) assert.equal(analyticsEnabled('on',environment),false);
  for(const flag of ['off','',undefined]) assert.equal(analyticsEnabled(flag,'production'),false);
});

test('the tag configures the existing destinations only on the live ZINC hosts, without URL queries',()=>{
  for(const hostname of ['www.zincdigital.co','zincdigital.co','zinc-digital-web.vercel.app','localhost','zincdigital.co.evil.example']) {
    const window:Record<string,any>={};
    const loaded:any[]=[];
    runInNewContext(googleTagScript(''),{window,location:{hostname,origin:'https://'+hostname,pathname:'/contact/',href:'https://'+hostname+'/contact/?email=private@example.com'},document:{referrer:'https://example.com/?email=private@example.com',createElement:()=>({}),head:{appendChild:(tag:unknown)=>loaded.push(tag)}},URL,Date});
    if(!['www.zincdigital.co','zincdigital.co'].includes(hostname)){assert.equal(window.gtag,undefined);assert.equal(loaded.length,0);continue;}
    const calls=Array.from(window.dataLayer,(args:any)=>Array.from(args));
    assert.deepEqual(calls.filter((c:any[])=>c[0]==='config').map((c:any[])=>c[1]),['G-BV43HRVJ18','AW-17071018445']);
    assert.ok(!JSON.stringify(calls).includes('private@example.com'));
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
