import {panelOrigin,publicPairing} from './pairing-core.js';
const KEY='atosfeedPairing',STATUS='atosfeedConnectionStatus',ALARM='atosfeed-heartbeat';
// Credentials are only available to trusted extension pages/service worker, never content scripts.
const initialize=chrome.storage.local.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});
async function pairing(){await initialize;return (await chrome.storage.local.get(KEY))[KEY]||null;}
async function connectionStatus(status){await chrome.storage.local.set({[STATUS]:status});}
async function call(credentials,path){
 return fetch(panelOrigin(credentials.origin)+path,{method:'POST',headers:{Authorization:`Bearer ${credentials.token}`,'X-AtosFeed-Extension':chrome.runtime.id},credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(8000)});
}
async function heartbeatUnlocked(){
 const credentials=await pairing();if(!credentials)return;
 if(Date.parse(credentials.expiresAt)<=Date.now()){await clear('Pareamento expirado. Conecte novamente.',credentials);return;}
 try{const response=await call(credentials,'/api/extension/heartbeat');if(response.status===401||response.status===403){await clear('Dispositivo revogado ou sem permissão. Conecte novamente.',credentials);return;}if(!response.ok){await connectionStatus('Painel indisponível. Nenhuma publicação será executada.');return;}await connectionStatus('Computador conectado ao painel. Sessão Facebook não verificada.');}catch{await connectionStatus('Sem contato com o painel. O status remoto ficará desconectado após 90 segundos.');}
}
async function heartbeat(){return navigator.locks.request('atosfeed-connection',heartbeatUnlocked);}
async function clear(message,credentials){await chrome.alarms.clear(ALARM);await chrome.storage.local.remove(KEY);await connectionStatus(message);if(credentials){const url=new URL(credentials.origin);await chrome.permissions.remove({origins:[`${url.protocol}//${url.hostname}/*`]});}}
async function disconnectUnlocked(){
 const credentials=await pairing();let confirmed=false;
 if(credentials)try{const response=await call(credentials,'/api/extension/disconnect');confirmed=response.ok||response.status===401;}catch{}
 await clear(confirmed?'Dispositivo desconectado e revogado.':'Desconectado neste navegador. Revogação remota não confirmada; revogue também no painel.',credentials);
 return {confirmed};
}
async function disconnect(){return navigator.locks.request('atosfeed-connection',disconnectUnlocked);}
chrome.action.onClicked.addListener(async tab=>{
 if(tab.id&&/^https:\/\/(www\.)?facebook\.com\//.test(tab.url||''))await chrome.tabs.create({url:chrome.runtime.getURL('runner.html')+'?tab='+tab.id});
 else await chrome.runtime.openOptionsPage();
});
chrome.alarms.onAlarm.addListener(alarm=>{if(alarm.name===ALARM)void heartbeat();});
chrome.runtime.onStartup.addListener(async()=>{if(await pairing()){await chrome.alarms.create(ALARM,{periodInMinutes:0.5});await heartbeat();}});
chrome.runtime.onInstalled.addListener(async()=>{if(await pairing())await chrome.alarms.create(ALARM,{periodInMinutes:0.5});});
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
 // Only the packaged options page controls device pairing. No external messaging.
 if(sender.id!==chrome.runtime.id||sender.url!==chrome.runtime.getURL('options.html'))return false;
 const run=async()=>{
  if(message.type==='pairing-status')return {pairing:publicPairing(await pairing()),status:(await chrome.storage.local.get(STATUS))[STATUS]||'Não pareado.'};
  if(message.type==='paired'){if(!await pairing())return {ok:false};await chrome.alarms.create(ALARM,{periodInMinutes:0.5});await heartbeat();return {ok:true};}
  if(message.type==='heartbeat'){await heartbeat();return {ok:true};}
  if(message.type==='disconnect')return disconnect();
  return {ok:false};
 };
 run().then(sendResponse).catch(()=>sendResponse({ok:false,error:'Não foi possível concluir. Tente novamente.'}));return true;
});
