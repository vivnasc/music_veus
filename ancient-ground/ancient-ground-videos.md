# Ancient Ground — Guidelines de Vídeos YouTube

---

## Conceito do Canal

**Nome:** Ancient Ground
**Tagline:** *Music rooted in Africa. Made for stillness.*
**Bio:**
> Meditative African instrumental music for focus, rest and inner quiet.
> Kora. Mbira. Balafon. Ancient sounds for modern stillness.
> New music every week.

**Keywords SEO:** african meditation music, mbira music, kora instrumental, african ambient, study music africa, healing music africa, sleep music africa

---

## Formato de Cada Vídeo

| Parâmetro | Valor |
|---|---|
| Duração final | 1 hora (3.600 segundos) |
| Faixas de áudio | 20 faixas Suno (~3 min cada ≈ 60 min total) |
| Loop de áudio | sem loop — 20 faixas já dão 1 hora |
| Clips de vídeo | 20 clips Runway (15 seg cada = 5 min total) |
| Loop de vídeo | ~12x para atingir 1 hora |
| Crossfade entre clips | 2 segundos — obrigatório |

---

## Prompts de Música para Vídeos (Suno)

Cada vídeo usa 20 faixas geradas com o mesmo prompt — o Suno gera variações naturais a cada geração. Escolher um prompt por vídeo.

**Manhã:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning
```

**Meia-noite:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a still midnight
```

**Entardecer:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like golden hour dusk
```

**Vasta e ancestral:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning
```

**Terna e melancólica:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like a quiet morning
```

**Com kora:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with distant kora undertones
```

**Com balafon:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with soft balafon echoes
```

**Com thumb piano:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with gentle thumb piano layers
```

**Muito esparsa:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
deeply sparse, long silences between notes
```

**Movimento mínimo:**
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
slowly evolving, barely moving
```

**Kora meditativa:**
```
Meditative African instrumental, solo kora with slow mbira
undertones, contemplative and grounding, no percussion,
no vocals, warm resonance, gentle harmonic repetition,
introspective mood, timeless and spacious
```

**Kora etérea:**
```
Meditative African instrumental, kora fingerpicking,
sparse and breathing, long silences, soft overtones,
no drums, no vocals, deeply still, cinematic
```

**Balafon e kora:**
```
Slow African meditation, balafon and kora duo,
warm and grounding, gentle melodic loops,
no rhythm section, no vocals, earthy resonance,
introspective and healing
```

**Cinematográfica:**
```
Cinematic African instrumental, kora over soft
ambient drone, slow evolving melody, no beat,
no vocals, vast and contemplative,
emotional depth, transformation theme
```

---

## Prompts Visuais (Runway)

Cada clip: **15 segundos**, movimento orgânico lento, sem cortes ou zooms bruscos. Footage realista — crossfade longo para não quebrar a imersão.

**Paisagens:**
- Savana ao amanhecer com luz dourada e baobás em silhueta
- Rio africano com reflexo do céu ao pôr do sol
- Baobá solitário sob céu estrelado com via láctea visível
- Capim dourado a ondular suavemente ao vento
- Horizonte da savana com sol a nascer por entre nuvens baixas
- Lago tranquilo ao amanhecer com névoa a dissipar-se

**Texturas e Detalhes:**
- Textura de terra vermelha africana com luz lateral
- Folhas de acácia a filtrar luz dourada
- Raízes de baobá com luz rasante
- Areia fina a mover-se suavemente no deserto
- Pedras antigas cobertas de líquen com luz quente

**Elementos em Movimento:**
- Pássaros em voo lento contra céu alaranjado
- Fumo fino a subir em espiral sobre savana
- Água de rio a correr sobre pedras lisas em câmara lenta
- Nuvens a mover-se lentamente sobre planície africana
- Ervas altas a ondular em campo aberto ao entardecer

---

## Montagem FFmpeg

### Passo 1 — Juntar as 20 faixas
```bash
ffmpeg -i "concat:faixa01.mp3|faixa02.mp3|...|faixa20.mp3" -acodec copy mix.mp3
```

### Passo 2 — Loop do áudio para 1 hora
```bash
ffmpeg -stream_loop -1 -i mix.mp3 -t 3600 -c copy final_audio.mp3
```

### Passo 3 — Concatenar clips com crossfade de 2 segundos
```bash
# offset = n × 13 (15 seg por clip − 2 seg de crossfade)
ffmpeg -i clip01.mp4 -i clip02.mp4 ... -i clip20.mp4 \
  -filter_complex "
    [0][1]xfade=transition=fade:duration=2:offset=13[v01];
    [v01][2]xfade=transition=fade:duration=2:offset=26[v02];
    [v02][3]xfade=transition=fade:duration=2:offset=39[v03];
    ...continua até [v19]
  " -map "[v19]" base_video.mp4
```

### Passo 4 — Vídeo final 1 hora
```bash
ffmpeg -stream_loop -1 -i base_video.mp4 -i final_audio.mp3 \
  -map 0:v -map 1:a -t 3600 \
  -c:v libx264 -c:a aac -b:a 192k \
  ancient_ground_1h.mp4
```

---

## Regras de Qualidade

- Nunca usar percussão
- Nunca usar vocais
- Clips sempre com movimento lento e orgânico
- Crossfade de 2 segundos obrigatório entre todos os clips
- Testar loop antes do export — a emenda não pode ser audível
