import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const raiz = process.cwd();
const pastaBases = path.join(raiz, "assets", "criativos-feed", "bases");
const pastaSaida = path.join(raiz, "assets", "criativos-feed", "finais");
mkdirSync(pastaSaida, { recursive: true });

const criativos = [
  {
    arquivo: "01-identidade-seca",
    selo: "CATÁLOGO DIGITAL PARA MARCENEIROS",
    titulo: ["MARCENEIRO"],
    tamanho: 91,
    subtitulo: ["50 projetos de móveis para cães, com", "medidas, peças e montagem visual"],
  },
  {
    arquivo: "02-pergunta-mdf",
    selo: "UMA NOVA LINHA PARA SUA OFICINA",
    titulo: ["VOCÊ TRABALHA", "COM MDF?"],
    tamanho: 73,
    subtitulo: ["Existe uma linha pet que quase", "ninguém fabrica ainda"],
  },
  {
    arquivo: "03-volume",
    selo: "VOLUME REAL DE CONTEÚDO",
    titulo: ["50 PROJETOS PET"],
    tamanho: 84,
    subtitulo: ["Casinha, cama elevada, rampa e cercadinho", "— tudo organizado em fichas visuais"],
  },
  {
    arquivo: "04-contraste",
    selo: "DO MÓVEL PRONTO À VISTA EXPLODIDA",
    titulo: ["NÃO É FOTO.", "É PROJETO."],
    tamanho: 78,
    subtitulo: ["50 modelos de móveis para cães com", "medidas sugeridas e vista explodida"],
  },
  {
    arquivo: "05-oportunidade",
    selo: "OPORTUNIDADE PARA MARCENEIROS",
    titulo: ["A LINHA QUE FALTA", "NO SEU CATÁLOGO"],
    tamanho: 65,
    subtitulo: ["50 projetos de marcenaria pet organizados", "para planejar e construir"],
  },
  {
    arquivo: "06-capacidade",
    selo: "USE AS FERRAMENTAS QUE VOCÊ JÁ TEM",
    titulo: ["SUA SERRA", "JÁ FAZ ISSO"],
    tamanho: 82,
    subtitulo: ["50 projetos de móveis para cães usando", "a lógica de marcenaria que você já conhece"],
  },
  {
    arquivo: "07-mercado",
    selo: "DADO DE MERCADO",
    titulo: ["NICHO PEQUENO?"],
    tamanho: 85,
    subtitulo: ["O setor pet projetou R$ 78 bi em", "faturamento no Brasil em 2025"],
    fonte: "Fonte: Abempet/IPB — projeção de mercado para 2025",
  },
  {
    arquivo: "08-conteudo",
    selo: "VEJA O QUE VEM DENTRO",
    titulo: ["✓ MEDIDAS · PEÇAS", "· MONTAGEM"],
    tamanho: 61,
    subtitulo: ["Biblioteca visual com 50 projetos", "de móveis para cães"],
  },
  {
    arquivo: "09-objecao",
    selo: "UMA LINHA AINDA POUCO EXPLORADA",
    titulo: ["QUASE NINGUÉM", "FABRICA ISSO"],
    tamanho: 72,
    subtitulo: ["50 projetos pet para desenvolver uma", "nova linha de produtos na sua oficina"],
  },
  {
    arquivo: "10-preco",
    selo: "ACESSO BÁSICO À BIBLIOTECA",
    titulo: ["R$ 22,90"],
    tamanho: 124,
    corTitulo: "#FF5A0A",
    subtitulo: ["Biblioteca com 50 projetos", "de móveis para cães"],
  },
];

const escapar = (texto) =>
  texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function linhasSvg(linhas, x, y, tamanho, altura, classe = "titulo") {
  return linhas
    .map(
      (linha, indice) =>
        `<text x="${x}" y="${y + indice * altura}" class="${classe}">${escapar(linha)}</text>`
    )
    .join("\n");
}

function svgDoCriativo(item) {
  // Reserva uma zona limpa entre o selo e o título. Títulos muito grandes,
  // especialmente o preço, precisam de uma linha-base um pouco mais baixa.
  const tituloY = item.arquivo === "10-preco" ? 205 : 184;
  const alturaTitulo = Math.round(item.tamanho * 0.94);
  const fimTitulo = tituloY + (item.titulo.length - 1) * alturaTitulo;
  const subtituloY = fimTitulo + 66;
  const fimSubtitulo = subtituloY + (item.subtitulo.length - 1) * 39;
  const fonteY = item.fonte ? fimSubtitulo + 31 : null;
  const entregaY = (fonteY ?? fimSubtitulo) + 38;
  const corTitulo = item.corTitulo ?? "#0B2540";

  return Buffer.from(`
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="1"/>
          <stop offset="0.78" stop-color="#ffffff" stop-opacity="0.96"/>
          <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
        <filter id="sombra" x="-20%" y="-40%" width="140%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="10" flood-color="#0B2540" flood-opacity="0.12"/>
        </filter>
        <style>
          .selo { font: 800 20px Arial, sans-serif; letter-spacing: 1.8px; fill: #ffffff; }
          .titulo { font: 900 ${item.tamanho}px 'Arial Black', Arial, sans-serif; letter-spacing: -2px; fill: ${corTitulo}; }
          .subtitulo { font: 600 33px Arial, sans-serif; fill: #31445A; }
          .fonte { font: 500 19px Arial, sans-serif; fill: #667587; }
          .entregaRotulo { font: 700 15px Arial, sans-serif; letter-spacing: 1.3px; fill: #667587; }
          .entregaNome { font: 800 22px Arial, sans-serif; fill: #0B2540; }
          .ou { font: 800 15px Arial, sans-serif; fill: #8B98A7; }
        </style>
      </defs>

      <rect x="0" y="0" width="1080" height="510" fill="url(#fade)"/>
      <rect x="68" y="32" width="${Math.min(750, 48 + item.selo.length * 13)}" height="43" rx="21.5" fill="#FF5A0A"/>
      <text x="91" y="61" class="selo">${escapar(item.selo)}</text>

      ${linhasSvg(item.titulo, 68, tituloY, item.tamanho, alturaTitulo)}
      ${linhasSvg(item.subtitulo, 70, subtituloY, 33, 39, "subtitulo")}
      ${item.fonte ? `<text x="70" y="${fonteY}" class="fonte">${escapar(item.fonte)}</text>` : ""}

      <g transform="translate(68 ${entregaY})" filter="url(#sombra)">
        <rect x="0" y="0" width="672" height="72" rx="18" fill="#ffffff" stroke="#DDE4EA" stroke-width="2"/>
        <g transform="translate(18 12)">
          <circle cx="24" cy="24" r="24" fill="#21B35B"/>
          <path d="M15 14c2-3 5-4 7-1l3 5c1 2 0 4-2 5l-2 1c3 5 7 9 12 12l1-2c1-2 3-3 5-2l5 3c3 2 2 5-1 7-3 2-7 3-11 1-9-4-18-13-22-22-2-4-1-8 1-11Z" fill="#fff" transform="scale(.68) translate(7 8)"/>
        </g>
        <text x="82" y="25" class="entregaRotulo">RECEBA NO</text>
        <text x="82" y="51" class="entregaNome">WHATSAPP</text>
        <text x="235" y="43" class="ou">OU</text>
        <g transform="translate(274 12)">
          <rect width="48" height="48" rx="12" fill="#fff" stroke="#DDE4EA"/>
          <path d="M8 13 24 26 40 13v24H8Z" fill="#fff" stroke="#EA4335" stroke-width="4" stroke-linejoin="round"/>
          <path d="M8 13 24 26 40 13" fill="none" stroke="#EA4335" stroke-width="4" stroke-linejoin="round"/>
        </g>
        <text x="336" y="25" class="entregaRotulo">RECEBA NO</text>
        <text x="336" y="51" class="entregaNome">E-MAIL</text>
        <path d="M565 22h76M621 12l20 10-20 10" fill="none" stroke="#FF5A0A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>
  `);
}

const saidas = [];
for (const item of criativos) {
  const entrada = path.join(pastaBases, `${item.arquivo}.png`);
  const saida = path.join(pastaSaida, `${item.arquivo}-feed-1080x1350.png`);
  await sharp(entrada)
    .resize(1080, 1350, { fit: "cover" })
    .composite([{ input: svgDoCriativo(item), top: 0, left: 0 }])
    .png({ compressionLevel: 9, quality: 95 })
    .toFile(saida);
  saidas.push(saida);
  console.log(`OK ${path.basename(saida)}`);
}

const miniaturas = await Promise.all(
  saidas.map((arquivo) => sharp(arquivo).resize(216, 270, { fit: "cover" }).png().toBuffer())
);
await sharp({
  create: { width: 1080, height: 540, channels: 3, background: "#ffffff" },
})
  .composite(
    miniaturas.map((input, indice) => ({
      input,
      left: (indice % 5) * 216,
      top: Math.floor(indice / 5) * 270,
    }))
  )
  .png({ compressionLevel: 9 })
  .toFile(path.join(pastaSaida, "00-preview-10-criativos.png"));
