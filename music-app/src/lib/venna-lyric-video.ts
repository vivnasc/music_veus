"use client";

/**
 * VENNA Lyric Video Pack — gera um ZIP com tudo o que o utilizador precisa
 * para montar um lyric video de UMA cena animada em loop + letra animada
 * por cima (formato moderno, tipo Lyric Lab / Spotify Canvas grande).
 *
 * O que vai no pack:
 *  - audio.mp3 — áudio Suno aprovado, descarregado do Supabase
 *  - lyrics.srt — letra com timing distribuído pelo áudio
 *  - thumbnail.jpg — capa do álbum (para o thumbnail YouTube manual)
 *  - scene-prompt.md — sugestão de prompt Midjourney para a UMA cena
 *    animada deste track, baseada no mood do álbum
 *  - assemble.sh — comando FFmpeg que faz LOOP da scene.mp4 e queima a
 *    letra por cima, alinhada ao áudio
 *  - README.md — workflow passo-a-passo
 *
 * O utilizador:
 *  1. Gera UMA cena animada (Midjourney v7 com motion, Runway Gen-3, Kling,
 *     Pika) usando o prompt sugerido
 *  2. Guarda o MP4 da cena como scene.mp4 nesta pasta
 *  3. Corre `bash assemble.sh`
 *  4. Sai output.mp4 com a cena em loop + letra sincronizada + áudio
 */

import JSZip from "jszip";
import type { AlbumTrack } from "@/data/albums";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";

// ── Lyrics parsing ─────────────────────────────────────────

export function extractSingableLines(lyrics: string): string[] {
  const lines = lyrics.split("\n");
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("[") && line.endsWith("]")) continue;
    if (line.startsWith("(") && line.endsWith(":)")) continue;
    if (line.startsWith("(") && line.endsWith(")")) continue;
    if (/^\.{2,}$/.test(line)) continue;
    out.push(line);
  }
  return out;
}

// ── SRT generation ─────────────────────────────────────────

function pad(n: number, w: number): string {
  return String(n).padStart(w, "0");
}

function fmtSrtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)},${pad(ms, 3)}`;
}

export function generateSRT(lines: string[], durationSeconds: number): string {
  if (lines.length === 0) return "";
  const intro = Math.min(3, durationSeconds * 0.05);
  const outro = Math.min(3, durationSeconds * 0.05);
  const usable = Math.max(durationSeconds - intro - outro, lines.length * 2);
  const perLine = usable / lines.length;

  return lines
    .map((line, i) => {
      const start = intro + i * perLine;
      const end = intro + (i + 1) * perLine - 0.05;
      return `${i + 1}\n${fmtSrtTime(start)} --> ${fmtSrtTime(end)}\n${line}\n`;
    })
    .join("\n");
}

// ── Per-album scene mood (UMA cena por track, não 6-8) ─────

const ALBUM_SCENE_TEMPLATE: Record<string, string> = {
  "venna-mango-hour":
    "rooftop at golden hour, warm honey light pouring across the floor, sheer curtain moving slowly in the breeze, glass of wine catching the light, distant city skyline soft-focus, cinematic 35mm, shallow depth of field, terracotta and honey palette, slow camera drift, loopable",
  "venna-honey-cities":
    "city window at night, warm interior glow, neon sign reflected on a wet street outside, slow tilt down, rain falling softly, cigarette smoke curling, terracotta and honey palette, cinematic 35mm, loopable urban dreamscape",
  "venna-slow-down":
    "neon-lit dance floor seen through a haze, slow swirl of bodies in soft focus, velvet bar lit dim, single martini glass on a counter, slow tracking, terracotta and wine palette, cinematic 35mm, loopable mid-tempo motion",
  "venna-wine-velvet":
    "candlelit restaurant table close-up, two wine glasses half-full, velvet napkin draped, single candle flickering slowly, hand resting on dark wood, soft jazz-club lighting, terracotta and wine palette, cinematic 35mm, loopable intimate hush",
  "venna-saturday-forever":
    "sunlit pool surface rippling, palm shadow moving slow, sunglasses on a tile, melted ice in a glass, summer afternoon haze, mango and honey palette, cinematic 35mm, loopable bright weekend vibe",
  "venna-closer":
    "soft morning bedroom, sheer white curtain breathing in the wind, coffee cup steaming on a wooden bedside, sunlight slanting across rumpled linen, no faces, cream and honey palette, cinematic 35mm, loopable domestic warmth",
  "venna-skin-memory":
    "silk bed sheet rippling slowly, low warm lamp, hand silhouette resting on dark velvet, no faces, dust suspended in a single beam of light, wine and cream palette, cinematic 35mm, loopable sensual moodscape",
  "venna-sunset-club":
    "Mediterranean terrace at sunset, lounge chair empty, glass of rosé sweating, sea horizon hazy in the distance, palm leaf shadow gliding across white wall, sunset pink and honey palette, cinematic 35mm, loopable chill",
  "venna-heart-bassline":
    "stadium lights flaring through a haze of motion, blurred crowd, pulse of color across a wide black space, slow zoom forward, terracotta-orange spotlights, cinematic 35mm, loopable euphoric pop motion",
  "venna-tonight":
    "iconic VENNA wide shot, single spotlight slowly rotating, smoke curling around, stage edge with one microphone, curtain catching warm light, full palette (mango / honey / terracotta / wine / cream), cinematic 35mm, loopable signature scene",
};

function buildScenePrompt(albumSlug: string, trackTitle: string): string {
  const base = ALBUM_SCENE_TEMPLATE[albumSlug] ?? "warm cinematic loopable scene, terracotta and honey palette, cinematic 35mm";
  return `# Scene Prompt — ${trackTitle}

UMA cena animada em loop. Gera num motion-image tool (Midjourney v7 com
\`--motion\`, Runway Gen-3, Kling, Pika) e exporta como \`scene.mp4\`
nesta pasta antes de correr \`assemble.sh\`.

## Sugestão de prompt (Midjourney v7)

\`\`\`
${base}
--cref VENNA_CREF_URL --cw 50 --ar 16:9 --style raw --v 7 --motion low
\`\`\`

## Notas

- **Loopable**: a cena tem de fechar de forma a poder repetir sem corte
  visível. Se a tua tool não exporta loop, pega no MP4 e fecha-o em
  After Effects (Loop Out) ou em \`ffmpeg\` com reverse-pingpong:
  \`ffmpeg -i scene.mp4 -filter_complex "[0]reverse[r];[0][r]concat" loop.mp4\`
- **Sem rosto em movimento intenso** se o álbum for 🔞 — mãos, sombras,
  texturas. YouTube banirá rosto em situação explícita.
- **Aspect ratio 16:9** para canal principal. Se quiseres versão Shorts,
  re-gera em \`--ar 9:16\` e usa o mesmo \`assemble.sh\` com input 9:16.
- **\`--cw 50\`** (character weight 50) deixa a cena ter ambiente e não
  só a Persona; sobe para 100 se queres a Persona explícita na cena.
`;
}

// ── Assemble script ────────────────────────────────────────

function buildAssembleScript(trackTitle: string): string {
  return `#!/bin/bash
# VENNA Lyric Video — ${trackTitle}
# Cena UMA animada em loop + letra burnt-in + áudio
#
# Antes de correr:
#   1. Gera a cena animada (ver scene-prompt.md)
#   2. Guarda como scene.mp4 nesta pasta
#   3. Corre: bash assemble.sh

set -e

if [ ! -f "scene.mp4" ]; then
  echo "ERRO: scene.mp4 não existe. Gera a cena animada primeiro (ver scene-prompt.md)."
  exit 1
fi

OUTPUT="output.mp4"

# -stream_loop -1 = repete a scene.mp4 em loop infinito
# -shortest = pára quando o áudio acabar (a cena loopa até lá)
# subtitles burnt-in com Cormorant Garamond, cream #F4E4D1, outline preto

ffmpeg -y \\
  -stream_loop -1 -i scene.mp4 \\
  -i audio.mp3 \\
  -map 0:v:0 -map 1:a:0 \\
  -vf "subtitles=lyrics.srt:force_style='Fontname=Cormorant Garamond,Fontsize=42,PrimaryColour=&HD1E4F4&,OutlineColour=&H000000&,Outline=2,Shadow=1,Alignment=2,MarginV=80'" \\
  -c:v libx264 -pix_fmt yuv420p -preset medium -crf 19 \\
  -c:a aac -b:a 192k \\
  -shortest \\
  "\\$OUTPUT"

echo "Pronto: \\$OUTPUT"
echo "Edita lyrics.srt se o timing estiver desalinhado e re-corre este script."
`;
}

function buildReadme(trackTitle: string, albumTitle: string, durationSeconds: number, lineCount: number): string {
  return `# VENNA — Lyric Video Pack

**Track:** ${trackTitle}
**Album:** ${albumTitle}
**Audio duration:** ${Math.floor(durationSeconds / 60)}:${pad(Math.floor(durationSeconds % 60), 2)}
**Lyric lines:** ${lineCount}

## Workflow

### 1. Gerar UMA cena animada em loop

Vê \`scene-prompt.md\` neste pack — tem o prompt Midjourney sugerido para
o mood do álbum. Geras a imagem, depois animas (Midjourney v7 motion,
Runway Gen-3, Kling, Pika), exportas como \`scene.mp4\` nesta mesma pasta.

A cena deve ser **loopable** — o início e o fim devem ligar visualmente
sem corte abrupto. Se a tua tool não fizer loop nativo, podes reverse-pingpong
em FFmpeg para forçar continuidade.

### 2. Correr o assembly

\`\`\`bash
bash assemble.sh
\`\`\`

Sai \`output.mp4\` com a cena em loop + letra burnt-in + áudio.

Precisas de ter FFmpeg instalado:
- macOS: \`brew install ffmpeg\`
- Linux: \`sudo apt install ffmpeg\`
- Windows: https://ffmpeg.org/download.html

### 3. Thumbnail YouTube

\`thumbnail.jpg\` (incluído neste pack, é a capa do álbum) serve como
base. Adiciona texto "VENNA — ${trackTitle}" em Playfair Display cream
sobre o canto inferior. Faz upload separado quando publicares no YouTube.

## Sobre o timing da letra

\`lyrics.srt\` tem timing **distribuído uniformemente** pela duração do
áudio (com 3s de intro reservados). Funciona razoavelmente para canções
com cantar contínuo; canções com bridges instrumentais longos vão ficar
desalinhadas.

Para corrigir:

**Manual** (~15 min): abre \`lyrics.srt\` num editor (Subtitle Edit,
Aegisub, ou texto puro), ouve o \`audio.mp3\` e ajusta os timestamps
linha a linha. Corre \`bash assemble.sh\` outra vez.

**Auto-align** (~1 min): \`whisper-timestamped audio.mp3 --output_format srt\`
gera SRT com timing real. Substitui o nosso \`lyrics.srt\` pelo dele e
corre \`bash assemble.sh\`.

## Customizar a tipografia

Edita a linha \`force_style=...\` em \`assemble.sh\` para mudar:
- \`Fontname\` — qualquer fonte instalada (Playfair Display, Libre Caslon)
- \`Fontsize\` — tamanho em pt (42 funciona bem em 1080p)
- \`PrimaryColour\` — cor da letra em formato BGR \`&HBBGGRR&\`
  - Cream \`#F4E4D1\` → \`&HD1E4F4&\` (já configurado)
  - Honey \`#E8B14A\` → \`&H4AB1E8&\`
  - Mango \`#F5803E\` → \`&H3E80F5&\`
- \`MarginV\` — distância vertical do fundo em pixels
- \`Alignment\` — 2 = baixo-centro, 8 = topo-centro, 5 = meio
`;
}

// ── Main bundler ───────────────────────────────────────────

export async function buildLyricVideoPack(args: {
  album: { slug: string; title: string };
  track: AlbumTrack;
  /** URL da capa para incluir como thumbnail.jpg */
  coverUrl: string;
  /** URL do áudio MP3 no Supabase */
  audioUrl: string;
  durationSeconds?: number;
  onProgress?: (step: string) => void;
}): Promise<Blob> {
  const { album, track, coverUrl, audioUrl, onProgress } = args;
  const duration = args.durationSeconds || track.durationSeconds || 240;
  const trackSlug = `${album.slug}-faixa-${String(track.number).padStart(2, "0")}`;

  onProgress?.("A descarregar capa...");
  const coverRes = await fetch(coverUrl);
  if (!coverRes.ok) throw new Error(`Capa não encontrada (${coverRes.status})`);
  const coverBlob = await coverRes.blob();

  onProgress?.("A descarregar áudio...");
  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) throw new Error(`Áudio não encontrado (${audioRes.status})`);
  const audioBlob = await audioRes.blob();

  onProgress?.("A gerar SRT...");
  const lines = extractSingableLines(track.lyrics);
  const srt = generateSRT(lines, duration);

  onProgress?.("A montar pack...");
  const zip = new JSZip();
  const folder = zip.folder(trackSlug)!;
  folder.file("thumbnail.jpg", coverBlob);
  folder.file("audio.mp3", audioBlob);
  folder.file("lyrics.srt", srt);
  folder.file("scene-prompt.md", buildScenePrompt(album.slug, track.title));
  folder.file("assemble.sh", buildAssembleScript(track.title));
  folder.file("README.md", buildReadme(track.title, album.title, duration, lines.length));

  onProgress?.("A comprimir...");
  return zip.generateAsync({ type: "blob" });
}

// ── Cover URL resolver ─────────────────────────────────────

export async function resolveCoverUrl(albumSlug: string, trackNumber: number): Promise<string> {
  const tn = String(trackNumber).padStart(2, "0");
  const candidates = [
    `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/cover.jpg`,
    `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/cover.png`,
    `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}-cover.jpg`,
    `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}-cover.png`,
  ];
  for (const url of candidates) {
    try {
      const r = await fetch(url, { method: "HEAD" });
      if (r.ok) return url;
    } catch { /* try next */ }
  }
  throw new Error("Sem capa do álbum nem capa por faixa no Supabase");
}

export function audioUrlFor(albumSlug: string, trackNumber: number): string {
  const tn = String(trackNumber).padStart(2, "0");
  return `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}.mp3`;
}

