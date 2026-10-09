import {anonymousBackend,userBackend} from './backend';
import {ApiError,body,bearer,extensionId,newDeviceToken,newPairCode,requireAppOrigin,sha256,text,uuid} from './security';
export type Operation='organizations'|'members'|'pairing'|'devices'|'pair'|'heartbeat'|'disconnect';
export async function handle(request:Request,operation:Operation){
 const isExtension=['pair','heartbeat','disconnect'].includes(operation);
 const headers=new Headers({'Cache-Control':'no-store','Pragma':'no-cache','Vary':'Origin','X-Content-Type-Options':'nosniff'});
 try{
  let ext='';if(isExtension){ext=extensionId(request);headers.set('Access-Control-Allow-Origin',`chrome-extension://${ext}`);headers.set('Access-Control-Allow-Methods','POST, OPTIONS');headers.set('Access-Control-Allow-Headers','Authorization, Content-Type, X-AtosFeed-Extension');}
  else requireAppOrigin(request);
  if(request.method==='OPTIONS'){if(!isExtension)throw new ApiError(405,'method_not_allowed','Método indisponível.');return new Response(null,{status:204,headers});}
  if(isExtension){
   if(request.method!=='POST')throw new ApiError(405,'method_not_allowed','Método indisponível.');
   const db=anonymousBackend();
   if(operation==='pair'){
    const input=await body(request);const code=text(input.code,32,32).toUpperCase();if(!/^[0-9A-F]{32}$/.test(code))throw new ApiError(400,'invalid_code','Cole o código completo gerado no painel.');
    const token=newDeviceToken();const data=await db.rpc('atosfeed_redeem_pairing',{p_code:code,p_token_hash:sha256(token),p_extension_id:ext,p_name:text(input.name,1,80)});
    return Response.json({...data as object,token},{headers});
   }
   const token=bearer(request);if(!/^af_device_[A-Za-z0-9_-]{43}$/.test(token))throw new ApiError(401,'wrong_credential','Credencial de dispositivo inválida.');
   const data=await db.rpc(operation==='heartbeat'?'atosfeed_heartbeat':'atosfeed_disconnect',{p_token:token,p_extension_id:ext});
   return Response.json(data||{disconnected:true},{headers});
  }
  const {db,userId}=await userBackend(request);const url=new URL(request.url);
  if(operation==='organizations'){
   if(request.method==='GET')return Response.json({organizations:await db.rpc('atosfeed_list_organizations'),userId},{headers});
   if(request.method==='POST'){const input=await body(request);return Response.json({organization:await db.rpc('atosfeed_create_organization',{p_name:text(input.name,2,80)})},{status:201,headers});}
  }
  if(operation==='members'){
   if(request.method==='GET')return Response.json({members:await db.rpc('atosfeed_list_members',{p_org:uuid(url.searchParams.get('organizationId'))})},{headers});
   if(request.method==='POST'){const input=await body(request);if(input.role!==null&&(typeof input.role!=='string'||!['owner','editor','viewer'].includes(input.role)))throw new ApiError(400,'invalid_role','Escolha um perfil válido.');await db.rpc('atosfeed_set_member',{p_org:uuid(input.organizationId),p_user:uuid(input.userId),p_role:input.role});return Response.json({updated:true},{headers});}
  }
  if(operation==='pairing'&&request.method==='POST'){
   const input=await body(request);const code=newPairCode();const result=await db.rpc('atosfeed_create_pairing',{p_org:uuid(input.organizationId),p_code_hash:sha256(code)});
   return Response.json({...result as object,code},{status:201,headers});
  }
  if(operation==='devices'){
   if(request.method==='GET')return Response.json({devices:await db.rpc('atosfeed_list_devices',{p_org:uuid(url.searchParams.get('organizationId'))}),serverTime:new Date().toISOString()},{headers});
   if(request.method==='DELETE'){const input=await body(request);await db.rpc('atosfeed_revoke_device',{p_org:uuid(input.organizationId),p_device:uuid(input.deviceId)});return Response.json({revoked:true},{headers});}
  }
  throw new ApiError(405,'method_not_allowed','Método indisponível.');
 }catch(error){const e=error instanceof ApiError?error:new ApiError(503,'service_unavailable','Serviço temporariamente indisponível. Seus dados foram preservados.');return Response.json({error:e.code,message:e.message},{status:e.status,headers});}
}
