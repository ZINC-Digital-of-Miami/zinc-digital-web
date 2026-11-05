import {subscriptionTopic, subscriptionTopics, subscriptionProvider} from '../lib/subscription-topics';
import jqueryUrl from 'jquery/dist/jquery.min.js?url';
import underscoreUrl from 'underscore/underscore-umd-min.js?url';

const page = document.querySelector<HTMLElement>('[data-subscription-page]');
if (page) {
  const selected = subscriptionTopic(new URL(location.href).searchParams.get('topic'));
  const inputs = Array.from(page.querySelectorAll<HTMLInputElement>('input[name="topics"]'));
  for (const input of inputs) input.checked = input.value === selected?.slug;
  const heading = page.querySelector('[data-subscription-heading]');
  if (selected && heading) heading.textContent = selected.title + ' how-tos.';
  const selection = page.querySelector<HTMLElement>('[data-subscription-selection]');
  const chooser = page.querySelector<HTMLFieldSetElement>('.subscribe-topics')!;
  const button = page.querySelector<HTMLButtonElement>('[data-subscription-load]')!;
  const status = page.querySelector<HTMLElement>('[data-subscription-status]')!;
  const mount = page.querySelector<HTMLElement>('[data-subscription-mount]')!;
  const updateSelection = () => {
    const titles = inputs.filter(input => input.checked).map(input => subscriptionTopic(input.value)?.title).filter(Boolean);
    if (selection) selection.textContent = titles.length ? 'Selected: ' + titles.join(', ') + '.' : 'No topics selected. Choose one or several.';
    button.disabled = !titles.length;
  };
  page.addEventListener('change', updateSelection);
  updateSelection();
  button.hidden = false;

  const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Signup script unavailable'));
    document.head.appendChild(script);
  });
  button.addEventListener('click', async () => {
    button.disabled = true;
    chooser.disabled = true;
    status.textContent = 'Loading your signup form…';
    const chosen = new Set(inputs.filter(input => input.checked).map(input => subscriptionTopic(input.value)!.listId));
    const expected = new Set<string>(subscriptionTopics.map(topic => topic.listId));
    const host = document.createElement('div');
    host.className = 'ctct-inline-form';
    host.dataset.formId = subscriptionProvider.formId;
    host.hidden = true;
    mount.replaceChildren(host);
    let observer: MutationObserver | undefined;
    let timeout: number | undefined;
    const clean = () => {observer?.disconnect(); clearTimeout(timeout);};
    const fail = () => {
      clean();
      host.hidden = true;
      button.hidden = true;
      status.textContent = 'The signup form could not load. Your email has not been submitted.';
      page.querySelector<HTMLElement>('[data-subscription-retry]')!.hidden = false;
    };
    try {
      // Load the provider's dependencies locally, so its Cloudflare fallback is never needed.
      // No provider request or cookie is created until the reader opens the form.
      const ready = new Promise<void>((resolve, reject) => {
        timeout = window.setTimeout(() => reject(new Error('Signup timed out')), 20000);
        observer = new MutationObserver(() => {
          const lists = Array.from(host.querySelectorAll<HTMLInputElement>('input[name="emailList"]'));
          if (!lists.length) return;
          if (lists.length !== expected.size || new Set(lists.map(input => input.value)).size !== expected.size || lists.some(input => !expected.has(input.value))) {
            reject(new Error('Signup topics changed')); return;
          }
          for (const input of lists) input.checked = chosen.has(input.value as typeof subscriptionTopics[number]['listId']);
          clean();
          resolve();
        });
        observer.observe(host, {childList:true, subtree:true});
      });
      // Attach both handlers immediately, including while dependencies are loading.
      await Promise.all([ready, (async () => {
        await loadScript(jqueryUrl);
        await loadScript(underscoreUrl);
        (window as Window & {_ctct_m?:string})._ctct_m = subscriptionProvider.accountId;
        await loadScript('https://static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js');
      })()]);
      // Fail closed if the provider later changes which lists this form submits.
      const validateLists = (event: Event) => {
        const lists = Array.from(host.querySelectorAll<HTMLInputElement>('input[name="emailList"]'));
        if (!lists.some(input => input.checked) || lists.length !== expected.size || new Set(lists.map(input => input.value)).size !== expected.size || lists.some(input => !expected.has(input.value))) {
          event.preventDefault(); event.stopImmediatePropagation();
          status.textContent = 'Choose at least one of the listed how-to topics before subscribing.';
        } else {
          status.textContent = '';
        }
      };
      host.addEventListener('submit', validateLists, true);
      // The native widget handles button clicks directly, before a form submit event.
      host.addEventListener('click', event => {
        if ((event.target as Element).closest('.ctct-form-button')) validateLists(event);
      }, true);
      host.querySelector('.ctct-form-success')?.setAttribute('role', 'status');
      host.querySelector('[data-qe-id="form-branding"] a')?.setAttribute('aria-label', 'Constant Contact');
      host.hidden = false;
      chooser.hidden = true;
      if (selection) selection.hidden = true;
      button.hidden = true;
      status.textContent = 'Review your topics below, then enter your email and subscribe.';
      host.querySelector<HTMLInputElement>('input[type="email"]')?.focus({preventScroll:true});
    } catch { fail(); }
    window.addEventListener('pagehide', clean, {once:true});
  }, {once:true});
}
