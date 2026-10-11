# Progresso — AtosFeed

Atualizado em 11/10/2026. Numeração preservada de `roadmap.md`. **Implementado** descreve código existente; **testado** descreve execução local; **validado em uso real** exige evidência da plataforma. Sem marcação de conclusão do produto inteiro.

| Roadmap | Implementado | Testado | Validado em uso real | Bloqueado / pendente |
| --- | --- | --- | --- | --- |
| 1.1 Conexão com a conta do Facebook | Detecção experimental de controle de perfil + sessão não confirmada; sem cookies | Guards e fixture DOM em Chromium | Não | Identidade e sessão Facebook reais; sem OAuth Facebook |
| 1.2 Sincronização dos grupos | Leitura manual de links visíveis e deduplicação no laboratório | Exclusão de navegação/links externos; fixture Chromium | Não | Sincronização completa e permissões reais dos grupos |
| 1.3 Publicação de texto e imagem | Preparar editor, anexar File, verificar conteúdo/destino e enviar após autorização; estados sent/awaiting_approval/failed/unknown | Unitários + teste Chromium com requests Facebook inteiramente interceptados | Não; nenhuma publicação real realizada | Seletores Facebook, attachment e confirmação real |
| 1.4 Validação do agendamento | Fila compartilhada, horário UTC, reserva atômica e revisão manual; laboratório local separado | Horário futuro/inválido, offline, cancelamento, reload | Não | Execução autônoma ausente; Chrome/Facebook reais pendentes |
| 1.5 Tratamento de restrições e sessão expirada | Guards antes de operação e durante observação; parada e unknown após interrupção de envio | Fixtures sessão/desafio/restrição + recuperação | Não | Variações reais de interface/idioma |
| 2.3 Adaptação do design system Atos | Cores, Plus Jakarta Sans local e tokens; nome editorial, sem logo inventado | Build e inspeção visual de screenshots desktop/mobile | Não | Logo oficial não fornecido; escopo sem arte cósmica operacional |
| 2.5 Interfaces desktop e Android | Sidebar desktop, navegação mobile, editor/fila/conexão | E2E 1440/393/320 px, overflow e recuperação de erro | Não em aparelho físico | Revisão Android real, teclado virtual e zoom 200% |
| 3.1 Novo repositório | Usado checkout vazio AtosFeed já fornecido | Git e inspeção local | Sim: checkout existe | Commit inicial publicado em main em 09/10; sem deploy |
| 3.2 Configuração da stack | Next/TS/Tailwind, lockfile, fonte local | npm ci, build, typecheck | Desenvolvimento local | — |
| 3.3 Estrutura própria no Supabase | Três migrations aditivas, schema atosfeed e RPCs públicos com prefixo próprio | Três aplicadas em PostgreSQL PGlite local | Não no projeto remoto | Acesso ao projeto e revisão de compatibilidade |
| 3.4 Autenticação e recuperação de senha | Cadastro/login, PKCE, recovery e senha nova, gate e JWT verificado no servidor | E2E login/cadastro/recovery e HTTP auth simulado; servidor recusa JWT forjado | Não | Supabase GoTrue, SMTP, redirects e credenciais reais |
| 3.5 Organizações, membros e permissões | Criação transacional, gestão owner/editor/viewer, proteção do último owner e revogação por rebaixamento | RPC/grants PostgreSQL, APIs e E2E de criação/role viewer | Não no projeto remoto | Testar memberships no Supabase autorizado |
| 3.6 Isolamento dos dados | RLS, FK composta, RPCs membership-aware, fila compartilhada e drafts separados por usuário/organização | SELECT/INSERT/UPDATE/DELETE/grants/FK e acesso API entre organizações no PostgreSQL local | Não no projeto remoto | PostgREST/Supabase real; laboratório local continua separado |
| 3.7 Ambientes e variáveis de configuração | .env.example, chave pública/URL validadas, TLS e build E2E separado | Build, guards e fixture sem credenciais reais | Local somente | Configuração pública Supabase salva como requisito no draft |
| 4.1 Estrutura da extensão | MV3 v0.3, ZIP instalável pelo painel, opções e worker, activeTab/scripting/storage/alarms, host opcional por painel | Sintaxe JS, adapter e worker com APIs Chrome simuladas | Não no Chrome do usuário | Instalação real bloqueada por política administrativa neste ambiente |
| 4.2 Pareamento com o AtosFeed | Código 128 bits/5 min/uso único; token limitado 256 bits/30 dias; revogação, heartbeat e cleanup | RPC PostgreSQL, HTTP API, worker simulado e E2E painel→pareamento→heartbeat→revogação | Não | Supabase e Chrome reais |
| 4.3 Identificação da conta conectada | Observação de sessão sem identidade persistente | Fixture local | Não | Perfil real e identidade explícita |
| 4.4 Importação e atualização dos grupos | Leitura iniciada pelo usuário e importação autenticada de até 50 grupos numéricos por operação | Unitários/fixture | Não | Persistência implementada; importação completa/IDs de apelidos pendentes |
| 4.5 Execução das publicações | Envio experimental único após confirmação | Fixture de texto/imagem/approval | Não | Sessão e autorização para conteúdo/grupo reais |
| 4.6 Comunicação de status e erros | Heartbeat e resultado da tarefa no painel; outbox local de resultados sem reenvio da publicação | API, CORS, offline/expiração/revogação e E2E | Não | Resultados e runtime Chrome/Facebook reais |
| 4.7 Recuperação após interrupções | Hash local, reserva persistente por tarefa/dispositivo, outbox, executing vencido vira unknown | Regras conservadoras testadas | Não | Reconciliação implementada; fechamento durante envio real pendente |
| 7.8 Prevenção de publicações duplicadas | Fingerprint local e reserva atômica persistente por tarefa; sem retry automático | Estados terminais não reclamados | Não | Piloto de múltiplos dispositivos; fingerprint local pode ser perdido, mas reserva servidor permanece |
| 13.1 Testes das regras de negócio | Vitest | Validação de conteúdo/data/estados aprovada | Não | — |
| 13.2 Testes de isolamento entre organizações | Testes de grants/RLS/FK/RPC e API | Acessos entre organizações negados no PostgreSQL local e nas APIs | Não | Supabase real |
| 13.3 Testes de campanhas e agendamentos | Fila compartilhada e laboratório separado | Horário, offline, cancelamento, disputa de reserva e UTC testados | Não | Campanhas e execução real |
| 13.4 Testes da extensão | Adapter JSDOM/Chromium e worker com Chrome APIs simuladas | Texto/imagem/moderação, segredo redigido, heartbeat offline, revogação/expiry e comandos não confiáveis | Não | MV3 carregado manualmente no Chrome real |
| 13.5 Testes de interrupção e recuperação | Vitest | Executing vira unknown; estados terminais sem retry | Não | Fechamento de aba durante envio real |
| 13.6 Revisão mobile e acessibilidade | Labels, foco, skip link, controles de toque e estados | Reflow 320 px e preservação em erro | Não | Auditoria completa a11y/zoom/Android físico |
| 13.7 Piloto com conta e grupos reais | Protocolo documentado | Não executado | Não | Conta real + autorização explícita do conteúdo e grupo |

Demais itens da roadmap fora desta entrega. Não implementados: convites por e-mail, biblioteca de imagens compartilhada, execução autônoma, múltiplos destinos, campanhas reais, PWA/Web Push, MCP, comercial e deploy.

## Evidência da entrega anterior (08/10 — autenticação/pareamento)

- `npm test`: 55 testes aprovados em 6 arquivos. Inclui 10 testes de banco em PostgreSQL PGlite e 4 de API com HTTP Supabase simulado, além de 6 do worker com Chrome APIs simuladas.
- `npm run typecheck` e `npm run build`: aprovados; páginas de login/reset/lab e sete rotas API.
- `npm run test:e2e`: 12 aprovados em Chromium, projetos desktop/android (viewport), com auth/PostgREST HTTP simulado e PostgreSQL real local.
- E2E cobre: conta→organização→código de uso único→pareamento→heartbeat→status→revogação; recuperação PKCE→senha nova→login; APIs anônimas/origens não autorizadas; rascunhos e 320 px; DOM Facebook interceptado.
- Corrigidas durante os testes: preservação do rascunho após hidratação (entrega anterior) e manutenção da aba de conexão ao criar/trocar organização.
- Hashes não são aceitos como credenciais nos RPCs públicos: heartbeat/disconnect exigem o token original e calculam SHA-256 no PostgreSQL. Teste de tentativa com hash armazenado é negado.
- Consultadas nesta etapa as documentações oficiais Supabase (passwords/PKCE/RLS), Chrome (permissões) e Next instalado; páginas externas responderam HTTP 200. A documentação antes bloqueada tornou-se acessível, sem demonstrar acesso ao projeto.
- Hostname `mpxbbembbzxtwekwwrvw.supabase.co`: ainda bloqueado pelo proxy HTTP 403 após salvar a adição no draft. Chave pública e variáveis de acesso não presentes; nenhum acesso autenticado ao projeto.
- Smoke MV3 da etapa anterior: bloqueado por política administrativa (“Loading of unpacked extensions is disabled by the administrator.”). Não contornamos. Testes do worker simulados não substituem runtime Chrome.
- Nenhuma publicação Facebook, alteração do banco remoto, envio de e-mail real, deploy Vercel ou push ao GitHub.

## Configuração salva

`install_script`, `start_skill`, domínio específico Supabase e requisitos das duas variáveis públicas foram salvos no draft. Nenhum valor de credencial incluído. Salvar não aplica, executa ou publica o ambiente. Revisão/publicação permanecem no painel de configurações.

## Próxima etapa

Configurar acesso seguro ao projeto Supabase e inspecionar compatibilidade antes de aplicar migrations; validar login/SMTP/redirects e RLS no serviço real. Instalar extensão no Chrome do computador e verificar o pareamento e alarmes. Fila compartilhada e claim/idempotência persistentes agora estão implementados; validar esse fluxo em uso real, preservando unknown sem retry. Facebook real exige autorização explícita do conteúdo/grupo, conforme `validation.md`. Não ampliar para distribuição em massa até a etapa 1 ser validada.

## Entrega 11/10 — ZIP e fluxo painel/extensão conectado

- Implementado: botão **Baixar extensão (.ZIP)** em Conexão e página `/extension`, acessível também sem credenciais. Empacotamento determinístico automático em dev/build, checksum SHA-256 e instruções de instalação/atualização.
- Implementado: migration 003 aditiva, grupos observados por dispositivo, fila persistente owner/editor, leitura viewer, horários UTC, cancelamento apenas queued, criação idempotente mesmo após resposta perdida, reserva única vinculada a dispositivo/tentativa e resultado terminal protegido.
- Implementado: runner carrega tarefa, preserva texto/grupo remoto para revisão, anexa imagem local, exige autorização, reserva antes de clicar, envia resultado e guarda report não confirmado sem repetir publicação. Sessão/desafio/restrição continuam interrompendo o adapter.
- Testado: 63 testes Vitest em 8 arquivos; 14 E2E desktop/android. Novo E2E percorre ZIP→importação→painel→runner real numa página-fixture→texto/imagem→reserva→approval no painel. Testes SQL negam acesso entre organizações e confirmam que só uma reserva vence, que cancelled/future não são executáveis e que unknown nunca volta à fila.
- Validado em uso real: nenhum fluxo Facebook/Supabase. Nenhuma publicação real. E2E usa auth/PostgREST/Chrome APIs simulados e DOM Facebook interceptado; PGlite executa o SQL real.
- Bloqueado: variáveis Supabase ausentes, sem credencial administrativa para inspecionar/aplicar migrations; Chrome gerenciado bloqueia carregar MV3. Em 11/10 a rede do projeto responde HTTP 401, substituindo o bloqueio HTTP 403 observado em 08/10.
- Limites: imagem selecionada no computador, sem biblioteca Supabase compartilhada; nenhum envio automático por alarme; somente grupos numéricos visíveis, sem sincronização completa; lista do painel mostra 100 tarefas mais recentes, extensão até 50 vencidas.
- Build/typecheck: aprovados, 20 rotas. Smoke do download em produção aprovado em desktop e mobile; screenshots da instalação em `docs/screenshots/extension-*.png`.
- Guia: [shared-queue.md](shared-queue.md).
