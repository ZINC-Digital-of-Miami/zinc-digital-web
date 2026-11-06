import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pageMarkdown,markdownRoutes} from '../src/lib/agent-content.ts';
const site='https://www.zincdigital.co';
test('agent Markdown preserves the complete public body, useful links and every informative photograph',()=>{
 const photos=Array.from({length:8},(_,i)=>`<figure><img src="/photos/work-${i}.webp" alt="Work photograph ${i}" loading="lazy"><figcaption>Stage ${i}</figcaption></figure>`).join('');
 const html=`<html><head><title>Project | ZINC</title></head><body><header>Navigation</header><main><h1>Project</h1><p>The published account.</p>${photos}<a href="/services/web-design/">Website design</a><table><tr><th>Part</th><th>Status</th></tr><tr><td>Website</td><td>Published</td></tr></table><script>Private script</script><form><input value="Private field"></form></main></body></html>`;
 const md=pageMarkdown(html,site+'/work/project/');
 for(let i=0;i<8;i++)assert.ok(md.includes(`![Work photograph ${i}](${site}/photos/work-${i}.webp)`));
 assert.ok(md.includes(`[Website design](${site}/services/web-design/)`));assert.match(md,/\| Part \| Status \|/);assert.doesNotMatch(md,/Private script|Private field|<html|Navigation/);
});
test('Markdown negotiation is limited to generated canonical public paths and keeps HTML as the normal response',()=>{
 const routes=markdownRoutes(['/','/blog/example/']);
 const md=routes.find(r=>r.has?.length)!;
 const pattern=new RegExp(md.has![0].value!);
 assert.ok(pattern.test('text/markdown'));assert.ok(!pattern.test('text/html'));assert.ok(!pattern.test('text/markdown;q=0'));
 assert.ok(!JSON.stringify(routes).includes('/admin/'));assert.throws(()=>markdownRoutes(['/admin/']));
 assert.ok(routes.some(r=>r.headers?.['Content-Type']==='text/markdown; charset=utf-8'));
 assert.ok(routes.every(r=>r.headers?.Vary==='Accept'));
});

test('Markdown includes inactive published photographs while excluding private form content',()=>{
 const md=pageMarkdown('<title>Gallery</title><main><h1>Gallery</h1><div aria-hidden="true"><img src="/gallery.webp?dpl=build" alt="Crew at a completed dock"></div><form><img src="/form.webp" alt="Private form"><input value="Private name"></form></main>',site+'/work/gallery/');
 assert.match(md,/!\[Crew at a completed dock\]\(https:\/\/www.zincdigital.co\/gallery.webp\)/);assert.doesNotMatch(md,/Private form|Private name|dpl=build/);
});
