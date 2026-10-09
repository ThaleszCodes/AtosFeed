import {handle} from '@/lib/server/api';
export const runtime='nodejs';
export function GET(request:Request){return handle(request,'devices');}
export function DELETE(request:Request){return handle(request,'devices');}
