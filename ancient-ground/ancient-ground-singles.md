# Ancient Ground — Guidelines de Singles (DistroKid)

Artista: **Ancient Ground**
Formato: Singles de 1 hora
Distribuição: DistroKid → Spotify, Apple Music, YouTube Music
Total: 49 singles

Cada single = 1 faixa gerada no Suno em loop até 1 hora (3.600 segundos).

---

## Produção de Cada Single

### Passo 1 — Gerar a faixa no Suno
Usar o prompt do single. O Suno gera ~3 minutos.

### Passo 2 — Loop para 1 hora
```bash
ffmpeg -stream_loop -1 -i faixa.mp3 -t 3600 -c copy single_1h.mp3
```

### Passo 3 — Verificar emenda
Se o loop for audível, aplicar crossfade na emenda:
```bash
ffmpeg -i faixa.mp3 -af "afade=t=out:st=170:d=10,afade=t=in:st=0:d=10" faixa_fade.mp3
ffmpeg -stream_loop -1 -i faixa_fade.mp3 -t 3600 -c copy single_1h.mp3
```

### Passo 4 — Upload no DistroKid
- Tipo: Single
- Duração: 1 hora
- Artista: Ancient Ground

---

## 49 Singles

### 1 — Before the Birds
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning
```

### 2 — The Ground Remembers
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning
```

### 3 — First Breath
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
deeply sparse, long silences between notes
```

### 4 — Still Water Rising
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
slowly evolving, barely moving
```

### 5 — What the Light Touches
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with distant kora undertones
```

### 6 — Open Sky
```
Meditative African instrumental, solo kora with slow mbira
undertones, contemplative and grounding, no percussion,
no vocals, warm resonance, gentle harmonic repetition,
introspective mood, timeless and spacious
```

### 7 — The Body Wakes
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like a quiet morning
```

### 8 — No Name for This Hour
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a still midnight
```

### 9 — The Dark That Holds
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a still midnight
```

### 10 — Between Stars
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a still midnight,
deeply sparse, long silences between notes
```

### 11 — Silence Has a Sound
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a still midnight,
slowly evolving, barely moving
```

### 12 — What Sleeps in the Earth
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a still midnight,
with distant kora undertones
```

### 13 — Slow Pulse
```
Meditative African instrumental, kora fingerpicking,
sparse and breathing, long silences, soft overtones,
no drums, no vocals, deeply still, cinematic
```

### 14 — The Night Knows
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like a still midnight
```

### 15 — The Last Hour
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like golden hour dusk
```

### 16 — Fire on the Horizon
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like golden hour dusk
```

### 17 — Threshold
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like golden hour dusk,
with soft balafon echoes
```

### 18 — What the Sun Leaves Behind
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like golden hour dusk
```

### 19 — Amber Stillness
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like golden hour dusk,
slowly evolving, barely moving
```

### 20 — The Day Releases
```
Slow African meditation, balafon and kora duo,
warm and grounding, gentle melodic loops,
no rhythm section, no vocals, earthy resonance,
introspective and healing
```

### 21 — Into the Gold
```
Cinematic African instrumental, kora over soft
ambient drone, slow evolving melody, no beat,
no vocals, vast and contemplative,
emotional depth, transformation theme
```

### 22 — Before Memory
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning
```

### 23 — Root Song
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning,
deeply sparse, long silences between notes
```

### 24 — The Oldest Knowing
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning,
slowly evolving, barely moving
```

### 25 — Ancestral Hum
```
Meditative African instrumental, solo kora with slow mbira
undertones, contemplative and grounding, no percussion,
no vocals, warm resonance, gentle harmonic repetition,
introspective mood, timeless and spacious
```

### 26 — What Was Never Lost
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning,
with gentle thumb piano layers
```

### 27 — The Land Speaks
```
Slow African meditation, balafon and kora duo,
warm and grounding, gentle melodic loops,
no rhythm section, no vocals, earthy resonance,
introspective and healing
```

### 28 — We Were Always Here
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a still midnight
```

### 29 — The String Between Worlds
```
Meditative African instrumental, kora fingerpicking,
sparse and breathing, long silences, soft overtones,
no drums, no vocals, deeply still, cinematic
```

### 30 — Plucked From Silence
```
Meditative African instrumental, solo kora with slow mbira
undertones, contemplative and grounding, no percussion,
no vocals, warm resonance, gentle harmonic repetition,
introspective mood, timeless and spacious
```

### 31 — Resonance
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with distant kora undertones
```

### 32 — What Travels Through Air
```
Meditative African instrumental, kora fingerpicking,
sparse and breathing, long silences, soft overtones,
no drums, no vocals, deeply still, cinematic
```

### 33 — The Invisible Bridge
```
Cinematic African instrumental, kora over soft
ambient drone, slow evolving melody, no beat,
no vocals, vast and contemplative,
emotional depth, transformation theme
```

### 34 — Overtone
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning,
with distant kora undertones
```

### 35 — Where Sound Becomes Light
```
Meditative African instrumental, solo kora with slow mbira
undertones, contemplative and grounding, no percussion,
no vocals, warm resonance, gentle harmonic repetition,
introspective mood, timeless and spacious
```

### 36 — Bones of the Earth
```
Slow African meditation, balafon and kora duo,
warm and grounding, gentle melodic loops,
no rhythm section, no vocals, earthy resonance,
introspective and healing
```

### 37 — Deep Root
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning,
with soft balafon echoes
```

### 38 — The Hollow Resonates
```
Slow African meditation, balafon and kora duo,
warm and grounding, gentle melodic loops,
no rhythm section, no vocals, earthy resonance,
introspective and healing
```

### 39 — Warm Ground
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with soft balafon echoes
```

### 40 — What Holds Us
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
vast and ancient, like a quiet morning,
with gentle thumb piano layers
```

### 41 — Stone Memory
```
Slow African meditation, balafon and kora duo,
warm and grounding, gentle melodic loops,
no rhythm section, no vocals, earthy resonance,
introspective and healing
```

### 42 — The Earth Exhales
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
with soft balafon echoes
```

### 43 — What Remains
```
Cinematic African instrumental, kora over soft
ambient drone, slow evolving melody, no beat,
no vocals, vast and contemplative,
emotional depth, transformation theme
```

### 44 — After the Storm Has No Name
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like a still midnight
```

### 45 — The Shape of Grief
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like a quiet morning,
deeply sparse, long silences between notes
```

### 46 — Still Standing
```
Meditative African instrumental, solo kora with slow mbira
undertones, contemplative and grounding, no percussion,
no vocals, warm resonance, gentle harmonic repetition,
introspective mood, timeless and spacious
```

### 47 — Ember
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
tender and melancholic, like golden hour dusk
```

### 48 — The Quiet After
```
Solo mbira, meditative, hypnotic gentle repetition,
African spiritual atmosphere, no percussion, no vocals,
intimate and spacious, like a quiet morning,
slowly evolving, barely moving
```

### 49 — This Too Is Sacred
```
Cinematic African instrumental, kora over soft
ambient drone, slow evolving melody, no beat,
no vocals, vast and contemplative,
emotional depth, transformation theme
```
