import type {APIRoute} from 'astro';
import {SITE, EMAIL, layers, layerMeta, services, cases} from '../data/site';

export const GET: APIRoute = () => new Response([
  '# ZINC Digital',
  '',
  '> ZINC Digital is a digital agency based in Miami, Florida. Its work spans Build, Demand and Intelligence.',
  '',
  '## Layers',
  ...layers.map(layer => '- ' + layer + ': ' + layerMeta[layer].line),
  '',
  '## Services',
  ...services.map(service => '- [' + service.title + '](' + SITE + '/services/' + service.slug + '/): ' + service.line),
  '',
  '## Work',
  ...cases.map(study => '- [' + study.title + '](' + SITE + '/work/' + study.slug + '/): ' + study.line),
  '',
  '## Contact',
  '- [Contact ZINC](' + SITE + '/contact/)',
  '- Email: ' + EMAIL,
  '',
].join('\n'), {headers:{'content-type':'text/plain; charset=utf-8'}});
