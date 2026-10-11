import {handle} from '@/lib/server/api';
export function GET(request:Request){return handle(request,'groups');}
