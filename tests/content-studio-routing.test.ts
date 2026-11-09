import {test} from 'node:test';import assert from 'node:assert/strict';
import {studioAction} from '../src/lib/content-studio/routing.ts';
import {readFileSync} from 'node:fs';
test('owner routing keeps reasoning separate from content and image work',()=>{
 for(const action of ['research','review','plan','develop','orchestrate'])assert.equal(studioAction(action).provider,'claude');
 for(const action of ['write','creative','image','chat'])assert.equal(studioAction(action).provider,'gpt');
 for(const action of ['__proto__','constructor','publish',undefined])assert.throws(()=>studioAction(action));
});
test('current SEO and Studio request paths use the new Claude secret without fallback',()=>{
 for(const file of ['src/pages/api/admin/content-studio/assist.ts','src/lib/seo-review-runner.ts','src/pages/api/admin/research/chat.ts','src/pages/api/admin/seo-fix.ts']){
 const source=readFileSync(file,'utf8');assert.match(source,/ZINC_ANTHROPIC_API_KEY/);assert.doesNotMatch(source,/import\.meta\.env\.ANTHROPIC_API_KEY|enqueueCodexJob/);
 }
});
