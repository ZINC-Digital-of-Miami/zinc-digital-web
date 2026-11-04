import type {Source} from './chat';
type SearchClient={rpc:(name:string,args:{p_project:string;p_query:string;p_limit:number})=>PromiseLike<{data:unknown;error:unknown}>};
/** Preserve precise matches first; natural-language questions rarely match every term in one chunk. */
export async function researchSources(db:SearchClient,project:string,text:string):Promise<Source[]>{
 const search=async(query:string)=>{
  const found=await db.rpc('search_chunks',{p_project:project,p_query:query,p_limit:8});
  if(found.error)throw new Error('Research sources could not be searched.');
  return(found.data||[]) as Source[];
 };
 const precise=await search(text);if(precise.length)return precise;
 // Quotes and operators from the question cannot change the broadened query syntax.
 const terms=[...new Set(text.toLowerCase().match(/[\p{L}\p{N}]{2,64}/gu)||[])].slice(0,64);
 if(terms.length<2)return precise;
 return search(terms.map(term=>'"'+term+'"').join(' OR '));
}
