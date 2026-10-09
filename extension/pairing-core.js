export function panelOrigin(value){
 const url=new URL(value);
 const local=['localhost','127.0.0.1'].includes(url.hostname);
 if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||(!local&&url.protocol!=='https:')||(local&&!['http:','https:'].includes(url.protocol)))throw Error('Informe somente a origem HTTPS do painel, ou localhost para desenvolvimento.');
 if(url.hostname==='facebook.com'||url.hostname.endsWith('.facebook.com'))throw Error('Informe o painel AtosFeed, não o Facebook.');
 return url.origin;
}
export function permissionPattern(origin){const u=new URL(origin);return `${u.protocol}//${u.hostname}/*`;}
export function publicPairing(pairing){return pairing?{origin:pairing.origin,deviceId:pairing.deviceId,organizationId:pairing.organizationId,expiresAt:pairing.expiresAt}:null;}
export function pairingValid(data){return data&&/^af_device_[A-Za-z0-9_-]{43}$/.test(data.token)&&typeof data.deviceId==='string'&&typeof data.organizationId==='string'&&Number.isFinite(Date.parse(data.expiresAt));}
