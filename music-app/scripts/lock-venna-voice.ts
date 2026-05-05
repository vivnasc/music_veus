/**
 * lock-venna-voice
 *
 * Blinda o bloco [Vocal: ...] + [CRITICAL: ...] no topo de cada
 * LYRICS de PARTE-{1..4}.md. Substitui pela versão LOCKED — idêntica
 * entre todas as faixas — para que o Suno gere a mesma voz em cada
 * track sem precisar da Persona via API.
 *
 * Pula Album 1 (Mango Hour) e Album 4 (Wine & Velvet) — já gerados.
 *
 * Preserva CRITICAL extras (French/Spanish) que aparecem DEPOIS do
 * bloco padrão de 3 linhas [Vocal/CRITICAL PT/CRITICAL EN].
 *
 * Usage:
 *   cd music-app && npx tsx scripts/lock-venna-voice.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const REPO_ROOT = resolve(__dirname, "..", "..");
const PARTS = [1, 2, 3, 4].map((i) => resolve(REPO_ROOT, "VENNA", `PARTE-${i}.md`));

// Bloco BLINDADO — idêntico em todas as 56 faixas (Albums 2,3,5,6,7,8,9,10).
// Suno não consegue ir buscar referências por nome, então a única coisa que
// realmente prende a voz é o conjunto de parâmetros vocais detalhados,
// repetidos byte-a-byte em cada track. Isso garante que cada geração fica
// dentro do mesmo perfil — não é a mesma voz exacta (sem Persona é
// impossível), mas é consistentemente o MESMO PERFIL.
const LOCKED_BLOCK = `[VENNA — LOCKED VOCAL PROFILE — identical parameters across every track]
[Vocal: ONE warm mezzo-soprano female voice, smoky speaking quality, slight rasp on sustained notes, breathy and confident, sings close to the microphone, layered airy harmonies on choruses, no melisma, no belting, no vibrato, no autotune]
[CRITICAL: European Portuguese (Lisbon accent), NOT Brazilian, NOT African — soft Lisbon "s" and "ch" sounds]
[CRITICAL: subtle international English accent, NOT American — clean consonants, soft R]`;

// Detecta secções a saltar (Album 1 e Album 4).
function shouldSkipAlbum(albumNumber: number): boolean {
  return albumNumber === 1 || albumNumber === 4;
}

function processFile(filePath: string): { changed: number; skipped: number } {
  let raw = readFileSync(filePath, "utf-8");
  let changed = 0;
  let skipped = 0;

  // Encontra cada faixa: ## N.M — TITLE seguido de bloco LYRICS dentro de ```
  // Vamos processar a partir do header e identificar a posição de [Vocal: ...]
  // dentro do bloco de letras.
  const trackHeaderRe = /^##\s+(\d+)\.(\d+)\s*[—-]\s*.+$/gm;
  const headerMatches: { albumNum: number; trackNum: number; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = trackHeaderRe.exec(raw)) !== null) {
    headerMatches.push({
      albumNum: Number(m[1]),
      trackNum: Number(m[2]),
      index: m.index,
    });
  }

  // Processar de trás para a frente para os índices não invalidarem.
  for (let i = headerMatches.length - 1; i >= 0; i--) {
    const h = headerMatches[i];
    if (shouldSkipAlbum(h.albumNum)) {
      skipped++;
      continue;
    }
    const sectionEnd = i + 1 < headerMatches.length ? headerMatches[i + 1].index : raw.length;
    const sectionStart = h.index;
    const section = raw.slice(sectionStart, sectionEnd);

    // Encontra a primeira ocorrência de [Vocal: ...] na secção.
    const vocalIdx = section.indexOf("[Vocal:");
    if (vocalIdx === -1) {
      console.warn(`  [${h.albumNum}.${h.trackNum}] sem [Vocal: ...] — pulado`);
      continue;
    }

    // A partir do [Vocal: ...], consumir linha a linha enquanto começarem por
    // [Vocal: ou [CRITICAL: . As CRITICAL para EU PT e EN são absorvidas no
    // LOCKED block; outras (French, Spanish) são preservadas APÓS o bloco.
    const lines = section.slice(vocalIdx).split("\n");
    const headerLines: string[] = [];
    let consumed = 0;
    for (const line of lines) {
      if (line.startsWith("[Vocal:") || line.startsWith("[CRITICAL:")) {
        headerLines.push(line);
        consumed += line.length + 1; // +1 for \n
      } else {
        break;
      }
    }
    // Sometimes the last line has no trailing newline counted — adjust if it was the very last line of the block
    // Be conservative: don't consume more than headerLines.length \n
    const totalConsumed = headerLines.reduce((s, l) => s + l.length, 0) + headerLines.length; // n lines + n newlines

    // Identificar CRITICAL lines a preservar (não-padrão).
    const isStandardCritical = (l: string): boolean => {
      const lower = l.toLowerCase();
      if (l.startsWith("[Vocal:")) return true;
      if (lower.includes("european portuguese") && lower.includes("lisbon")) return true;
      if (lower.includes("international english accent")) return true;
      if (lower.includes("same singer") || lower.includes("locked vocal")) return true; // already locked
      return false;
    };

    const extraCriticals = headerLines.filter((l) => l.startsWith("[CRITICAL:") && !isStandardCritical(l));

    // Build new header block: LOCKED + extras
    const newHeader = extraCriticals.length > 0
      ? LOCKED_BLOCK + "\n" + extraCriticals.join("\n")
      : LOCKED_BLOCK;

    // Substituir no raw: posição absoluta = sectionStart + vocalIdx, length = totalConsumed
    const absVocalStart = sectionStart + vocalIdx;
    const absHeaderEnd = absVocalStart + totalConsumed;
    raw = raw.slice(0, absVocalStart) + newHeader + "\n" + raw.slice(absHeaderEnd);
    changed++;
  }

  writeFileSync(filePath, raw, "utf-8");
  return { changed, skipped };
}

function main() {
  let totalChanged = 0;
  let totalSkipped = 0;
  for (const f of PARTS) {
    const fileName = f.split("/").pop();
    const r = processFile(f);
    console.log(`${fileName}: blindadas ${r.changed}, puladas (album 1/4) ${r.skipped}`);
    totalChanged += r.changed;
    totalSkipped += r.skipped;
  }
  console.log(`\nTotal: ${totalChanged} faixas blindadas, ${totalSkipped} puladas (Albums 1 e 4 já gerados).`);
}

main();
