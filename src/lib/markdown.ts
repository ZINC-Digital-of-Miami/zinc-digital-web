import { Marked } from 'marked';
import { parseFragment, type DefaultTreeAdapterMap } from 'parse5';
const escape = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export const safeLink = (s:string) => !/[\u0000-\u0020\\]/.test(s) && (/^https?:\/\//i.test(s) || /^mailto:/i.test(s) || /^\/(?!\/)/.test(s) || /^#[\w-]+$/.test(s));
const markdown = new Marked({async:false,renderer:{
  html({text}) { return escape(text); },
  link({href,title,tokens}) { const text=this.parser.parseInline(tokens); return safeLink(href) ? `<a href="${escape(href)}"${title?` title="${escape(title)}"`:''}>${text}</a>` : text; },
  image({href,text,title}) { return /^\/(?!\/)/.test(href)&&safeLink(href) ? `<img src="${escape(href)}" alt="${escape(text)}"${title?` title="${escape(title)}"`:''} loading="lazy" decoding="async">` : escape(text); },
}});
export function renderMarkdown(body:string):string { return markdown.parse(body) as string; }

// Render once so the table of contents and its targets always describe the same draft.
export function renderArticleMarkdown(body:string) {
  const sections: {id:string;label:string}[] = [];
  const text = (node:DefaultTreeAdapterMap['node']):string => node.nodeName === '#text' ? (node as DefaultTreeAdapterMap['textNode']).value : 'childNodes' in node ? node.childNodes.map(text).join('') : '';
  const html = renderMarkdown(body).replace(/<h([2-6])>([\s\S]*?)<\/h\1>/g, (_,level,inner) => {
    const id='article-section-'+sections.length;
    const label=text(parseFragment(inner)).trim();
    if (!label) return `<h${level}>${inner}</h${level}>`;
    sections.push({id,label});
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return {html,sections};
}
