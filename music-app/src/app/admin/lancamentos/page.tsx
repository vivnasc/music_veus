"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

type AlbumStatus = "publicado" | "lancado" | "pronto" | "em-producao" | "a-produzir";

type ScheduleItem = {
  slug: string;
  status: AlbumStatus;
  releaseDate?: string;
};

const STORAGE_KEY = "veus:lancamentos";

// ─────────────────────────────────────────────
// Estado inicial (default antes de localStorage)
// ─────────────────────────────────────────────

const DEFAULT_ITEMS: ScheduleItem[] = [
  // Já publicados
  { slug: "incenso-frequencia", status: "publicado", releaseDate: "2026-03-15" },
  { slug: "livro-filosofico", status: "publicado", releaseDate: "2026-03-22" },
  // Próximos a produzir (ordem estratégica, letras revistas)
  { slug: "grao-festa", status: "a-produzir" },
  { slug: "grao-boca-aberta", status: "a-produzir" },
  { slug: "fibra-azul-fundo", status: "a-produzir" },
  { slug: "mare-varanda-quente", status: "a-produzir" },
  { slug: "grao-estacoes", status: "a-produzir" },
  { slug: "incenso-pes-descalcos", status: "a-produzir" },
  { slug: "eter-oceano", status: "a-produzir" },
  { slug: "incenso-maos-juntas", status: "a-produzir" },
  { slug: "nua-duas-vozes", status: "a-produzir" },
  { slug: "grao-porta-aberta", status: "a-produzir" },
  { slug: "grao-sal-na-pele", status: "a-produzir" },
  { slug: "mare-lua-acordada", status: "a-produzir" },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getAlbum(slug: string) {
  return ALL_ALBUMS.find((a) => a.slug === slug);
}

function getCollectionLabel(slug: string): string {
  const album = getAlbum(slug);
  if (!album) return "";
  const labels: Record<string, string> = {
    espelho: "Espelhos", no: "Nós", livro: "Livro", curso: "Cursos",
    incenso: "Incenso", eter: "Éter", nua: "Nua", sangue: "Sangue",
    fibra: "Fibra", grao: "Grão", mare: "Maré",
  };
  return labels[album.product] || album.product;
}

function getCollectionColor(slug: string): string {
  const album = getAlbum(slug);
  if (!album) return "#666";
  const colors: Record<string, string> = {
    espelho: "#c9b896", no: "#8b9b8e", livro: "#ab9375", curso: "#8aaaca",
    incenso: "#c08aaa", eter: "#5AAFB4", nua: "#c08a8a", sangue: "#C4745A",
    fibra: "#7A9B8E", grao: "#D4A853", mare: "#E8956A",
  };
  return colors[album.product] || "#666";
}

const STATUS_ORDER: AlbumStatus[] = ["a-produzir", "em-producao", "pronto", "lancado", "publicado"];

const STATUS_CONFIG: Record<AlbumStatus, { label: string; color: string; bg: string }> = {
  publicado: { label: "Publicado", color: "#4ade80", bg: "rgba(74,222,128,0.15)" },
  lancado: { label: "Lançado", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  pronto: { label: "Pronto", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
  "em-producao": { label: "Em produção", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  "a-produzir": { label: "A produzir", color: "#a0a0b0", bg: "rgba(160,160,176,0.15)" },
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function generateReleaseDates(count: number): string[] {
  const today = new Date();
  const dates: string[] = [];
  const current = new Date(today);
  while (dates.length < count) {
    const dow = current.getDay();
    if (dow === 1 || dow === 3 || dow === 5) {
      dates.push(current.toISOString().slice(0, 10));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function LancamentosPage() {
  const [items, setItems] = useState<ScheduleItem[]>(DEFAULT_ITEMS);
  const [audioMap, setAudioMap] = useState<Record<string, Set<number>>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ScheduleItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage
  const save = useCallback((newItems: ScheduleItem[]) => {
    setItems(newItems);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems)); } catch {}
  }, []);

  // Fetch audio status + auto-add fully produced albums
  useEffect(() => {
    adminFetch("/api/admin/audio-status")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Set<number>> = {};
        for (const key of (data.existing || []) as string[]) {
          const match = key.match(/^(.+)-t(\d+)$/);
          if (match) {
            if (!map[match[1]]) map[match[1]] = new Set();
            map[match[1]].add(parseInt(match[2], 10));
          }
        }
        setAudioMap(map);

        // Auto-add albums with 100% audio to the schedule as "pronto"
        setItems((prev) => {
          const existingSlugs = new Set(prev.map((i) => i.slug));
          const toAdd: ScheduleItem[] = [];
          for (const album of ALL_ALBUMS) {
            if (existingSlugs.has(album.slug)) continue;
            const produced = map[album.slug]?.size || 0;
            if (produced >= album.tracks.length && album.tracks.length > 0) {
              toAdd.push({ slug: album.slug, status: "pronto" });
            }
          }
          // Also upgrade existing "a-produzir" items to "pronto" if fully produced
          const updated = prev.map((item) => {
            if (item.status === "a-produzir" || item.status === "em-producao") {
              const album = ALL_ALBUMS.find((a) => a.slug === item.slug);
              const produced = map[item.slug]?.size || 0;
              if (album && produced >= album.tracks.length && album.tracks.length > 0) {
                return { ...item, status: "pronto" as AlbumStatus };
              }
            }
            return item;
          });
          if (toAdd.length === 0 && JSON.stringify(updated) === JSON.stringify(prev)) return prev;
          // Insert new "pronto" albums after published but before the rest
          const pubItems = updated.filter((i) => i.status === "publicado" || i.status === "lancado");
          const rest = updated.filter((i) => i.status !== "publicado" && i.status !== "lancado");
          const merged = [...pubItems, ...toAdd, ...rest];
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch {}
          return merged;
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Actions ──

  function cycleStatus(slug: string) {
    save(items.map((item) => {
      if (item.slug !== slug) return item;
      const idx = STATUS_ORDER.indexOf(item.status);
      return { ...item, status: STATUS_ORDER[(idx + 1) % STATUS_ORDER.length] };
    }));
  }

  function moveUp(slug: string) {
    const idx = items.findIndex((i) => i.slug === slug);
    if (idx <= 0) return;
    const next = [...items];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    save(next);
  }

  function moveDown(slug: string) {
    const idx = items.findIndex((i) => i.slug === slug);
    if (idx < 0 || idx >= items.length - 1) return;
    const next = [...items];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    save(next);
  }

  function removeItem(slug: string) {
    save(items.filter((i) => i.slug !== slug));
  }

  function addAlbum(slug: string) {
    if (items.some((i) => i.slug === slug)) return;
    save([...items, { slug, status: "a-produzir" }]);
    setShowAddModal(false);
  }

  // ── Derived data ──

  const scheduledSlugs = new Set(items.map((i) => i.slug));

  const published = items.filter((i) => i.status === "publicado" || i.status === "lancado");
  const queue = items.filter((i) => i.status !== "publicado" && i.status !== "lancado");

  // Auto-assign suggested dates to "pronto" items in queue
  const prontoInQueue = queue.filter((i) => i.status === "pronto");
  const suggestedDates = generateReleaseDates(prontoInQueue.length);
  const dateMap: Record<string, string> = {};
  prontoInQueue.forEach((item, i) => {
    dateMap[item.slug] = item.releaseDate || suggestedDates[i] || "";
  });

  const countByStatus = (s: AlbumStatus) => items.filter((i) => i.status === s).length;

  // Available albums not yet in schedule
  const availableAlbums = ALL_ALBUMS.filter((a) => !scheduledSlugs.has(a.slug));

  function audioProgress(slug: string): { done: number; total: number } {
    const album = getAlbum(slug);
    return { done: audioMap[slug]?.size || 0, total: album?.tracks.length || 0 };
  }

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <Link href="/admin/producao" className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors">
            &larr; Produção
          </Link>
          <Link href="/admin/calendario" className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors">
            Calendário social &rarr;
          </Link>
        </div>
        <h1 className="text-2xl font-bold font-display tracking-wide">
          Agenda de Lançamentos
        </h1>
        <p className="text-sm text-[#666680] mt-1">
          DistroKid &middot; 3/semana &middot; Seg · Qua · Sex &middot; Clica no estado para mudar
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Publicados" value={countByStatus("publicado") + countByStatus("lancado")} color="#4ade80" />
        <StatCard label="Prontos" value={countByStatus("pronto")} color="#60a5fa" />
        <StatCard label="Em produção" value={countByStatus("em-producao")} color="#fbbf24" />
        <StatCard label="A produzir" value={countByStatus("a-produzir")} color="#a0a0b0" />
        <StatCard label="Total" value={items.length} color="#C9A96E" />
      </div>

      {/* Published */}
      {published.length > 0 && (
        <div className="max-w-4xl mx-auto mb-10">
          <h2 className="text-sm font-semibold text-[#4ade80] uppercase tracking-wider mb-4">
            Publicados ({published.length})
          </h2>
          <div className="space-y-2">
            {published.map((item) => (
              <AlbumRow
                key={item.slug}
                item={item}
                audioProgress={audioProgress(item.slug)}
                suggestedDate={item.releaseDate}
                expanded={expandedSlug === item.slug}
                onToggle={() => setExpandedSlug(expandedSlug === item.slug ? null : item.slug)}
                onCycleStatus={() => cycleStatus(item.slug)}
                audioTracks={audioMap[item.slug]}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Queue */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider">
            Fila ({queue.length} álbuns)
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-[10px] px-3 py-1.5 rounded-full bg-[#C9A96E]/10 text-[#C9A96E] hover:bg-[#C9A96E]/20 transition font-semibold uppercase tracking-wider"
          >
            + Adicionar álbum
          </button>
        </div>
        <p className="text-xs text-[#666680] mb-4">
          Arrasta a ordem com as setas. Clica no estado para mudar. &times; para remover.
        </p>

        {queue.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
            <p className="text-[#666680]">Fila vazia. Adiciona álbuns com o botão acima.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((item, i) => (
              <AlbumRow
                key={item.slug}
                item={item}
                index={i + 1}
                audioProgress={audioProgress(item.slug)}
                suggestedDate={dateMap[item.slug]}
                expanded={expandedSlug === item.slug}
                onToggle={() => setExpandedSlug(expandedSlug === item.slug ? null : item.slug)}
                onCycleStatus={() => cycleStatus(item.slug)}
                onMoveUp={() => moveUp(item.slug)}
                onMoveDown={() => moveDown(item.slug)}
                onRemove={() => removeItem(item.slug)}
                canMoveUp={i > 0}
                canMoveDown={i < queue.length - 1}
                audioTracks={audioMap[item.slug]}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>

      {/* DistroKid tips */}
      <div className="max-w-4xl mx-auto mt-12 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
        <h3 className="text-sm font-semibold text-[#C9A96E] mb-3">Notas DistroKid</h3>
        <ul className="text-xs text-[#a0a0b0] space-y-2">
          <li><span className="text-[#4ade80]">Ritmo:</span> 3 álbuns/semana — Seg, Qua, Sex.</li>
          <li><span className="text-[#60a5fa]">Sexta:</span> New Music Friday do Spotify = melhor visibilidade.</li>
          <li><span className="text-[#fbbf24]">Atenção:</span> 4+ álbuns/semana pode disparar revisão manual.</li>
        </ul>
      </div>

      {/* Add album modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#0D0D1A] border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Adicionar álbum</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#666680] hover:text-white text-xl">&times;</button>
            </div>
            {availableAlbums.length === 0 ? (
              <p className="text-[#666680] text-sm">Todos os álbuns já estão na agenda.</p>
            ) : (
              <div className="space-y-1">
                {availableAlbums.map((album) => {
                  const { done, total } = audioProgress(album.slug);
                  const collection = getCollectionLabel(album.slug);
                  const collColor = getCollectionColor(album.slug);
                  return (
                    <button
                      key={album.slug}
                      onClick={() => addAlbum(album.slug)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"
                    >
                      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: album.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{album.title}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full uppercase" style={{ color: collColor, backgroundColor: `${collColor}15` }}>
                            {collection}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#666680]">{total} faixas</span>
                      </div>
                      {!loading && done > 0 && (
                        <span className="text-[10px] text-[#a0a0b0]">{done}/{total}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Componentes
// ─────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
      <div className="text-2xl font-bold font-display" style={{ color }}>{value}</div>
      <div className="text-xs text-[#666680] mt-1">{label}</div>
    </div>
  );
}

function AlbumRow({
  item,
  index,
  audioProgress: ap,
  suggestedDate,
  expanded,
  onToggle,
  onCycleStatus,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
  audioTracks,
  loading,
}: {
  item: ScheduleItem;
  index?: number;
  audioProgress: { done: number; total: number };
  suggestedDate?: string;
  expanded: boolean;
  onToggle: () => void;
  onCycleStatus: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  audioTracks?: Set<number>;
  loading: boolean;
}) {
  const album = getAlbum(item.slug);
  if (!album) return null;

  const statusCfg = STATUS_CONFIG[item.status];
  const collection = getCollectionLabel(item.slug);
  const collColor = getCollectionColor(item.slug);

  const ptCount = album.tracks.filter((t) => t.lang === "PT").length;
  const enCount = album.tracks.filter((t) => t.lang === "EN").length;

  const energies = album.tracks.reduce((acc, t) => {
    acc[t.energy] = (acc[t.energy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pct = ap.total > 0 ? Math.round((ap.done / ap.total) * 100) : 0;
  const isFullyProduced = ap.done >= ap.total && ap.total > 0;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isFullyProduced && item.status === "a-produzir"
          ? "border-blue-500/20 bg-blue-500/5"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4">
        {/* Reorder arrows */}
        {onMoveUp && (
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className={`text-[10px] leading-none px-1 ${canMoveUp ? "text-[#666680] hover:text-white" : "text-[#333] cursor-default"}`}
            >
              ▲
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className={`text-[10px] leading-none px-1 ${canMoveDown ? "text-[#666680] hover:text-white" : "text-[#333] cursor-default"}`}
            >
              ▼
            </button>
          </div>
        )}

        {/* Number */}
        {index !== undefined && (
          <span className="text-[#666680] text-xs w-4 text-right flex-shrink-0">{index}</span>
        )}

        {/* Color bar */}
        <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: album.color }} />

        {/* Date (for pronto/published) */}
        {suggestedDate && (
          <div className="flex-shrink-0 w-16 text-center hidden sm:block">
            <div className="text-[10px] text-[#666680]">{formatDate(suggestedDate)}</div>
          </div>
        )}

        {/* Album info — clickable to expand */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{album.title}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline"
              style={{ color: collColor, backgroundColor: `${collColor}15` }}
            >
              {collection}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-[#666680]">{album.tracks.length} faixas</span>
            {!loading && (
              <>
                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: isFullyProduced ? "#4ade80" : ap.done > 0 ? "#fbbf24" : "#333",
                    }}
                  />
                </div>
                <span className="text-[10px]" style={{ color: isFullyProduced ? "#4ade80" : ap.done > 0 ? "#fbbf24" : "#666680" }}>
                  {ap.done}/{ap.total}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status badge — clickable to cycle */}
        <button
          onClick={onCycleStatus}
          className="flex-shrink-0 text-[10px] px-2.5 py-1.5 rounded-full uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 min-h-[32px]"
          style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
          title="Clica para mudar estado"
        >
          {statusCfg.label}
        </button>

        {/* Remove */}
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-[#666680] hover:text-red-400 text-xs flex-shrink-0 transition-colors px-1"
            title="Remover da fila"
          >
            &times;
          </button>
        )}

        {/* Expand */}
        <button onClick={onToggle} className="text-[#666680] text-xs flex-shrink-0">
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <p className="text-xs text-[#a0a0b0] italic mb-3">{album.subtitle}</p>

          <div className="flex items-center gap-2 text-xs text-[#666680] mb-3">
            <span>{ptCount} PT / {enCount} EN</span>
            <span>&middot;</span>
            {Object.entries(energies).map(([energy, count]) => (
              <span key={energy} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#a0a0b0]">
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
                      track.energy === "whisper" ? "#93c5fd"
                        : track.energy === "steady" ? "#86efac"
                        : track.energy === "pulse" ? "#fbbf24"
                        : track.energy === "anthem" ? "#f87171"
                        : "#d4d4d8",
                  }}
                >
                  {track.energy}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
