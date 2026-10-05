export const prerender=false;
export const maxDuration=60;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../../lib/auth';
import {createServerClient} from '../../../../lib/supabase';
import {input,reply,fail} from '../../../../lib/admin-http';
import {ingest} from '../../../../lib/research/ingest';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx);if(staff instanceof Response)return staff;
 try{const result=await ingest(createServerClient(ctx),staff.id,await input(ctx,850000),import.meta.env.SERPAPI_KEY||'');return reply(result,result.ok?200:502);}
 catch(e){return fail((e as Error).message);}
};
