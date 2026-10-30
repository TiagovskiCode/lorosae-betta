/* ==========================================================================
   LOROSAE BETTA® — utils.js
   Configuração do site, textos (i18n), formatação, imagens temporárias e toast.
   Partilhado por todos os módulos. Não depende de nenhum outro módulo local.
   ========================================================================== */

/* ---------- CONFIGURAÇÃO (editável pelo proprietário) ---------- */
export const CONFIG = {
  brand: "LOROSAE BETTA®",
  /** Mostra a faixa "site de demonstração" e as etiquetas de dados ilustrativos. Pôr false só quando todos os dados forem reais. */
  demoMode: true,
  locale: "pt-PT",
  currency: "EUR",
  /**
   * "placeholder" -> usa sempre imagens temporárias geradas (nenhum pedido de rede).
   * "auto"        -> tenta carregar a imagem real; se falhar, usa a temporária.
   * Mudar para "auto" quando as fotografias reais forem colocadas em assets/images/.
   */
  imageMode: "auto",
  /** Número WhatsApp em formato internacional sem '+' (ex.: "3519XXXXXXXX"). Vazio = botão desativado. */
  whatsappNumber: "",
  /** Ponto de integração para um back-end de encomendas (POST JSON). null = apenas demonstração local. */
  orderEndpoint: null,
  /**
   * URL que recebe o formulário de contacto (POST JSON), p. ex. Formspree/Getform/Netlify/API própria.
   * null = sem serviço de envio; o formulário explica isso e, se existir contact.email, abre o email do utilizador.
   */
  contactEndpoint: null,
  /** URL que recebe inscrições na newsletter (POST JSON { email }). null = a newsletter não é mostrada. */
  newsletterEndpoint: null,
  /** Usar as versões WebP (x.webp e x-800.webp) geradas por tools/optimise-images.mjs, com recurso ao JPEG. */
  webp: true,
  /** URL do Instagram da loja. Vazio = placeholder. */
  instagramUrl: "",
  /** Contactos reais da loja. Vazio = placeholder visível. */
  contact: { email: "", phone: "", address: "" },
  /** URL público final do site (usado em metadados/sitemap quando publicado). */
  siteUrl: "https://www.example.com"
};

/* ---------- TEXTOS (pt-PT) — preparados para tradução ---------- */
export const STRINGS = {
  "notice.demo": "Site de demonstração · dados de exemplo",
  "nav.shop": "Coleção",
  "nav.varieties": "Variedades",
  "nav.about": "Sobre",
  "nav.care": "Guia de cuidados",
  "nav.contact": "Contacto",
  "nav.menu": "Menu",
  "nav.openMenu": "Abrir menu",
  "nav.closeMenu": "Fechar menu",
  "cart.title": "Carrinho",
  "cart.open": "Abrir carrinho",
  "cart.close": "Fechar carrinho",
  "cart.label": "Carrinho",
  "cart.items": "{n} artigo(s) no carrinho",
  "cart.empty.title": "O seu carrinho está vazio",
  "cart.empty.text": "Ainda não escolheu nenhum Betta. Explore a coleção e encontre o seu.",
  "cart.empty.cta": "Explorar a coleção",
  "cart.subtotal": "Subtotal",
  "cart.shipping": "Envio",
  "cart.shipping.value": "A confirmar",
  "cart.total": "Total estimado",
  "cart.remove": "Remover",
  "cart.removed": "{name} removido do carrinho",
  "cart.added": "{name} adicionado ao carrinho",
  "cart.view": "Ver carrinho",
  "cart.checkout": "Finalizar (demonstração)",
  "cart.clear": "Esvaziar carrinho",
  "cart.cleared": "Carrinho esvaziado",
  "cart.single": "Exemplar único",
  "cart.max": "Máximo disponível: {n}",
  "cart.unavailable": "Já não disponível",
  "cart.qtyUp": "Aumentar quantidade de {name}",
  "cart.qtyDown": "Diminuir quantidade de {name}",
  "cart.stockLimit": "Só existem {n} exemplar(es) disponível(is) de {name}",
  "cart.notAvailable": "{name} não está disponível neste momento",
  "cart.note": "O envio de animais vivos é confirmado pela loja antes de qualquer pagamento. Nenhum pagamento é processado neste site de demonstração.",
  "add.label": "Adicionar ao carrinho",
  "add.short": "Adicionar",
  "add.done": "Adicionado",
  "add.unavailable": "Indisponível",
  "add.notify": "Pedir informação",
  "status.available": "Disponível",
  "status.reserved": "Reservado",
  "status.soon": "Em breve",
  "status.sold": "Vendido",
  "product.details": "Ver detalhes",
  "product.pending": "Por confirmar",
  "product.demoData": "Dados de demonstração",
  "product.confirmed": "Confirmado",
  "product.notFound.title": "Peixe não encontrado",
  "product.notFound.text": "Este exemplar já não está na coleção ou o endereço está incorreto.",
  "shop.count": "A mostrar {shown} de {total} peixes",
  "shop.count.one": "A mostrar 1 de {total} peixes",
  "shop.empty.title": "Nenhum peixe encontrado",
  "shop.empty.text": "Não encontrámos resultados para a sua pesquisa ou filtros. Experimente outros termos ou limpe os filtros.",
  "shop.clear": "Limpar filtros",
  "shop.all": "Todas",
  "load.error.title": "Não foi possível carregar a coleção",
  "load.error.text": "Os dados são carregados por pedido ao servidor. Abra o site através de um servidor local (ver README) e não diretamente do ficheiro.",
  "newsletter.invalid": "Introduza um endereço de email válido.",
  "checkout.required": "Este campo é obrigatório.",
  "checkout.email": "Introduza um email válido.",
  "checkout.consent": "Tem de confirmar que compreende que se trata de uma demonstração.",
  "checkout.done": "Pedido de demonstração criado",
  "checkout.sendError": "Não foi possível enviar o pedido. Tente novamente.",
  "common.close": "Fechar",
  "common.currencyNote": "Preços em euros (EUR)."
};

export function t(key, vars = {}) {
  const raw = STRINGS[key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
}

export const STATUS = {
  available: { key: "status.available", canBuy: true },
  reserved: { key: "status.reserved", canBuy: false },
  soon: { key: "status.soon", canBuy: false },
  sold: { key: "status.sold", canBuy: false }
};

/* ---------- Caminhos ---------- */
/** Raiz do projeto, calculada a partir da localização deste ficheiro. Funciona em qualquer subpasta. */
export const ROOT = new URL("../", import.meta.url);
export const url = (path) => new URL(path, ROOT).href;

/* ---------- Helpers ---------- */
export const $ = (sel, scope = document) => scope.querySelector(sel);
export const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const priceFmt = new Intl.NumberFormat(CONFIG.locale, { style: "currency", currency: CONFIG.currency });
export const formatPrice = (n) => priceFmt.format(n);

export const normalise = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasGsap = () => typeof window.gsap !== "undefined";

export const ARROW_SVG = `<svg viewBox="0 0 24 8" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 4h22M18 .5 22 4l-4 3.5"/></svg>`;

export async function fetchJson(path) {
  const res = await fetch(url(path), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

/* ---------- Imagens (reais ou temporárias) ---------- */
const PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

const KIND_RATIO = { hero: [2400, 1500], product: [1000, 1250], variety: [900, 1200], editorial: [1200, 1500], wide: [1600, 1000], care: [1200, 1200] };

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const placeholderCache = new Map();

/**
 * Gera uma imagem TEMPORÁRIA abstrata (leques de raios de barbatana, luz de água e bolhas),
 * claramente rotulada como placeholder. Não é uma fotografia nem pretende simular uma.
 */
export function placeholderSrc({ label = "imagem", kind = "product", tint = ["#3a8582", "#0b2027"] } = {}) {
  const key = `${label}|${kind}|${tint.join(",")}`;
  if (placeholderCache.has(key)) return placeholderCache.get(key);

  const [W, H] = KIND_RATIO[kind] || KIND_RATIO.product;
  const [accent, deep] = tint;
  const rand = rng(hashString(label));
  const px = kind === "hero" ? 0.46 : 0.3 + rand() * 0.12;
  const py = kind === "hero" ? 0.55 : 0.5 + (rand() - 0.5) * 0.12;
  const P = [W * px, H * py];
  const reach = Math.min(W * (kind === "hero" ? 0.5 : 0.8), H * 1.0);
  const rays = [];
  const N = kind === "hero" ? 46 : 34;
  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    const ang = (-72 + f * 144) * (Math.PI / 180) + (rand() - 0.5) * 0.05;
    const len = reach * (0.55 + 0.45 * Math.cos((f - 0.5) * Math.PI * 0.95)) * (0.85 + rand() * 0.2);
    const bend = (rand() - 0.35) * reach * 0.22;
    const cx1 = P[0] + Math.cos(ang) * len * 0.35, cy1 = P[1] + Math.sin(ang) * len * 0.35 + bend * 0.4;
    const cx2 = P[0] + Math.cos(ang) * len * 0.72, cy2 = P[1] + Math.sin(ang) * len * 0.72 + bend;
    const ex = P[0] + Math.cos(ang) * len, ey = P[1] + Math.sin(ang) * len + bend * 1.25 + len * 0.08;
    const op = (0.16 + rand() * 0.5).toFixed(2);
    const sw = (0.7 + rand() * 1.6).toFixed(2);
    rays.push({ d: `M${P[0].toFixed(0)} ${P[1].toFixed(0)}C${cx1.toFixed(0)} ${cy1.toFixed(0)} ${cx2.toFixed(0)} ${cy2.toFixed(0)} ${ex.toFixed(0)} ${ey.toFixed(0)}`, op, sw, ex, ey });
  }
  // membrana suave entre o primeiro e o último raio
  const first = rays[0], last = rays[rays.length - 1], mid = rays[Math.floor(rays.length / 2)];
  const membrane = `M${P[0].toFixed(0)} ${P[1].toFixed(0)}L${first.ex.toFixed(0)} ${first.ey.toFixed(0)}Q${mid.ex.toFixed(0)} ${(mid.ey + reach * 0.1).toFixed(0)} ${last.ex.toFixed(0)} ${last.ey.toFixed(0)}Z`;

  const shafts = Array.from({ length: 4 }, () => {
    const x = rand() * W, w = W * (0.04 + rand() * 0.1), skew = W * (0.15 + rand() * 0.25);
    return `<polygon points="${x},0 ${x + w},0 ${x + w - skew},${H} ${x - skew},${H}" fill="url(#shaft)" opacity="${(0.35 + rand() * 0.5).toFixed(2)}"/>`;
  }).join("");
  const bubbles = Array.from({ length: kind === "hero" ? 16 : 10 }, () => {
    const r = 3 + rand() * (kind === "hero" ? 12 : 8);
    return `<circle cx="${(rand() * W).toFixed(0)}" cy="${(rand() * H).toFixed(0)}" r="${r.toFixed(1)}" fill="none" stroke="#e9e6de" stroke-opacity="${(0.12 + rand() * 0.25).toFixed(2)}" stroke-width="1.2"/>`;
  }).join("");

  const fs = Math.round(Math.min(W, H) * 0.021);
  const shortLabel = label.length > 44 ? label.slice(0, 41) + "…" : label;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="bg" cx="${(px * 100).toFixed(0)}%" cy="${(py * 100).toFixed(0)}%" r="75%"><stop offset="0" stop-color="${deep}"/><stop offset=".55" stop-color="#0b2027"/><stop offset="1" stop-color="#071114"/></radialGradient>
<radialGradient id="glow" cx="${(px * 100).toFixed(0)}%" cy="${(py * 100).toFixed(0)}%" r="42%"><stop offset="0" stop-color="${accent}" stop-opacity=".42"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e6de" stop-opacity=".16"/><stop offset="1" stop-color="#e9e6de" stop-opacity="0"/></linearGradient>
<linearGradient id="mem" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${accent}" stop-opacity=".3"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${shafts}
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<path d="${membrane}" fill="url(#mem)"/>
<g fill="none" stroke="${accent}" stroke-linecap="round">${rays.map((r) => `<path d="${r.d}" stroke-opacity="${r.op}" stroke-width="${r.sw}"/>`).join("")}</g>
${bubbles}
<rect x="${W * 0.03}" y="${H * 0.03}" width="${W * 0.94}" height="${H * 0.94}" fill="none" stroke="#70e1d1" stroke-opacity=".45" stroke-dasharray="6 8"/>
<g font-family="Arial, Helvetica, sans-serif" font-size="${fs}" letter-spacing="${(fs * 0.14).toFixed(1)}" fill="#a8b7b4">
<text x="${W * 0.055}" y="${H * 0.935 - fs * 1.6}" fill="#70e1d1" font-weight="700">IMAGEM TEMPORÁRIA</text>
<text x="${W * 0.055}" y="${H * 0.935}" opacity=".85">${shortLabel.replace(/&/g, "&amp;")}</text>
</g>
</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  placeholderCache.set(key, src);
  return src;
}

function applyPlaceholder(img) {
  const { img: path = "", kind, tint } = img.dataset;
  const label = path.split("/").pop() || "imagem";
  img.src = placeholderSrc({ label, kind, tint: tint ? tint.split(",") : undefined });
  img.classList.add("is-placeholder");
  img.dataset.placeholder = "true";
}

/** Gera o HTML de uma imagem gerida (carregada/substituída por hydrateImages). */
export function imgHtml({ path, alt, kind = "product", tint = null, width, height, eager = false, cls = "", sizes = "" }) {
  return `<img class="${esc(cls)}" src="${PIXEL}" data-img="${esc(path)}" data-kind="${esc(kind)}"${sizes ? ` data-sizes="${esc(sizes)}"` : ""}${tint ? ` data-tint="${esc(tint.join(","))}"` : ""} alt="${esc(alt)}"${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/** Larguras reais dos ficheiros (para os descritores do srcset). */
const FULL_WIDTH = { hero: 1600 };
const DEFAULT_SIZES = { hero: "100vw", product: "(max-width: 600px) 92vw, (max-width: 1100px) 48vw, 36vw", variety: "(max-width: 600px) 72vw, (max-width: 1100px) 46vw, 24vw", editorial: "(max-width: 900px) 92vw, 42vw", wide: "100vw" };

/**
 * Liga cada <img data-img> à imagem real (modo "auto") ou à temporária (modo "placeholder").
 * Cadeia de recurso: WebP responsivo (srcset 800w/full) → JPEG → imagem temporária.
 */
export function hydrateImages(scope = document) {
  scope.querySelectorAll("img[data-img]:not([data-hydrated])").forEach((img) => {
    img.dataset.hydrated = "1";
    if (CONFIG.imageMode === "placeholder") { applyPlaceholder(img); return; }
    const path = img.dataset.img;
    const jpg = url(path);
    const useWebp = CONFIG.webp && /\.jpe?g$/i.test(path);
    img.addEventListener("error", () => {
      if (img.dataset.placeholder) return;
      if (img.dataset.stage === "webp") { img.dataset.stage = "jpg"; img.removeAttribute("srcset"); img.removeAttribute("sizes"); img.src = jpg; return; }
      applyPlaceholder(img);
    });
    if (useWebp) {
      const base = jpg.replace(/\.jpe?g$/i, "");
      const kind = img.dataset.kind || "product";
      img.dataset.stage = "webp";
      img.sizes = img.dataset.sizes || DEFAULT_SIZES[kind] || "100vw";
      img.srcset = `${base}-800.webp 800w, ${base}.webp ${FULL_WIDTH[kind] || 1120}w`;
      img.src = `${base}.webp`;
    } else img.src = jpg;
  });
}

/* ---------- Toast ---------- */
let toastRegion;
export function toast(message, { type = "info", action = null, duration = 4200 } = {}) {
  if (!toastRegion) {
    toastRegion = document.createElement("div");
    toastRegion.className = "toast-region";
    toastRegion.setAttribute("role", "status");
    toastRegion.setAttribute("aria-live", "polite");
    document.body.appendChild(toastRegion);
  }
  const el = document.createElement("div");
  el.className = `toast${type === "error" ? " toast--error" : type === "success" ? " toast--success" : ""}`;
  const text = document.createElement("span");
  text.textContent = message;
  el.appendChild(text);
  if (action) {
    const a = document.createElement(action.href ? "a" : "button");
    a.textContent = action.label;
    if (action.href) a.href = action.href; else { a.type = "button"; a.addEventListener("click", () => { action.onClick?.(); remove(); }); }
    el.appendChild(a);
  }
  toastRegion.appendChild(el);
  let gone = false;
  const remove = () => {
    if (gone) return; gone = true;
    if (hasGsap() && !prefersReducedMotion()) {
      window.gsap.to(el, { autoAlpha: 0, y: 12, duration: 0.35, ease: "power2.in", onComplete: () => el.remove() });
    } else el.remove();
  };
  if (hasGsap() && !prefersReducedMotion()) window.gsap.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" });
  setTimeout(remove, duration);
  return remove;
}

/** Trap simples de foco para diálogos/gavetas. Devolve função para desligar. */
export function trapFocus(container) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const handler = (e) => {
    if (e.key !== "Tab") return;
    const nodes = Array.from(container.querySelectorAll(sel)).filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener("keydown", handler);
  return () => container.removeEventListener("keydown", handler);
}
