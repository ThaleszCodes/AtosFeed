---
title: "AtosWEB — Design System"
version: "1.0.0"
status: "Base normativa consolidada"
updated: "2026-10-07"
language: "pt-BR"
owner: "Thales Kaleby"
reference: "https://atosweb.vercel.app/"
---

# AtosWEB — Design System

> **Design bonito não basta. Ele precisa gerar ATOS.**
>
> Um sistema para criar presença, comunicar com clareza e conduzir à ação, preservando a identidade autoral da AtosWEB.

## 1. Escopo e fonte de verdade

Este documento define identidade, fundamentos visuais, tokens, componentes, composição, responsividade, acessibilidade, movimento e governança da AtosWEB. Serve a designers, desenvolvedores e agentes de IA que criem páginas, interfaces e materiais da marca.

A base é a landing page publicada em [atosweb.vercel.app](https://atosweb.vercel.app/), inspecionada em 7 de outubro de 2026, por seu HTML, CSS, JavaScript e assets de hero e logotipo, junto das decisões anteriores sobre AtosWEB e LPVCW. Não é uma auditoria completa da experiência publicada.

**Como interpretar as especificações:**

| Origem | Significado |
| --- | --- |
| Extraído da LP | Valor, asset, conteúdo ou comportamento encontrado nos arquivos públicos da página |
| Consolidado | Regra formalizada neste documento a partir da identidade e das preferências já definidas |
| Extensão | Contrato proposto para um uso ainda não presente na LP, como formulário ou interface operacional |

As tabelas identificam essas origens quando necessário. A existência de uma regra aqui não significa que a LP já a implemente.

**Ordem de prioridade:** requisito explícito do projeto → identidade aprovada → regra normativa deste documento → composição apropriada à tarefa. Em migrações, preservar visuais aprovados e corrigir problemas pontuais; não substituir a identidade inteira para aplicar uma convenção.

Preço, prazo, hospedagem e canais de atendimento são conteúdo comercial editável. Nunca transformá-los em tokens visuais ou em promessas permanentes.

## 2. Essência da marca

### 2.1 Posicionamento

A AtosWEB cria landing pages sob medida que unem design de impacto, clareza comercial e orientação à ação. Sua presença deve transmitir capacidade criativa, proximidade e execução.

| Dimensão | Direção |
| --- | --- |
| Promessa central | Transformar ideias em páginas que orientam ações |
| Personalidade | Autoral, direta, estratégica, criativa e segura |
| Percepção desejada | Design profissional acessível, com cuidado e intenção |
| Linguagem | Português natural, cordial e objetivo |
| Assinatura | IDEIAS EM ATOS |
| Frase proprietária | Bonito não basta. Precisa gerar Atos. |

“Foco em conversão” descreve uma intenção de projeto. Não autoriza garantir vendas, inventar resultados ou atribuir impacto comercial a um projeto sem dados.

### 2.2 Invariantes

1. Base escura com profundidade violeta.
2. Tipografia forte e hierarquia reconhecível.
3. Palavra **ATOS** como ponto de contraste.
4. Universo visual de eclipse, órbita e forma monumental.
5. Espaço negativo preservado.
6. Ação principal identificável.
7. Conteúdo real e estrutura simples.
8. Continuidade entre dobras.

A marca deve sobreviver sem efeitos: ao desativar animações e brilho, texto, proporção, cor e composição ainda precisam sustentá-la.

### 2.3 O que pode variar

Alinhamento, enquadramento do asset, número de colunas, intensidade atmosférica, presença de fotografia, densidade e superfície podem variar conforme o conteúdo. Não repetir a mesma composição para funções diferentes.

## 3. Princípios de design

### Clareza antes de ornamentação

Todo elemento deve apoiar mensagem, navegação, compreensão, confiança ou ação. Espaço disponível não é motivo para acrescentar conteúdo.

### Um protagonista por zona

O hero possui uma headline principal e um gesto visual dominante. Dentro de uma seção, título, imagem e CTA têm prioridades diferentes. Não dar peso máximo a todos.

### Respiro faz parte da identidade

Espaço negativo organiza, cria contraste e sustenta a percepção de cuidado. Não reduzir margens para acomodar badges, microtextos ou ornamentos opcionais.

### Personalidade com controle

O universo cósmico pertence à marca. Seu papel é criar atmosfera e reconhecimento; a leitura e a ação continuam no primeiro plano.

### Sistema consistente, layouts diferentes

Compartilhar tokens e componentes. Variar a composição entre posicionamento, portfólio, processo, oferta e FAQ.

### Mobile é uma composição própria

Reavaliar ordem, crop, quebras de título, largura de botão, navegação e continuidade. Não reduzir proporcionalmente uma tela desktop.

### Menos superfícies, melhores relações

Usar alinhamento, espaço e tipografia antes de adicionar cards. Portfólio e investimento podem exigir unidades visuais próprias; um parágrafo institucional geralmente não exige.

## 4. Marca, logotipo e assinatura

### 4.1 Asset observado

A LP usa `assets/logo_hd.png`, com dimensões declaradas de **732 × 152 px**. No cabeçalho desktop, sua altura CSS é **32 px**. O arquivo mantém a composição gráfica original do wordmark; não reconstruir o logotipo digitando o nome com uma fonte parecida.

O hero usa uma forma monumental associada ao “A”, eclipse e órbita violeta. Essa forma é um elemento de direção de arte; não é evidência de um isotipo vetorial oficial separado.

### 4.2 Regras consolidadas

- Usar o arquivo original com proporção preservada.
- Sobre fundo escuro, manter a versão de alto contraste da marca.
- Não aplicar sombras adicionais, deformação, contornos ou novos gradientes ao wordmark.
- Não cortar partes do logotipo para fabricar um isotipo.
- Para versão clara ou monocromática, preparar um asset próprio aprovado.
- Área de proteção mínima: **0,5 × a altura visual do wordmark**, em todos os lados.
- Piso proposto para aplicação digital: **120 px de largura**, verificando leitura no tamanho final.
- Assinatura “IDEIAS EM ATOS” é opcional; não repetir em todas as seções.

### 4.3 Escrita

Usar **AtosWEB** em texto editorial deste sistema e **ATOSWEB** em aplicações institucionais em caixa alta. O desenho do arquivo de marca preserva sua grafia visual própria. Evitar variações aleatórias dentro da mesma interface.

## 5. Direção de arte

### 5.1 Universo proprietário

O background atual do hero, `assets/herobg.png`, tem dimensões declaradas de **1672 × 941 px**. Sua composição combina:

- fundo quase preto;
- forma monumental escura;
- eclipse luminoso;
- órbita elíptica violeta;
- névoa e iluminação controladas;
- área escura ampla abaixo do foco visual para receber o conteúdo.

O gesto de órbita transmite movimento e ação. A escala monumental dá presença. A região escura permite leitura. Preservar essas funções ao editar ou recortar.

### 5.2 Camadas

| Camada | Conteúdo | Regra |
| --- | --- | --- |
| Base | Cor do canvas | Sempre presente, inclusive se o asset falhar |
| Atmosfera | Background visual | Decorativo, sem capturar interação |
| Transição | Máscara/gradiente da dobra | Suaviza a passagem entre fundos |
| Conteúdo | Títulos, parágrafos, CTAs | HTML real, selecionável e acessível |
| Sobreposição | Navegação, menu, modal | Contraste e prioridade de interação |

A imagem de fundo não deve conter texto, botões, navbar ou conteúdo funcional rasterizado. Mockup com interface só entra quando sua função é apresentar um projeto, e não substituir controles reais.

### 5.3 Limites expressivos

- Concentrar luz no elemento visual dominante.
- Reservar gradiente de texto a palavras-chave grandes, especialmente ATOS.
- Evitar luz brilhante atrás de texto corrido.
- Não acrescentar partículas, estrelas densas, gráficos aleatórios, cards flutuantes ou mockups sem função.
- Não replicar o eclipse em todas as seções.
- Evitar “neon em tudo”: controles precisam de contraste e estados próprios.
- A atmosfera deve manter unidade de iluminação, profundidade e temperatura cromática.

### 5.4 Portfólio

Preferir screenshots reais em escala útil, crops grandes e detalhes do projeto. Perspectiva sutil é aceitável quando melhora a apresentação. Não substituir evidência real por notebook genérico ou tela fictícia.

Distinguir **projeto publicado**, **concept** e **exploração visual**. Um concept não deve sugerir cliente contratado ou resultado comprovado.

## 6. Sistema de cores

### 6.1 Primitivos extraídos da LP

| Token atual | Valor | Uso encontrado |
| --- | --- | --- |
| `--bg-black` | `#030206` | Canvas principal |
| `--bg-deep` | `#05040A` | Base profunda |
| `--purple-primary` | `#8537F5` | Marca e seleção |
| `--purple-neon` | `#A855F7` | Acento luminoso |
| `--purple-light` | `#C084FC` | Acento claro |
| `--purple-dark` | `#6D28D9` | Acento profundo |
| `--purple-border` | `#8B5CF6` | Bordas de destaque |
| `--text-white` | `#FFFFFF` | Texto principal |
| `--text-gray` | `#94A3B8` | Texto de apoio |
| `--text-eyebrow` | `#CBD5E1` | Eyebrows |
| `--border-outline` | `rgba(255,255,255,.16)` | Borda secundária |
| `--border-outline-hover` | `rgba(255,255,255,.36)` | Hover secundário |

### 6.2 Gradientes extraídos

```css
--btn-purple-gradient:
  linear-gradient(90deg, #6b21de 0%, #7e2ce7 45%, #9b51e0 100%);

--atos-text-gradient:
  linear-gradient(135deg, #c084fc 0%, #a855f7 45%, #9333ea 100%);
```

O primeiro distingue a ação principal. O segundo dá tratamento proprietário à palavra ATOS. Não aplicar automaticamente a toda headline, ícone, card ou link.

### 6.3 Papéis semânticos consolidados

Componentes novos devem consumir nomes semânticos. Os primitivos originais permanecem disponíveis para compatibilidade.

| Papel | Valor | Origem |
| --- | --- | --- |
| `color-bg-canvas` | `#030206` | Alias da LP |
| `color-bg-deep` | `#05040A` | Alias da LP |
| `color-bg-surface` | `#0C0A14` | Base opaca derivada do painel do portfólio |
| `color-bg-raised` | `#140E27` | Base opaca derivada do painel de oferta |
| `color-text-primary` | `#FFFFFF` | Alias da LP |
| `color-text-secondary` | `#94A3B8` | Alias da LP |
| `color-text-label` | `#CBD5E1` | Alias da LP |
| `color-text-accent` | `#C084FC` | Alias da LP |
| `color-action-primary` | `#8537F5` | Alias da LP |
| `color-action-primary-hover` | `#6D28D9` | Consolidado |
| `color-focus` | `#C084FC` | Consolidado |
| `color-border-subtle` | Branco a 16% | Alias da LP; separação decorativa |
| `color-border-control` | `#736980` | Extensão para campos/controles |
| `color-success` | `#6EE7B7` | Extensão |
| `color-warning` | `#FCD34D` | Extensão |
| `color-danger` | `#FDA4AF` | Extensão |
| `color-info` | `#93C5FD` | Extensão |

As cores semânticas entram apenas para comunicar estados reais. Não usar verde, amarelo ou vermelho como ornamentação ou categorias arbitrárias.

### 6.4 Contraste medido

Valores calculados por luminância relativa das cores sólidas; não incluem opacidade, glow, imagem, antialiasing ou filtros.

| Texto | Fundo | Relação aproximada |
| --- | --- | --- |
| Branco | `#030206` | 20,69:1 |
| `#94A3B8` | `#030206` | 8,07:1 |
| `#CBD5E1` | `#030206` | 13,93:1 |
| `#C084FC` | `#030206` | 7,83:1 |
| `#A855F7` | `#030206` | 5,23:1 |
| `#9333EA` | `#030206` | 3,84:1 |
| Branco | `#8537F5` | 5,44:1 |
| Branco | `#6B21DE` | 7,25:1 |
| Branco | `#7E2CE7` | 6,17:1 |
| Branco | `#9B51E0` | 4,52:1 |

**Aplicação:** o extremo escuro do gradiente ATOS não atende a 4,5:1 para texto pequeno sobre o canvas; reservá-lo a texto grande ou usar `color-text-accent`. O extremo claro do botão tem margem estreita para texto normal; não reduzir opacidade nem acrescentar brilho que clareie o fundo sem medir novamente.

Bordas sutis de 16% não devem ser a única indicação de um controle. Campos precisam de limite identificável. Medir transparências sobre o fundo efetivamente composto.

## 7. Tipografia

### 7.1 Família efetivamente aplicada na LP

O HTML importa **Plus Jakarta Sans** e **Outfit**. Porém, o CSS define tanto `--font-main` quanto `--font-heading` como **Plus Jakarta Sans**. Não foi encontrada aplicação de Outfit nos arquivos examinados.

**Decisão normativa:** preservar **Plus Jakarta Sans** para títulos e corpo. Outfit é uma importação presente, não uma segunda família oficial deste sistema. Sua futura adoção exige decisão explícita.

```css
--font-body: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: var(--font-body);
```

### 7.2 Pesos

| Papel | Peso |
| --- | --- |
| Hero e frase proprietária | 800 |
| Título de seção | 700–800 |
| Título de item | 600–700 |
| CTA e label | 600 |
| Navegação | 500 |
| Corpo | 400 |

Usar contraste real entre títulos e corpo. Não tornar todo texto semibold para “parecer premium”.

### 7.3 Escala

| Papel | LP observada | Padrão consolidado |
| --- | --- | --- |
| Hero desktop | `clamp(2.35rem,4.3vw,4.25rem)` | Preservar: cerca de 38–68 px |
| Hero mobile | Override `clamp(1.95rem,8.2vw,2.55rem)`, com ajustes menores adicionais | Cerca de 31–41 px; exceções em telas pequenas |
| Título de seção | Faixas diferentes conforme seção, chegando a 4,4 rem | 36–70 px desktop; 32–48 px mobile conforme comprimento |
| Título de projeto | 1,35 rem no portfólio | 20–24 px |
| Corpo/apoio | Em geral 1–1,125 rem | 16–18 px |
| Navegação/CTA | Cerca de 0,95–1,025 rem | 15–16,5 px |
| Eyebrow | 0,8125 rem nas aberturas principais | 12–13 px |
| Metadado | Varia; alguns blocos usam tamanhos menores | 12–14 px quando relevante à decisão |

O site contém microtextos menores. Eles são características observadas, não um piso recomendado. Informações comerciais, ajuda e erros precisam ser legíveis; não usar microtexto para acomodar excesso.

### 7.4 Ritmo e quebras

- Hero: line-height observado **1,14**, tracking **−0,028em**.
- Títulos novos: line-height **1,08–1,18**, conforme comprimento.
- Corpo: line-height **1,5–1,65**.
- Eyebrow: caixa alta, tracking **0,14–0,16em**; uma frase curta.
- Parágrafos explicativos: largura preferencial **45–65 caracteres**.
- Não forçar quebras desktop que criem linhas isoladas no mobile.
- Evitar serif italic, outline, terceira família ou letras espaçadas em parágrafos.
- A palavra ATOS pode receber acento próprio; não destacar todas as palavras da promessa.

## 8. Espaçamento, grid e densidade

### 8.1 Escala consolidada

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-28: 112px;
```

Usar a escala como base; ajustes ópticos locais são permitidos quando documentados. Não converter cada valor isolado da LP em um token exclusivo.

| Relação | Faixa sugerida |
| --- | --- |
| Ícone e label | 8–12 px |
| Eyebrow e título | 16–24 px |
| Título e descrição | 16–24 px |
| Descrição e ações | 24–40 px |
| Itens relacionados | 16–24 px |
| Colunas principais | 40–80 px |
| Seções desktop | 80–112 px de padding vertical |
| Seções mobile | 60–80 px de padding vertical |

### 8.2 Larguras observadas

| Zona | Largura máxima na LP |
| --- | --- |
| Cabeçalho | 1480 px |
| Conteúdo do hero | 1200 px |
| Texto interno do hero | 960 px |
| Posicionamento/portfólio | 1440 px |
| Oferta | 1400 px |
| Rodapé | 1320 px |

Não padronizar todas as zonas em uma única largura se isso destruir a composição. Nas extensões, usar **1440 px** como container amplo e **1200 px** como container de leitura/apresentação.

### 8.3 Margens laterais

A LP usa **48 px** em várias seções desktop, **32 px** em adaptações e **16–24 px** em mobile.

Padrão consolidado: **48 px desktop**, **32 px tablet amplo**, **20 px mobile**. Usar **16 px** como exceção para telas pequenas ou conteúdo que justifique maior área útil.

### 8.4 Grids

- Layout dividido: duas colunas com pesos definidos pelo conteúdo, não sempre 50/50.
- Portfólio: três itens no desktop quando houver largura; reduzir e empilhar conforme leitura.
- Processo: sequência conectada, sem virar cinco cards genéricos iguais por obrigação.
- FAQ: introdução + lista no desktop; pergunta antes da resposta no mobile.
- Conteúdo editorial: pode permanecer aberto sobre o canvas.

## 9. Responsividade

A LP possui pontos de ajuste em 1200, 1120, 1024, 900, 768, 760, 680, 640, 480, 460, 430, 390 e 360 px. Eles refletem decisões por seção, não uma escala universal de dispositivos.

Para novos componentes, começar com:

| Faixa | Comportamento base |
| --- | --- |
| Até 767 px | Uma coluna, menu mobile, ações adaptadas ao toque |
| 768–1023 px | Composição intermediária; reduzir colunas se o conteúdo exigir |
| 1024–1439 px | Layout desktop com margens e densidade controladas |
| A partir de 1440 px | Respeitar max-width; não ampliar indefinidamente |

Breakpoints são limites de composição. Não inferir que todo tablet precisa manter duas colunas.

### 9.1 Hero

O asset permanece com crop central superior. O conteúdo é deslocado para baixo para não cruzar a faixa orbital brilhante.

**Valores extraídos:**
- desktop: `padding-top: clamp(270px,33vw,360px)`;
- mobile até 768 px: `padding-top: clamp(290px,58svh,330px)`;
- altura mínima mobile: `100svh`.

Esses valores pertencem ao asset atual. Ao trocar imagem ou copy, recalcular a composição. Não reutilizar esses offsets como regra universal de hero.

### 9.2 Regras de adaptação

- CTA principal permanece antes da ação secundária.
- Botões podem empilhar e ocupar largura disponível; não diminuir labels.
- Crop precisa preservar o gesto da órbita, sem sacrificar legibilidade.
- Priorizar título, descrição e ação antes de detalhes secundários.
- Filtros podem rolar horizontalmente se houver indicação de continuidade.
- Nenhuma ação essencial depende de hover.
- Prever safe area e teclado virtual em extensões com campos.
- Não usar altura fixa que corte conteúdo em aparelhos baixos ou com texto ampliado.
- Validar reflow a 320 px e zoom de 200%.

## 10. Forma, bordas e elevação

### 10.1 Radius

| Papel | Token consolidado | Relação com a LP |
| --- | --- | --- |
| Controle retangular | 12 px | Extensão; próximo dos controles menores existentes |
| Item compacto | 16 px | Concepts e unidades internas |
| Card de projeto | 20 px | Extraído |
| Painel | 24 px | Normalização dos painéis de 22–28 px |
| Painel amplo | 28 px | Extraído do portfólio |
| Botão principal/secundário | 999 px | Extraído |
| Modal | 26 px | Extraído |

Cápsula é apropriada aos CTAs atuais e filtros. Não converter todas as superfícies, parágrafos e metadados em pills.

### 10.2 Bordas

- 1 px para limites discretos.
- Violeta nas unidades de destaque, com opacidade controlada.
- Branco translúcido para divisão secundária.
- Evitar borda em cada agrupamento quando espaço e alinhamento já resolvem.
- Separar borda decorativa de borda necessária à identificação de um controle.

### 10.3 Sombras

A LP usa glow no CTA, destaques de texto e algumas interações. Este sistema preserva sua função de assinatura, mas limita sua disseminação.

| Tipo | Uso |
| --- | --- |
| Sombra neutra | Modal e superfície sobreposta |
| Glow de marca | CTA principal ou gesto visual dominante |
| Luz interna discreta | Acabamento pontual em superfície destacada |
| Sem sombra | Corpo de texto, listas, itens comuns e navegação padrão |

Para novas áreas operacionais, usar superfície sólida e sombra neutra. A hierarquia não pode depender de halo.

## 11. Contratos de componentes

### 11.1 Botão e link de ação

**Propósito:** conduzir à ação principal, ação secundária ou navegação.

**Anatomia:** label específico + ícone opcional. Seta é adequada a “Começar meu projeto”; não é obrigatória em todo botão.

| Variante | Aplicação | Visual |
| --- | --- | --- |
| Primária | Ação principal da zona | Gradiente violeta, texto branco, cápsula |
| Secundária | Ver projetos/ação de menor prioridade | Fundo escuro discreto, borda, texto branco |
| Texto | Navegação contextual | Sem superfície, distinção de link |
| Destrutiva | Exclusão real em extensão de produto | Semântica de perigo, sem glow promocional |

**Métrica:** altura mínima atual de primária/secundária **48 px**; padding desktop **14 × 34 px**; gap **10 px**; label aproximadamente **16 px**, peso **600**. Header pode usar variante compacta, conservando área de toque adequada.

**Estados:** default, hover, active, focus-visible; loading e disabled apenas quando houver operação real. Hover atual desloca o CTA cerca de 2 px e a seta 4 px. Em novas aplicações, não intensificar continuamente a luz.

**Semântica:** link navega; botão executa ação. Para destino externo em nova aba, informar isso no nome/contexto e usar `rel="noopener noreferrer"`.

**Loading:** manter largura, label contextual e `aria-busy`; impedir envio duplicado. Não mostrar spinner em simples link sem operação assíncrona.

**Mobile:** pelo menos 48 px de altura, sem truncar label. Uma ação primária dominante por zona; repetição ao longo da LP é aceitável se o objetivo permanece o mesmo.

### 11.2 Cabeçalho e navegação

**Extraído:** header fixo, logo à esquerda, links “Projetos”, “Como funciona”, “Investimento”, CTA à direita. Ao rolar, o fundo passa a preto translúcido, com blur de **14 px**, borda inferior discreta e padding vertical de **16 px**, contra **24 px** inicial.

**Contrato:**
- preservar reconhecimento da marca e acesso às seções;
- compensar a altura fixa no destino de âncoras;
- foco visível em logo, links, CTA e abertura do menu;
- fallback opaco quando transparência não for adequada;
- menu mobile com estado expandido, fechamento por Escape e devolução de foco;
- links do menu acessíveis ao toque; a LP já define mínimo de 44 px para links mobile;
- evitar adicionar grupos de links que desloquem o CTA.

Não reduzir o logotipo até ficar ilegível para preservar navegação desktop que já não cabe.

### 11.3 Abertura de seção

**Anatomia:** eyebrow opcional → título → descrição útil → conteúdo ou ação.

Números “02–08” são um recurso editorial da LP, não controles. Não anunciar “02 — POSICIONAMENTO” como se fosse um botão.

Título deve declarar a ideia central. Descrição acrescenta contexto; não repetir o título em linguagem genérica. Eyebrow nunca deve competir com a headline.

### 11.4 Item de benefício

**Anatomia:** ícone opcional → título breve → uma frase de apoio.

Usar lista aberta quando os itens são argumentos relacionados. Superfície independente só quando ela melhora comparação ou interação. Não inventar indicadores, percentuais ou contagens para preencher o espaço.

### 11.5 Card de projeto

**Anatomia:** screenshot → categoria/contexto → nome → descrição curta → acesso.

**Base extraída:** radius **20 px**, conteúdo com padding **24 px**, título próximo de **21,6 px**.

**Contrato:**
- screenshot de qualidade suficiente para leitura e reconhecimento;
- nome e ação acessíveis no toque e no teclado;
- descrição factual; não inventar impacto;
- preservar a paleta do projeto dentro do screenshot;
- evitar links aninhados e áreas clicáveis com destinos contraditórios;
- não depender do overlay de hover para oferecer acesso;
- indicar concept/exploração quando aplicável;
- falha de imagem não remove nome, descrição e acesso.

### 11.6 Filtro de portfólio

A LP mostra filtros e oculta categorias sem projetos disponíveis.

Para evoluções, implementar grupo de botões de filtro com `aria-pressed`, ou tabs completas com navegação e painel correspondentes. Não misturar semânticas.

**Estados:** não selecionado, selecionado, focus-visible. Em mobile, permitir rolagem sem ocultar que existem mais opções. Não criar filtros para uma coleção pequena se eles não ajudarem a escolher.

### 11.7 Processo

A LP apresenta **Briefing → Orçamento → Design → Ajustes → Publicação**.

**Contrato:** ordem inequívoca, título e explicação curta por etapa. Conexões são decorativas. Em mobile, sequência vertical; não exigir leitura de uma linha horizontal comprimida. Não apresentar progresso preenchido como se o usuário já tivesse um projeto em andamento.

### 11.8 Investimento

**Anatomia:** contexto da oferta → preço → condição de cobrança → inclusões → CTA → esclarecimento quando necessário.

**Conteúdo observado em 07/10/2026:** “a partir de R$287”, pagamento único, hospedagem grátis, design sob medida, publicação e suporte inicial. O FAQ especifica hospedagem inicial inclusa.

**Contrato:**
- preço e “a partir de” devem permanecer próximos;
- não apagar condições relevantes com contraste baixo;
- prazo e extensão da hospedagem seguem a oferta vigente;
- uma oferta não precisa de três planos fictícios;
- sem desconto, escassez, economia ou garantia inventados;
- o CTA atual solicita contato; não apresentar como compra automática;
- cores e tipografia separam valor, moeda e condições sem dificultar leitura.

### 11.9 FAQ

A LP usa accordion, com a primeira resposta inicialmente aberta e uma resposta aberta por vez.

**Contrato:** pergunta em botão, `aria-expanded`, associação por `aria-controls`; resposta em região correspondente. Enter e Space funcionam; foco permanece na pergunta. Manter “quanto custa”, hospedagem, prazo, ajustes e segmentos conforme a oferta real.

O conteúdo fechado não pode continuar disponível ao leitor de tela como se estivesse aberto. No fallback sem JavaScript, respostas devem permanecer encontráveis.

### 11.10 Galeria de concepts/modal

**Extraído:** convite amplo após o portfólio, modal com identificação, três concepts e fechamento. O código inclui Escape e restauração de foco ao fechar; isso não substitui teste completo da interação.

**Contrato:** título acessível, `role="dialog"`, `aria-modal="true"`, foco contido, fundo inerte, fechamento sempre alcançável e retorno ao gatilho. Conteúdo pode rolar; fechamento não pode desaparecer fora da área útil.

Preservar “exploração” como contexto. Não fazer a galeria competir com o CTA comercial principal.

### 11.11 Rodapé

**Anatomia:** marca e frase curta → navegação → contato → copyright.

Manter papel de orientação e encerramento. Não acrescentar colunas vazias, redes sem uso, selos ou links cenográficos. Informações essenciais precisam de contraste mesmo quando pequenas.

### 11.12 Formulários — extensão

A LP atual conduz ao WhatsApp; não foi encontrado um formulário de envio de briefing.

Para uma futura extensão:
- label persistente; placeholder apenas como exemplo;
- mínimo necessário para obter resposta útil;
- input com altura mínima **48 px**, radius **12 px**, texto **16 px**;
- ajuda e erro associados ao campo;
- borda de controle identificável e foco próprio;
- estados default, focus, error, disabled e submitting;
- preservar valores após falha;
- confirmação explica o próximo passo;
- erro explica o problema e como corrigi-lo;
- não implementar envio cenográfico nem prometer prazo automático sem suporte.

## 12. Arquitetura da landing page

| Seção | Função | Composição orientadora | Evitar |
| --- | --- | --- | --- |
| 01 Hero | Posicionar e iniciar contato | Foco cósmico + headline central + apoio + duas ações hierarquizadas | Badges em série e mockups sem função |
| 02 Posicionamento | Explicar o critério da marca | Frase forte + descrição + três argumentos | Repetição completa da promessa do hero |
| 03 Portfólio | Demonstrar capacidade | Screenshots reais e informações de projeto | Resultado comercial sem evidência |
| 04 Oferta | Mostrar adaptação ao contexto | Texto + exemplos/estrutura visual proporcional | Transformar exemplos em dashboard fictício |
| 05 Processo | Reduzir dúvida sobre contratação | Sequência clara de cinco etapas | Complexidade operacional desnecessária |
| 06 Investimento | Explicar oferta e condição | Valor dominante + inclusões + CTA | Pricing SaaS com planos inventados |
| 07 FAQ | Resolver objeções reais | Introdução curta + perguntas expansíveis | Respostas vagas ou promessa absoluta |
| 08 CTA final | Reunir decisão e contato | Promessa breve + orçamento + próximo passo | Nova oferta desconectada da página |
| Rodapé | Orientar e encerrar | Marca, navegação e contato | Texto repetitivo e links sem destino |

Esta arquitetura documenta a LP atual. Uma nova página AtosWEB pode ter menos seções se seu objetivo não exigir todas.

## 13. Fold Continuity

Continuidade entre dobras é uma regra estrutural da AtosWEB.

A LP usa transições para o preto base, incluindo uma faixa de **140 px** na base do hero e sobreposições específicas nas seções seguintes. O rodapé também recebe transição atmosférica.

**Contrato consolidado:**

1. O final do fundo de uma seção deve conversar com o início da seguinte.
2. Usar a mesma cor-base nas extremidades.
3. Preservar direção de luz e temperatura cromática.
4. Evitar cortes de imagem que pareçam um banner colado sobre outro.
5. Usar máscaras/gradientes suaves quando necessários; não empilhar efeitos por padrão.
6. Testar a passagem entre seções no mobile, onde o crop muda.
7. A transição não pode cobrir texto ou interceptar clique.
8. A continuidade deve permanecer aceitável com imagens carregadas parcialmente.

Os 140 px do hero são um valor observado, não uma altura obrigatória para todas as dobras.

## 14. Movimento e interação

### 14.1 Valores extraídos

| Token | Valor |
| --- | --- |
| `--motion-ease-premium` | `cubic-bezier(0.16,1,0.3,1)` |
| `--motion-duration-fast` | 180 ms |
| `--motion-duration-ui` | 380 ms |
| `--motion-duration-reveal` | 700 ms |
| `--motion-distance` | 24 px |
| Atmosfera do hero desktop | Ciclo de 16 s, variação sutil |
| Introdução de marca | Saída após 1700 ms + transição de 300 ms |

A introdução é registrada por sessão. Com redução de movimento, o script diminui sua duração e remove movimento orbital.

### 14.2 Regras consolidadas

- Movimento reforça ordem, entrada ou feedback.
- Preferir opacity e transform.
- Revelar conteúdo uma vez; evitar repetição a cada scroll.
- Deslocamentos curtos: **12–24 px**; não fazer parágrafos atravessarem a tela.
- Evitar animação contínua em controles e texto.
- Hover, perspectiva e efeito de ponteiro só em dispositivos compatíveis.
- Não ocultar conteúdo indefinidamente se JavaScript falhar.
- Respeitar `prefers-reduced-motion`: sem parallax, órbita animada ou stagger prolongado.
- Introdução de marca não é requisito para novas páginas; preservar apenas quando agrega identidade sem atrasar acesso.
- Conteúdo crítico não deve aguardar imagens abaixo da dobra.
- Não usar shimmer/glow para simular atividade inexistente.

## 15. Acessibilidade

Meta de projeto: **WCAG 2.2 nível AA**, com validação por implementação. Esta especificação não declara conformidade da LP publicada.

### 15.1 Contraste e percepção

- Texto normal: pelo menos **4,5:1**.
- Texto grande: pelo menos **3:1**; a classificação considera tamanho e peso conforme WCAG.
- Partes visuais necessárias de controles/estados: contraste adequado, em geral **3:1** com cores adjacentes.
- Não comunicar erro, seleção ou sucesso apenas por cor.
- Foco visível, distinguível da seleção.
- Não tratar glow como substituto de outline.
- Não reduzir opacidade de texto relevante para criar profundidade.

### 15.2 Teclado e estrutura

- `lang="pt-BR"`, um H1 e hierarquia coerente de headings.
- Link “Pular para o conteúdo” funcional; já existe no HTML.
- Ordem de foco acompanha a leitura.
- Header fixo não esconde o destino ou o foco.
- A LP comercializa conteúdo em HTML, não dentro do background.
- Assets decorativos com `alt=""`; screenshots com descrição útil.
- Modal e menu com entrada, contenção e devolução de foco.
- Filtros com estado selecionado programático.
- Links distinguíveis e destinos descritivos.

### 15.3 Toque, ampliação e adaptação

Padrão interno: **44–48 px** para controles principais de toque; botões principais com mínimo de 48 px. Isso é uma meta de conforto do sistema, não uma declaração do mínimo universal da WCAG.

Validar ampliação de texto, zoom, reflow e aparelhos com viewport baixo. Não esconder overflow para mascarar conteúdo cortado.

**Fontes normativas:** [Contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum) e [Contraste não textual](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html).

## 16. Conteúdo e UX writing

### 16.1 Tom

Cordial, tranquilo, seguro e profissional. Frases naturais e concretas. Poucos adjetivos; nenhuma necessidade de parecer grandioso em cada bloco.

| Evitar | Preferir |
| --- | --- |
| “Revolucione sua presença com soluções incríveis” | “Uma landing page feita para o seu negócio.” |
| “Potencialize seus resultados de forma exponencial” | “Apresente sua oferta com clareza.” |
| “Clique aqui” | “Ver projetos” |
| “Garantimos mais vendas” | “Estrutura pensada para conduzir à ação.” |
| “Entrega imediata” sem prazo confirmado | “O prazo é definido no briefing.” |

### 16.2 CTA e intenção

**Ação principal:** iniciar projeto ou solicitar orçamento.
**Ação secundária:** conhecer os projetos.

Os diferentes CTAs da LP conduzem ao mesmo objetivo comercial. Em uma extensão, manter consistência entre label, destino e etapa do processo.

### 16.3 Integridade

- Não inventar clientes, depoimentos, estatísticas, prêmios, resultados, escassez ou garantias.
- Diferenciar método de trabalho de resultado comprovado.
- Não usar uma condição “inicial” como promessa vitalícia.
- Atualizar todos os pontos que exibem preço quando a oferta mudar.
- Não presumir que “Ver todos os projetos” abre uma listagem: na LP inspecionada esse link leva ao WhatsApp. Em evolução, label e destino devem ser alinhados.
- Texto de suporte responde dúvida real; eliminar redundância.

## 17. Aplicação em produtos do ecossistema

Esta seção é uma **extensão de marca**, não um registro de interfaces já implementadas.

Atos Produtos, AtosSales ou ferramentas próprias podem compartilhar tipografia, violeta, formas e linguagem. Não precisam reproduzir eclipse, hero alto, introdução ou gradiente em cada controle.

| Elemento | Página comercial | Interface operacional |
| --- | --- | --- |
| Atmosfera | Pode dominar a primeira dobra | Pontual em entrada, marca ou vazio |
| Superfícies | Menos unidades, mais composição aberta | Unidades funcionais conforme tarefa |
| Tipografia | Headline ampla | Títulos e labels adequados ao trabalho |
| CTA | Conversão/contato | Criar, editar, organizar, salvar |
| Densidade | Persuasão e leitura | Acesso às informações necessárias |
| Glow | Destaque de marca | Evitar como estado rotineiro |
| Movimento | Entrada e narrativa | Feedback breve e previsível |

A identidade é herdada; a organização nasce da tarefa. Um catálogo, editor e pipeline exigem composições diferentes. Não acrescentar métricas, gráficos ou recursos sem necessidade real.

## 18. Assets, entrega e desempenho

### 18.1 Inventário observado

| Arquivo relativo à LP | Papel |
| --- | --- |
| `assets/logo_hd.png` | Wordmark |
| `assets/herobg.png` | Hero com eclipse/órbita |
| `assets/section2bg.png` | Posicionamento |
| `assets/section3bg.png` | Portfólio |
| `assets/section4bg.png` | Oferta |
| `assets/section5bg.png` | Processo |
| `assets/section6bg.png` | Investimento |
| `assets/section7bg.png` | FAQ |
| `assets/section8bg.png` | CTA final |
| `assets/concepts/concept1.png` a `concept3.png` | Galeria de explorações |

As rotas são referências da página publicada. Este arquivo não inclui os assets nem garante sua disponibilidade futura. Guardar os originais no projeto quando houver autorização e necessidade de implementação.

### 18.2 Regras de produção

- Preferir vetor para marca quando o original vetorial estiver disponível.
- Não recriar símbolo ou wordmark por geração de imagem.
- Exportar backgrounds otimizados, mantendo o original de alta qualidade.
- Criar variação mobile quando crop sozinho não preservar composição.
- Não embutir copy na arte de fundo.
- Definir dimensões/aspect ratio para reduzir saltos de layout.
- Hero com prioridade alta; demais fundos e screenshots com lazy loading.
- Fontes com fallback e troca previsível.
- Não carregar família tipográfica sem uso confirmado.
- Sem bibliotecas pesadas para efeitos que CSS e JavaScript simples resolvem.
- Fallback sólido para blur e transparência.
- Nenhum efeito deve capturar eventos de ponteiro.
- Preservar leitura e CTA quando um asset falhar.

## 19. Tokens CSS de referência

Este bloco é uma **base de adoção**, não uma cópia integral do CSS publicado. Preserva valores de marca e acrescenta papéis semânticos, escala e regras para extensões.

```css
:root {
  /* Primitivos preservados da LP */
  --bg-black: #030206;
  --bg-deep: #05040a;
  --purple-primary: #8537f5;
  --purple-neon: #a855f7;
  --purple-light: #c084fc;
  --purple-dark: #6d28d9;
  --purple-border: #8b5cf6;
  --text-white: #ffffff;
  --text-gray: #94a3b8;
  --text-eyebrow: #cbd5e1;
  --border-outline: rgb(255 255 255 / 16%);
  --border-outline-hover: rgb(255 255 255 / 36%);

  --btn-purple-gradient:
    linear-gradient(90deg, #6b21de 0%, #7e2ce7 45%, #9b51e0 100%);
  --atos-text-gradient:
    linear-gradient(135deg, #c084fc 0%, #a855f7 45%, #9333ea 100%);

  /* Papéis semânticos */
  --color-bg-canvas: var(--bg-black);
  --color-bg-deep: var(--bg-deep);
  --color-bg-surface: #0c0a14;
  --color-bg-raised: #140e27;
  --color-text-primary: var(--text-white);
  --color-text-secondary: var(--text-gray);
  --color-text-label: var(--text-eyebrow);
  --color-text-accent: var(--purple-light);
  --color-action-primary: var(--purple-primary);
  --color-action-primary-hover: var(--purple-dark);
  --color-focus: var(--purple-light);
  --color-border-subtle: var(--border-outline);
  --color-border-control: #736980;

  /* Extensões de estados */
  --color-success: #6ee7b7;
  --color-warning: #fcd34d;
  --color-danger: #fda4af;
  --color-info: #93c5fd;

  /* Tipografia */
  --font-main: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-heading: var(--font-main);
  --font-body: var(--font-main);
  --font-display: var(--font-heading);
  --text-hero: clamp(2.35rem, 4.3vw, 4.25rem);
  --text-section: clamp(2.25rem, 4.1vw, 4.4rem);
  --text-body: 1rem;
  --text-body-lg: 1.125rem;
  --text-label: .875rem;
  --text-eyebrow-size: .8125rem;
  --leading-display: 1.14;
  --leading-body: 1.55;
  --tracking-display: -.028em;
  --tracking-eyebrow: .16em;

  /* Espaçamento */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-28: 112px;

  /* Composição */
  --container-wide: 1440px;
  --container-reading: 1200px;
  --gutter: 48px;
  --section-padding: 96px;
  --control-min-height: 48px;

  /* Forma */
  --radius-control: 12px;
  --radius-item: 16px;
  --radius-card: 20px;
  --radius-panel: 24px;
  --radius-panel-wide: 28px;
  --radius-modal: 26px;
  --radius-pill: 999px;

  /* Elevação consolidada */
  --shadow-overlay: 0 24px 64px rgb(0 0 0 / 48%);
  --shadow-brand: 0 0 28px -6px rgb(133 55 245 / 40%);

  /* Movimento preservado */
  --motion-ease-premium: cubic-bezier(.16, 1, .3, 1);
  --motion-duration-fast: 180ms;
  --motion-duration-ui: 380ms;
  --motion-duration-reveal: 700ms;
  --motion-distance: 24px;

  /* Stack consolidado; não mapear mecanicamente todos os z-index atuais */
  --z-decoration: 0;
  --z-content: 10;
  --z-header: 100;
  --z-overlay: 1000;
  --z-dialog: 1100;
  --z-skip-link: 2000;
}

@media (max-width: 1023px) {
  :root { --gutter: 32px; --section-padding: 80px; }
}

@media (max-width: 767px) {
  :root {
    --gutter: 20px;
    --section-padding: 72px;
    --text-hero: clamp(1.95rem, 8.2vw, 2.55rem);
    --text-section: clamp(2rem, 8.5vw, 3rem);
    --motion-distance: 14px;
  }
}
```

### 19.1 Exemplo de uso

```css
.atos-container {
  width: 100%;
  max-width: var(--container-wide);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

.atos-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: var(--control-min-height);
  padding: 14px 34px;
  border: 0;
  border-radius: var(--radius-pill);
  color: var(--color-text-primary);
  background: var(--btn-purple-gradient);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
  box-shadow: var(--shadow-brand);
  cursor: pointer;
  transition:
    transform var(--motion-duration-fast) var(--motion-ease-premium),
    box-shadow var(--motion-duration-ui) var(--motion-ease-premium);
}

.atos-button:hover { transform: translateY(-2px); }
.atos-button:active { transform: translateY(0); }

:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 4px;
}

.atos-button:disabled {
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
  background: var(--color-bg-raised);
  color: var(--color-text-secondary);
}

@media (prefers-reduced-motion: reduce) {
  .atos-button { transition: none; }
  .atos-button:hover { transform: none; }
}
```

Não aplicar este snippet sobre a LP inteira sem avaliar os seletores e os overrides existentes. Ele exemplifica consumo de tokens para componentes novos.

## 20. Protocolo de uso por IA e implementação

1. Ler este documento e identificar a tarefa real.
2. Inspecionar a página, componente ou asset existente antes de propor mudanças.
3. Preservar os elementos já aprovados.
4. Usar conteúdo real; sinalizar amostras quando indispensáveis.
5. Escolher composição pela função, mantendo o sistema visual.
6. Desenhar hierarchy e respiro antes de acrescentar efeitos.
7. Na criação de nova direção visual, seguir LPVCW: **Contexto → Estrutura → Visual → Assets → Implementação → Refinamento**.
8. Distinguir **UI real**, **asset visual** e **decoração**.
9. Extrair background puro de uma composição aprovada, sem rasterizar controles.
10. Implementar sem alterar silenciosamente a direção aprovada.
11. Comparar o resultado com a referência e validar mobile.
12. Informar alterações, verificações executadas e limitações relevantes.

**Instrução pronta para outro agente:**

> Leia o design-system.md da AtosWEB e trate-o como referência visual do projeto. Preserve Plus Jakarta Sans, base escura, violeta proprietário, tratamento da palavra ATOS e continuidade entre dobras. Faça o layout nascer da tarefa. Mantenha espaço negativo e um foco dominante por zona. Use texto e controles reais em HTML. Não preencha áreas vazias com elementos sem função, não invente métricas ou resultados e não repita a mesma composição em todas as seções. Diferencie valores extraídos da LP de extensões do sistema. Em implementação, valide a ação principal, estados relevantes, teclado, responsividade e falha de assets.

## 21. Governança

### 21.1 Mudança de tokens

- Corrigir aliases antes de espalhar valores literais.
- Mudança de primitivo exige revisar seus consumidores.
- Mudança de componente exige considerar todas as aplicações.
- Exceção local deve permanecer local quando não representar regra geral.
- Uma nova variante precisa de uso estável e justificativa.
- Nenhuma alteração deste documento publica ou modifica automaticamente a LP.

### 21.2 Versionamento

| Tipo | Exemplo |
| --- | --- |
| Patch | Correção textual, esclarecimento, documentação de comportamento |
| Minor | Novo componente compatível, novos estados ou extensão sem ruptura |
| Major | Troca de família, mudança de linguagem de marca ou contrato incompatível |

Para cada revisão, registrar data, motivo, consumidores afetados e evidência. Não transformar preferência momentânea em mudança global.

### 21.3 Critério de exceção

Uma exceção é aceitável quando resolve um requisito concreto, mantém legibilidade e não quebra reconhecimento ou semântica. “Para parecer mais moderno” ou “para preencher” não são justificativas suficientes.

## 22. Critérios de aceite

### Marca e composição

- [ ] A marca é reconhecível por tipografia, cor, proporção e linguagem.
- [ ] Há um protagonista por zona e uma ação principal identificável.
- [ ] Espaço negativo foi preservado.
- [ ] O tratamento de ATOS permanece excepcional.
- [ ] Fundos compartilham atmosfera e transição coerente.
- [ ] Cards e ícones possuem função justificável.
- [ ] Concepts estão diferenciados de trabalhos publicados.

### Conteúdo e operação

- [ ] Labels correspondem aos destinos.
- [ ] Preço e condições coincidem em todos os pontos.
- [ ] Nenhuma promessa, métrica ou prova social foi inventada.
- [ ] Links e controles funcionam.
- [ ] Loading, erro e recuperação existem quando a tarefa exige.
- [ ] Sem JavaScript ou com imagem indisponível, informação essencial permanece acessível.

### Acesso e adaptação

- [ ] Navegação por teclado, foco e Escape foram verificados.
- [ ] Contraste foi medido sobre fundos reais.
- [ ] Conteúdo não depende apenas de hover ou cor.
- [ ] Menu e modal gerenciam foco corretamente.
- [ ] Mobile preserva crop, hierarquia e toque.
- [ ] Zoom de 200% e reflow em 320 px não cortam conteúdo.
- [ ] Preferências de movimento/transparência são respeitadas.

### Acabamento e desempenho

- [ ] Não há cortes abruptos entre dobras.
- [ ] Fonts/medidas não criam salto significativo no conteúdo.
- [ ] Imagens têm dimensões e carregamento adequados.
- [ ] Efeitos não atrasam nem interceptam a ação.
- [ ] Resultado implementado foi comparado com a direção aprovada.

Os itens acima são critérios para validar uma implementação futura. Não representam testes já executados na LP.

## 23. Referências e limites da inspeção

### Fontes

- [Landing page AtosWEB](https://atosweb.vercel.app/)
- [CSS público inspecionado](https://atosweb.vercel.app/styles.css)
- [JavaScript público inspecionado](https://atosweb.vercel.app/script.js)
- [Background do hero](https://atosweb.vercel.app/assets/herobg.png)
- [Logotipo utilizado](https://atosweb.vercel.app/assets/logo_hd.png)
- Conversas anteriores: direção clean, baixa entropia, espaço negativo, A/órbita, BG puro, Visual-ID e LPVCW.
- [W3C — Contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [W3C — Contraste não textual](https://www.w3.org/WAI/WCAG22/understanding/non-text-contrast.html)

### O que foi verificado nesta versão

Leitura do HTML, CSS e JavaScript publicados; inspeção visual dos assets de hero e logotipo; identificação de fontes, cores, medidas, seções e contratos presentes no código; cálculo de contraste dos pares sólidos listados.

Não foi executada uma auditoria de navegação, leitor de tela, desempenho ou conformidade da página em navegador. Também não foi medido contraste sobre todos os pixels de imagens e superfícies compostas.

### Registro de versão

**1.0.0 — 07/10/2026:** primeira consolidação profissional da identidade atual, com valores extraídos, regras normativas, contratos de componentes e extensões explicitamente diferenciados.
