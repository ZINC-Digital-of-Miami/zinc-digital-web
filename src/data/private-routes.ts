// Every admin page and staff API, with the role it needs (design section 6.3.8). Middleware gates these
// prefixes, each route also calls requireStaff, and tests/private-routes.test.ts fails when a file under
// src/pages/admin or a staff API folder is missing from this list.
import type { Role } from '../lib/auth';

export type PrivateRoute = { path: string; kind: 'page' | 'api'; role: Role; file: string };

/** Sign-in pages that must stay reachable without a session. */
export const PUBLIC_ADMIN_PATHS = ['/admin/login/', '/admin/auth/confirm/', '/admin/callback/'];

/** Path prefixes that need a staff session. */
export const PRIVATE_PREFIXES = ['/admin/', '/api/admin/', '/api/research/', '/api/inquiries/email/'];

export const PRIVATE_ROUTES: PrivateRoute[] = [
  { path: '/admin/', kind: 'page', role: 'editor', file: 'src/pages/admin/index.astro' },
  { path: '/api/research/chat/', kind: 'api', role: 'editor', file: 'src/pages/api/research/chat.ts' },
  { path: '/api/research/ingest/', kind: 'api', role: 'editor', file: 'src/pages/api/research/ingest.ts' },
  { path: '/api/inquiries/email/', kind: 'api', role: 'editor', file: 'src/pages/api/inquiries/email.ts' },
];

export const isPublicAdmin = (path: string) => PUBLIC_ADMIN_PATHS.includes(path);
export const isPrivatePath = (path: string) => !isPublicAdmin(path) && PRIVATE_PREFIXES.some((p) => path.startsWith(p) || path + '/' === p);
