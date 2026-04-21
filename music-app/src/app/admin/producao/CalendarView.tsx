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
import {
  PRODUCTION_CALENDAR,
  LORANNE_RELEASE_DATES,
  type ProductionWeek,
} from "@/data/production-calendar";

// ─── localStorage ───────────────────────────────
const LS_WEEK_ORDER = "loranne-calendar-week-order";
const LS_ALBUM_STATUS = "loranne-album-status";

function getAlbumMap(): Map<string, Album> {
  const m = new Map<string, Album>();
  for (const a of ALL_ALBUMS) m.set(a.slug, a);
  return m;
}
function loadWeekOrder(): string[] | null {
  try { const r = localStorage.getItem(LS_WEEK_ORDER); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveWeekOrder(ids: string[]) { localStorage.setItem(LS_WEEK_ORDER, JSON.stringify(ids)); }
function loadAlbumStatuses(): Record<string, AlbumStatus> {
  try { const r = localStorage.getItem(LS_ALBUM_STATUS); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveAlbumStatuses(s: Record<string, AlbumStatus>) { localStorage.setItem(LS_ALBUM_STATUS, JSON.stringify(s)); }

const DAY_LABELS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

/** Helper: lista ordenada de slugs de um tema (ignora entradas vazias). */
function weekSlugs(week: ProductionWeek): string[] {
  return [week.albums.segunda, week.albums.quarta, week.albums.sexta].filter(Boolean);
}

/** Entradas do tema com a data real de lançamento (ex: "2026-05-15"). */
function weekAlbumEntries(week: ProductionWeek): { date: Date | null; slug: string }[] {
  return weekSlugs(week).map((slug) => {
    const iso = LORANNE_RELEASE_DATES[slug];
    return { date: iso ? new Date(iso) : null, slug };
  });
}

/** Range de datas do tema (primeira → última). */
function weekDateRange(week: ProductionWeek): { start: Date | null; end: Date | null } {
  const dates = weekAlbumEntries(week)
    .map((e) => e.date)
    .filter((d): d is Date => !!d);
  if (dates.length === 0) return { start: null, end: null };
  dates.sort((a, b) => a.getTime() - b.getTime());
  return { start: dates[0], end: dates[dates.length - 1] };
}

function formatDate(d: Date): string {
  const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function formatRange(start: Date | null, end: Date | null): string {
  if (!start || !end) return "sem data";
  if (start.toDateString() === end.toDateString()) return formatDate(start);
  return `${formatDate(start)} → ${formatDate(end)}`;
}

function dayLabel(date: Date | null): string {
  if (!date) return "—";
  return DAY_LABELS[date.getDay()];
}

// ─── CopyButton ─────────────────────────────────
function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className={`shrink-0 rounded px-3 py-1.5 text-xs font-medium transition ${copied ? "bg-green-800/40 text-green-400" : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40 hover:text-mundo-creme"}`}
    >{copied ? "Copiado" : label}</button>
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
      const wm = new Map(PRODUCTION_CALENDAR.map((w) => [w.id, w]));
      const ordered = savedOrder.map((id) => wm.get(id)).filter(Boolean) as ProductionWeek[];
      for (const w of PRODUCTION_CALENDAR) { if (!savedOrder.includes(w.id)) ordered.push(w); }
      setWeeks(ordered);
    } else {
      setWeeks([...PRODUCTION_CALENDAR]);
    }
    const saved = loadAlbumStatuses();
    const merged: Record<string, AlbumStatus> = {};
    for (const a of ALL_ALBUMS) merged[a.slug] = saved[a.slug] ?? a.status;
    setAlbumStatuses(merged);
    try { const r = localStorage.getItem("loranne-audio-urls"); if (r) setAudioUrls(JSON.parse(r)); } catch {}
  }, []);

  const moveWeek = useCallback((idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= weeks.length) return;
    const n = [...weeks]; [n[idx], n[t]] = [n[t], n[idx]];
    setWeeks(n); saveWeekOrder(n.map((w) => w.id));
  }, [weeks]);

  const markAlbumProduced = useCallback((slug: string) => {
    const n = { ...albumStatuses, [slug]: "produced" as AlbumStatus };
    setAlbumStatuses(n); saveAlbumStatuses(n); setSelectedAlbum(null);
  }, [albumStatuses]);

  const saveAudioUrl = useCallback((key: string, url: string) => {
    const n = { ...audioUrls, [key]: url };
    setAudioUrls(n); localStorage.setItem("loranne-audio-urls", JSON.stringify(n));
  }, [audioUrls]);

  // ─── Stats ────────────────────────────────────
  const allSlugs = weeks.flatMap(weekSlugs);
  const totalAlbums = new Set(allSlugs).size;
  const producedCount = allSlugs.filter((s) => (albumStatuses[s] ?? "ready") === "produced").length;
  const nextWeekIdx = weeks.findIndex((w) => weekSlugs(w).some((s) => (albumStatuses[s] ?? "ready") !== "produced"));

  // ─── Album detail ─────────────────────────────
  if (selectedAlbum) {
    const album = albumMap.get(selectedAlbum);
    if (!album) return null;
    const status = albumStatuses[album.slug] ?? album.status;

    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedAlbum(null)} className="text-xs text-mundo-muted hover:text-mundo-creme transition">&larr; Voltar</button>
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

        <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light overflow-hidden divide-y divide-mundo-muted-dark/10">
          {album.tracks.map((t) => {
            const audioKey = `${album.slug}/${t.number}`;
            return (
              <div key={t.number} className="p-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-mundo-muted/50">{String(t.number).padStart(2, "0")}</span>
                  <span className="font-medium text-mundo-creme">{t.title}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${t.lang === "PT" ? "bg-mundo-muted-dark/15 text-mundo-muted" : "bg-violet-900/30 text-violet-400"}`}>{t.lang}</span>
                  {t.energy && ENERGY_LABELS[t.energy] && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${ENERGY_LABELS[t.energy].color}`}>{ENERGY_LABELS[t.energy].emoji} {ENERGY_LABELS[t.energy].label}</span>}
                  {t.flavor && t.flavor !== "organic" && FLAVOR_LABELS[t.flavor] && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${FLAVOR_LABELS[t.flavor].color}`}>{FLAVOR_LABELS[t.flavor].emoji} {FLAVOR_LABELS[t.flavor].label}</span>}
                </div>
                <p className="text-xs text-mundo-muted/60">{t.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <CopyButton text={t.prompt} label="Copiar prompt" />
                  {t.lyrics && <CopyButton text={t.lyrics} label="Copiar letra" />}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" value={audioUrls[audioKey] || ""} onChange={(e) => saveAudioUrl(audioKey, e.target.value)}
                    placeholder="Colar link do Suno aqui..."
                    className="flex-1 rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-3 py-1.5 text-xs text-mundo-creme placeholder:text-mundo-muted/30 focus:border-violet-500 focus:outline-none" />
                  {audioUrls[audioKey] && <span className="text-[10px] text-green-400">&#10003;</span>}
                </div>
                {t.lyrics && (
                  <details className="group">
                    <summary className="text-[10px] text-mundo-muted/40 cursor-pointer hover:text-mundo-muted">Ver letra</summary>
                    <pre className="mt-2 whitespace-pre-wrap rounded bg-mundo-bg/50 p-3 font-mono text-xs text-mundo-muted/70 leading-relaxed max-h-48 overflow-y-auto">{t.lyrics}</pre>
                  </details>
                )}
              </div>
            );
          })}
        </div>

        {status !== "produced" && (
          <button onClick={() => markAlbumProduced(album.slug)}
            className="w-full rounded-xl bg-green-800/30 px-6 py-4 text-sm font-medium text-green-400 hover:bg-green-800/50 transition">
            Álbum concluído
          </button>
        )}
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-5 space-y-4">
        <h3 className="font-display text-lg text-mundo-creme">Produção para Spotify</h3>
        <p className="text-xs text-mundo-muted/60">
          39 álbuns com datas explícitas. 1 lançamento por semana, às sextas (com excepções nas transições).
          Produz no Suno, marca como concluído, depois confirma datas nos <Link href="/admin/lancamentos" className="text-purple-400 hover:text-purple-300">Lançamentos</Link>.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-mundo-muted">{producedCount} de {totalAlbums} produzidos</span>
              <span className="text-mundo-muted">{totalAlbums > 0 ? Math.round((producedCount / totalAlbums) * 100) : 0}%</span>
            </div>
            <div className="h-2 rounded-full bg-mundo-muted-dark/20">
              <div className="h-2 rounded-full bg-green-500/60 transition-all" style={{ width: `${totalAlbums > 0 ? (producedCount / totalAlbums) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Week list */}
      {weeks.map((week, weekIdx) => {
        const entries = weekAlbumEntries(week);
        const slugs = weekSlugs(week);
        const albums = slugs.map((s) => albumMap.get(s)).filter(Boolean) as Album[];
        const completedCount = albums.filter((a) => (albumStatuses[a.slug] ?? a.status) === "produced").length;
        const weekComplete = completedCount === albums.length && albums.length > 0;
        const isExpanded = expandedWeek === week.id;
        const isNext = weekIdx === nextWeekIdx;
        const { start, end } = weekDateRange(week);

        return (
          <div key={week.id}
            className={`rounded-xl border overflow-hidden transition-colors ${weekComplete ? "border-green-800/40 bg-green-950/10" : isNext ? "border-amber-700/40 bg-amber-950/5" : "border-mundo-muted-dark/30 bg-mundo-bg-light"}`}>
            <button onClick={() => setExpandedWeek(isExpanded ? null : week.id)}
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-mundo-muted-dark/5 transition">
              <div className="flex flex-col gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => moveWeek(weekIdx, -1)} disabled={weekIdx === 0} className="rounded px-1 py-0.5 text-[10px] text-mundo-muted hover:text-mundo-creme disabled:opacity-20 transition">▲</button>
                <button onClick={() => moveWeek(weekIdx, 1)} disabled={weekIdx === weeks.length - 1} className="rounded px-1 py-0.5 text-[10px] text-mundo-muted hover:text-mundo-creme disabled:opacity-20 transition">▼</button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base text-mundo-creme truncate">{week.theme}</h3>
                  {isNext && !weekComplete && <span className="rounded-full bg-amber-900/30 px-2 py-0.5 text-[10px] text-amber-400 font-medium shrink-0">Próxima</span>}
                  {weekComplete && <span className="rounded-full bg-green-900/30 px-2 py-0.5 text-[10px] text-green-400 font-medium shrink-0">Concluída</span>}
                </div>
                <p className="text-xs text-mundo-muted/60 truncate">{week.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-mundo-muted/40">{formatRange(start, end)}</span>
                <span className="text-xs text-mundo-muted">{completedCount}/{albums.length || 3}</span>
                <div className="flex gap-1">
                  {albums.map((a) => {
                    const s = albumStatuses[a.slug] ?? a.status;
                    return <div key={a.slug} className="h-2.5 w-2.5 rounded-full" style={{ background: s === "produced" ? a.color : "rgba(255,255,255,0.1)", border: s === "produced" ? "none" : "1px solid rgba(255,255,255,0.15)" }} title={`${a.title}`} />;
                  })}
                </div>
                <span className="text-mundo-muted/40 text-xs">{isExpanded ? "▾" : "▸"}</span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-mundo-muted-dark/20 divide-y divide-mundo-muted-dark/10">
                {entries.map(({ date, slug }) => {
                  const a = albumMap.get(slug);
                  if (!a) return null;
                  const s = albumStatuses[a.slug] ?? a.status;
                  const isProduced = s === "produced";
                  return (
                    <button key={slug} onClick={() => setSelectedAlbum(slug)}
                      className={`w-full p-4 flex items-center gap-4 text-left transition ${isProduced ? "hover:bg-green-950/10" : "hover:bg-mundo-muted-dark/5"}`}>
                      <div className="shrink-0 w-14 text-center">
                        <div className="text-xs font-medium text-mundo-muted">{dayLabel(date)}</div>
                        <div className="text-[10px] text-mundo-muted/40">{date ? formatDate(date) : "—"}</div>
                      </div>
                      <div className="h-8 w-1 rounded-full shrink-0" style={{ background: isProduced ? a.color : "rgba(255,255,255,0.1)" }} />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm text-mundo-creme">{a.title}</span>
                        <span className="ml-2 text-[10px] text-mundo-muted/40 uppercase">{a.product}</span>
                        <p className="text-xs text-mundo-muted/50 truncate">{a.subtitle}</p>
                      </div>
                      {isProduced
                        ? <span className="text-[10px] text-green-400 shrink-0">Produzido</span>
                        : <span className="text-[10px] text-mundo-muted/30 shrink-0">Por produzir</span>}
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
