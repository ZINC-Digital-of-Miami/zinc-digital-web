import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {stripTypeScriptTypes} from 'node:module';import vm from 'node:vm';
import {safeNext} from '../src/lib/auth.ts';import {isPrivatePath,PRIVATE_ROUTES} from '../src/data/private-routes.ts';
test('every anonymous staff redirect is private and non-indexable before reaching its page',async()=>{
 const source=readFileSync('src/middleware.ts','utf8').replace(/^import .*;\n/gm,'').replace('export const onRequest','globalThis.onRequest');
 const context:any={defineMiddleware:(f:Function)=>f,isPrivatePath,safeNext,isConfigured:()=>false,Response,URL};vm.runInNewContext(stripTypeScriptTypes(source),context);
 for(const route of PRIVATE_ROUTES){if(!route.path.startsWith('/admin/'))continue;
  const result=await context.onRequest({url:new URL('https://www.zincdigital.co'+route.path),locals:{}},()=>{throw Error('Private page reached');});
  assert.equal(result.status,302);assert.match(result.headers.get('x-robots-tag'),/noindex/);assert.match(result.headers.get('cache-control'),/no-store/);
 }
});
