/* ==========================================================================
   LOROSAE BETTA® — cart.js
   Carrinho (localStorage), gaveta, página de carrinho e checkout DE DEMONSTRAÇÃO.

   Pontos de integração futuros (ver README):
     · submitOrder()        -> enviar para um back-end / gestor de encomendas
     · CONFIG.orderEndpoint -> URL de API de encomendas
     · pagamento            -> NÃO existe. Integrar um fornecedor real (ex.: Stripe, SumUp, MB WAY via PSP)
     · stock                -> validar stock no servidor antes de confirmar
   ========================================================================== */
import { CONFIG, t, url, esc, formatPrice, imgHtml, hydrateImages, ARROW_SVG, $, $$, toast, trapFocus } from "./utils.js";
import { loadCatalogue, getProduct, getCategory, isBuyable, productUrl, shopUrl } from "./products.js";
import { animateDrawer, animateLineOut, addFeedback, bumpCartCount } from "./animations.js";

const KEY = "lorosae.cart.v1";
let items = [];
const listeners = new Set();

/* ---------- Estado ---------- */
function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!Array.isArray(raw)) return [];
    return raw.filter((i) => i && typeof i.id === "string" && Number.isInteger(i.qty) && i.qty > 0).map((i) => ({ id: i.id, qty: i.qty }));
  } catch { return []; }
}
function write() {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* armazenamento indisponível: o carrinho funciona só em memória */ }
}

export function snapshot() {
  const lines = items.map((i) => {
    const product = getProduct(i.id);
    return { id: i.id, qty: i.qty, product, available: isBuyable(product) };
  });
  const live = lines.filter((l) => l.available);
  return {
    lines,
    count: live.reduce((n, l) => n + l.qty, 0),
    subtotal: live.reduce((s, l) => s + l.qty * l.product.price, 0),
    hasUnavailable: lines.some((l) => !l.available)
  };
}

function commit() {
  write();
  const snap = snapshot();
  listeners.forEach((fn) => fn(snap));
}

export const cart = {
  subscribe(fn) { listeners.add(fn); fn(snapshot()); return () => listeners.delete(fn); },
  add(id, qty = 1) {
    const p = getProduct(id);
    if (!p || !isBuyable(p)) { toast(t("cart.notAvailable", { name: p?.name || "Este peixe" }), { type: "error" }); return { ok: false }; }
    const line = items.find((i) => i.id === id);
    const current = line ? line.qty : 0;
    if (current + qty > p.stock) {
      toast(t("cart.stockLimit", { n: p.stock, name: p.name }), { type: "error" });
      return { ok: false, reason: "stock" };
    }
    if (line) line.qty += qty; else items.push({ id, qty });
    commit();
    return { ok: true, product: p };
  },
  setQty(id, qty) {
    const p = getProduct(id);
    const line = items.find((i) => i.id === id);
    if (!line) return;
    if (qty <= 0) return this.remove(id);
    if (p && qty > p.stock) { toast(t("cart.stockLimit", { n: p.stock, name: p.name }), { type: "error" }); return; }
    line.qty = qty;
    commit();
  },
  remove(id) {
    const p = getProduct(id);
    items = items.filter((i) => i.id !== id);
    commit();
    if (p) toast(t("cart.removed", { name: p.name }));
  },
  clear({ silent = false } = {}) {
    items = [];
    commit();
    if (!silent) toast(t("cart.cleared"));
  }
};

/* ---------- HTML ---------- */
function lineHtml(l, { page = false } = {}) {
  const p = l.product;
  if (!p) {
    return `<div class="cart-line" data-line="${esc(l.id)}"><div class="cart-line__img"></div><div class="cart-line__info"><h3 class="cart-line__name">Artigo removido</h3><p class="cart-line__meta">${t("cart.unavailable")}</p><button type="button" class="cart-line__remove" data-remove="${esc(l.id)}">${t("cart.remove")}</button></div></div>`;
  }
  const cat = getCategory(p.category);
  const qtyControl = !l.available
    ? `<span class="cart-line__single">${t("cart.unavailable")}</span>`
    : p.stock > 1
      ? `<div class="qty" role="group" aria-label="Quantidade de ${esc(p.name)}">
          <button type="button" data-qty-step="-1" data-id="${esc(p.id)}" aria-label="${t("cart.qtyDown", { name: p.name })}">−</button>
          <output aria-live="polite">${l.qty}</output>
          <button type="button" data-qty-step="1" data-id="${esc(p.id)}" aria-label="${t("cart.qtyUp", { name: p.name })}" ${l.qty >= p.stock ? `disabled title="${t("cart.max", { n: p.stock })}"` : ""}>+</button>
        </div>`
      : `<span class="cart-line__single">${t("cart.single")}</span>`;
  return `<div class="cart-line${l.available ? "" : " is-unavailable"}" data-line="${esc(p.id)}">
  <a class="cart-line__img" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">${imgHtml({ path: p.images.primary, alt: "", kind: "product", tint: p.tint, width: 200, height: 250 })}</a>
  <div class="cart-line__info">
    <h3 class="cart-line__name"><a href="${productUrl(p)}">${esc(p.name)}</a></h3>
    <p class="cart-line__meta">${esc(cat?.name || p.tail)} · ${esc(p.colors.join(" · "))}</p>
    <div class="cart-line__row">
      ${qtyControl}
      <span class="cart-line__price">${l.available ? formatPrice(p.price * l.qty) : "—"}</span>
    </div>
    <button type="button" class="cart-line__remove" data-remove="${esc(p.id)}" aria-label="${t("cart.remove")} ${esc(p.name)}">${t("cart.remove")}</button>
  </div>
</div>`;
}

const emptyHtml = () => `<div class="empty-state" style="border:0;padding:3rem 0">
  <h3>${t("cart.empty.title")}</h3>
  <p>${t("cart.empty.text")}</p>
  <a class="btn btn--primary" href="${shopUrl()}"><span>${t("cart.empty.cta")}</span></a>
</div>`;

const summaryHtml = (snap) => `<div class="cart-summary">
  <div class="cart-summary__row"><span>${t("cart.subtotal")}</span><span>${formatPrice(snap.subtotal)}</span></div>
  <div class="cart-summary__row"><span>${t("cart.shipping")}</span><span>${t("cart.shipping.value")}</span></div>
  <div class="cart-summary__row cart-summary__row--total"><span>${t("cart.total")}</span><strong>${formatPrice(snap.subtotal)}</strong></div>
</div>
${snap.hasUnavailable ? `<p class="cart-note" role="alert">Há artigos que já não estão disponíveis. Remova-os para continuar.</p>` : ""}
<p class="cart-note">${t("cart.note")}</p>`;

/** Re-renderiza um contentor preservando o foco no controlo que o utilizador estava a usar. */
function renderPreservingFocus(container, html) {
  const a = document.activeElement;
  const inside = a && container.contains(a);
  const key = inside ? { step: a.dataset.qtyStep, id: a.dataset.id, rm: a.dataset.remove } : null;
  container.innerHTML = html;
  hydrateImages(container);
  if (key) {
    const sel = key.step ? `[data-qty-step="${key.step}"][data-id="${CSS.escape(key.id)}"]` : key.rm ? `[data-remove="${CSS.escape(key.rm)}"]` : null;
    const target = sel && container.querySelector(sel);
    (target && !target.disabled ? target : container.querySelector("[data-qty-step]:not([disabled]), [data-remove]"))?.focus();
  }
}

/* ---------- Gaveta ---------- */
let drawer, overlay, lastToggle, releaseTrap;
let isOpen = false;

function buildDrawer() {
  overlay = document.createElement("div");
  overlay.className = "cart-overlay";
  overlay.setAttribute("data-cart-overlay", "");
  drawer = document.createElement("aside");
  drawer.className = "cart-drawer";
  drawer.id = "cart-drawer";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  drawer.setAttribute("aria-labelledby", "cart-title");
  drawer.tabIndex = -1;
  drawer.innerHTML = `
    <div class="cart-drawer__head">
      <h2 id="cart-title">${t("cart.title")}</h2>
      <button type="button" class="btn-icon" data-cart-close aria-label="${t("cart.close")}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M2 2l12 12M14 2 2 14"/></svg></button>
    </div>
    <div class="cart-drawer__body" data-drawer-lines data-lenis-prevent></div>
    <div class="cart-drawer__foot" data-drawer-foot></div>`;
  document.body.append(overlay, drawer);
  overlay.addEventListener("click", closeCart);
  drawer.querySelector("[data-cart-close]").addEventListener("click", closeCart);
  drawer.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
}

export function openCart() {
  if (isOpen) return;
  isOpen = true;
  lastToggle = document.activeElement;
  document.body.classList.add("is-locked");
  $$("[data-cart-toggle]").forEach((b) => b.setAttribute("aria-expanded", "true"));
  animateDrawer(true, drawer, overlay);
  releaseTrap = trapFocus(drawer);
  requestAnimationFrame(() => drawer.focus());
}
export function closeCart() {
  if (!isOpen) return;
  isOpen = false;
  document.body.classList.remove("is-locked");
  $$("[data-cart-toggle]").forEach((b) => b.setAttribute("aria-expanded", "false"));
  animateDrawer(false, drawer, overlay);
  releaseTrap?.();
  lastToggle?.focus?.();
}

function renderDrawer(snap) {
  if (!drawer) return;
  const linesEl = drawer.querySelector("[data-drawer-lines]");
  const footEl = drawer.querySelector("[data-drawer-foot]");
  if (!snap.lines.length) {
    linesEl.innerHTML = emptyHtml();
    footEl.hidden = true;
    return;
  }
  footEl.hidden = false;
  renderPreservingFocus(linesEl, snap.lines.map((l) => lineHtml(l)).join(""));
  footEl.innerHTML = `${summaryHtml(snap)}
    <a class="btn btn--primary btn--block" href="${url("pages/cart.html")}"><span>${t("cart.checkout")}</span><span class="btn__arrow">${ARROW_SVG}</span></a>
    <button type="button" class="text-button" data-clear-cart style="justify-self:center">${t("cart.clear")}</button>`;
}

/* ---------- Contador no cabeçalho ---------- */
let lastCount = null;
function renderCount(snap) {
  $$("[data-cart-count]").forEach((el) => { el.textContent = String(snap.count); });
  $$("[data-cart-toggle]").forEach((btn) => {
    btn.classList.toggle("has-items", snap.count > 0);
    btn.setAttribute("aria-label", `${t("cart.open")} (${t("cart.items", { n: snap.count })})`);
  });
  if (lastCount !== null && snap.count !== lastCount && snap.count > lastCount) bumpCartCount();
  lastCount = snap.count;
}

/* ---------- Página do carrinho ---------- */
function renderCartPage(snap) {
  const page = $("[data-cart-page]");
  if (!page) return;
  const empty = $("[data-cart-empty]", page);
  const full = $("[data-cart-full]", page);
  if (!snap.lines.length && !page.dataset.orderDone) {
    empty.innerHTML = emptyHtml();
    empty.hidden = false; full.hidden = true;
    return;
  }
  empty.hidden = true; full.hidden = false;
  renderPreservingFocus($("[data-cart-lines]", page), snap.lines.map((l) => lineHtml(l, { page: true })).join(""));
  $("[data-cart-summary]", page).innerHTML = summaryHtml(snap);
  const submit = $("[data-checkout-submit]", page);
  if (submit) submit.disabled = snap.count === 0 || snap.hasUnavailable;
}

/* ---------- Encomenda ----------
   Três modos, por ordem de preferência (nunca há pagamento no site):
     "endpoint" CONFIG.orderEndpoint  -> POST ao sistema de encomendas da loja
     "email"    CONFIG.contact.email  -> pedido de reserva preparado no email do cliente
     "demo"     nada configurado      -> demonstração, claramente identificada */
export const orderMode = () => (CONFIG.orderEndpoint ? "endpoint" : CONFIG.contact.email ? "email" : "demo");

function buildMailto(order) {
  const lines = order.items.map((i) => `- ${i.name} (${i.reference}) x ${i.qty} = ${formatPrice(i.lineTotal)}`);
  const body = `Olá! Gostaria de reservar:\n${lines.join("\n")}\n\nTotal estimado: ${formatPrice(order.subtotal)} (envio a confirmar)\n\nNome: ${order.customer.name}\nEmail: ${order.customer.email}\nTelemóvel: ${order.customer.phone || "-"}\nLocalidade/país: ${order.customer.location}\nNotas: ${order.customer.notes || "-"}\n\nRef.: ${order.reference}`;
  return `mailto:${CONFIG.contact.email}?subject=${encodeURIComponent(`Pedido de reserva ${order.reference}`)}&body=${encodeURIComponent(body)}`;
}

export async function submitOrder(order) {
  const mode = orderMode();
  if (mode === "endpoint") {
    const res = await fetch(CONFIG.orderEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...order, demo: false }) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json().catch(() => ({}));
    return { ok: true, mode, reference: order.reference, ...data };
  }
  if (mode === "email") {
    const href = buildMailto(order);
    window.location.href = href;
    return { ok: true, mode, reference: order.reference, href };
  }
  return { ok: true, mode, reference: order.reference };
}

function buildWhatsAppUrl(order) {
  if (!CONFIG.whatsappNumber) return null;
  const lines = order.items.map((i) => `• ${i.name} (${i.reference}) × ${i.qty} — ${formatPrice(i.lineTotal)}`);
  const msg = `Olá! Gostaria de reservar:\n${lines.join("\n")}\nTotal estimado: ${formatPrice(order.subtotal)}\nNome: ${order.customer.name}\nLocalidade: ${order.customer.location}\nRef.: ${order.reference}`;
  return `https://wa.me/${CONFIG.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
}

function initCheckout() {
  const page = $("[data-cart-page]");
  const form = $("[data-checkout-form]");
  if (!page || !form) return;
  const result = $("[data-order-result]", page);
  const mode = orderMode();
  const submitLabel = { demo: "Criar pedido de demonstração", email: "Preparar pedido por email", endpoint: "Enviar pedido de reserva" }[mode];
  const note = $("[data-checkout-note]", form);
  if (note && mode !== "demo") {
    note.innerHTML = mode === "email"
      ? "<strong>Pedido de reserva por email.</strong> Ao confirmar, abre-se o seu programa de email com o pedido dirigido à loja; só é enviado quando o enviar. A loja confirma disponibilidade, envio e pagamento. Não há pagamento neste site."
      : "<strong>Pedido de reserva.</strong> O pedido é enviado à loja, que confirma disponibilidade, envio e pagamento. Não há pagamento neste site.";
  }
  $(".btn__label", form.querySelector("[data-checkout-submit]")).textContent = submitLabel;
  const fields = {
    name: form.elements.name, email: form.elements.email, location: form.elements.location, consent: form.elements.consent
  };
  const setError = (field, message) => {
    const err = form.querySelector(`#err-${field.name}`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (err) err.textContent = message || "";
  };
  Object.values(fields).forEach((f) => f?.addEventListener("input", () => setError(f, "")));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let firstBad = null;
    const bad = (f, msg) => { setError(f, msg); firstBad ||= f; };
    if (!fields.name.value.trim()) bad(fields.name, t("checkout.required")); else setError(fields.name, "");
    const email = fields.email.value.trim();
    if (!email) bad(fields.email, t("checkout.required")); else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) bad(fields.email, t("checkout.email")); else setError(fields.email, "");
    if (!fields.location.value.trim()) bad(fields.location, t("checkout.required")); else setError(fields.location, "");
    if (!fields.consent.checked) bad(fields.consent, t("checkout.consent")); else setError(fields.consent, "");
    if (firstBad) { firstBad.focus(); toast("Verifique os campos assinalados.", { type: "error" }); return; }

    const snap = snapshot();
    if (!snap.count) return;
    const live = snap.lines.filter((l) => l.available);
    const order = {
      reference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
      demo: true,
      createdAt: new Date().toISOString(),
      currency: CONFIG.currency,
      customer: { name: fields.name.value.trim(), email, phone: form.elements.phone.value.trim(), location: fields.location.value.trim(), notes: form.elements.notes.value.trim() },
      items: live.map((l) => ({ productId: l.id, reference: l.product.id, name: l.product.name, qty: l.qty, unitPrice: l.product.price, lineTotal: l.product.price * l.qty })),
      subtotal: snap.subtotal,
      shipping: null,
      payment: null
    };
    const btn = $("[data-checkout-submit]", form);
    btn.disabled = true;
    btn.querySelector(".btn__label").textContent = "A criar pedido…";
    try {
      const res = await submitOrder(order);
      page.dataset.orderDone = "1";
      const wa = buildWhatsAppUrl(order);
      result.hidden = false;
      result.innerHTML = `<h2>${t("checkout.done")}</h2>
        <p class="lead muted">Referência <strong style="color:var(--soft-white)">${esc(res.reference)}</strong></p>
        <p class="demo-note" role="note">${{
          demo: "DEMONSTRAÇÃO: não foi processado nenhum pagamento, não foi enviado nenhum pedido a ninguém e não foi reservado qualquer peixe. Abaixo vê os dados que seriam enviados.",
          email: "Abrimos o seu programa de email com o pedido de reserva dirigido à loja. O pedido só é enviado quando o enviar a partir daí. Nenhum pagamento é feito neste site.",
          endpoint: "Pedido enviado à loja. A disponibilidade, o envio e o pagamento serão confirmados consigo. Nenhum pagamento foi feito neste site."
        }[res.mode]}</p>
        ${res.mode === "email" ? `<a class="btn btn--ghost" href="${esc(res.href)}"><span>Abrir o email novamente</span></a>` : ""}
        <pre tabindex="0" aria-label="Dados do pedido">${esc(JSON.stringify(order, null, 2))}</pre>
        ${wa ? `<a class="btn btn--accent" href="${wa}" target="_blank" rel="noopener"><span>Enviar por WhatsApp</span></a>` : `<p class="small muted">WhatsApp: número por configurar pela loja (<code>CONFIG.whatsappNumber</code> em <code>js/utils.js</code>).</p>`}
        <div style="display:flex;gap:1rem;flex-wrap:wrap"><button type="button" class="btn btn--ghost" data-order-back>Voltar ao carrinho</button><button type="button" class="btn btn--primary" data-order-finish>${t("cart.clear")}</button></div>`;
      form.hidden = true;
      result.scrollIntoView({ behavior: "smooth", block: "start" });
      result.focus?.();
      $("[data-order-back]", result).addEventListener("click", () => { delete page.dataset.orderDone; result.hidden = true; form.hidden = false; btn.disabled = false; btn.querySelector(".btn__label").textContent = submitLabel; renderCartPage(snapshot()); });
      $("[data-order-finish]", result).addEventListener("click", () => { delete page.dataset.orderDone; cart.clear(); result.hidden = true; form.hidden = false; form.reset(); btn.querySelector(".btn__label").textContent = submitLabel; });
    } catch (err) {
      console.error(err);
      toast(t("checkout.sendError"), { type: "error" });
      btn.disabled = false;
      btn.querySelector(".btn__label").textContent = submitLabel;
    }
  });
}

/* ---------- Inicialização ---------- */
export async function initCart() {
  buildDrawer();
  items = read();
  try { await loadCatalogue(); } catch (e) { console.error("Catálogo indisponível", e); }

  cart.subscribe(renderCount);
  cart.subscribe(renderDrawer);
  cart.subscribe(renderCartPage);

  // Sincroniza entre separadores
  window.addEventListener("storage", (e) => { if (e.key === KEY) { items = read(); commit(); } });

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("[data-cart-toggle]");
    if (toggle) { e.preventDefault(); openCart(); return; }

    const add = e.target.closest("[data-add]");
    if (add) {
      const res = cart.add(add.dataset.add);
      if (res.ok) {
        addFeedback(add);
        toast(t("cart.added", { name: res.product.name }), { type: "success", action: { label: t("cart.view"), onClick: openCart } });
      }
      return;
    }

    const step = e.target.closest("[data-qty-step]");
    if (step) {
      const line = items.find((i) => i.id === step.dataset.id);
      if (line) cart.setQty(step.dataset.id, line.qty + Number(step.dataset.qtyStep));
      return;
    }

    const rm = e.target.closest("[data-remove]");
    if (rm) {
      const lineEl = rm.closest(".cart-line");
      animateLineOut(lineEl, () => cart.remove(rm.dataset.remove));
      return;
    }

    if (e.target.closest("[data-clear-cart]")) { cart.clear(); return; }
  });

  initCheckout();
}
