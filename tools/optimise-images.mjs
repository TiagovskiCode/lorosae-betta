#!/usr/bin/env node
/* ==========================================================================
   LOROSAE BETTA® — tools/optimise-images.mjs
   Prepara imagens acabadas de gerar/exportar para a web:
     · converte PNG (mesmo com extensão .jpg) para JPEG verdadeiro
     · reduz para --width px (por omissão 1600 para hero/editorial, 1122 nos restantes)
     · imagens em paisagem na pasta products/ são estendidas para 4:5 com fundo desfocado
       (solução provisória: o ideal é voltar a gerar a imagem em retrato)
     · guarda o original em assets/images/_originals/ (ignorado pelo git)
     · gera as versões WebP usadas pelo site: x.webp (largura total) e x-800.webp
   Só converte ficheiros PNG; JPEG já otimizados só recebem as versões WebP em falta.

   Requisito:  npm i sharp
   Uso:        node tools/optimise-images.mjs
               node tools/optimise-images.mjs assets/images/varieties
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

let sharp;
try { sharp = (await import("sharp")).default; } catch { console.error("Instale primeiro:  npm i sharp"); process.exit(1); }

const ROOT = process.env.LB_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = path.join(ROOT, "assets/images");
const ORIG = path.join(IMAGES, "_originals");
const target = path.resolve(ROOT, process.argv[2] || "assets/images");

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== "_originals") yield* walk(p); }
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) yield p;
  }
}

for (const file of walk(target)) {
  const buf = fs.readFileSync(file);
  const meta = await sharp(buf).metadata();
  if (meta.format !== "png") continue; // já é JPEG/WebP verdadeiro

  const rel = path.relative(IMAGES, file);
  const isProduct = rel.split(path.sep)[0] === "products";
  const maxW = isProduct || rel.startsWith("varieties") ? 1122 : 1600;
  const outPath = file.replace(/\.(png|jpe?g)$/i, ".jpg");

  const keep = path.join(ORIG, rel);
  fs.mkdirSync(path.dirname(keep), { recursive: true });
  if (!fs.existsSync(keep)) fs.writeFileSync(keep, buf);

  let input = buf;
  if (isProduct && meta.width / meta.height > 0.9) {
    const W = meta.width, H = Math.round(W * 1.25), fgH = meta.height, feather = Math.round(fgH * 0.1);
    const bg = await sharp(buf).resize(W, H, { fit: "cover" }).blur(38).modulate({ brightness: 0.55 }).toBuffer();
    const alpha = Buffer.alloc(W * fgH);
    for (let y = 0; y < fgH; y++) alpha.fill(Math.round(255 * Math.max(0, Math.min(1, y / feather, (fgH - 1 - y) / feather))), y * W, (y + 1) * W);
    const rgb = await sharp(buf).removeAlpha().raw().toBuffer();
    const fg = await sharp(rgb, { raw: { width: W, height: fgH, channels: 3 } }).joinChannel(alpha, { raw: { width: W, height: fgH, channels: 1 } }).png().toBuffer();
    input = await sharp(bg).composite([{ input: fg, left: 0, top: Math.round((H - fgH) / 2) }]).png().toBuffer();
    console.log(`  ${rel}: paisagem estendida para 4:5 (provisório — melhor voltar a gerar em retrato)`);
  }

  const out = await sharp(input).resize({ width: maxW, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  fs.writeFileSync(outPath, out);
  if (outPath !== file) fs.unlinkSync(file);
  console.log(`${path.relative(IMAGES, outPath)}  ${Math.round(buf.length / 1024)} KB → ${Math.round(out.length / 1024)} KB`);
}
// WebP responsivo para todos os JPEG (o site usa srcset "x-800.webp 800w, x.webp" com recurso ao JPEG)
let made = 0;
for (const file of walk(target)) {
  if (!/\.jpe?g$/i.test(file)) continue;
  const base = file.replace(/\.jpe?g$/i, "");
  const src = fs.statSync(file).mtimeMs;
  const jobs = [[`${base}.webp`, null], [`${base}-800.webp`, 800]];
  for (const [out, w] of jobs) {
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= src) continue;
    let p = sharp(file);
    if (w) p = p.resize({ width: w, withoutEnlargement: true });
    await p.webp({ quality: 78, effort: 5 }).toFile(out);
    made++;
    console.log(`${path.relative(IMAGES, out)}  ${Math.round(fs.statSync(out).size / 1024)} KB`);
  }
}
console.log(`\nConcluído (${made} ficheiro(s) WebP). Confirme os nomes de ficheiro com IMAGE_GENERATION_BRIEF.md.`);
