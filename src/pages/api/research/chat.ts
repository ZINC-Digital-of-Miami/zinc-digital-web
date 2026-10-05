// Retain the original path as a session-protected alias. No custom bridge or embedding API.
export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {POST as chat} from '../admin/research/chat';
export const POST:APIRoute=ctx=>{const staff=requireStaff(ctx);return staff instanceof Response?staff:chat(ctx);};
