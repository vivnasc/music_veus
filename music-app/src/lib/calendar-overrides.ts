/**
 * Calendar overrides — persistem em localStorage para que a Vivianne possa
 * alterar datas de lançamento (Loranne + Ancient Ground) sem precisar de
 * deploy do código.
 *
 * Chave única: "veus:calendar-overrides-v1".
 *
 * A fonte de verdade continua a ser LORANNE_RELEASES / ANCIENT_GROUND_RELEASES
 * (em `src/data/`). Esta camada aplica por cima um conjunto de overrides:
 *  - `date`: substitui a data de um lançamento
 *  - `skip`: remove totalmente o lançamento do calendário
 *
 * Use os helpers `getEffective*()` em vez de ler os arrays base.
 */

import {
  LORANNE_RELEASES,
  type LoranneRelease,
} from "@/data/production-calendar";
import {
  ANCIENT_GROUND_RELEASES,
  type AncientGroundRelease,
} from "@/data/ancient-ground-calendar";

const LS_KEY = "veus:calendar-overrides-v1";

export type LoranneOverride = { date?: string; skip?: boolean };
export type AncientGroundOverride = { date?: string; skip?: boolean };

export type CalendarOverrides = {
  loranne: Record<string, LoranneOverride>; // key = albumSlug
  ancientGround: Record<string, AncientGroundOverride>; // key = singleNumber as string
};

const EMPTY: CalendarOverrides = { loranne: {}, ancientGround: {} };

export function loadOverrides(): CalendarOverrides {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<CalendarOverrides>;
    return {
      loranne: parsed.loranne ?? {},
      ancientGround: parsed.ancientGround ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export function saveOverrides(ov: CalendarOverrides): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(ov));
  } catch {
    // quota / privacy mode — ignorar silenciosamente
  }
}

export function updateLoranneOverride(slug: string, patch: LoranneOverride): CalendarOverrides {
  const cur = loadOverrides();
  const next: CalendarOverrides = {
    ...cur,
    loranne: { ...cur.loranne, [slug]: { ...cur.loranne[slug], ...patch } },
  };
  saveOverrides(next);
  return next;
}

export function clearLoranneOverride(slug: string): CalendarOverrides {
  const cur = loadOverrides();
  const { [slug]: _removed, ...rest } = cur.loranne;
  void _removed;
  const next: CalendarOverrides = { ...cur, loranne: rest };
  saveOverrides(next);
  return next;
}

export function updateAncientGroundOverride(num: number, patch: AncientGroundOverride): CalendarOverrides {
  const cur = loadOverrides();
  const key = String(num);
  const next: CalendarOverrides = {
    ...cur,
    ancientGround: { ...cur.ancientGround, [key]: { ...cur.ancientGround[key], ...patch } },
  };
  saveOverrides(next);
  return next;
}

export function clearAncientGroundOverride(num: number): CalendarOverrides {
  const cur = loadOverrides();
  const key = String(num);
  const { [key]: _removed, ...rest } = cur.ancientGround;
  void _removed;
  const next: CalendarOverrides = { ...cur, ancientGround: rest };
  saveOverrides(next);
  return next;
}

/**
 * Aplicar overrides à lista base de lançamentos Loranne.
 * Remove os que têm `skip: true` e troca a data quando definida.
 * Resultado ordenado por data crescente.
 */
export function getEffectiveLoranneReleases(ov?: CalendarOverrides): LoranneRelease[] {
  const overrides = ov ?? loadOverrides();
  const out: LoranneRelease[] = [];
  for (const r of LORANNE_RELEASES) {
    const o = overrides.loranne[r.albumSlug];
    if (o?.skip) continue;
    out.push({ ...r, date: o?.date || r.date });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

/** Mapa slug → data efectiva (após overrides). */
export function getEffectiveLoranneDates(ov?: CalendarOverrides): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of getEffectiveLoranneReleases(ov)) out[r.albumSlug] = r.date;
  return out;
}

export function getEffectiveAncientGroundReleases(ov?: CalendarOverrides): AncientGroundRelease[] {
  const overrides = ov ?? loadOverrides();
  const out: AncientGroundRelease[] = [];
  for (const r of ANCIENT_GROUND_RELEASES) {
    const o = overrides.ancientGround[String(r.singleNumber)];
    if (o?.skip) continue;
    out.push({ ...r, date: o?.date || r.date });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return out;
}

export function getEffectiveAncientGroundByDate(ov?: CalendarOverrides): Record<string, AncientGroundRelease> {
  const out: Record<string, AncientGroundRelease> = {};
  for (const r of getEffectiveAncientGroundReleases(ov)) out[r.date] = r;
  return out;
}
