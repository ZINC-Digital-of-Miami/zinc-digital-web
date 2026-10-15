/** Both examples remain readable when JavaScript is unavailable. */
export function initBusinessIntelligence() {
  const root = document.querySelector<HTMLElement>('.bi-platform');
  const tablist = root?.querySelector<HTMLElement>('.bi-scenario-tabs');
  if (!root || !tablist) return;
  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[data-scenario]'));
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls') ?? ''));
  if (!tabs.length || panels.some(panel => !panel)) return;

  function select(index: number, focus = false) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i]!.hidden = !active;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    const panel = panels[index]!;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : undefined;
      if (next === undefined) return;
      event.preventDefault();
      select(next, true);
    });
  });
  select(0);
  tablist.hidden = false;
}
