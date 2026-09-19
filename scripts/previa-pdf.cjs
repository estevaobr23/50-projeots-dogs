/* Monta o PDF da PRÉVIA do flipbook a partir das páginas do ebook.
   Regra: entram só as páginas ANTES do conteúdo real (capa, contracapa,
   páginas-guia e índices). O conteúdo em si fica só no carrossel da página.

   uso: node scripts/previa-pdf.cjs <pasta-das-imagens> <ate-a-pagina> <saida.pdf>
   ex.: node scripts/previa-pdf.cjs "C:/.../Imagens ebook" 12 previa.pdf

   Sem dependência de biblioteca de PDF: embute os JPEG direto com DCTDecode. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [PASTA, ATE, SAIDA] = process.argv.slice(2);
if (!PASTA || !ATE || !SAIDA) {
  console.error('uso: node scripts/previa-pdf.cjs <pasta> <ate-a-pagina> <saida.pdf>');
  process.exit(1);
}

const LARGURA = 595, ALTURA = 842;   // A4 em pontos
const QUALIDADE = 82;

(async () => {
  const paginas = [];
  for (let n = 1; n <= Number(ATE); n++) {
    const arq = path.join(PASTA, `${n}.png`);
    if (!fs.existsSync(arq)) { console.error('faltando: ' + arq); process.exit(1); }
    const jpg = await sharp(arq)
      .resize(1240, 1754, { fit: 'inside', withoutEnlargement: true })  // ~150dpi
      .jpeg({ quality: QUALIDADE, chromaSubsampling: '4:4:4' })
      .toBuffer();
    const m = await sharp(jpg).metadata();
    paginas.push({ jpg, w: m.width, h: m.height });
    process.stdout.write(`  pág ${String(n).padStart(2)} · ${m.width}x${m.height} · ${(jpg.length / 1024).toFixed(0)}KB\n`);
  }

  const partes = [];
  const offsets = [];
  let pos = 0;
  const escrever = (buf) => {
    const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf, 'latin1');
    partes.push(b); pos += b.length;
  };
  const objeto = (num, corpo, fluxo) => {
    offsets[num] = pos;
    escrever(`${num} 0 obj\n${corpo}\n`);
    if (fluxo) { escrever('stream\n'); escrever(fluxo); escrever('\nendstream\n'); }
    escrever('endobj\n');
  };

  const N = paginas.length;
  const idPagina = (i) => 3 + i * 3;        // página, conteúdo, imagem
  const kids = paginas.map((_, i) => `${idPagina(i)} 0 R`).join(' ');

  escrever('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  objeto(1, '<< /Type /Catalog /Pages 2 0 R >>');
  objeto(2, `<< /Type /Pages /Kids [${kids}] /Count ${N} >>`);

  paginas.forEach((p, i) => {
    const idP = idPagina(i), idC = idP + 1, idI = idP + 2;
    // encaixa a imagem na página mantendo a proporção
    const escala = Math.min(LARGURA / p.w, ALTURA / p.h);
    const w = p.w * escala, h = p.h * escala;
    const x = (LARGURA - w) / 2, y = (ALTURA - h) / 2;
    const conteudo = `q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm /Im0 Do Q`;

    objeto(idP, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${LARGURA} ${ALTURA}] ` +
      `/Resources << /XObject << /Im0 ${idI} 0 R >> /ProcSet [/PDF /ImageC] >> /Contents ${idC} 0 R >>`);
    objeto(idC, `<< /Length ${conteudo.length} >>`, Buffer.from(conteudo, 'latin1'));
    objeto(idI, `<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpg.length} >>`, p.jpg);
  });

  const totalObj = 2 + N * 3;
  const inicioXref = pos;
  let xref = `xref\n0 ${totalObj + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObj; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  escrever(xref);
  escrever(`trailer\n<< /Size ${totalObj + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`);

  fs.writeFileSync(SAIDA, Buffer.concat(partes));
  console.log(`\n${SAIDA} · ${N} páginas · ${(fs.statSync(SAIDA).size / 1024 / 1024).toFixed(2)} MB`);
})();
