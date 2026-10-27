import test from 'node:test';
import assert from 'node:assert/strict';
import { clientOrder, workFor, nextClient } from '../src/data/client-work.ts';
import { laneNames, workLanes } from '../src/data/work-lanes.ts';

test('client grouping retains every lane engagement exactly once without retired work', () => {
  const slugs = [...new Set(laneNames.flatMap(l => workLanes[l].projects.map(p => p.slug)))];
  assert.equal(clientOrder.length, 17);
  assert.equal(new Set(clientOrder).size, 17);
  assert.deepEqual([...clientOrder].sort(), slugs.sort());
  assert.ok(!clientOrder.some(s => /ouabc|book-club/.test(s)));
  assert.equal(workFor('us-oil-solutions').length, 4);
  assert.equal(workFor('summit-marine-development').length, 2);
  assert.equal(workFor('zinc-fusion-v16').length, 2);
  for (const slug of clientOrder) assert.ok(workFor(slug).every(e => e.href.startsWith('/work/'+slug+'/')));
});
test('next-project navigation visits all clients once and returns to the start', () => {
  let slug=clientOrder[0]; const visited=new Set<string>();
  for(let i=0;i<clientOrder.length;i++){ assert.ok(!visited.has(slug)); visited.add(slug); slug=nextClient(slug); }
  assert.equal(slug,clientOrder[0]); assert.equal(visited.size,17);
  assert.throws(()=>nextClient('retired-client'));
});
