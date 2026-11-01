# AQUORA

Loja conceptual de peixes Betta, desenhada e desenvolvida como projeto de portfólio da **Elevate Web Studios**. AQUORA é uma marca fictícia: o objetivo é demonstrar direção de arte, UI/UX e desenvolvimento frontend numa experiência de ecommerce premium, sem frameworks.

## Direção criativa

- **Editorial aquático.** Fundos teal quase negros, fotografia em grande escala e muito espaço negativo. Cada secção da home usa uma composição diferente (hero em ecrã inteiro, manifesto tipográfico, grelha assimétrica, destaque sobre superfície, índice de variedades com pré-visualização, banda de imagem, faixa horizontal de detalhes, lista de cuidados, CTA tipográfico, contacto).
- **Paleta:** `#071114` ink · `#0b1b1f` abyss · `#10252a` surface · `#1a4650` azul aquático · `#d7b77a` ouro (único acento) · `#e8e5dc` marfim · `#a6ada8` / `#808b88` texto secundário. Todos os pares de texto cumprem WCAG AA.
- **Tipografia:** Cormorant Garamond (títulos, preços, números) + Manrope (texto e interface), ambas auto-alojadas. Escala fluida com `clamp()`.
- **Forma:** cantos quase retos, divisores finos em vez de cartões com caixa, sem glassmorphism nem sombras decorativas.
- **Identidade:** wordmark tipográfico "AQUORA" com espaçamento largo e monograma "A" em ouro para o favicon (`assets/icons/favicon.svg`).
- **Movimento:** cortina de entrada de ~1,8 s (uma vez por sessão), entrada do hero por linhas, revelações por scroll, parallax contido só em desktop. Tudo desativado com `prefers-reduced-motion`.

## Páginas

| Página | Ficheiro | Conteúdo |
|---|---|---|
| Início | `index.html` | Hero, manifesto, coleção em destaque, peixe em destaque, variedades, filosofia, galeria + lightbox, cuidados, CTA, contacto |
| Coleção | `pages/shop.html` | Filtro por variedade, pesquisa, disponibilidade, ordenação; estado no URL (`?q=&variedade=&disp=&ordem=`) |
| Ficha | `pages/product.html?produto=<slug>` | Galeria (empilhada em desktop, carrossel no telemóvel), ficha técnica, descrição, nota sobre a variedade, cuidados, relacionados |
| Carrinho | `pages/cart.html` | Linhas, quantidades limitadas ao stock, resumo e pedido de reserva |
| Sobre | `pages/about.html` | Filosofia, compromissos, responsabilidade |
| Cuidados | `pages/care-guide.html` | Guia completo, FAQ, compra e envios, privacidade |

## Funcionalidade

- **Carrinho** em `localStorage` (`aquora.cart.v1`), gaveta lateral com trap de foco e Esc, sincronização entre separadores.
- **Pedido de reserva:** o site não processa pagamentos. Sem back-end, o pedido é preparado no navegador e apresentado ao cliente; com `CONFIG.orderEndpoint` é enviado por POST; com `CONFIG.contact.email` abre o email do cliente.
- **Contacto:** validação completa; só mostra sucesso se `CONFIG.contactEndpoint` responder OK (ex.: Formspree). Sem serviço configurado, informa que a mensagem não foi enviada.
- **Imagens:** WebP responsivo (`x-800.webp` / `x.webp`) com recurso ao JPEG e, em último caso, a uma imagem abstrata gerada em SVG.

## Tecnologias

HTML5 · CSS3 (tokens em `:root`, mobile-first) · JavaScript ES2020+ em módulos nativos · GSAP 3 + ScrollTrigger e Lenis (locais, em `js/vendor/`). Sem passo de build.

```
index.html
pages/            shop · product · cart · about · care-guide
css/
  main.css        tokens, reset, tipografia, layout, cabeçalho, menu, rodapé
  components.css  botões, estados, cartão de produto, formulários, filtros, carrinho, toast, acordeão, lightbox
  sections.css    hero, secções da home, ficha de produto, páginas de texto
  animations.css  estados iniciais das animações, cortina de entrada, movimento reduzido
js/
  main.js         arranque por página
  layout.js       cabeçalho, menu móvel, rodapé (fonte única)
  products.js     catálogo e renderização (cartões, destaques, variedades, galeria, ficha)
  filters.js      pesquisa e filtros da coleção
  cart.js         carrinho, gaveta e pedido de reserva
  animations.js   sistema de movimento GSAP
  loader.js       cortina de entrada
  gallery.js      lightbox acessível
  contact.js      formulário de contacto
  scroll.js       smooth scroll (Lenis)
  utils.js        CONFIG, textos, formatação, imagens, toast, trap de foco
data/             products.json · categories.json
tools/            otimização e geração de imagens
```

## Correr localmente

Os dados são carregados com `fetch`, por isso é preciso um servidor estático:

```bash
npx serve .
```

## Editar a coleção

Tudo em `data/products.json` (fonte única). Campos principais: `id` (`aq-001` → mostrado como "N.º 001"), `slug`, `name`, `category`, `tail`, `colors`, `price`, `status` (`available` · `reserved` · `soon` · `sold`), `stock`, `featured`, `spotlight`, `images`. Campos `sex`, `ageMonths` e `sizeCm` a `null` aparecem como "Por confirmar". `published: false` esconde um produto.

As imagens seguem o padrão `assets/images/products/aq-<slug>-01.jpg` (+ `-01.webp` e `-01-800.webp`, gerados por `tools/optimise-images.mjs`).

## Nota

Projeto conceptual. A marca, os produtos e os preços são fictícios; as fotografias são imagens geradas para o conceito (ver `IMAGE_GENERATION_BRIEF.md`). A indexação por motores de busca está desativada em `robots.txt`.
