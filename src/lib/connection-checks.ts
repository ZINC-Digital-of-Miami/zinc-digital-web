export type ConnectionCheck={name:string;status:'verified'|'configured'|'failed'|'unavailable';detail:string};
export async function connectionCheck(name:string,operation:()=>Promise<string>):Promise<ConnectionCheck>{
 try{return{name,status:'verified',detail:await operation()};}
 catch(e){return{name,status:'failed',detail:e instanceof Error?e.message:'Access could not be verified.'};}
}
