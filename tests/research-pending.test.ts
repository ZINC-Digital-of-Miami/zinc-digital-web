import {test} from 'node:test';import assert from 'node:assert/strict';
import {pendingResearchJobs} from '../src/lib/research/pending.ts';
import {sourcesPrompt} from '../src/lib/research/chat.ts';
import {jobRequest} from '../src/lib/codex-state.ts';
test('keeps each unfinished assistant paired with its own request across multiple tabs',()=>{
 const messages=[{id:1,role:'assistant',status:'streaming'},{id:2,role:'assistant',status:'streaming'},{id:3,role:'assistant',status:'done'}];
 const jobs=[{id:'new',payload:{assistant_id:3}},{id:'b',payload:{assistant_id:2}},{id:'a',payload:{assistant_id:1}}];
 assert.deepEqual(pendingResearchJobs(messages,jobs),[{id:'b',assistant_id:2},{id:'a',assistant_id:1}]);
});
test('all eight full retrieved chunks fit subscription instructions without losing evidence',()=>{
 const sources=Array.from({length:8},(_,i)=>({id:i,idx:0,document_id:'doc'+i,title:'Source '+i,kind:'note',content:('Evidence '+i+' ').padEnd(3200,'x')}));
 const instructions=sourcesPrompt(sources);
 assert.ok(instructions.length>20000);
 assert.equal(jobRequest('research',{instructions,input:'A question'},'editor').instructions,instructions);
 assert.ok(instructions.includes(sources[7].content));
});
