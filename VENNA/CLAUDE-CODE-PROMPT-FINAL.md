# PROMPT PARA CLAUDE CODE — VENNA na Music App (FINAL)

## Contexto

Adicionar a artista **VENNA** ao ecossistema Sete Ecos da music app, ao lado de Loranne, Ancient Ground, C.Sense e NNOVVA.

VENNA é a primeira artista do ecossistema dedicada a **pop puro entretenimento** — dançável, romântica, alegre. Diferente das outras quatro artistas (que são experimentais, atmosféricas, ancestrais ou conceptuais), VENNA é **comercial e radio-friendly**, desenhada para entrar em playlists pop dançáveis.

## Ficheiros de input (usa apenas estes — ignora versões anteriores)

- `venna-final.json` — dados completos das 5 faixas, prontos para BD
- `VENNA-EP-COMPLETO-5-FAIXAS.md` — referência completa dos prompts Suno (5 faixas, formato NNOVVA)

## Estado actual do EP

- **Honey Hour** (faixa 1) — `status: demo_approved` (já gerada e aprovada no Suno)
- **Golden Hour** (faixa 2) — `status: concept`
- **Slow Down** (faixa 3) — `status: concept`
- **Saturday Skin** (faixa 4) — `status: concept`
- **VENNA** (faixa 5) — `status: concept`

Honey Hour é a **persona seed** — a voz dela vai ser clonada via Suno Persona e usada nas outras 4 faixas para coerência vocal.

## Schema da BD — verificar/adicionar

### Tabela `artists` — adicionar campos se não existirem
- `vocal_signature` JSONB (já presente em outras artistas? se sim, reutilizar)

### Tabela `tracks` — adicionar campos se não existirem
- `signature_element` TEXT (descrição do elemento instrumental único da faixa)
- `suno_style` TEXT (campo style do Suno)
- `suno_lyrics` TEXT (campo lyrics do Suno com tags vocais embutidas)

### Enums
- `artist_type`: adicionar `pop_entertainment` se ainda não existe
- `track_status`: garantir que tem `concept`, `demo_generated`, `demo_approved`, `produced`, `mastered`, `released`

## Tarefas

### 1. Migrations
Criar migrations para os campos/enums acima se faltarem. Não remover nada existente.

### 2. Seed
Inserir dados de `venna-final.json`:
- 1 artista (VENNA)
- 1 release (Mango Hour EP)
- 5 tracks (Honey Hour com `status: demo_approved`, restantes com `status: concept`)

Se já existem tentativas anteriores da VENNA na BD, **substituir** pelos dados de `venna-final.json`. Não duplicar.

### 3. UI — `/artists/venna`
- Hero com paleta VENNA (mango/honey/terracotta/cream)
- Nome em serifa fina
- Tagline bilingue (PT em destaque)
- Bio expansível com toggle PT/EN
- Listagem do EP Mango Hour com 5 faixas
- Cada track mostra: número, título, BPM, mood, signature_element, status badge
- Botão "Ver prompt Suno" abre modal com:
  - Campo Style copiável (botão "Copiar Style")
  - Campo Lyrics copiável (botão "Copiar Lyrics")
- Honey Hour deve aparecer destacada como "Persona Seed Track"

### 4. Dashboard de produção
- Filtro por artista (incluir VENNA)
- Vista Kanban por status
- Permitir actualizar status com 1 clique
- Permitir upload de mp3 quando passa para `demo_generated`/`demo_approved`/`produced`/`mastered`

### 5. Coerência visual
Manter paletas próprias de cada artista. CSS variables que mudam por slug.

## Regras

- Não pedir confirmação a cada passo. Avançar.
- Não fragmentar. Fazer tudo de uma vez.
- Decisões ambíguas: caminho mais simples + comentário no código.
- Commit final: `feat(venna): add VENNA artist with Mango Hour EP, Honey Hour approved`
- No fim: resumo do que foi feito, não código linha a linha.

## Resultado esperado

1. VENNA listada nos artistas com paleta própria
2. `/artists/venna` mostra tudo limpo
3. EP Mango Hour visível com 5 tracks
4. Honey Hour destacada como demo_approved e Persona Seed
5. Outras 4 em concept
6. Dashboard permite gerir produção das faixas restantes

Avança.
