import { post } from './shell';
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
