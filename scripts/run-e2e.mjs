// Test infrastructure only. No mock authentication branch exists in production code.
import {spawn} from 'node:child_process';
import {startFixture} from '../tests/support/supabase-fixture.mjs';
import {packageExtension} from './package-extension.mjs';
await packageExtension();
const fixture=await startFixture();
const env={...process.env,ATOSFEED_BUILD_DIR:'.next-e2e',NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:54329',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_local_fixture'};
let child,closing=false;
async function close(){
 if(closing)return;closing=true;child?.kill('SIGTERM');await fixture.close();
 // Regenerate ordinary development declarations after the isolated test build.
 const types=spawn(process.execPath,['node_modules/next/dist/bin/next','typegen'],{env:process.env,stdio:'ignore'});
 await new Promise(resolve=>types.once('exit',resolve));
}
process.on('SIGTERM',()=>void close().then(()=>process.exit(0)));process.on('SIGINT',()=>void close().then(()=>process.exit(0)));
try{
 child=spawn(process.execPath,['node_modules/next/dist/bin/next','build'],{env,stdio:'inherit'});
 const exit=await new Promise(resolve=>child.once('exit',resolve));if(exit!==0)throw Error('E2E build failed');
 child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3100'],{env,stdio:'inherit'});
 child.once('exit',()=>void close());
}catch{await close();process.exit(1);}
