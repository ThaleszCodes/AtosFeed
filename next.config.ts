import type {NextConfig} from 'next';
import {isPublishableKey,isSupabaseUrl} from './lib/public-config';
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if(key&&key!=='replace_with_publishable_key'&&!isPublishableKey(key))throw Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY deve conter somente uma chave pública, nunca service-role ou secret.');
if(process.env.NEXT_PUBLIC_SUPABASE_URL&&!isSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL))throw Error('Use uma origem HTTPS Supabase; HTTP apenas em loopback para desenvolvimento.');
const config:NextConfig={
 distDir:process.env.ATOSFEED_BUILD_DIR||'.next',
 logging:{incomingRequests:false},
 async headers(){return [{source:'/:path*',headers:[
  {key:'Referrer-Policy',value:'no-referrer'},
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'X-Frame-Options',value:'DENY'},
  {key:'Content-Security-Policy',value:"object-src 'none'; base-uri 'self'; frame-ancestors 'none'"},
 ]}];},
};
export default config;
