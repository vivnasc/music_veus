"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

type ReleaseStatus = "publicado" | "agendado" | "a-produzir" | "em-producao";

type Release = {
  albumSlug: string;
  releaseDate: string; // ISO date
  status: ReleaseStatus;
  distrokidUrl?: string;
  notes?: string;
};

// ─────────────────────────────────────────────
// Dados: álbuns já publicados + agenda dos 10
// ─────────────────────────────────────────────

// 3 álbuns/semana em dias fixos: Segunda, Quarta e Sexta.
// Sexta coincide com New Music Friday do Spotify = melhor visibilidade.
// 12 álbuns = 4 semanas completas (3+3+3+3).
// Ordem estratégica: começar pelo mais leve, variar colecções e energias.

const RELEASE_DAYS = "Segunda · Quarta · Sexta";

const RELEASES: Release[] = [
  // ── Já publicados ──
  {
    albumSlug: "incenso-frequencia",
    releaseDate: "2026-03-15",
    status: "publicado",
    notes: "Primeiro álbum publicado. 10 faixas.",
  },
  {
    albumSlug: "livro-filosofico",
    releaseDate: "2026-03-22",
    status: "publicado",
    notes: "9 faixas. Companheiro do livro filosófico.",
  },

  // ── Semana 1: Alegria + Corpo (Seg 14, Qua 16, Sex 18 Abril) ──
  {
    albumSlug: "grao-festa",
    releaseDate: "2026-04-13",
    status: "a-produzir",
    notes: "Celebração, alegria sem motivo. O álbum mais leve.",
  },
  {
    albumSlug: "grao-boca-aberta",
    releaseDate: "2026-04-15",
    status: "a-produzir",
    notes: "Gargalhadas, tolice, brincar. Funk + bossa.",
  },
  {
    albumSlug: "fibra-azul-fundo",
    releaseDate: "2026-04-17",
    status: "a-produzir",
    notes: "Natação. Água, silêncio debaixo de água, paz.",
  },

  // ── Semana 2: Chill + Ciclos + Dança (Seg 21, Qua 23, Sex 25 Abril) ──
  {
    albumSlug: "mare-varanda-quente",
    releaseDate: "2026-04-20",
    status: "a-produzir",
    notes: "House chill puro. Pôr-do-sol, varanda, vinho.",
  },
  {
    albumSlug: "grao-estacoes",
    releaseDate: "2026-04-22",
    status: "a-produzir",
    notes: "Páscoa, solstício, outono, inverno, Ano Novo interior.",
  },
  {
    albumSlug: "incenso-pes-descalcos",
    releaseDate: "2026-04-24",
    status: "a-produzir",
    notes: "O corpo que dança antes da mente. House + marrabenta.",
  },

  // ── Semana 3: Profundidade + Gratidão + Duetos (Seg 28, Qua 30, Sex 2 Mai) ──
  {
    albumSlug: "eter-oceano",
    releaseDate: "2026-04-27",
    status: "a-produzir",
    notes: "O corpo como água. Profundo mas belo.",
  },
  {
    albumSlug: "incenso-maos-juntas",
    releaseDate: "2026-04-29",
    status: "a-produzir",
    notes: "Gratidão como prática. Gospel + folk.",
  },
  {
    albumSlug: "nua-duas-vozes",
    releaseDate: "2026-05-01",
    status: "a-produzir",
    notes: "Duetos íntimos. Diálogos cantados no quotidiano.",
  },

  // ── Semana 4: Recomeços + Verão + Noite (Seg 4, Qua 6, Sex 8 Mai) ──
  {
    albumSlug: "grao-porta-aberta",
    releaseDate: "2026-05-04",
    status: "a-produzir",
    notes: "Primeiras vezes: escola, emprego, cidade nova.",
  },
  {
    albumSlug: "grao-sal-na-pele",
    releaseDate: "2026-05-06",
    status: "a-produzir",
    notes: "Praia, calor, sal na pele, cigarras. House + marrabenta.",
  },
  {
    albumSlug: "mare-lua-acordada",
    releaseDate: "2026-05-08",
    status: "a-produzir",
    notes: "Passeios nocturnos, luzes da cidade, pensamentos às 3h.",
  },
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
    espelho: "Espelhos",
    no: "Nós",
    livro: "Livro",
    curso: "Cursos",
    incenso: "Incenso",
    eter: "Éter",
    nua: "Nua",
    sangue: "Sangue",
    fibra: "Fibra",
    grao: "Grão",
    mare: "Maré",
  };
  return labels[album.product] || album.product;
}

function getCollectionColor(slug: string): string {
  const album = getAlbum(slug);
  if (!album) return "#666";
  const colors: Record<string, string> = {
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
  return colors[album.product] || "#666";
}

const STATUS_CONFIG: Record<ReleaseStatus, { label: string; color: string; bg: string }> = {
  publicado: { label: "Publicado", color: "#4ade80", bg: "rgba(74, 222, 128, 0.1)" },
  agendado: { label: "Agendado", color: "#60a5fa", bg: "rgba(96, 165, 250, 0.1)" },
  "em-producao": { label: "Em produção", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)" },
  "a-produzir": { label: "A produzir", color: "#a0a0b0", bg: "rgba(160, 160, 176, 0.1)" },
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function getWeekNumber(iso: string, baseDate: string): number {
  const d = new Date(iso + "T12:00:00").getTime();
  const b = new Date(baseDate + "T12:00:00").getTime();
  if (d < b) return -1;
  return Math.floor((d - b) / (7 * 24 * 60 * 60 * 1000));
}

function isToday(iso: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return iso === today;
}

function isPast(iso: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return iso < today;
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export default function LancamentosPage() {
  const [releases, setReleases] = useState<Release[]>(RELEASES);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const published = releases.filter((r: Release) => r.status === "publicado");
  const upcoming = releases.filter((r: Release) => r.status !== "publicado");
  const totalTracks = releases.reduce((sum: number, r: Release) => sum + getTrackCount(r.albumSlug), 0);
  const publishedTracks = published.reduce((sum: number, r: Release) => sum + getTrackCount(r.albumSlug), 0);

  // Group upcoming by week
  const firstUpcomingDate = upcoming[0]?.releaseDate || "2026-04-14";
  const weekGroups: { week: number; label: string; releases: Release[] }[] = [];
  const weekLabels = [
    "Semana 1 — Alegria + Corpo",
    "Semana 2 — Chill + Ciclos + Dança",
    "Semana 3 — Profundidade + Duetos",
    "Semana 4 — Recomeços + Verão + Noite",
  ];

  for (const r of upcoming) {
    const wk = getWeekNumber(r.releaseDate, firstUpcomingDate);
    const existing = weekGroups.find((g) => g.week === wk);
    if (existing) {
      existing.releases.push(r);
    } else {
      weekGroups.push({
        week: wk,
        label: weekLabels[wk] || `Semana ${wk + 1}`,
        releases: [r],
      });
    }
  }

  function cycleStatus(slug: string) {
    setReleases((prev: Release[]) =>
      prev.map((r: Release) => {
        if (r.albumSlug !== slug) return r;
        const order: ReleaseStatus[] = ["a-produzir", "em-producao", "agendado", "publicado"];
        const idx = order.indexOf(r.status);
        const next = order[(idx + 1) % order.length];
        return { ...r, status: next };
      })
    );
  }

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
          DistroKid &middot; 3 álbuns/semana &middot; {RELEASE_DAYS}
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Publicados" value={published.length} color="#4ade80" />
        <StatCard label="Agendados" value={releases.filter((r: Release) => r.status === "agendado").length} color="#60a5fa" />
        <StatCard label="Em produção" value={releases.filter((r: Release) => r.status === "em-producao").length} color="#fbbf24" />
        <StatCard label="Total faixas" value={`${publishedTracks}/${totalTracks}`} color="#C9A96E" />
      </div>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs text-[#666680] mb-2">
          <span>{published.length} de {releases.length} álbuns publicados</span>
          <span>{Math.round((published.length / releases.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(published.length / releases.length) * 100}%`,
              background: "linear-gradient(90deg, #4ade80, #C9A96E)",
            }}
          />
        </div>
      </div>

      {/* Already published */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-sm font-semibold text-[#666680] uppercase tracking-wider mb-4">
          Já publicados
        </h2>
        <div className="space-y-3">
          {published.map((r: Release) => (
            <ReleaseCard
              key={r.albumSlug}
              release={r}
              expanded={expandedSlug === r.albumSlug}
              onToggle={() => setExpandedSlug(expandedSlug === r.albumSlug ? null : r.albumSlug)}
              onCycleStatus={() => cycleStatus(r.albumSlug)}
            />
          ))}
        </div>
      </div>

      {/* Upcoming by week */}
      {weekGroups.map((group) => (
        <div key={group.week} className="max-w-4xl mx-auto mb-8">
          <h2 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">
            {group.label}
          </h2>
          <div className="space-y-3">
            {group.releases.map((r) => (
              <ReleaseCard
                key={r.albumSlug}
                release={r}
                expanded={expandedSlug === r.albumSlug}
                onToggle={() => setExpandedSlug(expandedSlug === r.albumSlug ? null : r.albumSlug)}
                onCycleStatus={() => cycleStatus(r.albumSlug)}
              />
            ))}
          </div>
        </div>
      ))}

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
            <span className="text-[#c08aaa]">Ordem:</span> Começar pelos álbuns mais leves
            (Festa, Boca Aberta) para estabelecer identidade alegre antes dos contemplativos.
          </li>
          <li>
            <span className="text-[#fbbf24]">Atenção:</span> 4+ álbuns/semana pode disparar
            revisão manual no Spotify. 3/semana é o máximo seguro.
          </li>
          <li>
            <span className="text-[#F5F0E6]">Total:</span> 12 álbuns em 4 semanas
            (13 Abril → 8 Maio 2026).
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Componentes
// ─────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center"
    >
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
  onCycleStatus,
}: {
  release: Release;
  expanded: boolean;
  onToggle: () => void;
  onCycleStatus: () => void;
}) {
  const album = getAlbum(release.albumSlug);
  const statusCfg = STATUS_CONFIG[release.status];
  const past = isPast(release.releaseDate);
  const today = isToday(release.releaseDate);
  const trackCount = getTrackCount(release.albumSlug);
  const collection = getCollectionLabel(release.albumSlug);
  const collColor = getCollectionColor(release.albumSlug);
  const albumColor = getAlbumColor(release.albumSlug);

  // Count languages
  const ptCount = album?.tracks.filter((t) => t.lang === "PT").length || 0;
  const enCount = album?.tracks.filter((t) => t.lang === "EN").length || 0;

  // Energy distribution
  const energies = album?.tracks.reduce(
    (acc, t) => {
      acc[t.energy] = (acc[t.energy] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        today
          ? "border-[#C9A96E]/40 bg-[#C9A96E]/5"
          : past && release.status !== "publicado"
            ? "border-red-500/20 bg-red-500/5"
            : "border-white/5 bg-white/[0.02]"
      }`}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-xl"
        onClick={onToggle}
      >
        {/* Album color bar */}
        <div
          className="w-1 h-14 rounded-full flex-shrink-0"
          style={{ backgroundColor: albumColor }}
        />

        {/* Date */}
        <div className="flex-shrink-0 w-20 text-center">
          <div className={`text-xs ${today ? "text-[#C9A96E]" : "text-[#666680]"}`}>
            {formatDate(release.releaseDate)}
          </div>
          {today && (
            <div className="text-[10px] text-[#C9A96E] font-semibold mt-0.5">HOJE</div>
          )}
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
            {release.notes && <span className="hidden sm:inline"> &middot; {release.notes}</span>}
          </div>
        </div>

        {/* Status badge */}
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onCycleStatus();
          }}
          className="flex-shrink-0 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold transition-colors hover:opacity-80"
          style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
          title="Clicar para mudar estado"
        >
          {statusCfg.label}
        </button>

        {/* Expand arrow */}
        <div className="text-[#666680] text-xs flex-shrink-0">
          {expanded ? "▲" : "▼"}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && album && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          {/* Subtitle */}
          <p className="text-xs text-[#a0a0b0] italic mb-3">{album.subtitle}</p>

          {/* Notes */}
          {release.notes && (
            <p className="text-xs text-[#666680] mb-3">{release.notes}</p>
          )}

          {/* Energy distribution */}
          <div className="flex items-center gap-2 mb-3">
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

          {/* Track list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {album.tracks.map((track) => (
              <div
                key={track.number}
                className="flex items-center gap-2 text-xs py-1 px-2 rounded hover:bg-white/[0.02]"
              >
                <span className="text-[#666680] w-4 text-right">{track.number}</span>
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
