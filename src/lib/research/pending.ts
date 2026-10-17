type Message={id:number;role:string;status:string};
type Job={id:string;payload:{assistant_id?:number}};
/** Resume every unfinished message's own saved request; newest-first order is not identity. */
export function pendingResearchJobs(messages:Message[],jobs:Job[]){
 const unfinished=new Set(messages.filter(message=>message.role==='assistant'&&message.status==='streaming').map(message=>message.id));
 const seen=new Set<number>();
 return jobs.flatMap(job=>{
  const id=job.payload.assistant_id;
  if(typeof id!=='number'||!unfinished.has(id)||seen.has(id))return [];
  seen.add(id);return[{id:job.id,assistant_id:id}];
 });
}
