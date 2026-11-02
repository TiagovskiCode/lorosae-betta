/* ==========================================================================
   AQUORA — utils.js
   Configuração do site, textos (i18n), formatação, imagens e toast.
   Partilhado por todos os módulos. Não depende de nenhum outro módulo local.
   ========================================================================== */

/* ---------- CONFIGURAÇÃO ---------- */
export const CONFIG = {
  brand: "AQUORA",
  locale: "pt-PT",
  currency: "EUR",
  /**
   * "placeholder" -> usa sempre imagens abstratas geradas (nenhum pedido de rede).
   * "auto"        -> carrega a fotografia; se falhar, usa a imagem abstrata.
   */
  imageMode: "auto",
  /** Número WhatsApp em formato internacional sem '+' (ex.: "3519XXXXXXXX"). Vazio = não é mostrado. */
  whatsappNumber: "",
  /** Back-end de encomendas (POST JSON). null = o pedido de reserva é apenas preparado no navegador. */
  orderEndpoint: null,
  /** URL que recebe o formulário de contacto (POST JSON), p. ex. Formspree/Getform/API própria. */
  contactEndpoint: null,
  /** URL que recebe inscrições na newsletter (POST JSON { email }). null = a newsletter não é mostrada. */
  newsletterEndpoint: null,
  /** Usar as versões WebP (x.webp e x-800.webp) geradas por tools/optimise-images.mjs, com recurso ao JPEG. */
  webp: true,
  /** URL do Instagram. Vazio = não é mostrado. */
  instagramUrl: "",
  /** Contactos. Campos vazios não são mostrados. */
  contact: { email: "", phone: "", address: "" },
  /** URL público do site (metadados e sitemap). */
  siteUrl: "https://tiagovskicode.github.io/lorosae-betta/"
};

/* ---------- TEXTOS (pt-PT) — preparados para tradução ---------- */
export const STRINGS = {
  "nav.home": "Início",
  "nav.shop": "Coleção",
  "nav.varieties": "Variedades",
  "nav.about": "Sobre",
  "nav.care": "Guia de cuidados",
  "search.open": "Abrir pesquisa",
  "search.close": "Fechar pesquisa",
  "search.label": "Pesquisar na coleção",
  "search.placeholder": "Procure por nome, cor ou variedade",
  "search.submit": "Pesquisar",
  "search.hint": "Experimente “Abissal”, “crowntail” ou “azul”.",
  "search.none": "Nenhum peixe corresponde à pesquisa. Carregue em Pesquisar para ver a coleção completa.",
  "nav.contact": "Contacto",
  "nav.menu": "Menu",
  "nav.openMenu": "Abrir menu",
  "nav.closeMenu": "Fechar menu",
  "cart.title": "Carrinho",
  "cart.open": "Abrir carrinho",
  "cart.close": "Fechar carrinho",
  "cart.label": "Carrinho",
  "cart.items": "{n} artigo(s) no carrinho",
  "cart.empty.title": "O carrinho está vazio",
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
  "cart.checkout": "Finalizar pedido",
  "cart.clear": "Esvaziar carrinho",
  "cart.cleared": "Carrinho esvaziado",
  "cart.single": "Exemplar único",
  "cart.max": "Máximo disponível: {n}",
  "cart.unavailable": "Já não disponível",
  "cart.qtyUp": "Aumentar quantidade de {name}",
  "cart.qtyDown": "Diminuir quantidade de {name}",
  "cart.stockLimit": "Só existem {n} exemplar(es) disponível(is) de {name}",
  "cart.notAvailable": "{name} não está disponível neste momento",
  "cart.note": "Os peixes são animais vivos: a disponibilidade e o envio são confirmados antes de qualquer pagamento. Este site não processa pagamentos.",
  "add.label": "Adicionar ao carrinho",
  "add.short": "Adicionar",
  "add.done": "Adicionado",
  "add.unavailable": "Indisponível",
  "status.available": "Disponível",
  "status.reserved": "Reservado",
  "status.soon": "Em breve",
  "status.sold": "Vendido",
  "product.details": "Ver detalhes",
  "product.pending": "Por confirmar",
  "product.notFound.title": "Peixe não encontrado",
  "product.notFound.text": "Este exemplar já não está na coleção ou o endereço está incorreto.",
  "shop.count": "{shown} de {total} exemplares",
  "shop.count.one": "1 de {total} exemplares",
  "shop.count.none": "0 de {total} exemplares",
  "shop.empty.title": "Nenhum peixe encontrado",
  "shop.empty.text": "Não encontrámos resultados para a sua pesquisa ou filtros. Experimente outros termos ou limpe os filtros.",
  "shop.clear": "Limpar filtros",
  "shop.all": "Todas",
  "load.error.title": "Não foi possível carregar a coleção",
  "load.error.text": "Os dados da coleção não responderam. Recarregue a página dentro de momentos.",
  "newsletter.invalid": "Introduza um endereço de email válido.",
  "checkout.required": "Este campo é obrigatório.",
  "checkout.email": "Introduza um email válido.",
  "checkout.consent": "Confirme que tomou conhecimento destas condições.",
  "checkout.done": "Pedido de reserva preparado",
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

/** Número de exemplar a partir da referência (aq-001 → "N.º 001"). */
export const specimenNo = (p) => `N.º ${String(p.id).split("-").pop()}`;

export const ARROW_SVG = `<svg viewBox="0 0 24 8" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M0 4h23M19.5 .5 23 4l-3.5 3.5"/></svg>`;

export async function fetchJson(path) {
  const res = await fetch(url(path), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

/* ---------- Imagens (fotografia com recurso abstrato) ---------- */
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
 * Imagem de recurso abstrata (leque de raios de barbatana sobre água escura), usada só
 * quando uma fotografia não carrega. Não é uma fotografia nem pretende simular uma.
 */
export function placeholderSrc({ label = "imagem", kind = "product", tint = ["#1a4650", "#10252a"] } = {}) {
  const key = `${label}|${kind}|${tint.join(",")}`;
  if (placeholderCache.has(key)) return placeholderCache.get(key);

  const [W, H] = KIND_RATIO[kind] || KIND_RATIO.product;
  const [accent, deep] = tint;
  const rand = rng(hashString(label));
  const P = [W * (0.3 + rand() * 0.12), H * (0.5 + (rand() - 0.5) * 0.12)];
  const reach = Math.min(W * 0.8, H);
  const rays = Array.from({ length: 34 }, (_, i) => {
    const f = i / 33;
    const ang = (-72 + f * 144) * (Math.PI / 180) + (rand() - 0.5) * 0.05;
    const len = reach * (0.55 + 0.45 * Math.cos((f - 0.5) * Math.PI * 0.95)) * (0.85 + rand() * 0.2);
    const bend = (rand() - 0.35) * reach * 0.22;
    const c1 = [P[0] + Math.cos(ang) * len * 0.35, P[1] + Math.sin(ang) * len * 0.35 + bend * 0.4];
    const c2 = [P[0] + Math.cos(ang) * len * 0.72, P[1] + Math.sin(ang) * len * 0.72 + bend];
    const e = [P[0] + Math.cos(ang) * len, P[1] + Math.sin(ang) * len + bend * 1.25 + len * 0.08];
    const d = `M${P.map(Math.round).join(" ")}C${c1.map(Math.round).join(" ")} ${c2.map(Math.round).join(" ")} ${e.map(Math.round).join(" ")}`;
    return `<path d="${d}" stroke-opacity="${(0.16 + rand() * 0.5).toFixed(2)}" stroke-width="${(0.7 + rand() * 1.6).toFixed(2)}"/>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs><radialGradient id="bg" cx="35%" cy="50%" r="75%"><stop offset="0" stop-color="${deep}"/><stop offset=".55" stop-color="#10252a"/><stop offset="1" stop-color="#071114"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<g fill="none" stroke="${accent}" stroke-linecap="round">${rays}</g>
</svg>`;
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  placeholderCache.set(key, src);
  return src;
}

function applyPlaceholder(img) {
  const { img: path = "", kind, tint } = img.dataset;
  const label = path.split("/").pop() || "imagem";
  img.removeAttribute("srcset");
  img.src = placeholderSrc({ label, kind, tint: tint ? tint.split(",") : undefined });
  img.classList.add("is-placeholder");
  img.dataset.placeholder = "true";
}

/** Gera o HTML de uma imagem gerida (carregada/substituída por hydrateImages). */
export function imgHtml({ path, alt, kind = "product", tint = null, width, height, eager = false, cls = "", sizes = "" }) {
  return `<img${cls ? ` class="${esc(cls)}"` : ""} src="${PIXEL}" data-img="${esc(path)}" data-kind="${esc(kind)}"${sizes ? ` data-sizes="${esc(sizes)}"` : ""}${tint ? ` data-tint="${esc(tint.join(","))}"` : ""} alt="${esc(alt)}"${width ? ` width="${width}"` : ""}${height ? ` height="${height}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/** Larguras reais dos ficheiros (para os descritores do srcset). */
const FULL_WIDTH = { hero: 1600 };
const DEFAULT_SIZES = { hero: "100vw", product: "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 34vw", variety: "(max-width: 900px) 80px, 30vw", editorial: "(max-width: 900px) 100vw, 45vw", wide: "100vw" };

/**
 * Liga cada <img data-img> à fotografia (modo "auto") ou à imagem abstrata (modo "placeholder").
 * Cadeia de recurso: WebP responsivo (srcset 800w/full) → JPEG → imagem abstrata.
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

/**
 * Trap simples de foco para diálogos/gavetas. `extra` são elementos fora do contentor
 * que fazem parte do ciclo (ex.: o botão do menu no cabeçalho). Devolve função para desligar.
 */
export function trapFocus(container, extra = []) {
  const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const handler = (e) => {
    if (e.key !== "Tab") return;
    const nodes = [...extra, ...container.querySelectorAll(sel)].filter((n) => n.offsetParent !== null || n === document.activeElement);
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    const inside = nodes.includes(document.activeElement);
    if (!inside) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}
