// Public tag IDs from the approved launch plan. No credentials or inquiry fields enter analytics.
export const GOOGLE_TAG = 'GT-NNZRWNCF';
export const GA4_TAG = 'G-BV43HRVJ18';
export const ADS_TAG = 'AW-17071018445';
export const analyticsEnabled = (flag?: string, environment?: string) => flag === 'on' && environment === 'production';
const conversionLabel = (label: string) => /^[A-Za-z0-9_-]+$/.test(label) ? label : '';

/** Production artifacts also have Vercel aliases: never count those visits as live-site traffic. */
export function googleTagScript(label = ''): string {
  return `(function(){if(!['www.zincdigital.co','zincdigital.co'].includes(location.hostname))return;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.zincAdsConversionLabel=${JSON.stringify(conversionLabel(label))};window.gtag('js',new Date());var ref='';try{var u=new URL(document.referrer);ref=u.origin+u.pathname}catch{}window.gtag('set',{page_location:location.origin+location.pathname,page_referrer:ref});window.gtag('config','${GA4_TAG}');window.gtag('config','${ADS_TAG}');var tag=document.createElement('script');tag.async=true;tag.src='https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG}';document.head.appendChild(tag);})();`;
}

type Tag = (command: string, name: string, options: Record<string, unknown>) => void;

/** Wait briefly for delivery before leaving the form, with a fallback for blocked Google scripts. */
export async function trackLead(result: unknown, tag?: Tag, label = ''): Promise<void> {
  if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true || !('lead' in result) || result.lead !== true || !tag) return;
  const ads = conversionLabel(label);
  await new Promise<void>((resolve) => {
    let remaining = ads ? 2 : 1;
    const finish = () => { clearTimeout(timer); resolve(); };
    const timer = setTimeout(finish, 1100);
    const delivered = () => { if (--remaining === 0) finish(); };
    const options = { event_callback: delivered, event_timeout: 1000 };
    try {
      tag('event', 'generate_lead', { ...options, send_to: GA4_TAG });
      if (ads) tag('event', 'conversion', { ...options, send_to: ADS_TAG + '/' + ads });
    } catch { finish(); }
  });
}
