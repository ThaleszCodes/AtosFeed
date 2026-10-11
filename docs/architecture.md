> Atualização 11/10/2026: a fila autenticada, importação de grupos, reserva e resultados estão conectados; consulte [shared-queue.md](shared-queue.md). Seções abaixo registram as decisões iniciais e sua evolução.

# Arquitetura inicial

## Escopo e fontes

Projeto independente em `/workspace/AtosFeed`, sem arquivos ou dados do FacebookScheduler anterior. Roadmap e design system anexados foram copiados sem alterar a numeração. As regras operacionais vêm do pedido do usuário; preços, CTAs comerciais e identidade AtosWEB presentes na referência não são requisitos do SaaS. AtosFeed usa texto editorial para o nome, sem fingir que existe um logotipo oficial aprovado.

Next.js 16.4, React 19, TypeScript e Tailwind 4. Dependências reproduzíveis pelo package-lock; Node 24 na instância. Plus Jakarta Sans distribuída pelo pacote @fontsource, sem dependência de Google Fonts em runtime. Tokens escuros/violeta da referência, sidebar desktop e navegação inferior mobile. Sem indicadores fictícios.

## Componentes atuais

- `app/`: login/cadastro/reset, APIs de organizações/pareamento/dispositivos e editor com autosave/fila locais. Não envia ao Facebook. Imagens são escolhidas diretamente no laboratório da extensão para evitar expô-las em um bridge não autenticado.
- `extension/`: MV3 com `activeTab`, `scripting`, `storage`, `alarms`. Host opcional do painel escolhido e, durante sincronização iniciada pelo usuário, do Facebook; sem cookies, debugger, webRequest ou execução de publicações em background. Um clique na ação abre o laboratório em uma aba da extensão e mantém o alvo original. Injeções no mundo isolado e somente no Facebook. Navegação para outra origem revoga activeTab.
- `lib/queue.ts`: estados, validação de datas, organização obrigatória, claim condicionado a conexão e horário, recuperação conservadora. Não é um worker distribuído.
- `lib/supabase.ts`: cliente público opcional com PKCE; APIs verificam sessão com getUser. Sem service-role. Sem configuração real, não faz pedidos ao projeto.
- `supabase/migrations/`: proposta transacional própria no schema `atosfeed`, com RLS e roles owner/editor/viewer. Foreign key composta impede job referenciar um grupo de outra organização. Membros e organizações somente provisionáveis por operação confiável. Jobs não podem receber estados de sucesso do cliente. Não aplicar antes de inspeção do projeto real; não habilitamos schema na API nem alteramos tabelas existentes.

## Identidade, grupos e execução

Identificação positiva experimental baseada no controle de perfil visível, sem leitura de cookies ou identificação permanente da conta. Ausência de desafio não prova sessão; UI distingue sessão observável de não confirmada. Nenhum segredo de sessão é exportado. Grupos são deduplicados de links visíveis; não há scroll automático, paginação completa nem prova de autorização para postar.

O adapter reconhece controles pt-BR/en. Prepara texto e File via DataTransfer no editor. Envio exige grupo exato, texto igual ao autorizado, imagem observável, botão único disponível, checkbox e gesto explícito. Seletores e execCommand são experimentais e podem falhar em React/Facebook; nesse caso a operação falha fechada. Nenhuma tentativa de contornar desafios ou restrições.

Resultados: `sent` exige novo aviso de publicação; `awaiting_approval` exige novo aviso de moderação; `failed` exige falha pré-envio ou aviso explícito; `unknown` cobre ausência de confirmação, perda da aba ou interrupção após iniciar o envio. Um aviso não comprova distribuição, alcance nem permanência da publicação. Evidência antiga não é reutilizada.

A extensão grava hash SHA-256 do conteúdo, imagem e destino ANTES de enviar. Lock por origem da extensão serializa laboratórios concorrentes. Qualquer tentativa anterior com mesmo fingerprint é recusada, inclusive falha conhecida (limitação conservadora do piloto). Reabertura transforma executing em unknown. Não apagar o armazenamento para tentar novamente após um resultado incerto. Desinstalar/limpar dados remove a proteção local: esta não substitui idempotência persistida no servidor.

## Agendamento e desconexão

O laboratório `/lab` salva uma fila apenas no navegador. O painel autenticado usa a fila no servidor, integrada à extensão via RPCs limitados à organização. Datas são capturadas no fuso do dispositivo e armazenadas em UTC. Chrome fechado/offline não executa. Alarmes enviam apenas heartbeat; não há publicação automática nem recuperação automática de horários perdidos. A base de claim só inicia queued vencido com conexão presente. Executing interrompido vira unknown, nunca queued automaticamente.

Autenticação Supabase e pareamento com código descartável, membership, expiração e revogação estão implementados e testados localmente (ver auth-pairing.md). Claim transacional, identificador por tentativa e reconciliação de reserva vencida para unknown estão implementados; a execução depende da revisão e autorização explícita na extensão. Automação autônoma fica para uma entrega futura após piloto. Antes de retomadas atrasadas, usuário deve confirmar a nova janela. Não confiar em organizationId recebido do browser sem validar JWT/membership no servidor.

Vercel, PWA, Web Push e MCP autenticado permanecem na roadmap. Não instalamos service worker que poderia ocultar builds antigos nem simulamos push/MCP.

## Acessos e documentação oficial

Não há integração Supabase disponível nem variáveis SUPABASE/VERCEL/FACEBOOK presentes. Projeto solicitado: `mpxbbembbzxtwekwwrvw`. Não foi acessado ou modificado.

Consultada documentação oficial empacotada do Next em `node_modules/next/dist/docs/01-app/01-getting-started/01-installation.md`. Consultas HTTPS a Chrome, Supabase e Meta foram bloqueadas pelo proxy com HTTP 403 (inclusive após salvar adições no draft). Não alegamos ter consultado seu conteúdo atual. Fontes a revisar antes de piloto remoto:

- https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
- https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://developers.facebook.com/docs/graph-api/changelog/version19.0/

Não dependemos da Groups API da Meta nesta experiência DOM. Disponibilidade técnica no navegador não confirma permissão da plataforma para automação/distribuição. Revisar políticas atuais antes de ampliar o piloto.

## Runtime da extensão nesta máquina

Chromium gerenciado recusa carregar extensões unpacked por política administrativa, confirmado pelo protocolo CDP. Não contornamos essa política. Os testes DOM/Chromium validam o adapter em fixtures, não as permissões activeTab nem o worker MV3 real. Instalação manual precisa ser validada no Chrome do usuário.

## Evolução 3.4–3.6 / 4.2

Ver [auth-pairing.md](auth-pairing.md) para a arquitetura atual de conta, organizações, permissões, RPCs e heartbeat. A extensão agora também pede alarms e permissão opcional ao hostname escolhido pelo usuário; a descoberta solicita acesso temporário ao Facebook, removido ao encerrar quando concedido por ela. A documentação oficial externa citada nesta etapa respondeu HTTP 200; em 11/10 o endpoint Supabase responde 401 e as credenciais ainda estão ausentes. Dados remotos continuam intactos.
