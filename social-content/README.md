# social-content/

Pipeline semanal de conteúdo social para **VENNA** e **NNOVVA**.

> Loranne e Ancient Ground têm o pipeline próprio no Repo A (Escola dos Véus).

## Como funciona

Cada sexta-feira:

1. Crias `social-content/semana-NN/` (ex: `semana-19/`)
2. Drops os MP4 da semana em `semana-NN/<brand>/`
3. Crias `semana-NN/<brand>.yaml` com o plano (data, hora, plataformas, caption ou trackSlug)
4. Corres `cd music-app && npm run weekly -- --semana 19`
5. Sai um ZIP por marca em `social-content/output/semana-19/<brand>-week-19.zip`
6. Dentro do ZIP: `metricool-import.csv` (pronto a importar) + `posts.csv` (formato genérico)
7. Upload do CSV no Metricool: Planner → 3 dots → Import CSV

## Estrutura de pastas

```
social-content/
├── semana-19/
│   ├── venna.yaml
│   ├── venna/
│   │   ├── 2026-05-12-honey-hour-clip.mp4
│   │   ├── 2026-05-13-skin-teaser.mp4
│   │   └── …
│   ├── nnovva.yaml
│   └── nnovva/
│       └── …
├── output/                       # gerado pelo CLI (gitignored)
│   └── semana-19/
│       ├── venna-week-19.zip
│       └── nnovva-week-19.zip
└── _examples/
    └── venna.yaml                # ficheiro de exemplo
```

## Schema YAML

Vê `_examples/venna.yaml` para um exemplo completo. Campos essenciais por post:

```yaml
brand: venna                       # tem de bater certo com o nome do .yaml
posts:
  - date: 2026-05-12               # YYYY-MM-DD
    time: "18:00"                  # HH:MM (24h)
    video: 2026-05-12-clip.mp4     # filename em /semana-19/venna/
    platforms: [tiktok, instagram, youtube]
    trackSlug: venna-mango-hour-faixa-01    # opcional — gera caption auto
    # caption: "..."               # override total (opcional)
    # hashtags: [extra1, extra2]   # extras à parte das de marca
    # videoUrl: https://...        # se já tens o vídeo hosted, skipa upload
```

## Setup uma vez

### Variáveis de ambiente

Em `music-app/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # NÃO uses a anon key
```

### Bucket Supabase

Cria no dashboard Supabase:
- bucket nome: **social**
- visibilidade: **público** (Metricool precisa de URL público)
- sem RLS, ou política que permita service role escrever

## Comandos

```bash
# Pipeline completo da semana 19, ambas as marcas
cd music-app && npm run weekly -- --semana 19

# Só uma marca
cd music-app && npm run weekly -- --semana 19 --brand venna

# Sem upload (só gera o CSV com paths locais — útil para inspecção)
cd music-app && npm run weekly -- --semana 19 --skip-upload
```

## Cadência sugerida

| Marca       | Posts/semana | Plataformas |
|-------------|--------------|-------------|
| VENNA       | 7            | TikTok, IG, YT Shorts |
| NNOVVA      | 7            | TikTok, IG, YT Shorts |

O CLI avisa se a cadência ficar abaixo do mínimo, mas continua a processar.

## Notas Metricool

- **Formato suportado** — Premium plan (Excel/CSV bulk import)
- **Picture Url** aceita URLs públicos do Supabase (config feita), Drive ou Dropbox
- **Brand Name** distingue a marca dentro da conta Metricool — útil se tens VENNA e NNOVVA na mesma conta
- **Datas** — Metricool pergunta o formato no upload; usa **YYYY-MM-DD**

## Caption auto-gerada (com `trackSlug`)

Se passares `trackSlug: venna-mango-hour-faixa-01`, o CLI gera:

```
"Body on body, the night's a flower"

Honey Hour — out now

#venna #melodichouse #dancepop #popmusic #newmusic #electronicpop
```

Se quiseres caption diferente, usa `caption:` directamente. Hashtags da marca são sempre adicionadas (a não ser que já estejam no caption).
