/* ==========================================================================
   LOROSAE BETTA® — products.js
   Carregamento do catálogo (data/products.json + data/categories.json) e
   renderização: cartões, destaques, variedades e página de detalhe.
   ========================================================================== */
import { CONFIG, STATUS, t, url, esc, formatPrice, fetchJson, imgHtml, hydrateImages, ARROW_SVG, $ } from "./utils.js";
import { crossfade, animateProductEntrance } from "./animations.js";

const state = { products: [], categories: [], loaded: false };
let loading = null;

/** Carrega (uma só vez) os dados do catálogo. */
export function loadCatalogue() {
  if (!loading) {
    loading = Promise.all([fetchJson("data/products.json"), fetchJson("data/categories.json")]).then(([p, c]) => {
      state.products = p.products.filter((x) => x.published !== false); // "published": false = rascunho, não aparece na loja
      state.categories = c.categories;
      state.loaded = true;
      return state;
    });
  }
  return loading;
}

export const catalogue = () => state;
export const getProduct = (idOrSlug) => state.products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
export const getCategory = (id) => state.categories.find((c) => c.id === id) || null;
export const isBuyable = (p) => !!p && STATUS[p.status]?.canBuy && p.stock > 0;
export const productUrl = (p) => url(`pages/product.html?produto=${encodeURIComponent(p.slug)}`);
export const shopUrl = (params = "") => url(`pages/shop.html${params ? "?" + params : ""}`);

const nameList = (arr) => arr.join(" · ");

/* ---------- Cartão ---------- */
export function productCardHtml(p, { layout = "std", reveal = true } = {}) {
  const cat = getCategory(p.category);
  const status = STATUS[p.status] || STATUS.sold;
  const buyable = isBuyable(p);
  const link = productUrl(p);
  const addBtn = buyable
    ? `<button type="button" class="btn btn--small btn--primary btn--magnetic" data-add="${esc(p.id)}" data-magnetic><span class="btn__label">${t("add.short")}</span></button>`
    : `<span class="small muted" aria-label="${t("add.unavailable")}">${t(status.key)}</span>`;
  const demoFlag = CONFIG.demoMode ? ` <span class="visually-hidden">(dados de demonstração)</span>` : "";
  return `<article class="product-card${buyable ? "" : " is-unavailable"}" data-layout="${esc(layout)}" data-id="${esc(p.id)}"${reveal ? " data-reveal" : ""}>
  <a class="product-card__media frame" href="${link}" aria-label="${esc(p.name)} — ${t("product.details")}" tabindex="-1">
    ${imgHtml({ path: p.images.primary, alt: p.images.alt, kind: "product", tint: p.tint, width: 1000, height: 1250 })}
  </a>
  <span class="badge badge--${esc(p.status)}">${t(status.key)}</span>
  <div class="product-card__body">
    <div class="product-card__head">
      <p class="product-card__meta">${esc(p.tail)} · ${esc(nameList(p.colors))}</p>
      <h3 class="product-card__name"><a href="${link}">${esc(p.name)}</a></h3>
    </div>
    <div class="product-card__tail">
      <p class="product-card__desc">${esc(p.shortDescription)}${demoFlag}</p>
    </div>
    <div class="product-card__foot">
      <span class="price" aria-label="Preço">${formatPrice(p.price)}</span>
      <div class="product-card__actions">
        <a class="link-arrow" href="${link}"><span>${t("product.details")}</span><span class="link-arrow__icon">${ARROW_SVG}</span><span class="visually-hidden"> — ${esc(p.name)}</span></a>
        ${addBtn}
      </div>
    </div>
  </div>
</article>`;
}

/* ---------- Destaques (home) ---------- */
export function renderFeatured(container) {
  const featured = state.products.filter((p) => p.featured);
  container.innerHTML = featured.map((p) => productCardHtml(p, { layout: p.layout || "std" })).join("");
  hydrateImages(container);
}

/* ---------- Destaque editorial (home) ---------- */
export function renderSpotlight(container) {
  const p = state.products.find((x) => x.spotlight) || state.products.find((x) => x.featured);
  if (!p) { container.closest("section")?.remove(); return; }
  const cat = getCategory(p.category);
  const link = productUrl(p);
  const buyable = isBuyable(p);
  const detail = p.images.gallery?.[0];
  container.innerHTML = `
  <div class="spotlight__media">
    <a class="frame spotlight__main" href="${link}" data-mask data-parallax aria-label="${esc(p.name)} — ${t("product.details")}" tabindex="-1">
      ${imgHtml({ path: p.images.primary, alt: p.images.alt, kind: "product", tint: p.tint, width: 1000, height: 1250 })}
    </a>
    ${detail ? `<div class="frame spotlight__detail" data-reveal>${imgHtml({ path: detail, alt: `Detalhe das escamas e barbatanas de ${p.name}`, kind: "product", tint: p.tint, width: 600, height: 750 })}</div>` : ""}
  </div>
  <div class="spotlight__text">
    <p class="eyebrow" data-reveal>Em destaque · ${esc(cat?.name || p.tail)}</p>
    <h2 class="spotlight__title" data-split>${esc(p.name)}</h2>
    <p class="lead" data-reveal>${esc(p.colorDescription)}</p>
    <dl class="spotlight__specs" data-stagger>
      <div><dt>Variedade</dt><dd>${esc(cat?.name || p.tail)}</dd></div>
      <div><dt>Cor</dt><dd>${esc(p.colors.join(" · "))}</dd></div>
      <div><dt>Estado</dt><dd>${t((STATUS[p.status] || STATUS.sold).key)}</dd></div>
      <div><dt>Preço</dt><dd>${formatPrice(p.price)}</dd></div>
    </dl>
    <div class="prose" data-reveal><p>${esc(p.description)}</p></div>
    <div class="spotlight__cta" data-reveal>
      <a class="btn btn--primary btn--magnetic" data-magnetic href="${link}"><span>${t("product.details")}</span><span class="btn__arrow">${ARROW_SVG}</span></a>
      ${buyable ? `<button type="button" class="btn btn--ghost btn--magnetic" data-magnetic data-add="${esc(p.id)}"><span class="btn__label">${t("add.label")}</span></button>` : ""}
    </div>
  </div>`;
  hydrateImages(container);

  // Cartão sobreposto no hero, ligado ao mesmo peixe
  const chip = $("[data-hero-chip]");
  if (chip) {
    $("[data-hero-chip-name]", chip).textContent = `${p.name} · ${cat?.name || p.tail}`;
    const box = $("[data-hero-chip-img]", chip);
    box.innerHTML = imgHtml({ path: p.images.primary, alt: "", kind: "product", tint: p.tint, width: 104, height: 104, sizes: "60px" });
    hydrateImages(box);
    chip.setAttribute("aria-label", `Peixe em destaque: ${p.name}`);
    chip.hidden = false;
  }
}

/* ---------- Galeria (home): detalhes macro dos peixes publicados ---------- */
export function galleryItems() {
  return state.products
    .filter((p) => p.images.gallery?.length)
    .map((p) => {
      const cat = getCategory(p.category);
      return { src: p.images.gallery[0], alt: `Detalhe macro de ${p.name}: escamas e barbatanas`, title: `${p.name} — ${cat?.name || p.tail}`, href: productUrl(p), tint: p.tint };
    });
}

export function renderGalleryGrid(container, items) {
  container.innerHTML = items
    .map((it, i) => `<li class="gallery__item" data-reveal><button type="button" class="gallery__btn frame" data-gallery-index="${i}" aria-label="Ampliar: ${esc(it.title)}">${imgHtml({ path: it.src, alt: it.alt, kind: "product", tint: it.tint, width: 600, height: 750 })}<span class="gallery__cap" aria-hidden="true">${esc(it.title)}</span></button></li>`)
    .join("");
  hydrateImages(container);
}

/* ---------- Variedades (home) ---------- */
export function renderVarieties(container) {
  // Só variedades com peixes publicados: uma categoria sem stock nem fotografia própria não é apresentada
  const visible = state.categories.filter((c) => state.products.some((p) => p.category === c.id));
  container.style.setProperty("--cols", visible.length);
  container.style.setProperty("--cols-md", visible.length % 3 === 0 ? 3 : 2);
  container.innerHTML = visible
    .map((c) => {
      const total = state.products.filter((p) => p.category === c.id).length;
      const avail = state.products.filter((p) => p.category === c.id && isBuyable(p)).length;
      const countText = avail > 0 ? (avail === 1 ? "1 disponível" : `${avail} disponíveis`) : total > 0 ? "Sem exemplares disponíveis" : "Sem exemplares de momento";
      return `<li class="variety" data-reveal>
  <div class="variety__media frame">${imgHtml({ path: c.image, alt: c.alt, kind: "variety", tint: c.tint, width: 900, height: 1200 })}</div>
  <div class="variety__body">
    <span class="variety__idx">${esc(c.index)}</span>
    <h3 class="variety__name"><a class="variety__link" href="${shopUrl("variedade=" + encodeURIComponent(c.id))}">${esc(c.name)}</a></h3>
    <p class="variety__tag">${esc(c.tagline)}</p>
    <p class="variety__count"><span>${countText}</span><span class="link-arrow__icon" aria-hidden="true">${ARROW_SVG}</span></p>
  </div>
</li>`;
    })
    .join("");
  hydrateImages(container);
}

/* ---------- Detalhe do produto ---------- */
function specRow(label, value, field, p) {
  const confirmed = p.confirmed?.includes(field);
  const missing = value === null || value === undefined || value === "";
  const flag = missing
    ? ""
    : confirmed
      ? `<span class="data-flag data-flag--ok">${t("product.confirmed")}</span>`
      : CONFIG.demoMode ? `<span class="data-flag">${t("product.demoData")}</span>` : "";
  return `<tr><th scope="row">${esc(label)}</th><td>${missing ? `<span class="pending">${t("product.pending")}</span>` : esc(value)}${flag}</td></tr>`;
}

function relatedFor(p, n = 3) {
  const same = state.products.filter((x) => x.id !== p.id && x.category === p.category);
  const others = state.products.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...others].sort((a, b) => Number(isBuyable(b)) - Number(isBuyable(a))).slice(0, n);
}

export function renderProductPage(root) {
  const slug = new URLSearchParams(location.search).get("produto");
  const p = slug && getProduct(slug);
  if (!p) {
    document.title = `${t("product.notFound.title")} · ${CONFIG.brand}`;
    root.innerHTML = `<div class="container"><div class="empty-state" role="alert">
      <h1 class="display" style="font-size:clamp(2rem,1.4rem + 2vw,3.2rem);text-transform:none">${t("product.notFound.title")}</h1>
      <p>${t("product.notFound.text")}</p>
      <a class="btn btn--primary" href="${shopUrl()}"><span>${t("cart.empty.cta")}</span></a></div></div>`;
    return;
  }

  const cat = getCategory(p.category);
  const status = STATUS[p.status] || STATUS.sold;
  const buyable = isBuyable(p);
  const images = [p.images.primary, ...(p.images.gallery || [])];
  document.title = `${p.name} · ${p.tail} — ${CONFIG.brand}`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = `${p.name}, Betta ${p.tail} (${nameList(p.colors)}). ${p.shortDescription}`;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = document.title;

  const stockLine = buyable ? `${p.stock} exemplar${p.stock === 1 ? "" : "es"} em stock (demonstração)` : t(status.key);
  const related = relatedFor(p);

  root.innerHTML = `
<div class="container">
  <nav class="breadcrumbs" aria-label="Localização">
    <ol>
      <li><a href="${url("index.html")}">Início</a></li>
      <li><a href="${shopUrl()}">Coleção</a></li>
      <li><a href="${shopUrl("variedade=" + encodeURIComponent(p.category))}">${esc(cat?.name || p.tail)}</a></li>
      <li aria-current="page">${esc(p.name)}</li>
    </ol>
  </nav>
  <div class="grid-12 pdp__grid">
    <div class="pdp__gallery">
      <div class="pdp__main frame" data-pdp-main data-mask>
        ${imgHtml({ path: images[0], alt: p.images.alt, kind: "product", tint: p.tint, width: 1000, height: 1250, eager: true })}
      </div>
      ${images.length > 1 ? `<div class="pdp__thumbs" role="group" aria-label="Galeria de ${esc(p.name)}">
        ${images.map((img, i) => `<button type="button" class="pdp__thumb" data-thumb="${i}" aria-label="Ver imagem ${i + 1} de ${images.length}" aria-current="${i === 0}">${imgHtml({ path: img, alt: "", kind: "product", tint: p.tint, width: 200, height: 250 })}</button>`).join("")}
      </div>` : ""}
    </div>
    <div class="pdp__info">
      <div data-pdp-in><div style="display:flex;gap:.6rem;flex-wrap:wrap"><span class="badge badge--${esc(p.status)}" style="position:static">${t(status.key)}</span>${CONFIG.demoMode ? `<span class="badge badge--demo">${t("product.demoData")}</span>` : ""}</div></div>
      <div data-pdp-in>
        <p class="pdp__variety">${esc(p.tail)}</p>
        <h1 class="pdp__title">${esc(p.name)}</h1>
      </div>
      <p class="pdp__price" data-pdp-in>${formatPrice(p.price)}</p>
      <p class="lead muted" data-pdp-in>${esc(p.shortDescription)}</p>
      <div class="pdp__buy" data-pdp-in>
        <div class="pdp__buy-row">
          ${buyable
            ? `<button type="button" class="btn btn--primary btn--magnetic" data-add="${esc(p.id)}" data-magnetic><span class="btn__label">${t("add.label")}</span></button>`
            : `<span class="btn btn--ghost" aria-disabled="true">${t(status.key)}</span>`}
        </div>
        <p class="small muted">${esc(stockLine)}. Os nossos peixes são animais vivos: o envio é confirmado pela loja antes de qualquer pagamento.</p>
      </div>
      ${CONFIG.demoMode ? `<p class="demo-banner" data-pdp-in>Dados de demonstração: nome, preço, descrição e disponibilidade deste exemplar são ilustrativos e serão substituídos pelo stock real.</p>` : ""}
      <table class="spec-table" data-pdp-in>
        <caption class="visually-hidden">Ficha técnica de ${esc(p.name)}</caption>
        <tbody>
          ${specRow("Variedade", cat?.name || p.tail, "category", p)}
          ${specRow("Tipo de cauda", p.tail, "tail", p)}
          ${specRow("Cor", nameList(p.colors), "colors", p)}
          ${specRow("Sexo", p.sex, "sex", p)}
          ${specRow("Idade", p.ageMonths != null ? `${p.ageMonths} meses` : null, "ageMonths", p)}
          ${specRow("Tamanho aprox.", p.sizeCm != null ? `${p.sizeCm} cm` : null, "sizeCm", p)}
          ${specRow("Referência", p.id, "id", p)}
        </tbody>
      </table>
    </div>
  </div>

  <div class="grid-12 pdp__details">
    <div class="pdp__desc" data-reveal>
      <p class="eyebrow">Sobre este peixe</p>
      <h2 style="font-size:clamp(2rem,1.4rem + 2.4vw,3.6rem);margin:1.2rem 0 1.6rem">${esc(p.colorDescription)}</h2>
      <div class="prose"><p>${esc(p.description)}</p></div>
    </div>
    <aside class="pdp__care" data-reveal aria-labelledby="pdp-care-h">
      <h2 id="pdp-care-h" style="font-size:1.8rem;margin-bottom:1.2rem">Cuidados essenciais</h2>
      <ul>
        <li><strong>Aquário.</strong> Recomendamos um aquário de pelo menos 20 litros, com tampa, filtro de fluxo suave e aquecedor com termóstato.</li>
        <li><strong>Temperatura.</strong> Água estável, em geral entre 24 e 27 °C.</li>
        <li><strong>Água.</strong> Use sempre condicionador de água e deixe o aquário estabilizar (ciclo) antes de introduzir o peixe.</li>
        <li><strong>Convivência.</strong> Machos adultos não devem partilhar o mesmo espaço. A escolha de companhia requer cuidado.</li>
        <li><strong>Adaptação.</strong> A chegada ao novo aquário deve ser gradual. Veja o passo a passo no guia.</li>
      </ul>
      <p style="margin-top:1.4rem"><a class="link-arrow" href="${url("pages/care-guide.html")}"><span>Ler o guia de cuidados</span><span class="link-arrow__icon">${ARROW_SVG}</span></a></p>
    </aside>
  </div>

  <section class="related" aria-labelledby="related-h">
    <div class="section-head" data-reveal style="margin-bottom:0">
      <p class="eyebrow">Continue a explorar</p>
      <h2 id="related-h">Outros <em>Betta</em></h2>
    </div>
    <div class="related__grid" data-related>${related.map((r) => productCardHtml(r, { layout: "std" })).join("")}</div>
  </section>
</div>`;

  hydrateImages(root);

  // Galeria: transição suave entre imagens
  const main = $("[data-pdp-main]", root);
  root.querySelectorAll("[data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.thumb);
      root.querySelectorAll("[data-thumb]").forEach((b) => b.setAttribute("aria-current", String(b === btn)));
      const img = document.createElement("div");
      img.innerHTML = imgHtml({ path: images[i], alt: p.images.alt, kind: "product", tint: p.tint, width: 1000, height: 1250 });
      const next = img.firstElementChild;
      hydrateImages(img);
      crossfade(main, next);
    });
  });

  animateProductEntrance(root);
}
