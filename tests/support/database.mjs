import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
export const USER_A='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',USER_B='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',USER_C='cccccccc-cccc-4ccc-8ccc-cccccccccccc';
export async function database(){
 const db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);
 for(const id of [USER_A,USER_B,USER_C])await db.query('insert into auth.users values($1)',[id]);
 for(const f of ['202610080001_atosfeed.sql','202610080002_auth_pairing.sql','202610110003_shared_queue.sql'])await db.exec(await readFile(new URL('../../supabase/migrations/'+f,import.meta.url),'utf8'));
 return db;
}
/** @template T @param {import('@electric-sql/pglite').PGlite} db @param {string|null} userId @param {(tx:import('@electric-sql/pglite').Transaction)=>Promise<T>} fn */
export async function asRole(db,userId,fn){return db.transaction(async tx=>{await tx.exec(`set local role ${userId?'authenticated':'anon'}`);await tx.query("select set_config('request.jwt.claim.sub',$1,true)",[userId||'']);return fn(tx);});}
/** @param {import('@electric-sql/pglite').PGlite} db @param {string} name @param {Record<string,unknown>} args @param {string|null} userId */
export async function rpc(db,name,args={},userId=null){
 if(!/^atosfeed_[a-z_]+$/.test(name)||Object.keys(args).some(k=>!/^p_[a-z_]+$/.test(k)))throw Error('invalid RPC');
 return asRole(db,userId,async tx=>{const keys=Object.keys(args);const result=await tx.query(`select public.${name}(${keys.map((k,i)=>`${k} => $${i+1}`).join(',')}) as result`,Object.values(args));return result.rows[0].result;});
}
