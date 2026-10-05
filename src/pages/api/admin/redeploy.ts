export const prerender=false;
import type {APIRoute} from 'astro';
import {requireStaff} from '../../../lib/auth';
import {input,reply,fail} from '../../../lib/admin-http';
import {triggerBuild} from '../../../lib/vercel';
export const POST:APIRoute=async ctx=>{
 const staff=requireStaff(ctx,'owner');if(staff instanceof Response)return staff;
 try{const body=await input(ctx);if(body.confirm!==true)return fail('Confirm the redeploy first.');return reply({ok:true,job:await triggerBuild()});}
 catch(e){return reply({error:e instanceof Error?e.message:'The deployment could not be started.'},502);}
};
