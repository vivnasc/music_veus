// Wrap lyrics-*.ts entries that don't have [Vocal:] block yet.
// Skip slugs in PUBLISHED_SLUGS / PRODUCED_SLUGS.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA = path.join(ROOT, "src", "data");

const PT_BLOCK = `[Vocal: ONE warm mezzo-contralto female voice, intimate speaking quality, slight breathiness on sustained notes, sings very close to the microphone, layered airy harmonies emerging only on choruses (3 voices max — root, third, fifth), no melisma, no belting, no riffs, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African]
[Persona: Loranne — contemporary organic-electronic, AwakeSoul lineage, contemplative and transformative]`;

const EN_BLOCK = `[Vocal: ONE warm mezzo-contralto female voice, intimate speaking quality, slight breathiness on sustained notes, sings very close to the microphone, layered airy harmonies emerging only on choruses (3 voices max — root, third, fifth), no melisma, no belting, no riffs, no autotune]
[CRITICAL: subtle international English accent, NOT American, NOT exaggerated British]
[Persona: Loranne — contemporary organic-electronic, AwakeSoul lineage, contemplative and transformative]`;

// Read albums.ts as text and extract:
//   - PUBLISHED_SLUGS / PRODUCED_SLUGS sets
//   - { "slug/number": lang } map
const albumsTxt = fs.readFileSync(path.join(DATA, "albums.ts"), "utf8");

function extractSet(name) {
  const m = albumsTxt.match(new RegExp(`const ${name} = new Set\\(\\[([\\s\\S]*?)\\]\\)`));
  if (!m) return new Set();
  return new Set([...m[1].matchAll(/"([^"]+)"/g)].map(x => x[1]));
}

const PUBLISHED = extractSet("PUBLISHED_SLUGS");
const PRODUCED = extractSet("PRODUCED_SLUGS");
const LOCKED = new Set([...PUBLISHED, ...PRODUCED]);
console.log(`Locked albums: ${LOCKED.size}`);

// Build slug→lang map per track. The album's slug is set in album defs;
// each track has number + lang. We scan album-block definitions.
//
// Pattern: slug: "xxx-yyy", ... tracks: [ { number: N, ..., lang: "PT|EN", ... } ]
// We can use a coarse scan: look for `slug: "..."` to start a block, then
// parse subsequent `{ number: N, ..., lang: "..."` entries until the next slug.
const langMap = new Map();
{
  // Recognize both `slug: "xxx"` (AlbumDef objects) and helper-function calls
  // like `vidaAlbum("xxx-yyy", ...)`, `cursoAlbum("xxx-yyy", ...)`,
  // `nuaAlbum("xxx-yyy", ...)`, etc. We treat the FIRST slug-shaped string in
  // each position as the album slug.
  const positions = [];
  // 1. slug: "xxx-yyy"
  for (const m of albumsTxt.matchAll(/slug:\s*"([a-z0-9-]+(?:-[a-z0-9-]+)*)"/g)) {
    positions.push({ slug: m[1], idx: m.index });
  }
  // 2. helper function calls: e.g. vidaAlbum("grao-foo", ...), cursoAlbum("curso-foo", ...)
  for (const m of albumsTxt.matchAll(/\b[a-zA-Z]+Album\(\s*"([a-z0-9-]+(?:-[a-z0-9-]+)*)"/g)) {
    positions.push({ slug: m[1], idx: m.index });
  }
  positions.sort((a, b) => a.idx - b.idx);
  // De-dup adjacent same-slug entries (e.g. helper call + nested slug:) by keeping the first
  for (let i = 0; i < positions.length; i++) {
    const { slug, idx } = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1].idx : albumsTxt.length;
    const block = albumsTxt.slice(idx, end);
    const trackRe = /\{\s*number:\s*(\d+)[^}]*?lang:\s*"(PT|EN)"/g;
    let t;
    while ((t = trackRe.exec(block))) {
      const num = parseInt(t[1], 10);
      const lang = t[2];
      const key = `${slug}/${num}`;
      if (!langMap.has(key)) langMap.set(key, lang);
    }
  }
}
console.log(`Tracks with lang inferred: ${langMap.size}`);

// Process each lyrics file
const files = fs.readdirSync(DATA).filter(f => f.startsWith("lyrics-") && f.endsWith(".ts"));
let totalWrapped = 0;
let totalSkippedLocked = 0;
let totalSkippedAlready = 0;
let totalSkippedNoLang = 0;

for (const fname of files) {
  const fpath = path.join(DATA, fname);
  let txt = fs.readFileSync(fpath, "utf8");
  let wrapped = 0;
  let skippedLocked = 0;
  let skippedAlready = 0;
  let skippedNoLang = 0;

  // Match each entry: "slug/n": `body`,
  // We replace inside the match using a callback so multiple replacements
  // don't shift indices in a mutable string.
  const entryRe = /"([a-z0-9-]+\/\d+)":\s*`([^`]*)`/g;
  txt = txt.replace(entryRe, (full, key, body) => {
    if (body.includes("[Vocal")) { skippedAlready++; return full; }
    const [slug] = key.split("/");
    if (LOCKED.has(slug)) { skippedLocked++; return full; }
    const lang = langMap.get(key);
    if (!lang) { skippedNoLang++; return full; }
    const block = lang === "PT" ? PT_BLOCK : EN_BLOCK;
    wrapped++;
    return `"${key}": \`${block}\n\n${body.trim()}\``;
  });

  if (wrapped > 0) {
    fs.writeFileSync(fpath, txt);
  }

  console.log(`${fname}: wrapped=${wrapped} alreadyHad=${skippedAlready} locked=${skippedLocked} noLang=${skippedNoLang}`);
  totalWrapped += wrapped;
  totalSkippedAlready += skippedAlready;
  totalSkippedLocked += skippedLocked;
  totalSkippedNoLang += skippedNoLang;
}

console.log(`\n— Total wrapped: ${totalWrapped}`);
console.log(`— Already had: ${totalSkippedAlready}`);
console.log(`— Locked (produced/published): ${totalSkippedLocked}`);
console.log(`— No lang found: ${totalSkippedNoLang}`);
