# AtosFeed

SaaS independente em desenvolvimento. Laboratório Facebook das etapas **1/4** e implementação de **3.4–3.6 / 4.2**: autenticação, organizações, permissões, pareamento e heartbeat. Integrações remotas ainda não validadas.

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

## Extensão 0.2

Carregue `extension/` sem compactação no Chrome 120+ do seu computador. Nas opções, informe o painel e o código descartável criado em **Conexão**. A extensão pede acesso opcional somente ao domínio escolhido. O heartbeat indica computador conectado, sem comprovar sessão Facebook. A credencial não autoriza publicação nem execução automática da fila.

O Chromium desta máquina bloqueia extensões por política administrativa. Código e adapter foram testados localmente, mas runtime MV3, Supabase remoto e Facebook ainda exigem piloto. Nenhuma publicação real realizada.

- [Auth, organizações, pareamento e limites dos testes](docs/auth-pairing.md)
- [Extensão Facebook e protocolo de validação](docs/validation.md)
- [Arquitetura e decisões](docs/architecture.md)
- [Progresso por numeração da roadmap](docs/progress.md)
- [Roadmap original](docs/roadmap.md)
- [Design system original](docs/design-system.md)
