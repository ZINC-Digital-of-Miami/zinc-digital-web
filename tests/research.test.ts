import {test} from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import {chunk,pageText,fileInput} from '../src/lib/research/text.ts';
import {extractFile} from '../src/lib/research/files.ts';
import {serpText} from '../src/lib/research/serp.ts';
test('chunks preserve overlap, bound ingestion and discard noncontent HTML',()=>{
 const input='a'.repeat(200000),parts=chunk(input);assert.ok(parts.length<=120);assert.equal(parts[0].length,3200);assert.equal(parts[0].slice(-480),parts[1].slice(0,480));assert.throws(()=>chunk('a'.repeat(200001)));assert.throws(()=>chunk(' '));
 assert.equal(pageText('<script>bad()</script><style>bad</style><p>Good &amp; useful &#65;</p>'),'Good & useful A');
});
test('file validation refuses oversized files and mismatched types',()=>{
 assert.throws(()=>fileInput('document.pdf',11*1024*1024,'application/pdf'));assert.throws(()=>fileInput('document.exe',100,'application/pdf'));assert.throws(()=>fileInput('document.pdf',100,'text/plain'));assert.equal(fileInput('notes.md',100,'text/plain').type,'text/markdown');
});
function pdf(encrypted=false){
 const stream='BT /F1 12 Tf 30 100 Td (Reliable PDF evidence) Tj ET';
 const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 200] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
 if(encrypted)objects.push('<< /Filter /Standard /V 1 /R 2 /Length 40 /O <'+ '00'.repeat(32)+'> /U <'+'00'.repeat(32)+'> /P -4 >>');
 let output='%PDF-1.4\n';const offsets=[0];objects.forEach((value,i)=>{offsets.push(Buffer.byteLength(output));output+=(i+1)+' 0 obj\n'+value+'\nendobj\n';});
 const xref=Buffer.byteLength(output);output+='xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objects.length+1)+' /Root 1 0 R '+(encrypted?'/Encrypt 6 0 R /ID [<'+ '00'.repeat(16)+'> <'+'00'.repeat(16)+'>]':'')+' >>\nstartxref\n'+xref+'\n%%EOF';return Buffer.from(output);
}
test('extracts actual PDF, DOCX, TXT and Markdown files; rejects encrypted and invalid files',async()=>{
 assert.match(await extractFile('evidence.pdf','application/pdf',pdf()),/Reliable PDF evidence/);
 const zip=new JSZip();zip.file('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
 zip.file('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Reliable DOCX evidence</w:t></w:r></w:p></w:body></w:document>');
 assert.match(await extractFile('evidence.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',await zip.generateAsync({type:'uint8array'})),/Reliable DOCX evidence/);
 for(const [name,type]of [['evidence.txt','text/plain'],['evidence.md','text/markdown']])assert.equal(await extractFile(name,type,Buffer.from('Readable source')),'Readable source');
 await assert.rejects(extractFile('encrypted.pdf','application/pdf',pdf(true)));await assert.rejects(extractFile('invalid.pdf','application/pdf',Buffer.from('invalid')));
});
test('SERP sources preserve only the first twenty organic results',()=>{
 const data=serpText({organic_results:Array.from({length:25},(_,i)=>({title:'Result '+i,link:'https://example.com/'+i,snippet:'Evidence '+i}))});assert.equal(data.results.length,20);assert.match(data.text,/20\. Result 19/);assert.ok(!data.text.includes('Result 20'));assert.throws(()=>serpText({}));
});
