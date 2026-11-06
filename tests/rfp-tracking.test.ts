import {test} from 'node:test';
import assert from 'node:assert/strict';
import {trackRfp} from '../src/lib/rfp-tracking.ts';

test('RFP tags carry bounded context and never form values or error text',()=>{
 const ga:unknown[][]=[],clarity:unknown[][]=[];
 trackRfp('rfp_submit_error',{service_slug:'seo',error_type:'server',email:'private@example.com',message:'Private project'} as any,(...args)=>ga.push(args),(...args)=>clarity.push(args));
 assert.deepEqual(ga,[['event','rfp_submit_error',{send_to:'G-BV43HRVJ18',form_id:'proposal_request',service_slug:'seo',error_type:'server'}]]);
 assert.deepEqual(clarity,[['set','form_id','proposal_request'],['set','rfp_service','seo'],['event','rfp_submit_error']]);
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


test('service views do not claim that a visitor opened a proposal form',()=>{
 const ga:any[][]=[],clarity:any[][]=[];
 trackRfp('view_service',{service_slug:'seo'},(...v:any[])=>ga.push(v),(...v:any[])=>clarity.push(v));
 assert.doesNotMatch(JSON.stringify(ga[0]),/form_id/);
 assert.ok(!clarity.some(v=>v[0]==='set'&&v[1]==='form_id'));
});


test('blog and download engagement carries only bounded public choices, never RFP form identity',async()=>{
 const module=await import('../src/lib/rfp-tracking.ts');
 const trackContent=(module as any).trackContent;
 assert.equal(typeof trackContent,'function');
 const ga:any[][]=[],cl:any[][]=[];
 const values={service_slug:'ai-search-optimization',content_layer:'Demand',file_name:'campaign-link-register.csv',email:'private@example.com'};
 trackContent('resource_download',values,(...v:any[])=>ga.push(v),(...v:any[])=>cl.push(v));
 assert.deepEqual(ga[0],['event','resource_download',{send_to:'G-BV43HRVJ18',service_slug:'ai-search-optimization',content_layer:'Demand',file_name:'campaign-link-register.csv',file_extension:'csv'}]);
 assert.doesNotMatch(JSON.stringify(ga[0]),/form_id/);
 assert.ok(cl.some(v=>v[0]==='event'&&v[1]==='resource_download'));
 ga.length=0;cl.length=0;
 trackContent('blog_filter_change',{service_slug:'private@example.com',content_layer:'Private customer',file_name:'private@example.com'},(...v:any[])=>ga.push(v),(...v:any[])=>cl.push(v));
 assert.deepEqual(ga[0],['event','blog_filter_change',{send_to:'G-BV43HRVJ18'}]);
 assert.doesNotMatch(JSON.stringify([...ga,...cl]),/private@example|Private customer/);
});
