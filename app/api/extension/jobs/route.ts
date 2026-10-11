import {handle} from '@/lib/server/api';
export function POST(request:Request){return handle(request,'device-jobs');}
export function OPTIONS(request:Request){return handle(request,'device-jobs');}
