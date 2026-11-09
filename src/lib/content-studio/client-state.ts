export type Binding={slug:string;revision:number};
export const sameDocument=(a:Binding,b:Binding)=>a.slug===b.slug&&a.revision===b.revision;
export function saveDisposition(sent:Binding,sentEdit:number,current:Binding,currentEdit:number){return !sameDocument(sent,current)?'other-document':sentEdit!==currentEdit?'newer-edits':'replace';}
export const canApplyProposal=(job:Binding&{id?:string},draft:Binding,dirty:boolean,completedRequest='')=>!!completedRequest&&job.id===completedRequest&&!dirty&&sameDocument(job,draft);
