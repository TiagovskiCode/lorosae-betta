/* ==========================================================================
   LOROSAE BETTA® — contact.js
   Formulário de contacto com validação e estados honestos.

   O site é estático: não existe servidor próprio. Por isso:
     · Com CONFIG.contactEndpoint (ex.: Formspree, Getform, Netlify Forms, API própria)
       a mensagem é enviada por POST e só se mostra sucesso se o servidor responder OK.
     · Sem endpoint, mas com CONFIG.contact.email, abre-se o cliente de email do
       utilizador com a mensagem preparada (NÃO é "enviado": é dito claramente).
     · Sem nenhuma das duas, o formulário explica que o envio não está configurado.
   Nunca é mostrada uma mensagem de sucesso sem envio efetivo.
   ========================================================================== */
import { CONFIG, esc, $ } from "./utils.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Lista só os meios de contacto realmente configurados. */
function renderMethods(box) {
  const c = CONFIG.contact;
  const rows = [];
  if (c.email) rows.push(["Email", `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`]);
  if (c.phone) rows.push(["Telefone", `<a href="tel:${esc(c.phone.replace(/\s/g, ""))}">${esc(c.phone)}</a>`]);
  if (CONFIG.whatsappNumber) rows.push(["WhatsApp", `<a href="https://wa.me/${esc(CONFIG.whatsappNumber.replace(/\D/g, ""))}" target="_blank" rel="noopener">Enviar mensagem</a>`]);
  if (CONFIG.instagramUrl) rows.push(["Instagram", `<a href="${esc(CONFIG.instagramUrl)}" target="_blank" rel="noopener">Seguir</a>`]);
  if (c.address) rows.push(["Morada", esc(c.address)]);
  box.innerHTML = rows.length
    ? `<dl class="contact__list">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>`
    : `<div class="placeholder-box"><h3 class="placeholder-box__title">Contactos por definir</h3><p>A loja ainda não indicou email, telefone ou redes sociais. Preencher <code>CONFIG.contact</code>, <code>CONFIG.whatsappNumber</code> e <code>CONFIG.instagramUrl</code> em <code>js/utils.js</code>.</p></div>`;
}

export function initContact() {
  const form = $("[data-contact-form]");
  if (!form) return;
  renderMethods($("[data-contact-methods]"));

  const status = $("[data-form-status]", form);
  const submit = $("button[type=submit]", form);
  const label = $(".btn__label", submit);
  const fields = ["name", "email", "message", "consent"].map((n) => form.elements[n]);
  const err = (f) => form.querySelector(`#err-contact-${f.name}`);
  const setErr = (f, msg) => { f.setAttribute("aria-invalid", msg ? "true" : "false"); err(f).textContent = msg || ""; };
  const setStatus = (kind, msg) => { status.className = `form-status form-status--${kind}`; status.textContent = msg; status.hidden = !msg; };
  fields.forEach((f) => f.addEventListener("input", () => setErr(f, "")));

  const validate = () => {
    let first = null;
    const bad = (f, m) => { setErr(f, m); first ||= f; };
    const [name, email, message, consent] = fields;
    name.value.trim() ? setErr(name, "") : bad(name, "Indique o seu nome.");
    if (!email.value.trim()) bad(email, "Indique o seu email."); else if (!EMAIL_RE.test(email.value.trim())) bad(email, "O email não parece válido."); else setErr(email, "");
    message.value.trim().length >= 10 ? setErr(message, "") : bad(message, "Escreva pelo menos 10 caracteres.");
    consent.checked ? setErr(consent, "") : bad(consent, "É necessário aceitar o tratamento dos dados para responder ao seu pedido.");
    first?.focus();
    return !first;
  };

  const setBusy = (busy, text) => { submit.disabled = busy; label.textContent = busy ? "A enviar…" : text || "Enviar mensagem"; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("", "");
    if (form.elements.website.value) return; // honeypot: bots preenchem este campo
    if (!validate()) { setStatus("error", "Verifique os campos assinalados."); return; }

    const data = { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), message: form.elements.message.value.trim(), page: location.href };

    if (CONFIG.contactEndpoint) {
      setBusy(true);
      try {
        const res = await fetch(CONFIG.contactEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("ok", "Mensagem enviada. Obrigado — responderemos assim que possível.");
        form.reset();
      } catch (error) {
        console.error(error);
        setStatus("error", "Não foi possível enviar a mensagem. A sua mensagem não foi enviada; tente novamente mais tarde" + (CONFIG.contact.email ? ` ou escreva para ${CONFIG.contact.email}.` : "."));
      } finally { setBusy(false); }
      return;
    }

    if (CONFIG.contact.email) {
      const body = `${data.message}\n\n— ${data.name} (${data.email})`;
      window.location.href = `mailto:${CONFIG.contact.email}?subject=${encodeURIComponent("Contacto através do site")}&body=${encodeURIComponent(body)}`;
      setStatus("info", "Abrimos o seu programa de email com a mensagem preparada. A mensagem só é enviada quando a enviar a partir daí.");
      return;
    }

    setStatus("error", "O envio ainda não está configurado: a loja não definiu um email nem um serviço de receção. A sua mensagem NÃO foi enviada.");
  });
}
