import {panelOrigin,permissionPattern,pairingValid} from './pairing-core.js';
const $=id=>document.getElementById(id);let busy=false;
await chrome.storage.local.setAccessLevel({accessLevel:'TRUSTED_CONTEXTS'});
async function status(){const result=await chrome.runtime.sendMessage({type:'pairing-status'});$('status').textContent=result.status||result.error||'Status indisponível.';const paired=!!result.pairing;$('connected').hidden=!paired;$('pair-form').hidden=paired;if(paired){$('organization').textContent='Organização: '+result.pairing.organizationId;$('panel').textContent='Painel: '+result.pairing.origin;}}
const grantedOrigins=(await chrome.permissions.getAll()).origins||[];
await status();
$('pair-form').onsubmit=async event=>{
 event.preventDefault();if(busy)return;
 let origin,pattern,grantedBefore=false;
 try{
  origin=panelOrigin($('origin').value);pattern=permissionPattern(origin);const code=$('code').value.trim().toUpperCase(),name=$('name').value.trim();
  if(!/^[0-9A-F]{32}$/.test(code)||!name){$('status').textContent='Confira o código de 32 caracteres e o nome do computador.';return;}
  busy=true;$('fields').disabled=true;
  // Request on the user gesture, not on startup or a remote command.
  grantedBefore=grantedOrigins.includes(pattern);
  const permission=chrome.permissions.request({origins:[pattern]});
  if(!await permission){$('status').textContent='Acesso ao domínio não autorizado. Nada foi conectado.';return;}
  await navigator.locks.request('atosfeed-connection',async()=>{
  const current=await chrome.runtime.sendMessage({type:'pairing-status'});if(current.pairing)throw Error('Desconecte o computador atual antes de parear outro painel.');
  const response=await fetch(origin+'/api/extension/pair',{method:'POST',headers:{'Content-Type':'application/json','X-AtosFeed-Extension':chrome.runtime.id},credentials:'omit',cache:'no-store',body:JSON.stringify({code,name}),signal:AbortSignal.timeout(10000)});
  const result=await response.json();if(!response.ok)throw Error(result.message||'Pareamento recusado. Gere outro código no painel.');
  if(!pairingValid(result))throw Error('Resposta de pareamento inválida. Revogue o dispositivo no painel.');
  await chrome.storage.local.set({atosfeedPairing:{...result,origin}});$('code').value='';
  });
  await chrome.runtime.sendMessage({type:'paired'});await status();
 }catch(error){$('status').textContent=error instanceof Error&&error.name!=='TypeError'&&error.name!=='TimeoutError'?error.message:'Conexão indisponível. Confira os dispositivos no painel antes de gerar outro código.';if(pattern&&!grantedBefore&&!(await chrome.storage.local.get('atosfeedPairing')).atosfeedPairing)await chrome.permissions.remove({origins:[pattern]});}
 finally{busy=false;$('fields').disabled=false;}
};
$('refresh').onclick=async()=>{await chrome.runtime.sendMessage({type:'heartbeat'});await status();};
$('disconnect').onclick=async()=>{if(busy)return;busy=true;$('disconnect').disabled=true;try{await chrome.runtime.sendMessage({type:'disconnect'});await status();}finally{busy=false;$('disconnect').disabled=false;}};
