import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const raiz = process.cwd();
// A versão com fundo claro preserva integralmente as bordas dos dispositivos
// e das fichas, sem os artefatos do recorte automático antigo.
const mockup = path.join(raiz, "assets", "mockups", "hero-header.png");
const saida = path.join(raiz, "assets", "criativos-feed", "validacao-v2");
mkdirSync(saida, { recursive: true });

const pecas = [
  {
    arquivo: "01-filtro-mdf",
    titulo: ["VOCÊ TRABALHA", "COM MDF?"],
    tamanho: 76,
    subtitulo: ["Existe uma linha pet que quase", "ninguém fabrica ainda"],
    detalhe: "#FF5A0A",
  },
  {
    arquivo: "02-volume-50-projetos",
    titulo: ["50 PROJETOS PET"],
    tamanho: 92,
    subtitulo: ["Casinha, cama elevada, rampa e cercadinho", "em uma biblioteca visual organizada"],
    detalhe: "#FF5A0A",
  },
  {
    arquivo: "03-oportunidade-catalogo",
    titulo: ["A LINHA QUE FALTA", "NO SEU CATÁLOGO"],
    tamanho: 67,
    subtitulo: ["50 projetos de marcenaria pet para", "planejar uma nova linha de produtos"],
    detalhe: "#0B2540",
  },
  {
    arquivo: "04-medidas-pecas-montagem",
    titulo: ["MEDIDAS · PEÇAS", "· MONTAGEM"],
    tamanho: 67,
    subtitulo: ["Veja as fichas, os componentes e a sequência", "visual de cada projeto"],
    detalhe: "#FF5A0A",
  },
  {
    arquivo: "05-preco-2290",
    titulo: ["R$ 22,90"],
    tamanho: 132,
    corTitulo: "#FF5A0A",
    subtitulo: ["Biblioteca digital com 50 projetos", "de móveis para cães"],
    detalhe: "#FF5A0A",
  },
];

const escapar = (texto) =>
  texto.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function textosCentralizados(linhas, y, tamanho, entrelinha, classe) {
  return linhas
    .map(
      (linha, indice) =>
        `<text x="540" y="${y + indice * entrelinha}" text-anchor="middle" class="${classe}">${escapar(linha)}</text>`
    )
    .join("\n");
}

function fundoSvg(item) {
  return Buffer.from(`
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fundo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/>
          <stop offset="0.72" stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#F7F9FB"/>
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="48%" r="55%">
          <stop offset="0" stop-color="#FFF2E9" stop-opacity="0.95"/>
          <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1080" height="1350" fill="url(#fundo)"/>
      <ellipse cx="540" cy="620" rx="510" ry="430" fill="url(#halo)"/>
      <circle cx="540" cy="600" r="390" fill="none" stroke="${item.detalhe}" stroke-width="3" opacity="0.08"/>
      <circle cx="540" cy="600" r="350" fill="none" stroke="#0B2540" stroke-width="2" opacity="0.05"/>
      <path d="M120 228H960" stroke="${item.detalhe}" stroke-width="5" stroke-linecap="round" opacity="0.9"/>
    </svg>
  `);
}

function frenteSvg(item) {
  const duasLinhas = item.titulo.length === 2;
  const tituloY = duasLinhas ? 103 : 150;
  const entrelinha = duasLinhas ? Math.round(item.tamanho * 0.94) : item.tamanho;
  const corTitulo = item.corTitulo ?? "#0B2540";
  return Buffer.from(`
    <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sombra" x="-20%" y="-50%" width="140%" height="220%">
          <feDropShadow dx="0" dy="7" stdDeviation="10" flood-color="#0B2540" flood-opacity="0.13"/>
        </filter>
        <style>
          .titulo { font: 900 ${item.tamanho}px 'Arial Black', Arial, sans-serif; letter-spacing: -2px; fill: ${corTitulo}; }
          .subtitulo { font: 700 32px Arial, sans-serif; fill: #31445A; }
          .apoioRotulo { font: 700 16px Arial, sans-serif; letter-spacing: 1.4px; fill: #6B7A8C; }
          .apoioNome { font: 900 23px Arial, sans-serif; fill: #0B2540; }
          .ou { font: 800 17px Arial, sans-serif; fill: #8B98A7; }
          .rodape { font: 800 16px Arial, sans-serif; letter-spacing: 2.1px; fill: #FF5A0A; }
        </style>
      </defs>

      ${textosCentralizados(item.titulo, tituloY, item.tamanho, entrelinha, "titulo")}

      <rect x="80" y="982" width="920" height="112" rx="28" fill="#FFFFFF" fill-opacity="0.96"/>
      ${textosCentralizados(item.subtitulo, 1021, 32, 39, "subtitulo")}

      <g transform="translate(190 1130)" filter="url(#sombra)">
        <rect x="0" y="0" width="700" height="88" rx="24" fill="#FFFFFF" stroke="#DDE4EA" stroke-width="2"/>
        <g transform="translate(28 20)">
          <circle cx="24" cy="24" r="24" fill="#21B35B"/>
          <path d="M15 14c2-3 5-4 7-1l3 5c1 2 0 4-2 5l-2 1c3 5 7 9 12 12l1-2c1-2 3-3 5-2l5 3c3 2 2 5-1 7-3 2-7 3-11 1-9-4-18-13-22-22-2-4-1-8 1-11Z" fill="#fff" transform="scale(.68) translate(7 8)"/>
        </g>
        <text x="92" y="32" class="apoioRotulo">RECEBA NO</text>
        <text x="92" y="60" class="apoioNome">WHATSAPP</text>
        <text x="288" y="53" class="ou">OU</text>
        <g transform="translate(338 20)">
          <rect width="48" height="48" rx="12" fill="#fff" stroke="#DDE4EA"/>
          <path d="M8 13 24 26 40 13v24H8Z" fill="#fff" stroke="#EA4335" stroke-width="4" stroke-linejoin="round"/>
          <path d="M8 13 24 26 40 13" fill="none" stroke="#EA4335" stroke-width="4" stroke-linejoin="round"/>
        </g>
        <text x="402" y="32" class="apoioRotulo">RECEBA NO</text>
        <text x="402" y="60" class="apoioNome">E-MAIL</text>
      </g>
      <text x="540" y="1282" text-anchor="middle" class="rodape">ACESSO DIGITAL · ENTREGA IMEDIATA</text>
    </svg>
  `);
}

const mockupPreparado = await sharp(mockup)
  // Elimina a borda residual de 2–3 px existente nas laterais do arquivo-fonte.
  .resize({ width: 1006, height: 735, fit: "fill" })
  .extract({ left: 3, top: 0, width: 1000, height: 735 })
  .flatten({ background: "#FFFFFF" })
  .png()
  .toBuffer();

const finais = [];
for (const item of pecas) {
  const destino = path.join(saida, `${item.arquivo}-feed-1080x1350.png`);
  await sharp({
    create: { width: 1080, height: 1350, channels: 4, background: "#FFFFFF" },
  })
    .composite([
      { input: fundoSvg(item), top: 0, left: 0 },
      { input: mockupPreparado, top: 245, left: 40 },
      { input: frenteSvg(item), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 9, quality: 96 })
    .toFile(destino);
  finais.push(destino);
  console.log(`OK ${path.basename(destino)}`);
}

const thumbs = await Promise.all(
  finais.map((arquivo) => sharp(arquivo).resize(270, 338, { fit: "cover" }).png().toBuffer())
);

await sharp({
  create: { width: 1350, height: 338, channels: 3, background: "#FFFFFF" },
})
  .composite(thumbs.map((input, indice) => ({ input, left: indice * 270, top: 0 })))
  .png({ compressionLevel: 9 })
  .toFile(path.join(saida, "00-preview-5-criativos-validacao.png"));
