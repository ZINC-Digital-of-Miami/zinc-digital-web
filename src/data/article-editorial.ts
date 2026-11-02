import {authoredArticles} from './article-library.ts';
/** Search presentation comes from each canonical article record. */
export const articleEditorial:Record<string,{title:string;description:string;keywords:string[]}>=Object.fromEntries(authoredArticles.map(p=>[p.slug,{title:p.title,description:p.description,keywords:p.keywords}]));
