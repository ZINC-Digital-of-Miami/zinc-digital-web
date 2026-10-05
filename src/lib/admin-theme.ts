import {createHash} from 'node:crypto';
export const adminThemeScript="try{document.documentElement.dataset.theme=localStorage.getItem('zinc-theme')==='light'?'light':'dark'}catch{}";
export const adminThemeHash=`sha256-${createHash('sha256').update(adminThemeScript).digest('base64')}` as const;
