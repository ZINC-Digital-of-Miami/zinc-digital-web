import {lookup} from 'node:dns/promises';
import {BlockList,isIP} from 'node:net';
import {domainToASCII} from 'node:url';
import {request as httpRequest} from 'node:http';
import {request as httpsRequest} from 'node:https';
const blocked=new BlockList();
for(const [address,prefix] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.88.99.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]] as const)blocked.addSubnet(address,prefix,'ipv4');
for(const [address,prefix] of [['::',128],['::1',128],['64:ff9b::',96],['100::',64],['2001::',23],['2001:db8::',32],['2002::',16],['fc00::',7],['fe80::',10],['ff00::',8]] as const)blocked.addSubnet(address,prefix,'ipv6');
export function publicAddress(address:string){
 const family=isIP(address);if(!family)return false;
 // BlockList also checks IPv4-mapped IPv6 addresses against the IPv4 entries.
 return !blocked.check(address,family===4?'ipv4':'ipv6');
}
export function sourceUrl(raw:string){
 const url=new URL(raw);
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password||(url.port&&!['80','443'].includes(url.port)))throw new Error('Use a public HTTP or HTTPS URL on port 80 or 443 without credentials.');
 let host=url.hostname.replace(/^\[|\]$/g,'').toLowerCase().replace(/\.$/,'');
 if(isIP(host)){if(!publicAddress(host))throw new Error('Private or reserved addresses cannot be fetched.');}
 else{host=domainToASCII(host);if(!host||host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||host==='metadata.google.internal')throw new Error('Choose a public hostname.');url.hostname=host;}
 return url;
}
type Address={address:string;family:number};
export type Resolver=(host:string)=>Promise<Address[]>;
export async function checkedAddresses(host:string,resolver:Resolver=h=>lookup(h,{all:true})){
 const addresses=await resolver(host);
 if(!addresses.length||addresses.some(x=>!publicAddress(x.address)))throw new Error('The hostname resolves to a private or reserved address.');
 return addresses;
}
export async function fetchSource(raw:string,resolver?:Resolver,transport?:typeof httpRequest):Promise<{text:string;url:string;type:string}>{
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 try{
  let url=sourceUrl(raw);
  for(let hop=0;hop<=3;hop++){
   const result=await new Promise<{text?:string;type?:string;redirect?:string}>((resolve,reject)=>{
    const request=transport||(url.protocol==='https:'?httpsRequest:httpRequest);
    const req=request(url,{signal:controller.signal,headers:{'user-agent':'ZINC-Research/1.0','accept':'text/html, text/plain, application/xhtml+xml'},lookup:(host,options,callback)=>{
     checkedAddresses(host,resolver).then(addresses=>{
      const family=typeof options==='number'?options:options.family;
      const selected=addresses.find(a=>!family||a.family===family);if(!selected){callback(new Error('No public address for this connection.'),'',4);return;}
      if(typeof options==='object'&&options.all)(callback as any)(null,[selected]);else callback(null,selected.address,selected.family);
     }).catch(e=>callback(e,'',4));
    }},res=>{
     if(res.statusCode&&[301,302,303,307,308].includes(res.statusCode)){res.destroy();if(!res.headers.location)return reject(new Error('The redirect has no destination.'));resolve({redirect:res.headers.location});return;}
     if(!res.statusCode||res.statusCode<200||res.statusCode>=300){res.destroy();reject(new Error('The source returned an unsuccessful response.'));return;}
     const type=String(res.headers['content-type']||'').split(';')[0].trim().toLowerCase();
     if(!['text/html','text/plain','application/xhtml+xml'].includes(type)){res.destroy();reject(new Error('The URL must return text or HTML.'));return;}
     let size=0;const parts:Buffer[]=[];
     res.on('data',(part:Buffer)=>{size+=part.length;if(size>2*1024*1024){reject(new Error('The URL exceeds the 2 MB limit.'));res.destroy();req.destroy();}else parts.push(part);});
     res.on('end',()=>resolve({text:Buffer.concat(parts).toString('utf8'),type}));res.on('error',reject);
    });req.on('error',()=>reject(new Error('The public source could not be fetched.')));req.end();
   });
   if(result.redirect){if(hop===3)throw new Error('The URL exceeds the redirect limit.');url=sourceUrl(new URL(result.redirect,url).href);continue;}
   return {text:result.text!,url:url.href,type:result.type!};
  }
  throw new Error('The URL exceeds the redirect limit.');
 }finally{clearTimeout(timer);}
}
// Enabled together with the adversarial URL tests in this milestone.
export const RESEARCH_URL_ENABLED=true;
