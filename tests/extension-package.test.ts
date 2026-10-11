import {it,expect} from 'vitest';
import {readFile,mkdtemp,mkdir,cp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {packageExtension} from '../scripts/package-extension.mjs';
it('produces a valid deterministic ZIP containing every extension module and no credentials',async()=>{
 const root=await mkdtemp(join(tmpdir(),'atosfeed-zip-'));try{await mkdir(join(root,'extension'));await cp('extension',join(root,'extension'),{recursive:true});await cp('.env.example',join(root,'extension','.env'));await packageExtension(root);const zip=await readFile(join(root,'public/downloads/atosfeed-extension.zip'));let offset=0;const files=new Map<string,Buffer>();while(zip.readUInt32LE(offset)===0x04034b50){const size=zip.readUInt32LE(offset+18),length=zip.readUInt16LE(offset+26),extra=zip.readUInt16LE(offset+28),start=offset+30+length+extra;const name=zip.subarray(offset+30,offset+30+length).toString();files.set(name,inflateRawSync(zip.subarray(start,start+size)));offset=start+size;}expect(zip.readUInt32LE(offset)).toBe(0x02014b50);expect(JSON.parse(files.get('atosfeed-extension/manifest.json')!.toString()).manifest_version).toBe(3);expect(files.has('atosfeed-extension/panel-client.js')).toBe(true);expect([...files.keys()].some(n=>n.includes('.env'))).toBe(false);for(const [name,data] of files)expect(data.equals(await readFile(join(root,'extension',name.split('/')[1])))).toBe(true);await packageExtension(root);expect((await readFile(join(root,'public/downloads/atosfeed-extension.zip'))).equals(zip)).toBe(true);expect(await readFile(join(root,'public/downloads/atosfeed-extension.sha256'),'utf8')).toContain(createHash('sha256').update(zip).digest('hex'));}finally{await rm(root,{recursive:true,force:true});}
});
