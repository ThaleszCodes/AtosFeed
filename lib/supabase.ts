import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import {isPublishableKey,isSupabaseUrl} from './public-config';
let browserClient:SupabaseClient|null=null;
export function getSupabase(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!isSupabaseUrl(url)||!isPublishableKey(key))return null;
 if(typeof window==='undefined')return createClient(url!,key!,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
 if(!browserClient)browserClient=createClient(url!,key!,{auth:{flowType:'pkce',detectSessionInUrl:true}});
 return browserClient;
}
