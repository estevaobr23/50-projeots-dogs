# Contexto — Integrar "50 Projetos de Móveis para Cães" na área de membros existente

Criado em 18/09/2026. Este arquivo é para a sessão que for trabalhar **dentro
do projeto da área de membros** (`PROJETOS 3D MOVEIS PARA GATOS`), não para
quem trabalha na página de vendas. Leia ele inteiro antes de tocar em
catálogo, banco ou webhook.

## O pedido, em uma frase

A área de membros que hoje só vende **"100 Projetos de Móveis 3D para
Gatos"** vai passar a vender também **"50 Projetos de Móveis para Cães"**,
no mesmo motor, com a marca da área renomeada de algo focado em gato para
**"Central do Marceneiro Pet"** — um hub multi-produto pet, não uma loja de
um produto só.

**Isto é o Fluxo A da skill `area-de-membros`** ("novo produto numa área que
já existe"), não o Fluxo B. Mesma base de clientes (marceneiros/makers),
mesmo Supabase, mesmo motor de login e webhook. Não criar projeto novo, não
criar banco novo, não clonar nada. Se você (a sessão que está lendo isto)
chegar à conclusão de que precisa de um Supabase novo ou de um app novo,
pare e confirme com o usuário — isso contradiz o que já foi decidido aqui.

Carregue a skill `area-de-membros` no início da sessão e siga o **Fluxo A**
dela (seção "Fluxo A — novo produto em área existente") passo a passo. Este
documento complementa aquele fluxo com o que é específico deste caso.

---

## 1. Onde está cada coisa (não adivinhar, usar exatamente isto)

| Peça | Valor |
|---|---|
| Projeto da área de membros (código) | `C:\Users\Usuário\Desktop\PROJETOS\PROJETOS 3D MOVEIS PARA GATOS` |
| Projeto Supabase da área (⚠️ não confundir) | `acervo-3d-membros`, id `mgkesaaozigpyktmxmgj`, região `sa-east-1` |
| Supabase que NÃO é este (outro produto, outro cliente) | `gatos-membros`, id `xcopknglpddvkqalafml` — **nunca tocar nele por engano** |
| Webhook existente | Edge Function `cakto-webhook`, no projeto Supabase acima, `verify_jwt: false` |
| Gateway | Cakto (não é Wiapy) |
| Produto atual (gatos) na Cakto | `product.id` = `53893d88-1a58-4b12-b632-b17f07b28dcb`, 3 ofertas no mesmo checkout `1107648` (VIP/Downsell/Básico), webhook não distingue plano |
| App webhook na Cakto | id `68595`, nome "Acervo 3D - Área de Membros", evento `purchase_approved`, **vinculado só ao produto de gatos acima** |
| Catálogo da vitrine (código) | `lib/config/catalogo.ts` — array `CATALOGO: Produto[]`, **já é multi-produto por design** |
| Documentação viva do projeto | `contexto.md` (desatualizado quanto a acesso — avisa isso no topo) e `gpt.md`, seção **"Área de membros — fluxo de acesso"** (a fonte de verdade atual, 17/09/2026) |
| Página de vendas do produto de cães (fonte do conteúdo a integrar) | `C:\Users\Usuário\Desktop\PROJETOS\50 Projetos para pets` — ler `contexto.md` de lá para entender o produto, preço, bônus e pendências |

---

## 2. O que já está pronto e não precisa ser inventado

**A arquitetura já suporta multi-produto.** `lib/config/catalogo.ts` é
literalmente um array de `Produto`, cada um com seu próprio
`caktoProductId`, capa, itens (principal + bônus) e `aVenda`. Adicionar cães
é **adicionar um segundo elemento no array**, não reestruturar nada. A prova
disso está no comentário do próprio arquivo:

> "Ao adicionar um produto novo aqui, confirme que existe a linha
> correspondente em `products` no banco (mesmo `cakto_product_id`) — senão
> ninguém terá acesso."

Ou seja: o schema do banco (`products`, `customers`, `purchases`,
`purchase_items`, `entitlements`) **já é genérico e multi-produto**. Não é
preciso criar tabela nova nem migração de schema — só uma linha nova em
`products` para o produto de cães.

## 3. O que precisa ser feito (checklist, na ordem do Fluxo A da skill)

### 3.1 Criar o produto "50 Projetos de Móveis para Cães" na Cakto

Use a skill `criar-produto-cakto` para isto, no padrão validado (descrição
100+, página de vendas preenchida, PIX padrão, visual casado com a página).
A página de vendas já existe e está pronta para servir de referência visual
e de copy: `C:\Users\Usuário\Desktop\PROJETOS\50 Projetos para pets\index.html`.

Preço e ofertas a replicar (já definidos e usados na página de vendas):
- VIP (completo + 4 bônus): **R$ 29,90**
- Básico (só o catálogo): **R$ 22,90**
- Downsell: **R$ 25,90**

⚠️ **O nome do produto cadastrado na Cakto precisa ser EXATO** — é a rede de
segurança do casamento por título que o webhook usa como fallback quando o
`product.id` não bate. Use literalmente "50 Projetos de Móveis para Cães"
(ou o nome final que ficar decidido) e garanta que é o mesmo texto em todo
lugar: Cakto, `products.name` no Supabase, e qualquer lugar que exiba o
título.

Depois de criado, anote o `product.id` real da Cakto — vai para o passo 3.2
e 3.3.

### 3.2 Vincular o webhook ao produto novo — PASSO QUE NÃO PODE SER PULADO

🚨 Isto é o ponto mais perigoso de todo este trabalho, registrado em
destaque na skill `area-de-membros` porque **já custou R$1.431,20 em 68
acessos não entregues em outro projeto**: a Cakto não dispara webhook pra
conta inteira — só para os produtos explicitamente vinculados ao app
webhook. Um produto novo, criado e vendendo normalmente, **não gera nenhum
evento** se ninguém lembrar de vincular.

Passos:
1. No painel da Cakto, abrir o app webhook existente (id `68595`, "Acervo 3D
   - Área de Membros") — ou decidir, junto com o usuário, se o produto de
   cães usa o mesmo app webhook (adicionando o produto novo à lista) ou um
   app webhook próprio. Qualquer uma das duas funciona tecnicamente; a mais
   simples é adicionar à lista existente.
2. Vincular explicitamente o `product.id` do produto de cães à lista de
   produtos que esse app webhook escuta.
3. **Fazer isso no mesmo passo da criação do produto, nunca depois** — é
   exatamente o intervalo entre "criei o produto" e "lembrei de vincular"
   que gerou o incidente registrado no outro projeto.
4. Confirmar com uma venda de teste real ou com o script da skill (ver 3.5)
   antes de considerar concluído.

### 3.3 Cadastrar o produto na tabela `products` do Supabase

No projeto `acervo-3d-membros` (`mgkesaaozigpyktmxmgj`), via MCP Supabase:

```sql
insert into products (slug, name, cakto_product_id)
values ('50-projetos-moveis-caes', 'Nome Exato Igual ao Cadastrado na Cakto', '<product.id real>');
```

Se o `product.id` real ainda não for conhecido no momento de cadastrar, use
o id do link do checkout como palpite — o webhook autocorrige sozinho na
primeira venda pelo casamento de título (ver regra de 3 camadas no `gpt.md`).
Avisar o usuário disso se for o caso.

### 3.4 Registrar a oferta em `lib/config/catalogo.ts`

Adicionar uma segunda entrada no array `CATALOGO`, seguindo exatamente o
padrão da entrada de gatos já existente (comentários do arquivo explicam
cada campo). Rascunho de partida — ajustar textos e capa de verdade antes de
publicar:

```ts
{
  slug: "50-projetos-moveis-caes",
  // IDÊNTICO ao products.cakto_product_id cadastrado no passo 3.3.
  caktoProductId: "<product.id real da Cakto>",
  titulo: "50 Projetos de Móveis para Cães",
  subtitulo:
    "Fichas técnicas visuais com medidas, relação de peças, material e passo a passo de montagem — 50 projetos em 8 categorias.",
  capa: "<caminho da capa deste produto, própria, nunca emprestada da de gatos>",
  itens: [
    {
      slug: "catalogo",
      tipo: "principal",
      titulo: "Os 50 projetos",
      descricao:
        "Casinhas, camas, comedouros, rampas de acessibilidade e móveis de apoio — cada um com ficha técnica completa.",
      capa: "<capa do item principal>",
      href: "/projetos-caes", // ou a rota real que a sessão decidir para o catálogo de cães
    },
    // + 4 itens tipo "bonus": Calculadora de Preço e Lucro, Gerador de
    // Orçamento, Catálogo Interativo, Lista de Compras Para Iniciantes —
    // mesmos bônus já usados na página de vendas, ver o contexto.md dela.
  ],
  aVenda: { precoBRL: 29.90, url: "<link de checkout VIP da Cakto>" },
},
```

⚠️ **O `slug` daqui precisa ser IDÊNTICO ao `products.slug` gravado no passo
3.3.** É a chave que liga o entitlement do cliente ao card na vitrine — se
divergir, o cliente paga e vê tela vazia com tudo "funcionando" por fora.
Testar isso, não conferir no olho.

### 3.5 Conteúdo real a entregar dentro do produto

O produto de cães ainda não tem o equivalente ao visualizador 3D + fichas
técnicas navegáveis que o produto de gatos tem (ver `contexto.md` do
projeto de cães, seção "Estado atual"). O que já existe pronto para reuso:

- **50 fichas técnicas em PNG** (A4 retrato), em
  `50 Projetos para pets/ENTREGA-CATALOGO-50-PROJETOS-CAES/fichas-tecnicas/`
- **50 imagens de referência 3D** (grade 2×2 de vistas), em
  `50 Projetos para pets/assets/referencias/`
- **21 imagens contextuais** (móvel + cão em uso), em
  `50 Projetos para pets/assets/vitrine/contextual/`

⚠️ **Ressalva que não pode ser esquecida ao publicar como conteúdo pago:**
as medidas exibidas nas 50 fichas técnicas foram geradas por IA de imagem,
**sem uma camada de dados real por trás** (o equivalente ao
`lib/projetos-tecnicos.ts` que o produto de gatos já tem). O usuário foi
avisado disso e decidiu seguir em frente para montar a v1 da página de
vendas com o material como está — mas isso **não foi resolvido**, só
registrado. Antes de declarar o produto "pronto para entregar de verdade"
dentro da área de membros, esta ressalva deveria voltar à mesa: fichas com
medida que não fecha geometricamente = chapa de MDF perdida no cliente
real. Ler a seção "⚠️ Ressalva sobre as 50 fichas entregues" no `contexto.md`
do projeto de cães antes de decidir se este conteúdo entra como está ou se
alguém revisa as medidas antes.

Decida com o usuário: o catálogo de cães entra nesta primeira versão como
**galeria de fichas estáticas** (mais simples, replica o formato PDF+imagem
que a skill já sabe servir — ver `references/entrega-de-conteudo.md`) ou
como **visualizador técnico completo igual ao de gatos** (motor R3F, GLBs,
modos Visual/Peças/Explodida/Montagem — mais trabalho, e os GLBs dos 50
móveis de cães **não existem ainda**, só as referências 2D). Não presumir
qual — perguntar.

### 3.6 Renomear a marca da área para "Central do Marceneiro Pet"

Isto é branding/UI, não arquitetura — mas precisa ser feito com cuidado para
não quebrar nada que dependa do nome antigo. Levantar (grep no projeto)
todo lugar que hoje assume que a área é só de gatos:

- título da aba/página, meta tags, `<title>`;
- textos de header/footer que mencionem "gatos" especificamente;
- nome do produto usado em e-mails/mensagens automáticas de acesso, se
  houver;
- qualquer copy de tela de login/boas-vindas que fale só de gato.

Trocar para uma marca neutra de hub multi-produto (`Central do Marceneiro
Pet` foi a sugestão do usuário) que funcione tanto para o produto de gatos
quanto para o de cães e para produtos futuros. **Não precisa, e não deve,
apagar ou renomear o produto de gatos** — ele continua vendendo e com
clientes ativos; a mudança é só a moldura/nome da plataforma em volta dos
produtos, a vitrine que já é multi-produto por design (seção 2 acima).

### 3.7 Validar antes de anunciar (obrigatório, não pular)

Seguir o passo 5 do Fluxo A da skill:

```bash
node scripts/testar-webhook.mjs --titulo "Nome Exato Igual ao do Gateway" --id-falso
```

Confirma a liberação de acesso com e-mail e id de transação falsos, exercita
a autocorreção por título, e limpa os dados de teste depois. Sem isso
rodado com sucesso, não considerar a integração pronta — foi exatamente a
ausência desse tipo de teste ponta a ponta que causou o incidente de 68
acessos perdidos registrado na skill.

Depois, medir as telas se algo de layout mudou
(`node scripts/medir-telas.mjs --cookie …`), e no fim **abrir a URL de
verdade** — listagem de ferramenta rodando não é prova de que está no ar.

---

## 4. Invariantes que não podem ser quebradas (resumo, a lista completa está na skill)

- `customers.email` é a identidade (UNIQUE, sempre trim+lowercase).
- Idempotência por `UNIQUE` no banco, nunca por `if` na aplicação.
- Produto desconhecido: não cadastra, não libera, só loga — nunca dar acesso
  por adivinhação.
- Só processa `purchase_approved` — nada de liberar pendente.
- Revogação de acesso (reembolso/chargeback) continua manual, nunca
  automática por webhook.
- Chave `service_role` do Supabase nunca vai para o browser.
- O `slug` do catálogo tem que ser idêntico ao `products.slug` — testar, não
  conferir no olho.
- Falta de acesso responde 404, nunca 403.
- Conteúdo pago nunca entra na árvore do Git em repo público.

## 5. Se algo der errado: como diagnosticar

Rodar nesta ordem no Supabase `mgkesaaozigpyktmxmgj` (a contagem onde para
indica o defeito — detalhe completo no `gpt.md`, seção "Como diagnosticar"):

```sql
select count(*) from customers;      -- a pessoa chegou?
select count(*) from purchases;      -- a compra foi registrada?
select count(*) from entitlements;   -- o acesso foi concedido?
```

`customers` = 0 → o webhook nunca chegou (secret, URL, produto não vinculado
ao app webhook na Cakto — ver 3.2). `purchases` = 0 com `customers` > 0 →
falhou antes de gravar, ver log da Edge Function. `entitlements` = 0 com
`purchases` > 0 → o webhook recusou o produto (checar `cakto_product_id`
salvo contra o `product.id` real do pedido).

---

## 6. Perguntas que a sessão deve fazer ao usuário antes de executar, não presumir

1. O nome final do produto na Cakto é exatamente "50 Projetos de Móveis
   para Cães", ou o usuário quer outro nome/variação?
2. O produto de cães usa o **mesmo app webhook** da Cakto que já existe
   (id `68595`), com o produto novo adicionado à lista, ou um app webhook
   **novo e separado**? (Qualquer um funciona; a skill recomenda o mesmo
   app quando é a mesma área de membros.)
3. O conteúdo entregue nesta primeira versão é a **galeria de fichas
   estáticas** (mais rápido) ou o **visualizador 3D completo** como o de
   gatos (exige gerar 50 GLBs que não existem ainda)?
4. A ressalva sobre medidas fictícias nas fichas (seção 3.5 acima) já foi
   resolvida, ou o produto vai ao ar como está, com essa limitação
   conhecida e não corrigida?
5. Links de checkout reais (VIP/Básico/Downsell) — ainda são os
   placeholders (`SUBSTITUIR_LINK_CHECKOUT_*`) na página de vendas; a
   criação do produto na Cakto (passo 3.1) é o que vai gerá-los de verdade.
