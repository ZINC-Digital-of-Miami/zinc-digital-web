export function initNeuralAnimations() {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll<HTMLElement>('[data-neural]').forEach(root => {
    const svg = root.querySelector<SVGSVGElement>('svg');
    if (!svg) return;
    function syncMotion() {
      if (preference.matches) svg!.pauseAnimations(); else svg!.unpauseAnimations();
      root.classList.toggle('bi-motion-paused', preference.matches);
    }
    syncMotion();
    root.dataset.motionReady = 'true';
    preference.addEventListener('change', syncMotion);
  });
}
