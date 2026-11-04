import {test} from 'node:test';
import assert from 'node:assert/strict';
import {trackRfp} from '../src/lib/rfp-tracking.ts';

test('RFP tags carry bounded context and never form values or error text',()=>{
 const ga:unknown[][]=[],clarity:unknown[][]=[];
 trackRfp('rfp_submit_error',{service_slug:'seo',error_type:'server',email:'private@example.com',message:'Private project'} as any,(...args)=>ga.push(args),(...args)=>clarity.push(args));
 assert.deepEqual(ga,[['event','rfp_submit_error',{send_to:'G-BV43HRVJ18',form_id:'proposal_request',service_slug:'seo',error_type:'server'}]]);
 assert.deepEqual(clarity,[['event','rfp_submit_error']]);
});
test('tracking failures and untrusted dimensions cannot interrupt an RFP',()=>{
 const calls:any[][]=[];
 trackRfp('contact_click',{service_slug:'private@example.com',contact_method:'mailto:private@example.com',error_type:'private error'},(...args)=>calls.push(args));
 assert.deepEqual(calls[0][2],{send_to:'G-BV43HRVJ18',form_id:'contact'});
 assert.doesNotThrow(()=>trackRfp('rfp_form_start',{},()=>{throw Error('blocked')},()=>{throw Error('blocked')}));
});

test('private messages carry a separate form identity and no RFP conversion',()=>{
 const ga:any[][]=[];
 for(const event of ['contact_message_sent','content_question_sent'] as const)trackRfp(event,{contact_method:'message',email:'private@example.com'} as any,(...args)=>ga.push(args));
 assert.deepEqual(ga.map(x=>[x[1],x[2].form_id]),[['contact_message_sent','message'],['content_question_sent','content_question']]);
 assert.doesNotMatch(JSON.stringify(ga),/generate_lead|private@example/);
});
