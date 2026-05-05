"use client";

/**
 * NOVA Lyric Video — helpers para o admin extrair os bocados que vão para
 * o teu editor de vídeo (CapCut, VEED, Kapwing, Final Cut, etc.).
 *
 * Idêntico ao módulo de VENNA, ajustado para a estética NOVA: pop
 * ético/profético, visual mais conceptual e abstracto.
 */

import type { AlbumTrack } from "@/data/albums";
import { NOVA_CONFIG } from "@/data/nova-config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";

// ── Lyrics parsing (igual ao VENNA) ────────────────────────

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

// ── Scene mood per album (UMA cena loopable) ───────────────

const ALBUM_SCENE_TEMPLATE: Record<string, string> = {
  "nova-static":
    "person seen from behind sitting alone in front of multiple glowing screens, cold violet-blue light flickering, static texture overlay, slow drift, cinematic 35mm film grain, blue-violet palette, conceptual loopable",
  "nova-skin":
    "macro close-up of skin with warm rose light moving slowly across collarbone, single rivulet of water, no face visible, terracotta and rose palette, cinematic 35mm, intimate body texture, loopable sensorial",
  "nova-machine":
    "rows of server LEDs blinking slowly in deep dark room, single cable hanging, blue-steel cool palette, slow tracking shot through datacenter aisle, glitch text barely visible, cinematic 35mm, post-human loopable",
  "nova-alone":
    "empty hallway lit only by single distant lamp, phone screen glow on a bedside in foreground, no people, gray-violet palette, slow drift, cinematic 35mm, three-am loneliness, loopable melancholy",
  "nova-burn":
    "paper page slowly catching fire from a single ember, sparks rising into dark, burnt-orange and black palette, single match flame held still, cinematic 35mm, slow combustion, loopable purification",
  "nova-water":
    "still water surface slowly rippling outward from a single drop, soft blue light from above, hand emerging then sinking, cool blue palette, cinematic 35mm, surrender mood, loopable fluid",
  "nova-air":
    "single sheer fabric drifting across a white sky, hand reaching up from below, pale-blue and cream palette, slow vertical drift, cinematic 35mm, breath-of-life mood, loopable lightness",
  "nova-time":
    "hourglass close-up with sand falling slowly, soft amber-brown light, dust motes suspended, ancestral wood texture in background, cinematic 35mm, present-as-eternal, loopable timeless",
  "nova-love":
    "two hands slowly meeting in soft pink light, no faces, sheer curtain in background, rose and cream palette, cinematic 35mm, tender unperformed love, loopable intimate",
  "nova-light":
    "horizon at first light, sun breaking through cream-gold haze, single silhouette dissolving into the brightness, gold-cream palette, cinematic 35mm, transcendence, loopable luminous fade",
};

/**
 * Constrói o prompt Midjourney v7 para a cena do track. Inline com a cref URL
 * real (não placeholder).
 *
 * v7 não suporta --cw — a cref controla a fidelidade ao personagem internamente.
 */
export function buildScenePrompt(albumSlug: string, options: { aspect?: "16:9" | "9:16" } = {}): string {
  const base = ALBUM_SCENE_TEMPLATE[albumSlug] ?? "conceptual cinematic loopable scene, cool palette, cinematic 35mm";
  const aspect = options.aspect ?? "16:9";
  return `${base} --cref ${NOVA_CONFIG.CREF_URL} --ar ${aspect} --style raw --v 7 --motion low`;
}

// ── Audio URL helper ───────────────────────────────────────

export function audioUrlFor(albumSlug: string, trackNumber: number): string {
  const tn = String(trackNumber).padStart(2, "0");
  return `${SUPABASE_URL}/storage/v1/object/public/audios/albums/${albumSlug}/faixa-${tn}.mp3`;
}
