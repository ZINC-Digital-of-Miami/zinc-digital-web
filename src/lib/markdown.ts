import { Marked } from 'marked';
const escape = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export const safeLink = (s:string) => !/[\u0000-\u0020\\]/.test(s) && (/^https?:\/\//i.test(s) || /^mailto:/i.test(s) || /^\/(?!\/)/.test(s) || /^#[\w-]+$/.test(s));
const markdown = new Marked({async:false,renderer:{
  html({text}) { return escape(text); },
  link({href,title,tokens}) { const text=this.parser.parseInline(tokens); return safeLink(href) ? `<a href="${escape(href)}"${title?` title="${escape(title)}"`:''}>${text}</a>` : text; },
  image({href,text,title}) { return /^\/(?!\/)/.test(href)&&safeLink(href) ? `<img src="${escape(href)}" alt="${escape(text)}"${title?` title="${escape(title)}"`:''} loading="lazy" decoding="async">` : escape(text); },
}});
export function renderMarkdown(body:string):string { return markdown.parse(body) as string; }
