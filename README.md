# AtosFeed

SaaS independente em desenvolvimento. Laboratório Facebook das etapas **1/4** e implementação de **3.4–3.6 / 4.2**: autenticação, organizações, permissões, pareamento, importação de grupos, fila compartilhada e resultados de envios revisados na extensão. Integrações remotas ainda não validadas.

## Executar

Node 24. Sem credenciais, o laboratório `/lab` funciona e `/login` explica a configuração ausente.

```sh
npm ci
npm run dev
```

Conta real: configure `.env.local` a partir de `.env.example`, use somente a URL HTTPS e publishable/anon key Supabase, e siga [a configuração de auth e migrations](docs/auth-pairing.md). Nunca use service-role em NEXT_PUBLIC. Nenhuma migration foi aplicada ao projeto remoto.

## Verificar

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
```

E2E inicia fixture HTTP de autenticação/PostgREST, PostgreSQL PGlite real em memória e build isolado `.next-e2e` (portas 54329/3100). Usa `/usr/bin/chromium` ou `CHROMIUM_PATH`. Não é uma instância Supabase real; Facebook é inteiramente interceptado. Não publique/deploy `.next-e2e`.

## Extensão 0.4 — baixar e instalar

No painel, abra **Instalar extensão** ou **Conexão** e clique em **Baixar extensão (.ZIP)**. Descompacte e carregue a pasta `atosfeed-extension` em `chrome://extensions` no Chrome 120+ do computador. Para desenvolvimento, também é possível carregar `extension/` diretamente. O pacote é gerado automaticamente por `npm run dev` e `npm run build`, ou com `npm run extension:package`. Nas opções, informe o painel e o código descartável criado em **Conexão**. O pareamento pede acesso opcional ao domínio escolhido; a sincronização solicita separadamente acesso de leitura ao Facebook e o libera ao terminar. O heartbeat indica computador conectado, sem comprovar sessão Facebook. Clique em **Sincronizar meus grupos** para percorrer automaticamente a lista do Facebook e importar ao painel; depois crie a tarefa no painel e carregue-a na extensão. O envio exige conferir texto/imagem/grupo e autorizar uma vez. A fila não executa automaticamente.

O Chromium desta máquina bloqueia extensões por política administrativa. Código e adapter foram testados localmente, mas runtime MV3, Supabase remoto e Facebook ainda exigem piloto. Nenhuma publicação real realizada.

- [Download, instalação e fila compartilhada](docs/shared-queue.md)
- [Auth, organizações, pareamento e limites dos testes](docs/auth-pairing.md)
- [Extensão Facebook e protocolo de validação](docs/validation.md)
- [Arquitetura e decisões](docs/architecture.md)
- [Progresso por numeração da roadmap](docs/progress.md)
- [Roadmap original](docs/roadmap.md)
- [Design system original](docs/design-system.md)
