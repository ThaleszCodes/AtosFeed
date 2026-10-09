/** Reject privileged keys before they can be used in a browser client. */
export function isPublishableKey(key:string|undefined):boolean{
 if(!key||key==='replace_with_publishable_key')return false;
 if(key.startsWith('sb_publishable_'))return true;
 if(key.split('.').length!==3)return false;
 try{return JSON.parse(atob(key.split('.')[1].replaceAll('-','+').replaceAll('_','/'))).role==='anon';}catch{return false;}
}
export function isSupabaseUrl(value:string|undefined):boolean{
 if(!value)return false;
 try{const u=new URL(value);return !u.username&&!u.password&&!u.search&&!u.hash&&u.pathname==='/'&&(u.protocol==='https:'||(u.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(u.hostname)));}catch{return false;}
}
