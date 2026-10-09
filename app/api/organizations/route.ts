import {handle} from '@/lib/server/api';
export const runtime='nodejs';
export function GET(request:Request){return handle(request,'organizations');}
export function POST(request:Request){return handle(request,'organizations');}
