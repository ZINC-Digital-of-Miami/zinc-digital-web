import {test} from 'node:test';
import assert from 'node:assert/strict';
import inventory from '../src/data/legacy-urls.json' with {type:'json'};
import {redirects,isRetiredPath,canonicalContentLink} from '../src/data/redirects.ts';

test('legacy service, case and article URLs have direct canonical replacements',()=>{
  assert.equal(redirects['/about-us/'],'/about/');
  assert.equal(redirects['/service/mobile-apps/'],'/services/apps/');
  assert.equal(redirects['/portfolio/las-vegas-safety/'],'/work/las-vegas-safety/');
  assert.equal(redirects['/local-seo-2026-operators-manual/'],'/blog/local-seo-2026-operators-manual/');
  for(const [from,to] of Object.entries(redirects)){
    assert.notEqual(from,to);
    assert.equal(redirects[to],undefined,from+' chains through '+to);
    assert.equal(isRetiredPath(to),false,from+' targets a retired URL');
  }
});

test('only inventoried retired paths are gone; unknown, live and protected paths remain distinct',()=>{
  for(const row of inventory.filter(row=>row.action==='410')){
    assert.equal(isRetiredPath(row.path),true);
    assert.equal(isRetiredPath(row.path.replace(/\/$/,'')),true);
    assert.equal(isRetiredPath(decodeURIComponent(row.path)),true);
  }
  for(const path of ['/','/about/','/services/seo/','/admin/','/api/inquiries/','/new-unknown-route/','/%invalid/'])assert.equal(isRetiredPath(path),false);
});

test('migrated content keeps citations and rewrites owned legacy links without losing queries or fragments',()=>{
  assert.equal(canonicalContentLink('https://zincdigital.co/service/seo/?utm_source=article#overview'),'/services/seo/?utm_source=article#overview');
  assert.equal(canonicalContentLink('/about-us/'),'/about/');
  for(const url of ['https://example.com/about-us/','mailto:info@example.com','#section-1','/assets/guide.pdf'])assert.equal(canonicalContentLink(url),url);
});
