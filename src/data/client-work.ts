// Reconciled from PR #32 using the current lane content and approved portfolio order.
import { laneNames, workLanes, projectLink } from './work-lanes.ts';
export const clientOrder = ['bear-claw-usa','smoky-mountain-survival','fraim-cawley-company','andrew-neese','porsche-roanoke','felon-motorwerk','summit-marine-development','us-oil-solutions','carla-funk-photography','ballad-health','meade-tractor','general-shale','las-vegas-safety','zinc-fusion-v16','the-lampstand-va','straight-street-ministries','miami-tactical'];
export function workFor(slug: string) {
  return laneNames.flatMap(layer => workLanes[layer].projects.filter(p => p.slug === slug).map(project => ({
    ...project, layer, href: (project.href || projectLink(slug, layer)).replace(new RegExp('/' + slug + '/$'), '/' + slug + '/#case-story'),
  })));
}
export function nextClient(slug: string) {
  const index = clientOrder.indexOf(slug);
  if (index < 0) throw new Error('Unknown portfolio client: ' + slug);
  return clientOrder[(index + 1) % clientOrder.length];
}
