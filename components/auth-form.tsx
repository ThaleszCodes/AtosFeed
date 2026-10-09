'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {getSupabase} from '@/lib/supabase';
import {useAccount} from './account-provider';
type Mode='login'|'signup'|'recover'|'reset';
export function AuthForm({initialMode='login'}:{initialMode?:Mode}){
 const [mode,setMode]=useState<Mode>(initialMode),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[confirm,setConfirm]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[saved,setSaved]=useState(false);
 const account=useAccount(),router=useRouter(),client=getSupabase();
 useEffect(()=>{if(account.session&&mode==='login')router.replace('/');},[account.session,mode,router]);
 async function submit(event:React.FormEvent){
  event.preventDefault();if(busy||!client)return;setMessage('');setBusy(true);
  try{
   if((mode==='signup'||mode==='reset')&&(password.length<12||password!==confirm)){setMessage('Use pelo menos 12 caracteres e repita a mesma senha.');return;}
   const redirect=new URL('/auth/reset',window.location.origin).href;
   if(mode==='login'){const {error}=await client.auth.signInWithPassword({email:email.trim(),password});if(error){setMessage('E-mail ou senha inválidos, ou conta ainda não confirmada. Confira seus dados.');return;}setPassword('');router.replace('/');}
   if(mode==='signup'){const {data,error}=await client.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:window.location.origin}});if(error){setMessage('Não foi possível criar a conta. Confira os dados e tente novamente.');return;}setPassword('');setConfirm('');if(data.session)router.replace('/');else setMessage('Se o cadastro puder ser concluído, você receberá um e-mail de confirmação.');}
   if(mode==='recover'){const {error}=await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:redirect});if(error){setMessage('Não foi possível solicitar a recuperação. Tente novamente mais tarde.');return;}setMessage('Se este e-mail estiver cadastrado, você receberá as instruções de recuperação. Abra o link neste navegador.');}
   if(mode==='reset'){if(!account.session){setMessage('Link inválido ou expirado. Solicite outra recuperação e abra o link no mesmo navegador.');return;}const {error}=await client.auth.updateUser({password});if(error){setMessage('Não foi possível atualizar a senha. Confira o link e tente novamente.');return;}setPassword('');setConfirm('');setSaved(true);setMessage('Senha atualizada. Você já pode acessar o painel.');}
  }catch{setMessage('Conexão indisponível. O formulário foi preservado; tente novamente.');}finally{setBusy(false);}
 }
 const titles={login:'Entre no seu espaço.',signup:'Crie sua conta.',recover:'Recupere seu acesso.',reset:'Defina uma nova senha.'};
 return <main id="content" className="auth-page"><Link href="/" className="brand">Atos<span>Feed</span></Link><p className="eyebrow">SEU CONTEÚDO, SEU CONTROLE</p><h1>{titles[mode]}</h1><p className="intro">A conta AtosFeed é separada da sua sessão do Facebook.</p>{!account.configured&&<div className="warning"><strong>Autenticação ainda não configurada neste ambiente.</strong><p>Configure a URL e a chave pública Supabase para usar sua conta. O laboratório local continua disponível.</p></div>}
 {mode==='reset'&&account.session&&<p>Atualizando a senha de {account.session.user.email}.</p>}
 <form onSubmit={submit} aria-busy={busy}><fieldset disabled={!account.configured||busy||account.loading||saved}>
 {mode!=='reset'&&<><label htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required maxLength={254}/></>}
 {mode!=='recover'&&<><label htmlFor="password">{mode==='reset'?'Nova senha':'Senha'}</label><input id="password" type="password" autoComplete={mode==='login'?'current-password':'new-password'} value={password} onChange={e=>setPassword(e.target.value)} required minLength={mode==='login'?1:12} maxLength={128}/>{mode!=='login'&&<><p className="hint">Pelo menos 12 caracteres. Nunca use sua senha do Facebook aqui.</p><label htmlFor="confirm">Confirme a senha</label><input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} required minLength={12} maxLength={128}/></>}</>}
 <button className="primary" type="submit">{busy?'Aguarde…':mode==='login'?'Entrar':mode==='signup'?'Criar conta':mode==='recover'?'Enviar instruções':'Salvar nova senha'}</button></fieldset></form><p className="notice" role="status">{message}</p>
 {mode==='login'&&<div className="auth-links"><button onClick={()=>{setMode('recover');setPassword('');setMessage('');}}>Esqueci minha senha</button><button onClick={()=>{setMode('signup');setMessage('');}}>Criar uma conta</button></div>}
 {(mode==='signup'||mode==='recover')&&<button onClick={()=>{setMode('login');setPassword('');setConfirm('');setMessage('');}}>Voltar para entrar</button>}
 {mode==='reset'&&(saved?<Link href="/">Abrir painel</Link>:<Link href="/login">Solicitar outro link de recuperação</Link>)}{!account.configured&&<Link href="/">Voltar ao laboratório local</Link>}
 </main>;
}
