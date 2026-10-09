/** Local test double for GoTrue + PostgREST HTTP. SQL runs on real PostgreSQL (PGlite).
 * This is not a Supabase instance and never contacts Facebook or the remote project.
 */
import {createServer} from 'node:http';
import {createHmac,randomBytes,randomUUID,createHash,timingSafeEqual} from 'node:crypto';
import {database,rpc,USER_A,USER_B,USER_C} from './database.mjs';
export async function startFixture(port=54329){
 const db=await database(),key=randomBytes(32),users=new Map(),refreshes=new Map(),codes=new Map(),inbox=new Map();
 const seed=(id,email)=>users.set(email,{id,email,password:'fixture-only-password-123',created_at:new Date().toISOString(),aud:'authenticated',role:'authenticated',email_confirmed_at:new Date().toISOString(),app_metadata:{provider:'email',providers:['email']},user_metadata:{},identities:[]});
 seed(USER_A,'owner@example.test');seed(USER_B,'other@example.test');seed(USER_C,'viewer@example.test');
 const publicUser=user=>{const {password,...rest}=user;return rest;};
 const sign=user=>{const encode=v=>Buffer.from(JSON.stringify(v)).toString('base64url');const head=encode({alg:'HS256',typ:'JWT'}),body=encode({sub:user.id,aud:'authenticated',role:'authenticated',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600,session_id:randomUUID()});const sig=createHmac('sha256',key).update(head+'.'+body).digest('base64url');return head+'.'+body+'.'+sig;};
 const verify=token=>{try{const [h,p,s]=token.split('.');const expected=createHmac('sha256',key).update(h+'.'+p).digest('base64url');if(!s||s.length!==expected.length||!timingSafeEqual(Buffer.from(s),Buffer.from(expected)))return null;const claims=JSON.parse(Buffer.from(p,'base64url'));if(claims.exp<=Date.now()/1000)return null;return [...users.values()].find(u=>u.id===claims.sub)||null;}catch{return null;}};
 const session=user=>{const refresh_token=randomBytes(24).toString('base64url');refreshes.set(refresh_token,user.email);return {access_token:sign(user),token_type:'bearer',expires_in:3600,expires_at:Math.floor(Date.now()/1000)+3600,refresh_token,user:publicUser(user)};};
 const server=createServer(async(req,res)=>{
  res.setHeader('Access-Control-Allow-Origin',req.headers.origin||'*');res.setHeader('Access-Control-Allow-Headers','authorization,apikey,content-type,x-client-info,x-supabase-api-version');res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,OPTIONS');res.setHeader('Content-Type','application/json');
  const send=(status,data)=>{res.writeHead(status);res.end(JSON.stringify(data));};
  if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
  const url=new URL(req.url,'http://127.0.0.1:'+port),token=req.headers.authorization?.replace(/^Bearer /,''),user=verify(token||'');let body={};
  try{
   if(['POST','PUT'].includes(req.method)){let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>16384)throw Error('large');}body=raw?JSON.parse(raw):{};}
   if(url.pathname==='/auth/v1/signup'){
    if(users.has(body.email))return send(422,{code:'user_already_exists',msg:'User already exists'});
    const created={id:randomUUID(),email:body.email,password:body.password,created_at:new Date().toISOString(),aud:'authenticated',role:'authenticated',email_confirmed_at:new Date().toISOString(),app_metadata:{provider:'email',providers:['email']},user_metadata:{},identities:[]};
    users.set(body.email,created);await db.query('insert into auth.users values($1)',[created.id]);return send(200,session(created));
   }
   if(url.pathname==='/auth/v1/token'){
    const grant=url.searchParams.get('grant_type');
    if(grant==='password'){const u=users.get(body.email);return u&&u.password===body.password?send(200,session(u)):send(400,{code:'invalid_credentials',msg:'Invalid credentials'});}
    if(grant==='refresh_token'){const u=users.get(refreshes.get(body.refresh_token));return u?send(200,session(u)):send(401,{msg:'Invalid refresh token'});}
    if(grant==='pkce'){const code=codes.get(body.auth_code),challenge=createHash('sha256').update(body.code_verifier||'').digest('base64url');if(!code||code.challenge!==challenge)return send(400,{code:'bad_code_verifier',msg:'Invalid code verifier'});codes.delete(body.auth_code);return send(200,{...session(users.get(code.email)),redirect_type:'recovery'});}
   }
   if(url.pathname==='/auth/v1/recover'){if(users.has(body.email)){const code=randomBytes(16).toString('hex'),redirect=url.searchParams.get('redirect_to');codes.set(code,{email:body.email,challenge:body.code_challenge});inbox.set(body.email,redirect+'?code='+code);}return send(200,{});}
   if(url.pathname==='/__test/inbox')return send(200,{link:inbox.get(url.searchParams.get('email'))||null});
   if(url.pathname==='/auth/v1/user'){
    if(!user)return send(401,{code:'bad_jwt',msg:'Invalid JWT'});
    if(req.method==='PUT'){if(body.password)user.password=body.password;return send(200,publicUser(user));}
    return send(200,publicUser(user));
   }
   if(url.pathname==='/auth/v1/logout')return send(200,{});
   if(url.pathname.startsWith('/rest/v1/rpc/')){
    const anon=token==='sb_publishable_local_fixture';if(!user&&!anon)return send(401,{code:'42501',message:'unauthorized'});
    try{return send(200,await rpc(db,url.pathname.split('/').pop(),body,user?.id||null));}catch(error){return send(error.code==='42501'?403:400,{code:error.code||'P0001',message:error.message});}
   }
   send(404,{message:'Fixture endpoint unavailable'});
  }catch{send(500,{message:'Local test fixture failure'});}
 });
 await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));return {server,db,close:async()=>{await new Promise(resolve=>server.close(resolve));await db.close();}};
}
