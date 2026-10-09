import {test,expect,type Page} from '@playwright/test';
const PASSWORD='local-fixture-only-password-123';
const EXTENSION='a'.repeat(32);
async function register(page:Page,email:string){
 await page.goto('/login');await page.getByRole('button',{name:'Criar uma conta'}).click();await page.getByLabel('E-mail',{exact:true}).fill(email);await page.getByLabel('Senha',{exact:true}).fill(PASSWORD);await page.getByLabel('Confirme a senha').fill(PASSWORD);await page.getByRole('button',{name:'Criar conta',exact:true}).click();await expect(page).toHaveURL(/\/$/);await expect(page.getByRole('heading',{name:'Da ideia à publicação.'})).toBeVisible();
}
async function token(page:Page){return page.evaluate(()=>{const key=Object.keys(localStorage).find(k=>k.startsWith('sb-')&&k.endsWith('-auth-token'));if(!key)throw Error('No test session');return JSON.parse(localStorage.getItem(key)!).access_token as string;});}
async function connection(page:Page){await page.getByRole('button',{name:'Conexão',exact:true}).filter({visible:true}).click();}
test('account → organization → one-use pairing → heartbeat → revocation',async({page,request},testInfo)=>{
 const email=`flow-${testInfo.project.name}-${Date.now()}@example.test`,name=`Equipe ${testInfo.project.name}`;
 await register(page,email);await connection(page);await page.getByLabel('Nova organização').fill(name);await page.getByRole('button',{name:'Criar organização',exact:true}).click();await expect(page.getByLabel('Organização ativa')).toBeVisible();await page.getByLabel('Organização ativa').selectOption({label:name+' · Proprietário'});
 await page.getByRole('button',{name:'Gerar código de pareamento'}).click();const code=await page.getByLabel('Código descartável').inputValue();expect(code).toMatch(/^[A-F0-9]{32}$/);
 const pair=await request.post('/api/extension/pair',{headers:{Origin:`chrome-extension://${EXTENSION}`},data:{code,name:'Chrome de teste'}});expect(pair.status()).toBe(200);const device=await pair.json();
 const repeated=await request.post('/api/extension/pair',{headers:{Origin:`chrome-extension://${EXTENSION}`},data:{code,name:'Repetição'}});expect(repeated.status()).toBe(410);
 const heartbeat=await request.post('/api/extension/heartbeat',{headers:{Origin:`chrome-extension://${EXTENSION}`,Authorization:`Bearer ${device.token}`}});expect(heartbeat.status()).toBe(200);
 await page.getByRole('button',{name:'Atualizar status'}).click();await expect(page.locator('header').getByText('Computador conectado',{exact:true})).toBeVisible();await expect(page.getByRole('listitem').filter({hasText:'Chrome de teste'}).getByText('Computador conectado',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Revogar Chrome de teste'}).click();await expect(page.getByText('Revogado',{exact:true})).toBeVisible();
 const revoked=await request.post('/api/extension/heartbeat',{headers:{Origin:`chrome-extension://${EXTENSION}`,Authorization:`Bearer ${device.token}`}});expect(revoked.status()).toBe(401);
 const orgId=(await page.getByLabel('Organização ativa').inputValue());const member=await request.post('/api/members',{headers:{Origin:'http://localhost:3100',Authorization:`Bearer ${await token(page)}`},data:{organizationId:orgId,userId:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',role:'viewer'}});expect(member.status()).toBe(200);
 const viewerLogin=await request.post('http://127.0.0.1:54329/auth/v1/token?grant_type=password',{data:{email:'viewer@example.test',password:'fixture-only-password-123'}});const viewerSession=await viewerLogin.json();
 const viewerPairing=await request.post('/api/pairing',{headers:{Origin:'http://localhost:3100',Authorization:`Bearer ${viewerSession.access_token}`},data:{organizationId:orgId}});expect(viewerPairing.status()).toBe(403);
 // No Facebook request or publication performed anywhere in this test.
});
test('recovery email → PKCE callback → new password → sign in',async({page,request},testInfo)=>{
 const email=`recovery-${testInfo.project.name}-${Date.now()}@example.test`;
 await register(page,email);await connection(page);await page.getByRole('button',{name:'Sair da conta'}).click();await expect(page).toHaveURL(/\/login$/);
 await page.getByRole('button',{name:'Esqueci minha senha'}).click();await page.getByLabel('E-mail').fill(email);await page.getByRole('button',{name:'Enviar instruções'}).click();await expect(page.getByRole('status')).toContainText('Se este e-mail estiver cadastrado');
 const inbox=await request.get('http://127.0.0.1:54329/__test/inbox?email='+encodeURIComponent(email));const {link}=await inbox.json();expect(link).toContain('/auth/reset?code=');await page.goto(link);
 await expect(page.getByLabel('Nova senha',{exact:true})).toBeEnabled();await page.getByLabel('Nova senha',{exact:true}).fill(PASSWORD+'-new');await page.getByLabel('Confirme a senha').fill(PASSWORD+'-new');await page.getByRole('button',{name:'Salvar nova senha'}).click();await expect(page.getByRole('status')).toContainText('Senha atualizada');
 await page.getByRole('link',{name:'Abrir painel'}).click();await connection(page);await page.getByRole('button',{name:'Sair da conta'}).click();await expect(page).toHaveURL(/\/login$/);
 await page.getByLabel('E-mail').fill(email);await page.getByLabel('Senha',{exact:true}).fill(PASSWORD+'-new');await page.getByRole('button',{name:'Entrar',exact:true}).click();await expect(page).toHaveURL(/\/$/);
});
test('anonymous API and unauthorized origins fail closed',async({request})=>{
 const denied=await request.get('/api/organizations');expect(denied.status()).toBe(401);expect(denied.headers()['cache-control']).toBe('no-store');
 const invalidOrigin=await request.post('/api/extension/pair',{headers:{Origin:'https://evil.example'},data:{code:'A'.repeat(32),name:'Unknown'}});expect(invalidOrigin.status()).toBe(403);expect(invalidOrigin.headers()['access-control-allow-origin']).toBeUndefined();
});
