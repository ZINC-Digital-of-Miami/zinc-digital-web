import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { laneNames, workLanes } from '../src/data/work-lanes.ts';
import { clientWork } from '../src/data/engagements.ts';

test('service lanes are a view of the client-first record', () => {
  for (const lane of laneNames) {
    const authored = clientWork.flatMap(c => c.engagements.filter(e => e.layer === lane).map(e => c.slug + ' / ' + e.label)).sort();
    assert.deepEqual(workLanes[lane].projects.map(p => p.slug + ' / ' + p.label).sort(), authored, lane);
  }
  assert.deepEqual([...new Set(workLanes.Build.projects.map(p => p.slug))].sort(), [
    'once-upon-a-book-club', 'us-oil-solutions', 'bear-claw-usa', 'las-vegas-safety',
    'summit-marine-development', 'zinc-fusion-v16', 'the-lampstand-va', 'straight-street-ministries',
    'miami-tactical', 'fraim-cawley-company', 'smoky-mountain-survival', 'andrew-neese', 'porsche-roanoke',
    'carla-funk-photography', 'felon-motorwerk',
  ].sort());
  for (const slug of ['once-upon-a-book-club', 'us-oil-solutions']) {
    for (const lane of laneNames) assert.ok(workLanes[lane].projects.some(p => p.slug === slug));
  }
  assert.ok(workLanes.Intelligence.projects.find(p => p.slug === 'zinc-fusion-v16')?.status);
  assert.ok(workLanes.Intelligence.projects.find(p => p.slug === 'once-upon-a-book-club')?.status);
});

test('every filter has work, every scene exists and next links make one complete loop', () => {
  for (const lane of laneNames) {
    const data = workLanes[lane];
    assert.equal(new Set(data.projects.map(p => p.slug + p.label)).size, data.projects.length);
    for (const filter of data.filters.slice(1)) assert.ok(data.projects.some(p => p.category.includes(filter)), filter);
    for (const project of data.projects) {
      assert.ok(project.category.every(category => data.filters.includes(category)));
      if (project.scene) assert.ok(existsSync(new URL('../src/assets/lanes/' + project.scene + '.png', import.meta.url)));
    }
  }
  assert.equal(workLanes.Build.next, 'Demand');
  assert.equal(workLanes.Demand.next, 'Intelligence');
  assert.equal(workLanes.Intelligence.next, 'Build');
});

test('each lane keeps its approved order and destinations', () => {
  const root = (slug: string) => '/work/' + slug + '/';
  assert.deepEqual(workLanes.Build.projects.map(p => p.href), [
    root('carla-funk-photography'), root('felon-motorwerk'), root('once-upon-a-book-club'), root('us-oil-solutions') + '#website',
    root('fraim-cawley-company'), root('smoky-mountain-survival'), root('andrew-neese'), root('porsche-roanoke'), root('miami-tactical'),
    root('bear-claw-usa'), root('las-vegas-safety'), root('summit-marine-development'), root('zinc-fusion-v16'),
    root('the-lampstand-va'), root('straight-street-ministries'),
  ]);
  assert.deepEqual(workLanes.Demand.projects.map(p => p.href), [
    root('once-upon-a-book-club') + '#campaigns', root('summit-marine-development') + '#work-demand', root('us-oil-solutions') + '#work-demand',
    root('general-shale'), root('ballad-health'), root('meade-tractor'), root('las-vegas-safety') + '#catalog',
  ]);
  assert.deepEqual(workLanes.Intelligence.projects.map(p => p.href), [
    root('once-upon-a-book-club') + '#reporting', root('zinc-fusion-v16') + '#work-intelligence', root('us-oil-solutions') + '#work-intelligence',
  ]);
});

test('lane links open the case, or the engagement section for later engagements', () => {
  const href = (lane: 'Build' | 'Demand' | 'Intelligence', slug: string) => workLanes[lane].projects.find(p => p.slug === slug)!.href;
  assert.equal(href('Build', 'once-upon-a-book-club'), '/work/once-upon-a-book-club/');
  assert.equal(href('Demand', 'once-upon-a-book-club'), '/work/once-upon-a-book-club/#campaigns');
  assert.equal(href('Intelligence', 'once-upon-a-book-club'), '/work/once-upon-a-book-club/#reporting');
  assert.equal(href('Intelligence', 'us-oil-solutions'), '/work/us-oil-solutions/#work-intelligence');
  assert.equal(href('Build', 'las-vegas-safety'), '/work/las-vegas-safety/');
  assert.equal(href('Demand', 'las-vegas-safety'), '/work/las-vegas-safety/#catalog');
  assert.equal(href('Demand', 'ballad-health'), '/work/ballad-health/');
});

test('US Oil keeps website and operations app scope under one client entry', () => {
  const projects = workLanes.Build.projects.filter(p => p.slug === 'us-oil-solutions');
  assert.equal(projects.length, 1);
  const website = projects.find(p => p.category.includes('Websites'))!;
  const app = projects.find(p => p.category.includes('Applications'))!;
  assert.equal(website, app);
  assert.equal(website.href, '/work/us-oil-solutions/#website');
});
