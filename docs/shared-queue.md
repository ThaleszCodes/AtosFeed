# Extensão instalável e fila compartilhada — 11/10/2026

## Instalar e conectar

1. Execute `npm ci` e `npm run dev` (Node 24). O hook prepara automaticamente o ZIP em `public/downloads/atosfeed-extension.zip`. `npm run extension:package` gera o pacote sem iniciar o painel; `npm run build` também o gera para hospedagem.
2. No painel, **Instalar extensão** abre `/extension`. **Baixar extensão (.ZIP)** também aparece em **Conexão**, inclusive sem conta/configuração. Descompacte o arquivo e carregue a pasta `atosfeed-extension` em `chrome://extensions` com Modo do desenvolvedor. Não arraste o ZIP para tentar instalar. Chrome 120+ em computador; Chrome Android não executa esta extensão.
3. Atualize sempre a mesma pasta instalada e use Recarregar. Alterar a pasta pode alterar o ID da extensão e exigir novo pareamento. O ZIP não inclui dependências, `.env`, tokens ou dados de usuários; contém somente o código de `extension/`. O arquivo SHA-256 acompanha o download em `/downloads/atosfeed-extension.sha256`.
4. Configure o Supabase conforme `auth-pairing.md`, entre, crie a organização e pareie nas opções da extensão usando o código descartável. Conceda acesso opcional somente ao domínio do painel.

## Fluxo disponível no código

- No computador, abra o Facebook e clique no ícone AtosFeed. A permissão `activeTab` autoriza somente a aba invocada. Use **Identificar sessão e ler grupos** e **Importar grupos para o painel**. Até 50 grupos numéricos observados por importação; não é descoberta completa nem comprovação de permissão para publicar. Links com apelidos não são convertidos em IDs: abra o endereço numérico do grupo para importá-lo. Não coletamos cookies, senhas ou tokens Facebook.
- No painel (inclusive Android), atualize os grupos, selecione um, escreva até 4.000 caracteres e salve para revisão. Horário em branco disponibiliza agora; uma data futura só disponibiliza a tarefa a partir daquele momento. Texto e horário são persistidos na organização, não apenas no navegador. Rascunhos permanecem locais e separados por usuário/organização.
- Na extensão, **Carregar fila disponível**, selecione e **Usar publicação selecionada**. Abra o grupo na aba original, selecione imagem opcional de até 5 MB e prepare. A imagem é anexada localmente no computador, não enviada à biblioteca Supabase nesta entrega. O painel comunica essa limitação.
- Confira texto, imagem e grupo no Facebook e marque a autorização. O servidor reserva a tarefa antes do clique em Publicar. Falta de confirmação da reserva impede o clique. O adapter interrompe por sessão expirada, desafio ou restrição; não contorna verificações.
- O resultado volta para **Publicações** no painel. Enviada e aguardando aprovação dependem de evidência explícita na página. Sem confirmação, o resultado é desconhecido. Seletores desconhecidos falham com o formulário preservado. Não existe retry de publicação.

## Segurança, fila e conectividade

A migration `202610110003_shared_queue.sql` é aditiva, restrita ao namespace AtosFeed e RPCs com prefixo próprio. Aplique **depois** das duas anteriores, somente após inspecionar o projeto autorizado. Nenhuma migration foi aplicada remotamente neste desenvolvimento.

Usuários autenticados consultam apenas a organização da qual são membros. Owner/editor criam/cancelam; viewer consulta. Dispositivo autenticado pelo token original e ID da extensão só importa grupos, consulta tarefas vencidas, reserva e reporta na organização do pareamento. Revogação/expiração/rebaixamento são verificados a cada RPC. O hash armazenado não é credencial. As funções internas não têm EXECUTE público.

Reserva é um UPDATE condicional de queued para executing, com dispositivo e attempt UUID. Duas reservas não podem ganhar a mesma tarefa. Cancelar só funciona enquanto queued. Resultados terminais não podem ser sobrescritos ou voltar à fila. Um report repetido do mesmo resultado é idempotente, sem executar novamente. A resposta de criação perdida reutiliza o mesmo identificador e payload preservados no rascunho, inclusive após reload; não cria uma segunda tarefa.

Navegador fechado/desconectado: tarefas queued permanecem no banco. O horário não promete envio pontual e não existe execução autônoma por alarmes; o usuário carrega/revisa no computador ativo. Reservas sem desfecho por 10 minutos viram unknown na próxima consulta da fila. Não há cron instalado. A extensão preserva resultados não confirmados em uma outbox local e tenta apenas reenviar o **resultado** ao carregar a fila novamente; nunca reenviar a publicação. Fechar a extensão antes de persistir o resultado mantém a reserva e termina em unknown. Limpar armazenamento/reinstalar pode perder a outbox, mas a reserva do servidor continua bloqueando duplicação da tarefa.

## Evidência e limites

Testes SQL usam PostgreSQL PGlite real, mas auth/PostgREST e APIs Chrome são simuladas. O novo E2E executa os módulos reais do runner e adapter numa página-fixture, com Facebook totalmente interceptado, incluindo texto/imagem, autorização, reserva e aprovação retornada ao painel. Não carrega MV3 real e não publica no Facebook.

O endpoint do projeto Supabase responde HTTP 401 (rede disponível); não há URL/chave pública injetadas nem credencial administrativa para inspecionar/aplicar migrations. Não houve validação Supabase real. O Chrome deste ambiente bloqueia carregar extensões por política administrativa; não tentamos contornar. Runtime MV3, Facebook real, SMTP e Android físico ainda exigem piloto.

Próximo passo: configurar as duas variáveis públicas nas configurações seguras do ambiente, obter acesso autorizado de inspeção do banco e validar migrations/piloto no Chrome do usuário. Nunca envie segredos de administração ou sessão Facebook no chat. Publicação real continua exigindo autorização explícita do conteúdo e do grupo.
