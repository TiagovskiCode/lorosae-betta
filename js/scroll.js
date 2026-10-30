/* ==========================================================================
   LOROSAE BETTA® — scroll.js
   Smooth scrolling com Lenis (14 KB), sincronizado com o ticker do GSAP e com
   o ScrollTrigger.

   Porquê Lenis e não ScrollSmoother: o Lenis mantém o scroll NATIVO da página
   (posição real, position: sticky, âncoras, teclado e leitores de ecrã
   continuam a funcionar) e só suaviza a roda/trackpad. Em ecrãs táteis o
   scroll fica nativo (syncTouch: false), que é o comportamento esperado.

   · Inércia moderada (lerp 0.11): suave sem parecer "pesado".
   · Âncoras internas: deslocação suave com compensação do header flutuante.
   · Para quando há um diálogo aberto (menu, carrinho, lightbox, loader).
   · Elementos com scroll próprio usam data-lenis-prevent.
   · Não é ativado com prefers-reduced-motion.
   ========================================================================== */
import { prefersReducedMotion } from "./utils.js";

let lenis = null;

/** Distância a deixar acima de uma âncora (header flutuante). */
const anchorOffset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 100;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion() || typeof window.Lenis === "undefined" || typeof window.gsap === "undefined") return null;

  lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
  window.__lenis = lenis;

  // Um só ciclo de animação: o do GSAP
  lenis.on("scroll", () => window.ScrollTrigger?.update());
  // Sempre que o ScrollTrigger recalcula posições, o Lenis recalcula a altura da página
  window.ScrollTrigger?.addEventListener("refresh", () => lenis.resize());
  window.gsap.ticker.add((time) => lenis.raf(time * 1000));
  window.gsap.ticker.lagSmoothing(0);

  // Âncoras na mesma página
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.('a[href*="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    const link = new URL(a.href, location.href);
    const samePage = (p) => p.replace(/index\.html$/, "");
    if (link.origin !== location.origin || samePage(link.pathname) !== samePage(location.pathname) || !link.hash || link.hash === "#") return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    lenis.resize(); // a página pode ter crescido (imagens, conteúdo dinâmico) desde o último cálculo
    lenis.scrollTo(target, { offset: -anchorOffset(), duration: 1.1 });
    history.pushState(null, "", link.hash);
    // foco para quem navega por teclado/leitor de ecrã
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });

  // Parar quando há diálogos abertos ou durante o loader
  const sync = () => {
    const locked = document.body.classList.contains("is-locked") || document.documentElement.classList.contains("has-loader");
    locked ? lenis.stop() : lenis.start();
  };
  const mo = new MutationObserver(sync);
  mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  sync();

  return lenis;
}

export const getLenis = () => lenis;
