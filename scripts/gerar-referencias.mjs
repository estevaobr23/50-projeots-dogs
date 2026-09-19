/**
 * Gera a FOLHA DE REFERÊNCIA de cada móvel do catálogo: uma única imagem
 * contendo 4 vistas do MESMO móvel (3/4, frente, lateral, traseira).
 *
 * Por que numa imagem só: chamadas separadas produzem móveis diferentes —
 * a IA varia proporção, número de ripas e tipo de pé a cada geração. Pedindo
 * as 4 vistas na mesma composição, elas nascem obrigatoriamente coerentes
 * entre si, que é o que a etapa seguinte (montar a ficha técnica) precisa.
 *
 * Estas imagens são REFERÊNCIA VISUAL DE FORMA, não fonte de medida.
 * Nenhuma cota que apareça aqui vale como medida de corte (regra 9.2 da
 * skill padrao-lowticket) — por isso o prompt proíbe texto e números.
 *
 * Uso:
 *   node scripts/gerar-referencias.mjs            # piloto: os 3 primeiros
 *   node scripts/gerar-referencias.mjs 01 10 22   # códigos específicos
 *   node scripts/gerar-referencias.mjs --todos    # o catálogo inteiro
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const MODELO = 'gemini-3-pro-image';
const DESTINO = 'assets/referencias';
const CATALOGO = JSON.parse(
  fs.readFileSync(new URL('./catalogo.json', import.meta.url), 'utf8')
);

/* ---- credencial (fora do repositório, mesmo padrão de Heyzine/Cakto) ---- */
function lerChave() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const env = path.join(os.homedir(), '.gemini', 'credentials.env');
  const txt = fs.readFileSync(env, 'utf8');
  const m = txt.match(/^GEMINI_API_KEY=(.+)$/m);
  if (!m) throw new Error('GEMINI_API_KEY não encontrada em ' + env);
  return m[1].trim().replace(/^["']|["']$/g, '');
}

/* ---- o prompt ----
   Regras que vieram de erro real no projeto irmão:
   - nada de texto/número na imagem (viraria "medida" falsa)
   - nada de cão (atrapalha a leitura da forma na etapa de referência)
   - fundo branco e iluminação uniforme (a ficha é montada por cima) */
function montarPrompt(p) {
  return `Technical reference sheet of a single piece of pet furniture for dogs, for a woodworking project catalog.

SUBJECT: ${p.en}
${p.detalhe_en}

LAYOUT — one single continuous image divided into a 2x2 grid of four orthographic-style views of THE EXACT SAME piece of furniture, identical proportions, materials and construction details in every view:
- top-left: three-quarter perspective view
- top-right: front elevation
- bottom-left: side (profile) elevation — the camera has walked 90° around
  the object to look at its flank, NOT a repeat of the front/rear silhouette.
  If the object has a pitched or gabled roof, this view must show the roof
  as a long, low, elongated ridge line running across most of the width of
  its own frame (seen from the side), never as a narrow triangular gable
  filling the frame — that shape belongs only to the front/rear views.
- bottom-right: rear elevation
The four views float directly on the same seamless white background with NO dividing lines, NO grid lines, NO borders and NO panel separators between them — only empty white space separates one view from the next, exactly like the other reference sheets in this same batch.

STYLE: clean product render, pure white seamless background, soft even studio lighting, subtle contact shadow under each view, neutral natural wood (plywood/MDF) with visible edge banding and realistic wood grain, crisp edges, joinery and fasteners visible where they would really be.

STRICT RULES:
- absolutely NO text, NO numbers, NO dimension lines, NO arrows, NO labels, NO watermarks anywhere in the image
- NO dog, NO animal, NO person, NO plants, NO props, NO room, NO floor pattern
- all four views must depict the same object at the same scale
- photorealistic product photography look, not illustration or sketch`;
}

async function gerar(projeto, chave) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${chave}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: montarPrompt(projeto) }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  }

  const data = await resp.json();
  const partes = data?.candidates?.[0]?.content?.parts ?? [];
  const img = partes.find((x) => x.inlineData?.data);
  if (!img) {
    const motivo = data?.candidates?.[0]?.finishReason ?? 'sem imagem na resposta';
    throw new Error(`nenhuma imagem devolvida (${motivo})`);
  }

  fs.mkdirSync(DESTINO, { recursive: true });
  const arquivo = path.join(DESTINO, `${projeto.codigo}-${projeto.slug}.png`);
  fs.writeFileSync(arquivo, Buffer.from(img.inlineData.data, 'base64'));
  return arquivo;
}

/* ---- seleção ---- */
const args = process.argv.slice(2);
let fila;
if (args.includes('--todos')) fila = CATALOGO;
else if (args.length) fila = CATALOGO.filter((p) => args.includes(p.codigo));
else fila = CATALOGO.filter((p) => ['01', '10', '22'].includes(p.codigo)); // piloto

if (!fila.length) {
  console.error('Nenhum projeto corresponde aos códigos informados.');
  process.exit(1);
}

const chave = lerChave();
console.log(`Gerando ${fila.length} folha(s) de referência com ${MODELO}\n`);

let ok = 0;
for (const p of fila) {
  process.stdout.write(`  ${p.codigo} ${p.nome} ... `);
  try {
    const arq = await gerar(p, chave);
    const kb = (fs.statSync(arq).size / 1024).toFixed(0);
    console.log(`OK (${kb} KB)`);
    ok++;
  } catch (e) {
    console.log(`FALHOU — ${e.message}`);
  }
}

console.log(`\n${ok}/${fila.length} gerada(s) em ${DESTINO}/`);
