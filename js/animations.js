/* ==========================================================================
   AQUORA — animations.js
   Sistema de movimento GSAP + ScrollTrigger.

   Princípios
     · Movimento lento e contido: revela, não decora.
     · Só transform + opacity (+ clip-path nas máscaras de imagem).
     · Sem pinning e sem alterar o scroll nativo.
     · Cada ScrollTrigger é criado uma única vez (data-bound) e pode ser libertado (releaseReveals).
     · Parallax apenas em desktop.
     · prefers-reduced-motion: nenhuma animação; o conteúdo fica logo visível.
     · Se o GSAP não carregar, a classe .js-anim é removida e tudo fica visível.

   Os estados iniciais (ocultos) estão em css/animations.css.
   ========================================================================== */
import { $, $$, t, hasGsap, prefersReducedMotion } from "./utils.js";
import { initSmoothScroll } from "./scroll.js";

const motionOK = () => hasGsap() && !prefersReducedMotion();
const hasST = () => typeof window.ScrollTrigger !== "undefined";

/* Triggers por contentor, para poderem ser libertados quando o conteúdo é substituído */
const tracked = new WeakMap();
function track(owner, triggers) {
  const list = tracked.get(owner) || [];
  list.push(...[].concat(triggers));
  tracked.set(owner, list);
}
export function releaseReveals(owner) {
  (tracked.get(owner) || []).forEach((st) => st.kill());
  tracked.delete(owner);
}

/* ---------- Utilitário: separar texto em palavras (preserva <em>, etc.) ---------- */
export function splitWords(el, { mask = true } = {}) {
  if (el.dataset.splitDone) return $$(mask ? ".sw__i" : ".w", el);
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          if (mask) {
            const outer = document.createElement("span"); outer.className = "sw";
            const inner = document.createElement("span"); inner.className = "sw__i"; inner.textContent = part;
            outer.appendChild(inner); frag.appendChild(outer);
          } else {
            const w = document.createElement("span"); w.className = "w"; w.textContent = part; frag.appendChild(w);
          }
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && !child.classList.contains("sw") && !child.classList.contains("w")) walk(child);
    });
  };
  walk(el);
  el.dataset.splitDone = "1";
  return $$(mask ? ".sw__i" : ".w", el);
}

/* ==========================================================================
   HERO — entrada: imagem desvanece e assenta, título sobe por linhas,
   texto de apoio e CTAs em cascata.
   ========================================================================== */
function initHero(intro) {
  const hero = $("[data-hero]");
  if (!hero) return null;
  const img = $(".hero__img", hero);
  const lines = $$(".hero__title .line__inner", hero);
  const q = (name) => $$(`[data-hero-fade="${name}"]`, hero);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: intro, delay: intro ? 0 : 0.15 });
  tl.fromTo(img, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4, ease: "power2.out" }, 0)
    .fromTo(q("eyebrow"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
    .fromTo(lines, { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.12, ease: "power4.out" }, 0.45)
    .fromTo(q("lead"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.95)
    .fromTo(q("cta"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.1)
    .fromTo(q("foot"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.35);

  const cue = $(".hero__scroll-line i", hero);
  if (cue) tl.fromTo(cue, { yPercent: -100 }, { yPercent: 100, duration: 1.8, ease: "power2.inOut", repeat: -1, repeatDelay: 0.8 }, 1.8);

  return { tl, play: () => tl.play() };
}

/* ---------- Cabeçalho: esconde ao descer, mostra ao subir ---------- */
function initHeader() {
  const header = $(".site-header");
  if (!header || !hasST()) return;
  let hidden = false;
  const set = (hide) => {
    if (hide === hidden) return;
    hidden = hide;
    gsap.to(header, { yPercent: hide ? -100 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const locked = document.body.classList.contains("is-locked");
      set(!locked && self.direction === 1 && self.scroll() > 600);
      if (self.direction === -1 || self.scroll() < 600) set(false);
    }
  });
  header.addEventListener("focusin", () => set(false));
}

/* ==========================================================================
   REVELAÇÕES POR SCROLL (reutilizável para conteúdo dinâmico)
   [data-reveal]  fade + subida curta, em lotes com stagger
   [data-stagger] filhos diretos em cascata
   [data-mask]    imagem revelada de baixo para cima, com escala suave
   [data-split]   título por palavras com máscara
   [data-words]   parágrafo que "acende" palavra a palavra com o scroll
   ========================================================================== */
export function bindReveals(root = document) {
  if (!motionOK() || !hasST()) return;
  const owner = root === document ? document : root;

  const singles = $$("[data-reveal]:not([data-bound])", root);
  singles.forEach((el) => (el.dataset.bound = "1"));
  if (singles.length) {
    track(owner, ScrollTrigger.batch(singles, {
      start: "top 90%", once: true, batchMax: 6, interval: 0.1,
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.08, overwrite: "auto" })
    }));
  }

  $$("[data-stagger]:not([data-bound])", root).forEach((group) => {
    group.dataset.bound = "1";
    track(owner, ScrollTrigger.create({
      trigger: group, start: "top 88%", once: true,
      onEnter: () => gsap.fromTo(group.children, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08 })
    }));
  });

  $$("[data-mask]:not([data-bound])", root).forEach((frame) => {
    frame.dataset.bound = "1";
    track(owner, ScrollTrigger.create({
      trigger: frame, start: "top 92%", once: true,
      onEnter: () => {
        const im = frame.querySelector("img");
        gsap.timeline()
          .fromTo(frame, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, 0)
          .fromTo(im, { scale: 1.15 }, { scale: 1, duration: 2, ease: "power3.out" }, 0);
      }
    }));
  });

  $$("[data-split]:not([data-bound])", root).forEach((el) => {
    el.dataset.bound = "1";
    const words = splitWords(el);
    track(owner, ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.fromTo(words, { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.04 })
    }));
  });

  $$("[data-words]:not([data-bound])", root).forEach((el) => {
    el.dataset.bound = "1";
    const words = splitWords(el, { mask: false });
    track(owner, gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: 0.6 }
    }).scrollTrigger);
  });

  safetyReveal(root);
}

/** Rede de segurança: nada que já ficou para trás deve permanecer invisível. */
function safetyReveal(root) {
  setTimeout(() => {
    $$("[data-reveal], [data-stagger] > *", root).forEach((el) => {
      if (getComputedStyle(el).visibility === "hidden" && el.getBoundingClientRect().bottom < 0) gsap.set(el, { autoAlpha: 1, y: 0 });
    });
    $$("[data-mask]", root).forEach((el) => { if (el.getBoundingClientRect().bottom < 0) gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" }); });
    $$("[data-split] .sw__i", root).forEach((el) => { if (el.getBoundingClientRect().bottom < 0) gsap.set(el, { autoAlpha: 1, yPercent: 0 }); });
  }, 1200);
}

/** Para conteúdo gerado depois do carregamento (grelhas, páginas de produto). */
export function bindDynamic(root) {
  bindReveals(root);
  refreshScroll();
}

let refreshTimer;
export function refreshScroll() {
  if (!hasST()) return;
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
}

/* ---------- Parallax contido (apenas desktop) ---------- */
function initParallax() {
  if (!hasST()) return;
  const hero = $("[data-hero]");
  if (hero) gsap.to($(".hero__media", hero), { yPercent: 12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  $$("[data-parallax]").forEach((frame) => {
    const im = frame.querySelector("img");
    if (im) gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

/* ---------- Feedback de "Adicionar ao carrinho" ---------- */
export function addFeedback(btn) {
  const label = btn.querySelector(".btn__label");
  if (label) {
    btn.dataset.label ||= label.textContent;
    label.textContent = t("add.done");
  }
  btn.classList.add("is-added");
  clearTimeout(btn._addTimer);
  btn._addTimer = setTimeout(() => {
    if (label) label.textContent = btn.dataset.label;
    btn.classList.remove("is-added");
  }, 1900);
}

export function bumpCartCount() {
  if (!motionOK()) return;
  const els = $$(".cart-toggle__count");
  if (els.length) gsap.fromTo(els, { scale: 1.4 }, { scale: 1, duration: 0.6, ease: "power3.out", overwrite: "auto" });
}

/* ---------- Gaveta do carrinho ---------- */
const kill = (targets) => { if (hasGsap()) gsap.killTweensOf(targets); };

export function animateDrawer(open, drawer, overlay) {
  kill([drawer, overlay]);
  if (!motionOK()) {
    drawer.style.visibility = open ? "visible" : "hidden";
    overlay.style.visibility = open ? "visible" : "hidden";
    overlay.style.opacity = open ? "1" : "0";
    if (hasGsap()) gsap.set(drawer, { xPercent: 0 });
    return;
  }
  if (open) {
    gsap.set([drawer, overlay], { visibility: "visible" });
    gsap.to(overlay, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: "power4.out" });
    gsap.fromTo(drawer.querySelectorAll(".cart-line"), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.06, delay: 0.2 });
  } else {
    gsap.to(overlay, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: () => gsap.set(overlay, { visibility: "hidden" }) });
    gsap.to(drawer, { xPercent: 100, duration: 0.5, ease: "power3.inOut", onComplete: () => gsap.set(drawer, { visibility: "hidden" }) });
  }
}

export function animateLineOut(el, done) {
  if (!el || !motionOK()) { done(); return; }
  gsap.to(el, { autoAlpha: 0, x: 24, duration: 0.3, ease: "power2.in", onComplete: done });
}

/* ---------- Menu móvel: cortina de cima para baixo ---------- */
export function animateMenu(open, menu) {
  kill([menu]);
  const items = Array.from(menu.querySelectorAll(".mobile-menu__link, .mobile-menu__foot"));
  if (!motionOK()) {
    menu.classList.toggle("is-open", open);
    menu.style.clipPath = open ? "none" : "";
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    if (open) {
      menu.classList.add("is-open");
      gsap.killTweensOf(items);
      gsap.timeline({ onComplete: resolve })
        .fromTo(menu, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" }, 0)
        .fromTo(items, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "power4.out", stagger: 0.06 }, 0.25);
    } else {
      gsap.to(menu, {
        clipPath: "inset(0% 0% 100% 0%)", duration: 0.5, ease: "power3.inOut",
        onComplete: () => { menu.classList.remove("is-open"); resolve(); }
      });
    }
  });
}

/* ---------- Produto: grelha, transições, entrada ---------- */
export function animateGridIn(grid) {
  if (!motionOK()) return;
  const cards = Array.from(grid.children);
  if (!cards.length) return;
  gsap.fromTo(cards, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: { each: 0.05, from: "start" }, clearProps: "all", overwrite: "auto" });
}

export function crossfade(container, next) {
  const prev = Array.from(container.querySelectorAll("img"));
  container.appendChild(next);
  if (!motionOK()) { prev.forEach((p) => p.remove()); return; }
  gsap.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power2.out", onComplete: () => prev.forEach((p) => p.remove()) });
}

export function animateProductEntrance(root) {
  bindDynamic(root);
  if (!motionOK()) return;
  gsap.fromTo($$("[data-pdp-in]", root), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.07, delay: 0.15 });
}

/* ==========================================================================
   Inicialização
   ========================================================================== */
let started = false;
/**
 * @param {{ intro?: boolean }} opts  intro = a cortina de entrada está a correr; o hero espera por `playHero()`
 * @returns {{ playHero: () => void }}
 */
export function initAnimations({ intro = false } = {}) {
  const noop = { playHero: () => {} };
  if (started) return noop;
  started = true;
  const root = document.documentElement;
  const fail = () => { root.classList.remove("js-anim", "has-loader"); return noop; };

  if (!hasGsap() || !hasST()) return fail();
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  window.__aqReady = true;

  if (prefersReducedMotion()) { root.classList.remove("js-anim"); return noop; }

  initSmoothScroll();
  const hero = initHero(intro);
  initHeader();
  bindReveals(document);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px)", () => { initParallax(); });

  // Recalcula posições quando fontes e imagens terminam de carregar
  document.fonts?.ready.then(refreshScroll);
  window.addEventListener("load", refreshScroll, { once: true });

  return { playHero: () => hero?.play() };
}
