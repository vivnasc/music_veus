/**
 * vary-venna-bridges
 *
 * Varia a directiva header do [Bridge: ...] por mood do álbum, mantendo
 * o PT Lisbon como signature de VENNA (as letras PT por dentro são
 * únicas por canção, não tocar). Apenas o adjectivo de stage direction.
 *
 * Albums 1 e 4 — INTACTOS.
 *
 * Usage:
 *   cd music-app && npx tsx scripts/vary-venna-bridges.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REPO_ROOT = resolve(__dirname, "..", "..");
const PARTS = [1, 2, 3, 4].map((i) => resolve(REPO_ROOT, "VENNA", `PARTE-${i}.md`));

const ALBUM_BRIDGE_HEADER: Record<number, string> = {
  1:  "[Bridge: PT Lisbon accent, intimate evening warmth]",
  2:  "[Bridge: PT Lisbon accent, intimate hush, urban warmth]",
  3:  "[Bridge: PT Lisbon accent, calm authority, smile under the line]",
  4:  "[Bridge: PT Lisbon accent, adult sensuality, candlelit and slow]",
  5:  "[Bridge: PT Lisbon accent, declarative and joyful]",
  6:  "[Bridge: PT Lisbon accent, soft and held, breath close]",
  7:  "[Bridge: PT Lisbon accent, sultry whisper, breath caught]",
  8:  "[Bridge: PT Lisbon accent, easy and warm, settled in]",
  9:  "[Bridge: PT Lisbon accent, anthemic, full chest]",
  10: "[Bridge: PT Lisbon accent, powerful and grounded]",
};

function shouldSkipAlbum(_n: number): boolean { return false; }

function processFile(filePath: string): { changed: number } {
  let raw = readFileSync(filePath, "utf-8");
  const trackHeaderRe = /^##\s+(\d+)\.(\d+)\s*[—-]\s*.+$/gm;
  const headers: { albumNum: number; trackNum: number; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = trackHeaderRe.exec(raw)) !== null) {
    headers.push({ albumNum: Number(m[1]), trackNum: Number(m[2]), index: m.index });
  }

  let changed = 0;
  for (let i = headers.length - 1; i >= 0; i--) {
    const h = headers[i];
    if (shouldSkipAlbum(h.albumNum)) continue;
    const newHeader = ALBUM_BRIDGE_HEADER[h.albumNum];
    if (!newHeader) continue;

    const sectionEnd = i + 1 < headers.length ? headers[i + 1].index : raw.length;
    const sectionStart = h.index;
    const section = raw.slice(sectionStart, sectionEnd);

    // Match original bridge header: [Bridge: European Portuguese, Lisbon accent, NOT Brazilian...]
    // Some have suffix like "— sultry" or extra. Replace the entire line.
    // Only process bridges that contain "European Portuguese" AND "Lisbon" in the directive
    // (skips French / Spanish bridges which we don't touch).
    const bridgeRe = /^\[Bridge: European Portuguese[^\n\]]*\]/m;
    const bm = section.match(bridgeRe);
    if (!bm) continue; // bridge is in another language (French/Spanish), don't touch

    const newSection = section.replace(bridgeRe, newHeader);
    if (newSection === section) continue;

    raw = raw.slice(0, sectionStart) + newSection + raw.slice(sectionEnd);
    changed++;
  }

  writeFileSync(filePath, raw, "utf-8");
  return { changed };
}

function main() {
  let total = 0;
  for (const f of PARTS) {
    const r = processFile(f);
    console.log(`${f.split("/").pop()}: ${r.changed} bridge headers variados`);
    total += r.changed;
  }
  console.log(`\nTotal: ${total} bridges com directiva mood-específica.`);
}

main();
