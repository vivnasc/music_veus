/**
 * build-nova-albums
 *
 * Lê os 10 ficheiros em /music-app/NOVA/NOVA_AlbumX_*.md (fonte humana,
 * prompts Suno) e gera src/data/nova-albums.ts — TypeScript tipado,
 * versionado em git, importado por albums.ts.
 *
 * Cada álbum tem 10 faixas → 10 álbuns × 10 = 100 faixas no total.
 * Estrutura por faixa no .md:
 *
 *   # 01 · TITLE
 *
 *   **Categoria · NN BPM · subtítulo**
 *
 *   ### STYLE
 *   ```
 *   prompt-suno
 *   ```
 *
 *   ### TITLE
 *   ```
 *   TITLE
 *   ```
 *
 *   ### LYRICS
 *   ```
 *   [Style: ...]
 *   letra
 *   ```
 *
 * Usage:
 *   cd music-app && npx tsx scripts/build-nova-albums.ts
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { ALBUM_SUBTITLES, TRACK_DESCRIPTIONS } from "./nova-overrides";

const NOVA_DIR = resolve(__dirname, "..", "NOVA");
const OUTPUT = resolve(__dirname, "..", "src", "data", "nova-albums.ts");

// Mapping ordem -> slug + cor (paleta NOVA — gradiente cyber→orgânico)
const ALBUM_META: Record<number, { slug: string; color: string; subtitle: string }> = {
  1: {
    slug: "nova-static",
    color: "#3b3b6e",
    subtitle: ALBUM_SUBTITLES["nova-static"],
  },
  2: {
    slug: "nova-skin",
    color: "#a05a6e",
    subtitle: ALBUM_SUBTITLES["nova-skin"],
  },
  3: {
    slug: "nova-machine",
    color: "#5a6e8a",
    subtitle: ALBUM_SUBTITLES["nova-machine"],
  },
  4: {
    slug: "nova-alone",
    color: "#6e6e8a",
    subtitle: ALBUM_SUBTITLES["nova-alone"],
  },
  5: {
    slug: "nova-burn",
    color: "#a85a3b",
    subtitle: ALBUM_SUBTITLES["nova-burn"],
  },
  6: {
    slug: "nova-water",
    color: "#5a8aa8",
    subtitle: ALBUM_SUBTITLES["nova-water"],
  },
  7: {
    slug: "nova-air",
    color: "#a8c0c8",
    subtitle: ALBUM_SUBTITLES["nova-air"],
  },
  8: {
    slug: "nova-time",
    color: "#8a7e5a",
    subtitle: ALBUM_SUBTITLES["nova-time"],
  },
  9: {
    slug: "nova-love",
    color: "#c08aaa",
    subtitle: ALBUM_SUBTITLES["nova-love"],
  },
  10: {
    slug: "nova-light",
    color: "#e8d8a8",
    subtitle: ALBUM_SUBTITLES["nova-light"],
  },
};

type ParsedTrack = {
  number: number;
  title: string;
  description: string;
  bpm: number | null;
  energy: "anthem" | "whisper" | "raw" | "steady" | "pulse";
  prompt: string;
  lyrics: string;
};

type ParsedAlbum = {
  index: number;
  title: string;
  tracks: ParsedTrack[];
};

/** Mapeia categoria do .md para TrackEnergy. */
function mapEnergy(description: string): ParsedTrack["energy"] {
  const lower = description.toLowerCase();
  if (lower.includes("hino")) return "anthem";
  if (lower.includes("devastador") || lower.includes("vulnerável") || lower.includes("cru ") || lower.endsWith("cru")) return "raw";
  // Câmara, Ritual, Cântico → whisper (íntimo / contemplativo)
  return "whisper";
}

function extractBpm(description: string): number | null {
  const m = description.match(/(\d{2,3})\s*BPM/i);
  return m ? Number(m[1]) : null;
}

/**
 * Parser de um ficheiro markdown NOVA_AlbumX.md.
 * Devolve o título do álbum + lista de 10 faixas.
 */
function parseAlbum(filePath: string): ParsedAlbum {
  const raw = readFileSync(filePath, "utf-8");
  const fileName = filePath.split("/").pop() || "";

  // Extrair número do álbum (NOVA_Album1_, NOVA_Album10_)
  const numMatch = fileName.match(/Album(\d+)/);
  if (!numMatch) throw new Error(`Não consegui extrair número do álbum: ${fileName}`);
  const albumNumber = Number(numMatch[1]);

  // Título do álbum: primeira linha "# NOVA — Álbum I · STATIC"
  const albumTitleMatch = raw.match(/^#\s*NOVA\s*—\s*Álbum\s+\S+\s*·\s*(.+)$/m);
  const albumTitle = albumTitleMatch ? albumTitleMatch[1].trim() : `Album ${albumNumber}`;

  // Splittar pelas faixas: cada faixa começa em "# NN · TITLE"
  // Procurar todas as posições de cabeçalho de faixa
  const headerRegex = /^#\s*(\d{2})\s*·\s*(.+)$/gm;
  const tracks: ParsedTrack[] = [];

  type HeaderHit = { num: number; title: string; index: number };
  const headers: HeaderHit[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRegex.exec(raw)) !== null) {
    headers.push({ num: Number(m[1]), title: m[2].trim(), index: m.index });
  }

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    const start = h.index;
    const end = i + 1 < headers.length ? headers[i + 1].index : raw.length;
    const section = raw.slice(start, end);

    // Linha de descrição: primeiro ** ... ** depois do header
    const descMatch = section.match(/\*\*([^*]+)\*\*/);
    const description = descMatch ? descMatch[1].trim() : "";

    // STYLE block: ### STYLE\n```\n...\n```
    const styleMatch = section.match(/###\s*STYLE\s*\n+```[a-z]*\n([\s\S]*?)```/i);
    const prompt = styleMatch ? styleMatch[1].trim() : "";

    // LYRICS block: ### LYRICS\n```\n...\n```
    const lyricsMatch = section.match(/###\s*LYRICS\s*\n+```[a-z]*\n([\s\S]*?)```/i);
    const lyrics = lyricsMatch ? lyricsMatch[1].trim() : "";

    if (!prompt || !lyrics) {
      console.warn(`[${fileName}] faixa ${h.num} (${h.title}) sem STYLE ou LYRICS`);
    }

    tracks.push({
      number: h.num,
      title: h.title,
      description,
      bpm: extractBpm(description),
      energy: mapEnergy(description),
      prompt,
      lyrics,
    });
  }

  if (tracks.length !== 10) {
    console.warn(`[${fileName}] esperava 10 faixas, encontrou ${tracks.length}`);
  }

  return { index: albumNumber, title: albumTitle, tracks };
}

/** Escapa string para template literal TypeScript: ` \\ ${ */
function escapeTpl(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function serializeAlbums(albums: ParsedAlbum[]): string {
  const sortedAlbums = [...albums].sort((a, b) => a.index - b.index);

  const albumBlocks = sortedAlbums.map((a) => {
    const meta = ALBUM_META[a.index];
    if (!meta) throw new Error(`Sem metadata para álbum ${a.index}`);

    const trackBlocks = a.tracks.map((t) => {
      const durationGuess = 240; // default 4 min — Suno cap; pode ser editado depois
      // Descrição editorial poética em PT (override) — não a linha técnica
      // do .md ("Hino · 100 BPM · viral"), que fica reservada para o parser
      // detectar a energia. Se não houver override, cai para a linha do .md.
      const overrideDesc = TRACK_DESCRIPTIONS[`${meta.slug}/${t.number}`];
      const description = overrideDesc ?? t.description;
      return `    {
      number: ${t.number},
      title: ${JSON.stringify(t.title)},
      description: ${JSON.stringify(description)},
      lang: "EN" as const,
      energy: ${JSON.stringify(t.energy)} as TrackEnergy,
      flavor: null,
      vocalMode: "solo" as VocalMode,
      prompt: \`${escapeTpl(t.prompt)}\`,
      lyrics: \`${escapeTpl(t.lyrics)}\`,
      durationSeconds: ${durationGuess},
      audioUrl: null,
    },`;
    }).join("\n");

    return `  {
    slug: ${JSON.stringify(meta.slug)},
    title: ${JSON.stringify(a.title)},
    subtitle: ${JSON.stringify(meta.subtitle)},
    artist: "NOVA",
    product: "nova" as const,
    color: ${JSON.stringify(meta.color)},
    status: "ready" as const,
    distribution: false,
    distrokidUploadDate: null,
    tracks: [
${trackBlocks}
    ],
  },`;
  }).join("\n");

  return `/**
 * NOVA — 10 álbuns × 10 faixas (100 faixas no total)
 *
 * Artista: NOVA
 * Conceito: pop ético/profético em PT/EN sobre uso saudável de tecnologia
 * Estilo: ethereal pop, voz feminina solo, electrónica luminosa
 *
 * Gerado por scripts/build-nova-albums.ts a partir dos prompts Suno em
 * /music-app/NOVA/NOVA_AlbumX_*.md. Para regenerar:
 *
 *   cd music-app && npx tsx scripts/build-nova-albums.ts
 *
 * NÃO EDITAR À MÃO — alterar os .md fonte e correr o script.
 */

import type { Album, TrackEnergy, VocalMode } from "./albums";

export const NOVA_ALBUMS: Album[] = [
${albumBlocks}
];
`;
}

function main() {
  const files = readdirSync(NOVA_DIR)
    .filter((f) => /^NOVA_Album\d+.*\.md$/.test(f))
    .map((f) => join(NOVA_DIR, f));

  if (files.length !== 10) {
    console.warn(`Esperava 10 ficheiros NOVA_Album*.md, encontrei ${files.length}`);
  }

  const albums = files.map(parseAlbum);
  const out = serializeAlbums(albums);
  writeFileSync(OUTPUT, out, "utf-8");

  const totalTracks = albums.reduce((s, a) => s + a.tracks.length, 0);
  console.log(`✓ Gerado ${OUTPUT}`);
  console.log(`  ${albums.length} álbuns, ${totalTracks} faixas no total`);
  for (const a of [...albums].sort((x, y) => x.index - y.index)) {
    console.log(`  · ${a.index.toString().padStart(2, "0")} ${a.title} (${a.tracks.length} faixas)`);
  }
}

main();
