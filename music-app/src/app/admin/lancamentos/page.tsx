"use client";

import React, { useState, useEffect, useCallback, type MouseEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { ALL_ALBUMS, type Album } from "@/data/albums";
import {
  PRODUCTION_CALENDAR,
  LORANNE_RELEASES,
} from "@/data/production-calendar";
import {
  getEffectiveLoranneReleases,
  updateLoranneOverride,
  clearLoranneOverride,
  loadOverrides,
} from "@/lib/calendar-overrides";
import { adminFetch } from "@/lib/admin-fetch";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type SlotStatus = "publicado" | "pronto" | "em-producao" | "a-produzir";

type Slot = {
  slug: string;
  status: SlotStatus;
};

type AudioMap = Record<string, Set<number>>;

const STORAGE_KEY = "veus:lancamentos-v8"; // v8: calendário com datas explícitas (1×/semana)

// ─────────────────────────────────────────────
// Build slots directly from production calendar
// ─────────────────────────────────────────────

// Calendar starts 13 April 2026 (Monday)
const CALENDAR_START = new Date(2026, 3, 13);

function buildCalendarSlots(): Slot[] {
  const slots: Slot[] = [];
  const effective = getEffectiveLoranneReleases();
  // 1. Albums already on Spotify (before the calendar)
  const calendarSlugs = new Set(LORANNE_RELEASES.map((r) => r.albumSlug));
  for (const album of ALL_ALBUMS) {
    if (album.status === "published" && !calendarSlugs.has(album.slug)) {
      slots.push({ slug: album.slug, status: "publicado" });
    }
  }
  // 2. Calendar slots ordered by effective release date
  for (const release of effective) {
    const album = ALL_ALBUMS.find((a) => a.slug === release.albumSlug);
    const status: SlotStatus = album?.status === "published" ? "publicado"
      : album?.status === "produced" ? "pronto"
      : "a-produzir";
    slots.push({ slug: release.albumSlug, status });
  }
  return slots;
}

const DEFAULT_SLOTS: Slot[] = buildCalendarSlots();

// Próximos a produzir (álbuns do calendário que não estão produzidos)
const _producedSlugs = new Set(
  ALL_ALBUMS.filter((a) => a.status === "produced" || a.status === "published").map((a) => a.slug)
);
const NEXT_TO_PRODUCE: { slug: string; notes: string; lyricsOk: boolean }[] = LORANNE_RELEASES
  .filter((r) => !_producedSlugs.has(r.albumSlug))
  .map((r) => {
    const album = ALL_ALBUMS.find((a) => a.slug === r.albumSlug);
    return {
      slug: r.albumSlug,
      notes: `${r.theme} — ${album?.subtitle || ""}`,
      lyricsOk: album ? album.tracks.every((t) => !!t.lyrics) : false,
    };
  });

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getAlbum(slug: string): Album | undefined {
  return ALL_ALBUMS.find((a) => a.slug === slug);
}

const COLLECTION_LABELS: Record<string, string> = {
  espelho: "Espelhos",
  no: "Nos",
  livro: "Livro",
  curso: "Cursos",
  incenso: "Incenso",
  eter: "Eter",
  nua: "Nua",
  sangue: "Sangue",
  fibra: "Fibra",
  grao: "Grao",
  mare: "Mare",
};

const COLLECTION_COLORS: Record<string, string> = {
  espelho: "#c9b896",
  no: "#8b9b8e",
  livro: "#ab9375",
  curso: "#8aaaca",
  incenso: "#c08aaa",
  eter: "#5AAFB4",
  nua: "#c08a8a",
  sangue: "#C4745A",
  fibra: "#7A9B8E",
  grao: "#D4A853",
  mare: "#E8956A",
};

function getCollectionLabel(album: Album): string {
  return COLLECTION_LABELS[album.product] || album.product;
}

function getCollectionColor(album: Album): string {
  return COLLECTION_COLORS[album.product] || "#666";
}

const STATUS_ORDER: SlotStatus[] = ["a-produzir", "em-producao", "pronto", "publicado"];

const STATUS_CONFIG: Record<SlotStatus, { label: string; color: string; bg: string }> = {
  publicado: { label: "Publicado", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  pronto: { label: "Pronto", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  "em-producao": { label: "Em producao", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  "a-produzir": { label: "A produzir", color: "#a0a0b0", bg: "rgba(160,160,176,0.15)" },
};

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DAY_LABELS = ["Seg", "Qua", "Sex"];

/**
 * Datas dos slots do calendário de distribuição.
 *
 * Usa datas efectivas (com overrides aplicados). Slots adicionais (para
 * agendamento manual de álbuns extra) ocupam sextas-feiras consecutivas
 * após a última release.
 */
function generateSlotDates(_startDate: Date, count: number): Date[] {
  const effective = getEffectiveLoranneReleases();
  const dates: Date[] = effective.map((r) => new Date(r.date));
  if (dates.length >= count) return dates.slice(0, count);

  // Extender com sextas-feiras após a última release agendada
  const last = dates[dates.length - 1] ?? CALENDAR_START;
  const cur = new Date(last);
  cur.setDate(cur.getDate() + 1);
  while (dates.length < count) {
    if (cur.getDay() === 5) dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function formatShortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function formatDayLabel(d: Date): string {
  return WEEKDAY_LABELS[d.getDay()] ?? "";
}

function weekNumber(slotIndex: number): number {
  return Math.floor(slotIndex / 3) + 1;
}

function weekDateRange(dates: Date[], weekIdx: number): string {
  const startIdx = weekIdx * 3;
  const endIdx = Math.min(startIdx + 2, dates.length - 1);
  if (startIdx >= dates.length) return "";
  const s = dates[startIdx];
  const e = dates[endIdx];
  if (s.getMonth() === e.getMonth()) {
    return `${s.getDate()}-${e.getDate()} ${MONTHS[s.getMonth()]}`;
  }
  return `${s.getDate()} ${MONTHS[s.getMonth()]} - ${e.getDate()} ${MONTHS[e.getMonth()]}`;
}

function audioProgress(slug: string, audioMap: AudioMap): { done: number; total: number } {
  const album = getAlbum(slug);
  return { done: audioMap[slug]?.size || 0, total: album?.tracks.length || 0 };
}

function isFullyProduced(slug: string, audioMap: AudioMap): boolean {
  const album = getAlbum(slug);
  if (album && (album.status === "produced" || album.status === "published")) return true;
  const { done, total } = audioProgress(slug, audioMap);
  return done >= total && total > 0;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

const EXTRA_EMPTY_WEEKS = 1; // show 1 empty week after last filled slot

export default function LancamentosPage() {
  const [slots, setSlots] = useState<Slot[]>(DEFAULT_SLOTS);
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [extraWeeks, setExtraWeeks] = useState(0);
  const [swapModalIdx, setSwapModalIdx] = useState<number | null>(null);
  const [swapFilter, setSwapFilter] = useState("");
  const [expandedSlotIdx, setExpandedSlotIdx] = useState<number | null>(null);
  // Tick incrementado sempre que os overrides mudam — força recomputar datas efectivas
  const [overridesTick, setOverridesTick] = useState(0);
  const [editingDateFor, setEditingDateFor] = useState<string | null>(null);
  // sentinelRef removed — using manual "more weeks" button

  // ── Persist ──

  const save = useCallback((newSlots: Slot[]) => {
    setSlots(newSlots);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    } catch {
      // ignore
    }
  }, []);

  // ── Load from localStorage + validate all calendar albums present ──

  useEffect(() => {
    let loadedSlots: Slot[] | null = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Slot[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedSlots = parsed;
        }
      }
    } catch {}

    // Ensure ALL calendar albums are present (re-add if missing)
    // Respeita overrides de skip — álbuns marcados como skipped não são re-adicionados.
    const slotsToUse = loadedSlots || DEFAULT_SLOTS;
    const existingSlugs = new Set(slotsToUse.map((s) => s.slug));
    const ov = loadOverrides();
    const calSlugs = LORANNE_RELEASES.map((r) => r.albumSlug);
    let patched = false;
    for (const slug of calSlugs) {
      if (!existingSlugs.has(slug) && !ov.loranne[slug]?.skip) {
        const album = ALL_ALBUMS.find((a) => a.slug === slug);
        const status: SlotStatus = album?.status === "published" ? "publicado"
          : album?.status === "produced" ? "pronto" : "a-produzir";
        slotsToUse.push({ slug, status });
        patched = true;
      }
    }
    if (patched) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(slotsToUse)); } catch {}
    }
    setSlots(slotsToUse);
    setLoaded(true);
  }, []);

  // ── Fetch audio status + merge ──

  useEffect(() => {
    adminFetch("/api/admin/audio-status")
      .then((r) => r.json())
      .then((data) => {
        const map: AudioMap = {};
        for (const key of (data.existing || []) as string[]) {
          const match = key.match(/^(.+)-t(\d+)$/);
          if (match) {
            if (!map[match[1]]) map[match[1]] = new Set();
            map[match[1]].add(parseInt(match[2], 10));
          }
        }
        setAudioMap(map);

        // Only upgrade statuses — never add/reorder slots (calendar is the source of truth)
        setSlots((prev: Slot[]) => {
          const updated = prev.map((slot: Slot) => {
            if (slot.status === "a-produzir" || slot.status === "em-producao") {
              const album = ALL_ALBUMS.find((a: Album) => a.slug === slot.slug);
              if (!album) return slot;
              const isMarked = album.status === "produced" || album.status === "published";
              const audioCount = map[slot.slug]?.size || 0;
              const hasAllAudio = audioCount >= album.tracks.length && album.tracks.length > 0;
              if (isMarked || hasAllAudio) {
                return { ...slot, status: "pronto" as SlotStatus };
              }
            }
            return slot;
          });
          if (JSON.stringify(updated) === JSON.stringify(prev)) return prev;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
          return updated;
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Actions (calendarIdx = index in calendar slots) ──

  // Map calendar index to slots array index (calendar = all Loranne releases)
  const _calSlugsSet = new Set(LORANNE_RELEASES.map((r) => r.albumSlug));
  function toSlotsIdx(calIdx: number): number {
    let count = -1;
    for (let i = 0; i < slots.length; i++) {
      if (_calSlugsSet.has(slots[i].slug)) count++;
      if (count === calIdx) return i;
    }
    return slots.length;
  }

  function cycleStatus(calIdx: number) {
    const si = toSlotsIdx(calIdx);
    if (si >= slots.length) return;
    const newSlots = [...slots];
    const slot = newSlots[si];
    const sti = STATUS_ORDER.indexOf(slot.status);
    newSlots[si] = { ...slot, status: STATUS_ORDER[(sti + 1) % STATUS_ORDER.length] };
    save(newSlots);
  }

  function removeSlot(calIdx: number) {
    const si = toSlotsIdx(calIdx);
    const removed = slots[si];
    const newSlots = slots.filter((_: Slot, i: number) => i !== si);
    save(newSlots);
    // Persistir "skip" no override partilhado para o calendário de redes sociais
    if (removed && _calSlugsSet.has(removed.slug)) {
      updateLoranneOverride(removed.slug, { skip: true });
      setOverridesTick((t: number) => t + 1);
    }
    if (expandedSlotIdx === calIdx) setExpandedSlotIdx(null);
    else if (expandedSlotIdx !== null && expandedSlotIdx > calIdx) setExpandedSlotIdx(expandedSlotIdx - 1);
  }

  /** Alterar a data de um lançamento (persistido em overrides). */
  function changeSlotDate(slug: string, newIsoDate: string) {
    updateLoranneOverride(slug, { date: newIsoDate, skip: false });
    setOverridesTick((t: number) => t + 1);
  }

  /** Remover override de data — volta à data default da release. */
  function resetSlotDate(slug: string) {
    clearLoranneOverride(slug);
    setOverridesTick((t: number) => t + 1);
  }

  function moveUp(calIdx: number) {
    if (calIdx <= 0) return;
    const si = toSlotsIdx(calIdx);
    const siPrev = toSlotsIdx(calIdx - 1);
    const newSlots = [...slots];
    [newSlots[siPrev], newSlots[si]] = [newSlots[si], newSlots[siPrev]];
    save(newSlots);
    if (expandedSlotIdx === calIdx) setExpandedSlotIdx(calIdx - 1);
    else if (expandedSlotIdx === calIdx - 1) setExpandedSlotIdx(calIdx);
  }

  function moveDown(calIdx: number) {
    const calSlots = slots.filter((s: Slot) => _calSlugsSet.has(s.slug));
    if (calIdx >= calSlots.length - 1) return;
    const si = toSlotsIdx(calIdx);
    const siNext = toSlotsIdx(calIdx + 1);
    const newSlots = [...slots];
    [newSlots[si], newSlots[siNext]] = [newSlots[siNext], newSlots[si]];
    save(newSlots);
    if (expandedSlotIdx === calIdx) setExpandedSlotIdx(calIdx + 1);
    else if (expandedSlotIdx === calIdx + 1) setExpandedSlotIdx(calIdx);
  }

  function swapSlot(calIdx: number, newSlug: string) {
    if (slots.some((s: Slot) => s.slug === newSlug)) {
      // Already scheduled — swap positions if slot exists
      const si = toSlotsIdx(calIdx);
      if (si < slots.length) {
        const existingIdx = slots.findIndex((s: Slot) => s.slug === newSlug);
        const newSlots = [...slots];
        [newSlots[si], newSlots[existingIdx]] = [newSlots[existingIdx], newSlots[si]];
        save(newSlots);
      }
    } else {
      const album = getAlbum(newSlug);
      const status: SlotStatus = album && isFullyProduced(newSlug, audioMap) ? "pronto" : "a-produzir";
      const calSlots = slots.filter((s: Slot) => _calSlugsSet.has(s.slug));
      if (calIdx < calSlots.length) {
        // Replace existing slot
        const si = toSlotsIdx(calIdx);
        const newSlots = [...slots];
        newSlots[si] = { slug: newSlug, status };
        save(newSlots);
      } else {
        // Empty slot — add new album
        save([...slots, { slug: newSlug, status }]);
      }
    }
    // Se o álbum inserido tinha override skip, limpar
    const ovAfter = loadOverrides();
    if (ovAfter.loranne[newSlug]?.skip) {
      updateLoranneOverride(newSlug, { skip: false });
      setOverridesTick((t: number) => t + 1);
    }
    setSwapModalIdx(null);
    setSwapFilter("");
  }

  function addToNextSlot(slug: string) {
    if (slots.some((s: Slot) => s.slug === slug)) return;
    const status: SlotStatus = isFullyProduced(slug, audioMap) ? "pronto" : "a-produzir";
    save([...slots, { slug, status }]);
    // Se existia override a marcar skip, limpar — o álbum está de volta ao calendário
    const ov = loadOverrides();
    if (ov.loranne[slug]?.skip) {
      updateLoranneOverride(slug, { skip: false });
      setOverridesTick((t: number) => t + 1);
    }
  }

  // ── Derived ──

  const scheduledSlugs = new Set(slots.map((s: Slot) => s.slug));

  // Generate dates: start from this week (next Mon/Wed/Fri)
  const startDate = new Date();

  // Published albums OUTSIDE the calendar (Frequência, Ilusão, etc.)
  const calendarSlugsSet = new Set(LORANNE_RELEASES.map((r) => r.albumSlug));
  const publishedSlots = slots.filter((s: Slot) => s.status === "publicado" && !calendarSlugsSet.has(s.slug));
  // ALL calendar albums stay in the calendar (never removed)
  const calendarSlots = slots.filter((s: Slot) => calendarSlugsSet.has(s.slug));
  const filledWeeks = Math.ceil(calendarSlots.length / 3);
  const visibleWeeks = filledWeeks + EXTRA_EMPTY_WEEKS + extraWeeks;
  const totalSlotCount = visibleWeeks * 3;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  void overridesTick; // força recomputar quando overrides mudam
  const slotDates = generateSlotDates(startDate, totalSlotCount);
  const currentOverrides = loadOverrides();

  // Stats
  const countByStatus = (s: SlotStatus) => slots.filter((sl: Slot) => sl.status === s).length;

  // Unassigned albums (exclude published and scheduled)
  const unassigned = ALL_ALBUMS.filter((a) => !scheduledSlugs.has(a.slug));
  const unassignedProduced = unassigned.filter((a) => isFullyProduced(a.slug, audioMap));
  const unassignedPartial = unassigned.filter((a) => {
    const { done, total } = audioProgress(a.slug, audioMap);
    return done > 0 && done < total;
  });
  const unassignedNone = unassigned.filter((a) => {
    const { done } = audioProgress(a.slug, audioMap);
    return done === 0;
  });

  // Group slots into weeks for display
  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/admin/producao"
            className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors"
          >
            &larr; Producao
          </Link>
          <Link
            href="/admin/calendario"
            className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors"
          >
            Calendario social &rarr;
          </Link>
        </div>
        <h1 className="text-2xl font-bold font-display tracking-wide">
          Agenda de Lancamentos
        </h1>
        <p className="text-sm text-[#666680] mt-1">
          DistroKid &middot; 1/semana &middot; sextas-feiras (com datas fixas nas transições)
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Publicados"
          value={countByStatus("publicado")}
          color="#4ade80"
        />
        <StatCard label="Prontos" value={countByStatus("pronto")} color="#60a5fa" />
        <StatCard label="Em producao" value={countByStatus("em-producao")} color="#fbbf24" />
        <StatCard label="A produzir" value={countByStatus("a-produzir")} color="#a0a0b0" />
      </div>

      {/* Published (separate) */}
      {publishedSlots.length > 0 && (
        <div className="max-w-5xl mx-auto mb-6">
          <h2 className="text-sm font-semibold text-[#4ade80] uppercase tracking-wider mb-3">
            Publicados ({publishedSlots.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {publishedSlots.map((s: Slot) => {
              const album = getAlbum(s.slug);
              if (!album) return null;
              return (
                <div key={s.slug} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-500/20 bg-green-500/5">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: album.color }} />
                  <span className="text-xs font-semibold">{album.title}</span>
                  <button
                    onClick={() => {
                      const newSlots = slots.map((sl: Slot) =>
                        sl.slug === s.slug ? { ...sl, status: "pronto" as SlotStatus } : sl
                      );
                      save(newSlots);
                    }}
                    className="text-[10px] text-[#4ade80] hover:text-[#fbbf24] transition-colors"
                    title="Clica para voltar ao calendario"
                  >
                    Publicado
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">
          Calendario ({calendarSlots.length} albums agendados)
        </h2>

        {loading && (
          <div className="text-center text-[#666680] text-sm py-8">A carregar audio status...</div>
        )}

        <div className="space-y-6">
          {Array.from({ length: visibleWeeks }, (_: unknown, weekIdx: number) => {
            const weekStart = weekIdx * 3;
            const weekSlots: Array<{ globalIdx: number; date: Date; slot: Slot | null }> = [0, 1, 2].map((offset: number) => {
              const globalIdx = weekStart + offset;
              const date = slotDates[globalIdx];
              const slot: Slot | null = globalIdx < calendarSlots.length ? calendarSlots[globalIdx] : null;
              return { globalIdx, date, slot };
            });

            const themeLabel = PRODUCTION_CALENDAR[weekIdx]?.theme ?? `Bloco ${weekIdx + 1}`;
            return (
              <div key={weekIdx} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                {/* Week header */}
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
                  <span className="text-xs font-semibold text-[#C9A96E]">
                    {themeLabel}
                  </span>
                  <span className="text-[10px] text-[#666680]">
                    {weekDateRange(slotDates, weekIdx)}
                  </span>
                </div>

                {/* 3 slot rows */}
                <div className="divide-y divide-white/5">
                  {weekSlots.map(({ globalIdx, date, slot }) => (
                    <SlotRow
                      key={globalIdx}
                      globalIdx={globalIdx}
                      date={date}
                      slot={slot}
                      audioMap={audioMap}
                      loading={loading}
                      expanded={expandedSlotIdx === globalIdx}
                      onToggleExpand={() =>
                        setExpandedSlotIdx(expandedSlotIdx === globalIdx ? null : globalIdx)
                      }
                      onCycleStatus={() => cycleStatus(globalIdx)}
                      onRemove={() => removeSlot(globalIdx)}
                      onMoveUp={() => moveUp(globalIdx)}
                      onMoveDown={() => moveDown(globalIdx)}
                      canMoveUp={globalIdx > 0 && globalIdx < calendarSlots.length}
                      canMoveDown={globalIdx < calendarSlots.length - 1}
                      onSwap={() => {
                        setSwapModalIdx(globalIdx);
                        setSwapFilter("");
                      }}
                      editingDate={slot ? editingDateFor === slot.slug : false}
                      onToggleEditDate={() =>
                        setEditingDateFor(
                          slot && editingDateFor === slot.slug ? null : slot?.slug ?? null,
                        )
                      }
                      onChangeDate={(iso: string) => {
                        if (!slot) return;
                        changeSlotDate(slot.slug, iso);
                        setEditingDateFor(null);
                      }}
                      onResetDate={() => {
                        if (!slot) return;
                        resetSlotDate(slot.slug);
                        setEditingDateFor(null);
                      }}
                      hasDateOverride={!!(slot && currentOverrides.loranne[slot.slug]?.date)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add more weeks button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setExtraWeeks((v: number) => v + 4)}
            className="text-xs px-4 py-2 rounded-full bg-white/5 text-[#666680] hover:text-[#C9A96E] hover:bg-white/10 transition"
          >
            + Mais 4 semanas
          </button>
        </div>
      </div>

      {/* Lista de produção */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-sm font-semibold text-[#c08aaa] uppercase tracking-wider mb-4">
          Proximos a produzir ({NEXT_TO_PRODUCE.length} albums)
        </h2>
        <p className="text-xs text-[#666680] mb-3">
          Ordem estrategica: dos mais leves aos mais intensos. Letras revistas (excepto os 2 ultimos).
        </p>
        <div className="space-y-2">
          {NEXT_TO_PRODUCE.map((item, i) => {
            const album = getAlbum(item.slug);
            if (!album) return null;
            const ap = audioProgress(item.slug, audioMap);
            const isComplete = ap.done >= ap.total && ap.total > 0;
            const isPartial = ap.done > 0 && !isComplete;
            const pct = ap.total > 0 ? Math.round((ap.done / ap.total) * 100) : 0;
            const collLabel = getCollectionLabel(album);
            const collColor = getCollectionColor(album);
            return (
              <div
                key={item.slug}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  isComplete
                    ? "border-green-500/20 bg-green-500/5"
                    : isPartial
                      ? "border-yellow-500/20 bg-yellow-500/5"
                      : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <span className="text-[#666680] text-xs w-5 text-right flex-shrink-0">{i + 1}</span>
                <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: album.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold truncate ${isComplete ? "line-through text-[#666680]" : ""}`}>
                      {album.title}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline"
                      style={{ color: collColor, backgroundColor: `${collColor}15` }}
                    >
                      {collLabel}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#666680] mt-0.5">{item.notes}</div>
                  {/* Progress bar for partial/complete */}
                  {ap.done > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: isComplete ? "#4ade80" : "#fbbf24",
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px]"
                        style={{ color: isComplete ? "#4ade80" : "#fbbf24" }}
                      >
                        {ap.done}/{ap.total}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {isComplete ? (
                    <span className="text-[10px] px-2 py-1 rounded-full font-semibold text-[#4ade80] bg-[rgba(74,222,128,0.1)]">
                      Produzido
                    </span>
                  ) : isPartial ? (
                    <span className="text-[10px] px-2 py-1 rounded-full font-semibold text-[#fbbf24] bg-[rgba(251,191,36,0.1)]">
                      Em producao
                    </span>
                  ) : (
                    <span
                      className="text-[10px] px-2 py-1 rounded-full font-semibold"
                      style={{
                        color: item.lyricsOk ? "#c08aaa" : "#f87171",
                        backgroundColor: item.lyricsOk ? "rgba(192,138,170,0.1)" : "rgba(248,113,113,0.1)",
                      }}
                    >
                      {item.lyricsOk ? "Letra OK" : "Rever letra"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unassigned section */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-6">
          Albums sem data ({unassigned.length})
        </h2>

        {unassignedProduced.length > 0 && (
          <UnassignedGroup
            title="Produzidos sem data"
            titleColor="#4ade80"
            albums={unassignedProduced}
            audioMap={audioMap}
            onAdd={addToNextSlot}
          />
        )}

        {unassignedPartial.length > 0 && (
          <UnassignedGroup
            title="Em producao"
            titleColor="#fbbf24"
            albums={unassignedPartial}
            audioMap={audioMap}
            onAdd={addToNextSlot}
          />
        )}

        {unassignedNone.length > 0 && (
          <UnassignedGroup
            title="Repertorio"
            titleColor="#666680"
            albums={unassignedNone}
            audioMap={audioMap}
            onAdd={addToNextSlot}
          />
        )}

        {unassigned.length === 0 && (
          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
            <p className="text-[#666680]">Todos os albums estao agendados.</p>
          </div>
        )}
      </div>

      {/* DistroKid tips */}
      <div className="max-w-5xl mx-auto mt-12 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-[#C9A96E] mb-3">Notas DistroKid</h3>
        <ul className="text-xs text-[#a0a0b0] space-y-2">
          <li>
            <span className="text-[#4ade80]">Ritmo:</span> 1 álbum por semana — sextas-feiras (New Music Friday).
          </li>
          <li>
            <span className="text-[#60a5fa]">Transição:</span> nua-inteira (20 Abr) e nua-por-dentro (24 Abr) antes de férias.
            Regresso 5 e 8 Mai. A partir de 15 Mai só sextas.
          </li>
          <li>
            <span className="text-[#fbbf24]">Saltar dia:</span> remove o slot (&times;) para saltar uma semana ou troca (⇄) se quiseres mover.
          </li>
        </ul>
      </div>

      {/* Swap modal */}
      {swapModalIdx !== null && (
        <SwapModal
          currentSlug={swapModalIdx < calendarSlots.length ? calendarSlots[swapModalIdx]?.slug || null : null}
          allAlbums={ALL_ALBUMS.filter((a) => !scheduledSlugs.has(a.slug))}
          audioMap={audioMap}
          filter={swapFilter}
          onFilterChange={setSwapFilter}
          onSelect={(slug: string) => swapSlot(swapModalIdx, slug)}
          onClose={() => {
            setSwapModalIdx(null);
            setSwapFilter("");
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SlotRow
// ─────────────────────────────────────────────

function SlotRow({
  globalIdx,
  date,
  slot,
  audioMap,
  loading,
  expanded,
  onToggleExpand,
  onCycleStatus,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onSwap,
  editingDate,
  onToggleEditDate,
  onChangeDate,
  onResetDate,
  hasDateOverride,
}: {
  globalIdx: number;
  date: Date;
  slot: Slot | null;
  audioMap: AudioMap;
  loading: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onCycleStatus: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSwap: () => void;
  editingDate: boolean;
  onToggleEditDate: () => void;
  onChangeDate: (iso: string) => void;
  onResetDate: () => void;
  hasDateOverride: boolean;
}) {
  const dayLabel = formatDayLabel(date);
  const dateStr = formatShortDate(date);
  const isoDate = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}` : "";

  if (!slot) {
    // Empty slot — clickable to add album
    return (
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition group"
        onClick={onSwap}
      >
        <div className="w-14 flex-shrink-0 text-center">
          <div className="text-[10px] text-[#666680] font-semibold">{dayLabel}</div>
          <div className="text-[10px] text-[#666680]">{dateStr}</div>
        </div>
        <div className="flex-1 text-xs text-[#666680] group-hover:text-[#C9A96E] transition-colors">
          + Escolher album
        </div>
      </div>
    );
  }

  const album = getAlbum(slot.slug);
  if (!album) return null;

  const ap = audioProgress(slot.slug, audioMap);
  const pct = ap.total > 0 ? Math.round((ap.done / ap.total) * 100) : 0;
  const fullyProduced = ap.done >= ap.total && ap.total > 0;
  const statusCfg = STATUS_CONFIG[slot.status];
  const collLabel = getCollectionLabel(album);
  const collColor = getCollectionColor(album);

  return (
    <div>
      <div className="flex items-center gap-2 sm:gap-3 px-4 py-3">
        {/* Reorder arrows */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={`text-[10px] leading-none px-1 ${
              canMoveUp ? "text-[#666680] hover:text-white" : "text-[#333] cursor-default"
            }`}
            aria-label="Mover para cima"
          >
            ▲
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={`text-[10px] leading-none px-1 ${
              canMoveDown ? "text-[#666680] hover:text-white" : "text-[#333] cursor-default"
            }`}
            aria-label="Mover para baixo"
          >
            ▼
          </button>
        </div>

        {/* Date (clicável — abre date picker) */}
        <div className="w-16 flex-shrink-0 text-center">
          {editingDate ? (
            <div className="flex flex-col items-center gap-1">
              <input
                type="date"
                defaultValue={isoDate}
                onChange={(e) => {
                  if (e.target.value) onChangeDate(e.target.value);
                }}
                autoFocus
                className="w-full rounded bg-white/10 border border-[#C9A96E]/40 px-1 py-0.5 text-[10px] text-[#F5F0E6] focus:outline-none"
              />
              {hasDateOverride && (
                <button
                  onClick={onResetDate}
                  className="text-[9px] text-[#666680] hover:text-amber-400 transition"
                  title="Repor data original"
                >
                  Repor
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onToggleEditDate}
              className="w-full flex flex-col items-center hover:text-[#C9A96E] transition"
              title="Clica para alterar a data"
            >
              <span className={`text-[10px] font-semibold ${hasDateOverride ? "text-[#C9A96E]" : "text-[#666680]"}`}>
                {dayLabel}
              </span>
              <span className={`text-[10px] ${hasDateOverride ? "text-[#C9A96E]" : "text-[#666680]"}`}>
                {dateStr}
                {hasDateOverride && "•"}
              </span>
            </button>
          )}
        </div>

        {/* Color bar */}
        <div
          className="w-1 h-10 rounded-full flex-shrink-0"
          style={{ backgroundColor: album.color }}
        />

        {/* Album info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{album.title}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline flex-shrink-0"
              style={{ color: collColor, backgroundColor: `${collColor}15` }}
            >
              {collLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[#666680]">{album.tracks.length} faixas</span>
            {!loading && (
              <>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: fullyProduced ? "#4ade80" : ap.done > 0 ? "#fbbf24" : "#333",
                    }}
                  />
                </div>
                <span
                  className="text-[10px]"
                  style={{
                    color: fullyProduced ? "#4ade80" : ap.done > 0 ? "#fbbf24" : "#666680",
                  }}
                >
                  {ap.done}/{ap.total}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status badge */}
        <button
          onClick={onCycleStatus}
          className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-full uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
          title="Clica para mudar estado"
        >
          {statusCfg.label}
        </button>

        {/* Swap */}
        <button
          onClick={onSwap}
          className="text-[#666680] hover:text-[#C9A96E] text-xs flex-shrink-0 transition-colors px-1"
          title="Trocar album"
        >
          ⇄
        </button>

        {/* Remove */}
        <button
          onClick={onRemove}
          className="text-[#666680] hover:text-red-400 text-xs flex-shrink-0 transition-colors px-1"
          title="Remover do calendario"
        >
          &times;
        </button>

        {/* Expand */}
        <button
          onClick={onToggleExpand}
          className="text-[#666680] text-xs flex-shrink-0"
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && <SlotDetails album={album} audioMap={audioMap} />}
    </div>
  );
}

// ─────────────────────────────────────────────
// SlotDetails (expanded track list)
// ─────────────────────────────────────────────

function SlotDetails({ album, audioMap }: { album: Album; audioMap: AudioMap }) {
  const audioTracks = audioMap[album.slug];
  const ptCount = album.tracks.filter((t) => t.lang === "PT").length;
  const enCount = album.tracks.filter((t) => t.lang === "EN").length;

  const energies = album.tracks.reduce<Record<string, number>>((acc, t) => {
    acc[t.energy] = (acc[t.energy] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="px-4 pb-4 border-t border-white/5 pt-3">
      <p className="text-xs text-[#a0a0b0] italic mb-3">{album.subtitle}</p>

      <div className="flex items-center gap-2 text-xs text-[#666680] mb-3 flex-wrap">
        <span>
          {ptCount} PT / {enCount} EN
        </span>
        <span>&middot;</span>
        {Object.entries(energies).map(([energy, count]) => (
          <span
            key={energy}
            className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#a0a0b0]"
          >
            {energy} ({count})
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {album.tracks.map((track) => (
          <div
            key={track.number}
            className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-white/[0.02]"
          >
            <span className="text-[#666680] w-4 text-right">{track.number}</span>
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: audioTracks?.has(track.number) ? "#4ade80" : "#333",
              }}
            />
            <span className="flex-1 truncate">{track.title}</span>
            <span className="text-[10px] text-[#666680]">{track.lang}</span>
            <span
              className="text-[10px] px-1 rounded"
              style={{
                color:
                  track.energy === "whisper"
                    ? "#93c5fd"
                    : track.energy === "steady"
                      ? "#86efac"
                      : track.energy === "pulse"
                        ? "#fbbf24"
                        : track.energy === "anthem"
                          ? "#f87171"
                          : "#d4d4d8",
              }}
            >
              {track.energy}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
      <div className="text-2xl font-bold font-display" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-[#666680] mt-1">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// UnassignedGroup
// ─────────────────────────────────────────────

function UnassignedGroup({
  title,
  titleColor,
  albums,
  audioMap,
  onAdd,
}: {
  title: string;
  titleColor: string;
  albums: Album[];
  audioMap: AudioMap;
  onAdd: (slug: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mb-3"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: titleColor }}>
          {title} ({albums.length})
        </h3>
        <span className="text-[10px] text-[#666680]">{collapsed ? "▶" : "▼"}</span>
      </button>

      {!collapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {albums.map((album) => {
            const ap = audioProgress(album.slug, audioMap);
            const collLabel = getCollectionLabel(album);
            const collColor = getCollectionColor(album);
            return (
              <button
                key={album.slug}
                onClick={() => onAdd(album.slug)}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition text-left group"
              >
                <div
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: album.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold truncate">{album.title}</span>
                    <span
                      className="text-[9px] px-1 py-0.5 rounded-full uppercase hidden sm:inline"
                      style={{ color: collColor, backgroundColor: `${collColor}15` }}
                    >
                      {collLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#666680]">
                    {album.tracks.length} faixas
                    {ap.done > 0 && (
                      <span
                        style={{
                          color: ap.done >= ap.total ? "#4ade80" : "#fbbf24",
                        }}
                      >
                        {" "}
                        &middot; {ap.done}/{ap.total}
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-[#666680] group-hover:text-[#C9A96E] transition-colors">
                  + Agendar
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SwapModal
// ─────────────────────────────────────────────

function SwapModal({
  currentSlug,
  allAlbums,
  audioMap,
  filter,
  onFilterChange,
  onSelect,
  onClose,
}: {
  currentSlug: string | null;
  allAlbums: Album[];
  audioMap: AudioMap;
  filter: string;
  onFilterChange: (v: string) => void;
  onSelect: (slug: string) => void;
  onClose: () => void;
}) {
  const lowerFilter = filter.toLowerCase();
  const filtered = allAlbums.filter((a) => {
    if (a.slug === currentSlug) return false;
    if (!filter) return true;
    return (
      a.title.toLowerCase().includes(lowerFilter) ||
      a.slug.toLowerCase().includes(lowerFilter) ||
      a.product.toLowerCase().includes(lowerFilter)
    );
  });

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0D0D1A] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Trocar album</h3>
          <button
            onClick={onClose}
            className="text-[#666680] hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        <input
          type="text"
          value={filter}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onFilterChange(e.target.value)}
          placeholder="Procurar album..."
          className="w-full mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
          autoFocus
        />

        <div className="overflow-y-auto flex-1 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-[#666680] text-sm text-center py-4">Nenhum album encontrado.</p>
          ) : (
            filtered.map((album) => {
              const ap = audioProgress(album.slug, audioMap);
              const collLabel = getCollectionLabel(album);
              const collColor = getCollectionColor(album);
              const fullyProduced = ap.done >= ap.total && ap.total > 0;
              return (
                <button
                  key={album.slug}
                  onClick={() => onSelect(album.slug)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"
                >
                  <div
                    className="w-1 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: album.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{album.title}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full uppercase"
                        style={{ color: collColor, backgroundColor: `${collColor}15` }}
                      >
                        {collLabel}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#666680]">{album.tracks.length} faixas</span>
                  </div>
                  {ap.done > 0 && (
                    <span
                      className="text-[10px]"
                      style={{ color: fullyProduced ? "#4ade80" : "#fbbf24" }}
                    >
                      {ap.done}/{ap.total}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
