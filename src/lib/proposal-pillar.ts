import {SERVICE_SLUGS} from './inquiry.ts';
/** Article memberships are editorially ordered. The first current service owns its proposal entry point. */
export function proposalPillar(related: readonly string[]): string | undefined {
  return related.find(slug => SERVICE_SLUGS.includes(slug));
}
