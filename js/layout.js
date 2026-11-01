/* ==========================================================================
   AQUORA — layout.js
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
    { key: "care", href: url("pages/care-guide.html"), label: t("nav.care") },
    { key: "about", href: url("pages/about.html"), label: t("nav.about") },
    { key: "contact", href: url("index.html#contacto"), label: t("nav.contact") }
  ];
}

const brandHtml = (extra = "") => `<a class="brand" href="${url("index.html")}"${extra}><span class="brand__mark">Aquora</span></a>`;

const BAG_SVG = `<svg class="cart-toggle__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M3.5 6.5h13l-1 11h-11z"/><path d="M7 6.5V5a3 3 0 0 1 6 0v1.5"/></svg>`;

/* ---------- Header + MobileMenu ---------- */
function headerHtml(links, current) {
  const item = (l, cls, i) => `<a class="${cls}" href="${l.href}"${current === l.key ? ' aria-current="page"' : ""}>${i !== undefined ? `<small>0${i + 1}</small>` : ""}${l.label}</a>`;
  return `
<a class="skip-link" href="#main">Saltar para o conteúdo</a>
<header class="site-header" data-header>
  <div class="site-header__bar">
    ${brandHtml(` aria-label="${CONFIG.brand} — início"`)}
    <nav class="nav" aria-label="Principal">${links.map((l) => item(l, "nav__link")).join("")}</nav>
    <div class="header-actions">
      <button type="button" class="cart-toggle" data-cart-toggle aria-controls="cart-drawer" aria-expanded="false" aria-label="${t("cart.open")}">
        ${BAG_SVG}<span class="cart-toggle__label">${t("cart.label")}</span><span class="cart-toggle__count" data-cart-count>0</span>
      </button>
      <button type="button" class="menu-toggle" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="${t("nav.openMenu")}"><span class="menu-toggle__icon" aria-hidden="true"></span></button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu data-lenis-prevent role="dialog" aria-modal="true" aria-label="${t("nav.menu")}">
  <ul class="mobile-menu__list list-reset">
    ${links.map((l, i) => `<li class="mobile-menu__item">${item(l, "mobile-menu__link", i)}</li>`).join("")}
  </ul>
  <div class="mobile-menu__foot">
    <p>Betta selecionados e apresentados um a um, com a informação de que precisa para os receber bem.</p>
    <a class="btn btn--primary" href="${url("pages/shop.html")}"><span>Explorar a coleção</span></a>
  </div>
</div>`;
}

/* ---------- Footer ---------- */
function footerHtml() {
  const c = CONFIG.contact;
  const contacts = [
    c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : "",
    c.phone ? `<a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a>` : "",
    CONFIG.instagramUrl ? `<a href="${esc(CONFIG.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>` : ""
  ].filter(Boolean);
  // A newsletter só existe quando há um serviço real que receba as inscrições
  const newsletter = CONFIG.newsletterEndpoint ? `
      <form class="newsletter" data-newsletter novalidate>
        <div class="field">
          <label for="nl-email">Receber novidades da coleção</label>
          <input class="input" id="nl-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="o.seu@email.pt" aria-describedby="nl-msg">
        </div>
        <button class="btn btn--small" type="submit"><span class="btn__label">Subscrever</span></button>
        <p class="newsletter__msg small muted" id="nl-msg" role="status" aria-live="polite"></p>
      </form>` : "";
  return `
<div class="container">
  <div class="footer__top">
    <div class="footer__intro">
      <p class="footer__statement">Cada Betta, <em>um indivíduo.</em></p>
      <a class="link-arrow" href="${url("pages/shop.html")}"><span>Explorar a coleção</span><span class="arrow" aria-hidden="true"><svg viewBox="0 0 24 8" fill="none" stroke="currentColor" stroke-width="1"><path d="M0 4h23M19.5 .5 23 4l-3.5 3.5"/></svg></span></a>
      ${newsletter}
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Coleção</h2>
      <ul>
        <li><a href="${url("pages/shop.html")}">Todos os exemplares</a></li>
        <li><a href="${url("index.html#variedades")}">Variedades</a></li>
        <li><a href="${url("index.html#galeria")}">Detalhes de perto</a></li>
        <li><a href="${url("pages/cart.html")}">Carrinho</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Cuidados</h2>
      <ul>
        <li><a href="${url("pages/care-guide.html#aquario")}">Preparar o aquário</a></li>
        <li><a href="${url("pages/care-guide.html#aclimatacao")}">Aclimatação</a></li>
        <li><a href="${url("pages/care-guide.html#faq")}">Perguntas frequentes</a></li>
        <li><a href="${url("pages/care-guide.html#compra")}">Envios e compra</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h2 class="footer__title">Aquora</h2>
      <ul>
        <li><a href="${url("pages/about.html")}">Sobre</a></li>
        <li><a href="${url("index.html#contacto")}">Contacto</a></li>
        <li><a href="${url("pages/care-guide.html#privacidade")}">Privacidade</a></li>
        ${contacts.map((x) => `<li>${x}</li>`).join("")}
      </ul>
    </div>
  </div>
  <p class="footer__wordmark" aria-hidden="true">Aquora</p>
  <div class="footer__bottom">
    <span>© ${new Date().getFullYear()} ${CONFIG.brand}. Todos os direitos reservados.</span>
    <span>Preços em euros. Animais vivos, enviados apenas após confirmação.</span>
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
      const opening = animateMenu(true, menu); // o menu fica visível de imediato; o foco não espera pela animação
      // o ciclo de foco inclui o botão de fecho, que fica no cabeçalho
      release = trapFocus(menu, [toggle]);
      menu.querySelector("a")?.focus({ preventScroll: true });
      await opening;
    } else {
      release?.();
      await animateMenu(false, menu);
      toggle.focus({ preventScroll: true });
    }
  };
  toggle.addEventListener("click", () => set(!open));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && open) set(false); });
  window.matchMedia("(min-width: 1100px)").addEventListener("change", (e) => { if (e.matches && open) set(false); });
}

/* ---------- Newsletter (só com CONFIG.newsletterEndpoint; sucesso só com resposta OK) ---------- */
export function initNewsletter() {
  const form = $("[data-newsletter]");
  if (!form) return;
  const msg = $(".newsletter__msg", form);
  const input = $("input", form);
  const btn = $("button", form);
  const say = (text) => { msg.textContent = text; };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!EMAIL_RE.test(email)) { input.setAttribute("aria-invalid", "true"); say(t("newsletter.invalid")); input.focus(); return; }
    input.setAttribute("aria-invalid", "false");
    btn.disabled = true;
    say("A enviar…");
    try {
      const res = await fetch(CONFIG.newsletterEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      say("Inscrição registada. Obrigado.");
      input.value = "";
    } catch (err) {
      console.error(err);
      say("Não foi possível registar a inscrição. Tente novamente mais tarde.");
    } finally { btn.disabled = false; }
  });
}
