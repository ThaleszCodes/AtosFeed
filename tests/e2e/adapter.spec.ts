import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const source=readFileSync('extension/adapter.js','utf8');
test('browser DOM fixture prepares text/image and distinguishes approval',async({page})=>{
 // Every request intercepted. No Facebook request or real publication.
 await page.route('https://www.facebook.com/**',route=>route.fulfill({contentType:'text/html',body:`<div aria-label="Your profile"></div><a href="/groups/42/">Fixture group</a><button role="button" id="open">Write something</button><div id="host"></div><script>document.getElementById('open').onclick=()=>{document.getElementById('host').innerHTML='<div role="dialog"><div contenteditable="true" role="textbox"></div><input type="file" accept="image/*"><button role="button" id="post">Post</button></div>';document.querySelector('input').onchange=e=>{const img=document.createElement('img');img.src=URL.createObjectURL(e.target.files[0]);document.querySelector('[role=dialog]').append(img)};document.getElementById('post').onclick=()=>{document.getElementById('host').textContent='Pending approval'}}</script>`}));
 await page.goto('https://www.facebook.com/groups/42/');await page.addScriptTag({content:source});
 const payload={groupId:'42',text:'Local fixture only',image:{name:'test.png',type:'image/png',data:'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII='}};
 const run=(action:string)=>page.evaluate(async ({action,payload})=>{const win=window as unknown as {atosAdapter:(a:string,p:object)=>Promise<{state:string}>};return win.atosAdapter(action,payload);},{action,payload});
 expect((await run('inspect')).state).toBe('available');expect((await run('prepare')).state).toBe('prepared');await expect(page.getByRole('textbox')).toHaveText(payload.text);expect(await page.locator('input').evaluate((input:HTMLInputElement)=>input.files?.[0]?.name)).toBe('test.png');expect((await run('submit')).state).toBe('awaiting_approval');
});
