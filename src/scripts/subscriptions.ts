import {subscriptionTopic} from '../lib/subscription-topics';

const page = document.querySelector<HTMLElement>('[data-subscription-page]');
if (page) {
  const selected = subscriptionTopic(new URL(location.href).searchParams.get('topic'));
  const inputs = Array.from(page.querySelectorAll<HTMLInputElement>('input[name="topics"]'));
  // Page context suggests exactly one topic; related subjects are never added.
  for (const input of inputs) input.checked = input.value === selected?.slug;
  const heading = page.querySelector('[data-subscription-heading]');
  if (selected && heading) heading.textContent = selected.title + ' how-tos.';
  const status = page.querySelector('[data-subscription-selection]');
  const updateSelection = () => {
    const titles = inputs.filter(input => input.checked).map(input => subscriptionTopic(input.value)?.title).filter(Boolean);
    if (status) status.textContent = titles.length ? 'Selected: ' + titles.join(', ') + '.' : 'No topics selected. Choose one or several.';
  };
  page.addEventListener('change', updateSelection);
  updateSelection();
}
