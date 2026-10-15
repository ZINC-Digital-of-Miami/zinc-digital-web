export function initNeuralAnimations() {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll<HTMLElement>('[data-neural]').forEach(root => {
    const svg = root.querySelector<SVGSVGElement>('svg');
    const button = root.querySelector<HTMLButtonElement>('.bi-motion-toggle');
    if (!svg || !button) return;
    let paused = false;
    function setPaused(value: boolean) {
      paused = value;
      if (paused) svg!.pauseAnimations(); else svg!.unpauseAnimations();
      root.classList.toggle('bi-motion-paused', paused);
      button!.textContent = paused ? 'Play animation' : 'Pause animation';
    }
    setPaused(preference.matches);
    root.dataset.motionReady = 'true';
    button.hidden = false;
    button.addEventListener('click', () => setPaused(!paused));
    preference.addEventListener('change', event => setPaused(event.matches));
  });
}
