import {extractText} from 'unpdf';
import mammoth from 'mammoth';
import {FILE_LIMIT,fileInput} from './text.ts';
export async function extractFile(name:string,type:string,bytes:Uint8Array){
 const {ext}=fileInput(name,bytes.byteLength,type);if(bytes.byteLength>FILE_LIMIT)throw new Error('The file exceeds 10 MB.');
 let text:string;
 if(ext==='pdf'){
  text=(await extractText(new Uint8Array(bytes),{mergePages:true})).text;
 }else if(ext==='docx')text=(await mammoth.extractRawText({buffer:Buffer.from(bytes)})).value;
 else text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
 if(!text.trim())throw new Error('The file has no extractable text. Encrypted or scanned files need a readable version.');
 if(text.length>200000)throw new Error('Extracted text exceeds 200,000 characters.');return text;
}
