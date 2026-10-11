import {panelOrigin,pairingValid} from './pairing-core.js';
export async function panelCall(path,input){
 const credentials=(await chrome.storage.local.get('atosfeedPairing')).atosfeedPairing;
 if(!pairingValid(credentials)||Date.parse(credentials.expiresAt)<=Date.now())throw Error('Pareie a extensão nas opções antes de sincronizar com o painel.');
 const response=await fetch(panelOrigin(credentials.origin)+path,{method:'POST',headers:{Authorization:`Bearer ${credentials.token}`,'X-AtosFeed-Extension':chrome.runtime.id,'Content-Type':'application/json'},body:JSON.stringify(input||{}),credentials:'omit',cache:'no-store',signal:AbortSignal.timeout(8000)});
 const data=await response.json();if(!response.ok)throw Error(data.message||'Não foi possível concluir. Atualize a fila e confira o painel.');return data;
}
