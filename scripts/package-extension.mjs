import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,basename} from 'node:path';
import {deflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
// ZIP with a fixed source allowlist: no environment files, credentials or user data.
export async function packageExtension(root=resolve(fileURLToPath(new URL('..',import.meta.url)))) {
 const names=(await readdir(resolve(root,'extension'))).filter(n=>/^[a-z][a-z0-9-]*\.(js|html|css)$/.test(n)||n==='manifest.json').sort();
 const entries=[];let offset=0;const central=[];
 for(const name of names){
  const data=await readFile(resolve(root,'extension',name)),compressed=deflateRawSync(data),path=Buffer.from('atosfeed-extension/'+basename(name));
  let crc=0xffffffff;for(const b of data){crc^=b;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}crc=(crc^0xffffffff)>>>0;
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(8,8);local.writeUInt16LE(33,12);local.writeUInt32LE(crc,14);local.writeUInt32LE(compressed.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(path.length,26);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(8,10);c.writeUInt16LE(33,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(compressed.length,20);c.writeUInt32LE(data.length,24);c.writeUInt16LE(path.length,28);c.writeUInt32LE(offset,42);
  entries.push(local,path,compressed);central.push(c,path);offset+=local.length+path.length+compressed.length;
 }
 const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(names.length,8);end.writeUInt16LE(names.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
 const zip=Buffer.concat([...entries,directory,end]);const output=resolve(root,'public/downloads');await mkdir(output,{recursive:true});await writeFile(resolve(output,'atosfeed-extension.zip'),zip);await writeFile(resolve(output,'atosfeed-extension.sha256'),createHash('sha256').update(zip).digest('hex')+'  atosfeed-extension.zip\n');
 return {files:names,bytes:zip.length};
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(await packageExtension());
