// Executado somente após gesto do usuário via activeTab. Sem coleta de cookies.
async function atosAdapter(action, payload) {
function guard(doc, url) {
 const u = new URL(url); const text = doc.body?.innerText || doc.body?.textContent || '';
 if (u.hostname !== 'facebook.com' && u.hostname !== 'www.facebook.com') return 'wrong_site';
 if (/checkpoint|challenge/.test(u.pathname) || /confirme sua identidade|confirm your identity|security check|verificação de segurança/i.test(text)) return 'challenge';
 if (/temporariamente bloquead|temporarily blocked|restringimos sua conta|account restricted|you can.t post|não pode publicar/i.test(text)) return 'restricted';
 if (/login/.test(u.pathname) || doc.querySelector('input[type="password"]')) return 'session_expired';
 return null;
}
function readGroups(doc, url) {
 return [...new Map([...doc.querySelectorAll('a[href]')].flatMap(a => {
  const u = new URL(a.getAttribute('href'), url); const m = u.pathname.match(/^\/groups\/([^/]+)\/?$/);
  const name = a.textContent?.trim();
  return u.origin === new URL(url).origin && m && !['feed','discover','joins','create'].includes(m[1]) && name ? [[m[1],{id:m[1],name,url:u.origin+'/groups/'+m[1]+'/'}]] : [];
 })).values()];
}
function outcome(text, priorText = '') {
 const patterns = [['awaiting_approval', /aguardando aprovação|pending approval|enviad[ao] para aprovação|submitted for approval/i],['sent', /publicação publicada|post published|your post has been published/i],['failed', /não foi possível publicar|couldn.t publish|failed to post/i]];
 for (const [state, re] of patterns) if (re.test(text) && !re.test(priorText)) return state;
 return 'unknown';
}
function canExecute(job, now, online, session) {
 return job.state === 'queued' && Date.parse(job.dueAt) <= now && online && session === 'available';
}
function recover(job) {return job.state === 'executing' ? {...job,state:'unknown'} : job;}

 const interruption = guard(document, location.href);
 if (interruption) return {state:'interrupted',reason:interruption};
 const dialogs = () => [...document.querySelectorAll('[role="dialog"]')];
 if(action === 'inspect') {
  const account = document.querySelector('[aria-label="Seu perfil"], [aria-label="Your profile"]');
  return {state:account?'available':'unverified',account:account?.getAttribute('aria-label') || null,groups:readGroups(document,location.href)};
 }
 if(!/^\/groups\/[^/]+\/?$/.test(location.pathname) || location.pathname.split('/')[2] !== payload.groupId) return {state:'failed',reason:'wrong_group'};
 if(action === 'prepare') {
  if(dialogs().length) return {state:'failed',reason:'existing_dialog'};
  const openers=[...document.querySelectorAll('[role="button"]')].filter(e=>/^(Escreva algo|Write something|Criar publicação|Create post)/i.test(e.textContent.trim()));
  if(openers.length!==1) return {state:'failed',reason:'composer_not_found'};
  openers[0].click(); await new Promise(r=>setTimeout(r,700));
  const ds=dialogs(); if(ds.length!==1) return {state:'failed',reason:'ambiguous_composer'};
  const fields=ds[0].querySelectorAll('[contenteditable="true"][role="textbox"]');
  if(fields.length!==1) return {state:'failed',reason:'textbox_not_found'};
  fields[0].focus(); document.execCommand('insertText',false,payload.text);
  if(payload.image) {
   const input=ds[0].querySelector('input[type="file"][accept*="image"]');
   if(!input) return {state:'failed',reason:'image_input_not_found'};
   const bytes=Uint8Array.from(atob(payload.image.data),c=>c.charCodeAt(0));
   const dt=new DataTransfer();dt.items.add(new File([bytes],payload.image.name,{type:payload.image.type}));input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  }
  return {state:'prepared'};
 }
 if(action === 'submit') {
  const ds=dialogs();if(ds.length!==1) return {state:'failed',reason:'composer_not_found'};
  const field=ds[0].querySelector('[contenteditable="true"][role="textbox"]');
  if(field?.textContent?.trim()!==payload.text.trim()) return {state:'failed',reason:'content_changed'};
  if(payload.image && !ds[0].querySelector('img[src^="blob:"], img[src^="data:"]')) return {state:'failed',reason:'image_not_confirmed'};
  const buttons=[...ds[0].querySelectorAll('[role="button"],button')].filter(e=>/^(Publicar|Post)$/.test(e.textContent.trim()) && e.getAttribute('aria-disabled')!=='true' && !e.disabled);
  if(buttons.length!==1)return {state:'failed',reason:'submit_not_found'};
  const before=document.body.innerText; buttons[0].click();
  for(let n=0;n<15;n++) {await new Promise(r=>setTimeout(r,1000));const stop=guard(document,location.href);if(stop)return {state:'unknown',reason:stop};const state=outcome(document.body.innerText,before);if(state!=='unknown')return {state};}
  return {state:'unknown',reason:'no_reliable_confirmation'};
 }
 return {state:'failed',reason:'unsupported_action'};
}
