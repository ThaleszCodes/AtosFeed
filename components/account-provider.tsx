'use client';
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react';
import type {Session} from '@supabase/supabase-js';
import {getSupabase} from '@/lib/supabase';
import type {Device,Organization} from '@/lib/contracts';
interface Account {
 configured:boolean;loading:boolean;session:Session|null;organizations:Organization[];organization:Organization|null;devices:Device[];
 error:string;deviceError:string;refreshOrganizations:()=>Promise<void>;refreshDevices:()=>Promise<void>;chooseOrganization:(id:string)=>void;
 api:<T>(path:string,options?:RequestInit)=>Promise<T>;signOut:()=>Promise<void>;
}
const Context=createContext<Account|null>(null);
export function useAccount(){const value=useContext(Context);if(!value)throw Error('AccountProvider required');return value;}
export function AccountProvider({children}:{children:React.ReactNode}){
 const [client]=useState(()=>getSupabase());
 const [session,setSession]=useState<Session|null>(null),[loading,setLoading]=useState(!!client),[organizations,setOrganizations]=useState<Organization[]>([]),[selected,setSelected]=useState(''),[devices,setDevices]=useState<Device[]>([]),[error,setError]=useState(''),[deviceError,setDeviceError]=useState('');
 const identity=useRef('');const deviceRequest=useRef(0);
 useEffect(()=>{if(!client)return;let alive=true;const {data}=client.auth.onAuthStateChange((_event,current)=>{if(alive){identity.current=current?.user.id||'';setSession(current);setLoading(false);}});client.auth.getSession().then(({data,error})=>{if(alive){identity.current=data.session?.user.id||'';setSession(data.session);setLoading(false);if(error)setError('Não foi possível recuperar sua sessão. Entre novamente.');}});return()=>{alive=false;data.subscription.unsubscribe();};},[client]);
 const api=useCallback(async <T,>(path:string,options:RequestInit={}):Promise<T>=>{
  const {data}=await client?.auth.getSession()||{data:{session:null}};if(!data.session)throw Error('Entre novamente para continuar.');
  const response=await fetch(path,{...options,cache:'no-store',headers:{...options.headers,'Content-Type':'application/json',Authorization:`Bearer ${data.session.access_token}`}});
  const result=await response.json();if(!response.ok)throw Error(result.message||'Não foi possível concluir a operação.');return result;
 },[client]);
 const refreshOrganizations=useCallback(async()=>{
  const userId=identity.current;if(!userId)return;
  try{const result=await api<{organizations:Organization[]}>('/api/organizations');if(identity.current!==userId)return;setOrganizations(result.organizations);setError('');setSelected(current=>result.organizations.some(o=>o.id===current)?current:result.organizations[0]?.id||'');}catch(e){if(identity.current===userId){setOrganizations([]);setSelected('');setError((e as Error).message);}}
 },[api]);
 useEffect(()=>{setOrganizations([]);setDevices([]);setDeviceError('');setSelected('');if(session?.user.id){try{setSelected(localStorage.getItem('atosfeed:org:'+session.user.id)||'');}catch{}void refreshOrganizations();}},[session?.user.id,refreshOrganizations]);
 const organization=organizations.find(o=>o.id===selected)||null;
 const refreshDevices=useCallback(async()=>{
  const orgId=organization?.id,userId=identity.current,requestId=++deviceRequest.current;
  if(!orgId){setDevices([]);return;}
  try{const result=await api<{devices:Device[]}>(`/api/devices?organizationId=${orgId}`);if(identity.current===userId&&deviceRequest.current===requestId){setDevices(result.devices);setDeviceError('');}}catch(e){if(identity.current===userId&&deviceRequest.current===requestId){setDevices([]);setDeviceError((e as Error).message);}}
 },[organization?.id,api]);
 useEffect(()=>{deviceRequest.current++;setDevices([]);setDeviceError('');if(!organization)return;void refreshDevices();const interval=setInterval(()=>void refreshDevices(),15000);
 const resume=()=>{if(!document.hidden)void refreshDevices();};const offline=()=>{deviceRequest.current++;setDevices([]);setDeviceError('Sem conexão com a internet. O status do computador não foi confirmado.');};
 document.addEventListener('visibilitychange',resume);window.addEventListener('online',resume);window.addEventListener('offline',offline);
 return()=>{clearInterval(interval);document.removeEventListener('visibilitychange',resume);window.removeEventListener('online',resume);window.removeEventListener('offline',offline);deviceRequest.current++;};},[organization?.id,refreshDevices]);
 const chooseOrganization=useCallback((id:string)=>{if(!organizations.some(o=>o.id===id))return;deviceRequest.current++;setDevices([]);setSelected(id);if(session)try{localStorage.setItem('atosfeed:org:'+session.user.id,id);}catch{}},[organizations,session]);
 const signOut=useCallback(async()=>{if(!client)return;const {error}=await client.auth.signOut();if(error)throw Error('Não foi possível encerrar a sessão. Tente novamente.');identity.current='';setSession(null);setOrganizations([]);setSelected('');setDevices([]);},[client]);
 const value=useMemo(()=>({configured:!!client,loading,session,organizations,organization,devices,error,deviceError,refreshOrganizations,refreshDevices,chooseOrganization,api,signOut}),[client,loading,session,organizations,organization,devices,error,deviceError,refreshOrganizations,refreshDevices,chooseOrganization,api,signOut]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
