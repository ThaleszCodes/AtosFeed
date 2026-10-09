import {describe,it,expect} from 'vitest';
import {JSDOM} from 'jsdom';
import {guard,readGroups,outcome,fingerprint,recover as recoverExtension} from '../extension/core.js';
import {claim,createJob,recover} from '../lib/queue';
const doc=(html:string)=>new JSDOM(html).window.document;
describe('Facebook adapter guard',()=>{
 it.each([['https://www.facebook.com/login','', 'session_expired'],['https://www.facebook.com/checkpoint','', 'challenge'],['https://www.facebook.com/groups/1','Temporariamente bloqueado','restricted'],['https://example.com/','','wrong_site']])('stops at %s',(url,html,state)=>expect(guard(doc(html),url)).toBe(state));
 it('does not equate absence of challenge with confirmed account',()=>expect(guard(doc(''), 'https://www.facebook.com/groups/1')).toBeNull());
 it('reads visible links, excludes navigation, external destinations and duplicates',()=>expect(readGroups(doc('<a href="/groups/1/">Grupo</a><a href="/groups/1">Grupo</a><a href="/groups/feed">Feed</a><a href="https://evil.test/groups/2">Other</a>'),'https://www.facebook.com/groups/')).toEqual([{id:'1',name:'Grupo',url:'https://www.facebook.com/groups/1/'}]));
 it.each([['Post published','sent'],['Pending approval','awaiting_approval'],['Failed to post','failed'],['random feed post','unknown']])('classifies %s',(text,state)=>expect(outcome(text)).toBe(state));
 it('does not reuse old success evidence',()=>expect(outcome('Post published','Post published')).toBe('unknown'));
 it('recovers an interrupted attempt conservatively',()=>expect(recoverExtension({state:'executing'}).state).toBe('unknown'));
});
describe('queue',()=>{
 const job=createJob('test','1','2030-01-01T00:00:00Z','org',0);
 it('rejects invalid dates and blank bodies',()=>{expect(()=>createJob('','1','2030-01-01','org',0)).toThrow();expect(()=>createJob('test','1','invalid','org',0)).toThrow();});
 it('does not run disconnected or before due time',()=>{expect(claim(job,'org',0,true).state).toBe('queued');expect(claim(job,'org',Date.parse('2031-01-01'),false).state).toBe('queued');});
 it('claims only a due queued job',()=>expect(claim(job,'org',Date.parse('2031-01-01'),true).state).toBe('executing'));
 it('rejects another tenant',()=>expect(()=>claim(job,'other',Date.now(),true)).toThrow());
 it.each(['unknown','sent','awaiting_approval','failed'] as const)('never retries %s',state=>expect(claim({...job,state},'org',Date.parse('2031-01-01'),true).state).toBe(state));
 it('interrupted jobs become unknown',()=>expect(recover({...job,state:'executing'}).state).toBe('unknown'));
});

it('duplicate prevention is stable when the same image is renamed',async()=>{
 const payload={groupId:'42',text:'hello',image:{type:'image/png',data:'AA==',name:'first.png'}};
 expect(await fingerprint(payload)).toBe(await fingerprint({...payload,image:{...payload.image,name:'renamed.png'}}));
 expect(await fingerprint(payload)).not.toBe(await fingerprint({...payload,groupId:'43'}));
});
