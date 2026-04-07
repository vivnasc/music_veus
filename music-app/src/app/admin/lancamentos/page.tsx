"use client";

import React, { useState, useEffect, useCallback, useRef, type MouseEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { ALL_ALBUMS, type Album } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type SlotStatus = "publicado" | "lancado" | "pronto" | "em-producao" | "a-produzir";

type Slot = {
  slug: string;
  status: SlotStatus;
};

type AudioMap = Record<string, Set<number>>;

const STORAGE_KEY = "veus:lancamentos";

// ─────────────────────────────────────────────
// Default state (before localStorage)
// ─────────────────────────────────────────────

const DEFAULT_SLOTS: Slot[] = [
  { slug: "incenso-frequencia", status: "publicado" },
  { slug: "livro-filosofico", status: "publicado" },
];

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

const STATUS_ORDER: SlotStatus[] = ["a-produzir", "em-producao", "pronto", "lancado", "publicado"];

const STATUS_CONFIG: Record<SlotStatus, { label: string; color: string; bg: string }> = {
  publicado: { label: "Publicado", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  lancado: { label: "Lancado", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  pronto: { label: "Pronto", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  "em-producao": { label: "Em producao", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  "a-produzir": { label: "A produzir", color: "#a0a0b0", bg: "rgba(160,160,176,0.15)" },
};

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DAY_LABELS = ["Seg", "Qua", "Sex"];

/** Generate an infinite list of Mon/Wed/Fri dates starting from a given date. */
function generateSlotDates(startDate: Date, count: number): Date[] {
  const dates: Date[] = [];
  const cur = new Date(startDate);
  // Rewind to the Monday of that week or the start date itself
  while (dates.length < count) {
    const dow = cur.getDay();
    if (dow === 1 || dow === 3 || dow === 5) {
      dates.push(new Date(cur));
    }
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function formatShortDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function formatDayLabel(d: Date): string {
  const dow = d.getDay();
  if (dow === 1) return "Seg";
  if (dow === 3) return "Qua";
  if (dow === 5) return "Sex";
  return "";
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
  const { done, total } = audioProgress(slug, audioMap);
  return done >= total && total > 0;
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

const INITIAL_WEEKS = 20;
const LOAD_MORE_WEEKS = 10;

export default function LancamentosPage() {
  const [slots, setSlots] = useState<Slot[]>(DEFAULT_SLOTS);
  const [audioMap, setAudioMap] = useState<AudioMap>({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [visibleWeeks, setVisibleWeeks] = useState(INITIAL_WEEKS);
  const [swapModalIdx, setSwapModalIdx] = useState<number | null>(null);
  const [swapFilter, setSwapFilter] = useState("");
  const [expandedSlotIdx, setExpandedSlotIdx] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Persist ──

  const save = useCallback((newSlots: Slot[]) => {
    setSlots(newSlots);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlots));
    } catch {
      // ignore
    }
  }, []);

  // ── Load from localStorage ──

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Slot[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlots(parsed);
        }
      }
    } catch {
      // ignore
    }
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

        // Merge: auto-add fully produced albums, upgrade a-produzir → pronto
        setSlots((prev: Slot[]) => {
          const existingSlugs = new Set(prev.map((s: Slot) => s.slug));
          const toAdd: Slot[] = [];
          for (const album of ALL_ALBUMS) {
            if (existingSlugs.has(album.slug)) continue;
            const produced = map[album.slug]?.size || 0;
            if (produced >= album.tracks.length && album.tracks.length > 0) {
              toAdd.push({ slug: album.slug, status: "pronto" });
            }
          }
          const updated = prev.map((slot: Slot) => {
            if (slot.status === "a-produzir" || slot.status === "em-producao") {
              const album = ALL_ALBUMS.find((a: Album) => a.slug === slot.slug);
              const produced = map[slot.slug]?.size || 0;
              if (album && produced >= album.tracks.length && album.tracks.length > 0) {
                return { ...slot, status: "pronto" as SlotStatus };
              }
            }
            return slot;
          });

          if (toAdd.length === 0 && JSON.stringify(updated) === JSON.stringify(prev)) return prev;

          // Insert pronto after published/lancado
          const pub = updated.filter((s: Slot) => s.status === "publicado" || s.status === "lancado");
          const rest = updated.filter((s: Slot) => s.status !== "publicado" && s.status !== "lancado");
          const merged = [...pub, ...toAdd, ...rest];
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Infinite scroll ──

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          setVisibleWeeks((v: number) => v + LOAD_MORE_WEEKS);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loaded]);

  // ── Actions ──

  function cycleStatus(idx: number) {
    const newSlots = [...slots];
    const slot = newSlots[idx];
    const si = STATUS_ORDER.indexOf(slot.status);
    newSlots[idx] = { ...slot, status: STATUS_ORDER[(si + 1) % STATUS_ORDER.length] };
    save(newSlots);
  }

  function removeSlot(idx: number) {
    const newSlots = slots.filter((_: Slot, i: number) => i !== idx);
    save(newSlots);
    if (expandedSlotIdx === idx) setExpandedSlotIdx(null);
  }

  function moveUp(idx: number) {
    if (idx <= 0) return;
    const newSlots = [...slots];
    [newSlots[idx - 1], newSlots[idx]] = [newSlots[idx], newSlots[idx - 1]];
    save(newSlots);
    if (expandedSlotIdx === idx) setExpandedSlotIdx(idx - 1);
    else if (expandedSlotIdx === idx - 1) setExpandedSlotIdx(idx);
  }

  function moveDown(idx: number) {
    if (idx >= slots.length - 1) return;
    const newSlots = [...slots];
    [newSlots[idx], newSlots[idx + 1]] = [newSlots[idx + 1], newSlots[idx]];
    save(newSlots);
    if (expandedSlotIdx === idx) setExpandedSlotIdx(idx + 1);
    else if (expandedSlotIdx === idx + 1) setExpandedSlotIdx(idx);
  }

  function swapSlot(slotIdx: number, newSlug: string) {
    // If newSlug is already in slots, swap positions
    const existingIdx = slots.findIndex((s: Slot) => s.slug === newSlug);
    const newSlots = [...slots];
    if (existingIdx >= 0) {
      // Swap the two
      [newSlots[slotIdx], newSlots[existingIdx]] = [newSlots[existingIdx], newSlots[slotIdx]];
    } else {
      // Replace the slot with the new album
      const album = getAlbum(newSlug);
      const status: SlotStatus = album && isFullyProduced(newSlug, audioMap) ? "pronto" : "a-produzir";
      newSlots[slotIdx] = { slug: newSlug, status };
    }
    save(newSlots);
    setSwapModalIdx(null);
    setSwapFilter("");
  }

  function addToNextSlot(slug: string) {
    if (slots.some((s: Slot) => s.slug === slug)) return;
    const status: SlotStatus = isFullyProduced(slug, audioMap) ? "pronto" : "a-produzir";
    save([...slots, { slug, status }]);
  }

  // ── Derived ──

  const scheduledSlugs = new Set(slots.map((s: Slot) => s.slug));

  // Generate dates: start from 2026-03-16 (Monday after first published)
  const startDate = new Date(2026, 2, 16); // March 16, 2026
  const totalSlotCount = Math.max(slots.length, visibleWeeks * 3);
  const slotDates = generateSlotDates(startDate, totalSlotCount);

  // Stats
  const countByStatus = (s: SlotStatus) => slots.filter((sl: Slot) => sl.status === s).length;

  // Unassigned albums
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
  const totalVisibleSlots = visibleWeeks * 3;

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
          DistroKid &middot; 3/semana &middot; Seg &middot; Qua &middot; Sex
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Publicados"
          value={countByStatus("publicado") + countByStatus("lancado")}
          color="#4ade80"
        />
        <StatCard label="Prontos" value={countByStatus("pronto")} color="#60a5fa" />
        <StatCard label="Em producao" value={countByStatus("em-producao")} color="#fbbf24" />
        <StatCard label="A produzir" value={countByStatus("a-produzir")} color="#a0a0b0" />
      </div>

      {/* Calendar */}
      <div className="max-w-5xl mx-auto mb-12">
        <h2 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">
          Calendario ({slots.length} albums agendados)
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
              const slot: Slot | null = globalIdx < slots.length ? slots[globalIdx] : null;
              return { globalIdx, date, slot };
            });

            return (
              <div key={weekIdx} className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                {/* Week header */}
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5">
                  <span className="text-xs font-semibold text-[#C9A96E]">
                    Semana {weekIdx + 1}
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
                      canMoveUp={globalIdx > 0 && globalIdx < slots.length}
                      canMoveDown={globalIdx < slots.length - 1}
                      onSwap={() => {
                        setSwapModalIdx(globalIdx);
                        setSwapFilter("");
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-8" />
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
            <span className="text-[#4ade80]">Ritmo:</span> 3 albums/semana — Seg, Qua, Sex.
          </li>
          <li>
            <span className="text-[#60a5fa]">Sexta:</span> New Music Friday do Spotify = melhor visibilidade.
          </li>
          <li>
            <span className="text-[#fbbf24]">Atencao:</span> 4+ albums/semana pode disparar revisao manual.
          </li>
        </ul>
      </div>

      {/* Swap modal */}
      {swapModalIdx !== null && (
        <SwapModal
          currentSlug={slots[swapModalIdx]?.slug || null}
          allAlbums={ALL_ALBUMS}
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
}) {
  const dayLabel = formatDayLabel(date);
  const dateStr = formatShortDate(date);

  if (!slot) {
    // Empty slot
    return (
      <div className="flex items-center gap-3 px-4 py-3 opacity-30">
        <div className="w-14 flex-shrink-0 text-center">
          <div className="text-[10px] text-[#666680] font-semibold">{dayLabel}</div>
          <div className="text-[10px] text-[#666680]">{dateStr}</div>
        </div>
        <div className="flex-1 text-xs text-[#666680] italic">Vazio</div>
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

        {/* Date */}
        <div className="w-14 flex-shrink-0 text-center">
          <div className="text-[10px] text-[#666680] font-semibold">{dayLabel}</div>
          <div className="text-[10px] text-[#666680]">{dateStr}</div>
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
  const [collapsed, setCollapsed] = useState(albums.length > 20);

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
