# Capas Presença — prompts Midjourney

Sete capas, uma por sub-coleção. Cada uma deve evocar a função e a tradição da sub sem as nomear directamente — nada de Budas, mandalas, cruzes ou anjos. O olhar é mais editorial-fotográfico do que ilustração espiritual. Aestética moçambicana/africana subtilmente infundida (terra, materiais orgânicos, luz natural).

## Princípios visuais do conjunto

Para as 7 capas funcionarem juntas como família:

- **Formato:** 1024×1024 quadrado (`--ar 1:1`)
- **Sem figuras humanas** (o texto que vai por cima precisa de espaço, e a estética manifesto pede ausência de performance)
- **Sem texto na imagem** (o nome da sub-coleção é sobreposto em branco no app)
- **Terço inferior intencionalmente mais escuro** para acomodar o texto sobreposto
- **Paleta dominante** definida por sub-coleção (ver tabela abaixo) — Midjourney aceita "X palette" no prompt
- **Texturas orgânicas** (terra, água, madeira, fumo, luz) em vez de digital/limpo
- **Luz natural** (alvorada, fim de tarde, hora azul, vela) — nunca neon, nunca estúdio
- **Estilo cinematográfico/editorial** (`--style raw` reduz a estilização Midjourney padrão)
- **Modelo:** `--v 6` ou `--v 7` (V7 é mais coerente em V7 mas pode variar; V6 é mais previsível)

## Truque para coerência entre as 7

Para que as capas pareçam um conjunto e não 7 imagens avulsas:

1. **Gera primeiro a capa de Medo** (a "âncora" do conjunto)
2. **Escolhe a melhor variação** (a que mais te agrada)
3. **Copia o URL dessa imagem** (clica direito → "Copy image link" no Discord)
4. **Cola o URL no início dos outros 6 prompts** como referência de estilo, OU usa `--sref <URL>`

Isto faz com que as outras 6 sub-coleções partilhem a *gramática visual* (textura, luz, tonalidade geral) com Medo. A variação fica só na cor/atmosfera específica de cada sub.

## Tabela de cores e atmosfera

| # | Sub-coleção | Verbo | Cor base | Atmosfera |
|---|---|---|---|---|
| 1 | Medo | Enraizar | umber/burnt sienna | terra antes do amanhecer |
| 2 | Mágoa | Acolher | deep slate blue | água parada que recebe pedra |
| 3 | Apatia | Acender | rust/amber | brasa única no escuro |
| 4 | Inquietação | Clarear | sage grey-green | erva alta com vento, neblina a levantar |
| 5 | Sufoco | Alinhar | muted violet | coluna vertical de luz no escuro |
| 6 | Confusão | Ver | pale gold/pearl | luz dourada através de neblina |
| 7 | Vazio | Pousar | indigo/midnight | céu nocturno antes do sono |

---

## Os 7 prompts

### 1. Medo · Enraizar

```
pre-dawn African earth in deep umber and burnt sienna, ancient root systems just beneath weathered soil surface, single warm shaft of dawn light from upper-right edge, organic ground textures of cracked clay and dry leaves, contemplative cinematic editorial photography, dawn ochre highlights against deep brown shadows, intentionally darker lower foreground for text overlay, Mozambican landscape mood, no figures, no text --ar 1:1 --style raw --v 6
```

**Variações para testar:** "ancestral soil" em vez de "African earth"; "iron-rich red clay" para puxar mais para o vermelho; "single dry branch resting on ground" para um foco compositivo.

### 2. Mágoa · Acolher

```
still pool of dark water meeting weathered river stone, single soft ripple expanding outward, deep slate blue and dove grey palette with hints of muted teal, soft overcast light from above, organic textures of wet stone and water surface, tender melancholic atmosphere, contemplative editorial photography, intentionally darker lower foreground for text overlay, no figures, no text --ar 1:1 --style raw --v 6
```

**Variações:** "single tear-shaped drop suspended above water" para o gesto do choro; "river stones submerged in shallow water" para mais profundidade visual.

### 3. Apatia · Acender

```
single glowing ember nested in deep grey ash, warm orange-amber core radiating into surrounding charcoal darkness, thin spiral of smoke rising into shadow, intimate macro photography, deep umber and rust palette, contemplative meditative mood, ember positioned upper-centre, dark surrounding shadow, intentionally darker lower foreground for text overlay, no figures, no flames, no fire --ar 1:1 --style raw --v 6
```

**Variações:** "single match flame" se quiseres chama em vez de brasa; "morning sun through dust" para uma metáfora mais aberta.

### 4. Inquietação · Clarear

```
tall savanna grass swaying in soft wind at dawn, low morning mist clearing from valley floor, pale sage green and dove grey palette with hints of overcast silver-blue sky, distant horizon barely visible through haze, soft natural light from upper edge, contemplative cinematic landscape photography, intentionally darker lower foreground for text overlay, calm clear atmosphere, no figures, no text --ar 1:1 --style raw --v 6
```

**Variações:** "distant flock of birds dispersing into pale sky" para movimento de pensamentos a soltar; "single feather drifting against mist" para particularidade.

### 5. Sufoco · Alinhar

```
single thin vertical column of warm light through narrow opening in deep violet shadow, gentle smoke rising along the column, muted plum and dusk violet palette with warm amber at light core, intimate contemplative atmosphere, dark surrounding shadow, vertical composition, intentionally darker lower foreground for text overlay, no figures, no candles visible, no architecture --ar 1:1 --style raw --v 6
```

**Variações:** "narrow doorway with warm interior light" se quiseres mais arquitectura subtil; "throat-passage suggested by vertical light shaft" para a imagem da garganta (cuidado: Midjourney pode literalizar — usa só se a primeira versão for muito abstracta).

### 6. Confusão · Ver

```
single shaft of pale gold light cutting through soft fog, suspended dust motes catching the beam, pearlescent grey-cream and antique gold palette, contemplative mystical atmosphere, light angled from upper-left, dim cool surroundings, intimate cinematic editorial photography, intentionally darker lower foreground for text overlay, no figures, no architecture, no buildings --ar 1:1 --style raw --v 6
```

**Variações:** "light through forest canopy with dust suspended" para textura natural; "luminous fog at dawn over still water" para a versão mais aquosa.

### 7. Vazio · Pousar

```
deep night sky in slate blue and indigo with single barely-visible distant point of light, soft dark horizon line at upper third of frame, vast quiet atmosphere, midnight palette with faintest hint of pre-dawn warmth at very bottom edge, contemplative landscape photography, intentionally darker lower foreground for text overlay, restful mood, no figures, no moon, no bright stars, no celestial objects beyond one tiny point --ar 1:1 --style raw --v 6
```

**Variações:** "moonless night over still ocean with horizon line" para mais oceano; "dark blanket folded on dim bed seen from above" se quiseres versão mais doméstica (ligada ao álbum *Travesseiro*).

---

## Negative prompts opcionais

Adiciona `--no` no fim do prompt se aparecerem clichés:

```
--no people, faces, bodies, text, words, letters, lotus, mandala, buddha, cross, angel, halo, om, yoga, chakras, sacred geometry, ornate borders, gold filigree, watermark, signature
```

Exemplo aplicado ao prompt de Medo:

```
pre-dawn African earth ... no figures, no text --ar 1:1 --style raw --v 6 --no people, faces, lotus, mandala, buddha, cross, sacred geometry, watermark
```

## Parâmetros úteis

- `--ar 1:1` — quadrado (obrigatório, é o formato esperado pelo app)
- `--style raw` — reduz a estilização "Midjourney padrão" (mais fotográfico, menos ilustrado)
- `--v 6` ou `--v 7` — modelo (V6 é mais previsível, V7 tem melhor coerência mas é mais experimental)
- `--s 100` a `--s 250` — `--stylize` controla quanto Midjourney "embeleza". Para esta colecção, baixo: `--s 100` ou `--s 50`. Default é 100.
- `--sref <URL>` — referência de estilo de outra imagem (usa para coerência entre as 7)
- `--no <termos>` — negative prompt

## Workflow recomendado

1. Cola o **prompt de Medo** no Discord do Midjourney. Gera 4 variações. Escolhe uma e faz Upscale (U1/U2/U3/U4).
2. **Copia o URL da imagem aprovada** (clica direito → Copy Image Address).
3. Cola esse URL no início de cada um dos outros 6 prompts (não fica como `--sref` formal mas funciona como image-prompt). OU usa `--sref <URL>` explícito.
4. Gera as outras 6 sub-coleções, uma a uma. Faz Upscale na melhor variação de cada.
5. Faz **download de cada imagem em 1024×1024** (Discord serve em PNG/JPG).
6. Vai a `/admin/presenca-capas` e carrega uma a uma.

As capas aparecem em ~1h em todo o app (cache Supabase 3600s):
- `/descobre` (secção Presença, cartão de cada sub)
- `/presenca` (grelha das 7)
- `/presenca/{sub}` (hero da sub-coleção)
- `/presenca/{sub}/{album}` (hero de cada álbum da sub)
- `/album/presenca-{sub}-{album}` (página de player de qualquer álbum dessa sub)

A mesma capa é usada para todos os álbuns dessa sub-coleção (decisão deliberada — a unidade da sub-coleção é o que importa, não a particularidade de cada álbum).
