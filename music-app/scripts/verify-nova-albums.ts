/**
 * verify-nova-albums
 *
 * Compara os blocos STYLE / LYRICS dos 10 ficheiros .md com os campos
 * prompt / lyrics em src/data/nova-albums.ts (depois de o módulo ser
 * carregado e o template literal resolvido).
 *
 * Saída: para cada faixa, indica se prompt e lyrics são iguais byte a
 * byte. Mostra diffs quando há divergência.
 *
 * Usage:
 *   cd music-app && npx tsx scripts/verify-nova-albums.ts
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { NOVA_ALBUMS } from "../src/data/nova-albums";

const NOVA_DIR = resolve(__dirname, "..", "NOVA");

type RawTrack = {
  number: number;
  title: string;
  prompt: string;
  lyrics: string;
};

function parseRawTracks(filePath: string): { albumIndex: number; tracks: RawTrack[] } {
  const raw = readFileSync(filePath, "utf-8");
  const fileName = filePath.split("/").pop() || "";
  const numMatch = fileName.match(/Album(\d+)/);
  if (!numMatch) throw new Error(`Sem número: ${fileName}`);
  const albumIndex = Number(numMatch[1]);

  const headerRegex = /^#\s*(\d{2})\s*·\s*(.+)$/gm;
  const headers: { num: number; title: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = headerRegex.exec(raw)) !== null) {
    headers.push({ num: Number(m[1]), title: m[2].trim(), index: m.index });
  }

  const tracks: RawTrack[] = [];
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    const start = h.index;
    const end = i + 1 < headers.length ? headers[i + 1].index : raw.length;
    const section = raw.slice(start, end);

    const styleMatch = section.match(/###\s*STYLE\s*\n+```[a-z]*\n([\s\S]*?)```/i);
    const lyricsMatch = section.match(/###\s*LYRICS\s*\n+```[a-z]*\n([\s\S]*?)```/i);
    tracks.push({
      number: h.num,
      title: h.title,
      prompt: styleMatch ? styleMatch[1] : "",
      lyrics: lyricsMatch ? lyricsMatch[1] : "",
    });
  }
  return { albumIndex, tracks };
}

function showDiff(label: string, expected: string, actual: string): void {
  console.log(`    ${label} difere`);
  console.log(`      esperado (md, ${expected.length} chars):`);
  console.log("      " + JSON.stringify(expected.slice(0, 80)));
  console.log(`      actual   (ts, ${actual.length} chars):`);
  console.log("      " + JSON.stringify(actual.slice(0, 80)));
  // Procura primeiro carácter divergente
  const min = Math.min(expected.length, actual.length);
  for (let i = 0; i < min; i++) {
    if (expected[i] !== actual[i]) {
      console.log(`      primeira diferença em pos ${i}: md=${JSON.stringify(expected[i])} ts=${JSON.stringify(actual[i])}`);
      console.log(`      contexto md: ${JSON.stringify(expected.slice(Math.max(0, i - 20), i + 20))}`);
      console.log(`      contexto ts: ${JSON.stringify(actual.slice(Math.max(0, i - 20), i + 20))}`);
      return;
    }
  }
  if (expected.length !== actual.length) {
    console.log(`      diferença é só no comprimento; um termina antes`);
  }
}

function main() {
  const files = readdirSync(NOVA_DIR)
    .filter((f) => /^NOVA_Album\d+.*\.md$/.test(f))
    .map((f) => join(NOVA_DIR, f));

  const albumByIndex = new Map<number, ReturnType<typeof parseRawTracks>>();
  for (const f of files) {
    const r = parseRawTracks(f);
    albumByIndex.set(r.albumIndex, r);
  }

  let okCount = 0;
  let mismatchCount = 0;

  for (const a of NOVA_ALBUMS) {
    // slug: nova-static -> 1, nova-skin -> 2, etc. Encontrar pelo título
    const slug = a.slug;
    // Mapping conhecido — slugs em ordem
    const slugOrder = [
      "nova-static", "nova-skin", "nova-machine", "nova-alone", "nova-burn",
      "nova-water", "nova-air", "nova-time", "nova-love", "nova-light",
    ];
    const idx = slugOrder.indexOf(slug) + 1;
    const raw = albumByIndex.get(idx);
    if (!raw) {
      console.log(`✗ ${slug}: não encontrei .md correspondente`);
      mismatchCount++;
      continue;
    }

    console.log(`\n## ${slug} (álbum ${idx} / ${a.title})`);

    for (const t of a.tracks) {
      const rawT = raw.tracks.find((x) => x.number === t.number);
      if (!rawT) {
        console.log(`  ✗ faixa ${t.number} (${t.title}): sem correspondência no .md`);
        mismatchCount++;
        continue;
      }

      // Compara byte-a-byte. O parser fez .trim() ao capturar (remove só os
      // newlines que markdown coloca entre ``` e o conteúdo — não fazem
      // parte do texto colado no Suno). Aplicamos o mesmo trim aqui para
      // justa comparação. Qualquer carácter alterado dentro do conteúdo
      // aparece como divergência.
      const mdPrompt = rawT.prompt.trim();
      const mdLyrics = rawT.lyrics.trim();
      const tsPrompt = t.prompt;
      const tsLyrics = t.lyrics;

      const promptOk = mdPrompt === tsPrompt;
      const lyricsOk = mdLyrics === tsLyrics;

      if (promptOk && lyricsOk) {
        okCount++;
        // Imprimir só uma marca compacta
        console.log(`  ✓ ${String(t.number).padStart(2, "0")} ${t.title}`);
      } else {
        mismatchCount++;
        console.log(`  ✗ ${String(t.number).padStart(2, "0")} ${t.title}`);
        if (!promptOk) showDiff("prompt", mdPrompt, tsPrompt);
        if (!lyricsOk) showDiff("lyrics", mdLyrics, tsLyrics);
      }
    }
  }

  console.log(`\n=== Resumo ===`);
  console.log(`OK:        ${okCount}`);
  console.log(`Divergem:  ${mismatchCount}`);
  if (mismatchCount > 0) process.exit(1);
}

main();
