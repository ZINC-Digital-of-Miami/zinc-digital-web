import {readFile,writeFile} from 'node:fs/promises';
import {pageMarkdown} from '../src/lib/agent-content.ts';

/** Export only routes in this build's canonical public sitemap; drafts and private routes never enter it. */
export async function generateAgentContent(dir){
 const sitemap=await readFile(new URL('sitemap.xml',dir),'utf8');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]));
 const paths=[];
 for(const url of urls){
  if(url.origin!=='https://www.zincdigital.co'||!/^\/(?:[a-z0-9-]+\/)*$/.test(url.pathname)||/^\/(?:admin|api)(?:\/|$)/.test(url.pathname))throw new Error('Invalid public sitemap entry for Markdown export.');
  const file=new URL('.'+url.pathname+'index.html',dir);
  const html=await readFile(file,'utf8');
  if(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html))throw new Error('Noindex page entered the public Markdown export.');
  await writeFile(new URL('.'+url.pathname+'index.md',dir),pageMarkdown(html,url.href));
  paths.push(url.pathname);
 }
 return paths;
}
