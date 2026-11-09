import {test} from 'node:test';import assert from 'node:assert/strict';
import {emptyDraft,documentInput,reviewProgress,writingInstructions} from '../src/lib/content-studio/model.ts';
test('editing content invalidates all review receipts and ignores forged revision',()=>{const d=emptyDraft();d.revision=8;d.checks.voice={status:'pass',evidence:'Read complete revision 8'};const changed={...d,body:'Changed',revision:1000};const result=documentInput(changed,['seo'],d,'staff');assert.equal(result.revision,9);assert.equal(result.checks.voice.status,'pending');});
test('review evidence is mandatory and author/service cannot be invented',()=>{const d=emptyDraft();assert.throws(()=>documentInput({...d,author:'random'},['seo'],null,'x'));assert.throws(()=>documentInput({...d,service:'random'},['seo'],null,'x'));d.checks.voice.status='pass';assert.throws(()=>documentInput(d,['seo'],d,'x'));});
test('unchanged draft accepts evidence without claiming publishing approval',()=>{const d=emptyDraft();d.checks.voice={status:'pass',evidence:'Full read 1'};const next=documentInput(d,['seo'],d,'x');assert.equal(reviewProgress(next).complete,1);assert.equal('status' in next,false);assert.match(writingInstructions('wendy'),/US English/);assert.match(writingInstructions('kirk'),/Stern/);});
import {rankRows,rankComparison,observedSummary} from '../src/lib/content-studio/ranks.ts';
test('rank comparisons preserve missing baseline and weight by impressions',()=>{const rows=rankRows([{keys:['a'],clicks:1,impressions:10,position:2},{keys:['b'],clicks:9,impressions:90,position:10}]);assert.equal(observedSummary(rows).position,9.2);assert.equal(observedSummary(rows).ctr,.1);assert.equal(rankComparison(rows,[])[0].positionChange,null);assert.equal(rankComparison(rows,[{...rows[0],position:4}])[0].positionChange,2);assert.equal(rankRows([{keys:['bad'],clicks:NaN,impressions:1,position:1}]).length,0);});
import {inspectDraftHtml} from '../src/lib/content-studio/checks.ts';
test('structural checks distinguish image presence, alt text, table headers and unverified resources',()=>{const r=inspectDraftHtml('<h2>Example</h2><table><tr><td>Missing header</td></tr></table><img src="/x.png"><a href="/downloads/a.pdf">Download</a>');assert.equal(r.images[0].alt,'');assert.deepEqual(r.downloads,['/downloads/a.pdf']);assert.match(r.findings[0].observation,/0 with header/);assert.ok(r.findings.every(f=>f.needsReview));});
import {saveDisposition,canApplyProposal} from '../src/lib/content-studio/client-state.ts';
test('slow saves preserve newer edits and cannot replace a different document',()=>{const a={slug:'a',revision:1};assert.equal(saveDisposition(a,1,a,2),'newer-edits');assert.equal(saveDisposition(a,1,{slug:'b',revision:1},1),'other-document');assert.equal(saveDisposition(a,1,a,1),'replace');assert.equal(canApplyProposal(a,{slug:'b',revision:1},false),false);assert.equal(canApplyProposal(a,a,true),false);});
import {modelEvidence} from '../src/lib/content-studio/evidence.ts';
test('previous-only queries remain visible as unavailable current observations',()=>{const old={query:'lost',clicks:4,impressions:50,ctr:.08,position:3};const rows=rankComparison([], [old]);assert.equal(rows[0].query,'lost');assert.equal(rows[0].position,null);assert.equal(rows[0].previousPosition,3);});
test('large rank inventory produces bounded relevant model context',()=>{const inventory=Array.from({length:200},(_,i)=>({slug:'article-'+i,title:'Article '+i,service:'seo'}));const ranks=inventory.map(p=>({key:'content_studio:ranks:'+p.slug,value:{slug:p.slug,rows:Array.from({length:1000},(_,i)=>({query:'query '+i,impressions:i,position:5}))}}));const evidence=modelEvidence(ranks,inventory,'seo','article-199');assert.equal(evidence.ranks.length,8);assert.equal(evidence.ranks[0].slug,'article-199');assert.ok(JSON.stringify(evidence).length<50000);});

import {assertHandoff} from '../src/lib/content-studio/model.ts';
test('Wendy hold blocks even a fully documented review and incomplete manuscripts cannot be handed off',()=>{
 const d=emptyDraft('turn-subject-expertise-into-an-article-cluster');d.title='Reviewed';d.body='Complete manuscript';
 for(const check of Object.values(d.checks)){check.status='pass';check.evidence='Reviewed exact version';}
 assert.throws(()=>assertHandoff(d),/separate owner approval hold/);
 d.slug='another-article';assert.doesNotThrow(()=>assertHandoff(d));
 d.checks.voice.status='fail';assert.throws(()=>assertHandoff(d),/Complete every review/);
 d.checks.voice.status='pass';d.body=' ';assert.throws(()=>assertHandoff(d),/manuscript/);
});

test('mandatory review gates cannot be bypassed by marking everything inapplicable',()=>{const d=emptyDraft('another-article');d.title='Title';d.body='Body';for(const c of Object.values(d.checks)){c.status='not-applicable';c.evidence='Skip';}assert.equal(reviewProgress(d).complete,0);assert.throws(()=>assertHandoff(d),/Complete every review/);});
