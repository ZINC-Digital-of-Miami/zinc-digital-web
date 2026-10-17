import { post } from './shell';
import { measureSnippet,snippetProfiles } from '../../lib/seo-pixels';
import type { SeoProposal } from '../../lib/seo-agent';
const pending = new WeakSet<HTMLElement>();
export async function analyzeEditor(report: HTMLElement) {
  if (pending.has(report)) return;
  const form=report.closest<HTMLFormElement>('[data-admin-form]');if(!form)return;
  const button=report.querySelector<HTMLButtonElement>('[data-analyze-seo]')!;
  const status=report.querySelector<HTMLElement>('[data-seo-status]')!;
  const error=report.querySelector<HTMLElement>('[data-seo-error]')!;
  const fingerprint=()=>JSON.stringify([...new FormData(form)])+JSON.stringify([...form.querySelectorAll<HTMLInputElement>('input[type=checkbox]')].map(x=>x.checked));
  const submitted=fingerprint();
  pending.add(report);button.disabled=true;error.hidden=true;status.textContent='Reading the page and checking the draft…';report.setAttribute('aria-busy','true');
  try {
    const body=JSON.parse(form.dataset.body||'{}');for(const [name,value] of new FormData(form))body[name]=value;
    for(const field of form.querySelectorAll<HTMLInputElement>('input[type=checkbox]'))body[field.name]=field.checked;
    const data=await post('/api/admin/seo-analysis/',body);
    if (!report.isConnected) return;
    if (submitted!==fingerprint()) { status.textContent='The draft changed during analysis. Analyze again for the current values.'; return; }
    const a=data.analysis;
    report.querySelector<HTMLElement>('[data-seo-results]')!.hidden=false;
    report.querySelector('[data-seo-score]')!.textContent=a.score===null?'—':a.score+' / 100';
    report.querySelector('[data-seo-grade]')!.textContent=({'strong':'Strong foundation','improve':'Room to improve','needs-work':'Needs attention','blocked':'Check indexing','excluded':'Intentionally excluded'} as Record<string,string>)[a.grade];
    report.querySelector('[data-seo-summary]')!.textContent=a.summary;
    report.querySelector('[data-seo-source]')!.textContent=data.source+' · '+new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/Chicago'}).format(new Date(data.checkedAt))+' CT';
    const list=report.querySelector('[data-seo-checks]')!;list.replaceChildren();
    for(const check of a.checks) {
      const li=document.createElement('li');li.dataset.status=check.status;
      const heading=document.createElement('div');const label=document.createElement('strong');label.textContent=check.label;
      const points=document.createElement('span');points.className='a-count';points.textContent=(check.status==='info'?'Not scored':check.status)+' · '+check.points+'/'+check.maxPoints;
      const detail=document.createElement('p');detail.className='a-muted';detail.textContent=check.detail;
      heading.append(label,points);li.append(heading,detail);list.append(li);
    }
    status.textContent='Analysis complete. '+a.counts.words+' content words · '+a.counts.internalLinks+' internal links · '+a.counts.images+' images.';
  } catch (e) {error.textContent=e instanceof Error?e.message:'Analysis could not be completed. Try again.';error.hidden=false;status.textContent='Analysis unavailable. Your draft is unchanged.';}
  finally {pending.delete(report);button.disabled=false;report.removeAttribute('aria-busy');}
}
document.addEventListener('click',event=>{const button=(event.target as HTMLElement).closest('[data-analyze-seo]');const report=button?.closest<HTMLElement>('[data-seo-report]');if(report)void analyzeEditor(report);});
document.addEventListener('input',event=>{const form=(event.target as HTMLElement).closest('[data-admin-form]');const report=form?.querySelector<HTMLElement>('[data-seo-report]');if(report&&!report.querySelector<HTMLElement>('[data-seo-results]')!.hidden)report.querySelector('[data-seo-status]')!.textContent='Draft changed. Analyze again to update the score.';});
for(const report of document.querySelectorAll<HTMLElement>('[data-seo-auto]'))void analyzeEditor(report);

type DraftFields=Record<string,string|boolean>;
type FixState={previous?:DraftFields;savedFingerprint?:string;pixelFeedback?:string};
const fixes=new WeakMap<HTMLElement,FixState>(),fixPending=new WeakSet<HTMLElement>();
function values(form:HTMLFormElement):DraftFields{
  const result:DraftFields={};for(const [name,value]of new FormData(form))if(typeof value==='string')result[name]=value;
  for(const check of form.querySelectorAll<HTMLInputElement>('input[type=checkbox]'))result[check.name]=check.checked;
  return result;
}
function fingerprint(form:HTMLFormElement){return JSON.stringify(values(form));}
function identity(form:HTMLFormElement){return JSON.parse(form.dataset.body||'{}') as Record<string,unknown>;}
function pixelMeasurements(title:string,description:string){
  const context=document.createElement('canvas').getContext('2d');
  if(!context)throw new Error('Browser text measurements are unavailable. Use a browser with Canvas support to validate this draft.');
  const titleMeasure=(text:string)=>{context.font='20px Arial';return context.measureText(text).width;};
  const descriptionMeasure=(text:string)=>{context.font='14px Arial';return context.measureText(text).width;};
  return Object.entries(snippetProfiles).map(([key,profile])=>({key,profile,...measureSnippet(title,description,profile,titleMeasure,descriptionMeasure)}));
}
function renderPixels(report:HTMLElement,title?:string,description?:string){
  const form=report.closest<HTMLFormElement>('[data-admin-form]');if(!form)return [];
  const fields=values(form),measurements=pixelMeasurements(title??String(fields.meta_title||''),description??String(fields.meta_description||''));
  const host=report.querySelector<HTMLElement>('[data-seo-pixels]')!;host.replaceChildren();
  for(const result of measurements){
    const card=document.createElement('section');card.className='a-seo-pixel-card';card.dataset.overflow=String(result.titleOverflow||result.descriptionOverflow);
    const label=document.createElement('h3');label.className='a-label';label.textContent=result.profile.label+(title===undefined?' draft':' proposed draft');
    const preview=document.createElement('div');preview.className='a-seo-snippet';preview.style.maxWidth=result.profile.descriptionWidth+'px';
    const heading=document.createElement('div');heading.className='a-seo-snippet-title';heading.style.maxWidth=result.profile.titleWidth+'px';heading.textContent=result.titleText;
    const summary=document.createElement('p');summary.className='a-seo-snippet-description';summary.textContent=description??String(fields.meta_description||'');
    preview.append(heading,summary);
    const detail=document.createElement('p');detail.className='a-count';detail.textContent='Title '+Math.ceil(result.titlePixels)+' / '+result.profile.titleWidth+'px · Description '+result.descriptionLines+' / '+result.profile.descriptionLines+' lines · widest line '+Math.ceil(result.descriptionPixels)+' / '+result.profile.descriptionWidth+'px · '+(result.titleOverflow||result.descriptionOverflow?'Overflows this profile':'Fits this profile');
    card.append(label,preview,detail);host.append(card);
  }
  return measurements;
}
function showProposal(report:HTMLElement,proposal:SeoProposal,before:DraftFields){
  report.querySelector<HTMLElement>('[data-seo-proposal]')!.hidden=false;
  report.querySelector<HTMLButtonElement>('[data-dismiss-seo]')!.hidden=false;
  const comparison=report.querySelector<HTMLElement>('[data-seo-comparison]')!;comparison.replaceChildren();
  for(const [field,value]of Object.entries(proposal.patch)){
    const row=document.createElement('section'),label=document.createElement('h4');label.className='a-label';label.textContent=field.replaceAll('_',' ');
    const old=document.createElement('pre'),next=document.createElement('pre');old.textContent='Before\n'+String(before[field]??'');next.textContent='Proposed\n'+value;
    row.append(label,old,next);comparison.append(row);
  }
  const list=report.querySelector<HTMLElement>('[data-seo-recommendations]')!;list.replaceChildren();
  for(const recommendation of proposal.recommendations){
    const item=document.createElement('li'),heading=document.createElement('strong'),problem=document.createElement('p'),correction=document.createElement('p');
    heading.textContent=recommendation.category;problem.textContent=recommendation.problem;correction.textContent=recommendation.correction;item.append(heading,problem,correction);
    if(recommendation.evidence){const evidence=document.createElement('p');evidence.className='a-count';evidence.textContent=recommendation.evidence;item.append(evidence);}
    list.append(item);
  }
}
async function readFix(id:string){
  const response=await fetch('/api/admin/seo-fix/?id='+encodeURIComponent(id),{headers:{accept:'application/json'},cache:'no-store'});
  const data=await response.json().catch(()=>({error:'Your staff session may have expired. Sign in again; your draft is unchanged.'}));
  if(!response.ok)throw new Error(data.error||'The SEO request could not be read. Retry after reconnecting in Backend.');return data;
}
async function savePatch(form:HTMLFormElement,patch:DraftFields,expected:string|null,submitted:string){
  if(!form.isConnected||fingerprint(form)!==submitted)throw new Error('The draft changed while the specialist was working. Your edits are preserved. Review the proposal and regenerate from the current draft.');
  const fields=[...form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement|HTMLButtonElement>('input,textarea,select,button')];
  const disabled=fields.map(field=>field.disabled);fields.forEach(field=>field.disabled=true);
  try{
    const saved=await post('/api/admin/content/',{...identity(form),...patch,expected_updated_at:expected});
    for(const [name,value]of Object.entries(patch)){
      const field=form.elements.namedItem(name);
      if(field instanceof HTMLInputElement&&field.type==='checkbox')field.checked=!!value;
      else if(field instanceof HTMLInputElement||field instanceof HTMLTextAreaElement||field instanceof HTMLSelectElement)field.value=String(value);
    }
    form.dataset.updatedAt=saved.updated_at||'';delete form.dataset.dirty;
    if(!form.dataset.pending){
      const pendingLabel=document.querySelector<HTMLElement>('.a-publish .a-label'),count=Number(pendingLabel?.textContent?.match(/^\d+/)?.[0]);
      if(pendingLabel&&Number.isFinite(count))pendingLabel.textContent=(count+1)+' unpublished '+(count===0?'change':'changes');
      form.dataset.pending='true';
    }
    return saved;
  }finally{fields.forEach((field,index)=>field.disabled=disabled[index]);}
}
async function fixEditor(report:HTMLElement){
  if(fixPending.has(report))return;
  const form=report.closest<HTMLFormElement>('[data-admin-form]');if(!form)return;
  const status=report.querySelector<HTMLElement>('[data-seo-fix-status]')!,error=report.querySelector<HTMLElement>('[data-seo-fix-error]')!;
  const buttons=[...report.querySelectorAll<HTMLButtonElement>('[data-fix-seo],[data-regenerate-seo],[data-restore-seo],[data-dismiss-seo]')];
  const before=values(form),submitted=fingerprint(form),wasDirty=!!form.dataset.dirty;
  const state=fixes.get(report)||{};fixes.set(report,state);
  fixPending.add(report);buttons.forEach(button=>button.disabled=true);error.hidden=true;form.dataset.dirty='true';form.dataset.seoActive='true';report.setAttribute('aria-busy','true');
  status.textContent='Reading the page and Search Console evidence, then requesting your Codex specialist…';
  try{
    const currentMeasurements=renderPixels(report);
    const requested=await post('/api/admin/seo-fix/',{...identity(form),...before,instructions:report.querySelector<HTMLTextAreaElement>('[data-seo-instructions]')!.value,pixelFeedback:state.pixelFeedback||JSON.stringify(currentMeasurements)});
    let result:any;
    // Bounded polling; credentials remain on the Mac and every read checks staff ownership.
    for(let attempt=0;attempt<240;attempt++){
      if(!report.isConnected)return;
      result=await readFix(requested.id);
      if(result.status==='completed')break;
      if(result.status==='failed')throw new Error(result.error||'The subscription request failed. Check Codex in Backend and retry.');
      status.textContent=result.status==='running'?'The SEO specialist is working. You can keep editing; changed drafts will be preserved.':'Waiting for the Codex runner on your Mac. Keep the Mac awake and connected.';
      await new Promise(resolve=>setTimeout(resolve,2500));
    }
    if(result?.status!=='completed')throw new Error('The request is taking longer than expected. Your draft is unchanged. Check the runner in Backend before regenerating.');
    if(!report.isConnected)return;
    const proposal=result.proposal as SeoProposal;showProposal(report,proposal,before);
    const measurements=renderPixels(report,proposal.patch.meta_title,proposal.patch.meta_description);
    if(measurements.some(result=>result.titleOverflow||result.descriptionOverflow)){
      state.pixelFeedback=JSON.stringify({rejected:proposal.patch,measurements,instruction:'Shorten the title/description to fit both browser-measured profiles without losing page intent.'});
      throw new Error('The proposal exceeds a measured search preview. Your draft is unchanged. Select Regenerate to send these exact pixel measurements to the specialist.');
    }
    await savePatch(form,{...before,...proposal.patch},result.expected_updated_at,submitted);
    state.previous=Object.fromEntries(Object.keys(proposal.patch).map(key=>[key,before[key]??'']));state.savedFingerprint=fingerprint(form);state.pixelFeedback=undefined;
    report.querySelector<HTMLButtonElement>('[data-restore-seo]')!.hidden=false;
    status.textContent='Saved an editable draft with GPT-6.1 Sol · Medium. Review the changes and remaining corrections. Publish when ready.';
    updatePreview(form);void analyzeEditor(report);
  }catch(cause){
    if(!report.isConnected)return;
    error.textContent=cause instanceof Error?cause.message:'SEO assistance is unavailable. Reconnect Codex in Backend and retry.';error.hidden=false;
    status.textContent='No generated changes were saved. Your draft is preserved.';
    if(!state.previous)delete form.dataset.seoActive;
    if(!wasDirty&&fingerprint(form)===submitted)delete form.dataset.dirty;
  }finally{fixPending.delete(report);buttons.forEach(button=>button.disabled=false);report.removeAttribute('aria-busy');}
}
function updatePreview(form:HTMLFormElement){
  for(const field of form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('[data-seo-title],[data-seo-description]'))field.dispatchEvent(new Event('input',{bubbles:true}));
  delete form.dataset.dirty;
  const report=form.querySelector<HTMLElement>('[data-seo-report]');if(report)renderPixels(report);
}
async function restoreDraft(report:HTMLElement){
  const form=report.closest<HTMLFormElement>('[data-admin-form]'),state=fixes.get(report);if(!form||!state?.previous||fixPending.has(report))return;
  const error=report.querySelector<HTMLElement>('[data-seo-fix-error]')!,status=report.querySelector<HTMLElement>('[data-seo-fix-status]')!;error.hidden=true;
  try{
    if(fingerprint(form)!==state.savedFingerprint)throw new Error('Your draft changed after generation. Save or review those edits before restoring a previous version.');
    fixPending.add(report);await savePatch(form,state.previous,form.dataset.updatedAt||null,state.savedFingerprint);
    state.previous=undefined;report.querySelector<HTMLButtonElement>('[data-restore-seo]')!.hidden=true;
    status.textContent='The previous version is saved as your draft. Publication is unchanged.';updatePreview(form);void analyzeEditor(report);
  }catch(cause){error.textContent=cause instanceof Error?cause.message:'The previous draft could not be restored.';error.hidden=false;}
  finally{fixPending.delete(report);}
}
document.addEventListener('click',event=>{
  const button=(event.target as HTMLElement).closest('[data-fix-seo],[data-regenerate-seo],[data-restore-seo],[data-dismiss-seo]'),report=button?.closest<HTMLElement>('[data-seo-report]');if(!report)return;
  if(button!.matches('[data-dismiss-seo]')){
    if(fixPending.has(report))return;
    const form=report.closest<HTMLFormElement>('[data-admin-form]');if(form)delete form.dataset.seoActive;
    report.querySelector<HTMLElement>('[data-seo-proposal]')!.hidden=true;report.querySelector<HTMLButtonElement>('[data-restore-seo]')!.hidden=true;report.querySelector<HTMLButtonElement>('[data-dismiss-seo]')!.hidden=true;
    fixes.delete(report);report.querySelector<HTMLElement>('[data-seo-fix-status]')!.textContent='Review closed. You can keep editing or request another draft.';return;
  }
  if(button!.matches('[data-restore-seo]'))void restoreDraft(report);else void fixEditor(report);
});
document.addEventListener('input',event=>{
  const field=event.target as HTMLElement;if(!field.matches('[data-seo-title],[data-seo-description]'))return;
  const report=field.closest('form')?.querySelector<HTMLElement>('[data-seo-report]');if(report)renderPixels(report);
});
for(const report of document.querySelectorAll<HTMLElement>('[data-seo-report]'))renderPixels(report);
// Admin drawers and automatic view refreshes insert new forms without reloading scripts.
new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLElement){
    const reports=[...(node.matches('[data-seo-report]')?[node]:[]),...node.querySelectorAll<HTMLElement>('[data-seo-report]')];
    for(const report of reports)if(!report.querySelector('[data-seo-pixels]')?.childElementCount)renderPixels(report);
  }
}).observe(document.querySelector('[data-admin-region]')||document.body,{childList:true,subtree:true});
