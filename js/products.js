/* ==========================================================================
   AQUORA — products.js
   Carregamento do catálogo (data/products.json + data/categories.json) e
   renderização: cartões, destaques, variedades, galeria e ficha de produto.
   ========================================================================== */
import { CONFIG, STATUS, t, url, esc, formatPrice, fetchJson, imgHtml, hydrateImages, specimenNo, ARROW_SVG, $, $$ } from "./utils.js";
import { animateProductEntrance } from "./animations.js";

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
const arrow = `<span class="arrow" aria-hidden="true">${ARROW_SVG}</span>`;

/* ---------- Cartão ---------- */
export function productCardHtml(p, { reveal = true } = {}) {
  const status = STATUS[p.status] || STATUS.sold;
  const buyable = isBuyable(p);
  const link = productUrl(p);
  const action = buyable
    ? `<button type="button" class="add-btn" data-add="${esc(p.id)}" aria-label="${t("add.label")}: ${esc(p.name)}"><span class="btn__label">${t("add.short")}</span><span class="add-btn__plus" aria-hidden="true"></span></button>`
    : `<span class="status status--${esc(p.status)}">${t(status.key)}</span>`;
  return `<article class="product-card${buyable ? "" : " is-unavailable"}" data-id="${esc(p.id)}"${reveal ? " data-reveal" : ""}>
  <a class="product-card__media frame" href="${link}" tabindex="-1" aria-hidden="true">
    ${imgHtml({ path: p.images.primary, alt: "", kind: "product", tint: p.tint, width: 1000, height: 1250 })}
  </a>
  <span class="product-card__index" aria-hidden="true">${specimenNo(p)}</span>
  <div class="product-card__body">
    <p class="product-card__meta">${esc(p.tail)}${buyable ? "" : ` · ${t(status.key)}`}</p>
    <h3 class="product-card__name"><a href="${link}">${esc(p.name)}</a></h3>
    <p class="product-card__colors">${esc(nameList(p.colors))}</p>
    <div class="product-card__foot">
      <span class="product-card__price"><span class="visually-hidden">Preço: </span>${formatPrice(p.price)}</span>
      <div class="product-card__actions">${action}</div>
    </div>
  </div>
</article>`;
}

/* ---------- Destaques (home) ---------- */
export function renderFeatured(container) {
  const featured = state.products.filter((p) => p.featured);
  const available = state.products.filter(isBuyable).length;
  container.innerHTML = featured.map((p) => productCardHtml(p)).join("") + `
  <div class="featured__more" data-reveal>
    <p>${state.products.length} exemplares,<br><em>${available} disponíveis.</em></p>
    <a class="btn" href="${shopUrl()}"><span>Ver toda a coleção</span>${arrow.replace("arrow", "btn__arrow")}</a>
  </div>`;
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
    <a class="frame spotlight__main" href="${link}" data-mask data-parallax tabindex="-1" aria-hidden="true">
      ${imgHtml({ path: p.images.primary, alt: "", kind: "product", tint: p.tint, width: 1000, height: 1250 })}
    </a>
    ${detail ? `<div class="frame spotlight__detail" data-reveal>${imgHtml({ path: detail, alt: `Detalhe das escamas e barbatanas de ${p.name}`, kind: "product", tint: p.tint, width: 600, height: 750, sizes: "(max-width: 900px) 42vw, 18vw" })}</div>` : ""}
  </div>
  <div class="spotlight__text">
    <p class="eyebrow" data-reveal>Em destaque · ${specimenNo(p)}</p>
    <h2 class="spotlight__title" id="spotlight-title" data-split>${esc(p.name)}</h2>
    <p class="lead" data-reveal>${esc(p.colorDescription)}</p>
    <dl class="specs" data-stagger>
      <div><dt>Variedade</dt><dd>${esc(cat?.name || p.tail)}</dd></div>
      <div><dt>Cor</dt><dd>${esc(nameList(p.colors))}</dd></div>
      <div><dt>Estado</dt><dd>${t((STATUS[p.status] || STATUS.sold).key)}</dd></div>
      <div><dt>Preço</dt><dd>${formatPrice(p.price)}</dd></div>
    </dl>
    <div class="spotlight__cta" data-reveal>
      <a class="btn btn--primary" href="${link}"><span>Conhecer ${esc(p.name)}</span><span class="btn__arrow" aria-hidden="true">${ARROW_SVG}</span></a>
      ${buyable ? `<button type="button" class="link-arrow" data-add="${esc(p.id)}"><span class="btn__label">${t("add.label")}</span></button>` : ""}
    </div>
  </div>`;
  hydrateImages(container);

  // Ligação no rodapé do hero para o mesmo peixe
  const feature = $("[data-hero-feature]");
  if (feature) {
    $("[data-hero-feature-name]", feature).textContent = p.name;
    feature.hidden = false;
  }
}

/* ---------- Galeria (home): detalhes macro dos peixes publicados ---------- */
export function galleryItems() {
  return state.products
    .filter((p) => p.images.gallery?.length)
    .map((p) => {
      const cat = getCategory(p.category);
      return { src: p.images.gallery[0], alt: `Detalhe macro de ${p.name}: escamas e barbatanas`, name: p.name, title: `${p.name} — ${cat?.name || p.tail}`, variety: cat?.name || p.tail, href: productUrl(p), tint: p.tint };
    });
}

export function renderGalleryGrid(container, items) {
  container.innerHTML = items
    .map((it, i) => `<li class="gallery__item">
  <button type="button" class="gallery__btn frame" data-gallery-index="${i}" aria-label="Ampliar detalhe de ${esc(it.name)}">${imgHtml({ path: it.src, alt: it.alt, kind: "product", tint: it.tint, width: 600, height: 750, sizes: "(max-width: 900px) 72vw, 26vw" })}</button>
  <p class="gallery__cap"><strong>${esc(it.name)}</strong><span>${esc(it.variety)}</span></p>
</li>`)
    .join("");
  hydrateImages(container);
}

/* ---------- Variedades (home): índice com pré-visualização ---------- */
export function renderVarieties(container) {
  // Só variedades com peixes publicados
  const visible = state.categories.filter((c) => state.products.some((p) => p.category === c.id));
  const list = $("[data-varieties-list]", container);
  const preview = $("[data-varieties-preview]", container);
  list.innerHTML = visible
    .map((c, i) => {
      const avail = state.products.filter((p) => p.category === c.id && isBuyable(p)).length;
      const countText = avail > 0 ? (avail === 1 ? "1 disponível" : `${avail} disponíveis`) : "Sem disponibilidade";
      return `<li class="variety" data-variety-index="${i}">
  <a class="variety__link" href="${shopUrl("variedade=" + encodeURIComponent(c.id))}">
    <span class="variety__idx" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
    <span class="variety__thumb frame" aria-hidden="true">${imgHtml({ path: c.image, alt: "", kind: "variety", tint: c.tint, width: 180, height: 225, sizes: "80px" })}</span>
    <span class="variety__text"><span class="variety__name">${esc(c.name)}</span><span class="variety__tag">${esc(c.tagline)}</span></span>
    <span class="variety__count">${countText}</span>
  </a>
</li>`;
    })
    .join("");
  if (preview) {
    preview.innerHTML = visible.map((c, i) => imgHtml({ path: c.image, alt: "", kind: "variety", tint: c.tint, width: 900, height: 1125, cls: i === 0 ? "is-active" : "" })).join("");
    const imgs = $$("img", preview);
    const items = $$(".variety", list);
    const activate = (i) => {
      imgs.forEach((im, n) => im.classList.toggle("is-active", n === i));
      items.forEach((el, n) => el.classList.toggle("is-active", n === i));
    };
    list.addEventListener("pointerover", (e) => { const li = e.target.closest(".variety"); if (li) activate(Number(li.dataset.varietyIndex)); });
    list.addEventListener("focusin", (e) => { const li = e.target.closest(".variety"); if (li) activate(Number(li.dataset.varietyIndex)); });
    activate(0);
  }
  hydrateImages(container);
}

/* ---------- Ficha de produto ---------- */
function specRow(label, value) {
  const missing = value === null || value === undefined || value === "";
  return `<div><dt>${esc(label)}</dt><dd>${missing ? `<span class="pending">${t("product.pending")}</span>` : esc(value)}</dd></div>`;
}

function relatedFor(p, n = 3) {
  const same = state.products.filter((x) => x.id !== p.id && x.category === p.category);
  const others = state.products.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...same, ...others].sort((a, b) => Number(isBuyable(b)) - Number(isBuyable(a))).slice(0, n);
}

const CARE = [
  ["Aquário", "Pelo menos 20 litros, com tampa, filtro de fluxo suave e aquecedor com termóstato."],
  ["Temperatura", "Água estável, em geral entre 24 e 27 °C. Evite variações bruscas."],
  ["Água", "Condicionador sempre, e um aquário já estabilizado (ciclado) antes da chegada."],
  ["Convivência", "Machos adultos não devem partilhar o mesmo espaço. Qualquer companhia requer estudo."],
  ["Chegada", "Aclimatação gradual, com luz baixa nas primeiras horas."]
];

export function renderProductPage(root) {
  const slug = new URLSearchParams(location.search).get("produto");
  const p = slug && getProduct(slug);
  if (!p) {
    document.title = `${t("product.notFound.title")} — ${CONFIG.brand}`;
    root.innerHTML = `<div class="container"><div class="empty-state" role="alert" style="margin-top:3rem">
      <h1 class="display" style="font-size:var(--fs-xl)">${t("product.notFound.title")}</h1>
      <p>${t("product.notFound.text")}</p>
      <a class="btn btn--primary" href="${shopUrl()}"><span>${t("cart.empty.cta")}</span></a></div></div>`;
    return;
  }

  const cat = getCategory(p.category);
  const status = STATUS[p.status] || STATUS.sold;
  const buyable = isBuyable(p);
  const images = [p.images.primary, ...(p.images.gallery || [])];
  document.title = `${p.name} · Betta ${p.tail} — ${CONFIG.brand}`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = `${p.name}, Betta ${p.tail} (${nameList(p.colors)}). ${p.shortDescription}`;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = document.title;

  const stockLine = buyable
    ? p.stock === 1 ? "Exemplar único." : `${p.stock} exemplares disponíveis.`
    : `${t(status.key)}.`;
  const related = relatedFor(p);
  const alts = [p.images.alt, `Detalhe das escamas e barbatanas de ${p.name}`];

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
    <div class="pdp__gallery" aria-label="Fotografias de ${esc(p.name)}" role="region">
      <div class="pdp__track" data-pdp-track tabindex="0">
        ${images.map((img, i) => `<div class="pdp__slide frame"${i === 0 ? " data-mask" : " data-reveal"}>${imgHtml({ path: img, alt: alts[i] || alts[1], kind: "product", tint: p.tint, width: 1000, height: 1250, eager: i === 0, sizes: "(max-width: 900px) 100vw, 55vw" })}</div>`).join("")}
      </div>
      ${images.length > 1 ? `<p class="pdp__counter" data-pdp-counter aria-hidden="true">1 / ${images.length}</p>` : ""}
    </div>
    <div class="pdp__info">
      <div class="pdp__head" data-pdp-in>
        <p class="pdp__ref">${specimenNo(p)} · ${esc(cat?.name || p.tail)}</p>
        <h1 class="pdp__title">${esc(p.name)}</h1>
        <p class="pdp__variety">${esc(nameList(p.colors))}</p>
      </div>
      <p class="muted" data-pdp-in>${esc(p.shortDescription)}</p>
      <div class="pdp__price-row" data-pdp-in>
        <p class="pdp__price"><span class="visually-hidden">Preço: </span>${formatPrice(p.price)}</p>
        <span class="status status--${esc(p.status)}">${t(status.key)}</span>
      </div>
      <div class="pdp__buy" data-pdp-in>
        ${buyable
          ? `<button type="button" class="btn btn--primary btn--block" data-add="${esc(p.id)}"><span class="btn__label">${t("add.label")}</span></button>`
          : `<a class="btn btn--block" href="${url("index.html#contacto")}"><span>Pedir informação</span></a>`}
        <p class="pdp__note">${esc(stockLine)} Os peixes são animais vivos: a disponibilidade e o envio são confirmados antes de qualquer pagamento.</p>
      </div>
      <dl class="spec-list" data-pdp-in>
        ${specRow("Variedade", cat?.name || p.tail)}
        ${specRow("Tipo de cauda", p.tail)}
        ${specRow("Cor", nameList(p.colors))}
        ${specRow("Sexo", p.sex)}
        ${specRow("Idade", p.ageMonths != null ? `${p.ageMonths} meses` : null)}
        ${specRow("Tamanho aprox.", p.sizeCm != null ? `${p.sizeCm} cm` : null)}
        ${specRow("Referência", p.id.toUpperCase())}
      </dl>
    </div>
  </div>

  <section class="grid-12 pdp__story" aria-labelledby="pdp-story-h">
    <p class="eyebrow" style="grid-column:1/-1" data-reveal>Sobre ${esc(p.name)}</p>
    <h2 class="pdp__statement" id="pdp-story-h" data-split>${esc(p.colorDescription)}</h2>
    <div class="pdp__desc prose" data-reveal><p>${esc(p.description)}</p></div>
    ${cat ? `<aside class="pdp__variety-note" data-reveal aria-label="Sobre a variedade">
      <p class="eyebrow eyebrow--plain">A variedade</p>
      <h3>${esc(cat.name)} — <em>${esc(cat.tagline.toLowerCase())}</em></h3>
      <p>${esc(cat.description)}</p>
      <a class="link-arrow" href="${shopUrl("variedade=" + encodeURIComponent(cat.id))}"><span>Ver todos os ${esc(cat.name)}</span>${arrow}</a>
    </aside>` : ""}
  </section>
</div>

<section class="pdp__care" aria-labelledby="pdp-care-h">
  <div class="container grid-12 pdp__care-grid">
      <div class="pdp__care-head" data-reveal>
        <p class="eyebrow">Antes de decidir</p>
        <h2 id="pdp-care-h">Cuidados <em>essenciais</em></h2>
        <a class="link-arrow" href="${url("pages/care-guide.html")}"><span>Ler o guia completo</span>${arrow}</a>
      </div>
      <ul class="pdp__care-list" data-stagger>
        ${CARE.map(([k, v]) => `<li><strong>${k}</strong><span>${v}</span></li>`).join("")}
      </ul>
  </div>
</section>

<div class="container">
  <section class="related" aria-labelledby="related-h">
    <div class="section-head section-head--split" data-reveal>
      <p class="eyebrow">Continue a explorar</p>
      <h2 id="related-h">Outros <em>exemplares</em></h2>
      <a class="link-arrow" href="${shopUrl()}"><span>Ver toda a coleção</span>${arrow}</a>
    </div>
    <div class="related__grid">${related.map((r) => productCardHtml(r)).join("")}</div>
  </section>
</div>`;

  hydrateImages(root);

  // Contador do carrossel (telemóvel)
  const track = $("[data-pdp-track]", root);
  const counter = $("[data-pdp-counter]", root);
  if (track && counter) {
    track.addEventListener("scroll", () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      counter.textContent = `${i + 1} / ${images.length}`;
    }, { passive: true });
  }

  animateProductEntrance(root);
}
