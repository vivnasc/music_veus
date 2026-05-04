/**
 * verify-venna-albums
 *
 * Compara os blocos STYLE/LYRICS dos PARTE-{1..4}.md com prompt/lyrics
 * em src/data/venna-albums.ts. Garante que o que vai para o Suno é
 * carácter a carácter o que está nos .md fonte.
 *
 * Faixas reutilizadas (3.1, 5.1, 10.1) comparam-se contra a faixa
 * canónica do Álbum 1 (que é a sua origem).
 *
 * Usage:
 *   cd music-app && npx tsx scripts/verify-venna-albums.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { VENNA_ALBUMS } from "../src/data/venna-albums";

const REPO_ROOT = resolve(__dirname, "..", "..");
const PARTS = [1, 2, 3, 4].map((i) => resolve(REPO_ROOT, "VENNA", `PARTE-${i}.md`));

type RawTrack = { num: number; title: string; prompt: string; lyrics: string; reuse: boolean };

function parseAllParts(): Map<number, RawTrack[]> {
  const byAlbum = new Map<number, RawTrack[]>();
  for (const f of PARTS) {
    const raw = readFileSync(f, "utf-8");
    const albumStarts: { num: number; index: number }[] = [];
    const albumRe = /^#\s+ÁLBUM\s+(\d+)\s*[—-]\s*.+$/gm;
    let m: RegExpExecArray | null;
    while ((m = albumRe.exec(raw)) !== null) albumStarts.push({ num: Number(m[1]), index: m.index });
    for (let i = 0; i < albumStarts.length; i++) {
      const a = albumStarts[i];
      const end = i + 1 < albumStarts.length ? albumStarts[i + 1].index : raw.length;
      const sec = raw.slice(a.index, end);
      const tracks: RawTrack[] = [];
      const trackRe = /^##\s+\d+\.(\d+)\s*[—-]\s*(.+)$/gm;
      const trackStarts: { num: number; titleRaw: string; index: number }[] = [];
      let tm: RegExpExecArray | null;
      while ((tm = trackRe.exec(sec)) !== null) {
        trackStarts.push({ num: Number(tm[1]), titleRaw: tm[2].trim(), index: tm.index });
      }
      for (let j = 0; j < trackStarts.length; j++) {
        const ts = trackStarts[j];
        const tEnd = j + 1 < trackStarts.length ? trackStarts[j + 1].index : sec.length;
        const tsec = sec.slice(ts.index, tEnd);
        const reuse = /\(do\s+Álbum\s+\d+\)/i.test(ts.titleRaw);
        const styleM = tsec.match(/\*\*STYLE:\*\*\s*\n+```\s*\n([\s\S]*?)\n```/);
        const lyricsM = tsec.match(/\*\*LYRICS:\*\*\s*\n+```\s*\n([\s\S]*?)\n```/);
        // Limpar título igual ao parser
        const explicitTitle = ts.titleRaw
          .replace(/✅\s*\(?do\s+Álbum\s+\d+\)?/gi, "")
          .replace(/✅\s*APPROVED/gi, "")
          .replace(/✅/g, "")
          .replace(/🔞/g, "")
          .replace(/\(.*?\)/g, "")
          .trim();
        tracks.push({
          num: ts.num,
          title: explicitTitle,
          prompt: styleM ? styleM[1] : "",
          lyrics: lyricsM ? lyricsM[1] : "",
          reuse,
        });
      }
      byAlbum.set(a.num, tracks);
    }
  }
  return byAlbum;
}

function showDiff(label: string, expected: string, actual: string): void {
  console.log(`    ${label} difere — md:${expected.length} ts:${actual.length}`);
  const min = Math.min(expected.length, actual.length);
  for (let i = 0; i < min; i++) {
    if (expected[i] !== actual[i]) {
      console.log(`      pos ${i}: md=${JSON.stringify(expected[i])} ts=${JSON.stringify(actual[i])}`);
      console.log(`      ctx md: ${JSON.stringify(expected.slice(Math.max(0, i - 25), i + 25))}`);
      console.log(`      ctx ts: ${JSON.stringify(actual.slice(Math.max(0, i - 25), i + 25))}`);
      return;
    }
  }
}

function main() {
  const rawByAlbum = parseAllParts();

  // Album 1 canónico para resolver reuses
  const album1 = rawByAlbum.get(1) ?? [];
  const norm = (s: string) => s.toUpperCase().replace(/\s+/g, " ").replace(/[^A-Z0-9 ]/g, "").trim();
  const album1ByTitle = new Map<string, RawTrack>();
  for (const t of album1) album1ByTitle.set(norm(t.title), t);

  // Map nº de álbum a partir do slug
  const slugToNum: Record<string, number> = {
    "venna-mango-hour": 1, "venna-honey-cities": 2, "venna-slow-down": 3,
    "venna-wine-velvet": 4, "venna-saturday-forever": 5, "venna-closer": 6,
    "venna-skin-memory": 7, "venna-sunset-club": 8, "venna-heart-bassline": 9,
    "venna-tonight": 10,
  };

  let ok = 0, mismatch = 0;
  for (const a of VENNA_ALBUMS) {
    const num = slugToNum[a.slug];
    if (!num) { console.log(`✗ ${a.slug}: sem mapping`); continue; }
    const raw = rawByAlbum.get(num) ?? [];
    console.log(`\n## ${a.slug} (álbum ${num})`);
    for (const t of a.tracks) {
      const rawT = raw.find((x) => x.num === t.number);
      if (!rawT) { console.log(`  ✗ ${t.number} ${t.title}: sem md`); mismatch++; continue; }

      let mdPrompt = rawT.prompt;
      let mdLyrics = rawT.lyrics;
      if (rawT.reuse) {
        const canon = album1ByTitle.get(norm(rawT.title));
        if (!canon) { console.log(`  ✗ ${t.number} ${t.title}: reuse sem canónico`); mismatch++; continue; }
        mdPrompt = canon.prompt;
        mdLyrics = canon.lyrics;
      }
      const m1 = mdPrompt.trim() === t.prompt.trim();
      const m2 = mdLyrics.trim() === t.lyrics.trim();
      if (m1 && m2) {
        ok++;
        console.log(`  ✓ ${String(t.number).padStart(2, "0")} ${t.title}${rawT.reuse ? " (reuse)" : ""}`);
      } else {
        mismatch++;
        console.log(`  ✗ ${String(t.number).padStart(2, "0")} ${t.title}`);
        if (!m1) showDiff("prompt", mdPrompt.trim(), t.prompt.trim());
        if (!m2) showDiff("lyrics", mdLyrics.trim(), t.lyrics.trim());
      }
    }
  }
  console.log(`\n=== Resumo ===\nOK: ${ok}\nDivergem: ${mismatch}`);
  if (mismatch > 0) process.exit(1);
}

main();
