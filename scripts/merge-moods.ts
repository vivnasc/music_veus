/**
 * Mescla docs/loranne-mood-tags.json (17 álbuns) + group1..group5.json
 * (37 álbuns incenso novos) → docs/loranne-mood-tags.json.
 * Ordem dos álbuns no ficheiro final segue docs/loranne-tracks-produced.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const MOODS_PATH = path.join(ROOT, "docs/loranne-mood-tags.json");
const TRACKS_PATH = path.join(ROOT, "docs/loranne-tracks-produced.json");

type Entry = { mood: string[]; rationale: string };
type Album = Record<string, Entry>;
type Moods = Record<string, Album>;

const existing: Moods = JSON.parse(readFileSync(MOODS_PATH, "utf8"));
const tracks: Record<string, Record<string, unknown>> = JSON.parse(readFileSync(TRACKS_PATH, "utf8"));

const groups = ["group1", "group2", "group3", "group4", "group5"];
for (const g of groups) {
  const data: Moods = JSON.parse(readFileSync(`/tmp/loranne-incenso-batches/${g}.json`, "utf8"));
  for (const [slug, album] of Object.entries(data)) {
    if (existing[slug]) console.warn(`⚠ Duplicado: ${g} traz ${slug} que já existia`);
    existing[slug] = album;
  }
}

// Re-ordenar pela ordem em tracks-produced.json (preserva consistência)
const ordered: Moods = {};
for (const slug of Object.keys(tracks)) {
  if (existing[slug]) {
    // Re-ordenar faixas por número (chave string ordenada numericamente)
    const album = existing[slug];
    const sortedNums = Object.keys(album).sort((a, b) => Number(a) - Number(b));
    const sortedAlbum: Album = {};
    for (const n of sortedNums) sortedAlbum[n] = album[n];
    ordered[slug] = sortedAlbum;
  }
}

writeFileSync(MOODS_PATH, JSON.stringify(ordered, null, 2) + "\n", "utf8");
console.log(`Mesclado: ${Object.keys(ordered).length} álbuns, ${Object.values(ordered).reduce((s, a) => s + Object.keys(a).length, 0)} faixas`);
