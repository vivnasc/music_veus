/**
 * Valida docs/loranne-mood-tags.json:
 *  - cobertura: cada faixa de loranne-tracks-produced.json tem mood
 *  - moods válidos: 7 categorias permitidas
 *  - distribuição: nenhum mood < 5%
 *  - rationale: <=12 palavras, sem vocabulário proibido
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const VALID_MOODS = new Set([
  "elevar", "aterrar", "acordar", "lembrar",
  "reunir-se", "respirar", "atravessar"
]);
const FORBIDDEN = ["manifestar", "vibração", "energia espiritual", "frequência", "despertar", "tribo"];

const tracks = JSON.parse(readFileSync(path.join(ROOT, "docs/loranne-tracks-produced.json"), "utf8"));
const moods = JSON.parse(readFileSync(path.join(ROOT, "docs/loranne-mood-tags.json"), "utf8"));

let totalTracks = 0;
const errors: string[] = [];
const warnings: string[] = [];
const moodCount: Record<string, number> = {};
for (const m of VALID_MOODS) moodCount[m] = 0;

const trackSlugs = new Set(Object.keys(tracks));
const moodSlugs = new Set(Object.keys(moods));

for (const slug of trackSlugs) {
  if (!moodSlugs.has(slug)) {
    errors.push(`Album sem moods: ${slug}`);
    continue;
  }
  for (const n of Object.keys(tracks[slug])) {
    totalTracks++;
    const entry = moods[slug]?.[n];
    if (!entry) {
      errors.push(`Falta mood: ${slug}/${n}`);
      continue;
    }
    if (!Array.isArray(entry.mood) || entry.mood.length < 1 || entry.mood.length > 2) {
      errors.push(`Mood deve ter 1-2 entries: ${slug}/${n} -> ${JSON.stringify(entry.mood)}`);
    }
    for (const m of entry.mood) {
      if (!VALID_MOODS.has(m)) errors.push(`Mood inválido em ${slug}/${n}: ${m}`);
      else moodCount[m]++;
    }
    if (typeof entry.rationale !== "string" || !entry.rationale) {
      errors.push(`Rationale em falta: ${slug}/${n}`);
    } else {
      const words = entry.rationale.split(/\s+/).filter(Boolean);
      if (words.length > 12) {
        warnings.push(`Rationale > 12 palavras (${words.length}) em ${slug}/${n}: ${entry.rationale}`);
      }
      const lower = entry.rationale.toLowerCase();
      for (const f of FORBIDDEN) {
        if (lower.includes(f)) errors.push(`Vocabulário proibido '${f}' em ${slug}/${n}: ${entry.rationale}`);
      }
    }
  }
}

for (const slug of moodSlugs) {
  if (!trackSlugs.has(slug)) errors.push(`Mood para álbum não produzido: ${slug}`);
  else {
    for (const n of Object.keys(moods[slug])) {
      if (!tracks[slug]?.[n]) errors.push(`Mood para faixa não produzida: ${slug}/${n}`);
    }
  }
}

console.log(`Faixas auditadas: ${totalTracks}`);
console.log("\nDistribuição (% de faixas — mood-occurrences):");
const minPct = 5;
const minCount = Math.ceil((totalTracks * minPct) / 100);
console.log(`Mínimo 5% = ${minCount} faixas\n`);
for (const m of VALID_MOODS) {
  const c = moodCount[m];
  const pct = ((c / totalTracks) * 100).toFixed(1);
  const flag = c < minCount ? " ⚠ ABAIXO DO MÍNIMO" : "";
  console.log(`  ${m.padEnd(12)} ${String(c).padStart(3)}  (${pct}%)${flag}`);
}

if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} avisos:`);
  warnings.forEach((w) => console.log("  " + w));
}
if (errors.length) {
  console.log(`\n✗  ${errors.length} erros:`);
  errors.forEach((e) => console.log("  " + e));
  process.exit(1);
}
console.log("\n✓ Validação OK");
