export const FACEBOOK_PERMISSION='https://www.facebook.com/*';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
// Called directly from a user click; request must happen before the first await.
/** @param {{chrome:any,scan:(tabId:number,payload:{scroll:boolean})=>Promise<any>,sync?:((groups:any[])=>Promise<any>)|null,onProgress?:(progress:{count:number,round:number})=>void,cancelled?:()=>boolean,grantedBefore?:boolean,wait?:(ms:number)=>Promise<void>,maxRounds?:number,maxGroups?:number}} options */
export async function discoverGroups({chrome,scan,sync=null,onProgress=()=>{},cancelled=()=>false,grantedBefore=false,wait=delay,maxRounds=30,maxGroups=500}){
 const permission=chrome.permissions.request({origins:[FACEBOOK_PERMISSION]});
 const execute=async()=>{
 let tab=null,granted=false;const groups=new Map();let settled=0,previousScroll=null,complete=false,stop='limit';
 try{
  granted=await permission;if(!granted)return {state:'denied',groups:[],stop:'permission_denied',complete:false};
  if(cancelled())return {state:'cancelled',groups:[],stop:'cancelled',complete:false};
  if(chrome.permissions.contains&&!await chrome.permissions.contains({origins:[FACEBOOK_PERMISSION]}))throw Error('A permissão de leitura foi removida. Clique em Sincronizar novamente.');
  tab=await chrome.tabs.create({url:'https://www.facebook.com/groups/joins/',active:true});
  for(let n=0;n<40;n++){if(cancelled())return {state:'cancelled',groups:[...groups.values()],stop:'cancelled',complete:false};const current=await chrome.tabs.get(tab.id);if(current.status==='complete')break;if(n===39)throw Error('A lista de grupos não terminou de carregar. Nenhum grupo foi sincronizado.');await wait(500);}
  for(let round=0;round<maxRounds;round++){
   if(cancelled())return {state:'cancelled',groups:[...groups.values()],stop:'cancelled',complete:false};
   const result=await scan(tab.id,{scroll:round>0});
   if(result.state==='unverified'&&round<5&&groups.size===0){onProgress({count:0,round:round+1});await wait(1000);continue;}
   if(result.state!=='available')return {state:result.state,reason:result.reason,groups:[...groups.values()],stop:result.reason||'session_unverified',complete:false};
   const before=groups.size;for(const group of result.groups||[]){if(groups.size>=maxGroups)break;groups.set(group.id,group);}
   onProgress({count:groups.size,round:round+1});
   // Scroll position also needs to settle: long gaps/virtualized lists do not end
   // simply because one screen contained no new links.
   const scroll=result.scroll;const stable=scroll&&scroll.atEnd&&!result.loading&&before===groups.size&&previousScroll===scroll.top;
   settled=stable?settled+1:0;previousScroll=scroll?.top;
   if(settled>=3){complete=true;stop='loaded_end';break;}
   if(groups.size>=maxGroups){stop='limit';break;}
   await wait(1000);
  }
  if(cancelled())return {state:'cancelled',groups:[...groups.values()],stop:'cancelled',complete:false};
  const found=[...groups.values()];let imported=0;
  if(sync){for(let offset=0;offset<found.length;offset+=50){if(cancelled())return {state:'cancelled',groups:found,imported,stop:'cancelled',complete:false};await sync(found.slice(offset,offset+50));imported+=Math.min(50,found.length-offset);}}
  return {state:'available',groups:found,imported,complete,stop};
 }catch(error){return {state:'failed',groups:[...groups.values()],complete:false,stop:'error',message:error.message||'Não foi possível sincronizar. Nenhuma publicação foi enviada.'};}
 finally{
  if(tab?.id)try{await chrome.tabs.remove(tab.id);}catch{}
  if(granted&&!grantedBefore)try{await chrome.permissions.remove({origins:[FACEBOOK_PERMISSION]});}catch{}
 }
 };
 if(globalThis.navigator?.locks)return navigator.locks.request('atosfeed-group-discovery',{ifAvailable:true},async lock=>{if(lock)return execute();await permission.catch(()=>false);return {state:'busy',groups:[],complete:false,stop:'busy',message:'Há outra sincronização em andamento. Aguarde e tente novamente.'};});
 return execute();
}
