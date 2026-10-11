# 3.4–3.6 e 4.2 — autenticação, organizações e pareamento

## Executar

```sh
npm ci
npm run dev
```

Sem configuração Supabase, `/login` mostra o requisito e `/lab` permite testar os rascunhos locais. Com configuração válida, `/` exige sessão no painel; todas as APIs de organizações/membros/dispositivos verificam o JWT com `auth.getUser` no servidor. A proteção dos dados é feita no servidor e no PostgreSQL, não apenas pelo redirecionamento visual.

Copie `.env.example` para um arquivo local ignorado e configure **apenas a URL e publishable key** do projeto autorizado:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (chave `sb_publishable_…` ou anon legada; nunca service-role)

A chave pública não concede privilégios de servidor. Os RPCs verificam `auth.uid()` e membership. Nenhum service-role é necessário. URL HTTPS obrigatória fora de loopback. O build recusa chaves privilegiadas e URLs inseguras sem imprimir seus valores.

Variáveis NEXT_PUBLIC são incorporadas no build; reinicie/recompile após configurar. Não suba `.next-e2e` para produção: contém endpoints e chave sintética de testes.

## Projeto Supabase existente

Project ref solicitado: `mpxbbembbzxtwekwwrvw`. Acesso e chave pública ainda não fornecidos. Nenhuma migration, mudança de auth, grant, policy ou tabela foi aplicada nesse projeto.

Depois de validar o acesso autorizado:

1. Inspecionar schema, funções/policies/grants e configuração auth existente; preservar dados e não sobrescrever objetos existentes.
2. Testar em staging/local as três migrations, nessa ordem:
   - `202610080001_atosfeed.sql`
   - `202610080002_auth_pairing.sql`
   - `202610110003_shared_queue.sql`
3. Aplicar apenas após revisão de compatibilidade. As três são aditivas/transacionais e usam schema `atosfeed`; não removem ou migram tabelas do sistema antigo. Colisões de objetos abortam, não fazem drop/recreate.
4. Os RPCs `public.atosfeed_*` ficam no schema public já exposto pelo Supabase; tabelas e credenciais continuam no schema privado AtosFeed. Não é necessário expor esse schema pela API. Verificar grants/default privileges do projeto real.
5. Configurar o Site URL do AtosFeed e redirects exatos do painel: raiz `/` para confirmação de cadastro e `/auth/reset` para recuperação. Evitar curingas de produção. Preservar redirects legítimos já existentes.
6. Verificar e-mail/SMTP, confirmação de cadastro e políticas de senha existentes. O código não altera esses requisitos. Cadastro com confirmação obrigatória não dá acesso antes da confirmação. Recuperação usa PKCE e precisa ser aberta no navegador que iniciou o pedido; link/verifier expirados exigem novo pedido.
7. Testar dois usuários de organizações distintas contra o Supabase real antes de afirmar integração concluída.

## Conta e permissões

- Cadastro/login/recuperação/atualização de senha implementados com o SDK Supabase; senha nova mínima de 12 caracteres. Erros preservam campos, sem indicar existência da conta em recuperação.
- Criar organização insere a membership owner na mesma transação.
- Owner gerencia perfis de usuários já cadastrados por UUID e revoga qualquer dispositivo de sua organização.
- Editor pareia e revoga seus próprios dispositivos. Não administra membros ou dispositivos de outro editor.
- Viewer consulta sua organização, membros e status, mas não pareia nem altera dados.
- A última membership owner não pode ser removida/rebaixada. A linha da organização é bloqueada durante alterações para serializar decisões concorrentes.
- Remoção/rebaixamento a viewer revoga dispositivos e códigos pendentes do membro. Heartbeat também revalida a membership; voltar a editor não reativa tokens revogados.
- Rascunhos são locais, separados por usuário/organização; a fila autenticada agora persiste no servidor e é consumida após revisão na extensão (ver [shared-queue.md](shared-queue.md)). `/lab` mantém uma fila de teste independente. Não há publicação automática.

## Pareamento ponta a ponta

1. Entre no AtosFeed e escolha/crie sua organização em **Conexão**.
2. Como owner/editor, clique **Gerar código de pareamento**. Código aleatório de 128 bits, validade de cinco minutos, uso único, mantido apenas em memória no painel. Novo código invalida o anterior do mesmo usuário/organização.
3. Instale/atualize `extension/` no Chrome 120+. Abra as opções da extensão (clicar no ícone fora do Facebook também abre opções).
4. Informe a origem do próprio painel (HTTPS ou localhost), nome do computador e código.
5. A extensão pede permissão opcional somente ao hostname escolhido. Não instala acesso permanente ao Facebook; mantém `activeTab` para operações iniciadas pelo usuário. Permissões de host não distinguem portas em localhost, mas a credencial fica vinculada à origem exata configurada.
6. A API resgata o código numa transação e emite credencial aleatória de dispositivo (256 bits, trinta dias), vinculada à organização, ao usuário que pareou e ao ID da extensão. Banco guarda somente hashes SHA-256, inacessíveis às roles anon/authenticated. API devolve o token apenas nessa resposta.
7. Extensão guarda essa credencial de AtosFeed em storage restrito a contextos confiáveis. Nunca recebe JWT de usuário Supabase nem tokens/cookies Facebook.
8. Alarmes enviam heartbeat a cada 30 segundos, inclusive após restart do Chrome. **Estar conectado ao painel não comprova sessão ativa no Facebook.** Após 90 segundos sem contato, o servidor considera offline. Painel consulta a cada 15 segundos e revalida ao voltar à aba/reconectar.
9. Revogar no painel invalida os próximos heartbeats. Worker elimina a credencial, cancela alarme e remove permissão opcional quando recebe expiração/revogação. Desconectar pela extensão tenta revogar no servidor antes de limpar o estado. Sem internet, deixa explícita a revogação remota não confirmada: revogue também pelo painel.

Código perdido/resposta de pareamento incerta: confira os dispositivos no painel, revogue o órfão e gere outro código. Não reutilize automaticamente um código consumido. Limite atual: dez dispositivos não expirados por organização.

A credencial de dispositivo acessa heartbeat, desconexão, importação de grupos e consulta/reserva/resultados da fila da organização pareada. Não substitui a autorização explícita do envio pelo usuário; não acessa contas nem cria organizações. API usa Bearer em headers, não query strings; CORS não reflete origens arbitrárias. O header X-AtosFeed-Extension identifica o binding mesmo quando o Chrome omite Origin; sozinho não autentica. Origin presente deve corresponder ao ID e origens web arbitrárias são recusadas. Os RPCs públicos recalculam o hash do segredo original, não aceitam hashes armazenados como credenciais. Código e token não são logados. Requests de desenvolvimento e referrers são suprimidos para reduzir exposição de callbacks; redigir Authorization/código em observabilidade externa também é necessário.

## Testes locais e seus limites

- `npm test`: regras, security guards, APIs com cliente Supabase real apontado para fixture HTTP e SQL PostgreSQL via PGlite; testes de RLS/grants, membership, expiração/reuso, FK entre organizações, revogação e worker com Chrome APIs simuladas.
- `npm run typecheck` e `npm run build`.
- `npm run test:e2e`: levanta fixture GoTrue/PostgREST local e banco PostgreSQL PGlite em memória, faz build Next separado `.next-e2e` e inicia na porta 3100. Playwright usa Chromium do sistema. Porta 54329 é a fixture; ambas precisam estar livres. Nenhum endpoint de teste existe no código de produção.
- Fluxos de navegador: cadastro → organização → código → HTTP de pareamento → heartbeat → status → revogação; recuperação → callback PKCE → senha nova → login; também rascunhos/320 px e DOM Facebook inteiramente interceptado.

**Distinção:** PGlite executa PostgreSQL e as migrations/policies reais. Auth, entrega de e-mails e PostgREST HTTP são doubles de teste escritos para estes cenários, não uma instância Supabase/GoTrue real. Chrome APIs do worker são simuladas, não comprovação do runtime MV3. SMTP, redirects/configuração do projeto, JWT assinado pelo Supabase real, instalação da extensão, alarmes no Chrome real e Facebook ainda exigem piloto.

O Chromium desta máquina bloqueia extensões unpacked por política administrativa; não contornamos esse bloqueio. Nenhuma publicação Facebook foi executada ou autorizada durante o desenvolvimento.

## Fontes oficiais consultadas nesta etapa (08/10/2026)

- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://developer.chrome.com/docs/extensions/develop/concepts/declare-permissions
- https://developer.chrome.com/docs/extensions/develop/concepts/network-requests
- SDK @supabase/auth-js instalado (callback PKCE/onAuthStateChange).
- Documentação oficial Next instalada: Route Handlers e Environment Variables.

A documentação externa passou a responder HTTP 200 nesta etapa. Isso não demonstra acesso ao projeto Supabase; a requisição ao hostname do projeto inicialmente recebeu bloqueio do proxy, e o hostname necessário foi salvo no draft sem credenciais.
