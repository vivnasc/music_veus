"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ALL_ALBUMS,
  ENERGY_LABELS,
  FLAVOR_LABELS,
  type Album,
  type AlbumStatus,
} from "@/data/albums";
import { PRODUCTION_CALENDAR, type ProductionWeek } from "@/data/production-calendar";

// ─── localStorage ───────────────────────────────
const LS_WEEK_ORDER = "loranne-calendar-week-order";
const LS_ALBUM_STATUS = "loranne-album-status";

function getAlbumMap(): Map<string, Album> {
  const m = new Map<string, Album>();
  for (const a of ALL_ALBUMS) m.set(a.slug, a);
  return m;
}

function loadWeekOrder(): string[] | null {
  try {
    const raw = localStorage.getItem(LS_WEEK_ORDER);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveWeekOrder(ids: string[]) {
  localStorage.setItem(LS_WEEK_ORDER, JSON.stringify(ids));
}
function loadAlbumStatuses(): Record<string, AlbumStatus> {
  try {
    const raw = localStorage.getItem(LS_ALBUM_STATUS);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveAlbumStatuses(s: Record<string, AlbumStatus>) {
  localStorage.setItem(LS_ALBUM_STATUS, JSON.stringify(s));
}

// ─── CopyButton ─────────────────────────────────
function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className={`shrink-0 rounded px-3 py-1.5 text-xs font-medium transition ${copied ? "bg-green-800/40 text-green-400" : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40 hover:text-mundo-creme"}`}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

// ─── Main ───────────────────────────────────────
export default function CalendarView() {
  const [albumMap] = useState(() => getAlbumMap());
  const [weeks, setWeeks] = useState<ProductionWeek[]>([]);
  const [albumStatuses, setAlbumStatuses] = useState<Record<string, AlbumStatus>>({});
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedOrder = loadWeekOrder();
    if (savedOrder) {
      const weekMap = new Map(PRODUCTION_CALENDAR.map((w) => [w.id, w]));
      const ordered = savedOrder.map((id) => weekMap.get(id)).filter(Boolean) as ProductionWeek[];
      for (const w of PRODUCTION_CALENDAR) { if (!savedOrder.includes(w.id)) ordered.push(w); }
      setWeeks(ordered);
    } else {
      setWeeks([...PRODUCTION_CALENDAR]);
    }
    const saved = loadAlbumStatuses();
    const merged: Record<string, AlbumStatus> = {};
    for (const a of ALL_ALBUMS) merged[a.slug] = saved[a.slug] ?? a.status;
    setAlbumStatuses(merged);

    // Load saved audioUrls
    try {
      const raw = localStorage.getItem("loranne-audio-urls");
      if (raw) setAudioUrls(JSON.parse(raw));
    } catch {}
  }, []);

  const moveWeek = useCallback((idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= weeks.length) return;
    const next = [...weeks];
    [next[idx], next[target]] = [next[target], next[idx]];
    setWeeks(next);
    saveWeekOrder(next.map((w) => w.id));
  }, [weeks]);

  const markAlbumProduced = useCallback((slug: string) => {
    const next = { ...albumStatuses, [slug]: "produced" as AlbumStatus };
    setAlbumStatuses(next);
    saveAlbumStatuses(next);
    setSelectedAlbum(null);
  }, [albumStatuses]);

  const saveAudioUrl = useCallback((key: string, url: string) => {
    const next = { ...audioUrls, [key]: url };
    setAudioUrls(next);
    localStorage.setItem("loranne-audio-urls", JSON.stringify(next));
  }, [audioUrls]);

  // ─── Computed ─────────────────────────────────
  const distributionAlbums = ALL_ALBUMS.filter((a) => a.distribution);
  const producedCount = distributionAlbums.filter((a) => (albumStatuses[a.slug] ?? a.status) === "produced").length;
  const readyToLaunch = distributionAlbums.filter((a) => (albumStatuses[a.slug] ?? a.status) === "produced");
  const internalCount = ALL_ALBUMS.filter((a) => !a.distribution).length;

  // Find next week to work on (first non-complete week)
  const nextWeekIdx = weeks.findIndex((week) => {
    const weekAlbums = week.albums.map((s) => albumMap.get(s)).filter(Boolean) as Album[];
    return weekAlbums.some((a) => (albumStatuses[a.slug] ?? a.status) !== "produced");
  });

  // ─── Album detail ─────────────────────────────
  if (selectedAlbum) {
    const album = albumMap.get(selectedAlbum);
    if (!album) return null;
    const status = albumStatuses[album.slug] ?? album.status;

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedAlbum(null)} className="text-xs text-mundo-muted hover:text-mundo-creme transition">
          &larr; Voltar
        </button>

        <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-4 w-4 rounded-full" style={{ background: album.color }} />
            <h2 className="font-display text-xl text-mundo-creme">{album.title}</h2>
            <span className="rounded bg-mundo-muted-dark/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-mundo-muted">{album.product}</span>
            <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${status === "produced" ? "bg-green-900/30 text-green-400" : "bg-amber-900/20 text-amber-400"}`}>
              {status === "produced" ? "Produzido" : "Por produzir"}
            </span>
          </div>
          <p className="text-sm text-mundo-muted/70">{album.subtitle}</p>
        </div>

        {/* Tracks */}
        <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light overflow-hidden divide-y divide-mundo-muted-dark/10">
          {album.tracks.map((t) => {
            const audioKey = `${album.slug}/${t.number}`;
            return (
              <div key={t.number} className="p-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-mundo-muted/50">{String(t.number).padStart(2, "0")}</span>
                  <span className="font-medium text-mundo-creme">{t.title}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${t.lang === "PT" ? "bg-mundo-muted-dark/15 text-mundo-muted" : "bg-violet-900/30 text-violet-400"}`}>{t.lang}</span>
                  {t.energy && ENERGY_LABELS[t.energy] && (
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${ENERGY_LABELS[t.energy].color}`}>
                      {ENERGY_LABELS[t.energy].emoji} {ENERGY_LABELS[t.energy].label}
                    </span>
                  )}
                  {t.flavor && t.flavor !== "organic" && FLAVOR_LABELS[t.flavor] && (
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${FLAVOR_LABELS[t.flavor].color}`}>
                      {FLAVOR_LABELS[t.flavor].emoji} {FLAVOR_LABELS[t.flavor].label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-mundo-muted/60">{t.description}</p>

                <div className="flex items-center gap-2 flex-wrap">
                  <CopyButton text={t.prompt} label="Copiar prompt" />
                  {t.lyrics && <CopyButton text={t.lyrics} label="Copiar letra" />}
                </div>

                {/* Audio URL field */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={audioUrls[audioKey] || ""}
                    onChange={(e) => saveAudioUrl(audioKey, e.target.value)}
                    placeholder="Colar link do Suno aqui..."
                    className="flex-1 rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-3 py-1.5 text-xs text-mundo-creme placeholder:text-mundo-muted/30 focus:border-violet-500 focus:outline-none"
                  />
                  {audioUrls[audioKey] && (
                    <span className="text-[10px] text-green-400">&#10003;</span>
                  )}
                </div>

                {/* Lyrics (collapsed by default) */}
                {t.lyrics && (
                  <details className="group">
                    <summary className="text-[10px] text-mundo-muted/40 cursor-pointer hover:text-mundo-muted">Ver letra</summary>
                    <pre className="mt-2 whitespace-pre-wrap rounded bg-mundo-bg/50 p-3 font-mono text-xs text-mundo-muted/70 leading-relaxed max-h-48 overflow-y-auto">
                      {t.lyrics}
                    </pre>
                  </details>
                )}
              </div>
            );
          })}
        </div>

        {status !== "produced" && (
          <button
            onClick={() => markAlbumProduced(album.slug)}
            className="w-full rounded-xl bg-green-800/30 px-6 py-4 text-sm font-medium text-green-400 hover:bg-green-800/50 transition"
          >
            Marcar álbum como produzido
          </button>
        )}
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Resumo rápido */}
      <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-5 space-y-4">
        <h3 className="font-display text-lg text-mundo-creme">Distribuição Spotify</h3>
        <p className="text-xs text-mundo-muted/60">
          65 álbuns para DistroKid, organizados em 13 semanas temáticas. Os restantes {internalCount} álbuns (Espelhos, Nós, Cursos, etc.) ficam na app mas não saem para Spotify.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-mundo-muted">{producedCount} de {distributionAlbums.length} produzidos</span>
              <span className="text-mundo-muted">{Math.round((producedCount / distributionAlbums.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-mundo-muted-dark/20">
              <div className="h-2 rounded-full bg-green-500/60 transition-all" style={{ width: `${(producedCount / distributionAlbums.length) * 100}%` }} />
            </div>
          </div>
        </div>

        {readyToLaunch.length > 0 && (
          <div className="pt-2 border-t border-mundo-muted-dark/20">
            <p className="text-xs text-green-400 mb-2">{readyToLaunch.length} prontos para lançar:</p>
            <div className="flex flex-wrap gap-2">
              {readyToLaunch.map((a) => (
                <span key={a.slug} className="rounded-full px-3 py-1 text-xs font-medium border" style={{ borderColor: a.color + "60", color: a.color }}>
                  {a.title}
                </span>
              ))}
            </div>
            <Link href="/admin/lancamentos" className="inline-block mt-3 text-xs text-purple-400 hover:text-purple-300 transition">
              Ir para Lançamentos (DistroKid) &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Semanas */}
      {weeks.map((week, weekIdx) => {
        const weekAlbums = week.albums.map((slug) => albumMap.get(slug)).filter(Boolean) as Album[];
        const completedCount = weekAlbums.filter((a) => (albumStatuses[a.slug] ?? a.status) === "produced").length;
        const weekComplete = completedCount === weekAlbums.length && weekAlbums.length > 0;
        const isExpanded = expandedWeek === week.id;
        const isNext = weekIdx === nextWeekIdx;

        return (
          <div
            key={week.id}
            className={`rounded-xl border overflow-hidden transition-colors ${
              weekComplete ? "border-green-800/40 bg-green-950/10"
              : isNext ? "border-amber-700/40 bg-amber-950/5"
              : "border-mundo-muted-dark/30 bg-mundo-bg-light"
            }`}
          >
            <button
              onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-mundo-muted-dark/5 transition"
            >
              <div className="flex flex-col gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => moveWeek(weekIdx, -1)} disabled={weekIdx === 0} className="rounded px-1 py-0.5 text-[10px] text-mundo-muted hover:text-mundo-creme disabled:opacity-20 transition">▲</button>
                <button onClick={() => moveWeek(weekIdx, 1)} disabled={weekIdx === weeks.length - 1} className="rounded px-1 py-0.5 text-[10px] text-mundo-muted hover:text-mundo-creme disabled:opacity-20 transition">▼</button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base text-mundo-creme truncate">{week.theme}</h3>
                  {isNext && !weekComplete && (
                    <span className="rounded-full bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-400 font-medium shrink-0">Próxima</span>
                  )}
                  {weekComplete && (
                    <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-[10px] text-green-400 font-medium shrink-0">Concluída</span>
                  )}
                </div>
                <p className="text-xs text-mundo-muted/60 truncate">{week.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-mundo-muted">{completedCount}/{weekAlbums.length}</span>
                <div className="flex gap-1">
                  {weekAlbums.map((a) => {
                    const s = albumStatuses[a.slug] ?? a.status;
                    return (
                      <div key={a.slug} className="h-2.5 w-2.5 rounded-full transition"
                        style={{ background: s === "produced" ? a.color : "rgba(255,255,255,0.1)", border: s === "produced" ? "none" : "1px solid rgba(255,255,255,0.15)" }}
                        title={`${a.title} — ${s === "produced" ? "produzido" : "por produzir"}`}
                      />
                    );
                  })}
                </div>
                <span className="text-mundo-muted/40 text-xs">{isExpanded ? "▾" : "▸"}</span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-mundo-muted-dark/20 p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {weekAlbums.map((a) => {
                  const s = albumStatuses[a.slug] ?? a.status;
                  const isProduced = s === "produced";
                  return (
                    <button key={a.slug} onClick={() => setSelectedAlbum(a.slug)}
                      className={`rounded-lg p-3 text-left transition border ${isProduced ? "border-green-800/30 bg-green-950/10 hover:bg-green-950/20" : "border-mundo-muted-dark/20 bg-mundo-bg/50 hover:bg-mundo-bg/80"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-3 w-3 rounded-full shrink-0" style={{ background: isProduced ? a.color : "rgba(255,255,255,0.1)", border: isProduced ? "none" : "1px solid rgba(255,255,255,0.15)" }} />
                        <span className="font-medium text-sm text-mundo-creme truncate">{a.title}</span>
                        {isProduced && <span className="ml-auto text-[10px] text-green-400">Produzido</span>}
                      </div>
                      <p className="text-xs text-mundo-muted/50 truncate">{a.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
