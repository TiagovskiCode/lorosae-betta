/* ==========================================================================
   LOROSAE BETTA® — main.js
   Ponto de entrada: monta os componentes partilhados (layout.js), comportamentos
   gerais (FAQ, índice) e o arranque específico de cada página.
   Cada página declara <body data-page="home|shop|product|cart|about|care">.
   ========================================================================== */
import { t, $, $$, hydrateImages, prefersReducedMotion, hasGsap } from "./utils.js";
import { injectLayout, initHeaderState, initMenu, initNewsletter } from "./layout.js";
import { loadCatalogue, renderFeatured, renderVarieties, renderProductPage, renderSpotlight, renderGalleryGrid, galleryItems } from "./products.js";
import { initCart } from "./cart.js";
import { initAnimations, bindDynamic } from "./animations.js";
import { runLoader } from "./loader.js";
import { initContact } from "./contact.js";

const page = document.body.dataset.page || "";

/* ---------- FAQ / acordeão ---------- */
function initAccordions() {
  $$(".accordion__item").forEach((item) => {
    const trigger = $(".accordion__trigger", item);
    const panel = $(".accordion__panel", item);
    if (!trigger || !panel) return;
    panel.inert = true;
    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      panel.inert = open;
      if (hasGsap() && !prefersReducedMotion()) {
        gsap.to(panel, { height: open ? 0 : "auto", duration: 0.55, ease: "power3.inOut", onComplete: () => window.ScrollTrigger?.refresh() });
      } else panel.style.height = open ? "0px" : "auto";
    });
  });
}

/* ---------- Índice lateral (guia de cuidados / sobre) ---------- */
function initToc() {
  const links = $$(".toc a[href^='#']");
  if (!links.length || !("IntersectionObserver" in window)) return;
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((l) => l.classList.remove("is-active"));
        map.get(en.target.id)?.classList.add("is-active");
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Arranque por página ---------- */
function showLoadError(container) {
  container.removeAttribute("aria-busy");
  container.innerHTML = `<div class="load-error" role="alert"><strong>${t("load.error.title")}</strong><p>${t("load.error.text")}</p><p><code>npx serve .</code> · <code>python -m http.server</code></p></div>`;
}

/** Monta um bloco dinâmico e retira o estado de carregamento. */
function mount(sel, render) {
  const el = $(sel);
  if (!el) return null;
  render(el);
  el.removeAttribute("aria-busy");
  bindDynamic(el);
  return el;
}

async function initPage() {
  const cartReady = initCart();
  try {
    await loadCatalogue();
  } catch (err) {
    console.error(err);
    $$("[aria-busy='true']").forEach(showLoadError);
    await cartReady;
    return;
  }

  if (page === "home") {
    mount("[data-featured]", renderFeatured);
    mount("[data-spotlight]", renderSpotlight);
    mount("[data-varieties]", renderVarieties);
    const items = galleryItems();
    const gallery = mount("[data-gallery]", (el) => renderGalleryGrid(el, items));
    if (gallery) {
      const { initGallery } = await import("./gallery.js");
      initGallery(gallery, items);
    }
  } else if (page === "shop") {
    const root = $("[data-shop]");
    const { initShop } = await import("./filters.js");
    if (root) initShop(root);
    $("[data-grid]")?.removeAttribute("aria-busy");
  } else if (page === "product") {
    const root = $("[data-product-root]");
    if (root) { renderProductPage(root); root.removeAttribute("aria-busy"); }
  }
  await cartReady;
  window.dispatchEvent(new CustomEvent("lorosae:ready"));
}

injectLayout(document.body.dataset.nav || page);
hydrateImages();
initHeaderState();
initMenu();
initNewsletter();
initAccordions();
initToc();

// Loader de aquário: só na home, uma vez por sessão (a classe é decidida por um script inline no <head>)
const intro = document.documentElement.classList.contains("has-loader");
const motion = initAnimations({ intro });
if (intro) runLoader({ onExpand: motion.playHero });
else $("[data-loader]")?.remove();

initContact();
initPage();
