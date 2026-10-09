export function guard(doc, url) {
 const u = new URL(url); const text = doc.body?.innerText || doc.body?.textContent || '';
 if (u.hostname !== 'facebook.com' && u.hostname !== 'www.facebook.com') return 'wrong_site';
 if (/checkpoint|challenge/.test(u.pathname) || /confirme sua identidade|confirm your identity|security check|verificação de segurança/i.test(text)) return 'challenge';
 if (/temporariamente bloquead|temporarily blocked|restringimos sua conta|account restricted|you can.t post|não pode publicar/i.test(text)) return 'restricted';
 if (/login/.test(u.pathname) || doc.querySelector('input[type="password"]')) return 'session_expired';
 return null;
}
export function readGroups(doc, url) {
 return [...new Map([...doc.querySelectorAll('a[href]')].flatMap(a => {
  const u = new URL(a.getAttribute('href'), url); const m = u.pathname.match(/^\/groups\/([^/]+)\/?$/);
  const name = a.textContent?.trim();
  return u.origin === new URL(url).origin && m && !['feed','discover','joins','create'].includes(m[1]) && name ? [[m[1],{id:m[1],name,url:u.origin+'/groups/'+m[1]+'/'}]] : [];
 })).values()];
}
export function outcome(text, priorText = '') {
 const patterns = [['awaiting_approval', /aguardando aprovação|pending approval|enviad[ao] para aprovação|submitted for approval/i],['sent', /publicação publicada|post published|your post has been published/i],['failed', /não foi possível publicar|couldn.t publish|failed to post/i]];
 for (const [state, re] of patterns) if (re.test(text) && !re.test(priorText)) return state;
 return 'unknown';
}
export function canExecute(job, now, online, session) {
 return job.state === 'queued' && Date.parse(job.dueAt) <= now && online && session === 'available';
}
export function recover(job) {return job.state === 'executing' ? {...job,state:'unknown'} : job;}

export async function fingerprint(payload) {
 const canonical={groupId:payload.groupId,text:payload.text.trim(),image:payload.image?{type:payload.image.type,data:payload.image.data}:null};
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(canonical)));
 return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
