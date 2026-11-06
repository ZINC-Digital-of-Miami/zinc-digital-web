import { GA4_TAG } from './analytics.ts';

type Tag = (command: string, name: string, options: Record<string, unknown>) => void;
type Clarity = (command: string, ...args: unknown[]) => void;
export type RfpEvent = 'view_service' | 'view_case_study' | 'rfp_cta_click' | 'rfp_form_view' | 'rfp_form_start' | 'rfp_scope_view' | 'rfp_context_view' | 'rfp_submit_attempt' | 'rfp_submit_error' | 'contact_click' | 'contact_message_sent' | 'content_question_sent';
/** Deliberate, bounded dimensions only: never forward form values or arbitrary attributes. */
export function trackRfp(event: RfpEvent, values: {service_slug?: string; contact_method?: string; error_type?: string} = {}, tag?: Tag, clarity?: Clarity) {
  const formId = event === 'contact_message_sent' ? 'message' : event === 'content_question_sent' ? 'content_question' : event === 'contact_click' ? 'contact' : event.startsWith('rfp_') ? 'proposal_request' : undefined;
  const params: Record<string, string> = {send_to: GA4_TAG, ...(formId ? {form_id:formId} : {})};
  if (values.service_slug && /^[a-z][a-z0-9-]{0,49}$/.test(values.service_slug)) params.service_slug = values.service_slug;
  if (values.contact_method && ['email','phone','sms','message'].includes(values.contact_method)) params.contact_method = values.contact_method;
  if (values.error_type && ['validation','server','network','blocked','rate_limit'].includes(values.error_type)) params.error_type = values.error_type;
  try { tag?.('event', event, params); } catch { /* Reporting must not block the visitor. */ }
  try {
    if (formId) clarity?.('set','form_id',formId);
    if (formId === 'proposal_request' && params.service_slug) clarity?.('set','rfp_service',params.service_slug);
    clarity?.('event', event);
  } catch { /* Recording must not block the visitor. */ }
}


/** Public article choices and resource names only; engagement is separate from proposal conversions. */
export function trackContent(event:'blog_filter_change'|'blog_filter_reset'|'resource_download', values:{service_slug?:string;content_layer?:string;file_name?:string}={}, tag?:Tag, clarity?:Clarity) {
 const params:Record<string,string>={send_to:GA4_TAG};
 if(values.service_slug&&/^[a-z][a-z0-9-]{0,49}$/.test(values.service_slug))params.service_slug=values.service_slug;
 if(values.content_layer&&['Build','Demand','Intelligence'].includes(values.content_layer))params.content_layer=values.content_layer;
 const file=values.file_name?.match(/^([a-z0-9-]+)\.(csv|pdf|xlsx)$/);
 if(file){params.file_name=file[0];params.file_extension=file[2];}
 try{tag?.('event',event,params);}catch{/* Engagement reporting must not block navigation. */}
 try{
  if(event.startsWith('blog_filter_')&&params.service_slug)clarity?.('set','blog_filter_topic',params.service_slug);
  if(params.file_name)clarity?.('set','resource_name',params.file_name);
  if(params.file_extension)clarity?.('set','resource_type',params.file_extension);
  clarity?.('event',event);
 }catch{/* Recording must not block navigation. */}
}
