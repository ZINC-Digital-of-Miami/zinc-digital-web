import {test} from 'node:test';
import assert from 'node:assert/strict';
import {googleInventoryRange} from '../src/lib/google-dates.ts';

test('the inventory uses the CT calendar even after the UTC date advances',()=>{
  assert.deepEqual(googleInventoryRange(new Date('2026-10-06T01:00:00Z')),{startDate:'2025-06-05',endDate:'2026-10-05'});
  assert.deepEqual(googleInventoryRange(new Date('2026-01-06T01:00:00Z')),{startDate:'2024-09-05',endDate:'2026-01-05'});
});
test('subtracting sixteen calendar months clamps the day at month end',()=>{
  assert.deepEqual(googleInventoryRange(new Date('2026-03-31T18:00:00Z')),{startDate:'2024-11-30',endDate:'2026-03-31'});
});
