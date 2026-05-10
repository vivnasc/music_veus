/**
 * Gera docs/loranne-tracks-produced.json e loranne-lyrics/<slug>/<n>.txt
 * a partir de music-app/src/data/albums.ts (PRODUCED + PUBLISHED).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ALL_ALBUMS } from "../music-app/src/data/albums";
import { getLyrics } from "../music-app/src/data/all-lyrics";

const ROOT = path.resolve(__dirname, "..");
const LYRICS_DIR = path.join(ROOT, "loranne-lyrics");
const TRACKS_OUT = path.join(ROOT, "docs", "loranne-tracks-produced.json");

// Critério "produzido":
//  - status produced ou published, OU
//  - product === "incenso" (toda a colecção incenso já está produzida).
const produced = ALL_ALBUMS.filter(
  (a) =>
    a.artist !== "Ancient Ground" &&
    (a.status === "produced" ||
      a.status === "published" ||
      a.product === "incenso" ||
      a.slug.startsWith("incenso-"))
);

type Out = Record<string, Record<string, { title: string; energy: string; lang: string }>>;
const out: Out = {};

let totalTracks = 0;
for (const album of produced) {
  const bySlug: Record<string, { title: string; energy: string; lang: string }> = {};
  for (const t of album.tracks) {
    bySlug[String(t.number)] = { title: t.title, energy: t.energy, lang: t.lang };
    const lyrics = getLyrics(album.slug, t.number);
    if (lyrics) {
      const dir = path.join(LYRICS_DIR, album.slug);
      mkdirSync(dir, { recursive: true });
      writeFileSync(path.join(dir, `${t.number}.txt`), lyrics, "utf8");
    }
    totalTracks++;
  }
  out[album.slug] = bySlug;
}

mkdirSync(path.dirname(TRACKS_OUT), { recursive: true });
writeFileSync(TRACKS_OUT, JSON.stringify(out, null, 2) + "\n", "utf8");

const albums = Object.keys(out).length;
console.log(`Gerados ${albums} álbuns, ${totalTracks} faixas.`);
console.log("Slugs:", Object.keys(out).join(", "));
