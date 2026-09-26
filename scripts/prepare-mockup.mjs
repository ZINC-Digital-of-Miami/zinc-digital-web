import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const root = process.cwd();
const scratch = path.join(root, '.scratch/phase01-mockup');
const read = p => fs.readFile(p, 'utf8');
const save = (p, value) => fs.writeFile(p, JSON.stringify(value, null, 2) + '\n');
const slugs = ['shopify','web-design','apps','seo','local-seo','ai-search-optimization','google-search-ads','shopping-ads','social-ads','tiktok-ads','business-intelligence'];
const htmlAt = p => read(path.join(root, 'dist', p, 'index.html')).catch(() => '');
const args = process.argv.slice(2);

if (args.includes('--verify-tracer') || args.includes('--verify-site')) {
  const home = await htmlAt('');
  assert.ok(home.includes('Other agencies deliver'), 'root renders the real homepage');
  const shop = await htmlAt('services/shopify');
  assert.ok(shop.includes('/contact/?service=shopify'), 'Shopify inquiry preselect link exists');
  const contact = await htmlAt('contact');
  assert.ok(contact.includes('Demo inquiry — no message will be sent'), 'contact declares non-sending demo');
  assert.ok(contact.includes('value="shopify"'), 'contact has Shopify checkbox');
  assert.ok((await htmlAt('thanks')).includes('Demo only — nothing was sent'), 'confirmation is honest');
  if (args.includes('--verify-site')) {
    const posts = JSON.parse(await read('src/data/posts.preview.json'));
    assert.equal(posts.posts.length, 18);
    const routes = ['', 'services', ...slugs.map(x => 'services/'+x), 'work', 'work/once-upon-a-book-club','work/us-oil-solutions','about','contact','thanks','blog',...posts.posts.map(x=>'blog/'+x.slug),'privacy','terms'];
    assert.equal(routes.length, 40);
    for (const p of routes) {
      const html = await htmlAt(p);
      assert.ok(html.includes('<h1') && html.includes('<main'), 'complete route '+p);
      assert.ok(html.length > 3000, 'nonempty body '+p);
    }
    for (const post of posts.posts) {
      const html = await htmlAt('blog/'+post.slug);
      assert.ok(html.includes('Draft migration preview'), 'article draft '+post.slug);
      assert.ok(html.includes('data-source-id="'+post.id+'"'), 'article identity '+post.id);
      assert.ok(post.blocks.length > 0 && post.plainTextLength > 100, 'source body '+post.id);
    }
    assert.equal((home.match(/data-home-band=/g)||[]).length, 9, 'nine home bands');
    console.log('PASS: 40 complete routes, 18 source bodies, 11 services, nine home bands');
  } else console.log('PASS: four-route tracer HTML contracts');
  process.exit(0);
}

if (args.includes('--check')) {
  const data = JSON.parse(await read('src/data/posts.preview.json'));
  assert.equal(data.posts.length, 18);
  assert.equal(new Set(data.posts.map(p=>p.id)).size,18);
  for (const p of data.posts) assert.ok(p.blocks.length && p.sourceUrl && p.date && p.author);
  const assets = JSON.parse(await read('src/data/assets.preview.json'));
  for (const asset of Object.values(assets)) {
    const m = await sharp('public'+asset.src).metadata();
    assert.equal(m.width,asset.width); assert.equal(m.height,asset.height);
  }
  console.log('PASS: 18 unique source articles and '+Object.keys(assets).length+' dimensioned assets');
  process.exit(0);
}

await fs.mkdir(scratch, {recursive:true});
await fs.mkdir('public/mockup', {recursive:true});
await fs.mkdir('src/data', {recursive:true});
const assetRoot = '/Volumes/Satechi Hub/ZINC Digital Agency';
const zip = path.join(assetRoot,'ZINC Digital Agency Website V2.zip');
const files = ['kirk-musick.png','bethany-mckinzie.png','priya-nahar.png','dr-basset.png','martin-stewart.png','ouabc-hero.png','ouabc-site.jpg','ouabc-mobile.jpg','uos-app-desktop.png','uos-app-phone.png'];
const assets = {};
async function convert(name, input, source) {
  const original = await sharp(input).metadata();
  const output = 'public/mockup/'+name+'.webp';
  await sharp(input).webp({quality:90}).toFile(output);
  const result = await sharp(output).metadata();
  assets[name] = {src:'/mockup/'+name+'.webp',width:result.width,height:result.height,source,sourceWidth:original.width,sourceHeight:original.height,sha256:createHash('sha256').update(input).digest('hex')};
}
for (const file of files) await convert(file.replace(/\.(png|jpg)$/,''),execFileSync('unzip',['-p',zip,'assets/'+file],{maxBuffer:50*1024*1024}),zip+'#assets/'+file);
for (const [name,file] of Object.entries({'mark-black':'Graphics/ZINC Fusion Icons .png','mark-white':'Graphics/zinc white fusion icon.png','wordmark-black':'docs/context/brand-assets/zinc-logo-primary-black-wordmark-transparent.png','wordmark-white':'docs/context/brand-assets/zinc-logo-primary-white-wordmark-transparent.png'})) {
  const source = path.join(assetRoot,file);
  await convert(name,await fs.readFile(source),source);
}
await sharp(path.join(assetRoot,'Graphics/ZINC Fusion Icons .png')).resize(96,96).png().toFile('public/favicon.png');
await save('src/data/assets.preview.json',assets);

const endpoint = 'https://www.zincdigital.co/wp-json/wp/v2/posts?per_page=100&status=publish&_fields=id,slug,link,date,date_gmt,modified,modified_gmt,author,title,content';
const response = await fetch(endpoint,{signal:AbortSignal.timeout(30000)});
assert.equal(response.status,200,'public source response');
const raw = await response.json();
assert.equal(Number(response.headers.get('x-wp-total')),18,'source count changed; reconcile before continuing');
assert.equal(Number(response.headers.get('x-wp-totalpages')),1,'source pagination');
assert.equal(raw.length,18,'complete source inventory');
assert.equal(new Set(raw.map(p=>p.id)).size,18);
assert.deepEqual(raw.map(p=>p.id).sort((a,b)=>a-b),[56328,55980,55886,...Array.from({length:15},(_,i)=>55708+i)].sort((a,b)=>a-b),'source identity inventory changed; reconcile before continuing');
await save(path.join(scratch,'posts.raw.json'),raw);
const authors = {};
for (const id of new Set(raw.map(p=>p.author))) {
  const res = await fetch('https://www.zincdigital.co/wp-json/wp/v2/users/'+id+'?_fields=id,name,description,link',{signal:AbortSignal.timeout(30000)});
  authors[id] = res.ok ? await res.json() : {id,name:'[OWNER CONFIRM]',description:''};
}
await save(path.join(scratch,'authors.raw.json'),authors);
const options = new chrome.Options().addArguments('--headless=new','--no-first-run','--disable-background-networking','--user-data-dir='+path.join(scratch,'source-browser'));
const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(new chrome.ServiceBuilder(path.join(root,'node_modules/chromedriver/lib/chromedriver/chromedriver'))).build();
let posts;
try {
  await driver.get('about:blank');
  // A malicious-source probe traverses exactly the same parser as the real articles.
  const probe={id:-1,slug:'sanitizer-probe',link:'https://www.zincdigital.co/probe/',date:'2026-01-01',date_gmt:'2026-01-01',author:-1,title:{rendered:'Probe'},content:{rendered:'<p>Safe &amp; complete <a href="javascript:alert(1)" onclick="alert(2)">unsafe URL</a><script>window.sourceExecuted=true</script></p><h2>Heading</h2><ul><li>Item</li></ul><iframe src="https://example.test"></iframe>'}};
  posts = await driver.executeScript(function(input, authors) {
    const decode = html => new DOMParser().parseFromString(html,'text/html').body.textContent.trim();
    return input.map(post => {
      const doc = new DOMParser().parseFromString(post.content.rendered,'text/html');
      doc.querySelectorAll('script,style,iframe,object,embed,form,input,button,textarea,select,svg,noscript').forEach(el=>el.remove());
      const safeUrl = value => {try {const u=new URL(value,post.link);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}};
      const inline = el => Array.from(el.childNodes).flatMap(n=> {
        if(n.nodeType===3) return [{text:n.textContent}];
        if(n.nodeType!==1) return [];
        if(n.tagName==='BR') return [{text:'\n'}];
        const href=n.tagName==='A'?safeUrl(n.getAttribute('href')):null;
        return href?[{text:n.textContent,href}]:inline(n);
      });
      const blocks=[];
      function walk(el) {
        for(const n of el.childNodes) {
          if(n.nodeType===3 && n.textContent.trim()) blocks.push({type:'p',runs:[{text:n.textContent.trim()}]});
          if(n.nodeType!==1) continue;
          if (/^H[1-6]$/.test(n.tagName)) blocks.push({type:'heading',runs:inline(n)});
          else if(['P','BLOCKQUOTE','PRE','FIGCAPTION'].includes(n.tagName)) {if(n.textContent.trim()) blocks.push({type:n.tagName==='BLOCKQUOTE'?'quote':'p',runs:inline(n)});}
          else if(['UL','OL'].includes(n.tagName)) blocks.push({type:n.tagName==='OL'?'ol':'ul',items:Array.from(n.children).filter(c=>c.tagName==='LI').map(c=>inline(c))});
          else if(n.tagName==='TABLE') {for(const tr of n.querySelectorAll('tr')) blocks.push({type:'p',runs:[{text:Array.from(tr.cells).map(c=>c.textContent.trim()).join(' · ')}]});}
          else walk(n);
        }
      }
      walk(doc.body);
      return {id:post.id,slug:post.slug,title:decode(post.title.rendered),sourceUrl:post.link,date:post.date,dateGmt:post.date_gmt,modified:post.modified,modifiedGmt:post.modified_gmt,author:{id:post.author,name:authors[post.author].name,description:authors[post.author].description||''},plainTextLength:doc.body.textContent.trim().length,blocks};
    });
  },[...raw,probe],{...authors,[-1]:{name:'Probe',description:''}});
  const sanitized=posts.pop();
  assert.equal(sanitized.blocks.length,3,'sanitizer preserves substantive blocks');
  assert.equal(sanitized.blocks[0].runs.map(r=>r.text).join(''),'Safe & complete unsafe URL');
  assert.ok(!JSON.stringify(sanitized.blocks).includes('javascript:')&&!JSON.stringify(sanitized.blocks).includes('sourceExecuted'),'sanitizer drops executable payloads');
  assert.equal(await driver.executeScript('return window.sourceExecuted===true'),false,'source HTML never executes');
  await save(path.join(scratch,'sanitizer-check.json'),{checkedAt:new Date().toISOString(),probe:'script,iframe,event handler,javascript URL',preservedBlocks:3,passed:true});
} finally {await driver.quit();}
for(const p of posts) {
  p.sourceSlug=p.slug;p.sourceTitle=p.title;
  if(p.id===56328) p.slug='ai-search-results-and-generative-search-optimization';
  const normalize=text=>text.replace(/\bGEO\b/g,'generative search optimization');
  p.title=normalize(p.title);
  if(p.id===56328) p.title='AI Search Results and Generative Search Optimization: What Businesses Need to Know';
  for(const b of p.blocks) for(const run of b.runs || b.items?.flat() || []) run.text=normalize(run.text);
  p.previewEdits=['Expanded legacy generative-search abbreviation; source title and slug retained in provenance.'];
  if(p.id===55980) {const before=p.blocks.length;p.blocks=p.blocks.filter(b=>!(b.runs?.map(r=>r.text).join('').startsWith('Bring us the feed')));if(p.blocks.length!==before)p.previewEdits.push('Omitted retired promotional coda beginning Bring us the feed; complete original retained in ignored raw source.');}
}
const localByUrl = new Map(posts.map(p=>[new URL(p.sourceUrl).pathname.replace(/\/$/,''),'/blog/'+p.slug+'/']));
for (const p of posts) for(const b of p.blocks) for(const run of b.runs || b.items?.flat() || []) if(run.href) {
  const u=new URL(run.href);
  if(['zincdigital.co','www.zincdigital.co'].includes(u.hostname)) {
    const local=localByUrl.get(u.pathname.replace(/\/$/,''));
    if(local) run.href=local;
    else if(/contact/.test(u.pathname)) run.href='/contact/';
    else if(/about|team/.test(u.pathname)) run.href='/about/';
    else if(/service/.test(u.pathname)) run.href='/services/';
    else if(/portfolio|work/.test(u.pathname)) run.href='/work/';
    else if(u.pathname==='/')run.href='/';
    else delete run.href;
  }
}
posts.sort((a,b)=>Date.parse(b.dateGmt+'Z')-Date.parse(a.dateGmt+'Z')||b.id-a.id);
await save('src/data/posts.preview.json',{source:endpoint,retrievedAt:new Date().toISOString(),total:18,totalPages:1,posts});
console.log('Prepared assets and source articles:',posts.map(p=>({id:p.id,title:p.title,blocks:p.blocks.length,characters:p.plainTextLength})));
