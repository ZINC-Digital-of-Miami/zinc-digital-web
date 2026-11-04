import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseRfpFunnel,rfpFunnelRequest} from '../src/lib/rfp-metrics.ts';
const row=(name:string,value:string)=>({dimensionValues:[{value:name}],metricValues:[{value}]});
const data=(rows:unknown[])=>({funnelTable:{metricHeaders:[{name:'activeUsers'}],rows}});
test('funnel uses ordered users on ZINC hosts, without treating missing instrumentation as zero',()=>{
 const request=rfpFunnelRequest('2026-11-04','2026-11-10');
 assert.equal(request.funnel.isOpenFunnel,false);assert.equal(request.funnel.steps.length,6);
 const result=parseRfpFunnel(data([row('1. page_view','100'),row('2. rfp_form_view','0')]));
 assert.equal(result.steps[0].users,100);assert.equal(result.steps[1].users,0);assert.equal(result.steps[2].users,null);
});
test('funnel rejects missing metrics and populations that increase downstream',()=>{
 assert.throws(()=>parseRfpFunnel({}));
 assert.throws(()=>parseRfpFunnel(data([row('1. page_view','10'),row('2. rfp_form_view','11')])));
 assert.equal(parseRfpFunnel(data([row('1. page_view','NaN')])).steps[0].users,null);
});
