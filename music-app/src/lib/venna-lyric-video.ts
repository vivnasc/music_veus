"use client";

/**
 * VENNA Lyric Video Pack — gera um ZIP com cover.jpg + lyrics.srt + assemble.sh
 * para o utilizador correr localmente com FFmpeg.
 *
 * Princípios:
 *  - Imagem estática (capa do álbum, com fallback para capa Suno da faixa)
 *  - Letra animada por cima, sincronizada ao áudio
 *  - Render final feito em FFmpeg local (não no browser — mais estável)
 *
 * Workflow:
 *   1. Botão no admin → este módulo gera ZIP
 *   2. Utilizador descarrega, descompacta
 *   3. Corre `bash assemble.sh` no terminal (precisa FFmpeg instalado)
 *   4. Sai `output.mp4` pronto a fazer upload para YouTube
 */

import JSZip from "jszip";
import type { AlbumTrack } from "@/data/albums";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";

// ── Lyrics parsing ─────────────────────────────────────────

/**
 * Extrai linhas cantáveis de um bloco de letra.
 * Salta:
 *   - Stage directions [Verse 1: ...], [Chorus: ...], [VENNA — LOCKED ...]
 *   - Language markers (European Portuguese:), (French whisper:)
 *   - Linhas vazias
 *   - Linhas que comecem por (... mas não terminem com :) — são instruções
 *   - Reticências sozinhas (...)
 */
export function extractSingableLines(lyrics: string): string[] {
  const lines = lyrics.split("\n");
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("[") && line.endsWith("]")) continue;
    if (line.startsWith("(") && line.endsWith(":)")) continue;
    if (line.startsWith("(") && line.endsWith(")")) continue; // (silence, 10 seconds)
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

/**
 * Gera SRT com timing distribuído uniformemente pelas linhas.
 * Reserva 3s de intro silencioso (instrumental) e 3s de outro.
 * Para timing real, o utilizador edita à mão ou usa whisper-timestamped.
 */
export function generateSRT(lines: string[], durationSeconds: number): string {
  if (lines.length === 0) return "";
  const intro = Math.min(3, durationSeconds * 0.05);
  const outro = Math.min(3, durationSeconds * 0.05);
  const usable = Math.max(durationSeconds - intro - outro, lines.length * 2);
  const perLine = usable / lines.length;

  return lines
    .map((line, i) => {
      const start = intro + i * perLine;
      const end = intro + (i + 1) * perLine - 0.05; // pequena pausa entre linhas
      return `${i + 1}\n${fmtSrtTime(start)} --> ${fmtSrtTime(end)}\n${line}\n`;
    })
    .join("\n");
}

// ── Assemble script ────────────────────────────────────────

function buildAssembleScript(trackTitle: string): string {
  // VENNA palette: cream #F4E4D1 → BGR &HD1E4F4&
  // outline preto + sombra suave para legibilidade sobre qualquer capa
  return `#!/bin/bash
# VENNA Lyric Video — ${trackTitle}
# Requer FFmpeg instalado (brew install ffmpeg / apt install ffmpeg)
# Corre na pasta deste pack: bash assemble.sh

set -e

OUTPUT="output.mp4"

ffmpeg -y \\
  -loop 1 -i cover.jpg \\
  -i audio.mp3 \\
  -vf "subtitles=lyrics.srt:force_style='Fontname=Cormorant Garamond,Fontsize=42,PrimaryColour=&HD1E4F4&,OutlineColour=&H000000&,Outline=2,Shadow=1,Alignment=2,MarginV=80'" \\
  -c:v libx264 -tune stillimage -pix_fmt yuv420p \\
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

## Como usar

1. Instala FFmpeg se ainda não tens:
   - macOS: \`brew install ffmpeg\`
   - Linux: \`sudo apt install ffmpeg\`
   - Windows: descarrega de https://ffmpeg.org/download.html

2. Nesta pasta, corre:
   \`\`\`bash
   bash assemble.sh
   \`\`\`

3. Sai \`output.mp4\` pronto para YouTube.

## Sobre o timing

O \`lyrics.srt\` tem timing **distribuído uniformemente** pela duração do áudio.
Funciona razoavelmente para canções com versos cantados continuamente, mas
canções com pausas instrumentais ou bridges longos vão ficar desalinhadas.

Para corrigir:

**Manual** (15-20 min): abre \`lyrics.srt\` num editor de texto ou em
[Subtitle Edit](https://www.nikse.dk/subtitleedit/), ouve o áudio e ajusta os
timestamps linha a linha.

**Automático** (~1 min): usa \`whisper-timestamped\` para auto-alinhar:
\`\`\`bash
pip install whisper-timestamped
whisper_timestamped audio.mp3 --language en --output_format srt
\`\`\`
Substitui o \`lyrics.srt\` gerado pelo do whisper, depois re-corre \`bash assemble.sh\`.

## Estilo

Fonte: **Cormorant Garamond** (instala se não tens). Pode trocar em \`assemble.sh\`
para Playfair Display, Libre Caslon, etc.

Cor: cream **#F4E4D1** (palette VENNA), com outline preto para legibilidade.

Tudo customizável editando a linha \`force_style=...\` em \`assemble.sh\`.
`;
}

// ── Main bundler ───────────────────────────────────────────

export async function buildLyricVideoPack(args: {
  album: { slug: string; title: string };
  track: AlbumTrack;
  /** URL absoluto da capa que vai ao ZIP (já com fallback resolvido) */
  coverUrl: string;
  /** URL do áudio MP3 no Supabase */
  audioUrl: string;
  /** Duração em segundos do áudio (defaults para track.durationSeconds) */
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
  folder.file("cover.jpg", coverBlob);
  folder.file("audio.mp3", audioBlob);
  folder.file("lyrics.srt", srt);
  folder.file("assemble.sh", buildAssembleScript(track.title));
  folder.file("README.md", buildReadme(track.title, album.title, duration, lines.length));

  onProgress?.("A comprimir...");
  return zip.generateAsync({ type: "blob" });
}

// ── Cover URL resolver (album cover → Suno per-track) ──────

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
