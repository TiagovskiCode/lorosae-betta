# AQUORA

Loja conceptual de peixes Betta, desenhada e desenvolvida como projeto de portfólio da **Elevate Web Studios**. AQUORA é uma marca fictícia: o objetivo é demonstrar direção de arte, UI/UX e desenvolvimento frontend numa experiência de ecommerce premium, sem frameworks.

## Direção criativa

- **Boutique aquática, clara e arredondada.** Superfícies brancas e pérola onde as fotografias (escuras, subaquáticas) ganham destaque; azul-marinho só no rodapé e em painéis de destaque.
- **Paleta inspirada no Aurora Betta:** Ocean Blue `#173F91` (marca, CTA, ligações) · Ice Blue `#78B8ED` (detalhes, hovers) · Pearl White `#EAF4FF` e Pure White `#FFFFFF` (fundos e cartões) · Aurora Pink `#EF8CBF` (acento: selos, ponto da marca, estados, um CTA por secção) · Midnight Navy `#172B48` (texto, rodapé). Tokens em `css/main.css`; `.on-dark` inverte-os nas superfícies escuras. Todos os pares de texto cumprem WCAG AA (o rosa nunca é usado como cor de texto sobre branco).
- **Sistema de raios:** 10 px (etiquetas) · 14 px (campos) · 18 px (controlos) · 22 px (cartões de produto) · 28 px (imagens grandes) · 34 px (painéis de destaque) · pill (botões, chips, selos).
- **Tipografia:** Cormorant Garamond (títulos, preços) + Manrope (interface e texto), auto-alojadas; escala fluida com `clamp()`; texto em frase, sem excesso de maiúsculas.
- **Movimento:** cortina de entrada de ~1,8 s (uma vez por sessão), entrada do hero, revelações por scroll, elevação suave nos cartões. Tudo desativado com `prefers-reduced-motion`.

## Páginas

| Página | Ficheiro | Conteúdo |
|---|---|---|
| Início | `index.html` | Hero, destaques da marca, coleção em destaque, variedades (cartões com fotografia), peixe em destaque, porquê a AQUORA, galeria + lightbox, guia de cuidados, CTA, contacto |
| Coleção | `pages/shop.html` | Filtro por variedade, pesquisa, disponibilidade, ordenação (preço ↑↓, nome A–Z/Z–A); estado no URL (`?q=&variedade=&disp=&ordem=`) |
| Ficha | `pages/product.html?produto=<slug>` | Galeria com lightbox (empilhada em desktop, carrossel no telemóvel), ficha técnica, descrição, nota sobre a variedade, cuidados, relacionados |
| Carrinho | `pages/cart.html` | Linhas, quantidades limitadas ao stock, resumo e pedido de reserva |
| Sobre | `pages/about.html` | Filosofia, compromissos, responsabilidade |
| Cuidados | `pages/care-guide.html` | Guia completo, FAQ, compra e envios, privacidade |

## Funcionalidade

- **Pesquisa no cabeçalho:** painel com sugestões em direto (nome, cor, variedade); Enter abre a coleção já filtrada (`?q=`).
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

Projeto conceptual. A marca, os produtos e os preços são fictícios; as fotografias são imagens geradas para o conceito (ver `IMAGE_GENERATION_BRIEF.md`). `robots.txt` permite a indexação (exceto o carrinho) e `sitemap.xml` lista as páginas e as fichas.
