import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { laneNames, workLanes, projectLink } from '../src/data/work-lanes.ts';

test('service lanes retain every existing case and let engagements span relevant services', () => {
  assert.deepEqual([...new Set(workLanes.Build.projects.map(p => p.slug))].sort(), [
    'once-upon-a-book-club', 'us-oil-solutions', 'bear-claw-usa', 'las-vegas-safety',
    'summit-marine-development', 'zinc-fusion-v16', 'the-lampstand-va', 'straight-street-ministries',
    'miami-tactical', 'fraim-cawley-company', 'smoky-mountain-survival', 'andrew-neese', 'porsche-roanoke',
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

test('lane links take readers directly to the relevant part of a case', () => {
  assert.equal(projectLink('once-upon-a-book-club','Demand'), '/work/once-upon-a-book-club/#campaigns');
  assert.equal(projectLink('once-upon-a-book-club','Intelligence'), '/work/once-upon-a-book-club/#reporting');
  assert.equal(projectLink('us-oil-solutions','Intelligence'), '/work/us-oil-solutions/#work-intelligence');
  assert.equal(projectLink('las-vegas-safety','Build'), '/work/las-vegas-safety/');
});

test('US Oil website and operations app stay in separate Build entries', () => {
  const projects = workLanes.Build.projects.filter(p => p.slug === 'us-oil-solutions');
  assert.equal(projects.length, 2);
  const website = projects.find(p => p.category.includes('Websites'))!;
  const app = projects.find(p => p.category.includes('Applications'))!;
  assert.notEqual(website, app);
  assert.equal(website.href, '/work/us-oil-solutions/#website');
  assert.equal(app.href, '/work/us-oil-solutions/#operations-app');
});
