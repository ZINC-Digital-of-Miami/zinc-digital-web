import {trackRfp,trackContent} from '../lib/rfp-tracking';

export function initPageTracking() {
  const data = document.documentElement.dataset;
  const service = data.serviceSlug;
  if (data.pageType === 'service') trackRfp('view_service',{service_slug:service},window.gtag,window.clarity);
  if (data.pageType === 'case') trackRfp('view_case_study',{},window.gtag,window.clarity);
  document.addEventListener('click', (event) => {
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!anchor) return;
    const url = new URL(anchor.href, location.href);
    if(url.origin===location.origin&&/^\/downloads\/[a-z0-9-]+\.(csv|pdf|xlsx)$/.test(url.pathname)){
      trackContent('resource_download',{service_slug:service,content_layer:data.contentLayer,file_name:url.pathname.split('/').pop()},window.gtag,window.clarity);
    } else if (url.origin === location.origin && url.pathname === '/contact/' && ['#message-jaymie','#message-wendy'].includes(url.hash)) {
      trackRfp('contact_click',{contact_method:'message'},window.gtag,window.clarity);
    } else if (['mailto:','tel:','sms:'].includes(url.protocol)) {
      trackRfp('contact_click',{contact_method: url.protocol === 'mailto:' ? 'email' : url.protocol === 'tel:' ? 'phone' : 'sms'},window.gtag,window.clarity);
    } else if (url.origin === location.origin && url.pathname === '/contact/') {
      trackRfp('rfp_cta_click',{service_slug:url.searchParams.get('service') || service},window.gtag,window.clarity);
    }
  });
}
