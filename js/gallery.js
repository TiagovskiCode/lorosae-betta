/* ==========================================================================
   LOROSAE BETTA® — gallery.js
   Lightbox acessível para a galeria: abre a partir da grelha, navegação por
   teclado (←/→/Home/End/Esc), swipe em ecrãs táteis, trap de foco, regresso
   do foco ao elemento de origem e transições GSAP (com fallback sem movimento).
   ========================================================================== */
import { esc, imgHtml, hydrateImages, trapFocus, prefersReducedMotion, hasGsap, ARROW_SVG } from "./utils.js";
import { crossfade } from "./animations.js";

export function initGallery(grid, items) {
  if (!grid || !items.length) return () => {};

  const box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("data-lenis-prevent", "");
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Galeria de imagens");
  box.innerHTML = `
    <div class="lightbox__backdrop" data-lb-close></div>
    <button type="button" class="lightbox__close btn-icon" data-lb-close aria-label="Fechar galeria"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M2 2l12 12M14 2 2 14"/></svg></button>
    <button type="button" class="lightbox__nav lightbox__nav--prev btn-icon" data-lb-step="-1" aria-label="Imagem anterior"><span class="lightbox__arrow" style="transform:scaleX(-1)">${ARROW_SVG}</span></button>
    <figure class="lightbox__figure">
      <div class="lightbox__img" data-lb-img></div>
      <figcaption class="lightbox__cap">
        <span data-lb-title></span>
        <a class="link-arrow" data-lb-link href="#"><span>Ver ficha</span><span class="link-arrow__icon">${ARROW_SVG}</span></a>
        <span class="lightbox__count" data-lb-count aria-live="polite"></span>
      </figcaption>
    </figure>
    <button type="button" class="lightbox__nav lightbox__nav--next btn-icon" data-lb-step="1" aria-label="Imagem seguinte"><span class="lightbox__arrow">${ARROW_SVG}</span></button>`;
  document.body.appendChild(box);

  const imgBox = box.querySelector("[data-lb-img]");
  const titleEl = box.querySelector("[data-lb-title]");
  const linkEl = box.querySelector("[data-lb-link]");
  const countEl = box.querySelector("[data-lb-count]");
  const animate = () => hasGsap() && !prefersReducedMotion();

  let index = 0, isOpen = false, opener = null, release = null;

  const show = (i, { instant = false } = {}) => {
    index = (i + items.length) % items.length;
    const it = items[index];
    const wrap = document.createElement("div");
    wrap.innerHTML = imgHtml({ path: it.src, alt: it.alt, kind: "product", tint: it.tint, width: 1000, height: 1250 });
    const next = wrap.firstElementChild;
    hydrateImages(wrap);
    if (instant) { imgBox.innerHTML = ""; imgBox.appendChild(next); } else crossfade(imgBox, next);
    titleEl.textContent = it.title;
    linkEl.href = it.href;
    countEl.textContent = `${index + 1} / ${items.length}`;
    // pré-carrega as vizinhas
    [index - 1, index + 1].forEach((n) => { const x = items[(n + items.length) % items.length]; const w = document.createElement("div"); w.innerHTML = imgHtml({ path: x.src, alt: "", kind: "product", tint: x.tint }); hydrateImages(w); });
  };

  const open = (i, from) => {
    if (isOpen) return;
    isOpen = true;
    opener = from;
    box.hidden = false;
    document.body.classList.add("is-locked");
    show(i, { instant: true });
    if (animate()) {
      window.gsap.fromTo(box, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      window.gsap.fromTo(box.querySelector(".lightbox__figure"), { y: 24, scale: 0.97 }, { y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
    }
    release = trapFocus(box);
    box.querySelector(".lightbox__close").focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    release?.();
    document.body.classList.remove("is-locked");
    const done = () => { box.hidden = true; opener?.focus?.({ preventScroll: true }); };
    if (animate()) window.gsap.to(box, { autoAlpha: 0, duration: 0.35, ease: "power2.in", onComplete: done }); else done();
  };

  const step = (d) => show(index + d);

  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-gallery-index]");
    if (b) open(Number(b.dataset.galleryIndex), b);
  });
  box.addEventListener("click", (e) => {
    if (e.target.closest("[data-lb-close]")) close();
    const s = e.target.closest("[data-lb-step]");
    if (s) step(Number(s.dataset.lbStep));
  });
  const onKey = (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(items.length - 1);
  };
  document.addEventListener("keydown", onKey);

  // Swipe
  let x0 = null;
  box.addEventListener("pointerdown", (e) => { if (e.pointerType === "touch") x0 = e.clientX; });
  box.addEventListener("pointerup", (e) => { if (x0 !== null) { const dx = e.clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); x0 = null; } });

  return () => { document.removeEventListener("keydown", onKey); box.remove(); };
}
