export type Binding={slug:string;revision:number};
export const sameDocument=(a:Binding,b:Binding)=>a.slug===b.slug&&a.revision===b.revision;
export function saveDisposition(sent:Binding,sentEdit:number,current:Binding,currentEdit:number){return !sameDocument(sent,current)?'other-document':sentEdit!==currentEdit?'newer-edits':'replace';}
export const canApplyProposal=(job:Binding,draft:Binding,dirty:boolean)=>!dirty&&sameDocument(job,draft);
