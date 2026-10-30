/* ==========================================================================
   LOROSAE BETTA® — animations.js
   Sistema de movimento GSAP + ScrollTrigger.

   Princípios
     · Só transform + opacity (+ clip-path nas máscaras). Sem blur animado.
     · Sem pinning e sem alterar o scroll nativo.
     · Cada ScrollTrigger é criado uma única vez (data-bound) e pode ser libertado (releaseReveals).
     · Efeitos caros (parallax, hover com rato) só em desktop com ponteiro fino.
     · prefers-reduced-motion: nenhuma animação; o conteúdo fica logo visível.
     · Se o GSAP não carregar, a classe .js-anim é removida e tudo fica visível.

   Os estados iniciais (ocultos) estão em css/animations.css.
   ========================================================================== */
import { $, $$, t, hasGsap, prefersReducedMotion } from "./utils.js";
import { createAmbient } from "./ambient.js";
import { initSmoothScroll } from "./scroll.js";

const motionOK = () => hasGsap() && !prefersReducedMotion();
/** Raio (px) de um elemento, para as máscaras arredondadas acompanharem o design system. */
const radiusOf = (el, fallback = 28) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || fallback;
const roundInset = (pct, r) => `inset(${pct}% ${pct}% ${pct}% ${pct}% round ${r}px)`;
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
function splitWords(el, { mask = true } = {}) {
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
   HERO — timeline cinematográfica
   1 marca · 2 máscara da imagem · 3 tipografia por linhas · 4 texto de apoio ·
   5 CTAs · 6 escala suave da imagem · 7 composição final
   ========================================================================== */
function initHero(intro) {
  const hero = $("[data-hero]");
  if (!hero) return null;
  const media = $(".hero__media", hero);
  const img = $(".hero__img", hero);
  const mark = $$(".hero__mark span > i", hero);
  const lines = $$(".hero__title .line__inner", hero);
  const bar = $$(".site-header__bar, .site-header__notice");
  const q = (name) => $$(`[data-hero-fade="${name}"]`, hero);

  // Com loader, o aquário já revelou a imagem: o hero só precisa de entrar o texto.
  // Sem loader (visitas seguintes, reduced-motion desativado), corre a entrada completa.
  const o = intro ? 0 : 1.65;
  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: intro });
  if (intro) {
    gsap.set(media, { clipPath: roundInset(0, radiusOf(media, 44)), opacity: 1 });
    gsap.set(img, { scale: 1 });
  } else {
    tl.fromTo(mark, { yPercent: 115, autoAlpha: 1 }, { yPercent: 0, duration: 0.9, stagger: 0.12, ease: "power4.out" }, 0.1)
      .fromTo(media, { clipPath: roundInset(6, radiusOf(media, 44) * 1.4), opacity: 0 }, { clipPath: roundInset(0, radiusOf(media, 44)), opacity: 1, duration: 1.35, ease: "power4.inOut" }, 0.55)
      .fromTo(img, { scale: 1.24 }, { scale: 1, duration: 3.2, ease: "power2.out" }, 0.55)
      .to(mark, { yPercent: -115, duration: 0.7, stagger: 0.08, ease: "power3.in" }, 1.45)
      .set(mark, { autoAlpha: 0 }, 2.3);
  }
  tl.fromTo(bar, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.9 }, o + 0.05)
    .fromTo(q("eyebrow"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, o)
    .fromTo(lines, { yPercent: 115, autoAlpha: 1 }, { yPercent: 0, duration: 1.1, stagger: 0.14, ease: "power4.out" }, o + 0.1)
    .fromTo(q("lead"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.9 }, o + 0.55)
    .fromTo(q("cta"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, o + 0.8)
    .fromTo(q("foot"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 1 }, o + 1.15);

  const cue = $(".hero__scroll b", hero);
  if (cue) tl.fromTo(cue, { yPercent: -100 }, { yPercent: 100, duration: 1.6, ease: "power2.inOut", repeat: -1, repeatDelay: 0.9 }, o + 1.35);

  // Luz e partículas subtis (param quando o hero sai do ecrã)
  const beams = $$(".hero__light i", hero);
  const canvas = $(".hero__particles", hero);
  const lowPower = window.matchMedia("(max-width: 700px)").matches || (navigator.hardwareConcurrency || 8) <= 4;
  const ambient = canvas ? createAmbient(canvas, { count: lowPower ? 10 : 24, bubbles: 0.25, speed: 0.8 }) : null;
  const sway = gsap.timeline({ paused: true });
  beams.forEach((b, i) => sway.to(b, { x: i % 2 ? -30 : 30, duration: 7 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0));
  tl.fromTo(beams, { autoAlpha: 0 }, { autoAlpha: 0.7, duration: 2, stagger: 0.3, ease: "sine.out" }, o + 0.3)
    .add(() => {
      if (ambient) { ambient.start(); const v = { i: 0 }; gsap.to(v, { i: 0.8, duration: 2.4, onUpdate: () => ambient.setIntensity(v.i) }); }
      sway.play();
    }, o + 0.4);
  ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: (self) => { self.isActive ? sway.play() : sway.pause(); } });

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
    gsap.to(header, { yPercent: hide ? -100 : 0, duration: 0.55, ease: "power3.out", overwrite: "auto" });
  };
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const locked = document.body.classList.contains("is-locked");
      set(!locked && self.direction === 1 && self.scroll() > 520);
      if (self.direction === -1 || self.scroll() < 520) set(false);
    }
  });
  header.addEventListener("focusin", () => set(false));
}

/* ==========================================================================
   REVELAÇÕES POR SCROLL (reutilizável para conteúdo dinâmico)
   [data-reveal]  fade + subida, em lotes com stagger
   [data-stagger] filhos diretos em cascata
   [data-mask]    imagem revelada por máscara (clip-path) com escala
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
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.09, overwrite: "auto" })
    }));
  }

  $$("[data-stagger]:not([data-bound])", root).forEach((group) => {
    group.dataset.bound = "1";
    track(owner, ScrollTrigger.create({
      trigger: group, start: "top 86%", once: true,
      onEnter: () => gsap.fromTo(group.children, { autoAlpha: 0, y: 42 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 })
    }));
  });

  $$("[data-mask]:not([data-bound])", root).forEach((frame) => {
    frame.dataset.bound = "1";
    track(owner, ScrollTrigger.create({
      trigger: frame, start: "top 90%", once: true,
      onEnter: () => {
        const im = frame.querySelector("img");
        gsap.timeline()
          .fromTo(frame, { clipPath: roundInset(10, radiusOf(frame) * 1.8), opacity: 0 }, { clipPath: roundInset(0, radiusOf(frame)), opacity: 1, duration: 1.4, ease: "power4.inOut" }, 0)
          .fromTo(im, { scale: 1.25 }, { scale: 1, duration: 1.9, ease: "power3.out" }, 0);
      }
    }));
  });

  $$("[data-split]:not([data-bound])", root).forEach((el) => {
    el.dataset.bound = "1";
    const words = splitWords(el);
    track(owner, ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.fromTo(words, { yPercent: 115, autoAlpha: 1 }, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.045 })
    }));
  });

  $$("[data-words]:not([data-bound])", root).forEach((el) => {
    el.dataset.bound = "1";
    const words = splitWords(el, { mask: false });
    track(owner, gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 52%", scrub: 0.6 }
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
    $$("[data-mask]", root).forEach((el) => { if (el.getBoundingClientRect().bottom < 0) gsap.set(el, { clipPath: roundInset(0, radiusOf(el)), opacity: 1 }); });
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

/* ---------- Transições subtis de fundo entre secções ---------- */
function initBackgrounds() {
  if (!hasST()) return;
  $$("[data-bg]").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: "top 60%", end: "bottom 60%",
      onToggle: (self) => { if (self.isActive) gsap.to(document.body, { backgroundColor: sec.dataset.bg, duration: 1, ease: "power2.out", overwrite: "auto" }); }
    });
  });
}

/* ---------- Parallax controlado (apenas desktop; reduzido em tablet) ---------- */
function initParallax(desktop) {
  if (!hasST()) return;
  const hero = $("[data-hero]");
  if (hero) {
    gsap.to($(".hero__img", hero), { yPercent: desktop ? 10 : 4, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
    if (desktop) gsap.to($(".hero__content", hero), { yPercent: -8, opacity: 0.15, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom 30%", scrub: true } });
  }
  if (desktop) {
    $$("[data-parallax]").forEach((frame) => {
      const im = frame.querySelector("img");
      if (im) gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }
}

/* ==========================================================================
   MICROINTERAÇÕES (delegadas: funcionam com conteúdo dinâmico)
   ========================================================================== */
function initPointerFx() {
  let hovered = null, xTo = null, yTo = null, lifted = null;
  let mag = null;
  const arrows = new Map();

  const over = (e) => {
    const media = e.target.closest?.(".product-card__media");
    if (media && media !== hovered) {
      hovered = media;
      const im = media.querySelector("img");
      xTo = gsap.quickTo(im, "x", { duration: 0.9, ease: "power3.out" });
      yTo = gsap.quickTo(im, "y", { duration: 0.9, ease: "power3.out" });
      gsap.to(im, { scale: 1.07, duration: 1.2, ease: "power3.out", overwrite: "auto" });
    }
    const card = e.target.closest?.(".product-card, .variety, .xp-item, .pillar");
    if (card && card !== lifted) {
      if (lifted) gsap.to(lifted, { y: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      lifted = card;
      gsap.to(card, { y: -6, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    }
    const link = e.target.closest?.(".btn, .link-arrow");
    if (link && !arrows.has(link)) {
      const arrow = link.querySelector(".btn__arrow, .link-arrow__icon");
      if (arrow) { arrows.set(link, arrow); gsap.to(arrow, { x: 6, duration: 0.5, ease: "power3.out", overwrite: "auto" }); }
    }
  };
  const move = (e) => {
    if (hovered && xTo) {
      const r = hovered.getBoundingClientRect();
      xTo(-((e.clientX - r.left) / r.width - 0.5) * 22);
      yTo(-((e.clientY - r.top) / r.height - 0.5) * 22);
    }
    const m = e.target.closest?.("[data-magnetic]");
    if (m) {
      mag = m;
      const r = m.getBoundingClientRect();
      gsap.to(m, { x: (e.clientX - (r.left + r.width / 2)) * 0.22, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.5, ease: "power3.out", overwrite: "auto" });
    } else if (mag) { release(mag); mag = null; }
  };
  const release = (el) => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.45)", overwrite: "auto" });
  const out = (e) => {
    if (hovered && !hovered.contains(e.relatedTarget)) {
      const im = hovered.querySelector("img");
      gsap.to(im, { scale: 1, x: 0, y: 0, duration: 1.1, ease: "power3.out", overwrite: "auto" });
      hovered = null; xTo = yTo = null;
    }
    if (lifted && !lifted.contains(e.relatedTarget)) { gsap.to(lifted, { y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" }); lifted = null; }
    arrows.forEach((arrow, link) => {
      if (!link.contains(e.relatedTarget)) { gsap.to(arrow, { x: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" }); arrows.delete(link); }
    });
  };

  document.addEventListener("pointerover", over);
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerout", out);
  return () => {
    document.removeEventListener("pointerover", over);
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerout", out);
  };
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
  if (!motionOK()) return;
  gsap.fromTo(btn, { scale: 0.94 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,0.5)", overwrite: "auto" });
  flyToCart(btn);
}

function flyToCart(from) {
  const target = $("[data-cart-toggle] .cart-toggle__count") || $("[data-cart-toggle]");
  if (!target) return;
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const dot = document.createElement("span");
  Object.assign(dot.style, { position: "fixed", left: "0", top: "0", width: "10px", height: "10px", borderRadius: "50%", background: "#70e1d1", zIndex: 300, pointerEvents: "none" });
  document.body.appendChild(dot);
  const sx = a.left + a.width / 2, sy = a.top + a.height / 2;
  const tx = b.left + b.width / 2, ty = Math.max(b.top + b.height / 2, 12);
  gsap.set(dot, { x: sx, y: sy });
  gsap.to(dot, { x: tx, duration: 0.85, ease: "power1.inOut" });
  gsap.to(dot, { y: ty, duration: 0.85, ease: "power3.in", onComplete: () => dot.remove() });
  gsap.fromTo(dot, { scale: 1.6 }, { scale: 0.5, duration: 0.85, ease: "power1.in" });
}

export function bumpCartCount() {
  if (!motionOK()) return;
  const els = $$(".cart-toggle__count");
  if (els.length) gsap.fromTo(els, { scale: 1.5 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,0.45)", overwrite: "auto", delay: 0.7 });
}

/* ---------- Gaveta do carrinho ---------- */
export function animateDrawer(open, drawer, overlay) {
  gsap_kill([drawer, overlay]);
  if (!motionOK()) {
    drawer.style.visibility = open ? "visible" : "hidden";
    overlay.style.visibility = open ? "visible" : "hidden";
    overlay.style.opacity = open ? "1" : "0";
    if (hasGsap()) gsap.set(drawer, { xPercent: 0 });
    return;
  }
  if (open) {
    gsap.set(drawer, { visibility: "visible" });
    gsap.set(overlay, { visibility: "visible" });
    gsap.to(overlay, { opacity: 1, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(drawer, { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: "power4.out" });
    gsap.fromTo(drawer.querySelectorAll(".cart-line"), { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.07, delay: 0.25 });
  } else {
    gsap.to(overlay, { opacity: 0, duration: 0.4, ease: "power2.in", onComplete: () => gsap.set(overlay, { visibility: "hidden" }) });
    gsap.to(drawer, { xPercent: 100, duration: 0.55, ease: "power3.inOut", onComplete: () => gsap.set(drawer, { visibility: "hidden" }) });
  }
}
const gsap_kill = (targets) => { if (hasGsap()) gsap.killTweensOf(targets); };

export function animateLineOut(el, done) {
  if (!el || !motionOK()) { done(); return; }
  gsap.to(el, { autoAlpha: 0, x: 30, duration: 0.3, ease: "power2.in", onComplete: done });
}

/* ---------- Menu móvel ---------- */
export function animateMenu(open, menu) {
  gsap_kill([menu]);
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
        .fromTo(menu, { clipPath: `inset(0% 0% 100% 0% round ${radiusOf(menu, 36)}px)` }, { clipPath: `inset(0% 0% 0% 0% round ${radiusOf(menu, 36)}px)`, duration: 0.75, ease: "power4.inOut" }, 0)
        .fromTo(items, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out", stagger: 0.07 }, 0.3);
    } else {
      gsap.to(menu, {
        clipPath: `inset(0% 0% 100% 0% round ${radiusOf(menu, 36)}px)`, duration: 0.55, ease: "power3.inOut",
        onComplete: () => { menu.classList.remove("is-open"); resolve(); }
      });
    }
  });
}

/* ---------- Produto: grelha, galeria, entrada ---------- */
export function animateGridIn(grid) {
  if (!motionOK()) return;
  const cards = Array.from(grid.children);
  if (!cards.length) return;
  gsap.fromTo(cards, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: { each: 0.045, from: "start" }, clearProps: "all", overwrite: "auto" });
}

export function crossfade(container, next) {
  const prev = Array.from(container.querySelectorAll("img"));
  container.appendChild(next);
  if (!motionOK()) { prev.forEach((p) => p.remove()); return; }
  gsap.fromTo(next, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "power2.out", onComplete: () => prev.forEach((p) => p.remove()) });
}

export function animateProductEntrance(root) {
  bindDynamic(root);
  if (!motionOK()) return;
  const items = $$("[data-pdp-in]", root);
  gsap.fromTo(items, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, delay: 0.2 });
}

/* ==========================================================================
   Inicialização
   ========================================================================== */
let started = false;
/**
 * @param {{ intro?: boolean }} opts  intro = o loader de aquário está a correr; o hero espera por `playHero()`
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
  window.__lbReady = true;

  if (prefersReducedMotion()) { root.classList.remove("js-anim"); return noop; }

  initSmoothScroll();
  const hero = initHero(intro);  // corre uma só vez, fora do matchMedia (não repete ao redimensionar)
  initHeader();
  bindReveals(document);
  initBackgrounds();

  // Efeitos dependentes do dispositivo — o matchMedia limpa-os sozinho quando a condição muda
  const mm = gsap.matchMedia();
  mm.add({ desktop: "(min-width: 901px)", fine: "(hover: hover) and (pointer: fine)" }, (ctx) => {
    const { desktop, fine } = ctx.conditions;
    initParallax(desktop);
    const off = fine ? initPointerFx() : null;
    return () => off?.();
  });

  // Recalcula posições quando fontes e imagens terminam de carregar
  document.fonts?.ready.then(refreshScroll);
  window.addEventListener("load", refreshScroll, { once: true });

  return { playHero: () => hero?.play() };
}
