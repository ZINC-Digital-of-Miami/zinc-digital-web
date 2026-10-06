import {test} from 'node:test';
import assert from 'node:assert/strict';
import {googleReportRange} from '../src/lib/google-range.ts';
test('GA report calendar dates respect property timezone rather than workstation timezone',()=>{
 assert.deepEqual(googleReportRange(Date.parse('2026-10-06T04:30:00Z'),'America/New_York'),{start:'2026-09-06',end:'2026-10-05'});
});
test('30 calendar days remain stable across daylight-saving changes near midnight',()=>{
 assert.deepEqual(googleReportRange(Date.parse('2026-03-10T04:30:00Z'),'America/New_York'),{start:'2026-02-08',end:'2026-03-09'});
 assert.deepEqual(googleReportRange(Date.parse('2026-11-02T04:30:00Z'),'America/New_York'),{start:'2026-10-02',end:'2026-10-31'});
});
