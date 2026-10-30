# LOROSAE BETTA®

Loja online de Betta, com identidade visual aquática e escura, animações GSAP e um fluxo de compra **de demonstração** (carrinho funcional no navegador, sem pagamento).

> ⚠️ **Estado do projeto: demonstração.** Produtos, preços, descrições, políticas e contactos são exemplos. As imagens são **temporárias** (geradas em código e rotuladas como tal). Ver [O que falta antes de produção](#o-que-falta-antes-de-produção).

## Funcionalidades

- **Loader "Aquário" (3 s)** — só na home, uma vez por sessão. Uma timeline GSAP: imersão (0–0,8 s: água, brilho, raios de luz, partículas), três peixes reais da coleção a atravessar o ecrã em profundidades diferentes (0,8–2 s), revelação da marca (2–2,6 s) e transição em que a janela do aquário encolhe até ao cartão do hero, com o mesmo raio (2,6–3 s). Não espera por nada (um peixe cuja foto falhe simplesmente não aparece), tem "Saltar introdução"/Esc e failsafe. Com `prefers-reduced-motion`, entrada simplificada só com opacidade (~1,2 s). Código: `js/loader.js`.
- **Smooth scrolling (Lenis + GSAP)** — `js/scroll.js`. Mantém o scroll nativo (âncoras, `position: sticky`, teclado), suaviza só roda/trackpad (inércia moderada), toque nativo em telemóveis, sincronizado com o ticker do GSAP e o ScrollTrigger, para quando há diálogos abertos e é desativado com movimento reduzido. As âncoras internas deslizam com compensação do header flutuante.
- **Rounded UI** — design system arredondado com tokens (`--radius-sm` … `--radius-pill`, superfícies, texto, destaque) em `css/main.css`: header flutuante translúcido, hero em cartão de 44 px com cartão sobreposto, cartões de 28–36 px, botões/badges/chips pill, inputs de 20 px, painéis e rodapé em cartão, máscaras de revelação arredondadas.
- **Página inicial cinematográfica**: hero com luz e partículas subtis, timeline GSAP (título por linhas → texto → CTAs; sem loader corre também marca → máscara da imagem), parallax controlado e secções com reveals por scroll.
- **Destaque editorial** (peixe com `"spotlight": true`), **confiança** (ícones discretos, sem certificações inventadas), **galeria** com lightbox (teclado ←/→/Home/End/Esc, swipe, trap de foco) e **contacto** com formulário validado.
- **Catálogo** (`pages/shop.html`): pesquisa, filtro por variedade, filtro por disponibilidade, ordenação por preço/nome, contagens, estado vazio e “limpar filtros”. O estado fica no URL (`?q=&variedade=&disp=&ordem=`).
- **Ficha de produto** (`pages/product.html?produto=<slug>`): galeria, ficha técnica com distinção entre dados *confirmados* e *de demonstração*, cuidados essenciais e peixes relacionados.
- **Carrinho** (gaveta + `pages/cart.html`): adicionar, remover, alterar quantidades (limitadas ao stock), subtotal, contador, esvaziar, persistência em `localStorage` e sincronização entre separadores.
- **Checkout de demonstração**: formulário validado que gera um objeto de encomenda (JSON) — **não envia nada nem processa pagamento**. Ponto de integração em `submitOrder()` (`js/cart.js`).
- **Guia de cuidados e venda responsável** (`pages/care-guide.html`): responsabilidade, aquário, água, alimentação, filtração, temperatura, aclimatação, transporte, FAQ e **blocos de políticas por definir**.
- **Formulário de contacto honesto**: só mostra "enviada" se um serviço responder OK (`CONFIG.contactEndpoint`). Sem serviço, abre o email do utilizador (se `contact.email` existir) e diz que **não** foi enviado, ou explica que o envio não está configurado.
- **Acessibilidade**: HTML semântico, skip link, foco visível, `aria-*` em menu/gaveta/acordeão/filtros, trap de foco, `prefers-reduced-motion` respeitado.
- **SEO base**: títulos e descrições por página, Open Graph, `robots.txt`, `sitemap.xml`, favicon.

## Tecnologias

Paleta: Deep Ocean `#071114` · Dark Teal `#0B2027` · Ocean Blue `#123642` · Aqua Highlight `#70E1D1` (só acentos) · Soft White `#F2F6F5` · Muted Gray `#9BAEB1`.

HTML5 · CSS3 (variáveis, sem frameworks) · JavaScript ES2020+ em módulos nativos · **GSAP 3.12.5 + ScrollTrigger** e **Lenis 1.1.20** (14 KB, smooth scroll), todos incluídos localmente em `js/vendor/` · Fontes Cormorant Garamond e Manrope (auto-alojadas em `assets/fonts/`, licença OFL).

Sem React, Vue, Next.js, TypeScript, JSX, Tailwind nem passo de *build*: o projeto é estático e **não há `npm run build`**. Foi mantida a arquitetura vanilla existente (em vez de migrar para React/TypeScript) porque cumpre os requisitos, é mais leve e mais simples de manter para um site desta dimensão.

## Estrutura

```
index.html                  Página inicial
pages/
  shop.html                 Catálogo
  product.html              Ficha de produto (?produto=slug)
  about.html                Sobre a marca + contactos (por definir)
  care-guide.html           Guia de cuidados, FAQ e políticas (por definir)
  cart.html                 Carrinho + checkout de demonstração
css/
  main.css                  Tokens, tipografia, layout, cabeçalho, rodapé, secções
  components.css            Botões, cartões, filtros, formulários, carrinho, toast, FAQ
  animations.css            Estados iniciais das animações + movimento reduzido
  responsive.css            Pontos de rutura (1920 / 1100 / 900 / 600)
js/
  main.js                   Entrada: monta os componentes, FAQ, índice, arranque por página
  layout.js                 Header, Navigation, MobileMenu, Footer, Newsletter
  utils.js                  CONFIG, textos (i18n), formatação, imagens temporárias, toast
  products.js               Carregamento do catálogo + cartões, destaques, variedades, ficha
  cart.js                   Estado do carrinho, gaveta, página de carrinho, checkout demo
  filters.js                Pesquisa/filtros/ordenação do catálogo
  animations.js             Todo o sistema GSAP + ScrollTrigger
  loader.js                 Loader "Aquário" (intro cinematográfica)
  ambient.js                Partículas subaquáticas em canvas (loader + hero)
  gallery.js                Lightbox da galeria
  contact.js                Formulário de contacto (validação e estados)
  scroll.js                 Smooth scrolling (Lenis) sincronizado com GSAP/ScrollTrigger
  vendor/                   gsap.min.js, ScrollTrigger.min.js, lenis.min.js
data/
  products.json             Produtos (fonte única)
  categories.json           Variedades
assets/
  images/{hero,products,varieties,editorial,care}/
  fonts/  icons/
tools/
  optimise-images.mjs       PNG → JPEG otimizado + versões WebP (x.webp, x-800.webp)
  generate-images.mjs       Geração de imagens pela API da OpenAI (opcional)
IMAGE_GENERATION_BRIEF.md   Lista de imagens + prompts
robots.txt  sitemap.xml  .gitignore  .env.example
```

### Componentes

O site não usa framework, mas está organizado por componentes reutilizáveis:

| Componente | Onde | Notas |
|---|---|---|
| Header + Navigation | `js/layout.js` | Fonte única para todas as páginas; estado de scroll, esconde ao descer |
| MobileMenu | `js/layout.js` + `animateMenu()` | Diálogo com trap de foco, Esc, fecha ao passar a desktop |
| Loader | `js/loader.js` + `js/ambient.js` | Intro "Aquário", uma vez por sessão |
| Hero | `index.html` + `initHero()` em `js/animations.js` | Timeline, luz, partículas, parallax |
| ProductCard | `productCardHtml()` em `js/products.js` | Usado na home, loja, relacionados |
| Spotlight | `renderSpotlight()` em `js/products.js` | Peixe com `"spotlight": true` |
| Gallery | `renderGalleryGrid()` + `js/gallery.js` | Grelha editorial + lightbox |
| Cart | `js/cart.js` | Gaveta, página e pedido |
| CallToAction / Contact | `index.html` + `js/contact.js` | Formulário com estados honestos |
| Footer | `js/layout.js` | Links, contactos configurados, legais |

> Para além da estrutura base pedida, foram acrescentados `js/utils.js` (código partilhado, para evitar dependências circulares entre módulos), `js/vendor/` (bibliotecas locais), os módulos `loader`, `ambient`, `gallery` e `contact`, e `tools/` (scripts de imagens).

## Como correr localmente

Os dados são carregados com `fetch` e os scripts são módulos ES, por isso é preciso um servidor estático (abrir o `index.html` com duplo clique **não** funciona). Qualquer um serve:

```bash
npx serve .
```

```bash
python -m http.server 8000
```

Depois abra o endereço indicado (por exemplo `http://localhost:3000` ou `http://localhost:8000`).

## Como atualizar produtos

Edite **apenas** `data/products.json`. Cada produto tem:

| Campo | Notas |
|---|---|
| `id`, `slug` | `slug` aparece no URL (`?produto=slug`) e dá nome às imagens (`lb-<slug>-01.jpg`) |
| `name`, `category`, `tail`, `colors`, `colorDescription` | `category` tem de existir em `data/categories.json` |
| `price` | em euros |
| `status` | `available` · `reserved` · `soon` · `sold` (só `available` com `stock > 0` pode ser comprado) |
| `stock` | quantidade; o carrinho nunca deixa passar este valor |
| `sex`, `ageMonths`, `sizeCm` | `null` = “por confirmar” (aparece assim na ficha). **Só preencha o que for verdade.** |
| `confirmed` | lista dos campos validados pela loja (ex.: `["price","sex","sizeCm"]`). Esses campos passam de “Dados de demonstração” a “Confirmado” |
| `images` | `primary`, `gallery[]` e `alt` |
| `tint` | cores usadas só pela imagem temporária |
| `featured`, `layout` | destaque na home e formato do cartão (`feature`, `tall`, `wide`, `std`) |

Para as variedades, edite `data/categories.json`. As categorias são ilustrativas — a disponibilidade vem sempre dos produtos.

## Como substituir imagens

1. Consulte `IMAGE_GENERATION_BRIEF.md` (ficheiros, proporções, prompts).
2. Coloque cada ficheiro **no caminho e com o nome exatos** indicados.
3. Em `js/utils.js`, ponha `CONFIG.imageMode = "auto"`. O site passa a usar a imagem real e só mostra a temporária se esta faltar.
4. Substitua também `assets/icons/favicon.svg` e crie `assets/images/og-lorosae-betta.jpg` (1200 × 630).

### Gerar as imagens com o script

`tools/generate-images.mjs` lê os prompts de `IMAGE_GENERATION_BRIEF.md` e grava cada imagem no caminho certo (API de imagens da OpenAI, `gpt-image-1`; a conta pode exigir verificação da organização e a geração tem custo — veja os preços atuais).

```bash
node tools/generate-images.mjs --list
```

```bash
node tools/generate-images.mjs --only hero --quality high
```

A chave vai em `OPENAI_API_KEY` (variável de ambiente ou ficheiro `.env`, ver `.env.example`; nunca no repositório). Comece pelo hero, avalie, e só depois use `--group Produtos` ou `--all`. Sem `--force`, ficheiros existentes são preservados. Instale `sharp` (`npm i sharp`) se quiser recorte exato às dimensões do brief.

## Configuração (`js/utils.js` → `CONFIG`)

O site é estático: **não há variáveis de ambiente**. Tudo o que a loja tem de configurar está no objeto `CONFIG`:

| Chave | Efeito |
|---|---|
| `contact.email` / `contact.phone` / `contact.address` | Aparecem no rodapé e na secção Contacto (vazio = não aparecem) |
| `instagramUrl`, `whatsappNumber` | Links sociais / WhatsApp (vazio = não aparecem) |
| `contactEndpoint` | URL que recebe o formulário de contacto (POST JSON). Ex.: Formspree, Getform, Netlify Forms, API própria. Sem ele: abre o email do cliente se `contact.email` existir; senão explica que o envio não está configurado |
| `orderEndpoint` | URL do sistema de encomendas (POST JSON). Sem ele, e com `contact.email`, o carrinho prepara um **pedido de reserva por email**; sem nenhum dos dois, o checkout é uma demonstração identificada |
| `newsletterEndpoint` | URL de inscrição (POST `{ email }`). Sem ele, **a newsletter não aparece** |
| `imageMode` | `"auto"` (imagens reais com recurso) ou `"placeholder"` |
| `webp` | Usa `x.webp`/`x-800.webp` com `srcset`, com recurso ao JPEG |
| `demoMode` | Faixa e etiquetas "dados de demonstração" |
| `siteUrl` | URL público final |

Os textos da interface estão em `STRINGS` no mesmo ficheiro, preparados para tradução. A única variável de ambiente do projeto é `OPENAI_API_KEY`, e só para o script opcional `tools/generate-images.mjs`.

## Publicar

É um site estático: qualquer alojamento de ficheiros estáticos com HTTPS serve (Netlify, Vercel, Cloudflare Pages, GitHub Pages ou um alojamento tradicional).

1. Preencher `CONFIG` (contactos e, pelo menos, `contactEndpoint`) e substituir políticas e dados de demonstração.
2. Correr `node tools/optimise-images.mjs` (com `npm i sharp`) depois de juntar imagens novas, para gerar JPEG + WebP.
3. Atualizar `siteUrl`, os `og:image`, `sitemap.xml` e retirar o `Disallow: /` de `robots.txt`.
4. Enviar a pasta do projeto **sem** `assets/images/_originals/`, `tools/` e `.env` (não são necessários ao site).
   - Netlify / Cloudflare Pages: arrastar a pasta ou ligar o repositório; não há comando de build e a pasta de publicação é a raiz.
   - GitHub Pages: publicar a partir da branch `main`, pasta `/`.
5. Testar no domínio final: formulário de contacto (envio real), pedido de reserva, e Lighthouse.

## O que é apenas demonstração

- Todos os produtos, preços, nomes, descrições, stock e disponibilidade.
- As imagens (temporárias).
- O **checkout**, enquanto não houver `orderEndpoint` nem `contact.email`: não há pagamento, reserva, gestão de stock nem envio. Com `contact.email` passa a preparar um pedido de reserva real por email; com `orderEndpoint`, envia o pedido.
- A **newsletter** não aparece enquanto não houver `newsletterEndpoint` (não existe nenhum formulário de fachada).
- As imagens das **variedades** e **editoriais** reutilizam fotografias de produtos até existirem imagens dedicadas. Só aparecem na home as variedades com peixes publicados.
- Todas as **políticas** (envios, chegada em vida, reembolsos, devoluções, termos, privacidade) e **contactos** — são marcadores a substituir.

## O que falta antes de produção

1. **Dados reais**: stock, preços, fotografias reais de cada peixe, e preencher `confirmed`.
2. **Políticas e informação legal**: regiões de envio, condições de entrega, política de chegada em vida, reembolsos/devoluções (especialmente para animais vivos), termos e condições, privacidade/RGPD, identificação do vendedor e livro de reclamações, conforme a lei aplicável. Idealmente revistos por um profissional.
3. **Pagamento e encomendas**: integrar um fornecedor de pagamentos e um sistema de encomendas/stock (ver `submitOrder()` em `js/cart.js` e `CONFIG.orderEndpoint`). O stock deve ser validado **no servidor**.
4. **Contactos**: email, telemóvel/WhatsApp, Instagram.
5. **SEO e domínio**: URL final em `og:image`, `sitemap.xml`, `robots.txt` (retirar o `Disallow: /`), favicon final, página de produto indexável (considerar páginas estáticas por produto ou dados estruturados `Product` quando os dados forem reais).
6. **Cookies/RGPD**: se forem adicionados analytics ou serviços externos, incluir consentimento. O site atual não usa cookies nem serviços de terceiros (só `localStorage` para o carrinho).
7. **Desempenho**: as imagens já são servidas em WebP com `srcset` (800 px / largura total) e o hero tem *preload*. Falta testar com Lighthouse no domínio final. A fotografia do hero tem 1586 px de largura: em monitores grandes de alta densidade fica ligeiramente suave — uma versão de 2400–3200 px melhora o resultado.
8. **Remoção da demonstração**: `CONFIG.demoMode = false` quando todos os dados forem reais.

## Testes realizados (e o que não foi testado)

Verificado no browser integrado (Chromium): carregamento sem erros de consola; loader (fases 1–4, saltar, não repetição na sessão, ausência com reduced-motion e failsafe); hero; reveals por scroll em toda a home (79 triggers, nada fica escondido, incluindo recarregar a meio da página); catálogo (pesquisa, filtros, ordenação, estado vazio); ficha; carrinho (adicionar/remover/quantidades/limite de stock/persistência); checkout de demonstração; lightbox (teclado, wrap, foco devolvido, mobile); formulário de contacto (validação, honeypot, sem configuração, endpoint OK, endpoint 500, offline); menu móvel; sem overflow horizontal em 375/820/1024/1440 px; links e âncoras internos.

Auditoria automática em todas as páginas: um só `h1` por página e sem saltos na hierarquia de headings; nenhuma imagem sem `alt`; nenhum botão, link ou campo sem nome acessível; sem IDs duplicados; sem links mortos; alvos de toque ≥ 24 px (controlos principais com 44 px); todas as imagens carregam em WebP, com recurso testado (sem WebP → JPEG; sem ficheiro → imagem temporária); estados de carregamento substituídos após os dados; failsafe do loader se o JavaScript não arrancar.

**Não testado:** `mailto:` real (abre o cliente de email do sistema), dispositivos físicos, Safari/Firefox, Lighthouse, leitores de ecrã, envio real do formulário (depende de um serviço que ainda não está configurado). O painel de teste atrasa as animações, por isso a fluidez real (60 fps) não foi medida.

### Verificações da versão Rounded UI + loader de 3 s + Lenis

- Loader: inspecionado fase a fase (0,6 / 1,15 / 1,4 / 2,5 / 2,84 s) em desktop e telemóvel; a timeline mede **3,0 s**; termina, remove-se, marca a sessão e não se repete; com movimento reduzido mostra a entrada simplificada.
- Lenis: roda do rato desloca a página; âncoras ("Contacto", "Em destaque", "Descer") deslizam até à secção certa sem recarregar a página e passam o foco; o Lenis para com o menu, o carrinho, o lightbox e o loader.
- Scroll completo da home com movimento: 0 elementos escondidos, máscaras terminam com o raio dos cartões, 0 erros na consola.
- Sem overflow horizontal em todas as páginas a 375 px; páginas interiores (loja, ficha, carrinho, guia, sobre) revistas com o novo design.

**Limitação:** o painel de testes atrasa as animações (mediu 5,2 s de relógio para a timeline de 3 s), por isso a duração e a fluidez reais devem ser confirmadas num browser normal.

## Notas de movimento (GSAP)

- Só `transform`/`opacity` (e `clip-path` nas máscaras); sem blur animado, sem *pinning*, sem sequestrar o scroll.
- Os estados iniciais ocultos estão em `css/animations.css` e só se aplicam se o utilizador **não** pediu movimento reduzido; se o JS/GSAP falhar, um *failsafe* mostra o conteúdo.
- Parallax e efeitos de rato (hover das imagens, botões magnéticos) apenas em desktop com ponteiro fino; simplificados em tablet/telemóvel (`gsap.matchMedia`).
- `bindReveals()` marca cada elemento (`data-bound`) para nunca criar triggers duplicados; `releaseReveals()` liberta-os quando o conteúdo é substituído (filtros).

## Licenças de terceiros

GSAP e ScrollTrigger: ver `js/vendor/` e <https://gsap.com/standard-license>. Cormorant Garamond e Manrope: SIL Open Font License 1.1.
