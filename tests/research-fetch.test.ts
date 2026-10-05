import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {Readable} from 'node:stream';
import {sourceUrl,publicAddress,checkedAddresses,fetchSource} from '../src/lib/research/fetch.ts';
const publicDNS=async()=>[{address:'93.184.216.34',family:4}];
test('URL fetch rejects loopback, metadata, private, CGNAT, reserved and normalized IP hosts',()=>{
 for(const host of ['localhost','localhost.','metadata.google.internal.','127.0.0.1','127.1','2130706433','0x7f000001','10.1.2.3','100.64.0.1','169.254.169.254','172.16.0.1','192.168.1.1','198.18.0.1','224.0.0.1','[::1]','[fc00::1]','[fe80::1]','[::ffff:127.0.0.1]','[::ffff:7f00:1]','[2001:db8::1]'])assert.throws(()=>sourceUrl('http://'+host+'/'),host);
 for(const url of ['file:///etc/passwd','ftp://example.com/','https://user:pass@example.com/','http://example.com:3000/'])assert.throws(()=>sourceUrl(url));
 assert.equal(sourceUrl('https://EXAMPLE.COM./x').hostname,'example.com');assert.equal(publicAddress('2606:4700:4700::1111'),true);
});
test('rejects any private DNS answer, including mixed and mapped answers',async()=>{
 for(const address of ['127.0.0.1','10.0.0.1','100.64.0.1','::ffff:192.168.1.1'])await assert.rejects(checkedAddresses('public.example',async()=>[...await publicDNS(),{address,family:address.includes(':')?6:4}]));
 await assert.rejects(checkedAddresses('public.example',async()=>[]));
});
function transport(responses:any[],connected:string[]=[]):any{return (url:URL,options:any,receive:any)=>{
 const req:any=new EventEmitter();req.destroy=()=>{};
 req.end=()=>{
  options.signal.addEventListener('abort',()=>req.emit('error',new Error('timeout')),{once:true});
  options.lookup(url.hostname,{all:true},(error:any,addresses:any[])=>{
   if(error){req.emit('error',error);return;}connected.push(addresses[0].address);
   const sample=responses.shift();if(sample?.slow)return;
   const response:any=Readable.from((sample?.body||['Public source']).map((x:any)=>Buffer.from(x)));response.statusCode=sample?.status||200;response.headers=sample?.headers||{'content-type':'text/plain'};receive(response);
  });
 };return req;
};}
test('connects to the validated DNS answer, accepts text and rechecks redirects',async()=>{
 const connections:string[]=[];let calls=0;
 const resolver=async()=>{calls++;return publicDNS();};
 const result=await fetchSource('https://example.com/',resolver,transport([{status:302,headers:{location:'/next'}},{body:['Evidence']}],connections));
 assert.equal(result.text,'Evidence');assert.equal(result.url,'https://example.com/next');assert.equal(calls,2);assert.deepEqual(connections,['93.184.216.34','93.184.216.34']);
 await assert.rejects(fetchSource('https://example.com/',publicDNS,transport([{status:302,headers:{location:'http://169.254.169.254/latest/'}}])));
 let count=0;await assert.rejects(fetchSource('https://example.com/',async()=>++count===1?publicDNS():[{address:'127.0.0.1',family:4}],transport([{status:302,headers:{location:'https://changed.example/'}}])));
});
test('rejects binary, oversized and excessive redirect responses',async()=>{
 await assert.rejects(fetchSource('https://example.com/',publicDNS,transport([{headers:{'content-type':'application/octet-stream'}}])));
 await assert.rejects(fetchSource('https://example.com/',publicDNS,transport([{body:[Buffer.alloc(2*1024*1024+1)]}])));
 await assert.rejects(fetchSource('https://example.com/',publicDNS,transport(Array.from({length:4},()=>({status:302,headers:{location:'/again'}})))));
});
test('cuts off a slow response after the total ten-second deadline',async()=>{
 const start=Date.now();await assert.rejects(fetchSource('https://example.com/',publicDNS,transport([{slow:true}])));assert.ok(Date.now()-start<11000);
});
