import test from 'node:test';
import assert from 'node:assert/strict';
import { clientWork, workFor, sectionHref, laneHref, clientLayers, clientServices, engagementsByLayer } from '../src/data/engagements.ts';

// Service ownership (each engagement service exists in its layer; each service page's case lists it)
// is enforced when src/data/site.ts loads, so a mismatch fails astro check and the build.
const CASE_SLUGS = ['carla-funk-photography', 'ballad-health', 'meade-tractor', 'general-shale', 'once-upon-a-book-club', 'us-oil-solutions', 'las-vegas-safety', 'summit-marine-development', 'zinc-fusion-v16', 'the-lampstand-va', 'straight-street-ministries', 'bear-claw-usa', 'felon-motorwerk', 'miami-tactical', 'fraim-cawley-company', 'smoky-mountain-survival', 'andrew-neese', 'porsche-roanoke'];

test('Work authors every client exactly once', () => {
  assert.equal(clientWork.length, CASE_SLUGS.length);
  assert.deepEqual(clientWork.map(c => c.slug).sort(), [...CASE_SLUGS].sort());
});

test('each client nests its engagements with a section to land on', () => {
  for (const { slug, engagements } of clientWork) {
    assert.ok(engagements.length > 0, slug + ' has no engagements');
    assert.equal(new Set(engagements.map(e => e.label)).size, engagements.length, slug + ' repeats an engagement');
    for (const e of engagements) {
      assert.ok(['Build', 'Demand', 'Intelligence'].includes(e.layer), slug + ' / ' + e.label);
      assert.match(e.anchor, /^[a-z][a-z0-9-]*$/, slug + ' / ' + e.label);
      assert.ok(e.summary && e.category.length, slug + ' / ' + e.label);
    }
  }
});

test('OUABC keeps its storefront, campaigns and BI application under one client', () => {
  const ouabc = workFor('once-upon-a-book-club');
  assert.deepEqual(ouabc.map(e => e.layer), ['Build', 'Demand', 'Intelligence']);
  assert.match(ouabc[2].label, /OUABC BI Fusion/);
  assert.deepEqual(ouabc.map(e => sectionHref('once-upon-a-book-club', e)), ['/work/once-upon-a-book-club/#website', '/work/once-upon-a-book-club/#campaigns', '/work/once-upon-a-book-club/#reporting']);
});

test('layers, services and links derive from the engagements', () => {
  assert.deepEqual(clientLayers('zinc-fusion-v16'), ['Build', 'Intelligence']);
  assert.deepEqual(clientLayers('us-oil-solutions'), ['Build', 'Demand', 'Intelligence']);
  assert.deepEqual(clientServices('once-upon-a-book-club'), ['shopify', 'seo', 'shopping-ads', 'social-ads', 'tiktok-ads', 'business-intelligence']);
  assert.deepEqual(clientServices('the-lampstand-va'), []);
  assert.deepEqual(engagementsByLayer('summit-marine-development').map(e => e.layer), ['Build', 'Demand']);
  assert.equal(laneHref('us-oil-solutions', workFor('us-oil-solutions')[0]), '/work/us-oil-solutions/#website');
  assert.equal(laneHref('ballad-health', workFor('ballad-health')[0]), '/work/ballad-health/');
  assert.equal(laneHref('summit-marine-development', workFor('summit-marine-development')[1]), '/work/summit-marine-development/#work-demand');
});
