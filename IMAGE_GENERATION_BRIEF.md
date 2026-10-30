# IMAGE_GENERATION_BRIEF.md — LOROSAE BETTA®

> **Estado atual:** já existem o hero e 10 produtos (principal e detalhe, exceto Aurora `-02`). **Faltam:** Lótus e Sombra (`-01` e `-02`, estão como rascunho em `data/products.json` com `published: false`), `lb-aurora-02`, as 6 imagens de variedades e as 3 editoriais (hoje reutilizam fotografias de produtos como solução **provisória**). Qualquer imagem em falta mostra uma **imagem temporária gerada em código**, rotulada "IMAGEM TEMPORÁRIA". Este documento é a lista completa e os prompts prontos a usar para as criar (ou para as encomendar a um fotógrafo).
>
> Ficheiro gerado a partir de `data/products.json` e `data/categories.json` — se mudar o stock, mantenha os nomes de ficheiro coerentes (ver convenção).

## Como usar

1. Gere/fotografe cada imagem e guarde-a **exatamente** no caminho e com o nome indicados.
2. Exporte em JPG (qualidade 80–85) ou WebP e otimize (alvo: < 300 KB por imagem de produto).
3. Em `js/utils.js`, mude `CONFIG.imageMode` de `"placeholder"` para `"auto"`. A partir daí o site tenta carregar a imagem real e, se faltar, mostra a temporária.
4. Se usar `.webp` em vez de `.jpg`, atualize o caminho em `data/products.json` / `data/categories.json` (e em `index.html` para hero/editorial).

## Direção fotográfica (comum a todas as imagens)

- **Macro e grandes planos** de Betta, barbatanas fluidas, escamas detalhadas.
- **Fundos escuros** (preto-azulado), com destaques controlados apenas no peixe.
- **Cores ricas mas credíveis**; evitar neon e saturação artificial.
- **Reflexos de água realistas** (cáusticas subtis), luz editorial suave.
- **Cada peixe é um indivíduo** — nunca repetir a mesma imagem em produtos diferentes.
- Sem texto, sem logótipos, sem peixes de desenho animado ou com aspeto 3D.
- Paleta da marca (atual): Deep Ocean `#071114`, Dark Teal `#0B2027`, Ocean Blue `#123642`, Aqua Highlight `#70E1D1` (reflexos de luz, com moderação), Soft White `#F2F6F5`, Muted Gray `#9BAEB1`. Os prompts antigos que falam de "copper rim light" são facultativos: as fotografias já criadas têm tons cobre nas pontas das barbatanas e funcionam bem.

**Aviso importante (venda de animais vivos):** as imagens de produto devem mostrar o **peixe real que está à venda**. Imagens geradas por IA servem apenas para a fase de design/demonstração; **substitua-as por fotografias reais do stock antes do lançamento**, para não induzir o cliente em erro sobre o animal que vai receber.

## Convenção de nomes

`lb-<assunto>-<NN>.jpg` — minúsculas, sem acentos, hífen como separador.

| Tipo | Padrão | Exemplo |
|---|---|---|
| Hero | `hero/lb-hero-betta-NN` | `lb-hero-betta-01.jpg` |
| Produto | `products/lb-<slug>-NN` (01 = principal, 02 = detalhe) | `lb-abissal-01.jpg` |
| Variedade | `varieties/lb-variety-<id>` | `lb-variety-halfmoon.jpg` |
| Editorial | `editorial/lb-editorial-<tema>-NN` | `lb-editorial-brand-01.jpg` |
| Cuidados | `care/lb-care-<tema>-NN` | `lb-care-water-01.jpg` |

## Prompt-base (negativos incluídos em todos os prompts)

```
No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

## Resumo (38 imagens)

| # | Ficheiro | Prioridade/grupo |
|---|---|---|
| 1 | `assets/images/hero/lb-hero-betta-01.jpg` | 1 · Hero |
| 2 | `assets/images/products/lb-abissal-01.jpg` | 2 · Produtos — fotografia principal |
| 3 | `assets/images/products/lb-abissal-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 4 | `assets/images/products/lb-ambar-01.jpg` | 2 · Produtos — fotografia principal |
| 5 | `assets/images/products/lb-ambar-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 6 | `assets/images/products/lb-mare-01.jpg` | 2 · Produtos — fotografia principal |
| 7 | `assets/images/products/lb-mare-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 8 | `assets/images/products/lb-nevoa-01.jpg` | 2 · Produtos — fotografia principal |
| 9 | `assets/images/products/lb-nevoa-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 10 | `assets/images/products/lb-cobre-01.jpg` | 2 · Produtos — fotografia principal |
| 11 | `assets/images/products/lb-cobre-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 12 | `assets/images/products/lb-gemeo-01.jpg` | 2 · Produtos — fotografia principal |
| 13 | `assets/images/products/lb-gemeo-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 14 | `assets/images/products/lb-eclipse-01.jpg` | 2 · Produtos — fotografia principal |
| 15 | `assets/images/products/lb-eclipse-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 16 | `assets/images/products/lb-coral-01.jpg` | 2 · Produtos — fotografia principal |
| 17 | `assets/images/products/lb-coral-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 18 | `assets/images/products/lb-jade-01.jpg` | 2 · Produtos — fotografia principal |
| 19 | `assets/images/products/lb-jade-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 20 | `assets/images/products/lb-aurora-01.jpg` | 2 · Produtos — fotografia principal |
| 21 | `assets/images/products/lb-aurora-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 22 | `assets/images/products/lb-lotus-01.jpg` | 2 · Produtos — fotografia principal |
| 23 | `assets/images/products/lb-lotus-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 24 | `assets/images/products/lb-sombra-01.jpg` | 2 · Produtos — fotografia principal |
| 25 | `assets/images/products/lb-sombra-02.jpg` | 2 · Produtos — detalhe (galeria) |
| 26 | `assets/images/varieties/lb-variety-halfmoon.jpg` | 3 · Variedades (categorias) |
| 27 | `assets/images/varieties/lb-variety-crowntail.jpg` | 3 · Variedades (categorias) |
| 28 | `assets/images/varieties/lb-variety-plakat.jpg` | 3 · Variedades (categorias) |
| 29 | `assets/images/varieties/lb-variety-dumbo-ear.jpg` | 3 · Variedades (categorias) |
| 30 | `assets/images/varieties/lb-variety-veiltail.jpg` | 3 · Variedades (categorias) |
| 31 | `assets/images/varieties/lb-variety-double-tail.jpg` | 3 · Variedades (categorias) |
| 32 | `assets/images/editorial/lb-editorial-brand-01.jpg` | 4 · Editorial |
| 33 | `assets/images/editorial/lb-editorial-experience-01.jpg` | 4 · Editorial |
| 34 | `assets/images/editorial/lb-editorial-cta-01.jpg` | 4 · Editorial |
| 35 | `assets/images/og-lorosae-betta.jpg` | 4 · Editorial |
| 36 | `assets/images/care/lb-care-aquarium-01.jpg` | 5 · Cuidados (RESERVADO — ainda não usado nos modelos) |
| 37 | `assets/images/care/lb-care-water-01.jpg` | 5 · Cuidados (RESERVADO — ainda não usado nos modelos) |
| 38 | `assets/images/care/lb-care-acclimatisation-01.jpg` | 5 · Cuidados (RESERVADO — ainda não usado nos modelos) |

---

## 1 · Hero

### `assets/images/hero/lb-hero-betta-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Homepage — hero (full-bleed background, parallax) |
| **Assunto** | One extraordinary Betta, the hero of the brand. Suggested: a long-finned Halfmoon or Veiltail in deep blue with copper-gold edge light (links to the brand palette). |
| **Composição** | Wide cinematic frame. The fish sits on the RIGHT 55–60 % of the frame, vertically between 35 % and 70 %, three-quarter side view, fins flowing to the right and slightly down. The LEFT 40 % of the frame must be calm, dark, low-detail space where the headline is placed. |
| **Fundo** | Very dark teal-black water (#071114 to #0B2027) with soft depth, faint distant light shafts coming from the top. |
| **Iluminação** | Soft key from the upper left, copper rim light (#B77A53) on the fin edges, delicate caustics, controlled highlights only on the fish. |
| **Paleta** | Abyss Black #071114, Deep Ocean #0B2027, Aquatic Teal #3A8582, Subtle Copper #B77A53, one dominant fish colour (royal blue). |
| **Proporção** | 16:10 (landscape) |
| **Resolução recomendada** | 2400 × 1500 px minimum (ideal 3200 × 2000), JPG quality 80–85 or WebP, < 400 KB after optimisation |
| **Recortes** | Desktop: object-position 62 % 50 %. Tablet/mobile: object-position 68–74 % 50 % — the fish head and main fin mass must stay between 55 % and 85 % horizontally so it survives a portrait crop. No important detail in the top 20 % (header) or bottom 30 % (text gradient). |

**Prompt (copiar e colar):**

```text
Cinematic hero photograph of a single exceptional Betta fish swimming in a dark aquarium, three-quarter side view, long flowing fins in royal blue with metallic highlights and a thin copper-gold edge glow, fins trailing gracefully to the right. The fish occupies the right half of a wide 16:10 frame; the left 40 % of the frame is calm, dark, empty water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Soft light shafts descending from the top, subtle caustic reflections, tiny suspended particles. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Wide cinematic composition with a lot of negative space on the left. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

## 2 · Produtos — fotografia principal

### `assets/images/products/lb-abissal-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Abissal — Halfmoon) |
| **Assunto** | Abissal: a single Halfmoon Betta — royal-blue body and fins with metallic blue highlights and a dark shadow near the base of the tail, tail fully opened in a wide D shape. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: serene, deep, cold blue light. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Azul real, Preto (Azul real profundo com reflexos metálicos nas barbatanas e uma sombra escura junto à base da cauda.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Halfmoon Betta fish, royal-blue body and fins with metallic blue highlights and a dark shadow near the base of the tail, tail fully opened in a wide D shape. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: serene, deep, cold blue light. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-ambar-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Âmbar — Crowntail) |
| **Assunto** | Âmbar: a single Crowntail Betta — warm copper body with red fin rays that extend past the membrane into pointed, serrated tips fading to pale amber. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: warm, glowing like light through amber. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Cobre, Vermelho (Corpo cobre quente com raios vermelhos que se afinam em pontas claras, como luz através de âmbar.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Crowntail Betta fish, warm copper body with red fin rays that extend past the membrane into pointed, serrated tips fading to pale amber. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: warm, glowing like light through amber. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-mare-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Maré — Plakat) |
| **Assunto** | Maré: a single Plakat Betta — short-finned compact turquoise fish whose scales shift between blue and green under the light, clean athletic silhouette. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: fresh, luminous, teal-forward. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Azul-turquesa (Azul-turquesa uniforme, com escamas que refletem tons verdes conforme a incidência da luz.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Plakat Betta fish, short-finned compact turquoise fish whose scales shift between blue and green under the light, clean athletic silhouette. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: fresh, luminous, teal-forward. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-nevoa-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Névoa — Dumbo Ear) |
| **Assunto** | Névoa: a single Dumbo Ear Betta — pearl-white body with large translucent pectoral fins edged in blue-grey, fins spread like wings. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: airy, soft, misty. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Branco pérola, Azul-acinzentado (Corpo branco pérola com barbatanas translúcidas que passam a azul-acinzentado nas margens.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Dumbo Ear Betta fish, pearl-white body with large translucent pectoral fins edged in blue-grey, fins spread like wings. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: airy, soft, misty. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-cobre-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Cobre — Veiltail) |
| **Assunto** | Cobre: a single Veiltail Betta — uniform warm copper-orange body with a long drooping veil tail falling in soft folds. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: warm, calm, slow movement. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Laranja cobre (Laranja cobre quente e uniforme, com cauda longa que cai em dobras suaves.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Veiltail Betta fish, uniform warm copper-orange body with a long drooping veil tail falling in soft folds. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: warm, calm, slow movement. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-gemeo-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Gémeo — Double Tail) |
| **Assunto** | Gémeo: a single Double Tail Betta — saturated red body with white tips, tail split into two symmetrical lobes with a wide dorsal fin. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: graphic, bold, high contrast red and white. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Vermelho, Branco (Vermelho intenso com zonas de branco nas pontas, num contraste limpo e marcado.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Double Tail Betta fish, saturated red body with white tips, tail split into two symmetrical lobes with a wide dorsal fin. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: graphic, bold, high contrast red and white. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-eclipse-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Eclipse — Halfmoon) |
| **Assunto** | Eclipse: a single Halfmoon Betta — deep black body with a fine golden halo tracing the edge of every fin, like a solar eclipse corona. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: dramatic, low-key, gold edge light. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Preto, Dourado (Corpo preto profundo com um halo dourado fino a contornar as barbatanas.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Halfmoon Betta fish, deep black body with a fine golden halo tracing the edge of every fin, like a solar eclipse corona. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: dramatic, low-key, gold edge light. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-coral-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Coral — Crowntail) |
| **Assunto** | Coral: a single Crowntail Betta — coral-red fins with steel-blue stripes near the body and sharply defined serrated fin rays. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: vivid but natural, warm coral against cool blue. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Vermelho coral, Azul (Vermelho coral nas barbatanas com riscas de azul-aço junto ao corpo.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Crowntail Betta fish, coral-red fins with steel-blue stripes near the body and sharply defined serrated fin rays. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: vivid but natural, warm coral against cool blue. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-jade-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Jade — Plakat) |
| **Assunto** | Jade: a single Plakat Betta — metallic emerald-green body with the brightest shimmer along the back, short fins fading in colour. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: deep green, jewel-like. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Verde esmeralda (Verde esmeralda metálico, com brilho mais claro ao longo do dorso.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Plakat Betta fish, metallic emerald-green body with the brightest shimmer along the back, short fins fading in colour. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: deep green, jewel-like. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-aurora-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Aurora — Dumbo Ear) |
| **Assunto** | Aurora: a single Dumbo Ear Betta — pale pink body with a gradient to violet through the large pectoral and tail fins. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: delicate, dawn-light, pastel but not washed out. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Rosa pálido, Violeta (Rosa pálido no corpo com degradé para violeta nas barbatanas.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Dumbo Ear Betta fish, pale pink body with a gradient to violet through the large pectoral and tail fins. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: delicate, dawn-light, pastel but not washed out. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-lotus-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Lótus — Veiltail) |
| **Assunto** | Lótus: a single Veiltail Betta — soft white body and long drooping tail tinted light blue at the tips. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: calm, clean, white against black. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Branco, Azul claro (Branco suave com pontas em azul claro e cauda de queda longa.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Veiltail Betta fish, soft white body and long drooping tail tinted light blue at the tips. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: calm, clean, white against black. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-sombra-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Catálogo, destaques da home, ficha de produto, carrinho (Sombra — Double Tail) |
| **Assunto** | Sombra: a single Double Tail Betta — almost monochrome deep black fish with midnight-blue reflections visible only where light grazes the scales, split double tail. |
| **Composição** | Full fish visible, three-quarter side view, centred slightly low, fins fully readable; headroom ≥ 12 %; fish occupies ~65–70 % of the frame width. Must also survive crops of 6:5 (featured), 3:4 (tall) and 16:10 (wide) — keep the whole fish inside the central 70 % × 60 % area. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key, subtle rim light, caustic ripples. Mood: discreet, elegant, blue-black. |
| **Paleta** | Abyss Black #071114 / Deep Ocean #0B2027 background; fish colours: Preto, Azul-meia-noite (Preto profundo com reflexos azul-meia-noite visíveis sob luz direta.) |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Primary file is 4:5. The site crops with object-fit: cover to 6:5, 3:4, 4:5 and 16:10 — never place the eye or tail tip near the edge. |

**Prompt (copiar e colar):**

```text
Studio-quality macro photograph of one Double Tail Betta fish, almost monochrome deep black fish with midnight-blue reflections visible only where light grazes the scales, split double tail. Three-quarter side view, whole fish visible, fins gently flowing, swimming in a dark aquarium. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: discreet, elegant, blue-black. Portrait 4:5 composition with generous headroom. This must be a unique individual fish, not a generic Betta. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

## 2 · Produtos — detalhe (galeria)

### `assets/images/products/lb-abissal-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Abissal) |
| **Assunto** | Extreme close-up detail of the same fish (Abissal): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Azul real, Preto |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the royal-blue body and fins with metallic blue highlights and a dark shadow near the base of the tail of a Halfmoon Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: serene, deep, cold blue light. Portrait 4:5. The colours must match the fish in the main photo (Azul real, Preto). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-ambar-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Âmbar) |
| **Assunto** | Extreme close-up detail of the same fish (Âmbar): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Cobre, Vermelho |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the warm copper body with red fin rays that extend past the membrane into pointed of a Crowntail Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: warm, glowing like light through amber. Portrait 4:5. The colours must match the fish in the main photo (Cobre, Vermelho). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-mare-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Maré) |
| **Assunto** | Extreme close-up detail of the same fish (Maré): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Azul-turquesa |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the short-finned compact turquoise fish whose scales shift between blue and green under the light of a Plakat Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: fresh, luminous, teal-forward. Portrait 4:5. The colours must match the fish in the main photo (Azul-turquesa). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-nevoa-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Névoa) |
| **Assunto** | Extreme close-up detail of the same fish (Névoa): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Branco pérola, Azul-acinzentado |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the pearl-white body with large translucent pectoral fins edged in blue-grey of a Dumbo Ear Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: airy, soft, misty. Portrait 4:5. The colours must match the fish in the main photo (Branco pérola, Azul-acinzentado). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-cobre-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Cobre) |
| **Assunto** | Extreme close-up detail of the same fish (Cobre): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Laranja cobre |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the uniform warm copper-orange body with a long drooping veil tail falling in soft folds of a Veiltail Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: warm, calm, slow movement. Portrait 4:5. The colours must match the fish in the main photo (Laranja cobre). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-gemeo-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Gémeo) |
| **Assunto** | Extreme close-up detail of the same fish (Gémeo): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Vermelho, Branco |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the saturated red body with white tips of a Double Tail Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: graphic, bold, high contrast red and white. Portrait 4:5. The colours must match the fish in the main photo (Vermelho, Branco). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-eclipse-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Eclipse) |
| **Assunto** | Extreme close-up detail of the same fish (Eclipse): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Preto, Dourado |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the deep black body with a fine golden halo tracing the edge of every fin of a Halfmoon Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: dramatic, low-key, gold edge light. Portrait 4:5. The colours must match the fish in the main photo (Preto, Dourado). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-coral-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Coral) |
| **Assunto** | Extreme close-up detail of the same fish (Coral): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Vermelho coral, Azul |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the coral-red fins with steel-blue stripes near the body and sharply defined serrated fin rays of a Crowntail Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: vivid but natural, warm coral against cool blue. Portrait 4:5. The colours must match the fish in the main photo (Vermelho coral, Azul). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-jade-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Jade) |
| **Assunto** | Extreme close-up detail of the same fish (Jade): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Verde esmeralda |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the metallic emerald-green body with the brightest shimmer along the back of a Plakat Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: deep green, jewel-like. Portrait 4:5. The colours must match the fish in the main photo (Verde esmeralda). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-aurora-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Aurora) |
| **Assunto** | Extreme close-up detail of the same fish (Aurora): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Rosa pálido, Violeta |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the pale pink body with a gradient to violet through the large pectoral and tail fins of a Dumbo Ear Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: delicate, dawn-light, pastel but not washed out. Portrait 4:5. The colours must match the fish in the main photo (Rosa pálido, Violeta). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-lotus-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Lótus) |
| **Assunto** | Extreme close-up detail of the same fish (Lótus): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Branco, Azul claro |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the soft white body and long drooping tail tinted light blue at the tips of a Veiltail Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: calm, clean, white against black. Portrait 4:5. The colours must match the fish in the main photo (Branco, Azul claro). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/products/lb-sombra-02.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Ficha de produto — segunda imagem da galeria (Sombra) |
| **Assunto** | Extreme close-up detail of the same fish (Sombra): scales, fin rays and the translucent edge of the fins. |
| **Composição** | Macro crop on the area of most interesting texture (scales near the gill, or fin rays at the tail edge); diagonal flow; no full fish needed. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same lighting as the primary photo, raking so that scale texture and fin transparency are visible. |
| **Paleta** | Same as primary: Preto, Azul-meia-noite |
| **Proporção** | 4:5 (portrait) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1000 × 1250), JPG q80–85, < 300 KB |
| **Recortes** | Square thumbnail in the gallery strip — keep the focal detail near the centre. |

**Prompt (copiar e colar):**

```text
Extreme macro close-up of the almost monochrome deep black fish with midnight-blue reflections visible only where light grazes the scales of a Double Tail Betta: fine scale texture, translucent fin rays with light passing through, razor-thin depth of field. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Mood: discreet, elegant, blue-black. Portrait 4:5. The colours must match the fish in the main photo (Preto, Azul-meia-noite). No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

## 3 · Variedades (categorias)

### `assets/images/varieties/lb-variety-halfmoon.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção "Comprar por variedade" (Halfmoon) |
| **Assunto** | Halfmoon Betta, tail opened in a wide D shape reaching close to 180 degrees. Representative example, not tied to a product in stock. |
| **Composição** | Fish centred, silhouette of the variety clearly readable (this image teaches the variety shape). Slightly more headroom at the bottom, where nothing is overlaid. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key with a gentle rim light; calm and consistent across all six variety images. |
| **Paleta** | Dark aquatic background; fish colour near #2b6cb0 with restrained saturation |
| **Proporção** | 3:4 (portrait) |
| **Resolução recomendada** | 1800 × 2400 px (min. 900 × 1200), JPG q80–85, < 250 KB |
| **Recortes** | Shown at 3:4 on desktop and as a 72 %-width swipe card on mobile. |

**Prompt (copiar e colar):**

```text
Elegant editorial photograph of a Halfmoon Betta, tail opened in a wide D shape reaching close to 180 degrees, whole fish visible in side view, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Colour accent around #2b6cb0. Portrait 3:4, centred composition that clearly shows the characteristic silhouette of the variety. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/varieties/lb-variety-crowntail.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção "Comprar por variedade" (Crowntail) |
| **Assunto** | Crowntail Betta, fin rays extending past the membrane forming a serrated crown-like edge. Representative example, not tied to a product in stock. |
| **Composição** | Fish centred, silhouette of the variety clearly readable (this image teaches the variety shape). Slightly more headroom at the bottom, where nothing is overlaid. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key with a gentle rim light; calm and consistent across all six variety images. |
| **Paleta** | Dark aquatic background; fish colour near #c0492f with restrained saturation |
| **Proporção** | 3:4 (portrait) |
| **Resolução recomendada** | 1800 × 2400 px (min. 900 × 1200), JPG q80–85, < 250 KB |
| **Recortes** | Shown at 3:4 on desktop and as a 72 %-width swipe card on mobile. |

**Prompt (copiar e colar):**

```text
Elegant editorial photograph of a Crowntail Betta, fin rays extending past the membrane forming a serrated crown-like edge, whole fish visible in side view, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Colour accent around #c0492f. Portrait 3:4, centred composition that clearly shows the characteristic silhouette of the variety. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/varieties/lb-variety-plakat.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção "Comprar por variedade" (Plakat) |
| **Assunto** | Plakat Betta, short fins, compact athletic body, clean silhouette. Representative example, not tied to a product in stock. |
| **Composição** | Fish centred, silhouette of the variety clearly readable (this image teaches the variety shape). Slightly more headroom at the bottom, where nothing is overlaid. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key with a gentle rim light; calm and consistent across all six variety images. |
| **Paleta** | Dark aquatic background; fish colour near #2a9d8f with restrained saturation |
| **Proporção** | 3:4 (portrait) |
| **Resolução recomendada** | 1800 × 2400 px (min. 900 × 1200), JPG q80–85, < 250 KB |
| **Recortes** | Shown at 3:4 on desktop and as a 72 %-width swipe card on mobile. |

**Prompt (copiar e colar):**

```text
Elegant editorial photograph of a Plakat Betta, short fins, compact athletic body, clean silhouette, whole fish visible in side view, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Colour accent around #2a9d8f. Portrait 3:4, centred composition that clearly shows the characteristic silhouette of the variety. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/varieties/lb-variety-dumbo-ear.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção "Comprar por variedade" (Dumbo Ear) |
| **Assunto** | Dumbo Ear Betta, very large pectoral fins held out like wings. Representative example, not tied to a product in stock. |
| **Composição** | Fish centred, silhouette of the variety clearly readable (this image teaches the variety shape). Slightly more headroom at the bottom, where nothing is overlaid. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key with a gentle rim light; calm and consistent across all six variety images. |
| **Paleta** | Dark aquatic background; fish colour near #8f9fe0 with restrained saturation |
| **Proporção** | 3:4 (portrait) |
| **Resolução recomendada** | 1800 × 2400 px (min. 900 × 1200), JPG q80–85, < 250 KB |
| **Recortes** | Shown at 3:4 on desktop and as a 72 %-width swipe card on mobile. |

**Prompt (copiar e colar):**

```text
Elegant editorial photograph of a Dumbo Ear Betta, very large pectoral fins held out like wings, whole fish visible in side view, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Colour accent around #8f9fe0. Portrait 3:4, centred composition that clearly shows the characteristic silhouette of the variety. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/varieties/lb-variety-veiltail.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção "Comprar por variedade" (Veiltail) |
| **Assunto** | Veiltail Betta, long drooping veil-like tail. Representative example, not tied to a product in stock. |
| **Composição** | Fish centred, silhouette of the variety clearly readable (this image teaches the variety shape). Slightly more headroom at the bottom, where nothing is overlaid. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key with a gentle rim light; calm and consistent across all six variety images. |
| **Paleta** | Dark aquatic background; fish colour near #d98b4f with restrained saturation |
| **Proporção** | 3:4 (portrait) |
| **Resolução recomendada** | 1800 × 2400 px (min. 900 × 1200), JPG q80–85, < 250 KB |
| **Recortes** | Shown at 3:4 on desktop and as a 72 %-width swipe card on mobile. |

**Prompt (copiar e colar):**

```text
Elegant editorial photograph of a Veiltail Betta, long drooping veil-like tail, whole fish visible in side view, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Colour accent around #d98b4f. Portrait 3:4, centred composition that clearly shows the characteristic silhouette of the variety. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/varieties/lb-variety-double-tail.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção "Comprar por variedade" (Double Tail) |
| **Assunto** | Double Tail Betta, tail split into two lobes with a broad dorsal fin. Representative example, not tied to a product in stock. |
| **Composição** | Fish centred, silhouette of the variety clearly readable (this image teaches the variety shape). Slightly more headroom at the bottom, where nothing is overlaid. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft upper-left key with a gentle rim light; calm and consistent across all six variety images. |
| **Paleta** | Dark aquatic background; fish colour near #b3283d with restrained saturation |
| **Proporção** | 3:4 (portrait) |
| **Resolução recomendada** | 1800 × 2400 px (min. 900 × 1200), JPG q80–85, < 250 KB |
| **Recortes** | Shown at 3:4 on desktop and as a 72 %-width swipe card on mobile. |

**Prompt (copiar e colar):**

```text
Elegant editorial photograph of a Double Tail Betta, tail split into two lobes with a broad dorsal fin, whole fish visible in side view, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Colour accent around #b3283d. Portrait 3:4, centred composition that clearly shows the characteristic silhouette of the variety. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

## 4 · Editorial

### `assets/images/editorial/lb-editorial-brand-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção A (a marca), com parallax e máscara |
| **Assunto** | Macro of Betta scales and fin edge in teal and copper, abstract and tactile. |
| **Composição** | Diagonal composition, soft focus fall-off, 60 % dark negative space. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Raking light revealing scale texture. |
| **Paleta** | Aquatic Teal #3A8582, Subtle Copper #B77A53, Abyss Black |
| **Proporção** | 4:5 (portrait; shown at 4:5 desktop and 4:3 tablet) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1200 × 1500), < 300 KB |
| **Recortes** | Keep detail within the central 80 %; parallax moves the image ±6 % vertically. |

**Prompt (copiar e colar):**

```text
Abstract macro photograph of Betta fish scales and the translucent edge of a fin, teal body fading into copper fin tips, diagonal composition with a lot of dark negative space. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Portrait 4:5. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/editorial/lb-editorial-experience-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — secção D (A experiência LOROSAE) |
| **Assunto** | A copper-orange Betta side-lit, calm and sculptural, with part of the fin lost in shadow. |
| **Composição** | Fish in the lower two-thirds, upper third dark; sticky image on desktop (3:4 crop). |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Strong single side light, low-key. |
| **Paleta** | Subtle Copper #B77A53, Abyss Black, hint of Aquatic Teal |
| **Proporção** | 4:5 (shown at 3:4 and 16:10) |
| **Resolução recomendada** | 2000 × 2500 px (min. 1200 × 1500), < 300 KB |
| **Recortes** | Safe area: central 70 %. |

**Prompt (copiar e colar):**

```text
Low-key editorial photograph of a copper-orange Betta fish lit from one side, half of its fins dissolving into shadow, sculptural and calm, swimming in dark water. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Portrait 4:5. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/editorial/lb-editorial-cta-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Home — CTA final (fundo, com sobreposição escura) |
| **Assunto** | Soft abstract underwater light — caustics and light shafts with a faint trace of fin movement; no sharp subject. |
| **Composição** | Centre kept dark and quiet for centred text. |
| **Fundo** | Deep teal-black water. |
| **Iluminação** | Diffuse light shafts from the top. |
| **Paleta** | Aquatic Teal, Deep Ocean, Abyss Black |
| **Proporção** | 16:10 |
| **Resolução recomendada** | 2400 × 1500 px (min. 1600 × 1000), < 250 KB |
| **Recortes** | Heavily overlaid with a dark radial gradient — it only needs to feel like water. |

**Prompt (copiar e colar):**

```text
Atmospheric underwater photograph, deep teal-black water with soft light shafts and faint caustic ripples from above, a barely visible silhouette of a Betta fin dissolving at one corner, large calm dark centre. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. No text, no logos, no watermark, no sharp subject in the centre. 16:10.
```

### `assets/images/og-lorosae-betta.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Metadados Open Graph (partilha em redes sociais) |
| **Assunto** | Hero crop of the brand: fish on the right, dark empty left side. |
| **Composição** | Derived from lb-hero-betta-01.jpg; fish within the central 60 %. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Same as hero. |
| **Paleta** | Brand palette |
| **Proporção** | 1.91:1 |
| **Resolução recomendada** | 1200 × 630 px, JPG, < 200 KB |
| **Recortes** | Crop the hero; do not add text unless a final brand lock-up exists. |

**Prompt (copiar e colar):**

```text
No new generation needed: crop and export from lb-hero-betta-01.jpg at 1200 × 630.
```

## 5 · Cuidados (RESERVADO — ainda não usado nos modelos)

### `assets/images/care/lb-care-aquarium-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Reservado para a página do guia de cuidados (não colocado nos modelos atuais) |
| **Assunto** | A minimalist planted aquarium, dark substrate, a few broad leaves, one small Betta in the distance, gentle filter flow. |
| **Composição** | Calm, minimal, a lot of negative space. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft, natural, low-key. |
| **Paleta** | Brand palette |
| **Proporção** | 1:1 |
| **Resolução recomendada** | 1600 × 1600 px, < 200 KB |
| **Recortes** | Square; also usable at 4:3. |

**Prompt (copiar e colar):**

```text
Minimal editorial photograph: A minimalist planted aquarium, dark substrate, a few broad leaves, one small Betta in the distance, gentle filter flow. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Square 1:1. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/care/lb-care-water-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Reservado para a página do guia de cuidados (não colocado nos modelos atuais) |
| **Assunto** | Water-quality macro: a glass of crystal-clear water with a test vial against a dark background, droplets catching light. |
| **Composição** | Calm, minimal, a lot of negative space. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft, natural, low-key. |
| **Paleta** | Brand palette |
| **Proporção** | 1:1 |
| **Resolução recomendada** | 1600 × 1600 px, < 200 KB |
| **Recortes** | Square; also usable at 4:3. |

**Prompt (copiar e colar):**

```text
Minimal editorial photograph: Water-quality macro: a glass of crystal-clear water with a test vial against a dark background, droplets catching light. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Square 1:1. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```

### `assets/images/care/lb-care-acclimatisation-01.jpg`

| Campo | Valor |
|---|---|
| **Onde aparece** | Reservado para a página do guia de cuidados (não colocado nos modelos atuais) |
| **Assunto** | A sealed transport bag floating gently at the surface of a dark aquarium, soft light, no hands. |
| **Composição** | Calm, minimal, a lot of negative space. |
| **Fundo** | Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. |
| **Iluminação** | Soft, natural, low-key. |
| **Paleta** | Brand palette |
| **Proporção** | 1:1 |
| **Resolução recomendada** | 1600 × 1600 px, < 200 KB |
| **Recortes** | Square; also usable at 4:3. |

**Prompt (copiar e colar):**

```text
Minimal editorial photograph: A sealed transport bag floating gently at the surface of a dark aquarium, soft light, no hands. Deep near-black teal aquatic background (#071114 fading to #0B2027), smooth falloff, no visible tank walls. Photorealistic premium editorial aquatic photography, macro lens look (100 mm), shallow depth of field with the eye and nearest scales tack-sharp, a single soft key light from the upper left producing controlled specular highlights, faint caustic light ripples, a few tiny suspended particles for depth, rich believable colour with restrained saturation, natural water reflections. Square 1:1. No text, no letters, no logos, no watermark, no signature, no human hands, no other fish, no aquarium decorations, no cartoon or 3D-render look, no CGI gloss, no oversaturated neon colours, no extra or distorted fins.
```
