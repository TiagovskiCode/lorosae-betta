/* ==========================================================================
   LOROSAE BETTA® — filters.js
   Página da loja: pesquisa, filtro por variedade, disponibilidade, ordenação,
   contagens, estado vazio e sincronização com o URL (?q=&variedade=&disp=&ordem=).
   ========================================================================== */
import { t, esc, normalise, hydrateImages, $ } from "./utils.js";
import { catalogue, productCardHtml, isBuyable } from "./products.js";
import { animateGridIn, releaseReveals } from "./animations.js";

const AVAIL = [
  ["all", "Todos os estados"],
  ["available", "Disponíveis"],
  ["reserved", "Reservados"],
  ["soon", "Em breve"],
  ["sold", "Vendidos"]
];
const SORT = [
  ["featured", "Destaque"],
  ["price-asc", "Preço: do mais baixo ao mais alto"],
  ["price-desc", "Preço: do mais alto ao mais baixo"],
  ["name", "Nome (A–Z)"]
];
const PARAMS = { q: "q", variety: "variedade", avail: "disp", sort: "ordem" };

export function initShop(root) {
  const { products, categories } = catalogue();
  const els = {
    form: $("[data-shop-form]", root),
    q: $("#shop-q", root),
    avail: $("#shop-avail", root),
    sort: $("#shop-sort", root),
    chips: $("[data-chips]", root),
    count: $("[data-count]", root),
    clear: $("[data-clear]", root),
    grid: $("[data-grid]", root),
    empty: $("[data-empty]", root),
    emptyClear: $("[data-empty-clear]", root)
  };

  // Opções
  els.avail.innerHTML = AVAIL.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");
  els.sort.innerHTML = SORT.map(([v, l]) => `<option value="${v}">${l}</option>`).join("");

  // Estado inicial a partir do URL
  const qs = new URLSearchParams(location.search);
  const state = {
    q: qs.get(PARAMS.q) || "",
    variety: categories.some((c) => c.id === qs.get(PARAMS.variety)) ? qs.get(PARAMS.variety) : "all",
    avail: AVAIL.some(([v]) => v === qs.get(PARAMS.avail)) ? qs.get(PARAMS.avail) : "all",
    sort: SORT.some(([v]) => v === qs.get(PARAMS.sort)) ? qs.get(PARAMS.sort) : "featured"
  };
  els.q.value = state.q;
  els.avail.value = state.avail;
  els.sort.value = state.sort;

  const order = new Map(products.map((p, i) => [p.id, i]));
  const haystack = new Map(products.map((p) => {
    const cat = categories.find((c) => c.id === p.category);
    return [p.id, normalise([p.name, p.tail, cat?.name, p.colors.join(" "), p.colorDescription, p.shortDescription].join(" "))];
  }));

  const matchesBase = (p) => {
    const q = normalise(state.q);
    if (q && !q.split(/\s+/).every((word) => haystack.get(p.id).includes(word))) return false;
    if (state.avail !== "all" && p.status !== state.avail) return false;
    return true;
  };
  const matches = (p) => matchesBase(p) && (state.variety === "all" || p.category === state.variety);

  const sortFn = {
    featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(isBuyable(b)) - Number(isBuyable(a)) || order.get(a.id) - order.get(b.id),
    "price-asc": (a, b) => a.price - b.price || order.get(a.id) - order.get(b.id),
    "price-desc": (a, b) => b.price - a.price || order.get(a.id) - order.get(b.id),
    name: (a, b) => a.name.localeCompare(b.name, "pt-PT")
  };

  const isFiltered = () => state.q.trim() !== "" || state.variety !== "all" || state.avail !== "all";

  function renderChips() {
    const base = products.filter(matchesBase);
    // Variedades sem nenhum peixe publicado não aparecem como filtro (exceto se vierem no URL)
    const withStock = categories.filter((c) => c.id === state.variety || products.some((p) => p.category === c.id));
    const all = [{ id: "all", name: t("shop.all"), n: base.length }, ...withStock.map((c) => ({ id: c.id, name: c.name, n: base.filter((p) => p.category === c.id).length }))];
    els.chips.innerHTML = all
      .map((c) => `<button type="button" class="chip" data-variety="${esc(c.id)}" aria-pressed="${state.variety === c.id}">${esc(c.name)}<small aria-hidden="true">${c.n}</small><span class="visually-hidden"> (${c.n})</span></button>`)
      .join("");
  }

  function syncUrl() {
    const next = new URLSearchParams();
    if (state.q.trim()) next.set(PARAMS.q, state.q.trim());
    if (state.variety !== "all") next.set(PARAMS.variety, state.variety);
    if (state.avail !== "all") next.set(PARAMS.avail, state.avail);
    if (state.sort !== "featured") next.set(PARAMS.sort, state.sort);
    const str = next.toString();
    history.replaceState(null, "", `${location.pathname}${str ? "?" + str : ""}`);
  }

  function render({ animate = true } = {}) {
    const list = products.filter(matches).sort(sortFn[state.sort]);
    renderChips();
    syncUrl();

    releaseReveals(els.grid);
    els.grid.innerHTML = list.map((p) => productCardHtml(p, { layout: "std", reveal: false })).join("");
    hydrateImages(els.grid);
    els.grid.hidden = list.length === 0;
    els.empty.hidden = list.length !== 0;
    els.count.textContent = list.length === 1 ? t("shop.count.one", { total: products.length }) : t("shop.count", { shown: list.length, total: products.length });
    els.clear.hidden = !isFiltered();
    if (animate) animateGridIn(els.grid);
  }

  function reset() {
    state.q = ""; state.variety = "all"; state.avail = "all"; state.sort = "featured";
    els.q.value = ""; els.avail.value = "all"; els.sort.value = "featured";
    render();
  }

  let timer;
  els.q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => { state.q = els.q.value; render(); }, 140); });
  els.avail.addEventListener("change", () => { state.avail = els.avail.value; render(); });
  els.sort.addEventListener("change", () => { state.sort = els.sort.value; render(); });
  els.chips.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-variety]");
    if (!chip) return;
    state.variety = chip.dataset.variety;
    render();
    els.chips.querySelector(`[data-variety="${CSS.escape(state.variety)}"]`)?.focus();
  });
  els.form.addEventListener("submit", (e) => e.preventDefault());
  els.clear.addEventListener("click", reset);
  els.emptyClear.addEventListener("click", reset);

  render({ animate: false });
  animateGridIn(els.grid);
}
