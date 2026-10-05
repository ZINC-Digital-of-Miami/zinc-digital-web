// Every admin page and staff API, with the role it needs (design section 6.3.8). Middleware gates these
// prefixes, each route also calls requireStaff, and tests/private-routes.test.ts fails when a file under
// src/pages/admin or a staff API folder is missing from this list.
import type { Role } from '../lib/auth';

export type PrivateRoute = { path: string; kind: 'page' | 'api'; role: Role; file: string };

/** Sign-in, confirm and sign-out must stay reachable without a staff role. */
export const PUBLIC_ADMIN_PATHS = ['/admin/login/', '/admin/auth/confirm/', '/api/admin/signout/'];

/** Path prefixes that need a staff session. */
export const PRIVATE_PREFIXES = ['/admin/', '/api/admin/', '/api/research/'];

export const PRIVATE_ROUTES: PrivateRoute[] = [
  { path: '/api/admin/google/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/google.ts' },
  { path: '/admin/research/', kind: 'page', role: 'editor', file: 'src/pages/admin/research.astro' },
  { path: '/api/admin/research/projects/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/research/projects.ts' },
  { path: '/api/admin/research/ingest/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/research/ingest.ts' },
  { path: '/api/admin/research/upload-url/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/research/upload-url.ts' },
  { path: '/api/admin/research/chat/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/research/chat.ts' },
  { path: '/api/admin/research/source/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/research/source.ts' },
  { path: '/admin/inquiries/', kind: 'page', role: 'editor', file: 'src/pages/admin/inquiries.astro' },
  { path: '/admin/pages/', kind: 'page', role: 'editor', file: 'src/pages/admin/pages.astro' },
  { path: '/admin/posts/', kind: 'page', role: 'editor', file: 'src/pages/admin/posts.astro' },
  { path: '/admin/seo/', kind: 'page', role: 'editor', file: 'src/pages/admin/seo.astro' },
  { path: '/admin/stats/', kind: 'page', role: 'editor', file: 'src/pages/admin/stats.astro' },
  { path: '/admin/backend/', kind: 'page', role: 'editor', file: 'src/pages/admin/backend.astro' },
  { path: '/admin/staff/', kind: 'page', role: 'editor', file: 'src/pages/admin/staff.astro' },
  { path: '/api/admin/inquiries/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/inquiries.ts' },
  { path: '/api/admin/content/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/content.ts' },
  { path: '/api/admin/metrics/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/metrics.ts' },
  { path: '/api/admin/staff/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/staff.ts' },
  { path: '/api/admin/publish/', kind: 'api', role: 'owner', file: 'src/pages/api/admin/publish.ts' },
  { path: '/api/admin/redeploy/', kind: 'api', role: 'owner', file: 'src/pages/api/admin/redeploy.ts' },
  { path: '/admin/', kind: 'page', role: 'editor', file: 'src/pages/admin/index.astro' },
  { path: '/api/admin/notify/', kind: 'api', role: 'editor', file: 'src/pages/api/admin/notify.ts' },
  { path: '/api/research/chat/', kind: 'api', role: 'editor', file: 'src/pages/api/research/chat.ts' },
  { path: '/api/research/ingest/', kind: 'api', role: 'editor', file: 'src/pages/api/research/ingest.ts' },
];

export const isPublicAdmin = (path: string) => PUBLIC_ADMIN_PATHS.includes(path);
export const isPrivatePath = (path: string) => !isPublicAdmin(path) && PRIVATE_PREFIXES.some((p) => path.startsWith(p) || path + '/' === p);
