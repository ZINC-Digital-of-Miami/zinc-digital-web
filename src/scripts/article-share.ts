export function initArticleShare() {
  for (const element of document.querySelectorAll<HTMLElement>('[data-article-share]')) {
    const url = element.dataset.shareUrl!;
    const title = element.dataset.shareTitle!;
    const status = element.querySelector<HTMLElement>('[data-share-status]')!;
    const copy = element.querySelector<HTMLButtonElement>('[data-copy-article]')!;
    const share = element.querySelector<HTMLButtonElement>('[data-native-share]')!;
    if (navigator.clipboard?.writeText) {
      copy.hidden = false;
      copy.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(url); status.textContent = 'Article link copied.'; }
        catch { status.textContent = 'The link could not be copied. Use one of the share links.'; }
      });
    }
    if (navigator.share && (!navigator.canShare || navigator.canShare({ title, url }))) {
      share.hidden = false;
      share.addEventListener('click', async () => {
        try { await navigator.share({ title, url }); status.textContent = ''; }
        catch (error) { if (!(error instanceof DOMException && error.name === 'AbortError')) status.textContent = 'Sharing is unavailable. Use one of the links.'; }
      });
    }
  }
}
