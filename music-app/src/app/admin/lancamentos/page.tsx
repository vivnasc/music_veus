"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

type ReleaseStatus = "publicado" | "pronto" | "em-producao";

type Release = {
  albumSlug: string;
  releaseDate: string;
  status: ReleaseStatus;
  produced: number;
  total: number;
  notes?: string;
};

// ─────────────────────────────────────────────
// Álbuns já publicados (fixo)
// ─────────────────────────────────────────────

const PUBLISHED: { slug: string; date: string; notes: string }[] = [
  { slug: "incenso-frequencia", date: "2026-03-15", notes: "Primeiro álbum publicado." },
  { slug: "livro-filosofico", date: "2026-03-22", notes: "Companheiro do livro filosófico." },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getAlbum(slug: string) {
  return ALL_ALBUMS.find((a) => a.slug === slug);
}

function getAlbumTitle(slug: string): string {
  return getAlbum(slug)?.title || slug;
}

function getAlbumColor(slug: string): string {
  return getAlbum(slug)?.color || "#C9A96E";
}

function getTrackCount(slug: string): number {
  return getAlbum(slug)?.tracks.length || 0;
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

const STATUS_CONFIG: Record<ReleaseStatus, { label: string; color: string; bg: string }> = {
  publicado: { label: "Publicado", color: "#4ade80", bg: "rgba(74, 222, 128, 0.1)" },
  pronto: { label: "Pronto a lançar", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)" },
  "em-producao": { label: "Em produção", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" },
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

/**
 * Gerar datas de lançamento: 3/semana (Seg, Qua, Sex)
 * A partir da próxima segunda-feira após hoje.
 */
function generateReleaseDates(count: number): string[] {
  const today = new Date();
  // Find next Monday
  const start = new Date(today);
  const dayOfWeek = start.getDay();
  const daysToMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 0 : 8 - dayOfWeek;
  start.setDate(start.getDate() + daysToMonday);

  const dates: string[] = [];
  const current = new Date(start);

  while (dates.length < count) {
    const dow = current.getDay();
    // Monday=1, Wednesday=3, Friday=5
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
  const [audioMap, setAudioMap] = useState<Record<string, Set<number>>>({});
  const [loading, setLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Fetch production status from Supabase
  useEffect(() => {
    adminFetch("/api/admin/audio-status")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Set<number>> = {};
        for (const key of (data.existing || []) as string[]) {
          const match = key.match(/^(.+)-t(\d+)$/);
          if (match) {
            const slug = match[1];
            const num = parseInt(match[2], 10);
            if (!map[slug]) map[slug] = new Set();
            map[slug].add(num);
          }
        }
        setAudioMap(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build releases from real data
  const publishedSlugs = new Set(PUBLISHED.map((p) => p.slug));

  const publishedReleases: Release[] = PUBLISHED.map((p) => ({
    albumSlug: p.slug,
    releaseDate: p.date,
    status: "publicado" as ReleaseStatus,
    produced: getTrackCount(p.slug),
    total: getTrackCount(p.slug),
    notes: p.notes,
  }));

  // Albums with ALL tracks produced (100%) — ready to release
  const readyAlbums = ALL_ALBUMS
    .filter((a) => {
      if (publishedSlugs.has(a.slug)) return false;
      const done = audioMap[a.slug]?.size || 0;
      return done >= a.tracks.length && a.tracks.length > 0;
    })
    .sort((a, b) => {
      // Sort: lighter energy first (more whisper/steady = lighter)
      const lightScore = (album: typeof a) => {
        let s = 0;
        for (const t of album.tracks) {
          if (t.energy === "whisper") s += 2;
          else if (t.energy === "steady") s += 1;
          else if (t.energy === "anthem") s -= 1;
          else if (t.energy === "raw") s -= 2;
        }
        return s / album.tracks.length;
      };
      return lightScore(b) - lightScore(a);
    });

  // Albums partially produced
  const partialAlbums = ALL_ALBUMS.filter((a) => {
    if (publishedSlugs.has(a.slug)) return false;
    const done = audioMap[a.slug]?.size || 0;
    return done > 0 && done < a.tracks.length;
  });

  // Generate dates for ready albums
  const releaseDates = generateReleaseDates(readyAlbums.length);

  const readyReleases: Release[] = readyAlbums.map((a, i) => ({
    albumSlug: a.slug,
    releaseDate: releaseDates[i] || "",
    status: "pronto" as ReleaseStatus,
    produced: a.tracks.length,
    total: a.tracks.length,
  }));

  // Group ready releases by week (3 per week)
  const weekGroups: { week: number; releases: Release[] }[] = [];
  for (let i = 0; i < readyReleases.length; i++) {
    const weekIdx = Math.floor(i / 3);
    if (!weekGroups[weekIdx]) {
      weekGroups[weekIdx] = { week: weekIdx, releases: [] };
    }
    weekGroups[weekIdx].releases.push(readyReleases[i]);
  }

  const totalReady = readyAlbums.length;
  const totalPartial = partialAlbums.length;
  const totalPublished = publishedReleases.length;
  const weeksNeeded = Math.ceil(totalReady / 3);

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-8 sm:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/admin/producao"
            className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors"
          >
            &larr; Produção
          </Link>
          <Link
            href="/admin/calendario"
            className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors"
          >
            Calendário social &rarr;
          </Link>
        </div>
        <h1 className="text-2xl font-bold font-display tracking-wide">
          Agenda de Lançamentos
        </h1>
        <p className="text-sm text-[#666680] mt-1">
          DistroKid &middot; 3 álbuns/semana &middot; Segunda · Quarta · Sexta
        </p>
      </div>

      {loading ? (
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-[#666680]">A carregar estado de produção...</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="max-w-4xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Publicados" value={totalPublished} color="#4ade80" />
            <StatCard label="Prontos a lançar" value={totalReady} color="#60a5fa" />
            <StatCard label="Em produção" value={totalPartial} color="#fbbf24" />
            <StatCard
              label="Semanas p/ lançar"
              value={weeksNeeded > 0 ? weeksNeeded : "—"}
              color="#C9A96E"
            />
          </div>

          {/* Progress bar */}
          {totalReady > 0 && (
            <div className="max-w-4xl mx-auto mb-10">
              <div className="flex items-center justify-between text-xs text-[#666680] mb-2">
                <span>
                  {totalPublished} publicados · {totalReady} prontos · {totalPartial} em produção
                </span>
                <span>{totalReady} álbuns em {weeksNeeded} semanas</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(totalPublished / (totalPublished + totalReady)) * 100}%`,
                    background: "linear-gradient(90deg, #4ade80, #C9A96E)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Already published */}
          <div className="max-w-4xl mx-auto mb-10">
            <h2 className="text-sm font-semibold text-[#4ade80] uppercase tracking-wider mb-4">
              Já publicados
            </h2>
            <div className="space-y-3">
              {publishedReleases.map((r) => (
                <ReleaseCard
                  key={r.albumSlug}
                  release={r}
                  expanded={expandedSlug === r.albumSlug}
                  onToggle={() => setExpandedSlug(expandedSlug === r.albumSlug ? null : r.albumSlug)}
                  audioTracks={audioMap[r.albumSlug]}
                />
              ))}
            </div>
          </div>

          {/* Ready to release — by week */}
          {totalReady > 0 && (
            <div className="max-w-4xl mx-auto mb-10">
              <h2 className="text-sm font-semibold text-[#60a5fa] uppercase tracking-wider mb-4">
                Prontos a lançar ({totalReady} álbuns)
              </h2>
              <p className="text-xs text-[#666680] mb-4">
                Todos com áudio completo. Ordem sugerida: dos mais leves aos mais intensos.
              </p>
              {weekGroups.map((group) => (
                <div key={group.week} className="mb-6">
                  <h3 className="text-xs text-[#C9A96E] uppercase tracking-wider mb-2">
                    Semana {group.week + 1}
                  </h3>
                  <div className="space-y-3">
                    {group.releases.map((r) => (
                      <ReleaseCard
                        key={r.albumSlug}
                        release={r}
                        expanded={expandedSlug === r.albumSlug}
                        onToggle={() => setExpandedSlug(expandedSlug === r.albumSlug ? null : r.albumSlug)}
                        audioTracks={audioMap[r.albumSlug]}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalReady === 0 && !loading && (
            <div className="max-w-4xl mx-auto mb-10 p-6 rounded-xl border border-white/5 bg-white/[0.02] text-center">
              <p className="text-[#666680]">
                Nenhum álbum com todas as faixas produzidas.
              </p>
              <p className="text-xs text-[#666680] mt-1">
                Produz todas as faixas de um álbum na página de Produção para ele aparecer aqui.
              </p>
            </div>
          )}

          {/* Partially produced */}
          {totalPartial > 0 && (
            <div className="max-w-4xl mx-auto mb-10">
              <h2 className="text-sm font-semibold text-[#fbbf24] uppercase tracking-wider mb-4">
                Em produção ({totalPartial} álbuns)
              </h2>
              <p className="text-xs text-[#666680] mb-3">
                Faltam faixas. Completa a produção para entrarem na fila de lançamento.
              </p>
              <div className="space-y-2">
                {partialAlbums.map((album) => {
                  const done = audioMap[album.slug]?.size || 0;
                  const total = album.tracks.length;
                  const pct = Math.round((done / total) * 100);
                  const collection = getCollectionLabel(album.slug);
                  const collColor = getCollectionColor(album.slug);
                  return (
                    <div
                      key={album.slug}
                      className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                    >
                      <div
                        className="w-1 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: album.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{album.title}</span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ color: collColor, backgroundColor: `${collColor}15` }}
                          >
                            {collection}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[120px]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: "#fbbf24" }}
                            />
                          </div>
                          <span className="text-[10px] text-[#a0a0b0]">
                            {done}/{total} faixas ({pct}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DistroKid tips */}
          <div className="max-w-4xl mx-auto mt-12 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <h3 className="text-sm font-semibold text-[#C9A96E] mb-3">Notas DistroKid</h3>
            <ul className="text-xs text-[#a0a0b0] space-y-2">
              <li>
                <span className="text-[#4ade80]">Ritmo:</span> 3 álbuns/semana — Segunda, Quarta
                e Sexta. Espaçamento de 2 dias entre cada lançamento.
              </li>
              <li>
                <span className="text-[#60a5fa]">Sexta-feira:</span> Melhor dia da semana para
                lançar — coincide com o New Music Friday do Spotify.
              </li>
              <li>
                <span className="text-[#fbbf24]">Atenção:</span> 4+ álbuns/semana pode disparar
                revisão manual no Spotify. 3/semana é o máximo seguro.
              </li>
            </ul>
          </div>
        </>
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
      <div className="text-2xl font-bold font-display" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-[#666680] mt-1">{label}</div>
    </div>
  );
}

function ReleaseCard({
  release,
  expanded,
  onToggle,
  audioTracks,
}: {
  release: Release;
  expanded: boolean;
  onToggle: () => void;
  audioTracks?: Set<number>;
}) {
  const album = getAlbum(release.albumSlug);
  const statusCfg = STATUS_CONFIG[release.status];
  const trackCount = getTrackCount(release.albumSlug);
  const collection = getCollectionLabel(release.albumSlug);
  const collColor = getCollectionColor(release.albumSlug);
  const albumColor = getAlbumColor(release.albumSlug);

  const ptCount = album?.tracks.filter((t) => t.lang === "PT").length || 0;
  const enCount = album?.tracks.filter((t) => t.lang === "EN").length || 0;

  const energies =
    album?.tracks.reduce(
      (acc, t) => {
        acc[t.energy] = (acc[t.energy] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-200">
      {/* Main row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-xl"
        onClick={onToggle}
      >
        <div
          className="w-1 h-14 rounded-full flex-shrink-0"
          style={{ backgroundColor: albumColor }}
        />

        {/* Date */}
        <div className="flex-shrink-0 w-20 text-center">
          <div className="text-xs text-[#666680]">
            {formatDate(release.releaseDate)}
          </div>
        </div>

        {/* Album info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">
              {getAlbumTitle(release.albumSlug)}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider"
              style={{ color: collColor, backgroundColor: `${collColor}15` }}
            >
              {collection}
            </span>
          </div>
          <div className="text-xs text-[#666680] mt-0.5">
            {trackCount} faixas &middot; {ptCount} PT / {enCount} EN
            {release.notes && (
              <span className="hidden sm:inline"> &middot; {release.notes}</span>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span
          className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold"
          style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
        >
          {statusCfg.label}
        </span>

        <div className="text-[#666680] text-xs flex-shrink-0">
          {expanded ? "▲" : "▼"}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && album && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <p className="text-xs text-[#a0a0b0] italic mb-3">{album.subtitle}</p>

          {release.notes && (
            <p className="text-xs text-[#666680] mb-3">{release.notes}</p>
          )}

          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-[10px] text-[#666680] uppercase">Energias:</span>
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
                {audioTracks && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: audioTracks.has(track.number) ? "#4ade80" : "#333",
                    }}
                    title={audioTracks.has(track.number) ? "Áudio produzido" : "Sem áudio"}
                  />
                )}
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
                {track.flavor && (
                  <span className="text-[10px] text-[#c08aaa]">{track.flavor}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
