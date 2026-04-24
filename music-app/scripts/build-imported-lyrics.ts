/**
 * build-imported-lyrics
 *
 * Lê os ficheiros em /LETRAS-IMPORTADAS/*.md (fonte humana) e gera
 * src/data/lyrics-importadas.ts — TypeScript tipado, versionado em git,
 * importado pelo ALL_LYRICS em albums.ts.
 *
 * Assim, as letras importadas passam a ter a mesma "dignidade" que as
 * geradas por código: não podem ser apagadas por engano na UI (apenas
 * sobrescritas via track_custom_lyrics, que é override por cima).
 *
 * Fluxo para adicionar novas letras:
 *   1. Colocar .md em /LETRAS-IMPORTADAS/ (formato: ver exemplo).
 *   2. Registar o mapping filename → albumSlug em MD_TO_SLUG abaixo.
 *   3. Correr: `npx tsx scripts/build-imported-lyrics.ts` na raiz de music-app.
 *   4. Commit do lyrics-importadas.ts gerado.
 *
 * Usage:
 *   cd music-app && npx tsx scripts/build-imported-lyrics.ts
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { resolve, join, basename } from "path";

const REPO_ROOT = resolve(__dirname, "..", "..");
const MD_DIR = join(REPO_ROOT, "LETRAS-IMPORTADAS");
const OUTPUT = resolve(__dirname, "..", "src", "data", "lyrics-importadas.ts");

/**
 * Mapping dos nomes de ficheiro para os slugs dos álbuns.
 * O prefixo "pele-" é o nome antigo da colecção (agora "nua"), por isso
 * é necessário um registo explícito — não podemos derivar do nome.
 */
const MD_TO_SLUG: Record<string, string> = {
  "pele-por-dentro-letras.md": "nua-por-dentro",
  "pele-inteira-letras.md": "nua-inteira",
  "pele-boa-letras.md": "nua-boa",
};

type ParsedTrack = { number: number; title: string; lyrics: string };

/**
 * Parser de um ficheiro .md individual.
 *
 * Formato esperado (por faixa):
 *
 *   ## 01. Title
 *   *Descrição em itálico*
 *   Energia: X | Língua: Y | Sabor: Z
 *
 *   [Verse 1]
 *   ...letra...
 *
 *   [Chorus]
 *   ...letra...
 *
 *   ---
 *
 * Apenas o bloco entre a linha em branco após a metadata e o `---` é a letra.
 */
function parseMarkdown(md: string): ParsedTrack[] {
  const tracks: ParsedTrack[] = [];
  // Quebrar em secções mantendo o número + título
  const sectionRe = /^## (\d{1,2})\.\s+(.+?)$/gm;
  const matches: { index: number; number: number; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = sectionRe.exec(md)) !== null) {
    matches.push({ index: m.index, number: parseInt(m[1], 10), title: m[2].trim() });
  }
  for (let i = 0; i < matches.length; i++) {
    const { number, title } = matches[i];
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length;
    const body = md.slice(start, end);
    // Saltar o cabeçalho + metadata: primeira linha em branco marca o início
    const lines = body.split("\n");
    let lyricsStart = -1;
    for (let j = 1; j < lines.length; j++) {
      if (j >= 2 && lines[j].trim() === "" && lyricsStart === -1) {
        lyricsStart = j + 1;
        break;
      }
    }
    if (lyricsStart === -1) continue;
    const lyricLines: string[] = [];
    for (let j = lyricsStart; j < lines.length; j++) {
      if (lines[j].trim() === "---") break;
      lyricLines.push(lines[j]);
    }
    const lyrics = lyricLines.join("\n").trim();
    if (!lyrics || lyrics === "*(letra em falta)*") continue;
    tracks.push({ number, title, lyrics });
  }
  return tracks;
}

function escapeTemplate(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function main() {
  const files = readdirSync(MD_DIR).filter((f) => f.endsWith(".md"));
  const entries: { key: string; title: string; lyrics: string; source: string }[] = [];
  const unmapped: string[] = [];

  for (const file of files) {
    const slug = MD_TO_SLUG[file];
    if (!slug) {
      unmapped.push(file);
      continue;
    }
    const md = readFileSync(join(MD_DIR, file), "utf-8");
    const tracks = parseMarkdown(md);
    for (const t of tracks) {
      entries.push({
        key: `${slug}/${t.number}`,
        title: t.title,
        lyrics: t.lyrics,
        source: file,
      });
    }
  }

  if (unmapped.length > 0) {
    console.warn(
      "[build-imported-lyrics] sem mapping (adiciona em MD_TO_SLUG):\n" +
        unmapped.map((f) => `  - ${f}`).join("\n"),
    );
  }

  // Gerar TypeScript
  let out = "";
  out += "// AUTO-GERADO por scripts/build-imported-lyrics.ts\n";
  out += "// Não editar à mão — as fontes de verdade são os .md em /LETRAS-IMPORTADAS/.\n";
  out += "// Para regenerar: cd music-app && npx tsx scripts/build-imported-lyrics.ts\n";
  out += "//\n";
  out += `// Última geração: ${new Date().toISOString()}\n`;
  out += `// ${entries.length} letras em ${files.length - unmapped.length} ficheiro(s).\n\n`;
  out += "export const IMPORTADAS_LYRICS: Record<string, string> = {\n";
  for (const e of entries) {
    out += `  // ${e.key} — ${e.title} (${e.source})\n`;
    out += `  ${JSON.stringify(e.key)}: \`${escapeTemplate(e.lyrics)}\`,\n`;
  }
  out += "};\n";

  writeFileSync(OUTPUT, out, "utf-8");
  console.log(
    `[build-imported-lyrics] ${entries.length} letras escritas em ${OUTPUT}`,
  );
}

main();
