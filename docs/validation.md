# Instalar e validar

## Local

`npm ci`, `npm test`, `npm run typecheck`, `npm run build`. `npm run dev` para desenvolvimento; `npm run start` após build para produção local. E2E: `npm run test:e2e`, Chrome em `/usr/bin/chromium` ou variável CHROMIUM_PATH. Não é necessário instalar browsers Playwright se o Chrome estiver disponível. Testes não conectam ao Facebook: rotas são interceptadas e fixtures são identificadas no código.

O smoke automatizado de carregamento MV3 foi bloqueado por política administrativa do Chromium do ambiente (“Loading of unpacked extensions is disabled by the administrator.”). Testes do adapter aprovados não comprovam carregamento ou permissões da extensão. Validar manualmente no Chrome conforme abaixo.

## Extensão experimental (computador)

Pareamento com o painel: siga [auth-pairing.md](auth-pairing.md). O fluxo abaixo pode ser local ou carregar uma tarefa compartilhada; para a fila do painel e download do ZIP, siga [shared-queue.md](shared-queue.md).

1. Chrome → chrome://extensions → modo desenvolvedor → Carregar sem compactação → pasta `extension/`.
2. Abra uma sessão própria do Facebook e a lista de grupos. Clique no ícone AtosFeed; uma aba de laboratório será aberta.
3. Clique **Identificar sessão e ler grupos**. Confira manualmente a conta no Facebook. A leitura cobre só links visíveis, não todos os grupos. Sessão não confirmada não deve ser descrita como conexão concluída.
4. Escolha um único grupo onde você possui autorização. Navegue a aba original até `/groups/ID/`. Mantenha-a aberta, sem outro editor ativo. Se activeTab for revogado, reabra a extensão.
5. Digite o texto e escolha PNG/JPEG/WebP de até 5 MB. Clique **Preparar no grupo**. Verifique texto, imagem e grupo diretamente no Facebook.
6. Somente após autorização explícita do dono da conta para o conteúdo e grupo exatos: marque a autorização e clique **Publicar uma vez**. O desenvolvimento desta entrega NÃO executou essa etapa em Facebook real.
7. Confira o resultado no grupo. Registre horário, versão da extensão, idioma, estado, evidência do aviso/permalink (sem cookies, tokens ou dados pessoais desnecessários).

Se o campo de imagem não estiver disponível, nada será enviado. Interfaces/idiomas não reconhecidos exigem revisão do adapter; não aumente permissões ou burle a interface.

## Matriz do piloto pendente

- 1.1: sessão normal, expirada e conta não confirmada; conferir identidade manualmente.
- 1.2: comparar lista visível com grupos selecionáveis; testar nomes/IDs e duplicados.
- 1.3: um texto + imagem, grupo com publicação imediata e grupo com moderação (cada conteúdo/destino exige autorização). Registrar sent/awaiting_approval/failed/unknown sem transformar desconhecido em sucesso.
- 1.4: fila local com horário futuro; fechar browser/offline não deve prometer envio. Claim e desconexão estão testados localmente, agendamento real não está implementado.
- 1.5: não provocar bloqueios. Se houver desafio/restrição, parar e resolver somente no Facebook. Testes locais cobrem fixtures desses estados.
- 4.7: fechar laboratório durante tentativa; ao reabrir, executing vira unknown. Conferir o grupo antes de qualquer novo envio; laboratório recusa fingerprint já usado.

Falha antes de clicar Publicar preserva campos; após clique sem evidência, tratar como unknown. Não automatizar retry. Nunca solicitar/exportar cookies, senhas ou tokens Facebook.

## Supabase e produção

Fornecer acesso seguro ao projeto e configuração pública do cliente nas variáveis do ambiente (não em chat/commits). Antes de aplicar SQL: inspecionar namespaces/policies/roles existentes, confirmar compatibilidade, testar em instância local ou staging e executar testes RLS com usuários de organizações diferentes. As três migrations e RLS/RPCs foram testadas em PostgreSQL PGlite local; não no projeto Supabase. Nenhum deploy Vercel ou publicação de extensão ocorreu.
