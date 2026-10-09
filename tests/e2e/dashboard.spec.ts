import {test,expect} from '@playwright/test';
test('preserves draft, schedules locally and cancels without submitting',async({page})=>{
 await page.goto('/lab');await expect(page.getByRole('heading',{level:1})).toHaveText('Da ideia à publicação.');
 await page.getByLabel('Texto da publicação').fill('Conteúdo autorizado somente em teste local');await page.reload();await expect(page.getByLabel('Texto da publicação')).toHaveValue('Conteúdo autorizado somente em teste local');
 await page.getByLabel('ID do grupo de teste').fill('42');await page.getByLabel('Data e hora neste dispositivo').fill('2030-01-01T12:00');await page.getByRole('button',{name:'Salvar na fila de teste'}).click();await expect(page.getByRole('status')).toContainText('não está conectada');
 await page.getByRole('button',{name:/^Fila/}).filter({visible:true}).click();await expect(page.getByText('Aguardando computador',{exact:false})).toBeVisible();await page.getByRole('button',{name:'Cancelar'}).click();await expect(page.getByText('Cancelado',{exact:false})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});

test('mobile reflow at 320 px and draft survives invalid schedule',async({page})=>{
 await page.setViewportSize({width:320,height:740});await page.goto('/lab');await page.getByLabel('Texto da publicação').fill('Preservar');await page.getByLabel('ID do grupo de teste').fill('42');await page.getByLabel('Data e hora neste dispositivo').fill('2020-01-01T12:00');await page.getByRole('button',{name:'Salvar na fila de teste'}).click();await expect(page.getByRole('status')).toContainText('data futura');await expect(page.getByLabel('Texto da publicação')).toHaveValue('Preservar');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
