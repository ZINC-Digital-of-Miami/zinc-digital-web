// page.ts — blog filters (layer + topic) and the three-step demo inquiry form.
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

// Build-time mode, so a live bundle carries none of the demo strings (and the reverse).
const LIVE = import.meta.env.PUBLIC_INQUIRY_MODE === 'live';

export function initForm() {
  const form = document.querySelector<HTMLFormElement>('[data-demo-form]');
  if (!form) return;
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
  const bars = Array.from(form.querySelectorAll<HTMLElement>('[data-step-bar]'));
  const next = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-back]')!;
  const label = form.querySelector<HTMLElement>('[data-step-label]')!;
  const error = form.querySelector<HTMLElement>('[data-form-error]')!;
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
    next.textContent = step === 2 ? (LIVE ? 'Send inquiry' : 'Preview demo confirmation') : 'Continue';
    label.textContent = 'Step ' + (step + 1) + ' of 3';
    if (focus) error.textContent = ''; // keep a server-rendered error (/contact/send/) on first paint
    if (focus) steps[step].querySelector<HTMLElement>('input,select,textarea')?.focus();
  };
  const advance = () => {
    const fields = Array.from(steps[step].querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type=checkbox]),select,textarea'));
    const bad = fields.find((f) => !f.checkValidity());
    if (bad) { error.textContent = LIVE ? 'Complete the required fields.' : 'Complete the required fields with valid sample information.'; bad.reportValidity(); return; }
    if (step === 1 && !form.querySelector<HTMLInputElement>('[data-service]:checked')) { error.textContent = 'Choose at least one service to continue.'; return; }
    if (step < 2) { step++; show(true); return; }
    if (!LIVE) { location.assign(form.dataset.thanks || '/thanks/'); return; }
    next.disabled = true; next.textContent = 'Sending…';
    const body: Record<string, string | string[]> = { service: [] };
    new FormData(form).forEach((v, k) => { if (typeof v !== 'string') return; if (k === 'service') (body.service as string[]).push(v); else body[k] = v; });
    fetch(form.dataset.endpoint || '/api/inquiries/', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
      .then(async (r) => { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Send failed'); location.assign(form.dataset.thanks || '/thanks/'); })
      .catch((e) => { next.disabled = false; next.textContent = 'Send inquiry'; error.textContent = e.message + '. Text us instead and we will pick it up.'; });
  };
  next.addEventListener('click', advance);
  back.addEventListener('click', () => { step = Math.max(0, step - 1); show(true); });
  form.addEventListener('submit', (e) => { e.preventDefault(); advance(); });
  form.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target instanceof HTMLInputElement) { e.preventDefault(); advance(); } });
  show();
}
