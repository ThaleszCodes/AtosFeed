import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import {handle} from '../lib/server/api';
import {startFixture} from './support/supabase-fixture.mjs';
let fixture:Awaited<ReturnType<typeof startFixture>>,owner:string,other:string,org:string;
const origin='chrome-extension://'+'a'.repeat(32);
function req(path:string,method='GET',token?:string,data?:object,requestOrigin?:string){return new Request('http://panel.test/api/'+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(data?{'Content-Type':'application/json'}:{}),...(requestOrigin?{Origin:requestOrigin}:{})},...(data?{body:JSON.stringify(data)}:{})});}
beforeAll(async()=>{
 fixture=await startFixture(54328);vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','http://127.0.0.1:54328');vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','sb_publishable_local_fixture');
 const login=async(email:string)=>{const r=await fetch('http://127.0.0.1:54328/auth/v1/token?grant_type=password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:'fixture-only-password-123'})});return (await r.json()).access_token;};
 owner=await login('owner@example.test');other=await login('other@example.test');
 const created=await handle(req('organizations','POST',owner,{name:'API Test'}),'organizations');org=(await created.json()).organization.id;
},20000);
afterAll(async()=>{vi.unstubAllEnvs();await fixture?.close();});
it('verifies sessions upstream instead of trusting JWT contents or client IDs',async()=>{expect((await handle(req('organizations'),'organizations')).status).toBe(401);expect((await handle(req('organizations','GET','forged-jwt'),'organizations')).status).toBe(401);const response=await handle(req('organizations','GET',owner),'organizations');expect(response.status).toBe(200);expect(response.headers.get('cache-control')).toBe('no-store');});
it('rejects unauthorized organizations via the SQL permission boundary',async()=>{const response=await handle(req('devices?organizationId='+org,'GET',other),'devices');expect(response.status).toBe(403);});
it('pairing, device heartbeat and revoke traverse HTTP client and PostgreSQL',async()=>{
 const pairResponse=await handle(req('pairing','POST',owner,{organizationId:org}),'pairing');expect(pairResponse.status).toBe(201);const code=(await pairResponse.json()).code;
 const redeem=await handle(req('extension/pair','POST',undefined,{code,name:'API Device'},origin),'pair');expect(redeem.status).toBe(200);const device=await redeem.json();
 const beat=await handle(req('extension/heartbeat','POST',device.token,undefined,origin),'heartbeat');expect(beat.status).toBe(200);
 const withoutOrigin=new Request('http://panel.test/api/extension/heartbeat',{method:'POST',headers:{Authorization:'Bearer '+device.token,'X-AtosFeed-Extension':'a'.repeat(32)}});expect((await handle(withoutOrigin,'heartbeat')).status).toBe(200);
 expect((await handle(req('organizations','GET',device.token),'organizations')).status).toBe(401);
 const list=await handle(req('devices?organizationId='+org,'GET',owner),'devices');const devices=(await list.json()).devices;expect(devices[0].connected).toBe(true);expect(JSON.stringify(devices)).not.toContain(device.token);expect(JSON.stringify(devices)).not.toContain('token_hash');
 expect((await handle(req('extension/pair','POST',undefined,{code,name:'Again'},origin),'pair')).status).toBe(410);
 expect((await handle(req('devices','DELETE',other,{organizationId:org,deviceId:device.deviceId}),'devices')).status).toBe(403);
 expect((await handle(req('devices','DELETE',owner,{organizationId:org,deviceId:device.deviceId}),'devices')).status).toBe(200);
 expect((await handle(req('extension/heartbeat','POST',device.token,undefined,origin),'heartbeat')).status).toBe(401);
});
it('does not disclose privileged errors or reflect malicious origins',async()=>{
 const response=await handle(req('extension/pair','POST',undefined,{code:'A'.repeat(32),name:'Attack'},'https://evil.test'),'pair');expect(response.status).toBe(403);expect(response.headers.get('access-control-allow-origin')).toBeNull();
 const missing=await handle(req('pairing','POST',owner,{organizationId:'not-a-uuid'}),'pairing');expect(missing.status).toBe(400);
});
