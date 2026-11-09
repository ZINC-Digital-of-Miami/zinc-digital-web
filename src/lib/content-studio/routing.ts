import {RESEARCH_JOBS} from './research-jobs.ts';
/** Owner-approved routing, 9 November 2026. No implicit provider fallback. */
export const STUDIO_ACTIONS={
 demand:{provider:'claude',task:RESEARCH_JOBS.demand.task},
 intent:{provider:'claude',task:RESEARCH_JOBS.intent.task},
 gaps:{provider:'claude',task:RESEARCH_JOBS.gaps.task},
 experience:{provider:'claude',task:RESEARCH_JOBS.experience.task},
 creativeResearch:{provider:'claude',task:RESEARCH_JOBS.creativeResearch.task},
 topicPlan:{provider:'claude',task:RESEARCH_JOBS.topicPlan.task},
 write:{provider:'gpt',task:'Write the complete publishable manuscript in the assigned author voice.'},
 creative:{provider:'gpt',task:'Develop a specific on-brand creative concept, exact copy, composition and asset brief. Do not replace the manuscript.'},
 image:{provider:'gpt',task:'Generate one on-brand editorial illustration using the supplied topic and asset instructions. Off-white studio composition, teal and restrained magenta, sharp meaningful type, white mugs only. Do not invent logos or data. This is a review draft, not a published asset.'},
 chat:{provider:'gpt',task:'Answer the saved brief question conversationally using the supplied evidence. Explain gaps and cite supplied sources. Do not invent browsing or actions.'},
 research:{provider:'claude',task:'Analyze the topic opportunity, audience, intent, evidence gaps and overlap using supplied sources and measured performance.'},
 revise:{provider:'claude',task:'Apply the owner instruction to the saved manuscript and return the complete revised manuscript. Change only what the instruction requires.'},
 review:{provider:'claude',task:'Challenge the full draft against its reader task, sources, voice, pillar, resources and release checks. Do not approve or publish it.'},
 plan:{provider:'claude',task:'Create an actionable research and implementation plan with dependencies, evidence needed, verification and explicit unknowns.'},
 develop:{provider:'claude',task:'Propose development changes with concrete implementation details and verification. You cannot execute code, access secrets, deploy or change the site.'},
 orchestrate:{provider:'claude',task:'Plan the agent workflow: assign research, reasoning and engineering to Fable High, writing, artwork and chat to Terra High. Specify inputs, expected outputs, dependencies and review boundaries. No agents are executed by this proposal.'},
} as const;
export type StudioAction=keyof typeof STUDIO_ACTIONS;
export function studioAction(value:unknown){if(typeof value!=='string'||!Object.hasOwn(STUDIO_ACTIONS,value))throw new Error('Choose a supported Studio task.');return {action:value as StudioAction,...STUDIO_ACTIONS[value as StudioAction]};}
