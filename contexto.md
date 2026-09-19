# Contexto — Página de Vendas "50 Projetos de Móveis para Cães"

Criado em 17/09/2026. Leia este arquivo inteiro antes de mexer em qualquer
coisa. Se algo aqui divergir do código, o código manda — mas normalmente isso
significa que este arquivo ficou desatualizado e deve ser corrigido.

## O produto

Infoproduto de baixo ticket para **marceneiros, pequenos fabricantes e
artesãos** — não é para o dono do cachorro, é para quem FABRICA e VENDE
móveis. A promessa: ampliar o catálogo de produtos que o marceneiro oferece,
com projetos prontos que ele consulta, fabrica e vende, sem desenhar cada
peça do zero.

**Mecanismo (o coração da oferta, repetido na copy):**
ESCOLHA O PROJETO → CONSULTE MEDIDAS E PEÇAS → CORTE → MONTE → VENDA

São 50 projetos de marcenaria para cães em 8 categorias. Lista completa e os
critérios de montagem dela em `lista-50-projetos.md`.

**Produto principal: ficha técnica visual em PDF**, uma por projeto, com 5
blocos: produto montado · medidas essenciais · relação de peças (letra,
quantidade, dimensão) · materiais e lógica de corte · passo a passo de
montagem.

> ⚠️ **3D nunca é o produto principal.** No produto irmão (gatos) tentou-se
> vender com modelo 3D navegável como carro-chefe, não converteu, e foi
> revertido para PDF. Esta página nasceu já com a lição aplicada: não há
> nenhuma menção a 3D como atração. Se um acervo 3D existir um dia, entra
> como bônus/complemento — nunca na vitrine nem no hero.

## Produto irmão (referência de arquitetura)

`c:\Users\Usuário\Desktop\PROJETOS\PAGINA DE VENDAS 3D PARA GATOS\index.html`
— "100 Projetos de Móveis 3D para Gatos", já no ar e validado. Esta página foi
construída **a partir de uma cópia daquele arquivo**, preservando tokens de
design, componentes, ordem das seções e os 5 IIFEs de JS. O que mudou está em
"O que foi adaptado" abaixo.

Fonte da estrutura de dados técnicos (inspiração de schema, não de conteúdo):
`PROJETOS 3D MOVEIS PARA GATOS/lib/projetos-tecnicos.ts` e
`lista-100-fichas.md` no mesmo projeto.

## O que foi PRESERVADO do irmão

- As 13 seções na ordem fixa da skill, **com "Pra quem é" removida** (padrão
  v2: o comparativo cobre a dor, o FAQ cobre o pré-requisito).
- Escada de preço: VIP R$ 29,90 · Básico R$ 22,90 · Downsell R$ 25,90 ·
  âncora R$ 152 (soma dos 4 bônus).
- Os 4 bônus comerciais (47 + 39 + 37 + 29 = 152): Calculadora de Preço e
  Lucro, Gerador de Orçamento, Catálogo Interativo, Lista de Compras.
- Carrossel de fichas, badges de categoria, flipbook e mid-CTA na seção 4
  (mas em ordem própria — ver "Divergência deliberada" abaixo).
- Carrossel lifestyle na seção 2, antes do `.desire-strip` (regra 9.3).
- IIFEs 1–5 (scroll-reveal, modal, checkout+UTM, topbar marquee, scroll-driven).
- Grafite como primária; assets padronizados da skill (selo, ícones, rostos).

## O que foi ADAPTADO

- **Número-diferencial 50** (em vez de 100), refletido em: topbar, H1,
  `.desire-strip`, `.cat-marquee`, `.mc-facts`, lista do VIP, básico, downsell.
- **Mecanismo de venda**: o irmão vende "medida calculada por engenharia"
  (tinha motor paramétrico). Aqui a promessa é a ficha com medidas, relação de
  peças e ordem de montagem — ver "Pendências" sobre por que não se alega
  medida calculada.
- **Categorias próprias de cão** (8, não as 15 do gato). Cão não escala
  parede: torres, arranhadores, pontes e escalada de parede não têm
  equivalente canino. Os eixos aqui são porte, interno×externo,
  acessibilidade e móvel integrado à casa. Detalhes em `lista-50-projetos.md`.
- **Accents**: ocre de madeira crua + âmbar tostado, deliberadamente distintos
  do laranja do irmão, para os dois produtos não se confundirem no feed.
- **Comparativo**: entrou a dor de **porte** ("serve pro Shih Tzu, não serve
  pro Labrador"), que é a causa nº 1 de chapa perdida em cão.
- **Seção 2**: os 4 cards 3D viraram 6 `.proj-card` com thumbnail do móvel e
  selo de porte. Todo o Three.js, o importmap e o `external[]` do
  `vite.config.js` foram removidos.
- **Disclaimer**: acrescentada a responsabilidade pela adequação da peça ao
  porte e ao comportamento do animal.

## Divergência deliberada da skill (decidida pelo usuário em 17/09/2026)

A **ordem interna da seção 4 ("Veja por dentro")** não segue a seção 9.4 da
skill `padrao-lowticket`. A ordem em produção é:

```
1. section-head (headline + sub)
2. Prévia do material (flipbook Heyzine)
3. Carrossel de fichas técnicas (.ficha-marquee, 2 fileiras, retrato)
4. Carrossel de badges de categoria (.cat-marquee, 4 fileiras)
5. mid-CTA
```

A skill prescreve `head → fichas → badges → flipbook → mid-CTA`, com o
argumento de que num catálogo o leitor deve ver amplitude (quantos projetos
existem) antes da prévia. O usuário decidiu pela prévia logo após a headline
— que é a ordem do padrão genérico de ebook da própria skill.

**Não "corrigir" isso de volta para a 9.4 sem pedido explícito.** Se a skill
for reaplicada do zero nesta página, essa é a diferença a preservar.

## Estado atual

Build limpo (`npx vite build`), 50/50 no checklist da skill (seção 7 + 9.6),
sem overflow horizontal nem erro de layout em 1280px e 390px (verificado com
Playwright, depois desinstalado).

## PENDÊNCIAS — a página não pode ir ao ar sem isto

| # | Pendência | Onde |
|---|---|---|
| 1 | ~~27 imagens restantes~~ **RESOLVIDO** (mockups, vitrine, lifestyle já preenchidos em sessão anterior) | — |
| 2 | ~~3 links de checkout~~ **RESOLVIDO em 18/09/2026** | ver seção abaixo |
| 3 | ~~pixelId da UTMify~~ **RESOLVIDO em 18/09/2026** | ver seção abaixo |
| 4 | ~~URL do flipbook~~ **RESOLVIDO em 18/09/2026** | ver seção abaixo |
| 5 | ~~10 fichas do carrossel~~ **RESOLVIDO em 18/09/2026** | ver seção abaixo |
| 6 | **Medidas das fichas técnicas são fictícias** | ver "⚠️ Ressalva sobre as 50 fichas entregues" abaixo — não resolvido, decisão consciente do usuário |

### pixelId da UTMify — RESOLVIDO em 18/09/2026, TROCADO no mesmo dia

Passo 1: usuário mandou um script ofuscado (base64 + XOR, mesmo padrão do
produto de gatos). **Decodificado manualmente antes de aplicar** (nunca
injetar script ofuscado sem ver o conteúdo real primeiro) — era o mesmo
`pixelId` já usado na página de gatos (`6aa754da356ad930a1e76c9a`). Perguntei
se era intencional (mesmo painel pros dois produtos) — usuário confirmou que
sim, e apliquei.

Passo 2, mesmo dia: usuário decidiu usar um pixel **100% novo e próprio**
pro produto de cães. Mandou um segundo script ofuscado, decodificado com o
mesmo processo — resultado:
`{"url":"https://cdn.utmify.com.br/scripts/pixel/pixel.js","globals":[{"name":"pixelId","value":"6aadf7271ebd79bb3000011a"}]}`,
pixel legítimo, `pixelId` diferente do de gatos. Este é o valor final,
aplicado em `<head>` no formato que a página já usava (`window.pixelId =
"6aadf7271ebd79bb3000011a"`), sem o wrapper de ofuscação do script — a
página não precisa dele, o mecanismo é idêntico.

**pixelId atual e definitivo: `6aadf7271ebd79bb3000011a`** — próprio do
produto de cães, separado do de gatos.

### Links de checkout — RESOLVIDO em 18/09/2026

O produto **"50 Projetos de Móveis para Cães"** já existia na Cakto, criado
fora desta sessão (id `8a2469fd-e827-4364-bffd-79e453db9109`, status
`active`, R$29,90, `salesPage: https://50-projetos-moveis-caes.vercel.app/`)
— **e o webhook já estava vinculado corretamente** (app `68595` "Acervo 3D -
Área de Membros", junto com o produto de gatos, `success_rate: 100`). O que
faltava era: só existia **1 oferta** (a padrão, R$29,90) — Básico e Downsell
não tinham sido criados, e a página continuava com os 3 links como texto
placeholder literal.

Resolvido via API pública da Cakto (`offers_create`):

| Plano | id da oferta | preço | criado em |
|---|---|---|---|
| VIP | `zov8af3` | R$ 29,90 | já existia |
| Básico | `33biy8w` | R$ 22,90 | 18/09/2026 |
| Downsell | `kfrgjz8` | R$ 25,90 | 18/09/2026 |

Links no formato `https://pay.cakto.com.br/<id-da-oferta>` (mesmo padrão do
produto de gatos, confirmado comparando com `35dieni`/`g64q8jg`/`3ceh5ve`
daquele produto). Verificados por HTTP 200 **e** por `offers_retrieve` na
API (nome + preço + `product` batendo) — não confiar só no HTTP 200, a
página de checkout é uma SPA e o `<title>` vem vazio no HTML cru.

⚠️ **Atenção para o futuro:** `offers_create` **não tem idempotência
confirmada** — o helper da Cakto avisa isso a cada chamada. Não repetir a
criação de Básico/Downsell achando que "não colou da primeira vez": antes de
criar de novo, sempre conferir com `offers_list` filtrando pelo
`product.id` se a oferta já não existe, senão duplica.

### Sobre as imagens

Os assets serão gerados pelo usuário fora daqui (ChatGPT). Enquanto não
existirem, cada `<img>` ausente renderiza um placeholder listrado com rótulo,
graças ao bloco CSS `img[data-ph]`. **Quando os arquivos entrarem, apagar esse
bloco CSS e os atributos `data-ph`** — está comentado no próprio CSS.

**As 10 fichas do carrossel já foram resolvidas em 18/09/2026** — convertidas
de `ENTREGA-CATALOGO-50-PROJETOS-CAES/fichas-tecnicas/*.png` (1024×1536) para
webp 700px/q78 com `sharp`, direto pra `assets/fichas-preview/`:

```
01-casinha-classica · 06-casinha-sob-escada · 10-cama-sofa
16-comedouro-elevado-duplo · 22-rampa-sofa · 24-escada-cama
28-bau-brinquedos · 35-mesa-tosa · 40-canil-modular · 46-agility
```

**Os 6 cards de destaque da vitrine (`.proj-card`) e as 21 imagens do
carrossel lifestyle (`.page-marquee`) foram resolvidos em 18/09/2026**, a
partir de uma segunda entrega do usuário: 21 imagens contextuais em
`ENTREGA-CATALOGO-50-PROJETOS-CAES/../assets/vitrine/contextual/` (móvel +
cão real, fundo branco, headline manuscrita laranja, retrato 3:4, 1086×1448
originais em PNG — ver `GPT-CONTEXTO.md` daquela pasta, seção "Carrossel
contextual de uso").

Duas decisões tomadas ao integrar:

1. **Card 1 da vitrine trocou de projeto.** A copy original usava "Casinha
   com Telhado Removível" como carro-chefe, mas só existe imagem contextual
   para "Casinha Clássica" (a ficha 01). Troquei o card (copy + imagem) e o
   badge destacado correspondente no `.cat-marquee` da seção 4, pra manter
   os dois em sincronia — os 6 badges `.cat-badge--destaque` sempre precisam
   bater com os 6 `.proj-card` da vitrine.
2. **As imagens usadas nos 6 cards de destaque foram recortadas** (removidos
   os ~30% superiores, onde fica a headline manuscrita) porque o
   `.proj-stage` é paisagem (`aspect-ratio:3/2`) e a imagem original é
   retrato com o texto no topo — sem o corte, a headline aparecia cortada
   pela borda do card. O `<h3>` do card já escreve o nome do projeto, então
   a headline da imagem era redundante ali. **O carrossel lifestyle mantém
   a imagem completa com a headline** — lá o formato é diferente e a
   headline funciona bem.

**Todas as 21 originais em PNG (32 MB no total, ~1.6 MB cada) foram
convertidas para webp 600px/q80 (~676 KB no total) e os PNGs apagados do
projeto** — sem isso o build carregava 32 MB só nesse carrossel, inviável
pra uma página que vai rodar tráfego pago. Path final:
`assets/vitrine/contextual/*.webp` (carrossel) e `assets/vitrine/*.webp`

### Revisão em 18/09/2026 — cards de destaque trocados para FICHA TÉCNICA, não mais foto de uso

Decisão do usuário: os 6 `.proj-card` da vitrine passaram a mostrar a
**página da ficha técnica completa** (medidas, peças, vista explodida,
montagem) em vez da foto de móvel+cão em uso. As fotos de uso ficam
reservadas **só para o carrossel lifestyle** (`.page-marquee`) — separação
deliberada: o card de destaque é prova TÉCNICA, o carrossel é prova de
AMPLITUDE/DESEJO (a mesma lógica da regra 9.3 da skill, aplicada de forma
mais estrita que a especificação original).

Mudanças de CSS: `.proj-stage` foi de `aspect-ratio:3/2` (paisagem) para
`aspect-ratio:0.72` (retrato, proporção A4) — a ficha é um documento
vertical, forçar em paisagem espremia o conteúdo. `.proj-thumb` foi de
`object-fit:contain` para `object-fit:cover` com `object-position:top` —
prioriza mostrar o cabeçalho da ficha (nome, dimensões, render) no recorte,
que é o que mais vende num relance de scroll rápido.

As 6 imagens usadas já existiam em `assets/fichas-preview/` (mesmas 10 fichas
do carrossel `.ficha-marquee`, reaproveitadas): `01-casinha-classica`,
`10-cama-sofa`, `22-rampa-sofa`, `16-comedouro-elevado-duplo`,
`06-casinha-sob-escada`, `35-mesa-tosa`. Só trocou o `src` e o `alt` (agora
descreve "ficha técnica", não a cena de uso) — nenhuma imagem nova precisou
ser gerada.

### Auditoria mobile completa em 18/09/2026 — bug real corrigido

Pedido explícito do usuário: celular é prioridade máxima. Rodada auditoria
sistemática com Playwright em viewport 390×844 (iPhone 12/13/14): overflow
horizontal, elementos vazando a tela, texto abaixo de 12px, áreas de toque
pequenas, screenshot de cada seção.

**Bug real encontrado e corrigido:** os botões CTA com texto mais longo
("Quero ampliar meu catálogo", "Quero o catálogo completo", "Quero o
catálogo + os 4 bônus") quebravam em 2 linhas no breakpoint ≤560px, com a
seta (`.arrow`) ficando solta sozinha numa segunda linha, deslocada. Causa:
`font-size` e `gap` do `.btn`/`.btn-lg` não reduziam nesse breakpoint, então
o texto com `width:100%` não cabia numa linha só em 390px. Corrigido com uma
regra nova dentro do `@media (max-width:560px)` que reduz fonte/padding/gap
só nesse breakpoint, mantendo texto+seta sempre juntos — ver o comentário no
CSS junto à regra. Frases muito longas (o dos 4 bônus) ainda quebram em 2
linhas, mas agora com o alinhamento correto (não é mais bug, é quebra
natural de texto).

Também subidos para ≥12px (`.76rem`+) todos os textos de pill/badge/eyebrow
que estavam entre 11.3px–11.8px (`.eyebrow`, `.proj-porte`, `.tb-star`,
`.compare-col .tag`, `.mc-chip`, `.bonus-final-badge`, `.ribbon`,
`.final .eyebrow`, `.downsell-modal .dtag`, texto do placeholder
`img[data-ph]`) — abaixo do mínimo de legibilidade confortável em tela
pequena, mesmo sendo texto curto em caixa alta.

**Resultado final da auditoria: zero overflow horizontal, zero elemento
vazando a tela, zero texto abaixo de 12px, zero botão quebrado.** Os únicos
"erros" que o script reportou no fim são 2× `Failed to fetch` do pixel da
UTMify tentando falar com o `pixelId` placeholder — pendência conhecida
(seção de pendências acima), não é bug de mobile.

### ⚠️ Pendência nova descoberta nesta auditoria: build subiu para 12 MB

Numa sessão anterior (fora desta), os 4 bônus mudaram de conteúdo
(Calculadora de Preço e Lucro, **Guia de Proteção Contra Umidade**, **50
Personalizações Para Aumentar o Valor de Venda dos Móveis Pet**, **Kit de
Artes Para Divulgação** — diferentes dos 4 bônus originais registrados mais
acima neste arquivo: Gerador de Orçamento, Catálogo Interativo, Lista de
Compras) e ganharam mockups reais em
`assets/mockups/bonus/*-transparent.png`. **Esses PNGs não foram otimizados
— ~2 MB cada, 4 arquivos, mais o mockup do hero também em PNG cru —, o que
sozinho leva o build de ~4 MB para 12 MB.** Mesmo problema que já foi
corrigido uma vez no carrossel lifestyle (seção acima, 32 MB → 676 KB).
Antes de publicar de verdade, converter esses PNGs para webp otimizado do
mesmo jeito. Não fiz essa conversão agora porque estava fora do escopo do
pedido desta sessão (cards de ficha técnica + auditoria mobile) — só
registrando para não esquecer.
(os 6 recortados dos cards).

Ainda faltam (nomes exatos já referenciados no HTML):

- `assets/mockups/hero-header.webp` — mockup do hero
- `assets/mockups/pacote-completo.webp` — card VIP e modal de downsell
- `assets/mockups/bonus/{calculadora-preco-lucro,gerador-orcamento,catalogo-interativo,lista-compras}.webp`
  — **fundo transparente**, senão o efeito flutuante quebra

### Pipeline de geração das imagens (Gemini) — piloto validado em 17/09/2026

`scripts/gerar-referencias.mjs` + `scripts/catalogo.json` geram a **folha de
referência** de cada móvel: UMA imagem com as 4 vistas do mesmo móvel em
grade 2×2 (3/4, frente, lateral, traseira).

**Por que numa imagem só, e não 4 chamadas:** chamadas separadas produzem
móveis diferentes — a IA varia proporção, nº de ripas e tipo de pé a cada
geração. Pedindo as 4 vistas na mesma composição, elas nascem coerentes por
construção. Decisão do usuário, e está certa.

```bash
node scripts/gerar-referencias.mjs            # piloto (01, 10, 22)
node scripts/gerar-referencias.mjs 05 17 40   # códigos específicos
node scripts/gerar-referencias.mjs --todos    # o catálogo inteiro
```

Modelo: `gemini-3-pro-image`. Saída em `assets/referencias/`, ~400 KB por
folha. O prompt proíbe explicitamente texto, número, cota, cão e cenário —
número na imagem viraria medida falsa (ver regra 9.2 logo abaixo).

**Status: as 50 folhas de referência foram geradas em 17/09/2026 — lote
completo, 0 falhas.** Estão todas em `assets/referencias/<codigo>-<slug>.png`
(ex.: `01-casinha-classica.png`), ~400-500 KB cada. Conferidas por amostragem
(casinha, comedouro duplo, kit de agility) — consistentes entre si no mesmo
tom de madeira clara e fita de borda, sem texto/número/cão. Algumas vieram
com uma linha divisória fina entre os quadrantes (o prompt pede pra evitar,
nem sempre a IA obedece) — não compromete o uso como referência.

Estas imagens são MATERIAL BRUTO para montar as fichas técnicas depois — não
são as imagens finais da página de vendas nem foram plugadas nos slots
`data-ph` do `index.html` ainda. Isso é um passo seguinte, não feito.

**Decisão confirmada em 17/09/2026: manter a grade única (1 imagem, 4 vistas),
não migrar para 4 imagens separadas por móvel.** Chegou a ser testado um
formato de 4 chamadas encadeadas com prompt extenso por perspectiva (mais
detalhe, mas 4x mais caro) — a vista lateral saiu errada nesse teste (a IA
repetiu o frontão triangular da frente/fundos em vez do perfil verdadeiro,
que deveria ser uma silhueta longa e baixa vista de lado). O aprendizado foi
incorporado de volta ao prompt da grade única (instrução explícita contra
esse erro na vista `bottom-left`), sem adotar o formato mais caro. Os
scripts do teste (`prompt-casinha-classica.mjs`, `gerar-casinha-piloto.mjs`,
`regenerar-lateral.mjs`) foram removidos por não fazerem parte do pipeline.

**Credenciais:** `~/.gemini/credentials.env`, `GEMINI_API_KEY`. A chave
antiga (de agosto, formato `AQ.Ab8RN6L...`) pertencia a um projeto do AI
Studio **sem saldo** e devolvia `429 RESOURCE_EXHAUSTED` mesmo com o painel
mostrando crédito — o saldo é por projeto. Substituída em 17/09/2026 pela
chave do projeto "IMAGNES CALUDE"; a do projeto "Pelvico" ficou como
`GEMINI_API_KEY_ALT`. Backup da anterior em `credentials.env.bak-20260917`.
Se voltar 429, testar a ALT antes de supor que o crédito acabou.

### ⚠️ Ressalva sobre as 50 fichas entregues (18/09/2026) — LER ANTES DE PUBLICAR

O usuário trouxe um pacote completo gerado por IA de imagem em
`ENTREGA-CATALOGO-50-PROJETOS-CAES/`: 50 fichas técnicas A4 prontas
(`fichas-tecnicas/`), 5 páginas de abertura (`paginas-iniciais/`) e 50
referências de móvel (`referencias-moveis/`). Visualmente é um trabalho muito
bom — os 5 blocos da ficha (produto montado, medidas, peças, material/corte,
montagem) mais um bônus (vista explodida) que não estava no escopo original.

**Mas as fichas exibem medidas exatas em centímetros (ex.: "Base 100×70 cm",
"Pés 7×7×70 cm") que foram geradas pela IA de imagem, sem nenhuma camada de
dados real por trás.** Isso é exatamente o que a regra 9.2 da skill
`padrao-lowticket` proíbe:

> "A imagem gerada por IA nunca é fonte de medida de corte... se essa camada
> de dados ainda não existe, a ficha não pode alegar medida exata; sinalizar
> isso ao usuário antes de gerar conteúdo com números fictícios."

Eu sinalizei isso ao usuário (ver a pergunta que fiz sobre revisar/validar/
construir a camada de dados) e a resposta dele foi **seguir em frente com o
material como está**, priorizando preencher a seção "Veja por dentro" da
página — ele não escolheu explicitamente entre as 3 opções que dei (revisar
as medidas, vender com aviso, ou construir a camada de dados primeiro).

**Isso significa que a ressalva está registrada, mas NÃO resolvida.** Se
qualquer sessão futura for declarar a página "pronta para vender" ou "pronta
pra publicar", isto tem que ser trazido de volta à mesa antes — não assumir
que o silêncio do usuário sobre essa pergunta específica é aprovação da
opção "vender assim mesmo". Fichas com medida que não fecha geometricamente
= chapa de MDF perdida no cliente real, que é a dor exata que a página
promete resolver.

O que já está confirmado como uso aceito por ora: usar 10 dessas fichas como
AMOSTRA no carrossel `.ficha-marquee` da página de vendas (prova visual de
qualidade, seção "veja por dentro") — isso é diferente de vender o pacote
completo dos 50 como entrega final.

### Sobre o flipbook — RESOLVIDO em 18/09/2026

Gerado a partir das 5 páginas de `ENTREGA-CATALOGO-50-PROJETOS-CAES/paginas-iniciais/`
(capa, boas-vindas, como usar, categorias, "agora é com você" — nenhuma delas
é um projeto de conteúdo real, todas cabem na regra da prévia).

URL ao vivo: **`https://heyzine.com/flip-book/d5c314f2ed.html`** — já
embedada no `src` do iframe da seção 4 (`.ep-frame--flip`).

Fluxo usado: `scripts/previa-pdf.cjs` (copiado da skill `padrao-lowticket`,
precisa de `sharp` — instalado como devDependency) gerou `previa.pdf` (5
páginas, 1.63 MB) a partir de uma pasta temporária com as páginas renomeadas
`1.png`...`5.png`. Publicado num deploy Vercel **de produção** (não
`--temporary`, que fica atrás de SSO do Deployment Protection e bloqueia o
Heyzine de baixar o PDF — armadilha nova, não documentada na skill até este
projeto). Convertido com `node ~/.heyzine/heyzine.mjs converter --pdf <url> --confirmar`.

**Armadilha nova descoberta aqui:** `vercel deploy --temporary --yes` (o
comando que a skill recomenda) cria um deployment protegido por SSO —
`curl` na URL devolve 302 pro login do Vercel, e o Heyzine não consegue
baixar o PDF por trás disso. A saída que funcionou foi rodar
`vercel deploy --yes` seguido de `vercel deploy --prod --yes` no mesmo
projeto e usar o **alias de produção** (`vercel project ls` mostra a
"Latest Production URL", ex. `https://deploy-phi-two-26.vercel.app`), que não
tem essa proteção. Sempre `curl -I` a URL antes de mandar pro Heyzine —
um 302 pra `vercel.com/sso-api` é o sintoma.

**Falso alarme ao testar:** o iframe tem `loading="lazy"`, então um
screenshot automatizado que força `.reveal.in` sem rolar a página de verdade
mostra o retângulo branco vazio — parece que o embed não funciona, mas é só
o lazy-load que não disparou. Sempre `scrollIntoViewIfNeeded()` (ou rolar de
verdade) antes de tirar print da seção "Veja por dentro".

Armadilhas antigas que continuam valendo: `k` recebe o Client Id (não a API
key); nunca passar `title`/`description` (renderizam atrás do flipbook); e
flipbook não se edita — todo ajuste é uma reconversão com ID novo (o ID
`d5c314f2ed` acima já consumiu 1 conversão; não gerar de novo sem necessidade
real).

## Contagem que precisa bater

O `.cat-marquee` nomeia **32 projetos** e fecha com **"+ 18 outros projetos"**
(32 + 18 = 50). Se a lista mudar de tamanho, recalcular — foi exatamente esse
o bug que o irmão carregou por meses ("+35" quando já eram 100).

## Servidor de preview local

O processo não sobrevive ao fim da sessão. Para subir de novo:

```bash
cd "c:/Users/Usuário/Desktop/PROJETOS/50 Projetos para pets"
npx vite build
nohup npx vite preview --port 4190 --strictPort > .preview.log 2>&1 &
sleep 3
curl -s -o /dev/null -m 8 -w "HTTP %{http_code}\n" http://localhost:4190/
```

## Decisões a não reabrir

- 3D nunca volta a ser atração central (lição paga no produto irmão).
- A copy fala com quem FABRICA e VENDE, nunca com o dono do cão.
- Nada de projeto "de enfeite" sem demanda comercial real na lista dos 50.
- Sem aviso de "pré-venda" ou placeholder visível na página final — os
  placeholders atuais são andaime de desenvolvimento e saem antes do ar.
