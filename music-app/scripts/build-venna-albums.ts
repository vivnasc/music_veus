/**
 * build-venna-albums
 *
 * Lê /VENNA/venna-final.json e gera src/data/venna-albums.ts.
 * VENNA é uma artista pop dançável (1 EP "Mango Hour" com 5 faixas).
 *
 * Cada faixa no JSON traz suno_style + suno_lyrics verbatim — copiamos
 * para prompt e lyrics do Album, sem alteração.
 *
 * Usage:
 *   cd music-app && npx tsx scripts/build-venna-albums.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REPO_ROOT = resolve(__dirname, "..", "..");
const INPUT = resolve(REPO_ROOT, "VENNA", "venna-final.json");
const OUTPUT = resolve(__dirname, "..", "src", "data", "venna-albums.ts");

type RawTrack = {
  slug: string;
  track_number: number;
  title: string;
  ep_slug: string;
  bpm: number;
  primary_language: "pt" | "en";
  secondary_language: "pt" | "en";
  mood: string;
  signature_element: string;
  status: "concept" | "demo_generated" | "demo_approved" | "produced" | "mastered" | "released";
  suno_style: string;
  suno_lyrics: string;
};

type RawArtist = {
  slug: string;
  name: string;
  tagline_pt: string;
  bio_pt: string;
  palette: Record<string, string>;
};

type RawEp = { slug: string; title: string; concept: string };

type RawJson = {
  artist: RawArtist;
  ep: RawEp;
  tracks: RawTrack[];
};

// Descrições editoriais curtas em PT (substituem o "mood" do JSON, que tem
// linguagem técnica). Estilo Loranne: curto, evocativo, sem travessão.
const TRACK_DESCRIPTIONS: Record<string, string> = {
  "honey-hour":     "A hora doce em que ninguém quer ir embora",
  "golden-hour":    "Uma terça à noite, vinho no copo, o céu em fogo",
  "slow-down":      "Calma, tens a noite toda",
  "saturday-skin":  "Pele de sábado, corpo na noite até o sol nascer",
  "venna-theme":    "Vim para dançar, vim para ficar",
};

function escapeTpl(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function mapEnergy(bpm: number, mood: string): "anthem" | "pulse" | "steady" | "whisper" | "raw" {
  if (mood.toLowerCase().includes("anthemic") || mood.toLowerCase().includes("manifesto")) return "anthem";
  if (bpm >= 115) return "pulse";
  if (bpm >= 105) return "steady";
  return "whisper";
}

function main() {
  const raw = JSON.parse(readFileSync(INPUT, "utf-8")) as RawJson;
  const { artist, ep, tracks } = raw;

  const sortedTracks = [...tracks].sort((a, b) => a.track_number - b.track_number);

  const trackBlocks = sortedTracks.map((t) => {
    const lang = (t.primary_language === "pt" ? "PT" : "EN") as "PT" | "EN";
    const energy = mapEnergy(t.bpm, t.mood);
    const desc = TRACK_DESCRIPTIONS[t.slug] ?? t.mood;
    return `    {
      number: ${t.track_number},
      title: ${JSON.stringify(t.title)},
      description: ${JSON.stringify(desc)},
      lang: ${JSON.stringify(lang)} as const,
      energy: ${JSON.stringify(energy)} as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: \`${escapeTpl(t.suno_style)}\`,
      lyrics: \`${escapeTpl(t.suno_lyrics)}\`,
      durationSeconds: 240,
      audioUrl: null,
    },`;
  }).join("\n");

  const albumSlug = `venna-${ep.slug}`; // "venna-mango-hour"
  const out = `/**
 * VENNA — EP "${ep.title}" (${tracks.length} faixas)
 *
 * Artista: ${artist.name}
 * Tagline: ${artist.tagline_pt}
 *
 * Pop dançável: melodic house, dance pop, R&B contemporâneo. PT/EN com
 * sotaque europeu (Lisboa). "Honey Hour" é a Persona Seed Track — voz a
 * clonar via Suno Persona para coerência nas restantes 4 faixas.
 *
 * Gerado por scripts/build-venna-albums.ts a partir de /VENNA/venna-final.json
 * NÃO EDITAR À MÃO — alterar o JSON fonte e correr o script.
 */

import type { Album, TrackEnergy, VocalMode } from "./albums";

export const VENNA_ALBUMS: Album[] = [
  {
    slug: ${JSON.stringify(albumSlug)},
    title: ${JSON.stringify(ep.title)},
    subtitle: ${JSON.stringify(artist.tagline_pt)},
    artist: ${JSON.stringify(artist.name)},
    product: "venna" as const,
    color: ${JSON.stringify(artist.palette.mango)},
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
${trackBlocks}
    ],
  },
];
`;

  writeFileSync(OUTPUT, out, "utf-8");
  console.log(`✓ Gerado ${OUTPUT}`);
  console.log(`  EP "${ep.title}" — ${tracks.length} faixas`);
  for (const t of sortedTracks) {
    console.log(`  · ${String(t.track_number).padStart(2, "0")} ${t.title} [${t.status}]`);
  }
}

main();
