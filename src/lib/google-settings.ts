export type GoogleSettings={property:string;site:string};
export function googleSettingsInput(value:unknown):GoogleSettings {
 const data=value as Partial<GoogleSettings>|null;
 if(!data||typeof data.property!=='string'||!/^\d{1,20}$/.test(data.property))throw new Error('Enter the numeric GA4 property ID.');
 if(typeof data.site!=='string'||!['','sc-domain:zincdigital.co','https://zincdigital.co/','https://www.zincdigital.co/'].includes(data.site))throw new Error('Choose the exact Search Console property for zincdigital.co.');
 return {property:data.property,site:data.site};
}
