export type Role='owner'|'editor'|'viewer';
export interface Organization {id:string;name:string;role:Role;}
export interface Member {userId:string;role:Role;}
export interface Device {id:string;name:string;pairedBy:string;lastSeenAt:string|null;expiresAt:string;revokedAt:string|null;connected:boolean;canRevoke:boolean;}
export function deviceLabel(device:Device,now=Date.now()){
 if(device.revokedAt)return 'Revogado';if(Date.parse(device.expiresAt)<=now)return 'Expirado';
 return device.connected?'Computador conectado':'Computador desconectado';
}
