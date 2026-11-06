import {subscriptionTopics} from './subscription-topics.ts';
// Public tag IDs from the approved launch plan. No credentials or inquiry fields enter analytics.
export const GOOGLE_TAG = 'GT-NNZRWNCF';
export const GA4_TAG = 'G-BV43HRVJ18';
export const ADS_TAG = 'AW-17071018445';
export const analyticsEnabled = (flag?: string, environment?: string) => flag === 'on' && environment === 'production';
const conversionLabel = (label: string) => /^[A-Za-z0-9_-]+$/.test(label) ? label : '';

/** Production artifacts also have Vercel aliases: never count those visits as live-site traffic. */
export function googleTagScript(label = ''): string {
  return `(function(){var c=window.zincConsent;if(!c||(!c.analytics&&!c.advertising))return;if(!['www.zincdigital.co','zincdigital.co'].includes(location.hostname))return;var page=new URL(location.href);if(page.searchParams.get('zinc_qa')==='1')return;window.dataLayer=window.dataLayer||[];window.gtag=function(command,name,options){if(command==='event'&&options&&((options.send_to==='${GA4_TAG}'&&!c.analytics)||(String(options.send_to).startsWith('${ADS_TAG}')&&!c.advertising))){if(typeof options.event_callback==='function')options.event_callback();return}window.dataLayer.push(arguments)};window.zincAdsConversionLabel=${JSON.stringify(conversionLabel(label))};window.gtag('consent','default',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.advertising?'granted':'denied',ad_user_data:c.advertising?'granted':'denied',ad_personalization:c.advertising?'granted':'denied'});window.gtag('set','ads_data_redaction',!c.advertising);window.gtag('set','url_passthrough',false);window.gtag('js',new Date());var ref='';try{var u=new URL(document.referrer);ref=u.origin+u.pathname}catch{}var page=new URL(location.href),clean=new URL(page.origin+page.pathname);['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','gbraid','wbraid'].forEach(function(key){var value=page.searchParams.get(key);if(value&&(c.advertising||!['gclid','dclid','gbraid','wbraid'].includes(key)))clean.searchParams.set(key,value)});window.gtag('set',{page_location:clean.href,page_referrer:ref});var context=document.documentElement?.dataset||{};window.gtag('set',{content_group:context.pageType||'page',page_type:context.pageType||'page',page_slug:context.pageSlug||location.pathname,service_slug:context.serviceSlug||''});if(['Build','Demand','Intelligence'].includes(context.contentLayer))window.gtag('set','content_layer',context.contentLayer);if(c.analytics)window.gtag('config','${GA4_TAG}',{allow_google_signals:c.advertising,allow_ad_personalization_signals:c.advertising});if(c.advertising)window.gtag('config','${ADS_TAG}');var tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}';document.head.appendChild(tag);})();`;
}

type Tag = (command: string, name: string, options: Record<string, unknown>) => void;

/** Wait briefly for delivery before leaving the form, with a fallback for blocked Google scripts. */
export async function trackLead(result: unknown, tag?: Tag, label = '', serviceSlug = '', clarity?: (command:string,...args:unknown[])=>void): Promise<void> {
  if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true || !('lead' in result) || result.lead !== true) return;
  try {
    clarity?.('set','form_id','proposal_request');
    if (/^[a-z][a-z0-9-]{0,49}$/.test(serviceSlug)) clarity?.('set','rfp_service',serviceSlug);
    clarity?.('event','generate_lead');
  } catch { /* Recording must not block the confirmed inquiry. */ }
  if (!tag) return;
  const ads = conversionLabel(label);
  await new Promise<void>((resolve) => {
    let remaining = ads ? 2 : 1;
    const finish = () => { clearTimeout(timer); resolve(); };
    const timer = setTimeout(finish, 1100);
    const delivered = () => { if (--remaining === 0) finish(); };
    const options = { event_callback: delivered, event_timeout: 1000 };
    try {
      tag('event', 'generate_lead', { ...options, send_to: GA4_TAG, form_id:'proposal_request', ...(/^[a-z][a-z0-9-]{0,49}$/.test(serviceSlug) ? {service_slug:serviceSlug} : {}) });
      if (ads) tag('event', 'conversion', { ...options, send_to: ADS_TAG + '/' + ads });
    } catch { finish(); }
  });
}


// Existing ZINC Co project; no admin pages or preview hosts use this loader.
export const CLARITY_PROJECT = 'p6dd6jjhx3';
export function clarityScript(): string {
  return `(function(){var c=window.zincConsent;if(!c||!c.recordings)return;if(!['www.zincdigital.co','zincdigital.co'].includes(location.hostname))return;var u=new URL(location.href);if(u.searchParams.get('zinc_qa')==='1')return;var topics=${JSON.stringify(subscriptionTopics.map(topic=>topic.slug))};if(u.searchParams.has('topic')&&(u.pathname!=='/subscribe/'||u.searchParams.getAll('topic').some(function(value){return topics.indexOf(value)<0})))return;var allowed=['topic','service','layer','utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_id','utm_source_platform','utm_creative_format','utm_marketing_tactic','gclid','dclid','gbraid','wbraid'];if(Array.from(u.searchParams.keys()).some(function(k){return allowed.indexOf(k)<0}))return;window.clarity=window.clarity||function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};window.clarity('consentv2',{analytics_Storage:'granted',ad_Storage:c.advertising?'granted':'denied'});var d=document.documentElement.dataset;window.clarity('set','page_type',d.pageType||'page');if(d.serviceSlug)window.clarity('set','service_slug',d.serviceSlug);if(d.pageSlug&&/^\\/(?:[a-z0-9-]+\\/)*$/.test(d.pageSlug))window.clarity('set','page_slug',d.pageSlug);if(['Build','Demand','Intelligence'].includes(d.contentLayer))window.clarity('set','content_layer',d.contentLayer);var t=document.createElement('script');t.async=true;t.src='https://www.clarity.ms/tag/${CLARITY_PROJECT}';document.head.appendChild(t);})();`;
}
