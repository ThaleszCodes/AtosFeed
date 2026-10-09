import {it,expect,vi} from 'vitest';
import {JSDOM} from 'jsdom';
import {readFileSync} from 'node:fs';
const source=readFileSync('extension/adapter.js','utf8');
function adapter(html:string,url='https://www.facebook.com/groups/42/'){
 const dom=new JSDOM(html,{url,runScripts:'outside-only'});dom.window.eval(source);
 return {dom,run:(action:string,payload:object)=>(dom.window.eval('atosAdapter') as (a:string,p:object)=>Promise<{state:string;reason?:string}>)(action,payload)};
}
it('does not touch composer with expired session',async()=>{const {run}=adapter('<input type="password">');expect(await run('prepare',{groupId:'42',text:'hello'})).toEqual({state:'interrupted',reason:'session_expired'});});
it('fails closed for different group',async()=>{const {run}=adapter('');expect(await run('submit',{groupId:'wrong',text:'hello'})).toEqual({state:'failed',reason:'wrong_group'});});
it('never clicks if the text was edited',async()=>{const {run,dom}=adapter('<div role="dialog"><div contenteditable="true" role="textbox">edited</div><button>Post</button></div>');const click=vi.fn();dom.window.document.querySelector('button')!.addEventListener('click',click);expect((await run('submit',{groupId:'42',text:'original'})).reason).toBe('content_changed');expect(click).not.toHaveBeenCalled();});
it('never submits image without observable attachment',async()=>{const {run}=adapter('<div role="dialog"><div contenteditable="true" role="textbox">hello</div><button>Post</button></div>');expect((await run('submit',{groupId:'42',text:'hello',image:{}})).reason).toBe('image_not_confirmed');});
it('rejects ambiguous submit controls',async()=>{const {run}=adapter('<div role="dialog"><div contenteditable="true" role="textbox">hello</div><button>Post</button><button>Post</button></div>');expect((await run('submit',{groupId:'42',text:'hello'})).reason).toBe('submit_not_found');});
