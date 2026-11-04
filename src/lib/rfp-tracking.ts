import { GA4_TAG } from './analytics.ts';

type Tag = (command: string, name: string, options: Record<string, unknown>) => void;
type Clarity = (command: string, ...args: unknown[]) => void;
export type RfpEvent = 'view_service' | 'view_case_study' | 'rfp_cta_click' | 'rfp_form_view' | 'rfp_form_start' | 'rfp_scope_view' | 'rfp_context_view' | 'rfp_submit_attempt' | 'rfp_submit_error' | 'contact_click' | 'contact_message_sent' | 'content_question_sent';
/** Deliberate, bounded dimensions only: never forward form values or arbitrary attributes. */
export function trackRfp(event: RfpEvent, values: {service_slug?: string; contact_method?: string; error_type?: string} = {}, tag?: Tag, clarity?: Clarity) {
  const params: Record<string, string> = {send_to: GA4_TAG, form_id: event === 'contact_message_sent' ? 'message' : event === 'content_question_sent' ? 'content_question' : event === 'contact_click' ? 'contact' : 'proposal_request'};
  if (values.service_slug && /^[a-z][a-z0-9-]{0,49}$/.test(values.service_slug)) params.service_slug = values.service_slug;
  if (values.contact_method && ['email','phone','sms','message'].includes(values.contact_method)) params.contact_method = values.contact_method;
  if (values.error_type && ['validation','server','network','blocked','rate_limit'].includes(values.error_type)) params.error_type = values.error_type;
  try { tag?.('event', event, params); } catch { /* Reporting must not block the visitor. */ }
  try { clarity?.('event', event); } catch { /* Recording must not block the visitor. */ }
}
