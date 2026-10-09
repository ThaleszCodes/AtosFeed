import {handle} from '@/lib/server/api';
export const runtime='nodejs';
export function POST(request:Request){return handle(request,'disconnect');}
export function OPTIONS(request:Request){return handle(request,'disconnect');}
