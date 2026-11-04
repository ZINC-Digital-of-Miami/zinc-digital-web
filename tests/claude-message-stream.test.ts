import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readClaudeMessage} from '../src/lib/claude-message-stream.ts';
const frame=(value:unknown)=>'event: '+(value as any).type+'\r\ndata: '+JSON.stringify(value)+'\r\n\r\n';
const start={type:'message_start',message:{id:'msg_test',model:'claude-opus-5-5',usage:{input_tokens:20,output_tokens:1},content:[]}};
test('fragmented SSE preserves UTF-8, ordered initial text and cumulative usage while excluding thinking',async()=>{
 const data=': keepalive\r\n\r\n'+[start,{type:'ping'},{type:'content_block_start',index:0,content_block:{type:'thinking',thinking:'SECRET'}},{type:'content_block_delta',index:0,delta:{type:'thinking_delta',thinking:'SECRET'}},{type:'content_block_start',index:2,content_block:{type:'text',text:'🦉'}},{type:'content_block_start',index:1,content_block:{type:'text',text:'Hello caf'}},{type:'content_block_delta',index:1,delta:{type:'text_delta',text:'é '}},{type:'message_delta',delta:{stop_reason:null},usage:{output_tokens:3}},{type:'message_delta',delta:{stop_reason:'end_turn'},usage:{output_tokens:7}},{type:'message_stop'}].map(frame).join('');
 const bytes=new TextEncoder().encode(data),progress:any[]=[];
 const body=new ReadableStream({start(c){for(const byte of bytes)c.enqueue(new Uint8Array([byte]));c.close();}});
 const result=await readClaudeMessage(new Response(body,{headers:{'content-type':'text/event-stream'}}),async m=>{progress.push(structuredClone(m));});
 assert.equal(result.content.map(c=>c.text).join(''),'Hello café 🦉');assert.equal(result.usage.output_tokens,7);assert.equal(result.usage.input_tokens,20);assert.equal(progress[0].usage.output_tokens,1);assert.doesNotMatch(JSON.stringify([result,progress]),/SECRET|thinking|signature/);
});
test('provider error and receipt-write failure cancel the stream without a fallback',async()=>{
 let cancelled=false;
 const body=new ReadableStream({start(c){c.enqueue(new TextEncoder().encode(frame(start)));},cancel(){cancelled=true;}});
 await assert.rejects(()=>readClaudeMessage(new Response(body,{headers:{'content-type':'text/event-stream'}}),async()=>{throw new Error('Receipt write failed');}),/Receipt write/);assert.equal(cancelled,true);
 const error=new Response(frame(start)+frame({type:'error',error:{type:'overloaded_error'}}),{headers:{'content-type':'text/event-stream'}});
 await assert.rejects(()=>readClaudeMessage(error,async()=>{}),/overloaded_error/);
});
test('body abort is rejected after the early provider identity is retained',async()=>{
 let identity:any,controller:ReadableStreamDefaultController<Uint8Array>;
 const body=new ReadableStream<Uint8Array>({start(c){controller=c;c.enqueue(new TextEncoder().encode(frame(start)));}});
 await assert.rejects(()=>readClaudeMessage(new Response(body,{headers:{'content-type':'text/event-stream'}}),async m=>{identity=structuredClone(m);controller.error(new DOMException('Aborted','AbortError'));}),/Aborted/);
 assert.equal(identity.id,'msg_test');assert.equal(identity.usage.input_tokens,20);
});
test('an unexpected response type cancels its body',async()=>{
 let cancelled=false;const body=new ReadableStream({cancel(){cancelled=true;}});
 await assert.rejects(()=>readClaudeMessage(new Response(body,{headers:{'content-type':'application/json'}}),async()=>{}),/expected event stream/);
 assert.equal(cancelled,true);
});
