#!/usr/bin/env node
// Parses ../PRESENÇA_Project/*.md into src/data/presenca-data.json
// Reads:
//   00-MANIFESTO.md         (overall manifesto)
//   MAPA-DECIDIDO.md        (sub-coleções, identidade instrumental)
//   01a-MEDO-album-*.md     (Medo sub-coleção albums)
//   Future: 02a-MAGOA-album-*.md, etc.
//
// Run with:
//   node scripts/build-presenca.mjs

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_DIR = resolve(__dirname, "../../PRESENÇA_Project");
const OUT_FILE = resolve(__dirname, "../src/data/presenca-data.json");

// ─── Sub-coleções map (from MAPA-DECIDIDO.md) ────────────────────────────────
// Slug → numeric prefix in filenames (01a, 02a, etc.)
const SUB_PREFIX = {
  medo: "01a-MEDO",
  magoa: "02a-MAGOA",
  apatia: "03a-APATIA",
  inquietacao: "04a-INQUIETACAO",
  sufoco: "05a-SUFOCO",
  confusao: "06a-CONFUSAO",
  vazio: "07a-VAZIO",
};

const SUB_ORDER = ["medo", "magoa", "apatia", "inquietacao", "sufoco", "confusao", "vazio"];

// Title-case helpers
function deslug(s) {
  return s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function slugify(s) {
  return s
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Parse a single album markdown file
function parseAlbumFile(filepath) {
  const raw = readFileSync(filepath, "utf8");

  // # Álbum N — **Title** (SubColecao)
  const headerMatch = raw.match(/^#\s*[ÁA]lbum\s+(\d+)\s+[—-]\s+\*\*([^*]+)\*\*\s+\(([^)]+)\)/m);
  if (!headerMatch) return null;
  const albumNumber = parseInt(headerMatch[1], 10);
  const albumTitle = headerMatch[2].trim();
  const subLabel = headerMatch[3].trim();

  // > Função do álbum: ...
  const funcMatch = raw.match(/^>\s*Fun[çc][aã]o do [áa]lbum:\s*(.+)$/m);
  const albumFuncao = funcMatch ? funcMatch[1].trim() : "";

  // > Hora interior: ...
  const horaMatch = raw.match(/^>\s*Hora interior:\s*(.+)$/m);
  const horaInterior = horaMatch ? horaMatch[1].trim() : "";

  // Parse the concept-summary table:
  // | 1.1 | Chegada | **Parar** — interromper o movimento sem direção |
  const conceptTable = {};
  const tableRe = /^\|\s*(\d+)\.(\d+)\s*\|\s*([^|]+?)\s*\|\s*\*\*([^*]+)\*\*\s*(?:[—-]\s*([^|]*?))?\s*\|/gm;
  let m;
  while ((m = tableRe.exec(raw)) !== null) {
    const n = parseInt(m[2], 10);
    conceptTable[n] = {
      position: m[3].trim(),
      label: m[4].trim(),
      summary: (m[5] || "").trim(),
    };
  }

  // Track sections: ## N.M *Title* (Position) — optional APROVADA
  // followed by **Conceito:** ... and ```...``` block + **Style:** ...
  const trackBlocks = [];
  const trackRe = /^##\s+\d+\.(\d+)\s+\*([^*]+)\*\s+\(([^)]+)\)\s*(?:[—-]\s*([A-ZÁÊÉÍÓÚÇ-]+))?\s*$/gm;
  const matches = [];
  while ((m = trackRe.exec(raw)) !== null) {
    matches.push({
      index: m.index,
      num: parseInt(m[1], 10),
      title: m[2].trim(),
      position: m[3].trim(),
      flag: (m[4] || "").trim().toLowerCase() || null,
      endHeader: trackRe.lastIndex,
    });
  }
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const nextStart = i + 1 < matches.length ? matches[i + 1].index : raw.length;
    const body = raw.substring(cur.endHeader, nextStart);

    // Conceito (optional)
    const conceitoMatch = body.match(/\*\*Conceito:\*\*\s*([\s\S]*?)(?:\n```|\n\n\*\*|\n## |$)/);
    const conceito = conceitoMatch ? conceitoMatch[1].trim() : "";

    // Suno prompt block — ```...```
    const promptMatch = body.match(/```\s*\n([\s\S]*?)\n```/);
    const sunoPrompt = promptMatch ? promptMatch[1].trim() : "";

    // **Style:** line(s) up to next `---` or `## ` or end-of-section
    const styleMatch = body.match(/\*\*Style:\*\*\s*([\s\S]*?)(?:\n\s*\n\s*---|\n##\s|$)/);
    const style = styleMatch ? styleMatch[1].trim().replace(/\s+/g, " ") : "";

    trackBlocks.push({
      number: cur.num,
      title: cur.title,
      position: cur.position,
      flag: cur.flag, // "aprovada" if marked APROVADA
      concept: conceito || conceptTable[cur.num]?.summary || "",
      sunoPrompt,
      style,
    });
  }

  // Build slug from title (e.g. "Chão" → "chao", "Pés Descalços" → "pes-descalcos")
  const slug = slugify(albumTitle);

  return {
    number: albumNumber,
    slug,
    title: albumTitle,
    subLabel,
    funcao: albumFuncao,
    horaInterior,
    tracks: trackBlocks,
  };
}

// Parse the manifesto + mapa to extract sub-collection metadata
function parseSubCollections() {
  const manifestoPath = resolve(PROJECT_DIR, "00-MANIFESTO.md");
  const mapaPath = resolve(PROJECT_DIR, "MAPA-DECIDIDO.md");
  const manifesto = readFileSync(manifestoPath, "utf8");
  const mapa = readFileSync(mapaPath, "utf8");

  // From manifesto "## Estrutura" — extract sub-collections list:
  // 1. **Medo** — para enraizar quando estás dispersa (8 álbuns)
  const subRe = /^\d+\.\s+\*\*([^*]+)\*\*\s+[—-]\s+(.+?)\s+\((\d+)\s+[áa]lbuns?\)/gm;
  const subFromManifesto = {};
  let m;
  while ((m = subRe.exec(manifesto)) !== null) {
    const label = m[1].trim();
    const slug = slugify(label);
    subFromManifesto[slug] = {
      label,
      funcao: m[2].trim(),
      albumCount: parseInt(m[3], 10),
    };
  }

  // From mapa "## 5. Identidade instrumental por sub-coleção":
  // | Medo | Kalimba grave, ... | G dórico | 56-62 |
  const instRe = /^\|\s*([A-ZÁÊÉÍÓÚÇa-záêéíóúç]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(\d+-\d+|\d+)\s*\|/gm;
  const instrumental = {};
  while ((m = instRe.exec(mapa)) !== null) {
    const slug = slugify(m[1]);
    if (subFromManifesto[slug]) {
      instrumental[slug] = {
        sounds: m[2].trim(),
        key: m[3].trim(),
        bpm: m[4].trim(),
      };
    }
  }

  // From mapa "## 3. Camadas invisíveis":
  // | Medo | 1 (Vontade) | 396 Hz | Raiz | Terra | Ubuntu |
  const layerRe = /^\|\s*([A-ZÁÊÉÍÓÚÇa-záêéíóúç]+)\s*\|\s*([^|]+?)\s*\|\s*(\d+\s*Hz)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/gm;
  const layers = {};
  while ((m = layerRe.exec(mapa)) !== null) {
    const slug = slugify(m[1]);
    if (subFromManifesto[slug]) {
      layers[slug] = {
        ray: m[2].trim(),
        solfeggio: m[3].trim(),
        chakra: m[4].trim(),
        element: m[5].trim(),
        tradition: m[6].trim(),
      };
    }
  }

  // From mapa "## 4. Eixos": Medo | Todo (...)
  const eixoRe = /^\|\s*([A-ZÁÊÉÍÓÚÇa-záêéíóúç]+)\s*\|\s*([^|]+?)\s*\|\s*$/gm;
  const eixos = {};
  while ((m = eixoRe.exec(mapa)) !== null) {
    const slug = slugify(m[1]);
    if (subFromManifesto[slug]) {
      eixos[slug] = m[2].trim();
    }
  }

  // Assemble
  const subs = SUB_ORDER.map((slug, idx) => {
    const base = subFromManifesto[slug] || { label: deslug(slug), funcao: "", albumCount: 0 };
    return {
      slug,
      order: idx + 1,
      label: base.label,
      funcao: base.funcao,
      albumCount: base.albumCount,
      instrumental: instrumental[slug] || null,
      layers: layers[slug] || null,
      eixo: eixos[slug] || "",
    };
  });

  return subs;
}

// Find all album files for a sub-coleção
function collectAlbumsFor(subSlug) {
  const prefix = SUB_PREFIX[subSlug];
  if (!prefix) return [];
  const files = readdirSync(PROJECT_DIR)
    .filter(f => f.startsWith(prefix + "-album-") && f.endsWith(".md"))
    .sort();
  const albums = [];
  for (const f of files) {
    const parsed = parseAlbumFile(resolve(PROJECT_DIR, f));
    if (parsed) {
      albums.push({ ...parsed, sourceFile: f });
    }
  }
  return albums;
}

function readManifesto() {
  const path = resolve(PROJECT_DIR, "00-MANIFESTO.md");
  const raw = readFileSync(path, "utf8");
  // Extract first long paragraph until "## Estrutura"
  const headerIdx = raw.indexOf("## Estrutura");
  const intro = headerIdx > 0 ? raw.substring(0, headerIdx).trim() : raw.trim();
  return intro;
}

// ─── Main ────────────────────────────────────────────────────────────────────
const subs = parseSubCollections();
const allAlbums = {};
for (const sub of subs) {
  allAlbums[sub.slug] = collectAlbumsFor(sub.slug);
}

const out = {
  generatedAt: new Date().toISOString(),
  manifestoExcerpt: readManifesto(),
  subs,
  albums: allAlbums,
};

writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), "utf8");

const totalAlbums = Object.values(allAlbums).reduce((n, arr) => n + arr.length, 0);
const totalTracks = Object.values(allAlbums).reduce((n, arr) => n + arr.reduce((m, a) => m + a.tracks.length, 0), 0);
console.log(`✓ Parsed ${subs.length} sub-colecções`);
console.log(`✓ Parsed ${totalAlbums} álbuns (${totalTracks} faixas com prompts Suno)`);
console.log(`✓ Written to ${OUT_FILE}`);
