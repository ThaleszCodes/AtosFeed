import {discoverGroups,FACEBOOK_PERMISSION} from './discovery.js';
import {panelCall} from './panel-client.js';
import {recover,fingerprint as contentFingerprint} from './core.js';
const $=id=>document.getElementById(id);const tabId=Number(new URL(location.href).searchParams.get('tab'));
const messages={available:'Sessão observável no navegador. A identidade e as permissões do grupo precisam ser conferidas.',unverified:'Sessão não confirmada. Abra seu perfil e a lista de grupos no Facebook.',prepared:'Conteúdo preparado. Confira texto e imagem no Facebook e autorize o envio.',sent:'Publicação enviada: confirmação observada no Facebook.',awaiting_approval:'Publicação aguardando aprovação: confirmação observada no Facebook.',unknown:'Resultado desconhecido. Confira o grupo; não repita o envio.',failed:'Não foi possível concluir. O formulário foi preservado.',interrupted:'Operação interrompida.'};
const reasons={session_expired:'Entre novamente pelo próprio Facebook.',challenge:'Resolva a verificação no Facebook. O AtosFeed não continuará.',restricted:'O Facebook informou uma restrição. Não faça novas tentativas.',wrong_directory:'Abra a lista de grupos do Facebook; a leitura foi interrompida.',wrong_group:'Abra na aba original o grupo selecionado.',wrong_site:'Abra uma página do Facebook.',existing_dialog:'Feche o diálogo existente antes de preparar.',composer_not_found:'Editor não reconhecido. Esta interface precisa ser validada.',ambiguous_composer:'Há mais de um editor. Feche os diálogos e confira o grupo.',textbox_not_found:'Campo de texto não reconhecido.',image_input_not_found:'Campo de imagem não reconhecido; nada foi enviado.',image_not_confirmed:'A imagem ainda não foi confirmada no editor. Confira o anexo.',content_changed:'O texto no Facebook difere do autorizado. Prepare novamente.',submit_not_found:'Botão Publicar não reconhecido ou indisponível.',no_reliable_confirmation:'Nenhuma confirmação confiável foi observada.'};
const describe=r=>[messages[r.state]||r.state,reasons[r.reason]||''].filter(Boolean).join(' ');
let cancelDiscovery=false;const permissions=(await chrome.permissions.getAll()).origins||[];
let prepared=null,busy=false,visibleGroups=[],remoteJobs=[],selectedJob=null;
const paired=(await chrome.storage.local.get('atosfeedPairing')).atosfeedPairing;
$('panel-status').textContent=paired?`Painel: ${paired.origin}. Abra as opções para verificar o pareamento.`:'Não pareado. O teste local continua disponível; conecte nas opções para usar a fila.';
async function flushReports(){return navigator.locks.request('atosfeed-reports',async()=>{let reports=(await chrome.storage.local.get('atosfeedReportOutbox')).atosfeedReportOutbox||[];for(const report of [...reports]){try{await panelCall('/api/extension/report',report);reports=reports.filter(r=>r.attemptId!==report.attemptId);await chrome.storage.local.set({atosfeedReportOutbox:reports});}catch{$('remote-status').textContent='Resultado preservado localmente, ainda não confirmado pelo painel. Não repita o envio.';return false;}}return true;});}
$('load-jobs').onclick=()=>task(async()=>{const reported=await flushReports();const data=await panelCall('/api/extension/jobs');remoteJobs=data.jobs;$('remote-job').replaceChildren(new Option('Selecione uma publicação',''),...remoteJobs.map(j=>new Option(`Grupo ${j.groupId}: ${j.text.slice(0,60)}`,j.id)));$('remote-status').textContent=!reported?'Há um resultado pendente de sincronização. Não repita o envio.':remoteJobs.length?'Selecione uma tarefa e abra o grupo na aba original.':'Nenhuma tarefa disponível agora. Agendamentos futuros permanecem no painel.';});
$('sync-groups').onclick=()=>task(async()=>{const data=await panelCall('/api/extension/groups',{groups:visibleGroups.slice(0,50)});$('remote-status').textContent=`${data.imported} grupos visíveis importados. Não comprova permissão para publicar. Atualize os grupos no painel.`;});
$('use-job').onclick=()=>{if(busy)return;const job=remoteJobs.find(j=>j.id===$('remote-job').value);if(!job)return;selectedJob=job;$('text').readOnly=true;$('group').disabled=true;$('text').value=job.text;$('group').replaceChildren(new Option(`Grupo ${job.groupId}`,job.groupId));prepared=null;$('authorize').checked=false;$('submit').disabled=true;$('remote-status').textContent='Texto da tarefa carregado. Abra esse grupo na aba original, selecione uma imagem se desejar e prepare para revisar.';};
const key='atosfeedAttempts';
let attempts=[];await navigator.locks.request('atosfeed-submit',async()=>{attempts=((await chrome.storage.local.get(key))[key]||[]).map(recover);await persist();});
async function persist(){await chrome.storage.local.set({[key]:attempts});$('history').textContent=attempts.map(a=>`${a.groupId}: ${a.state} (${a.id})`).join('\n') || 'Sem tentativas.';}
async function run(action,payload={},targetTabId=tabId) {
 await chrome.scripting.executeScript({target:{tabId:targetTabId},files:['adapter.js']});
 const result=await chrome.scripting.executeScript({target:{tabId:targetTabId},func:async(a,p)=>atosAdapter(a,p),args:[action,payload]});
 return result[0]?.result || {state:'unknown'};
}
async function task(fn){if(busy)return;busy=true;try{await fn();}catch(e){ $('status').textContent=e.message||'Interrompido: acesso à aba indisponível. Nenhuma nova tentativa automática.';prepared=null;$('submit').disabled=true;}finally{busy=false;}}
$('clear-job').onclick=()=>{if(busy)return;selectedJob=null;prepared=null;$('text').readOnly=false;$('group').disabled=false;$('authorize').checked=false;$('submit').disabled=true;$('remote-status').textContent='Modo local: não altera uma tarefa do painel.';};
$('inspect').onclick=()=>task(async()=>{const r=await run('inspect');$('session').textContent=describe(r);visibleGroups=r.groups||[];$('sync-groups').disabled=r.state!=='available'||!visibleGroups.length;selectedJob=null;$('text').readOnly=false;$('group').disabled=false;prepared=null;$('submit').disabled=true;$('group').replaceChildren(new Option('Selecione um grupo',''),...(r.groups||[]).map(g=>new Option(g.name,g.id)));});
for(const id of ['text','group','image'])$(id).onchange=()=>{if(id!=='image'&&!busy)selectedJob=null;prepared=null;$('authorize').checked=false;$('submit').disabled=true;};
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
 const job=selectedJob;const attempt={id:crypto.randomUUID(),groupId:payload.groupId,fingerprint,state:'executing',jobId:job?.id};attempts.push(attempt);await persist();prepared=null;$('submit').disabled=true;
 if(job){try{await panelCall('/api/extension/claim',{jobId:job.id,attemptId:attempt.id});}catch(e){attempt.state='unknown';await persist();$('status').textContent=e.message+' Nada foi enviado ao Facebook. Reserva incerta: confira o painel; não repita.';return;}}
 try{const r=await run('submit',payload);attempt.state=r.state==='interrupted'?'failed':['sent','awaiting_approval','failed','unknown'].includes(r.state)?r.state:'unknown';$('status').textContent=describe({...r,state:attempt.state});}catch{attempt.state='unknown';$('status').textContent='Resultado desconhecido. Confira o grupo antes de qualquer ação.';}await persist();
 if(job){await navigator.locks.request('atosfeed-reports',async()=>{const reports=(await chrome.storage.local.get('atosfeedReportOutbox')).atosfeedReportOutbox||[];reports.push({jobId:job.id,attemptId:attempt.id,state:attempt.state});await chrome.storage.local.set({atosfeedReportOutbox:reports});});await flushReports();selectedJob=null;}
}));

$('cancel-discovery').onclick=()=>{cancelDiscovery=true;$('discovery-status').textContent='Interrompendo leitura. Nenhuma publicação será enviada.';};
$('discover').onclick=()=>{
 if(busy)return;busy=true;cancelDiscovery=false;prepared=null;$('submit').disabled=true;$('discover').disabled=true;$('cancel-discovery').disabled=false;
 // discoverGroups requests the optional Facebook host on this same user gesture.
 void discoverGroups({chrome,grantedBefore:permissions.includes(FACEBOOK_PERMISSION)||permissions.includes('https://*/*'),cancelled:()=>cancelDiscovery,scan:(id,payload)=>run('discover-step',payload,id),sync:paired?groups=>panelCall('/api/extension/groups',{groups}):null,onProgress:({count})=>{$('discovery-status').textContent=`${count} grupos encontrados. Percorrendo a lista carregada…`;}}).then(result=>{
  visibleGroups=result.groups;selectedJob=null;$('text').readOnly=false;$('group').disabled=false;$('group').replaceChildren(new Option('Selecione um grupo',''),...visibleGroups.map(g=>new Option(g.name,g.id)));$('sync-groups').disabled=result.state!=='available'||!visibleGroups.length;
  const summary=result.state==='available'?`${visibleGroups.length} grupos encontrados${paired?` e ${result.imported} sincronizados com o painel`:'. Pareie para sincronizar com o painel'}. ${result.complete?'Fim da lista carregada observado; isso não comprova que o Facebook mostrou todos os grupos.':'Leitura parcial: limite de tempo ou quantidade atingido.'}`:result.state==='cancelled'?'Sincronização interrompida por você.':result.state==='denied'?'Acesso de leitura não autorizado.':result.message||describe(result);
  $('discovery-status').textContent=summary;
 }).catch(()=>{$('discovery-status').textContent='Não foi possível ler os grupos. Nenhuma publicação enviada.';}).finally(()=>{busy=false;$('discover').disabled=false;$('cancel-discovery').disabled=true;});
};
if(new URL(location.href).searchParams.get('autodetect')==='1')$('inspect').click();
