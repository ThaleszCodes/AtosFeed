import {recover,fingerprint as contentFingerprint} from './core.js';
const $=id=>document.getElementById(id);const tabId=Number(new URL(location.href).searchParams.get('tab'));
const messages={available:'Sessão observável no navegador. A identidade e as permissões do grupo precisam ser conferidas.',unverified:'Sessão não confirmada. Abra seu perfil e a lista de grupos no Facebook.',prepared:'Conteúdo preparado. Confira texto e imagem no Facebook e autorize o envio.',sent:'Publicação enviada: confirmação observada no Facebook.',awaiting_approval:'Publicação aguardando aprovação: confirmação observada no Facebook.',unknown:'Resultado desconhecido. Confira o grupo; não repita o envio.',failed:'Não foi possível concluir. O formulário foi preservado.',interrupted:'Operação interrompida.'};
const reasons={session_expired:'Entre novamente pelo próprio Facebook.',challenge:'Resolva a verificação no Facebook. O AtosFeed não continuará.',restricted:'O Facebook informou uma restrição. Não faça novas tentativas.',wrong_group:'Abra na aba original o grupo selecionado.',wrong_site:'Abra uma página do Facebook.',existing_dialog:'Feche o diálogo existente antes de preparar.',composer_not_found:'Editor não reconhecido. Esta interface precisa ser validada.',ambiguous_composer:'Há mais de um editor. Feche os diálogos e confira o grupo.',textbox_not_found:'Campo de texto não reconhecido.',image_input_not_found:'Campo de imagem não reconhecido; nada foi enviado.',image_not_confirmed:'A imagem ainda não foi confirmada no editor. Confira o anexo.',content_changed:'O texto no Facebook difere do autorizado. Prepare novamente.',submit_not_found:'Botão Publicar não reconhecido ou indisponível.',no_reliable_confirmation:'Nenhuma confirmação confiável foi observada.'};
const describe=r=>[messages[r.state]||r.state,reasons[r.reason]||''].filter(Boolean).join(' ');
let prepared=null,busy=false;const key='atosfeedAttempts';
let attempts=[];await navigator.locks.request('atosfeed-submit',async()=>{attempts=((await chrome.storage.local.get(key))[key]||[]).map(recover);await persist();});
async function persist(){await chrome.storage.local.set({[key]:attempts});$('history').textContent=attempts.map(a=>`${a.groupId}: ${a.state} (${a.id})`).join('\n') || 'Sem tentativas.';}
async function run(action,payload={}) {
 await chrome.scripting.executeScript({target:{tabId},files:['adapter.js']});
 const result=await chrome.scripting.executeScript({target:{tabId},func:async(a,p)=>atosAdapter(a,p),args:[action,payload]});
 return result[0]?.result || {state:'unknown'};
}
async function task(fn){if(busy)return;busy=true;try{await fn();}catch{ $('status').textContent='Interrompido: acesso à aba indisponível. Nenhuma nova tentativa automática.';prepared=null;$('submit').disabled=true;}finally{busy=false;}}
$('inspect').onclick=()=>task(async()=>{const r=await run('inspect');$('session').textContent=describe(r);prepared=null;$('submit').disabled=true;$('group').replaceChildren(new Option('Selecione um grupo',''),...(r.groups||[]).map(g=>new Option(g.name,g.id)));});
for(const id of ['text','group','image'])$(id).onchange=()=>{prepared=null;$('authorize').checked=false;$('submit').disabled=true;};
$('authorize').onchange=()=>{$('submit').disabled=!prepared || !$('authorize').checked;};
$('prepare').onclick=()=>task(async()=>{
 const text=$('text').value.trim(),groupId=$('group').value,file=$('image').files[0];if(!text||!groupId){$('status').textContent='Informe o texto e selecione um grupo. Seus campos foram preservados.';return;}
 let image=null;if(file){if(file.size>5*1024*1024||!['image/png','image/jpeg','image/webp'].includes(file.type)){$('status').textContent='Selecione PNG, JPEG ou WebP de até 5 MB.';return;}const buffer=new Uint8Array(await file.arrayBuffer());let binary='';for(const b of buffer)binary+=String.fromCharCode(b);image={name:file.name,type:file.type,data:btoa(binary)};}
 const payload={text,groupId,image};const r=await run('prepare',payload);prepared=r.state==='prepared'?payload:null;$('authorize').checked=false;$('submit').disabled=true;$('status').textContent=describe(r);
});
$('submit').onclick=()=>task(()=>navigator.locks.request('atosfeed-submit',async()=>{
 attempts=((await chrome.storage.local.get(key))[key]||[]).map(recover);
 if(!prepared || !$('authorize').checked)return;
 const payload=prepared;const fingerprint=await contentFingerprint(payload);
 if(attempts.some(a=>a.fingerprint===fingerprint)){ $('status').textContent='Conteúdo já tentado neste grupo. Verifique o Facebook; este laboratório não repete envios.';return;}
 const attempt={id:crypto.randomUUID(),groupId:payload.groupId,fingerprint,state:'executing'};attempts.push(attempt);await persist();prepared=null;$('submit').disabled=true;
 try{const r=await run('submit',payload);attempt.state=r.state==='interrupted'?'failed':r.state;$('status').textContent=describe({...r,state:attempt.state});}catch{attempt.state='unknown';$('status').textContent='Resultado desconhecido. Confira o grupo antes de qualquer ação.';}await persist();
}));
