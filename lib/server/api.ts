import {anonymousBackend,userBackend} from './backend';
import {ApiError,body,bearer,extensionId,newDeviceToken,newPairCode,requireAppOrigin,sha256,text,uuid} from './security';
export type Operation='organizations'|'members'|'pairing'|'devices'|'pair'|'heartbeat'|'disconnect'|'groups'|'jobs'|'sync-groups'|'device-jobs'|'claim-job'|'report-job';
export async function handle(request:Request,operation:Operation){
 const isExtension=['pair','heartbeat','disconnect','sync-groups','device-jobs','claim-job','report-job'].includes(operation);
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
   if(operation==='sync-groups'){
    const input=await body(request,65536);if(!Array.isArray(input.groups)||input.groups.length>50)throw new ApiError(400,'invalid_groups','Importe até 50 grupos visíveis por vez.');
    const groups=input.groups.map(g=>{if(!g||typeof g!=='object'||typeof g.id!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(g.id)||['feed','discover','joins','create','notifications','pending','suggested'].includes(g.id.toLowerCase()))throw new ApiError(400,'invalid_groups','Grupo inválido. Leia os grupos novamente.');return {id:g.id,name:text(g.name,1,120)};});
    return Response.json(await db.rpc('atosfeed_sync_groups',{p_token:token,p_extension_id:ext,p_groups:groups}),{headers});
   }
   if(operation==='device-jobs')return Response.json({jobs:await db.rpc('atosfeed_device_jobs',{p_token:token,p_extension_id:ext})},{headers});
   if(operation==='claim-job'||operation==='report-job'){
    const input=await body(request);const args={p_token:token,p_extension_id:ext,p_job:uuid(input.jobId),p_attempt:uuid(input.attemptId)};
    if(operation==='claim-job')return Response.json({job:await db.rpc('atosfeed_claim_job',args)},{headers});
    if(!['sent','awaiting_approval','failed','unknown'].includes(String(input.state)))throw new ApiError(400,'invalid_state','Resultado inválido.');
    await db.rpc('atosfeed_report_job',{...args,p_state:input.state,p_reason:input.reason?text(input.reason,1,80):null});return Response.json({reported:true},{headers});
   }
   const data=await db.rpc(operation==='heartbeat'?'atosfeed_heartbeat':'atosfeed_disconnect',{p_token:token,p_extension_id:ext});
   return Response.json(data||{disconnected:true},{headers});
  }
  const {db,userId}=await userBackend(request);const url=new URL(request.url);
  if(operation==='organizations'){
   if(request.method==='GET')return Response.json({organizations:await db.rpc('atosfeed_list_organizations'),userId},{headers});
   if(request.method==='POST'){const input=await body(request);return Response.json({organization:await db.rpc('atosfeed_create_organization',{p_name:text(input.name,2,80)})},{status:201,headers});}
  }
  if(operation==='groups'&&request.method==='GET')return Response.json({groups:await db.rpc('atosfeed_list_groups',{p_org:uuid(url.searchParams.get('organizationId'))})},{headers});
  if(operation==='jobs'){
   if(request.method==='GET')return Response.json({jobs:await db.rpc('atosfeed_list_jobs',{p_org:uuid(url.searchParams.get('organizationId'))})},{headers});
   if(request.method==='POST'){
    const input=await body(request,65536);const due=typeof input.dueAt==='string'?new Date(input.dueAt):new Date(NaN);if(!Number.isFinite(due.getTime()))throw new ApiError(400,'invalid_date','Informe uma data válida.');
    return Response.json({job:await db.rpc('atosfeed_create_job',{p_org:uuid(input.organizationId),p_group:text(input.groupId,1,100),p_body:text(input.text,1,4000),p_due:due.toISOString(),p_key:uuid(input.idempotencyKey)})},{status:201,headers});
   }
   if(request.method==='DELETE'){const input=await body(request);await db.rpc('atosfeed_cancel_job',{p_org:uuid(input.organizationId),p_job:uuid(input.jobId)});return Response.json({cancelled:true},{headers});}
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
