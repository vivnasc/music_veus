# Loranne — Regras de Produção Musical

## Quem é a Loranne
- Artista feminina, voz com sotaque português europeu
- Descendente de portugueses em Moçambique — identidade de "mil tons de cinza", nunca preto/branco
- Não está na diáspora — homenageia quem lá está
- Desportista, mãe, neurodivergente (ADHD)
- Tom: quente, íntimo, poético. Nunca coach, nunca terapeuta.

## Regras das Letras

### Estrutura OBRIGATÓRIA (todas as faixas):
```
[Verse 1] (4-8 linhas)
[Verse 2] (4-8 linhas)
[Pre-Chorus] (2-4 linhas — opcional mas recomendado)
[Chorus] (6-10 linhas)
[Verse 3] (4-8 linhas)
[Chorus] (repetição, pode ter variação)
[Bridge] (4-8 linhas)
[Chorus] (final — pode ser mais suave ou com variação)
[Outro] (3-6 linhas)
```

### Qualidade:
- Letras LONGAS — não poupar. Cada secção deve ter substância.
- Rimas naturais, nunca forçadas. Se a rima não funciona, não rimar.
- O sentimento deve aterrar no corpo — não ser abstracto.
- Pre-Chorus cria tensão antes do Chorus.
- O Chorus final pode ser uma versão mais suave ou com linhas novas.
- O Outro é curto mas com peso — as últimas palavras ficam.
- Referência de qualidade: ver as letras expandidas do álbum Frequência (espiritual-frequencia).

### Acentuação:
- SEMPRE acentos correctos em português (é, não, ção, ções, mãe, avó, etc.)
- "é" (verbo ser) vs "e" (conjunção) — NUNCA confundir
- "está" (verbo) vs "esta" (demonstrativo) — NUNCA confundir
- "nós" (pronome sujeito) vs "nos" (pronome objecto) — NUNCA confundir

### Idioma:
- 5 faixas em PT / 5 faixas em EN por álbum
- Português europeu (não brasileiro) — sem "você", usar "tu"
- Inglês natural, não traduzido do português

## Regras dos Prompts Suno

### Voz e produção:
- Voz tem sotaque europeu — NÃO usar folclore moçambicano puro
- Marrabenta usar SEMPRE este prompt que funciona: "Mozambican marrabenta fusion with afro-pop, mid-tempo (100-110 BPM), guitar-driven but smoother groove, inspired by Neyma We Can Love, maintaining rhythmic repetition but with modern soft production"
- O flavor "marrabenta" no código já tem este prompt actualizado
- Flavor label no UI: "Tropical" (não "Marrabenta")

### Energias (usar todas, variar por álbum):
- whisper: íntimo, contemplativo
- steady: médio, grounded, walking pace
- pulse: energético, rítmico
- anthem: declarativo, forte, hino
- raw: cru, emocional, sem filtro

### Sabores (usar todos, variar por álbum):
- organic: o som base Loranne
- marrabenta: fusão moçambicana (ver nota acima)
- afrobeat: afropop groove
- bossa: suave, íntimo, lusófono
- jazz: nocturno, improvisado
- folk: acústico, terroso
- funk: R&B-pop, dancefloor
- house: four-on-the-floor, dance, MUITO usado em desporto e chill
- gospel: coral, espiritual, celebração

### Duetos:
- Com voz masculina: usar `vocalMode: "duet"` — funciona bem no Suno
- Com voz feminina: NÃO fazer dueto — duas vozes femininas não se distinguem no Suno. Usar "layered vocals" ou "community chorus" no prompt em vez disso.

## Tom Geral do Catálogo

### Equilíbrio alvo: 40% leve / 30% contemplativo / 30% pesado
O catálogo original era 60% pesado. Novos álbuns devem compensar com mais:
- Alegria, celebração, dança
- Leveza, humor, tolice
- Esperança, paz, gratidão
- Desporto, corpo em movimento
- House chill, sunset sessions

### O que a Vivianne NÃO quer:
- Folclore africano puro (soa forçado com sotaque europeu)
- Identidade binária (sempre nuance, "mil tons")
- Repetição de temas Vida (já há muitos álbuns contemplativos)
- Letras curtas/genéricas (cada faixa deve ter a profundidade do Frequência)

### O que a Vivianne QUER mais:
- Desporto (corrida, ginásio, natação, futebol, trail)
- House/chill (sunset, poolside, after-workout, driving)
- Alegria pura (riso, dança, comida, praia)
- Neurodivergência (já existe Frequência — expandir)

## Ficheiros Chave
- `music-app/src/data/albums.ts` — definições dos álbuns
- `music-app/src/data/lyrics-*.ts` — letras por colecção
- `music-app/src/data/lyrics-fase1.ts` — letras Fase 1
- `music-app/MUSIC-ROADMAP.md` — plano de 743 → 5000 faixas
- `music-app/MUSIC-PRODUCTION-RULES.md` — ESTE FICHEIRO

## Estado Actual
- ~843 faixas em ~109 álbuns
- Fase 1 completa (10 álbuns, 100 faixas) — MAS letras precisam de expansão
- Próximo: Fase 2 (20 álbuns, 200 faixas) — ver MUSIC-ROADMAP.md
