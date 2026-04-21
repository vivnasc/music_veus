/**
 * Ancient Ground — Calendário de Lançamentos
 *
 * 49 singles instrumentais africanos meditativos.
 * Ritmo: 1 single por semana, às sextas-feiras.
 *
 * Já publicado:
 *   - 17 Abr 2026: #1 Before the Birds (Loop A)
 *
 * Próximo: 24 Abr 2026 (#2 Before the Birds Loop B).
 * Depois férias → regresso a 8 Mai 2026 e depois sexta a sexta.
 *
 * Cada "single" na lista ANCIENT_GROUND_SINGLES corresponde a 2 faixas no
 * Supabase (faixa-XX e faixa-XX II) — variações do mesmo loop de 1h. Para
 * o calendário público só publicamos 1 single por sexta.
 */

import { ANCIENT_GROUND_SINGLES } from "./ancient-ground-singles";

export type AncientGroundRelease = {
  date: string; // YYYY-MM-DD — dia de lançamento no Spotify
  singleNumber: number;
  title: string;
};

/** Gera uma lista de sextas-feiras consecutivas a partir de uma data. */
function nextFridays(from: Date, count: number): Date[] {
  const dates: Date[] = [];
  const cur = new Date(from);
  while (dates.length < count) {
    if (cur.getDay() === 5) dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Constrói o calendário:
 *  - #1 → 17 Abr 2026 (já publicado)
 *  - #2 → 24 Abr 2026 (próximo)
 *  - Pausa de 2 semanas (férias)
 *  - #3 → 8 Mai 2026 (regresso)
 *  - #4+ → sextas consecutivas
 */
function buildSchedule(): AncientGroundRelease[] {
  const schedule: AncientGroundRelease[] = [];
  const fixedDates = ["2026-04-17", "2026-04-24", "2026-05-08"];

  for (let i = 0; i < ANCIENT_GROUND_SINGLES.length; i++) {
    const s = ANCIENT_GROUND_SINGLES[i];
    let date: string;
    if (i < fixedDates.length) {
      date = fixedDates[i];
    } else {
      // Sexta seguinte a 8 Mai 2026 + (i - 3) semanas
      const base = new Date(2026, 4, 8); // May = 4 (0-indexed)
      base.setDate(base.getDate() + (i - 2) * 7); // i=3 → +7 = 15 Mai
      date = iso(base);
    }
    schedule.push({ date, singleNumber: s.number, title: s.title });
  }

  // Validação: garantir que cada data cai à sexta
  for (const r of schedule) {
    const d = new Date(r.date);
    if (d.getDay() !== 5) {
      console.warn(`[ancient-ground-calendar] ${r.date} não é sexta-feira.`);
    }
  }

  return schedule;
}

export const ANCIENT_GROUND_RELEASES: AncientGroundRelease[] = buildSchedule();

/** Lookup rápido: número do single → data ISO. */
export const ANCIENT_GROUND_DATES: Record<number, string> = Object.fromEntries(
  ANCIENT_GROUND_RELEASES.map((r) => [r.singleNumber, r.date]),
);

/** Lookup inverso: data ISO → single. */
export const ANCIENT_GROUND_BY_DATE: Record<string, AncientGroundRelease> = Object.fromEntries(
  ANCIENT_GROUND_RELEASES.map((r) => [r.date, r]),
);

// Referência para uso externo
void nextFridays;
