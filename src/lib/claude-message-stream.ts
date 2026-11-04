type Message={id:unknown;model:unknown;stop_reason:unknown;usage:Record<string,unknown>;content:{type:'text';text:string}[]};
const record=(v:unknown):Record<string,unknown>|null=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:null;

/** Consume provider SSE without retaining thinking/signature deltas or retrying the request. */
export async function readClaudeMessage(response:Response,onProgress:(message:Message)=>Promise<void>){
 if(!response.body)throw new Error('Claude did not return the expected event stream.');
 if(!response.headers.get('content-type')?.includes('text/event-stream')){await response.body.cancel().catch(()=>{});throw new Error('Claude did not return the expected event stream.');}
 const reader=response.body.getReader(),decoder=new TextDecoder(),blocks=new Map<number,string>();
 let message:Message|null=null,buffer='',stopped=false,terminalUsage=false;
 const frame=async(value:string)=>{
  const data=value.split(/\r?\n/).filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n');
  if(!data)return;
  let event:Record<string,unknown>|null;try{event=record(JSON.parse(data));}catch{throw new Error('Claude returned an invalid stream event.');}
  if(!event)throw new Error('Claude returned an invalid stream event.');
  if(event.type==='error'){const error=record(event.error);throw new Error('Claude stream failed ('+String(error?.type||'provider error').slice(0,80)+'). No retry was made.');}
  if(event.type==='message_start'){
   if(message)throw new Error('Claude repeated the stream start.');
   const start=record(event.message);if(!start||!record(start.usage))throw new Error('Claude stream identity or usage was missing.');
   message={id:start.id,model:start.model,stop_reason:null,usage:{...record(start.usage)},content:[]};
   if(Array.isArray(start.content))start.content.forEach((value,index)=>{const block=record(value);if(block?.type==='text'&&typeof block.text==='string')blocks.set(index,block.text);});
   await onProgress(message);
  }else if(event.type==='content_block_start'||event.type==='content_block_delta'){
   if(!message)throw new Error('Claude sent content before its stream identity.');
   const block=record(event.type==='content_block_start'?event.content_block:event.delta);
   if(block?.type==='text'||block?.type==='text_delta'){
    if(typeof event.index!=='number'||!Number.isSafeInteger(event.index)||event.index<0||typeof block.text!=='string')throw new Error('Claude returned an invalid text block.');
    blocks.set(event.index,(event.type==='content_block_start'?'':blocks.get(event.index)||'')+block.text);
   }
  }else if(event.type==='message_delta'){
   if(!message)throw new Error('Claude sent usage before its stream identity.');
   const delta=record(event.delta),usage=record(event.usage);
   if(delta&&delta.stop_reason!==undefined)message.stop_reason=delta.stop_reason;
   if(delta&&delta.model!==undefined)message.model=delta.model;
   for(const key of ['input_tokens','output_tokens'])if(usage?.[key]!==undefined)message.usage[key]=usage[key];
   if(delta?.stop_reason!==undefined&&delta.stop_reason!==null)terminalUsage=typeof delta.stop_reason==='string'&&typeof usage?.output_tokens==='number'&&Number.isFinite(usage.output_tokens)&&usage.output_tokens>=0;
   await onProgress(message);
  }else if(event.type==='message_stop'){
   if(!message)throw new Error('Claude stopped before its stream identity.');
   if(!terminalUsage)throw new Error('Claude stopped without a terminal usage receipt. Partial counters are not final totals.');
   stopped=true;message.content=[...blocks].sort(([a],[b])=>a-b).map(([,text])=>({type:'text',text}));
  }
 };
 try{
  while(!stopped){
   const {value,done}=await reader.read();buffer+=decoder.decode(value,{stream:!done});
   let boundary:RegExpMatchArray|null;
   while((boundary=buffer.match(/\r?\n\r?\n/))){const value=buffer.slice(0,boundary.index);buffer=buffer.slice(boundary.index!+boundary[0].length);await frame(value);if(stopped)break;}
   if(done){if(!stopped&&buffer.trim())await frame(buffer);break;}
  }
  if(!message||!stopped)throw new Error('Claude stream ended before message_stop. No recommendations were accepted; partial usage is not a final receipt.');
  return message as Message;
 }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
