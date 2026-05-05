"use client";

/**
 * VENNA Lyric Video — helpers para o admin extrair os bocados que vão para
 * o teu editor de vídeo (CapCut, VEED, Kapwing, Final Cut, etc.).
 *
 * Nada de FFmpeg, nada de consola. Só texto com copy buttons no admin.
 *
 * O que ofereces ao utilizador no admin (per faixa):
 *   1. Scene Prompt (Midjourney v7, com --cref inline)
 *   2. Singable Lyrics (linhas cantáveis, sem stage directions)
 *   3. Audio URL directo do Supabase
 */

import type { AlbumTrack } from "@/data/albums";
import { VENNA_CONFIG } from "@/data/venna-config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";

// ── Lyrics parsing ─────────────────────────────────────────

/**
 * Extrai linhas cantáveis. Salta:
 *   - Stage directions [Verse 1: ...], [Chorus: ...], [VENNA — LOCKED ...]
 *   - Language markers (European Portuguese:), (French whisper:)
 *   - Linhas vazias e reticências sozinhas
 */
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

// ── Scene mood per album (UMA cena loopable, não 6-8) ──────

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

/**
 * Constrói o prompt Midjourney v7 para a cena do track. Inline com a cref URL
 * real (não placeholder) — pronto a colar no Midjourney.
 *
 * Por defeito 16:9 (canal principal). Para Shorts, troca para 9:16 antes de
 * colar.
 */
export function buildScenePrompt(albumSlug: string, options: { aspect?: "16:9" | "9:16"; charWeight?: number } = {}): string {
  const base = ALBUM_SCENE_TEMPLATE[albumSlug] ?? "warm cinematic loopable scene, terracotta and honey palette, cinematic 35mm";
  const aspect = options.aspect ?? "16:9";
  const cw = options.charWeight ?? 50;
  return `${base} --cref ${VENNA_CONFIG.CREF_URL} --cw ${cw} --ar ${aspect} --style raw --v 7 --motion low`;
}

// ── Audio URL helper ───────────────────────────────────────

export function audioUrlFor(albumSlug: string, trackNumber: number): string {
  const tn = String(trackNumber).padStart(2, "0");
  return `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}.mp3`;
}
