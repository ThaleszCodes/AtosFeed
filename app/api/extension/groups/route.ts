import {handle} from '@/lib/server/api';
export function POST(request:Request){return handle(request,'sync-groups');}
export function OPTIONS(request:Request){return handle(request,'sync-groups');}
