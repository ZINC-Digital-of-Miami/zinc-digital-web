import guideData from './article-guides.json' with {type:'json'};
import type {AddedArticle} from './article-additions.ts';
import { articleFeatures } from './article-features.ts';
import { articleAdditions } from './article-additions.ts';
import { articleHowtos } from './article-howtos.ts';
import { articleResearchGuides } from './article-research-guides.ts';
import { articlePlatformBasics } from './article-platform-basics.ts';

export const articleGuides = guideData as AddedArticle[];
export const authoredArticles = [...articleGuides, ...articleAdditions, ...articleHowtos, ...articleResearchGuides, ...articlePlatformBasics, ...articleFeatures];
