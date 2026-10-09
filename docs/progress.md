# Progresso — AtosFeed

Data: 08/10/2026. Numeração preservada de `roadmap.md`. **Implementado** descreve código existente; **testado** descreve execução local; **validado em uso real** exige evidência da plataforma. Sem marcação de conclusão do produto inteiro.

| Roadmap | Implementado | Testado | Validado em uso real | Bloqueado / pendente |
| --- | --- | --- | --- | --- |
| 1.1 Conexão com a conta do Facebook | Detecção experimental de controle de perfil + sessão não confirmada; sem cookies | Guards e fixture DOM em Chromium | Não | Identidade e sessão Facebook reais; sem OAuth Facebook |
| 1.2 Sincronização dos grupos | Leitura manual de links visíveis e deduplicação no laboratório | Exclusão de navegação/links externos; fixture Chromium | Não | Sincronização completa e permissões reais dos grupos |
| 1.3 Publicação de texto e imagem | Preparar editor, anexar File, verificar conteúdo/destino e enviar após autorização; estados sent/awaiting_approval/failed/unknown | Unitários + teste Chromium com requests Facebook inteiramente interceptados | Não; nenhuma publicação real realizada | Seletores Facebook, attachment e confirmação real |
| 1.4 Validação do agendamento | Base de estados/claim UTC e fila local; aviso de computador desconectado | Horário futuro/inválido, offline, cancelamento, reload | Não | Worker e execução real ainda não conectados |
| 1.5 Tratamento de restrições e sessão expirada | Guards antes de operação e durante observação; parada e unknown após interrupção de envio | Fixtures sessão/desafio/restrição + recuperação | Não | Variações reais de interface/idioma |
| 2.3 Adaptação do design system Atos | Cores, Plus Jakarta Sans local e tokens; nome editorial, sem logo inventado | Build e inspeção visual de screenshots desktop/mobile | Não | Logo oficial não fornecido; escopo sem arte cósmica operacional |
| 2.5 Interfaces desktop e Android | Sidebar desktop, navegação mobile, editor/fila/conexão | E2E 1440/393/320 px, overflow e recuperação de erro | Não em aparelho físico | Revisão Android real, teclado virtual e zoom 200% |
| 3.1 Novo repositório | Usado checkout vazio AtosFeed já fornecido | Git e inspeção local | Sim: checkout existe | Sem commit/push/deploy efetuado |
| 3.2 Configuração da stack | Next/TS/Tailwind, lockfile, fonte local | npm ci, build, typecheck | Desenvolvimento local | — |
| 3.3 Estrutura própria no Supabase | Duas migrations aditivas, schema atosfeed e RPCs públicos com prefixo próprio | Ambas aplicadas em PostgreSQL PGlite local | Não no projeto remoto | Acesso ao projeto e revisão de compatibilidade |
| 3.4 Autenticação e recuperação de senha | Cadastro/login, PKCE, recovery e senha nova, gate e JWT verificado no servidor | E2E login/cadastro/recovery e HTTP auth simulado; servidor recusa JWT forjado | Não | Supabase GoTrue, SMTP, redirects e credenciais reais |
| 3.5 Organizações, membros e permissões | Criação transacional, gestão owner/editor/viewer, proteção do último owner e revogação por rebaixamento | RPC/grants PostgreSQL, APIs e E2E de criação/role viewer | Não no projeto remoto | Testar memberships no Supabase autorizado |
| 3.6 Isolamento dos dados | RLS, FK composta, RPCs membership-aware e drafts separados por usuário/organização | SELECT/INSERT/UPDATE/DELETE/grants/FK e acesso API entre organizações no PostgreSQL local | Não no projeto remoto | PostgREST/Supabase real; laboratório não é fila compartilhada |
| 3.7 Ambientes e variáveis de configuração | .env.example, chave pública/URL validadas, TLS e build E2E separado | Build, guards e fixture sem credenciais reais | Local somente | Configuração pública Supabase salva como requisito no draft |
| 4.1 Estrutura da extensão | MV3 v0.2, opções e worker, activeTab/scripting/storage/alarms, host opcional por painel | Sintaxe JS, adapter e worker com APIs Chrome simuladas | Não no Chrome do usuário | Instalação real bloqueada por política administrativa neste ambiente |
| 4.2 Pareamento com o AtosFeed | Código 128 bits/5 min/uso único; token limitado 256 bits/30 dias; revogação, heartbeat e cleanup | RPC PostgreSQL, HTTP API, worker simulado e E2E painel→pareamento→heartbeat→revogação | Não | Supabase e Chrome reais |
| 4.3 Identificação da conta conectada | Observação de sessão sem identidade persistente | Fixture local | Não | Perfil real e identidade explícita |
| 4.4 Importação e atualização dos grupos | Leitura iniciada pelo usuário no laboratório | Unitários/fixture | Não | Persistência servidor e importação completa |
| 4.5 Execução das publicações | Envio experimental único após confirmação | Fixture de texto/imagem/approval | Não | Sessão e autorização para conteúdo/grupo reais |
| 4.6 Comunicação de status e erros | Mensagens de publicação locais; heartbeat autenticado e status do computador no painel | API, CORS, offline/expiração/revogação e E2E | Não | Transmissão dos resultados Facebook e runtime Chrome real |
| 4.7 Recuperação após interrupções | Hash por conteúdo/grupo, lock entre abas, registro antes do clique; executing vira unknown | Regras conservadoras testadas | Não | Reconciliação servidor e teste de fechamento real |
| 7.8 Prevenção de publicações duplicadas | Proteção local por fingerprint; sem retry automático | Estados terminais não reclamados | Não | Idempotência persistente entre dispositivos; clearing local perde proteção |
| 13.1 Testes das regras de negócio | Vitest | Validação de conteúdo/data/estados aprovada | Não | — |
| 13.2 Testes de isolamento entre organizações | Testes de grants/RLS/FK/RPC e API | Acessos entre organizações negados no PostgreSQL local e nas APIs | Não | Supabase real |
| 13.3 Testes de campanhas e agendamentos | Base da fila local | Horário, offline, cancelamento e UTC testados | Não | Campanhas e execução real |
| 13.4 Testes da extensão | Adapter JSDOM/Chromium e worker com Chrome APIs simuladas | Texto/imagem/moderação, segredo redigido, heartbeat offline, revogação/expiry e comandos não confiáveis | Não | MV3 carregado manualmente no Chrome real |
| 13.5 Testes de interrupção e recuperação | Vitest | Executing vira unknown; estados terminais sem retry | Não | Fechamento de aba durante envio real |
| 13.6 Revisão mobile e acessibilidade | Labels, foco, skip link, controles de toque e estados | Reflow 320 px e preservação em erro | Não | Auditoria completa a11y/zoom/Android físico |
| 13.7 Piloto com conta e grupos reais | Protocolo documentado | Não executado | Não | Conta real + autorização explícita do conteúdo e grupo |

Demais itens da roadmap fora desta entrega. Não implementados: convites por e-mail, biblioteca compartilhada, executor/fila distribuída, múltiplos destinos, campanhas reais, PWA/Web Push, MCP, comercial e deploy.

## Evidência atual (entrega de autenticação/pareamento)

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

Configurar acesso seguro ao projeto Supabase e inspecionar compatibilidade antes de aplicar migrations; validar login/SMTP/redirects e RLS no serviço real. Instalar extensão no Chrome do computador e verificar o pareamento e alarmes. Em seguida, conectar fila ao executor com claim/idempotência persistentes, preservando unknown sem retry. Facebook real exige autorização explícita do conteúdo/grupo, conforme `validation.md`. Não ampliar para distribuição em massa até a etapa 1 ser validada.
