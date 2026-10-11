import {createClient} from '@supabase/supabase-js';
import {ApiError,bearer} from './security';
import {isPublishableKey,isSupabaseUrl} from '../public-config';
export interface Backend { rpc(name:string,args?:Record<string,unknown>):Promise<unknown>; }
function client(token?:string){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!isSupabaseUrl(url)||!isPublishableKey(key))throw new ApiError(503,'not_configured','Configure a URL e somente a chave pública Supabase nas variáveis do ambiente.');
 return createClient(url!,key!,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},global:{headers:token?{Authorization:`Bearer ${token}`}:{},fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(8000)})}});
}
function databaseError(error:{code?:string;message?:string}):never{
 if(error.code==='42501')throw new ApiError(403,'forbidden','Seu perfil não permite esta operação nesta organização.');
 const messages:Record<string,[number,string]>={job_unavailable:[409,'Tarefa cancelada, já reservada ou indisponível. Atualize a fila; não repita o envio.'],idempotency_conflict:[409,'O identificador de envio já pertence a outro conteúdo.'],pairing_invalid:[410,'Código inválido, expirado ou já utilizado. Gere outro código no painel.'],device_invalid:[401,'Dispositivo revogado, expirado ou sem permissão. Faça um novo pareamento.'],last_owner:[409,'A organização precisa manter pelo menos um proprietário.'],device_limit:[409,'Limite de dez dispositivos atingido. Revogue um dispositivo antes de conectar outro.']};
 const known=messages[error.message||''];if(known)throw new ApiError(known[0],error.message!,known[1]);
 if(error.code==='22023'||error.code==='22P02'||error.code==='23503')throw new ApiError(400,'invalid_input','Dados inválidos ou usuário não cadastrado. Confira os campos.');
 if(error.code==='PGRST202'||error.code==='42P01')throw new ApiError(503,'migration_required','A estrutura AtosFeed ainda não foi instalada neste projeto Supabase.');
 throw new ApiError(503,'backend_unavailable','Não foi possível acessar o Supabase. Seus dados foram preservados; tente novamente.');
}
function adapter(db:ReturnType<typeof client>):Backend {return {async rpc(name,args={}){const {data,error}=await db.rpc(name,args);if(error)databaseError(error);return data;}};}
export async function userBackend(request:Request):Promise<{db:Backend;userId:string}>{
 const token=bearer(request);if(token.startsWith('af_device_'))throw new ApiError(401,'wrong_credential','O dispositivo não possui acesso de usuário.');
 const db=client(token);const {data,error}=await db.auth.getUser(token);
 if(error&&(error.status===0||(error.status||0)>=500||error.name==='AuthRetryableFetchError'))throw new ApiError(503,'backend_unavailable','Não foi possível validar a sessão no Supabase. Tente novamente.');
 if(error||!data.user)throw new ApiError(401,'unauthorized','Sessão inválida ou expirada. Entre novamente.');
 return {db:adapter(db),userId:data.user.id};
}
export function anonymousBackend():Backend{return adapter(client());}
