// Retain the original path as a session-protected alias to the approved ingestion route.
export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {POST as ingest} from '../admin/research/ingest';
export const POST:APIRoute=ctx=>{const staff=requireStaff(ctx);return staff instanceof Response?staff:ingest(ctx);};
