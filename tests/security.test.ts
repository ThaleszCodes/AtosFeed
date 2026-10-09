import {it,expect} from 'vitest';
import {body,ApiError,newPairCode,newDeviceToken,sha256,extensionId,requireAppOrigin,uuid} from '../lib/server/security';
import {panelOrigin,permissionPattern,publicPairing} from '../extension/pairing-core.js';
it('produces high entropy codes and device credentials with one-way hashes',()=>{const first=newPairCode(),second=newPairCode();expect(first).toMatch(/^[A-F0-9]{32}$/);expect(first).not.toBe(second);expect(newDeviceToken()).toMatch(/^af_device_[A-Za-z0-9_-]{43}$/);expect(sha256(first)).toHaveLength(64);expect(sha256(first)).not.toContain(first);});
it('CORS only permits packaged extension origins',()=>{expect(extensionId(new Request('https://panel.example',{headers:{Origin:'chrome-extension://'+'a'.repeat(32)}}))).toBe('a'.repeat(32));expect(()=>extensionId(new Request('https://panel.example',{headers:{Origin:'https://evil.example'}}))).toThrow(ApiError);});
it('rejects cross-origin user mutations and malformed identifiers',()=>{expect(()=>requireAppOrigin(new Request('https://panel.example/api',{headers:{Origin:'https://evil.example'}}))).toThrow();expect(()=>uuid('not-a-uuid')).toThrow();});
it('rejects oversized, invalid or non-object JSON without forwarding it',async()=>{for(const value of ['[]','null','invalid','"'+ 'x'.repeat(9000)+'"'])await expect(body(new Request('https://panel.example',{method:'POST',headers:{'Content-Type':'application/json'},body:value}))).rejects.toThrow();});
it('panel permissions are limited to the selected origin and redact device secrets',()=>{expect(panelOrigin('https://my-panel.vercel.app')).toBe('https://my-panel.vercel.app');expect(permissionPattern('https://my-panel.vercel.app')).toBe('https://my-panel.vercel.app/*');expect(panelOrigin('http://localhost:3000')).toBe('http://localhost:3000');for(const u of ['http://remote.example','https://user:password@example.com','https://facebook.com','https://panel.example/path'])expect(()=>panelOrigin(u)).toThrow();expect(publicPairing({origin:'https://panel.example',token:'secret',deviceId:'id',organizationId:'org',expiresAt:'2030-01-01'})).not.toHaveProperty('token');});

import {isPublishableKey,isSupabaseUrl} from '../lib/public-config';
it('does not use private keys in the public auth client',()=>{
 const jwt=(role:string)=>'header.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.signature';
 expect(isPublishableKey('sb_publishable_local_fixture')).toBe(true);expect(isPublishableKey(jwt('anon'))).toBe(true);
 expect(isPublishableKey(jwt('service_role'))).toBe(false);expect(isPublishableKey('sb_secret_example')).toBe(false);expect(isPublishableKey('replace_with_publishable_key')).toBe(false);
});

it('requires TLS for auth outside local development',()=>{expect(isSupabaseUrl('https://mpxbbembbzxtwekwwrvw.supabase.co')).toBe(true);expect(isSupabaseUrl('http://127.0.0.1:54329')).toBe(true);expect(isSupabaseUrl('http://remote.example')).toBe(false);expect(isSupabaseUrl('https://user:pass@host.example')).toBe(false);});

it('an explicit extension ID supports trusted requests without Origin but does not override a conflicting origin',()=>{
 const id='a'.repeat(32);expect(extensionId(new Request('https://panel.example',{headers:{'X-AtosFeed-Extension':id}}))).toBe(id);
 expect(()=>extensionId(new Request('https://panel.example',{headers:{Origin:'https://evil.test','X-AtosFeed-Extension':id}}))).toThrow();
 expect(()=>extensionId(new Request('https://panel.example',{headers:{Origin:'chrome-extension://'+'b'.repeat(32),'X-AtosFeed-Extension':id}}))).toThrow();
});
