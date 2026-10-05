export function serpText(data:any){
 if(!Array.isArray(data.organic_results)||!data.organic_results.length)throw new Error('No organic results were returned.');
 const results=data.organic_results.slice(0,20).map((r:any)=>({title:String(r.title||''),url:String(r.link||''),snippet:String(r.snippet||'')}));
 return {results,text:results.map((r:any,i:number)=>`${i+1}. ${r.title}\n${r.url}\n${r.snippet}`).join('\n\n')};
}
export async function searchSerp(query:string,key:string){
 if(!key)throw new Error('SERP sources are not enabled. Connect SerpAPI first.');
 const url=new URL('https://serpapi.com/search.json');url.search=new URLSearchParams({engine:'google',q:query,num:'20',api_key:key}).toString();
 const res=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error('The search provider could not return results.');return serpText(await res.json());
}
