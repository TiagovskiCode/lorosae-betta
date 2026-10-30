/* ==========================================================================
   LOROSAE BETTA® — ambient.js
   Partículas subaquáticas (bolhas e plâncton) num <canvas>, partilhadas pelo
   loader e pelo hero. Custo controlado:
     · DPR limitado a 1.5 · poucas partículas · pausa quando fora do ecrã
     · usa o ticker do GSAP (sincronizado com o resto das animações)
     · destroy() remove ticker, observers e listeners
   ========================================================================== */
import { hasGsap } from "./utils.js";

const rand = (a, b) => a + Math.random() * (b - a);

export function createAmbient(canvas, { count = 36, bubbles = 0.35, tint = "112,225,209", speed = 1 } = {}) {
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1, running = false, visible = true, intensity = 0;
  let parts = [];

  const make = (initial) => {
    const bubble = Math.random() < bubbles;
    return {
      bubble,
      x: rand(0, w),
      y: initial ? rand(0, h) : h + rand(10, 80),
      r: bubble ? rand(1.8, 6) : rand(0.5, 1.5),
      vy: (bubble ? rand(14, 34) : rand(3, 12)) * speed,
      sway: rand(6, 26),
      phase: rand(0, Math.PI * 2),
      freq: rand(0.4, 1.1),
      a: bubble ? rand(0.18, 0.4) : rand(0.2, 0.6)
    };
  };

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: count }, () => make(true));
  };

  let last = 0;
  const tick = (time) => {
    if (!visible || intensity <= 0.001) return;
    const t = time;
    const dt = last ? Math.min(0.05, t - last) : 0.016;
    last = t;
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.vy * dt;
      p.phase += p.freq * dt;
      const x = p.x + Math.sin(p.phase) * p.sway;
      if (p.y < -20) Object.assign(p, make(false));
      // desvanece junto ao topo e à base
      const edge = Math.min(1, Math.max(0, p.y / (h * 0.15)), Math.max(0, (h - p.y) / (h * 0.1)));
      const alpha = p.a * intensity * edge;
      if (alpha <= 0.005) continue;
      if (p.bubble) {
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${tint},${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x - p.r * 0.3, p.y - p.r * 0.3, Math.max(0.4, p.r * 0.22), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tint},${alpha})`;
        ctx.fill();
      }
    }
  };

  const ticker = (time) => tick(time);
  let ro, io;

  return {
    start() {
      if (running) return;
      running = true;
      resize();
      if ("ResizeObserver" in window) { ro = new ResizeObserver(() => resize()); ro.observe(canvas); }
      if ("IntersectionObserver" in window) { io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!visible) ctx.clearRect(0, 0, w, h); }); io.observe(canvas); }
      if (hasGsap()) window.gsap.ticker.add(ticker); else { const loop = (t) => { if (!running) return; tick(t / 1000); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
    },
    /** 0 = invisível, 1 = plena intensidade */
    setIntensity(v) { intensity = v; },
    get intensity() { return intensity; },
    stop() { running = false; if (hasGsap()) window.gsap.ticker.remove(ticker); },
    destroy() {
      this.stop();
      ro?.disconnect(); io?.disconnect();
      ctx.clearRect(0, 0, w, h);
    }
  };
}
