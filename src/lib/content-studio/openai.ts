/** Direct Responses API writing. No subscription fallback, tools or implicit retries. */
export async function writeWithOpenAI(key:string,model:string,instructions:string,input:string,send:typeof fetch=fetch,onReceipt:(receipt:Record<string,unknown>)=>Promise<void>=async()=>{},effort='high',image=false,signal?:AbortSignal){
 if(!key||!model)throw new Error('Configure OPENAI_API_KEY and OPENAI_WRITING_MODEL securely in Vercel.');
 if(!['none','low','medium','high','xhigh','max'].includes(effort))throw new Error('Invalid configured writing effort.');
 if(!/^[a-zA-Z0-9._:-]{1,120}$/.test(model))throw new Error('Invalid configured writing model.');
 const response=await send('https://api.openai.com/v1/responses',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},signal:signal?AbortSignal.any([signal,AbortSignal.timeout(480000)]):AbortSignal.timeout(480000),body:JSON.stringify({model,reasoning:{effort},instructions,input,store:false,stream:true,max_output_tokens:24000,...(image?{tools:[{type:'image_generation',size:'1536x1024',quality:'high',output_format:'webp'}]}:{})})});
 const requestId=response.headers.get('x-request-id')||undefined;
 const reader=response.body?.getReader(),decoder=new TextDecoder();let buffer='',data:string[]=[],terminal:any=null,bytes=0,finalReceipt:ReturnType<typeof receiptFor>|null=null;
 const receiptFor=(r:any)=>{const content=(r.output||[]).filter((item:any)=>item.type==='message').flatMap((item:any)=>item.content||[]),text=content.filter((item:any)=>item.type==='output_text').map((item:any)=>item.text).join('\n');const usage=r.usage,validUsage=usage&&['input_tokens','output_tokens','total_tokens'].every(k=>typeof usage[k]==='number'&&Number.isFinite(usage[k])&&usage[k]>=0);return {images:(r.output||[]).filter((item:any)=>item.type==='image_generation_call'&&typeof item.result==='string').map((item:any)=>({id:item.id,mime:'image/webp',data:item.result})),provider:'openai',requestedModel:model,effort,model:r.model,responseId:r.id,providerRequestId:requestId,usage:validUsage?usage:undefined,usageUnavailable:!validUsage,responseStatus:r.status,rawResponse:text,refused:content.some((item:any)=>item.type==='refusal')};};
 const event=async()=>{
  if(!data.length)return;const raw=data.join('\n');data=[];if(raw==='[DONE]')return;
  let value:any;try{value=JSON.parse(raw);}catch{throw new Error('OpenAI returned an invalid stream event.');}
  if(value.type==='response.created')await onReceipt({provider:'openai',requestedModel:model,effort,providerRequestId:requestId,responseId:value.response?.id,usageUnavailable:true});
  if(['response.completed','response.incomplete','response.failed'].includes(value.type)){terminal=value.response;finalReceipt=receiptFor(terminal);await onReceipt(finalReceipt);}
  if(value.type==='error')throw new Error('OpenAI reported a stream error. Check the retained request ID before retrying.');
 };
 try{
  await onReceipt({provider:'openai',requestedModel:model,effort,providerRequestId:requestId,usageUnavailable:true});
  if(!response.ok)throw new Error('OpenAI writing request failed (HTTP '+response.status+'). Check the API project and model access. No automatic retry was made.');
  if(!reader)throw new Error('OpenAI returned no response stream.');
  while(!terminal){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>(image?24_000_000:8_000_000))throw new Error('OpenAI response exceeded the bounded manuscript limit.');buffer+=decoder.decode(chunk.value,{stream:true});let end:number;while(!terminal&&(end=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,end).replace(/\r$/,'');buffer=buffer.slice(end+1);if(!line)await event();else if(line.startsWith('data:'))data.push(line.slice(5).trimStart());}}
  if(!terminal){buffer+=decoder.decode();if(buffer.startsWith('data:'))data.push(buffer.slice(5).trim());await event();}
 }finally{if(reader){await reader.cancel().catch(()=>{});reader.releaseLock();}}
 if(!terminal||!finalReceipt)throw new Error('OpenAI stream ended without completion. The request may have incurred usage; do not repeat blindly.');
 const receipt=finalReceipt as ReturnType<typeof receiptFor>;
 if(terminal.status!=='completed'||(!receipt.rawResponse.trim()&&!(image&&receipt.images.length))||receipt.refused)throw new Error('OpenAI did not return a complete, non-refused manuscript. Its available response and usage were retained.');
 if(receipt.model!==model&&!String(receipt.model).startsWith(model+'-'))throw new Error('OpenAI returned an unexpected model. Its receipt was retained; no fallback is accepted.');
 if(receipt.usageUnavailable)throw new Error('OpenAI returned no valid usage receipt; manuscript retained for investigation.');
 return {...receipt,text:receipt.rawResponse};
}
