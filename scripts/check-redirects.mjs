#!/usr/bin/env node
// Every inventoried legacy URL, direct replacements, and unknown paths on a built-site or Vercel preview.
import {redirects,retiredPaths} from '../src/data/redirects.ts';
const args=process.argv.slice(2);
const base=args.includes('--base')?args[args.indexOf('--base')+1]:'http://127.0.0.1:4329';
const failures=[],targets=new Map();
let checked=0;
const get=path=>fetch(new URL(path,base),{redirect:'manual',signal:AbortSignal.timeout(15000)});
for(const [from,to] of Object.entries(redirects)){
  for(const path of new Set([from,from.replace(/\/$/,'')])){
    const response=await get(path);checked++;
    if(response.status!==301||new URL(response.headers.get('location')||'/',base).pathname!==to)failures.push(path+' expected 301 '+to+', got '+response.status+' '+response.headers.get('location'));
  }
  if(!targets.has(to))targets.set(to,await get(to));
  if(targets.get(to).status!==200)failures.push(from+' does not have a live, single-hop destination: '+to);
}
for(const from of retiredPaths)for(const path of new Set([from,from.replace(/\/$/,'')])){
  const response=await get(path);checked++;
  if(response.status!==410||response.headers.has('location')||!response.headers.get('x-robots-tag')?.includes('noindex'))failures.push(path+' expected a non-indexable 410, got '+response.status);
}
for(let i=0;i<20;i++){
  const path='/__unknown-launch-test-'+i+'/',response=await get(path);checked++;
  if(response.status!==404)failures.push(path+' expected 404, got '+response.status);
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log('Redirects: '+checked+' requests passed; '+targets.size+' live targets; 20 unknown paths remain 404.');
