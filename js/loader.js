/* ==========================================================================
   AQUORA — loader.js
   Cortina de entrada da marca (≈1,8 s), uma só timeline GSAP.

   0.0–0.9 s  Wordmark      as letras de AQUORA sobem uma a uma
   0.6–1.1 s  Assinatura    linha dourada e frase
   1.3–2.0 s  Revelação     a cortina sobe e o hero entra por baixo

   Regras: só na home, uma vez por sessão (script inline no <head> decide);
   não espera por imagens; "Saltar" e tecla Esc; failsafe aos 4 s.
   Com prefers-reduced-motion: só opacidade (~0,8 s).
   ========================================================================== */
import { $, hasGsap, prefersReducedMotion } from "./utils.js";

const FLAG = "aq.intro.v1";
const markSeen = () => { try { sessionStorage.setItem(FLAG, "1"); } catch { /* sem armazenamento: pode repetir, sem problema */ } };

function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  return Array.from(text).map((ch) => {
    const outer = document.createElement("span");
    outer.className = "sw";
    const inner = document.createElement("span");
    inner.className = "sw__i";
    inner.textContent = ch;
    outer.appendChild(inner);
    el.appendChild(outer);
    return inner;
  });
}

/** @param {{ onExpand: () => void }} opts  onExpand: o hero começa a entrar */
export function runLoader({ onExpand }) {
  const root = document.documentElement;
  const loader = $("[data-loader]");
  let expanded = false, done = false;
  const expand = () => { if (!expanded) { expanded = true; onExpand?.(); } };
  const finish = () => {
    if (done) return;
    done = true;
    loader?.remove();
    root.classList.remove("has-loader");
    window.__aqLoaderDone = true;
    markSeen();
  };

  if (!loader) { root.classList.remove("has-loader"); expand(); return; }
  if (!hasGsap()) { finish(); expand(); return; }
  const gsap = window.gsap;
  const inner = $(".loader__inner", loader);
  const skip = $(".loader__skip", loader);

  // ----- Movimento reduzido: só opacidade -----
  if (prefersReducedMotion()) {
    gsap.timeline({ onComplete: finish })
      .fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "none" })
      .add(expand, "+=0.2")
      .to(loader, { opacity: 0, duration: 0.3, ease: "none" });
    setTimeout(() => { expand(); finish(); }, 3000);
    return;
  }

  const chars = splitChars($(".loader__word", loader));
  const line = $(".loader__line", loader);
  const tag = $(".loader__tag", loader);

  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
  tl.fromTo(chars, { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "power4.out" }, 0.1)
    .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, 0.6)
    .fromTo(tag, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.75)
    .to(inner, { autoAlpha: 0, y: -16, duration: 0.45, ease: "power2.in" }, 1.3)
    .add(expand, 1.45)
    .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power4.inOut" }, 1.45);

  // Saltar (botão ou Esc): acelera em vez de cortar, para não haver flash
  const doSkip = () => { if (!done) { tl.timeScale(5); skip?.blur(); } };
  skip?.addEventListener("click", doSkip);
  const onKey = (e) => { if (e.key === "Escape") doSkip(); if (done) document.removeEventListener("keydown", onKey); };
  document.addEventListener("keydown", onKey);

  // Failsafe: nunca prender o utilizador
  setTimeout(() => { if (!done) { expand(); finish(); } }, 4000);
}
