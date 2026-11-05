import {SERVICE_SLUGS} from './inquiry.ts';
/** Explicit editorial ownership; related links never choose the proposal destination. */
export function proposalPillar(primaryService: unknown): string | undefined {
  return typeof primaryService === 'string' && SERVICE_SLUGS.includes(primaryService) ? primaryService : undefined;
}
