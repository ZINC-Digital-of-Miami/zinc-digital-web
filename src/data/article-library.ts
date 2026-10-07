import { articleAdditions } from './article-additions.ts';
import { articleHowtos } from './article-howtos.ts';
import { articleResearchGuides } from './article-research-guides.ts';
import { articlePlatformBasics } from './article-platform-basics.ts';

export const authoredArticles = [...articleAdditions, ...articleHowtos, ...articleResearchGuides, ...articlePlatformBasics];
