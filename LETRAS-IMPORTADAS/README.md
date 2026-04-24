# LETRAS-IMPORTADAS — fonte de verdade

Os `.md` desta pasta são a **fonte humana** das letras dos álbuns. Tudo o que
está aqui é versionado em git e nunca se perde por ação na UI.

## Fluxo

```
┌──────────────────────┐    script    ┌────────────────────────────┐
│ LETRAS-IMPORTADAS/   │ ───────────▶ │ music-app/src/data/        │
│   pele-*-letras.md   │              │   lyrics-importadas.ts     │
└──────────────────────┘              └────────────────────────────┘
             ▲                                       │
             │                                       ▼
        editar aqui                          ALL_LYRICS em albums.ts
        + git commit                                 │
                                                     ▼
                                    ┌────────────────────────────┐
                                    │ App pública (music player) │
                                    │  track.lyrics ← código     │
                                    └────────────────────────────┘
                                                     ▲
                                                     │ OVERRIDE opcional
                                                     │
                                    ┌────────────────────────────┐
                                    │ track_custom_lyrics        │
                                    │ (Supabase — edições UI)    │
                                    └────────────────────────────┘
```

**Regra de ouro**: o código é autoritativo. Apagar no editor da UI **não**
apaga a letra do código — apenas remove o override. O app público volta
automaticamente à letra do `.md`/`.ts`.

## Como adicionar ou editar letras

1. Edita/cria um `.md` aqui em `LETRAS-IMPORTADAS/` no formato abaixo.
2. Se for ficheiro novo, regista o mapping em
   `music-app/scripts/build-imported-lyrics.ts` (constante `MD_TO_SLUG`).
3. Corre o gerador:
   ```bash
   cd music-app
   npx tsx scripts/build-imported-lyrics.ts
   ```
4. Commit de `LETRAS-IMPORTADAS/*.md` **e** de
   `music-app/src/data/lyrics-importadas.ts` (o ficheiro gerado).

## Formato do `.md`

```
# Título do Álbum
**Subtítulo curto.**
*Loranne — Véus*

---

## 01. Título da Faixa
*Descrição curta*
Energia: whisper | Língua: PT | Sabor: bossa

[Verse 1]
...texto da letra...

[Chorus]
...texto da letra...

---

## 02. Próxima Faixa
...
```

O parser:
- Corta por `## NN. Título`.
- Salta a linha de descrição em itálico + linha de metadata.
- Colecciona tudo até ao `---` seguinte.
- Ignora secções com `*(letra em falta)*`.

## Recuperação

Se uma letra sumir da UI, verifica por esta ordem:

1. **Código** (`music-app/src/data/lyrics-importadas.ts` ou outros
   `lyrics-*.ts`) — se está aqui, está segura.
2. **LETRAS-IMPORTADAS/*.md** — a fonte humana; basta regenerar o TS.
3. **Supabase `track_custom_lyrics`** — overrides feitos na UI.
4. **localStorage** (`veus:lyrics-cache-v1`) — backup automático do browser.
5. **Suno history** — se a letra foi usada para gerar áudio.
