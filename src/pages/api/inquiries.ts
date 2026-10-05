// POST /api/inquiries/ — the contact form's script path: JSON in, JSON out, always no-store. The no-JavaScript
// path is /contact/send/. Both decide through handle() in src/lib/inquiry.ts: size, honeypot,
// origin, validation, the per-client rate limit, the insert and the Workspace SMTP notification.
export const prerender = false;
import type { APIRoute } from 'astro';
import { env } from '../../lib/env';
import { handle, jsonAnswer, liveDeps } from '../../lib/inquiry';

export const POST: APIRoute = async ({ request, clientAddress }) =>
  jsonAnswer(await handle(request, clientAddress, { siteOrigin: env.siteOrigin(), deps: liveDeps }));
