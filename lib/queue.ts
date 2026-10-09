export type State = 'queued' | 'executing' | 'sent' | 'awaiting_approval' | 'failed' | 'unknown' | 'cancelled';
export interface Job { id:string; organizationId:string; groupId:string; text:string; dueAt:string; state:State; }
export function claim(job:Job, organizationId:string, now:number, connected:boolean):Job {
 if(job.organizationId!==organizationId) throw new Error('Organização não autorizada');
 if(job.state!=='queued' || !connected || Date.parse(job.dueAt)>now || !Number.isFinite(Date.parse(job.dueAt))) return job;
 return {...job,state:'executing'};
}
export function recover(job:Job):Job { return job.state==='executing'?{...job,state:'unknown'}:job; }
export function createJob(text:string, groupId:string, dueAt:string, organizationId:string, now=Date.now()):Job {
 if(!text.trim() || !groupId.trim() || !organizationId || !Number.isFinite(Date.parse(dueAt)) || Date.parse(dueAt)<=now) throw new Error('Informe conteúdo, destino e uma data futura.');
 return {id:crypto.randomUUID(),organizationId,groupId,text:text.trim(),dueAt:new Date(dueAt).toISOString(),state:'queued'};
}
