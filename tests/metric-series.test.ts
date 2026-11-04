import {test} from 'node:test';import assert from 'node:assert/strict';
import {metricSeries} from '../src/lib/metric-series.ts';
test('sparse reports keep missing dates distinct from reported zero, including month boundaries',()=>{
 assert.deepEqual(metricSeries([{date:'20261031',sessions:4},{date:'20261102',sessions:0}],{start:'2026-10-31',end:'2026-11-02'}),[
  {date:'2026-10-31',sessions:4},{date:'2026-11-01',sessions:null},{date:'2026-11-02',sessions:0}
 ]);
});
test('empty reports stay unreported and invalid values never become zero',()=>{
 assert.deepEqual(metricSeries([{date:'2026-11-01',sessions:NaN}],{start:'2026-11-01',end:'2026-11-02'}).map(p=>p.sessions),[null,null]);
 assert.throws(()=>metricSeries([],{start:'invalid',end:'invalid'}));
});
