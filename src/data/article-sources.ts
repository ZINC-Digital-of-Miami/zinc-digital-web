import { parseFragment, type DefaultTreeAdapterMap } from 'parse5';
import { renderMarkdown } from '../lib/markdown.ts';

export type ArticleSource = { title: string; url: string };
type SourceRun = { text?: string; href?: string };
export type SourceArticle = {
  slug?: string;
  blocks?: readonly { runs?: readonly SourceRun[]; items?: readonly (readonly SourceRun[])[] }[];
  markdown?: string;
};

// Public first-party documentation, standards and original research. A provider's
// ads, account screens and sharing endpoints are not reference material.
const primary: Record<string, { path: RegExp; name: string }> = {
  'developers.google.com': { path: /^\/(?:search\/(?:docs|blog|help)|analytics\/devguides|crawling\/docs|tag-platform|google-ads\/api\/docs|tag-manager|web)\//, name: 'Google documentation' },
  'support.google.com': { path: /^\/(?:analytics|webmasters|merchants|google-ads|business|tagmanager|trends)\/answer\/\d+(?:\/|$)/, name: 'Google Help' },
  'developers.openai.com': { path: /^\/api\/docs\//, name: 'OpenAI documentation' },
  'platform.openai.com': { path: /^\/docs\//, name: 'OpenAI documentation' },
  'platform.claude.com': { path: /^\/docs\//, name: 'Claude documentation' },
  'docs.anthropic.com': { path: /^\/(?:en\/)?docs\//, name: 'Anthropic documentation' },
  'ai.google.dev': { path: /^\/gemini-api\/docs\//, name: 'Google AI documentation' },
  'blog.google': { path: /^\/(?:products|products-and-platforms|technology|inside-google|outreach-initiatives)\//, name: 'Google Blog' },
  'status.search.google.com': { path: /^\/(?:incidents\/[a-zA-Z0-9_-]+\/?)?$/, name: 'Google Search Status Dashboard' },
  'help.shopify.com': { path: /^\/[a-z]{2}(?:-[a-zA-Z]{2})?\/(?:manual|support)\//, name: 'Shopify Help Center' },
  'shopify.dev': { path: /^\/(?:docs|changelog)\//, name: 'Shopify developer documentation' },
  'www.shopify.com': { path: /^\/blog\//, name: 'Shopify' },
  'shopify.com': { path: /^\/blog\//, name: 'Shopify' },
  'web.dev': { path: /^\/(?:articles|blog|learn)\/|^\/(?:inp|vitals|lcp|cls)\/?$/, name: 'web.dev' },
  'www.w3.org': { path: /^\/(?:TR|WAI|standards)\//, name: 'W3C' },
  'w3.org': { path: /^\/(?:TR|WAI|standards)\//, name: 'W3C' },
  'developer.mozilla.org': { path: /^\/[a-z]{2}(?:-[a-zA-Z]{2})?\/docs\//, name: 'MDN Web Docs' },
  'developer.chrome.com': { path: /^\/(?:docs|blog)\//, name: 'Chrome for Developers' },
  'developers.facebook.com': { path: /^\/docs\//, name: 'Meta developer documentation' },
  'www.facebook.com': { path: /^\/business\/help\//, name: 'Meta Business Help Center' },
  'facebook.com': { path: /^\/business\/help\//, name: 'Meta Business Help Center' },
  'ads.tiktok.com': { path: /^\/(?:resources\/)?help\/article\//, name: 'TikTok Ads Help Center' },
  'www.facebookblueprint.com': { path: /^\/student\/path\/\d+[-a-zA-Z0-9]*\/?$/, name: 'Meta Blueprint' },
  'www.gartner.com': { path: /^\/en\/newsroom\/press-releases\//, name: 'Gartner research' },
  'www.iab.com': { path: /^\/(?:insights|news)\//, name: 'IAB research' },
  'www.edelman.com': { path: /^\/expertise\//, name: 'Edelman research' },
  'cmosurvey-new.fuqua.duke.edu': { path: /^\/wp-content\/uploads\//, name: 'The CMO Survey' },
  'www.fuqua.duke.edu': { path: /^\/duke-fuqua-insights\//, name: 'Duke Fuqua research' },
  'www.deloitte.com': { path: /^\/us\/en\/(?:programs|insights)\//, name: 'Deloitte research' },
  'www.mckinsey.com': { path: /^\/industries\/[^/]+\/our-insights\//, name: 'McKinsey research' },
  'kpmg.com': { path: /^\/us\/en\/articles\//, name: 'KPMG research' },
  'baymard.com': { path: /^\/research\//, name: 'Baymard research' },
  'business.adobe.com': { path: /^\/resources\//, name: 'Adobe research' },
  'blog.adobe.com': { path: /^\/en\/publish\//, name: 'Adobe' },
  'business.linkedin.com': { path: /^\/marketing-solutions\/marketing-research\/?$/, name: 'LinkedIn research' },
  'mailchimp.com': { path: /^\/resources\/email-marketing-benchmarks\/?$/, name: 'Mailchimp benchmarks' },
};

function referenceUrl(href: string | undefined): URL | undefined {
  if (!href || /[\u0000-\u0020\u007f-\u009f\\]/.test(href) || /%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(href)) return;
  try {
    const url = new URL(href);
    if (/[\u0000-\u001f\u007f-\u009f\\]/.test(decodeURIComponent(url.pathname + url.hash))) return;
    const rule = primary[url.hostname];
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port || !rule || !rule.path.test(url.pathname)) return;
    url.protocol = 'https:';
    for (const [key] of [...url.searchParams]) {
      if (/^utm_/i.test(key) || /^(?:gclid|fbclid|msclkid)$/i.test(key)) url.searchParams.delete(key);
      else if (key === 'hl' || key === 'lang') {
        const language = url.searchParams.get(key) || '';
        if (!/^[a-z]{2}(?:-[a-zA-Z]{2})?$/.test(language)) return;
        if (/^en(?:-US)?$/i.test(language)) url.searchParams.delete(key);
      } else return; // Never publish unknown query payloads, identifiers or credentials.
    }
    return url;
  } catch { return; }
}

function label(text: string | undefined, url: URL) {
  const clean = (text || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean && !/^(?:here|click here|read more|source|link)$/i.test(clean)) return clean.slice(0, 240);
  const tail = url.pathname.split('/').filter(Boolean).at(-1) || '';
  const topic = decodeURIComponent(tail).replace(/[-_]+/g, ' ');
  return primary[url.hostname].name + (topic ? ' — ' + topic : '');
}

type Node = DefaultTreeAdapterMap['node'];
function nodeText(root: Node) {
  const queue: Node[] = [root];
  const text: string[] = [];
  while (queue.length) {
    const node = queue.pop()!;
    if (node.nodeName === '#text') text.push((node as DefaultTreeAdapterMap['textNode']).value);
    if ('childNodes' in node) queue.push(...node.childNodes.toReversed());
  }
  return text.join('');
}

/** References used by the article body, not an inferred bibliography or an external link audit. */
export function articleSources(post: SourceArticle): ArticleSource[] {
  const runs: SourceRun[] = [];
  for (const block of post.blocks || []) {
    runs.push(...(block.runs || []));
    for (const item of block.items || []) runs.push(...item);
  }
  if (post.markdown) {
    const queue: Node[] = [parseFragment(renderMarkdown(post.markdown))];
    while (queue.length) {
      const node = queue.pop()!;
      if ('tagName' in node && node.tagName === 'a') runs.push({ text: nodeText(node), href: node.attrs.find(attr => attr.name === 'href')?.value });
      if ('childNodes' in node) queue.push(...node.childNodes.toReversed());
    }
  }
  const seen = new Set<string>();
  const sources: ArticleSource[] = [];
  for (const run of runs) {
    const url = referenceUrl(run.href);
    if (!url) continue;
    const identity = new URL(url);
    identity.hash = '';
    identity.pathname = identity.pathname.replace(/\/$/, '') || '/';
    identity.searchParams.sort();
    if (seen.has(identity.href)) continue;
    seen.add(identity.href);
    sources.push({ title: label(run.text, url), url: url.href });
  }
  // The 18 migrated articles each already have primary body references. New
  // admin drafts without references stay empty; their sources are never invented.
  return sources;
}
