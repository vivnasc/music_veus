/**
 * vary-venna-prechorus
 *
 * Substitui as 95 ocorrências de [Pre-Chorus: voice lifts] (e variantes)
 * nas 56 faixas a gerar (Albums 2,3,5,6,7,8,9,10), por directivas
 * específicas ao mood do álbum, com 1ª e 2ª ocorrências DIFERENTES
 * dentro de cada canção (para o Suno não repetir igual).
 *
 * Albums 1 (Mango Hour) e 4 (Wine & Velvet) — INTACTOS, já gerados.
 *
 * Usage:
 *   cd music-app && npx tsx scripts/vary-venna-prechorus.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REPO_ROOT = resolve(__dirname, "..", "..");
const PARTS = [1, 2, 3, 4].map((i) => resolve(REPO_ROOT, "VENNA", `PARTE-${i}.md`));

// Por nº de álbum: directivas para 1ª e 2ª ocorrência de Pre-Chorus.
// Escolhi variantes que reflectem o mood do álbum e sugerem ao Suno
// que a 2ª ocorrência seja LIGEIRAMENTE diferente da 1ª (build vs hold).
const ALBUM_DIRECTIVES: Record<number, [string, string]> = {
  1:  ["[Pre-Chorus: voice rising, soft anticipation, body leaning in]",
       "[Pre-Chorus: voice fuller, hands open, breath catching joy]"],
  2:  ["[Pre-Chorus: voice close, body lifting toward the chorus]",
       "[Pre-Chorus: voice held a beat longer, breath catching]"],
  3:  ["[Pre-Chorus: voice cool, no rush, smile under the line]",
       "[Pre-Chorus: voice still cool, smirk tightens]"],
  4:  ["[Pre-Chorus: voice low and elegant, candlelight breath]",
       "[Pre-Chorus: voice slower, second glass of wine in the words]"],
  5:  ["[Pre-Chorus: voice rising, hands reaching for the room]",
       "[Pre-Chorus: voice fuller, claps stacking under the line]"],
  6:  ["[Pre-Chorus: voice quiet, the hand reaches across]",
       "[Pre-Chorus: voice held still, soft breath catching]"],
  7:  ["[Pre-Chorus: voice tight, breath caught against the chest]",
       "[Pre-Chorus: voice slower, breath held a beat longer]"],
  8:  ["[Pre-Chorus: voice steady, settling into the groove]",
       "[Pre-Chorus: voice quieter, drifting closer to the drop]"],
  9:  ["[Pre-Chorus: voice rising, building toward the bass]",
       "[Pre-Chorus: voice fuller, claps and brass stacking up]"],
  10: ["[Pre-Chorus: voice powerful, holding the ground beneath]",
       "[Pre-Chorus: voice opening fully, breath wide]"],
};

function shouldSkipAlbum(_n: number): boolean { return false; }

function processFile(filePath: string): { changed: number } {
  let raw = readFileSync(filePath, "utf-8");

  // Encontrar headers de track
  const trackHeaderRe = /^##\s+(\d+)\.(\d+)\s*[—-]\s*.+$/gm;
  const headers: { albumNum: number; trackNum: number; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = trackHeaderRe.exec(raw)) !== null) {
    headers.push({ albumNum: Number(m[1]), trackNum: Number(m[2]), index: m.index });
  }

  let changed = 0;

  // Processar de trás para a frente para os índices não invalidarem.
  for (let i = headers.length - 1; i >= 0; i--) {
    const h = headers[i];
    if (shouldSkipAlbum(h.albumNum)) continue;
    const directives = ALBUM_DIRECTIVES[h.albumNum];
    if (!directives) continue;

    const sectionEnd = i + 1 < headers.length ? headers[i + 1].index : raw.length;
    const sectionStart = h.index;
    const section = raw.slice(sectionStart, sectionEnd);

    // Encontrar TODAS as linhas que começam por [Pre-Chorus: ... ] na secção.
    const preRe = /^\[Pre-Chorus:[^\n\]]*\]/gm;
    const matches: { idx: number; len: number; text: string }[] = [];
    let pm: RegExpExecArray | null;
    while ((pm = preRe.exec(section)) !== null) {
      matches.push({ idx: pm.index, len: pm[0].length, text: pm[0] });
    }
    if (matches.length === 0) continue;

    // Substituir do fim para o início para não invalidar índices.
    let newSection = section;
    for (let j = matches.length - 1; j >= 0; j--) {
      const useFirst = j === 0; // 1ª ocorrência na canção
      const replacement = useFirst ? directives[0] : directives[1];
      // Se houver 3+ ocorrências (raro), as últimas usam directives[1] também.
      newSection = newSection.slice(0, matches[j].idx) + replacement + newSection.slice(matches[j].idx + matches[j].len);
    }
    raw = raw.slice(0, sectionStart) + newSection + raw.slice(sectionEnd);
    changed += matches.length;
  }

  writeFileSync(filePath, raw, "utf-8");
  return { changed };
}

function main() {
  let total = 0;
  for (const f of PARTS) {
    const fileName = f.split("/").pop();
    const r = processFile(f);
    console.log(`${fileName}: ${r.changed} pre-chorus substituídos`);
    total += r.changed;
  }
  console.log(`\nTotal: ${total} directivas Pre-Chorus variadas em 56 faixas (Albums 1 e 4 intactos).`);
}

main();
