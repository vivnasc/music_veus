# GitHub Actions

## render-short.yml

Renderiza um lyric-video short 9:16 30s server-side. Despoletado pelo
botão **"Renderizar Short no GitHub Actions"** em `/admin/venna` ou
`/admin/nova`.

### Setup uma vez

#### 1. Secrets do repositório (GitHub Settings → Secrets → Actions)

| Nome | Valor |
|------|-------|
| `SUPABASE_URL` | mesmo valor que `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role (NÃO a anon key) — bucket "social" precisa de write |

#### 2. Bucket Supabase

No dashboard Supabase, cria bucket público com nome **`social`**.
- Public: ON (Metricool e o admin precisam de URL acessível)
- Sem RLS, ou política que permita o service role escrever

#### 3. Env do Next.js (Vercel ou local `.env.local`)

| Nome | Valor |
|------|-------|
| `GITHUB_DISPATCH_TOKEN` | PAT clássico ou fine-grained com scope `actions: write` no repo |
| `GITHUB_REPO_OWNER` | `vivnasc` (default) |
| `GITHUB_REPO_NAME` | `music_veus` (default) |

Como criar o PAT:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Fine-grained tokens → Generate new
3. Repository access: só `vivnasc/music_veus`
4. Permissions: `Actions: read and write`, `Metadata: read`
5. Copia o token e cola em `.env.local` ou nas env vars da Vercel

### Como funciona

1. Carregas o botão no admin
2. Admin POST a `/api/admin/render-short` com `{ brand, albumSlug, trackNumber, startSec, durationSec }`
3. API route chama `POST /repos/.../actions/workflows/render-short.yml/dispatches`
4. GitHub Actions inicia o workflow:
   - Checkout do repo
   - Setup Node + ffmpeg (apt)
   - `npm ci`
   - `npx tsx scripts/render-short-server.ts` (env tem inputs + secrets)
5. O script:
   - Resolve URLs do MP3 + capa no Supabase
   - Download para `.render-input/`
   - `ffmpeg` recorta 30s do MP3
   - Constrói ASS subtitles auto-distribuídos pela duração
   - `ffmpeg` compose: cover scaled+cropped 1080×1920 + zoompan Ken-Burns + dim overlay + showwaves waveform + ASS burn-in + AAC audio
   - Output em `.render-output/<brand>-<slug>-faixa-NN-short.mp4`
   - Upload para Supabase `social/<brand>/<filename>`
6. Tens MP4 pronto a referenciar no YAML do `npm run weekly`

### Tempo médio

Cada render demora ~3-5 min no GitHub Actions (sem optimização). Os
recursos free dão para uns 100+ renders/mês — VENNA + NNOVVA com cadência
diária dão 14 renders/sem = 56/mês, dentro do generoso.

### Debugging

Cada run guarda os ficheiros intermédios em **artifact** chamado
`short-<brand>-<slug>-faixa-NN` (download via UI dos Actions, retém 7
dias). Inclui o MP4 final. Útil para ver erros de subtítulos ou
filtros antes de chegar ao Supabase.
