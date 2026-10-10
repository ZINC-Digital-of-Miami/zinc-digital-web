// page.ts — blog filters (layer + topic) and the three-step inquiry form.
import {trackLead} from '../lib/analytics';
export function initBlog() {
  const root = document.querySelector<HTMLElement>('[data-blog]');
  if (!root) return;
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-blog-list] > [data-layer]'));
  const count = root.querySelector<HTMLElement>('[data-result-count]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  let layer = 'All', topic = 'All';
  const apply = () => {
    let n = 0;
    cards.forEach((c) => { const show = (layer === 'All' || c.dataset.layer === layer) && (topic === 'All' || (c.dataset.topics || '').split(' ').includes(topic)); c.hidden = !show; if (show) n++; });
    count.textContent = n + ' article' + (n === 1 ? '' : 's');
    empty.hidden = n > 0;
    root.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) => { const on = b.dataset.filter === layer; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    root.querySelectorAll<HTMLButtonElement>('[data-topic]').forEach((b) => { const on = b.dataset.topic === topic; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    root.querySelector('[data-blog-list]')?.classList.add('in');
  };
  root.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (!b) return;
    if (b.dataset.filter) layer = b.dataset.filter;
    else if (b.dataset.topic) topic = b.dataset.topic;
    else if (b.hasAttribute('data-clear-filter')) { layer = 'All'; topic = 'All'; }
    else return;
    apply();
  });
  const want = new URLSearchParams(location.search).get('layer');
  if (want && ['Build', 'Demand', 'Intelligence'].includes(want)) { layer = want; apply(); }
}

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-inquiry-form]');
  if (!form) return;
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
  const bars = Array.from(form.querySelectorAll<HTMLElement>('[data-step-bar]'));
  const next = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-back]')!;
  const label = form.querySelector<HTMLElement>('[data-step-label]')!;
  const error = form.querySelector<HTMLElement>('[data-form-error]')!;
  const names: Record<string,string> = { name: 'Name', company: 'Company', email: 'Work email', website: 'Website URL', budget: 'Monthly budget', timeline: 'Timeline', message: 'Message' };
  const clearFieldError = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    field.removeAttribute('aria-invalid');
    const id = field.id + '-error';
    const described = (field.getAttribute('aria-describedby') || '').split(' ').filter((x) => x && x !== id);
    if (described.length) field.setAttribute('aria-describedby', described.join(' ')); else field.removeAttribute('aria-describedby');
    form.querySelector('#' + CSS.escape(id))?.remove();
  };
  const showFieldError = (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    clearFieldError(field);
    const help = document.createElement('span'); help.id = field.id + '-error'; help.className = 'p-err';
    help.setAttribute('aria-hidden', 'true'); // Read through describedby, without changing the wrapped label's name.
    help.style.cssText = 'display:block;margin:0;text-transform:none';
    help.textContent = field.validity.valueMissing ? (names[field.name] || 'This field') + ' is required.' : field.type === 'email' ? 'Enter a valid work email address.' : field.type === 'url' ? 'Enter the full website URL, starting with https://.' : 'Check this value and try again.';
    field.closest('label')?.append(help); field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), help.id].filter(Boolean).join(' '));
  };
  let step = 0;
  // Progressive enhancement: server markup is the one-page no-JS form; JS turns it into three steps.
  form.querySelectorAll<HTMLElement>('[data-js-only],[data-js-ctrls]').forEach((el) => { el.hidden = false; });
  form.querySelectorAll<HTMLElement>('[data-nojs-note],[data-nojs-submit]').forEach((el) => { el.hidden = true; });
  const pre = new URLSearchParams(location.search).getAll('service');
  if (pre.length === 1) form.querySelectorAll<HTMLInputElement>('[data-service]').forEach((f) => { f.checked = f.value === pre[0]; });
  const show = (focus = false) => {
    steps.forEach((el, i) => { el.hidden = i !== step; });
    bars.forEach((b, i) => b.classList.toggle('on', i <= step));
    back.hidden = step === 0;
    next.textContent = step === 2 ? 'Send inquiry' : 'Continue';
    label.textContent = 'Step ' + (step + 1) + ' of 3';
    if (focus) error.textContent = ''; // keep a server-rendered error (/contact/send/) on first paint
    if (focus) steps[step].querySelector<HTMLElement>('input,select,textarea')?.focus();
  };
  const advance = () => {
    if (next.disabled) return;
    const fields = Array.from(steps[step].querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type=checkbox]),select,textarea'));
    const bad = fields.find((f) => !f.checkValidity());
    fields.forEach(clearFieldError);
    if (bad) { showFieldError(bad); error.textContent = 'Check the highlighted field to continue.'; bad.focus({ preventScroll: true }); bad.scrollIntoView({ block: 'center' }); return; }
    if (step === 1 && !form.querySelector<HTMLInputElement>('[data-service]:checked')) {
      error.textContent = 'Choose at least one service to continue.';
      form.querySelectorAll<HTMLInputElement>('[data-service]').forEach((f) => { f.setAttribute('aria-invalid','true'); f.setAttribute('aria-describedby',error.id); });
      form.querySelector<HTMLInputElement>('[data-service]')?.focus(); return;
    }
    if (step < 2) { step++; show(true); return; }
    next.style.minWidth = next.offsetWidth + 'px'; next.disabled = true; back.disabled = true; next.textContent = 'Sending…'; form.setAttribute('aria-busy','true');
    const body: Record<string, string | string[]> = { service: [] };
    new FormData(form).forEach((v, k) => { if (typeof v !== 'string') return; if (k === 'service') (body.service as string[]).push(v); else body[k] = v; });
    fetch(form.dataset.endpoint || '/api/inquiries/', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
      .then(async (r) => {
        const result = await r.json().catch(() => ({}));
        if (!r.ok || result.ok !== true) {
          const field = result.field === 'services' ? form.querySelector<HTMLInputElement>('[data-service]') : typeof result.field === 'string' ? form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[name="' + CSS.escape(result.field) + '"]') : null;
          const invalidStep = field ? steps.findIndex(el => el.contains(field)) : -1;
          if (field && invalidStep >= 0) {
            step = invalidStep; next.disabled = false; back.disabled = false; form.removeAttribute('aria-busy'); show(true);
            if (result.field === 'services') {
              error.textContent = 'Choose at least one service to continue.';
              form.querySelectorAll<HTMLInputElement>('[data-service]').forEach(f => { f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', error.id); });
            } else { showFieldError(field); error.textContent = 'Check the highlighted field to continue.'; }
            field.focus({ preventScroll: true }); field.scrollIntoView({ block: 'center' });
            return;
          }
          throw new Error(result.error || 'Send failed');
        }
        await trackLead(result, window.gtag, window.zincAdsConversionLabel); location.assign(form.dataset.thanks || '/thanks/');
      })
      .catch((e) => { next.disabled = false; back.disabled = false; show(); form.removeAttribute('aria-busy'); error.textContent = e.message + '. Text us instead and we will pick it up.'; });
  };
  next.addEventListener('click', advance);
  back.addEventListener('click', () => { if (next.disabled) return; step = Math.max(0, step - 1); show(true); });
  form.addEventListener('submit', (e) => { e.preventDefault(); advance(); });
  form.addEventListener('input', (e) => {
    const field=e.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
      if(field.matches('[data-service]') && form.querySelector('[data-service]:checked')) { form.querySelectorAll<HTMLInputElement>('[data-service]').forEach(f=>{f.removeAttribute('aria-invalid');f.removeAttribute('aria-describedby');});error.textContent=''; }
      else if(field.getAttribute('aria-invalid')==='true'&&field.checkValidity()){clearFieldError(field);error.textContent='';}
    }
  });
  form.addEventListener('keydown', (e) => { if (!e.isComposing && e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.type !== 'checkbox') { e.preventDefault(); advance(); } });
  show();
}
