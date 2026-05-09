# ELEVAR — Upload-ready JSON files

5 ficheiros JSON com os 5 álbuns Elevar (Acende, Coro, Milagre, Amen, Aleluia),
prontos para upload via API `/api/admin/albums-db`.

## Conteúdo por ficheiro

| Ficheiro | Slug | Tracks | Tamanho |
|---|---|---|---|
| `acende.json`  | incenso-acende  | 10 | 34 KB |
| `coro.json`    | incenso-coro    | 10 | 33 KB |
| `milagre.json` | incenso-milagre | 10 | 34 KB |
| `amen.json`    | incenso-amen    | 10 | 33 KB |
| `aleluia.json` | incenso-aleluia | 10 | 34 KB |
| `ALL.json`     | (array com os 5)| 50 | 172 KB |

## Schema

Cada ficheiro segue o `AlbumInput` em `POST /api/admin/albums-db`:

```json
{
  "slug": "incenso-acende",
  "title": "Acende",
  "subtitle": "...",
  "color": "#FFB347",
  "artist": { "slug": "loranne", "name": "Loranne", "bio": "...", "photo_url": "..." },
  "collection": "incenso",
  "published": false,
  "status": "draft",
  "distribution": false,
  "distrokid_upload_date": null,
  "tracks": [
    {
      "number": 1,
      "title": "Pequena Chama",
      "description": "A luz mais pequena que sobreviveu...",
      "lang": "PT",
      "energy": "whisper",
      "flavor": "gospel",
      "vocal_mode": "solo",
      "prompt": "Contemporary organic-electronic... 70 BPM, signature element: ...",
      "lyrics": "[Vocal: ...]\n[CRITICAL: ...]\n[Persona: Loranne...]\n\n[Intro: ...]\n...",
      "duration_seconds": 240,
      "audio_url": null,
      "published": false,
      "key_verse": "Não me apaguei toda. / Repara: ainda há fogo aqui dentro.",
      "suno_prompt": "Style: gospel ambient · ...",
      "mood_secondary": null,
      "bpm": 70
    }
  ]
}
```

## Upload

### Um álbum de cada vez (recomendado para validar)

```bash
curl -X POST https://teu-app.vercel.app/api/admin/albums-db \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  --data @acende.json
```

### Os 5 em sequência

```bash
for f in acende coro milagre amen aleluia; do
  echo "Uploading $f..."
  curl -X POST https://teu-app.vercel.app/api/admin/albums-db \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    --data @${f}.json
  sleep 1
done
```

### `ALL.json` (array) — se tiveres bulk endpoint

Apenas se criares um endpoint que aceite array. Por defeito o
`/api/admin/albums-db` aceita 1 album por POST.

## Notas

- Campos `key_verse`, `suno_prompt`, `mood_secondary`, `bpm` são EXTRAS — não estão
  no schema base mas vão na payload. Se a tua tabela `tracks_db` não tiver essas
  colunas, o Postgres ignora silenciosamente OU dá erro consoante a config.
  Verifica antes de fazer push em massa.
- O endpoint faz **upsert** por slug — re-uploadar substitui (delete tracks +
  insert novos). Seguro de re-correr.
- Persona Loranne (voice id `a8ad18d5-d23e-4c97-ad68-1006de7ac76d`) já vai
  embebida no `lyrics` de cada track via wrapper `[Persona: Loranne...]`.
- Renomes aplicados:
  - Acende/5 Volta → **Voltei**
  - Amen/7 Pousar → **Não Atirei**
  - Amen/9 Sim → **O Sim Pequeno**

## Geração

Estes ficheiros foram gerados a partir dos PDFs em `LORANNE/May26/*.pdf`.
Script: `tools/generate_uploads.py` (não versionado — vivem em `/tmp` neste branch
mas posso committar se quiseres reproduzir).
