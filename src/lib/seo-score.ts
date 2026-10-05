/** Approved field-based score from ZINC Admin.dc.html, line 140. This is not a search ranking. */
export function seoScore(p: { title: string; desc: string; status: string }) {
  const issues: string[] = [];
  let score = 100;
  const length = p.title.length + 7;
  if (length > 60) { score -= 18; issues.push('Title with the site suffix exceeds 60 characters.'); }
  if (length < 25) { score -= 10; issues.push('Title with the site suffix is shorter than 25 characters.'); }
  if (p.desc.length > 160) { score -= 14; issues.push('Description exceeds 160 characters.'); }
  if (p.desc.length < 70) { score -= 16; issues.push('Description is shorter than 70 characters.'); }
  if (p.status.toLowerCase() === 'draft') { score -= 10; issues.push('This post is a draft.'); }
  return { score: Math.max(0, score), issues };
}
