/* ==========================================================================
   LOROSAE BETTA® — layout.js
   Componentes partilhados por todas as páginas:
     Header (marca + Navigation + carrinho) · MobileMenu · Footer · Newsletter
   O markup é gerado aqui (fonte única) e injetado em cada página.
   ========================================================================== */
import { CONFIG, t, url, esc, $, trapFocus } from "./utils.js";
import { animateMenu } from "./animations.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------- Navigation (dados) ---------- */
export function navLinks() {
  return [
    { key: "shop", href: url("pages/shop.html"), label: t("nav.shop") },
    { key: "varieties", href: url("index.html#variedades"), label: t("nav.varieties") },
    { key: "about", href: url("pages/about.html"), label: t("nav.about") },
    { key: "care", href: url("pages/care-guide.html"), label: t("nav.care") },
    { key: "contact", href: url("index.html#contacto"), label: t("nav.contact") }
  ];
}

const brandHtml = (extra = "") => `<a class="brand" href="${url("index.html")}"${extra}>Lorosae <span>Betta</span><sup>®</sup></a>`;

/* ---------- Header + MobileMenu ---------- */
function headerHtml(links, current) {
  const item = (l, cls) => `<a class="${cls}" href="${l.href}"${current === l.key ? ' aria-current="page"' : ""}>${l.label}</a>`;
  return `
<a class="skip-link" href="#main">Saltar para o conteúdo</a>
<header class="site-header" data-header>
  ${CONFIG.demoMode ? `<div class="site-header__notice" role="note">${t("notice.demo")}</div>` : ""}
  <div class="site-header__bar">
    ${brandHtml(` aria-label="${CONFIG.brand} — início"`)}
    <nav class="nav" aria-label="Principal">${links.map((l) => item(l, "nav__link")).join("")}</nav>
    <div class="header-actions">
      <a class="btn btn--primary header-cta" href="${url("pages/shop.html")}"><span>Ver coleção</span></a>
      <button type="button" class="cart-toggle" data-cart-toggle aria-controls="cart-drawer" aria-expanded="false" aria-label="${t("cart.open")}">
        <span class="cart-toggle__label">${t("cart.label")}</span><span class="cart-toggle__count" data-cart-count>0</span>
      </button>
      <button type="button" class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="${t("nav.openMenu")}"><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu data-lenis-prevent role="dialog" aria-modal="true" aria-label="${t("nav.menu")}">
  <ul class="mobile-menu__list list-reset">
    <li class="mobile-menu__item"><a class="mobile-menu__link" href="${url("index.html")}">Início</a></li>
    ${links.map((l) => `<li class="mobile-menu__item">${item(l, "mobile-menu__link")}</li>`).join("")}
    <li class="mobile-menu__item"><a class="mobile-menu__link" href="${url("pages/cart.html")}"><em>${t("cart.label")}</em></a></li>
  </ul>
  <p class="mobile-menu__foot">Os nossos peixes são animais vivos, apresentados um a um.</p>
</div>`;
}

/* ---------- Footer ---------- */
function footerHtml() {
  const c = CONFIG.contact;
  const contacts = [
    c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : `<span class="placeholder">Email — por configurar</span>`,
    c.phone ? `<a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a>` : "",
    CONFIG.instagramUrl ? `<a href="${esc(CONFIG.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>` : `<span class="placeholder">Instagram — por configurar</span>`
  ].filter(Boolean);
  // A newsletter só existe quando há um serviço real que receba as inscrições
  const newsletter = CONFIG.newsletterEndpoint ? `
      <form class="newsletter" data-newsletter novalidate>
        <label class="small muted" for="nl-email">Receber novidades da coleção</label>
        <div class="newsletter__row">
          <input class="input" id="nl-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="o.seu@email.pt" aria-describedby="nl-msg">
          <button class="btn btn--primary" type="submit"><span class="btn__label">Subscrever</span></button>
        </div>
        <p class="newsletter__msg" id="nl-msg" role="status" aria-live="polite"></p>
      </form>` : "";
  return `
<div class="container">
  <div class="footer__top">
    <div class="footer__brand">
      ${brandHtml()}
      <p>Loja de Betta apresentados um a um. Cada peixe é um animal vivo e merece um lar preparado para o receber.</p>
      ${newsletter}
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Loja</h2>
      <ul>
        <li><a href="${url("pages/shop.html")}">Coleção</a></li>
        <li><a href="${url("index.html#variedades")}">Variedades</a></li>
        <li><a href="${url("index.html#galeria")}">Galeria</a></li>
        <li><a href="${url("pages/cart.html")}">Carrinho</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Marca e contacto</h2>
      <ul>
        <li><a href="${url("pages/about.html")}">Sobre a marca</a></li>
        <li><a href="${url("pages/care-guide.html")}">Guia de cuidados</a></li>
        <li><a href="${url("index.html#contacto")}">Formulário de contacto</a></li>
        ${contacts.map((x) => `<li>${x}</li>`).join("")}
      </ul>
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Informação legal</h2>
      <ul>
        <li><a href="${url("pages/care-guide.html#envios")}">Envios e entregas</a></li>
        <li><a href="${url("pages/care-guide.html#chegada-em-vida")}">Chegada em vida e reembolsos</a></li>
        <li><a href="${url("pages/care-guide.html#termos")}">Termos e condições</a></li>
        <li><a href="${url("pages/care-guide.html#privacidade")}">Privacidade</a></li>
      </ul>
    </div>
  </div>
  <div class="footer__bottom">
    <span>© ${new Date().getFullYear()} ${CONFIG.brand} — Todos os direitos reservados.</span>
    <span>${CONFIG.demoMode ? "Site de demonstração: produtos, preços e políticas são exemplos." : ""}</span>
  </div>
</div>`;
}

export function injectLayout(current) {
  const tmp = document.createElement("div");
  tmp.innerHTML = headerHtml(navLinks(), current);
  document.body.prepend(...tmp.childNodes);
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = footerHtml();
  document.body.append(footer);
}

/* ---------- Header: estado de scroll ---------- */
export function initHeaderState() {
  const header = $("[data-header]");
  let ticking = false;
  const update = () => { header.classList.toggle("is-scrolled", window.scrollY > 24); ticking = false; };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

/* ---------- MobileMenu ---------- */
export function initMenu() {
  const toggle = $("[data-menu-toggle]");
  const menu = $("[data-mobile-menu]");
  let open = false, release = null;

  const set = async (next) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? t("nav.closeMenu") : t("nav.openMenu"));
    document.body.classList.toggle("is-locked", open);
    if (open) {
      await animateMenu(true, menu);
      release = trapFocus(menu);
      menu.querySelector("a")?.focus({ preventScroll: true });
    } else {
      release?.();
      await animateMenu(false, menu);
      toggle.focus({ preventScroll: true });
    }
  };
  toggle.addEventListener("click", () => set(!open));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) set(false); });
  window.matchMedia("(min-width: 1101px)").addEventListener("change", (e) => { if (e.matches && open) set(false); });
}

/* ---------- Newsletter (só com CONFIG.newsletterEndpoint; sucesso só com resposta OK) ---------- */
export function initNewsletter() {
  const form = $("[data-newsletter]");
  if (!form) return;
  const msg = $(".newsletter__msg", form);
  const input = $("input", form);
  const btn = $("button", form);
  const say = (kind, text) => { msg.className = `newsletter__msg ${kind ? `is-${kind}` : ""}`; msg.textContent = text; };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!EMAIL_RE.test(email)) { input.setAttribute("aria-invalid", "true"); say("error", t("newsletter.invalid")); input.focus(); return; }
    input.setAttribute("aria-invalid", "false");
    btn.disabled = true;
    say("", "A enviar…");
    try {
      const res = await fetch(CONFIG.newsletterEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      say("ok", "Inscrição registada. Obrigado.");
      input.value = "";
    } catch (err) {
      console.error(err);
      say("error", "Não foi possível registar a inscrição. Tente novamente mais tarde.");
    } finally { btn.disabled = false; }
  });
}
