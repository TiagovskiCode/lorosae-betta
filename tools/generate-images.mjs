#!/usr/bin/env node
/* ==========================================================================
   LOROSAE BETTA® — tools/generate-images.mjs
   Gera as imagens descritas em IMAGE_GENERATION_BRIEF.md através da API de
   imagens da OpenAI (modelo gpt-image-1) e grava-as nos caminhos finais.

   Requisitos: Node 18+ (usa fetch nativo). Sem dependências obrigatórias.
   Opcional: `npm i sharp` para recortar/redimensionar para a proporção exata.

   Chave de API: variável de ambiente OPENAI_API_KEY (ou ficheiro .env na raiz,
   que está no .gitignore). NUNCA coloque a chave no código nem no repositório.

   Exemplos
     node tools/generate-images.mjs --list
     node tools/generate-images.mjs --dry-run
     node tools/generate-images.mjs --only hero --quality high
     node tools/generate-images.mjs --only abissal,ambar --quality medium
     node tools/generate-images.mjs --group "Produtos" --quality medium
     node tools/generate-images.mjs --all --force

   Opções
     --only a,b      só ficheiros cujo caminho contenha algum dos termos
     --group texto   só o grupo do brief que contenha o texto (ex.: "Variedades")
     --all           gerar todas (por omissão é obrigatório usar --only, --group ou --all)
     --quality q     low | medium | high | auto   (por omissão: medium)
     --model m       por omissão: gpt-image-1
     --force         voltar a gerar mesmo que o ficheiro já exista
     --dry-run       mostra o que seria feito, sem chamar a API
     --list          lista as imagens do brief
     --format f      jpeg | webp | png (por omissão: jpeg). Mude também os caminhos nos JSON se não for jpg.
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRIEF = path.join(ROOT, "IMAGE_GENERATION_BRIEF.md");

/* ---------- argumentos ---------- */
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const only = (opt("only", "") || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const groupFilter = (opt("group", "") || "").toLowerCase();
const quality = opt("quality", "medium");
const model = opt("model", "gpt-image-1");
const format = opt("format", "jpeg");
const force = flag("force");
const dryRun = flag("dry-run");

/* ---------- .env simples ---------- */
const envFile = path.join(ROOT, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

/* ---------- ler o brief ---------- */
function parseBrief() {
  const md = fs.readFileSync(BRIEF, "utf8");
  const items = [];
  let group = "";
  for (const block of md.split(/\n(?=## |### )/)) {
    const g = block.match(/^## (.+)/);
    if (g) { group = g[1].trim(); continue; }
    const h = block.match(/^### `([^`]+)`/);
    if (!h) continue;
    const prompt = block.match(/```text\n([\s\S]*?)\n```/);
    const ratio = block.match(/\*\*Proporção\*\* \| ([^|]+)\|/);
    const res = block.match(/\*\*Resolução recomendada\*\* \| ([^|]+)\|/);
    if (!prompt) continue;
    items.push({ file: h[1], group, prompt: prompt[1].trim(), ratio: (ratio?.[1] || "").trim(), res: (res?.[1] || "").trim() });
  }
  return items;
}

/** A API só aceita 1024x1024, 1536x1024 e 1024x1536. */
function apiSize(ratio) {
  const r = ratio.toLowerCase();
  if (/16:10|1\.91/.test(r)) return "1536x1024";
  if (/1:1/.test(r)) return "1024x1024";
  return "1024x1536"; // 4:5 e 3:4 (retrato)
}
/** Dimensões finais pretendidas (extraídas do brief) — usadas só se o `sharp` estiver instalado. */
function targetSize(res) {
  const m = res.match(/(\d{3,4})\s*[×x]\s*(\d{3,4})/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/* ---------- execução ---------- */
const all = parseBrief().filter((i) => !/^No new generation/i.test(i.prompt));
const selected = all.filter((i) => {
  if (only.length && !only.some((t) => i.file.toLowerCase().includes(t))) return false;
  if (groupFilter && !i.group.toLowerCase().includes(groupFilter)) return false;
  return true;
});

if (flag("list")) {
  all.forEach((i, n) => console.log(`${String(n + 1).padStart(2)}. ${i.file}  [${i.ratio}]  ${i.group}`));
  console.log(`\n${all.length} imagens geráveis (a imagem OG deriva do hero e não é gerada).`);
  process.exit(0);
}
if (!only.length && !groupFilter && !flag("all")) {
  console.error("Indique o que gerar: --only <termos>, --group <texto> ou --all. Use --list para ver as imagens. Sugestão: comece com --only hero");
  process.exit(1);
}
if (!selected.length) { console.error("Nenhuma imagem corresponde ao filtro."); process.exit(1); }

const key = process.env.OPENAI_API_KEY;
if (!key && !dryRun) {
  console.error("Falta OPENAI_API_KEY. PowerShell:  $env:OPENAI_API_KEY=\"...\"   |   ou crie um ficheiro .env com OPENAI_API_KEY=... (já ignorado pelo git).");
  process.exit(1);
}

let sharp = null;
try { sharp = (await import("sharp")).default; } catch { /* opcional */ }

const ext = format === "jpeg" ? "jpg" : format;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generate(item) {
  const body = { model, prompt: item.prompt, size: apiSize(item.ratio), quality, n: 1, output_format: format, ...(format !== "png" ? { output_compression: 88 } : {}) };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const json = await res.json();
      const b64 = json.data?.[0]?.b64_json;
      if (!b64) throw new Error("Resposta sem imagem (b64_json).");
      return Buffer.from(b64, "base64");
    }
    const text = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      const wait = 4000 * attempt;
      console.warn(`   ↻ HTTP ${res.status}; nova tentativa em ${wait / 1000}s…`);
      await sleep(wait);
      continue;
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 400)}`);
  }
}

console.log(`Modelo: ${model} · qualidade: ${quality} · formato: ${format} · ${selected.length} imagem(ns)${dryRun ? " · DRY-RUN" : ""}${sharp ? " · sharp ativo (recorte exato)" : ""}\n`);

let ok = 0, skipped = 0, failed = 0;
for (const [n, item] of selected.entries()) {
  let rel = item.file;
  if (ext !== "jpg") rel = rel.replace(/\.jpg$/i, `.${ext}`);
  const out = path.join(ROOT, rel);
  const tag = `[${n + 1}/${selected.length}] ${rel}`;
  if (fs.existsSync(out) && !force) { console.log(`${tag} — já existe (use --force)`); skipped++; continue; }
  if (dryRun) { console.log(`${tag} — ${apiSize(item.ratio)}\n   ${item.prompt.slice(0, 140)}…`); continue; }
  try {
    process.stdout.write(`${tag} … `);
    let buf = await generate(item);
    const target = targetSize(item.res);
    if (sharp && target) {
      buf = await sharp(buf).resize(target[0], target[1], { fit: "cover", position: "centre" })[format === "jpeg" ? "jpeg" : format]({ quality: 85 }).toBuffer();
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buf);
    console.log(`ok (${Math.round(buf.length / 1024)} KB)`);
    ok++;
  } catch (e) {
    console.log("FALHOU");
    console.error(`   ${e.message}`);
    failed++;
    if (/HTTP (401|403)/.test(e.message)) { console.error("   Chave inválida ou sem acesso ao modelo (o gpt-image-1 pode exigir verificação da organização). A parar."); break; }
  }
}

console.log(`\nConcluído: ${ok} geradas · ${skipped} ignoradas · ${failed} falhadas.`);
if (ok) console.log('Próximo passo: reveja as imagens e ponha CONFIG.imageMode = "auto" em js/utils.js.');
process.exit(failed ? 1 : 0);
