/* ==========================================================================
   LOROSAE BETTA® — loader.js
   Entrada "Aquário" — 3 segundos, uma só timeline GSAP.

   0.0–0.8 s  Imersão        água azul-petróleo, brilho, raios de luz, partículas
   0.8–2.0 s  Peixes         três peixes da coleção atravessam em profundidades
                             diferentes (perto/meio/longe = velocidades e escalas)
   2.0–2.6 s  Marca          nome letra a letra, linha e frase
   2.6–3.0 s  Transição      a janela do aquário encolhe até ao cartão do hero
                             (mesmo raio) e desvanece; o hero entra por baixo

   Regras: só na home, uma vez por sessão (script inline no <head> decide);
   não espera por nada — se uma fotografia falhar, esse peixe simplesmente não
   aparece; botão "Saltar" e tecla Esc; failsafe aos 6 s.
   Com prefers-reduced-motion: entrada simplificada (só opacidade, ~1,2 s).
   ========================================================================== */
import { $, $$, url, hasGsap, prefersReducedMotion } from "./utils.js";
import { createAmbient } from "./ambient.js";

const FLAG = "lb.intro.v1";
const markSeen = () => { try { sessionStorage.setItem(FLAG, "1"); } catch { /* sem armazenamento: pode repetir, sem problema */ } };

function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  return Array.from(text).map((ch) => {
    const outer = document.createElement("span");
    outer.className = "sw";
    const inner = document.createElement("span");
    inner.className = "sw__i";
    inner.textContent = ch === " " ? " " : ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });
}

/** Retângulo do cartão do hero, em clip-path, com o mesmo raio. */
function heroClip() {
  const media = $(".hero__media");
  if (!media) return "inset(0px 0px 0px 0px round 0px)";
  const r = media.getBoundingClientRect();
  const radius = parseFloat(getComputedStyle(media).borderTopLeftRadius) || 40;
  return `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round ${radius}px)`;
}

/** @param {{ onExpand: () => void }} opts  onExpand: o hero começa a entrar */
export function runLoader({ onExpand }) {
  const root = document.documentElement;
  const loader = $("[data-loader]");
  let expanded = false, done = false, ambient = null;
  const started = performance.now();
  const expand = () => { if (!expanded) { expanded = true; onExpand?.(); } };
  const finish = () => {
    if (done) return;
    done = true;
    ambient?.destroy();
    loader?.remove();
    root.classList.remove("has-loader");
    window.__lbLoaderDone = true;
    window.__lbLoaderMs = Math.round(performance.now() - started);
    markSeen();
  };

  if (!loader) { root.classList.remove("has-loader"); expand(); return; }
  if (!hasGsap()) { finish(); expand(); return; }
  const gsap = window.gsap;
  const brand = $(".loader__brand", loader);
  const skip = $(".loader__skip", loader);

  // ----- Entrada simplificada (movimento reduzido): só opacidade -----
  if (prefersReducedMotion()) {
    loader.classList.add("loader--reduced");
    gsap.timeline({ onComplete: finish })
      .fromTo(brand, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "none" })
      .add(expand, "+=0.35")
      .to(loader, { opacity: 0, duration: 0.4, ease: "none" });
    setTimeout(() => { expand(); finish(); }, 4000);
    return;
  }

  // ----- Elementos -----
  const water = $(".loader__water", loader);
  const glow = $(".loader__glow", loader);
  const shafts = $$(".loader__shafts i", loader);
  const line = $(".loader__line", loader);
  const chars = $$(".loader__name [data-char]", loader).flatMap(splitChars);
  const words = $$(".loader__tag [data-word] > i", loader);
  const fish = $$("[data-fish]", loader);

  // Fotografias dos peixes: só são pedidas quando o loader corre
  fish.forEach((f) => {
    const img = f.querySelector("img");
    img.addEventListener("load", () => img.classList.add("is-ready"), { once: true });
    img.addEventListener("error", () => f.remove(), { once: true });
    img.src = url(img.dataset.src);
  });

  const narrow = innerWidth < 700;
  ambient = createAmbient($("[data-loader-canvas]", loader), { count: narrow ? 22 : 44, bubbles: 0.35 });
  ambient.start();
  const glowLevel = { v: 0 };

  // Profundidade: perto = maior, mais rápido, mais nítido; longe = menor, lento, ténue
  const depth = {
    near: { from: 0.78, to: -0.9, y: 0.02, alpha: 1, start: 0.5, dur: 2.2, bob: 14, tilt: 2.4 },
    mid: { from: 0.52, to: -0.72, y: 0.26, alpha: 0.8, start: 0.2, dur: 2.5, bob: 10, tilt: 1.8 },
    far: { from: 0.22, to: -0.55, y: -0.28, alpha: 0.45, start: 0.1, dur: 2.7, bob: 6, tilt: 1.2 }
  };

  gsap.set(brand, { opacity: 1 });
  gsap.set(chars, { yPercent: 115 });
  gsap.set(words, { yPercent: 115 });
  gsap.set(line, { scaleX: 0 });
  gsap.set(skip, { autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete: finish });

  // 0.0–0.8 Imersão
  tl.fromTo(water, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "sine.out" }, 0)
    .fromTo(glow, { autoAlpha: 0, yPercent: -6 }, { autoAlpha: 1, yPercent: 0, duration: 1.2, ease: "sine.inOut" }, 0.1)
    .fromTo(shafts, { autoAlpha: 0, xPercent: -20 }, { autoAlpha: 0.85, xPercent: 20, duration: 2.6, stagger: 0.07, ease: "sine.inOut" }, 0.15)
    .to(glowLevel, { v: 1, duration: 0.9, ease: "sine.out", onUpdate: () => ambient.setIntensity(glowLevel.v) }, 0.05)
    .to(skip, { autoAlpha: 1, duration: 0.4 }, 0.5);

  // 0.8–2.0 Peixes (entram a partir de ~0.2 s e dominam a cena até aos 2 s)
  fish.forEach((f) => {
    const d = depth[f.dataset.fish];
    const img = f.querySelector("img");
    gsap.set(f, { x: innerWidth * d.from, y: innerHeight * d.y, autoAlpha: 0, rotation: -d.tilt });
    tl.to(f, { x: innerWidth * d.to, duration: d.dur, ease: "power1.inOut" }, d.start)
      .to(f, { autoAlpha: d.alpha, duration: 0.55, ease: "sine.out" }, d.start)
      .to(f, { rotation: d.tilt, duration: d.dur / 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, d.start)
      .to(img, { y: -d.bob, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 3 }, d.start)
      .to(img, { scaleY: 0.955, scaleX: 1.02, duration: 0.32, ease: "sine.inOut", yoyo: true, repeat: 7 }, d.start)
      .to(f, { autoAlpha: 0, duration: 0.5, ease: "sine.in" }, 2.0);
  });

  // 2.0–2.6 Marca
  tl.to(chars, { yPercent: 0, duration: 0.6, stagger: 0.022, ease: "power4.out" }, 2.0)
    .to(line, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 2.15)
    .to(words, { yPercent: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" }, 2.22)

  // 2.6–3.0 Transição: a janela encolhe para o cartão do hero e desvanece
    .add(expand, 2.6)
    .to([brand, skip], { autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 2.6)
    .fromTo(loader, { clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: () => heroClip(), duration: 0.4, ease: "power3.inOut", immediateRender: false }, 2.6)
    .to(glowLevel, { v: 0, duration: 0.3, onUpdate: () => ambient.setIntensity(glowLevel.v) }, 2.6)
    .to(loader, { opacity: 0, duration: 0.22, ease: "power1.in" }, 2.78);

  // Saltar (botão ou Esc): acelera em vez de cortar, para não haver flash
  const doSkip = () => { if (!done) { tl.timeScale(6); skip.blur(); } };
  skip.addEventListener("click", doSkip);
  const onKey = (e) => { if (e.key === "Escape") doSkip(); if (done) document.removeEventListener("keydown", onKey); };
  document.addEventListener("keydown", onKey);

  // Failsafe: nunca prender o utilizador
  setTimeout(() => { if (!done) { expand(); finish(); } }, 6000);
}
