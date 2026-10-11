import {createHash,randomBytes} from 'node:crypto';
export class ApiError extends Error {constructor(public status:number,public code:string,message:string){super(message);}}
export function sha256(value:string){return createHash('sha256').update(value).digest('hex');}
export function newPairCode(){return randomBytes(16).toString('hex').toUpperCase();}
export function newDeviceToken(){return 'af_device_'+randomBytes(32).toString('base64url');}
export function bearer(request:Request){const match=request.headers.get('authorization')?.match(/^Bearer ([^\s]+)$/);if(!match||match[1].length>4096)throw new ApiError(401,'unauthorized','Entre novamente para continuar.');return match[1];}
export function extensionId(request:Request){
 const origin=request.headers.get('origin'),header=request.headers.get('x-atosfeed-extension');
 const match=origin?.match(/^chrome-extension:\/\/([a-p]{32})$/);
 if((origin&&!match)||(header&&!/^[a-p]{32}$/.test(header))||(match&&header&&match[1]!==header))throw new ApiError(403,'invalid_origin','Origem da extensão não autorizada.');
 // Some trusted extension requests omit Origin. The device token/code remains the
 // authentication factor; an explicit ID selects its binding and grants no access alone.
 const id=match?.[1]||header;if(!id)throw new ApiError(403,'invalid_origin','A operação precisa ser iniciada pela extensão AtosFeed.');return id;
}
export function requireAppOrigin(request:Request){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw new ApiError(403,'invalid_origin','Origem da solicitação não autorizada.');}
export function uuid(value:unknown){if(typeof value!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(value))throw new ApiError(400,'invalid_id','Identificador inválido. Atualize a página.');return value;}
export function text(value:unknown,min:number,max:number){if(typeof value!=='string'||value.trim().length<min||value.trim().length>max)throw new ApiError(400,'invalid_input',`Informe um texto de ${min} a ${max} caracteres.`);return value.trim();}
export async function body(request:Request,maxBytes=8192):Promise<Record<string,unknown>>{
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw new ApiError(415,'invalid_content','Envie dados em JSON.');
 const reader=request.body?.getReader();if(!reader)throw new ApiError(400,'invalid_body','Solicitação vazia.');let length=0;const chunks:Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>maxBytes){await reader.cancel();throw new ApiError(413,'body_too_large','Solicitação muito grande.');}chunks.push(value);}
 try{const parsed=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')throw Error();return parsed;}catch{throw new ApiError(400,'invalid_json','Dados inválidos. Confira o formulário.');}
}
