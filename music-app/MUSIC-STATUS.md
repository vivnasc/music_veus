# Veus by Loranne — Music App Status

**Ultima actualizacao:** 2026-04-10
**Actualizado por:** Claude Code

---

## Resumo da Sessao 2026-04-10

### Identidade Visual Loranne — DEFINIDA
- Loranne é reconhecida por **silhueta + véu + tons dourados**, NUNCA por feições faciais
- Rosto SEMPRE escondido, raça NUNCA definida
- Consistência = conceito visual, não uma cara

### LoRA Training — RECONFIGURADO
- **Problema**: `flux-lora-portrait-trainer` aprendia rostos → gerava caras aleatórias de mulheres
- **Solução**: Migrado para `flux-lora-fast-training` (concept/style LoRA, `is_style: true`)
- **Estado**: Código pronto, create-zip fix deployed, **treino pendente** (utilizadora precisa clicar "Treinar LoRA")
- Endpoints: `/api/admin/lora/create-zip`, `/api/admin/lora/train`, `/api/admin/lora/status`
- Config ativa: `audios/lora/active-lora.json` no Supabase

### Shorts Pipeline (Produção) — 30 SEGUNDOS
- 4 imagens AI (fal.ai) + 2 poses Loranne = 6 clips
- 6 clips × 5s = 30 segundos via Runway Gen-4 + Shotstack
- Minimum 4 clips required
- Prompt: cena PRIMEIRO, identidade concisa depois

### Calendar Reels — RESTAURADO
- Voltou a usar `generateReel()` (cover + áudio, canvas-based)
- Shorts pipeline removida do calendário (estava a misturar as duas)

### LoRA Admin Page — MELHORADA
- 27 imagens curadas pré-selecionadas (BEST_FOR_TRAINING)
- Download individual: PC e/ou Supabase
- Selecção por checkbox de imagens geradas
- Quick prompts para estética faceless

### Create-ZIP Fix
- Problema: Vercel não consegue fetch das próprias URLs (self-referencing)
- Fix: filesystem fallback (`readFile` de `public/`) + HTTP fetch robusto com timeout 30s
- Fallback URL construction from request host header

---

## Resumo da Sessao 2026-03-27

### Romance Collection — COMPLETA
- 5 albums, 50 tracks com letras:
  - **Pele** (cosmic-romance) — 10 tracks, letras existentes
  - **Carta** (romance-carta) — 10 tracks, letras novas
  - **Saudade** (romance-saudade) — 10 tracks, letras novas
  - **Fogo Lento** (romance-fogo-lento) — 10 tracks, letras novas
  - **Ninho** (romance-ninho) — 10 tracks, letras novas
- Album defs restaurados para os originais (titulos especificos, cosmicPrompt)
- Letras reescritas para os titulos originais (A Gaveta, Phantom, Antes do Beijo, Chaves, etc.)
- Revisao de acentuacao e rimas forcadas feita

### Player (FullPlayer) — MELHORADO
- 3 tabs ao estilo Apple Music: Capa / Letra / Fila
- Letras sincronizadas com o tempo (buildSyncedLyrics engine)
- Auto-scroll para a linha actual
- Blur da capa como fundo dinamico
- Capa da track via Supabase (probe .jpg/.png/.webp)
- Fallback para poses Loranne quando nao ha capa
- Botao "Partilhar" visivel nos controlos
- Capa grande (80vw) com glow animado

### Capas das Tracks
- Stream route `/api/music/stream?type=cover` serve covers em qualquer formato
- Capas do Pollinations (.jpg) detectadas e servidas
- Capas do Suno guardadas na aprovacao (CORS fix aplicado — proxy fallback)
- FullPlayer e PartilhaClient fazem probe para capa da track

### Partilha / SEO
- Short URLs: `music.seteveus.space/o/pele-7` (sem redirect, OG metadata directo)
- OG image dinamico via `/api/og` (1200x630, titulo, frase do dia, cor do album)
- Preview de 45 segundos na pagina de partilha
- CTA: "Isto foi apenas um fragmento" → "Ouvir a faixa completa"
- ShareModal: texto limpo, sem URL no corpo da mensagem
- Botao de share visivel no TrackRow e FullPlayer

### Producao (Admin)
- Modelo Suno default: V5 (V5.5 ainda nao disponivel no API.box)
- CORS fix na aprovacao: covers do Suno agora guardadas via proxy fallback
- Selector de modelo inclui V5.5 (para quando API.box suportar)
- **Persona support implementado:**
  - API: `POST /api/admin/suno/persona` — cria persona a partir de clip gerado
  - Generate API: aceita `personaId` + `personaModel: "voice_persona"`
  - UI: campo de persona no header da producao + botao "Criar Persona" em cada clip
  - Fluxo: gerar track → ouvir → "Criar Persona" → personaId preenchido automaticamente → futuras geracoes usam essa voz

---

## Estado dos Albums

### Coleccoes com letras completas (531/531)
| Coleccao | Albums | Tracks | Letras |
|----------|--------|--------|--------|
| Espelhos | 7 | 49 | 49 |
| Nos | 7 | 35 | 35 |
| Espiritual | 10 | 104 | 104 |
| Cursos | 20+ | 91 | 91 |
| Vida | 14 | 142 | 142 |
| Cosmic | 6 | 60 | 60 |
| Romance | 5 | 50 | 50 |

### Audio gerado
- 45 tracks aprovadas com audio no Supabase
- Maioria do album Pele (cosmic-romance) + Espelhos
- 8 versoes alternativas guardadas

### Capas
- 45 tracks com capas Pollinations (.jpg) no Supabase
- Capas de texto (.png) geradas e apagadas (nao eram reais)
- Futuras aprovacoes guardam capa do Suno automaticamente

---

## Decisao: Aguardar V5.5 no API.box

**Contexto:** Suno V5.5 lancado a 26 Março 2026. Traz Voices/Personas melhoradas.
**Estado:** API.box (apibox.erweima.ai) ainda suporta ate V5. V5.5 pendente.
**Accao:** Vivianne contactou suporte API.box via Telegram. Aguarda resposta.
**Entretanto:** Vivianne experimenta V5.5 directamente na app do Suno.

### Porque aguardar
- Sotaque vocal: V5 gera sotaque portugues europeu, nao mocambicano
- Persona/Voice: permite fixar identidade vocal da Loranne
- Qualidade: V5.5 promete melhor expressividade
- Nao vale a pena gerar 500+ tracks com V5 se V5.5 melhora significativamente

### Quando V5.5 estiver disponivel
1. Vivianne escolhe a track com a melhor voz da Loranne (do Suno app)
2. Criar Persona via API (`POST /api/v1/generate/generate-persona`)
3. Integrar `personaId` + `personaModel: "voice_persona"` na producao
4. Re-gerar todas as tracks com identidade vocal consistente

---

## Proximas Accoes

### Imediato — LoRA e Identidade Visual
1. **Treinar LoRA** com concept trainer (flux-lora-fast-training) — clicar "Treinar LoRA" no admin
2. Testar imagens geradas com nova LoRA — verificar que NÃO mostra rosto
3. Se LoRA ok: criar short para track 9 "O Espelho" (livro-filosofico, faixa-09)
4. Se LoRA falhar no Vercel (create-zip): alternativa = upload imagens para Supabase primeiro, depois passar URLs do Supabase

### Imediato (quando V5.5 disponivel no API.box)
1. ~~Adicionar suporte a Persona na pagina de producao~~ FEITO
2. Criar Persona da Loranne a partir da melhor track
3. Testar geracao com persona + V5.5
4. Se aprovado, re-gerar catalogo completo

### Player
- ~~Letras sincronizadas~~ FEITO (buildSyncedLyrics engine)
- ~~Blur de fundo da capa~~ FEITO
- ~~3 tabs (Capa/Letra/Fila)~~ FEITO
- ~~Glow na linha activa~~ FEITO
- Testar covers do Suno em novas aprovacoes
- Verificar partilha WhatsApp com dominio de producao

### Pendente (nao urgente)
- Tabela `track_custom_lyrics` no Supabase
- Bug do MiniPlayer com duracao em streams do Suno CDN
- Marrabenta como flavor — testar se Suno gera ritmo correcto

---

## Ficheiros Chave (music-app)

| Ficheiro | Contem |
|----------|--------|
| `src/data/albums.ts` | Definicoes de todos os albums e tracks (78 albums, 531 tracks) |
| `src/data/lyrics-romance.ts` | Letras Romance (50 tracks) |
| `src/data/lyrics-cosmic.ts` | Letras Cosmic (60 tracks) |
| `src/data/lyrics-vida.ts` | Letras Vida (142 tracks) |
| `src/data/lyrics-espirituais.ts` | Letras Espirituais (104 tracks) |
| `src/data/lyrics-espelhos.ts` | Letras Espelhos (49 tracks) |
| `src/data/lyrics-nos.ts` | Letras Nos (35 tracks) |
| `src/data/lyrics-livro-cursos.ts` | Letras Livro + Cursos (91 tracks) |
| `src/components/music/FullPlayer.tsx` | Player principal (3 tabs, letras sync) |
| `src/components/music/ShareModal.tsx` | Modal de partilha |
| `src/app/o/[code]/page.tsx` | Short URL com OG metadata |
| `src/app/partilha/[albumSlug]/[faixa]/` | Pagina de partilha (45s preview) |
| `src/app/api/music/stream/route.ts` | Streaming audio + covers |
| `src/app/api/og/route.tsx` | OG image dinamico |
| `src/app/admin/producao/page.tsx` | Pagina de producao (gerar, aprovar) |
| `src/app/api/admin/suno/generate/route.ts` | API de geracao Suno (aceita personaId) |
| `src/app/api/admin/suno/persona/route.ts` | API de criacao de Persona |
| `src/lib/album-covers.ts` | Capas albums + tracks |
| `src/lib/share-utils.ts` | Short URLs + parse |
| `src/app/admin/lora/page.tsx` | Admin LoRA training (27 imagens curadas, download) |
| `src/app/api/admin/lora/create-zip/route.ts` | Criar ZIP para treino LoRA |
| `src/app/api/admin/lora/train/route.ts` | Iniciar treino LoRA (fal.ai) |
| `src/app/api/admin/lora/status/route.ts` | Polling status treino LoRA |
| `src/app/api/admin/generate-verse-reel/route.ts` | Gerar imagens AI (flux-lora / flux-pro) |
| `src/app/admin/calendario/page.tsx` | Calendário social (reels com cover) |
| `src/lib/reel-generator.ts` | generateReel() — canvas-based reel |
