import {SquareClient,type SquareConfig} from './square-client';
export function squareConfig():SquareConfig{
 const e=import.meta.env;const environment=e.SQUARE_ENVIRONMENT;
 if(environment&&environment!=='sandbox'&&environment!=='production')throw new Error('Set Square environment to sandbox or production.');
 return{token:(e.SQUARE_ACCESS_TOKEN||'').trim(),locationId:(e.SQUARE_LOCATION_ID||'').trim(),environment:environment==='production'?'production':'sandbox'};
}
export const squareClient=()=>new SquareClient(squareConfig());
