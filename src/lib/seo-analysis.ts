import { parse, parseFragment, type DefaultTreeAdapterMap } from 'parse5';
import { pillarFor } from '../data/blog-strategy.ts';

export interface SeoAnalysisOptions {
  url: string;
  kind: 'page' | 'post';
  focusKeyword?: string;
  httpStatus?: number;
  sitemapIncluded?: boolean;
  expectedNoindex?: boolean;
  /** Editor values applied to a parsed copy; these never modify the live page. */
  overrides?: { title?: string; description?: string; noindex?: boolean; bodyHtml?: string };
}
export type SeoCheckStatus = 'pass' | 'warn' | 'fail' | 'info';
export interface SeoCheck {
  id: string;
  label: string;
  category: string;
  status: SeoCheckStatus;
  points: number;
  maxPoints: number;
  detail: string;
}
export interface SeoAnalysis {
  score: number | null;
  grade: 'strong' | 'improve' | 'needs-work' | 'blocked' | 'excluded';
  checks: SeoCheck[];
  summary: string;
  counts: { words: number; internalLinks: number; externalLinks: number; images: number };
  /** HTML signals only. A pass does not verify robots.txt, response headers or Google indexing. */
  indexable: boolean;
}

type Node = DefaultTreeAdapterMap['node'];
type Element = DefaultTreeAdapterMap['element'];
type JsonObject = Record<string, unknown>;
// Global headers already sit outside <main>; a content header can hold the actual H1.
const excluded = new Set(['nav', 'footer', 'script', 'style', 'template', 'noscript']);
const children = (node: Node): Node[] => 'childNodes' in node ? node.childNodes : [];
const isElement = (node: Node): node is Element => 'tagName' in node;
const attr = (node: Element, name: string) => node.attrs.find(a => a.name === name)?.value;
const hasClass = (node: Element, name: string) => (attr(node, 'class') || '').split(/\s+/).includes(name);
const plain = (value: string) => value.replace(/\s+/g, ' ').trim();

function nodes(root: Node, contentOnly = false): Element[] {
  const found: Element[] = [];
  const queue: Node[] = [root];
  while (queue.length) {
    const node = queue.pop()!;
    if (isElement(node)) {
      if (contentOnly && (excluded.has(node.tagName) || attr(node, 'hidden') !== undefined || attr(node, 'aria-hidden') === 'true')) continue;
      found.push(node);
    }
    queue.push(...children(node).toReversed());
  }
  return found;
}

function textContent(root: Node, contentOnly = false): string {
  const text: string[] = [];
  const queue: Node[] = [root];
  while (queue.length) {
    const node = queue.pop()!;
    if (isElement(node) && contentOnly && (excluded.has(node.tagName) || attr(node, 'hidden') !== undefined || attr(node, 'aria-hidden') === 'true')) continue;
    if (node.nodeName === '#text') text.push((node as DefaultTreeAdapterMap['textNode']).value);
    queue.push(...children(node).toReversed());
  }
  return plain(text.join(' '));
}

function httpUrl(value: unknown, base?: string): URL | undefined {
  if (typeof value !== 'string' || !value.trim()) return;
  try {
    const url = new URL(value.trim(), base);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url : undefined;
  } catch { return; }
}
const identity = (url: URL) => url.origin + (url.pathname.replace(/\/$/, '') || '/') + url.search;
const samePage = (a: URL | undefined, b: URL | undefined) => !!a && !!b && identity(a) === identity(b);
const isObject = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null && !Array.isArray(value);
const types = (object: JsonObject) => [object['@type']].flat().filter((t): t is string => typeof t === 'string').map(t => t.replace(/^https?:\/\/schema\.org\//, ''));
const positive = (value: string | undefined) => value !== undefined && Number.isFinite(Number(value)) && Number(value) > 0;
function reservedGeometry(node: Element) {
  if (positive(attr(node, 'width')) && positive(attr(node, 'height'))) return true;
  const ratio = (attr(node, 'style') || '').match(/(?:^|;)\s*aspect-ratio\s*:\s*([0-9.]+)(?:\s*\/\s*([0-9.]+))?\s*(?:;|$)/i);
  return !!ratio && positive(ratio[1]) && (ratio[2] === undefined || positive(ratio[2]));
}
function publicationDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const day = value.slice(0, 10);
  const parsed = new Date(day + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().startsWith(day);
}

function setHeadField(head: Element, tagName: string, name: string | undefined, value: string) {
  const existing = nodes(head).find(node => node.tagName === tagName && (!name || attr(node, 'name')?.toLowerCase() === name));
  const node: Element = existing || { nodeName: tagName, tagName, namespaceURI: head.namespaceURI, attrs: [], childNodes: [], parentNode: head };
  if (!existing) head.childNodes.push(node);
  if (tagName === 'title') node.childNodes = [{ nodeName: '#text', value, parentNode: node }];
  else {
    if (name && !attr(node, 'name')) node.attrs.push({ name: 'name', value: name });
    node.attrs = node.attrs.filter(a => a.name !== 'content');
    node.attrs.push({ name: 'content', value });
  }
}

/** Deterministic checks of rendered HTML, not a Google score or a ranking prediction. No scripts execute and no requests are made. */
export function analyzeSeo(html: string, options: SeoAnalysisOptions): SeoAnalysis {
  const document = parse(html);
  const all = nodes(document);
  const head = all.find(node => node.tagName === 'head')!;
  const main = all.find(node => node.tagName === 'main');
  const overrides = options.overrides;
  if (overrides?.title !== undefined) setHeadField(head, 'title', undefined, overrides.title);
  if (overrides?.description !== undefined) setHeadField(head, 'meta', 'description', overrides.description);
  if (overrides?.noindex !== undefined) {
    // A draft toggle replaces the effective robots directive, including bot-specific noindex.
    for (const node of nodes(head).filter(node => node.tagName === 'meta' && ['robots', 'googlebot'].includes((attr(node, 'name') || '').toLowerCase()))) {
      node.attrs = node.attrs.filter(a => a.name !== 'content');
      node.attrs.push({ name: 'content', value: overrides.noindex ? 'noindex, nofollow' : 'index, follow' });
    }
    setHeadField(head, 'meta', 'robots', overrides.noindex ? 'noindex, nofollow' : 'index, follow');
  }
  if (overrides?.bodyHtml !== undefined && main) {
    const prose = nodes(main).find(node => hasClass(node, 'p-prose'));
    if (prose) {
      prose.childNodes = parseFragment(overrides.bodyHtml).childNodes;
      for (const node of prose.childNodes) node.parentNode = prose;
    }
  }

  const headNodes = nodes(head);
  const contentNodes = main ? nodes(main, true) : [];
  const prose = contentNodes.find(node => hasClass(node, 'p-prose'));
  // Post link and word counts concern the article itself, not the author card or related links.
  const bodyRoot = options.kind === 'post' ? prose || main : main;
  const bodyNodes = bodyRoot ? nodes(bodyRoot, true) : [];
  const content = bodyRoot ? textContent(bodyRoot, true) : '';
  const pageUrl = httpUrl(options.url);
  const meta = (name: string, property = false) => headNodes.filter(node => node.tagName === 'meta' && (attr(node, property ? 'property' : 'name') || '').toLowerCase() === name).map(node => attr(node, 'content') || '');
  const checks: SeoCheck[] = [];
  const add = (id: string, label: string, category: string, status: SeoCheckStatus, maxPoints: number, detail: string) => {
    const applicable = status === 'info' ? 0 : maxPoints;
    checks.push({ id, label, category, status, points: status === 'pass' ? applicable : status === 'warn' ? applicable / 2 : 0, maxPoints: applicable, detail });
  };

  const titles = headNodes.filter(node => node.tagName === 'title').map(node => textContent(node));
  const descriptions = meta('description');
  const title = titles[0] || '';
  const description = plain(descriptions[0] || '');
  const titleLength = Array.from(title).length;
  const descriptionLength = Array.from(description).length;
  add('title', 'Meta title', 'Metadata', titles.length !== 1 || !title ? 'fail' : titleLength > 65 ? 'warn' : 'pass', 12,
    titles.length !== 1 ? `Found ${titles.length} title elements; use exactly one.` : !title ? 'The title is empty.' : `${titleLength} characters. ${titleLength > 65 ? 'May truncate in search previews; shorten only if meaning is preserved.' : 'One non-empty title is present. Length is preview guidance, not a ranking rule.'}`);
  add('description', 'Meta description', 'Metadata', descriptions.length !== 1 || !description ? 'fail' : descriptionLength < 70 || descriptionLength > 170 ? 'warn' : 'pass', 10,
    descriptions.length !== 1 ? `Found ${descriptions.length} descriptions; use exactly one.` : !description ? 'The description is empty.' : `${descriptionLength} characters. ${descriptionLength < 70 || descriptionLength > 170 ? 'Review the search preview for missing context or truncation.' : 'One useful-length description is present.'} Search engines may choose different text.`);

  const canonicals = headNodes.filter(node => node.tagName === 'link' && (attr(node, 'rel') || '').toLowerCase().split(/\s+/).includes('canonical')).map(node => attr(node, 'href') || '');
  const canonical = httpUrl(canonicals[0]);
  const canonicalMismatch = !!canonical && !!pageUrl && !samePage(canonical, pageUrl);
  add('canonical', 'Canonical URL', 'Indexability', canonicals.length !== 1 || !canonical || !pageUrl || canonicalMismatch || !!canonical.hash ? 'fail' : 'pass', 10,
    canonicals.length !== 1 ? `Found ${canonicals.length} canonical links; use exactly one.` : !canonical || !pageUrl ? 'Use a valid absolute HTTP(S) canonical and analysis URL.' : canonicalMismatch ? `The canonical points to a different page: ${canonical.href}` : canonical.hash ? 'Remove the fragment from the canonical URL.' : `The canonical identifies this page: ${canonical.href}`);
  const robots = [...meta('robots'), ...meta('googlebot')].flatMap(value => value.toLowerCase().split(/[\s,]+/));
  const noindex = robots.some(value => value === 'noindex' || value === 'none');
  add('robots', 'Indexing directive', 'Indexability', options.expectedNoindex ? noindex ? 'info' : 'fail' : noindex ? 'fail' : 'pass', 6,
    options.expectedNoindex ? noindex ? 'Intentional noindex: this draft or private page is excluded from scoring.' : 'This page is intended to be excluded but its HTML does not contain noindex.' : noindex ? 'HTML explicitly blocks search indexing.' : 'No HTML noindex directive is present. Response headers and robots.txt are not measured here.');
  const statusKnown = options.httpStatus !== undefined;
  const successful = options.httpStatus === 200;
  add('http-status', 'HTTP response', 'Indexability', !statusKnown ? 'info' : successful ? 'pass' : 'fail', 6,
    !statusKnown ? 'Response status was not supplied; no network check was performed.' : `Observed HTTP ${options.httpStatus}. ${successful ? 'The page is served successfully.' : 'An indexable public page should return 200.'}`);
  add('sitemap', 'Sitemap inclusion', 'Indexability', options.sitemapIncluded === undefined ? 'info' : options.expectedNoindex ? options.sitemapIncluded ? 'fail' : 'info' : options.sitemapIncluded ? 'pass' : 'warn', 4,
    options.sitemapIncluded === undefined ? 'Sitemap membership has not been verified.' : options.expectedNoindex ? options.sitemapIncluded ? 'An intentionally excluded page should not be in the public sitemap.' : 'Excluded page is absent from the sitemap.' : options.sitemapIncluded ? 'This URL was found in the supplied sitemap check.' : 'This public URL was not found in the supplied sitemap check.');

  const headings = contentNodes.filter(node => /^h[1-6]$/.test(node.tagName));
  const h1 = headings.filter(node => node.tagName === 'h1');
  add('h1', 'Main heading', 'Content', h1.length === 1 && !!textContent(h1[0]) ? 'pass' : 'fail', 8,
    h1.length === 1 && !!textContent(h1[0]) ? 'One non-empty H1 identifies the main content.' : `Found ${h1.length} main-content H1 headings; use one non-empty page heading.`);
  const emptyHeadings = headings.filter(node => !textContent(node));
  const skipped = headings.filter((node, i) => i > 0 && Number(node.tagName[1]) > Number(headings[i - 1].tagName[1]) + 1).length;
  add('heading-order', 'Heading structure', 'Content', emptyHeadings.length ? 'fail' : skipped ? 'warn' : 'pass', 4,
    emptyHeadings.length ? `${emptyHeadings.length} empty headings need meaningful labels.` : skipped ? `${skipped} heading level jumps; review the reading hierarchy.` : 'Headings follow a readable hierarchy without skipped levels.');
  add('main-content', 'Readable main content', 'Content', main && content ? 'pass' : 'fail', 5,
    main && content ? 'Main content is present; navigation, hidden markup and scripts are excluded.' : 'No readable main content was found.');
  const words = content.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length || 0;
  add('word-count', 'Article length', 'Content', 'info', 0, `${words} words in the measured content. No minimum length or keyword-density penalty is applied.`);

  const links = bodyNodes.filter(node => node.tagName === 'a').map(node => ({ node, url: httpUrl(attr(node, 'href'), options.url) })).filter(link => link.url && !samePage(link.url, pageUrl));
  const internal = links.filter(link => link.url!.origin === pageUrl?.origin);
  const external = links.filter(link => link.url!.origin !== pageUrl?.origin);
  add('internal-links', 'Contextual internal links', 'Links', internal.length ? 'pass' : 'warn', 6,
    internal.length ? `${internal.length} internal links in ${prose ? 'the article prose' : 'main content'}. Global navigation and same-page anchors do not count.` : 'Add a useful contextual link to a relevant service, guide or related article. Global navigation does not count.');
  const slug = pageUrl?.pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
  const pillar = options.kind === 'post' && slug ? pillarFor(slug) : undefined;
  const isPillar = pillar?.slug === slug;
  const pillarLinks = pillar ? internal.filter(link => isPillar ? pillar.members.some(member => member !== slug && link.url!.pathname.replace(/\/$/, '') === '/blog/' + member) : link.url!.pathname.replace(/\/$/, '') === '/blog/' + pillar.slug) : [];
  add('pillar-links', 'Pillar connections', 'Links', !pillar ? 'info' : pillarLinks.length ? 'pass' : 'warn', 6,
    !pillar ? options.kind === 'post' ? 'No pillar assignment is known for this article. Assign it before claiming a verified pillar connection.' : 'Pillar checks apply to assigned articles.' : pillarLinks.length ? `The prose links to ${isPillar ? 'an article in' : 'the guide for'} ${pillar.title}.` : `Link ${isPillar ? 'from this guide to a supporting article' : 'from the prose to /blog/' + pillar.slug + '/'} to connect ${pillar.title}.`);
  add('link-availability', 'Linked page availability', 'Links', 'info', 0, 'Links have not been fetched. Broken destinations, redirects and access restrictions are unverified.');

  const images = contentNodes.filter(node => node.tagName === 'img');
  const missingAlt = images.filter(node => attr(node, 'alt') === undefined).length;
  const decorative = images.filter(node => attr(node, 'alt') === '').length;
  add('image-alt', 'Image alt text', 'Images', !images.length ? 'info' : missingAlt ? 'fail' : 'pass', 8,
    !images.length ? 'No main-content images to check.' : missingAlt ? `${missingAlt} of ${images.length} images have no alt attribute.` : `All ${images.length} images have alt attributes${decorative ? `; ${decorative} use empty alt for decoration` : ''}. Meaning and visual accuracy still need editorial review.`);
  const dimensioned = images.filter(reservedGeometry).length;
  add('image-dimensions', 'Reserved image geometry', 'Images', !images.length ? 'info' : dimensioned === images.length ? 'pass' : 'warn', 4,
    !images.length ? 'No main-content images to check.' : dimensioned === images.length ? 'Every image reserves width/height or an explicit inline aspect ratio.' : `${images.length - dimensioned} images lack HTML dimensions or an inline aspect ratio. Geometry reserved by an external stylesheet is unverified; review before changing it.`);
  add('image-availability', 'Image availability', 'Images', 'info', 0, 'Image URLs were not requested; response status, file size and visual fidelity are unverified.');

  const ogFields = ['og:title', 'og:description', 'og:url', 'og:type'];
  const ogMissing = ogFields.filter(name => meta(name, true).length !== 1 || !plain(meta(name, true)[0] || ''));
  const ogUrl = httpUrl(meta('og:url', true)[0]);
  add('open-graph', 'Social preview metadata', 'Sharing', ogMissing.length || !samePage(ogUrl, pageUrl) ? 'fail' : 'pass', 4,
    ogMissing.length ? `Missing, empty or duplicated: ${ogMissing.join(', ')}.` : !samePage(ogUrl, pageUrl) ? 'og:url does not identify this page.' : 'Open Graph title, description, type and page URL are present.');
  const ogImages = meta('og:image', true);
  const ogImageValid = ogImages.length > 0 && ogImages.every(value => !!httpUrl(value));
  add('open-graph-image', 'Social preview image', 'Sharing', ogImageValid ? 'pass' : 'fail', 6,
    ogImageValid ? 'An absolute HTTP(S) preview image is declared; availability is not verified.' : 'Declare at least one valid absolute HTTP(S) og:image URL.');
  add('social-image-alt', 'Social image description', 'Images', ogImageValid && meta('og:image:alt', true).some(value => !!plain(value)) ? 'pass' : 'warn', 2,
    meta('og:image:alt', true).some(value => !!plain(value)) ? 'A social image description is present.' : 'Add an accurate og:image:alt description for the preview image.');

  const scripts = headNodes.filter(node => node.tagName === 'script' && (attr(node, 'type') || '').toLowerCase().trim() === 'application/ld+json');
  const entities: JsonObject[] = [];
  let invalidJson = 0;
  for (const script of scripts) {
    try {
      const queue: unknown[] = [JSON.parse(textContent(script))];
      while (queue.length) {
        const value = queue.pop();
        if (Array.isArray(value)) queue.push(...value);
        else if (isObject(value)) {
          entities.push(value);
          queue.push(...Object.values(value).filter(child => typeof child === 'object' && child !== null));
        }
      }
    } catch { invalidJson++; }
  }
  add('json-ld', 'Structured data syntax', 'Structured data', invalidJson || !scripts.length || !entities.some(entity => types(entity).length) ? 'fail' : 'pass', 4,
    invalidJson ? `${invalidJson} JSON-LD blocks cannot be parsed as JSON.` : !scripts.length ? 'No head JSON-LD is present.' : !entities.some(entity => types(entity).length) ? 'JSON-LD parses, but contains no typed entities.' : `${scripts.length} JSON-LD blocks parse with typed entities. Search-engine eligibility is not guaranteed.`);
  const byId = new Map<string, JsonObject>();
  for (const entity of entities) if (typeof entity['@id'] === 'string' && types(entity).length) byId.set(httpUrl(entity['@id'], options.url)?.href || entity['@id'], entity);
  const resolve = (value: unknown): JsonObject | undefined => {
    if (!isObject(value)) return;
    if (types(value).length) return value;
    return typeof value['@id'] === 'string' ? byId.get(httpUrl(value['@id'], options.url)?.href || value['@id']) : undefined;
  };
  const entityUrl = (value: unknown): URL | undefined => typeof value === 'string' ? httpUrl(value, options.url) : isObject(value) ? httpUrl(value.url || value['@id'], options.url) : undefined;
  const articles = entities.filter(entity => types(entity).some(type => ['Article', 'BlogPosting', 'NewsArticle', 'TechArticle'].includes(type)));
  if (options.kind === 'post') {
    const article = articles.find(entity => samePage(entityUrl(entity.mainEntityOfPage), pageUrl)) || articles[0];
    const problems: string[] = [];
    if (!article) problems.push('An Article or BlogPosting entity is missing');
    else {
      if (typeof article.headline !== 'string' || !plain(article.headline)) problems.push('headline is missing');
      else if (h1.length === 1 && plain(article.headline).toLowerCase() !== textContent(h1[0]).toLowerCase()) problems.push('headline differs from the visible H1');
      if (!publicationDate(article.datePublished)) problems.push('datePublished is missing or invalid');
      if (![article.image].flat().some(value => !!entityUrl(value))) problems.push('image is missing or invalid');
      if (!samePage(entityUrl(article.mainEntityOfPage), pageUrl)) problems.push('mainEntityOfPage does not identify this article');
      const publisher = resolve(article.publisher);
      if (!publisher || !types(publisher).includes('Organization') || typeof publisher.name !== 'string' || !plain(publisher.name)) problems.push('publisher does not resolve to a named Organization');
    }
    add('article-schema', 'Article identity', 'Structured data', problems.length ? 'fail' : 'pass', 8, problems.length ? problems.join('; ') + '.' : 'The article headline, publication date, image, page identity and publisher are declared consistently.');
    const authors = article ? [article.author].flat().map(resolve) : [];
    const authorNamesValid = authors.length > 0 && authors.every(author => author && types(author).some(type => ['Person', 'Organization'].includes(type)) && typeof author.name === 'string' && !!plain(author.name));
    const authorVisible = !!main && authorNamesValid && authors.every(author => textContent(main, true).toLowerCase().includes(plain(author!.name as string).toLowerCase()));
    // @id alone is a reference; a resolved Person/Organization must expose a real profile URL.
    const authorUrlsValid = authorNamesValid && authors.every(author => !!httpUrl(author!.url) && !samePage(httpUrl(author!.url), pageUrl));
    add('article-author', 'Author profile linkage', 'Structured data', !authorNamesValid || !authorVisible ? 'fail' : !authorUrlsValid ? 'warn' : 'pass', 6,
      !authorNamesValid ? 'The Article author must resolve to its own named Person or Organization; unrelated graph entities do not count.' : !authorVisible ? 'The structured author name is not present in the visible main content; align the byline and schema.' : !authorUrlsValid ? 'The named author needs an absolute HTTP(S) profile URL distinct from this article.' : 'The Article links to a named author with a profile URL, and the name appears in visible content.');
  }

  const keyword = plain(options.focusKeyword || '').toLowerCase();
  const keywordPlaces = keyword ? [['title', title], ['description', description], ['H1', h1[0] ? textContent(h1[0]) : ''], ['body', content]].filter(([, value]) => value.toLowerCase().includes(keyword)).map(([label]) => label) : [];
  add('focus-keyword', 'Focus topic', 'Content', 'info', 0, keyword ? `The supplied phrase appears in ${keywordPlaces.length ? keywordPlaces.join(', ') : 'none of the measured fields'}. This is editorial advice only; synonyms and natural language are valid. No density score is used.` : 'No focus topic was supplied. Keyword matching is editorial advice, not a ranking measurement.');
  const blocked = noindex || (statusKnown && !successful) || canonicalMismatch || !pageUrl;
  const applicable = checks.reduce((sum, check) => sum + check.maxPoints, 0);
  const earned = checks.reduce((sum, check) => sum + check.points, 0);
  const score = options.expectedNoindex || blocked ? null : applicable ? Math.round(earned / applicable * 100) : null;
  const grade = options.expectedNoindex ? 'excluded' : blocked ? 'blocked' : score !== null && score >= 90 ? 'strong' : score !== null && score >= 70 ? 'improve' : 'needs-work';
  const summary = `${options.expectedNoindex ? 'Intentionally excluded from the public-page score.' : blocked ? 'Resolve the indexing or response block before using a numeric score.' : `Earned ${earned} of ${applicable} applicable checklist points.`} ${overrides ? 'Draft fields are overlaid on the supplied HTML; this is not a live-publish verification. ' : ''}This is a transparent on-page checklist, not a ranking prediction. Unknown network measurements do not earn points.`;
  return { score, grade, checks, summary, counts: { words, internalLinks: internal.length, externalLinks: external.length, images: images.length }, indexable: !blocked };
}
