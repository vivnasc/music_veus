"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  PRESENCA_SUBS,
  PRESENCA_SUB_META,
  PRESENCA_MANIFESTO,
  getAlbumsForSub,
  presencaStats,
  type PresencaSub,
  type PresencaSubSlug,
  type PresencaAlbum,
  type PresencaTrack,
} from "@/data/presenca";

// localStorage state — production overrides per track.
// Keyed by `${subSlug}/${albumSlug}/${trackNumber}`.
const STORAGE_KEY = "veus:presenca-production-v1";

type TrackStatus = "rascunho" | "letra-pronta" | "gerado" | "aprovada" | "publicado";

type ProductionState = Record<string, {
  status?: TrackStatus;
  sunoClipId?: string;
  publishedAt?: string;
  note?: string;
}>;

const STATUS_LABEL: Record<TrackStatus, string> = {
  "rascunho": "Rascunho",
  "letra-pronta": "Letra pronta",
  "gerado": "Gerado no Suno",
  "aprovada": "Aprovada",
  "publicado": "Publicado",
};

const STATUS_COLOR: Record<TrackStatus, string> = {
  "rascunho": "bg-white/5 text-[#a0a0b0]",
  "letra-pronta": "bg-blue-500/15 text-blue-400",
  "gerado": "bg-purple-500/15 text-purple-400",
  "aprovada": "bg-green-500/15 text-green-400",
  "publicado": "bg-[#C9A96E]/20 text-[#C9A96E]",
};

function trackKey(sub: string, album: string, n: number) {
  return `${sub}/${album}/${n}`;
}

export default function AdminPresencaPage() {
  const [state, setState] = useState<ProductionState>({});
  const [activeSub, setActiveSub] = useState<PresencaSubSlug | null>(PRESENCA_SUBS[0]?.slug as PresencaSubSlug ?? null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const stats = useMemo(() => {
    const base = presencaStats();
    let withState = 0;
    let approved = base.totalTracksApproved;
    let published = 0;
    let generated = 0;
    for (const key of Object.keys(state)) {
      const s = state[key]?.status;
      if (!s) continue;
      withState++;
      if (s === "aprovada") approved++;
      if (s === "publicado") published++;
      if (s === "gerado") generated++;
    }
    return { ...base, withState, approved, published, generated };
  }, [state]);

  function updateTrack(key: string, patch: Partial<ProductionState[string]>) {
    setState((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  const activeSubObj = PRESENCA_SUBS.find((s) => s.slug === activeSub);

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
          <Link href="/admin" className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/5" aria-label="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">Presença — Produção</h1>
            <p className="text-[11px] text-[#a0a0b0]">
              Loranne & Ancient Ground · meditação cantada · 49 álbuns / 343 faixas
            </p>
          </div>
          <Link
            href="/presenca"
            className="ml-auto text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#c9c9d4]"
          >
            Ver site público →
          </Link>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Stat label="Álbuns escritos" value={`${stats.totalAlbumsWritten}/${stats.totalAlbumsPlanned}`} />
          <Stat label="Faixas com letra" value={`${stats.totalTracksWritten}/${stats.totalTracksPlanned}`} />
          <Stat label="Gerado Suno" value={stats.generated} accent="purple" />
          <Stat label="Aprovadas" value={stats.approved} accent="green" />
          <Stat label="Publicadas" value={stats.published} accent="gold" />
        </section>

        {/* Sub-coleção selector */}
        <section>
          <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">
            Sub-colecções
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {PRESENCA_SUBS.map((sub) => {
              const meta = PRESENCA_SUB_META[sub.slug];
              const written = getAlbumsForSub(sub.slug).length;
              const isActive = activeSub === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => setActiveSub(sub.slug as PresencaSubSlug)}
                  className={`text-left rounded-xl p-3 transition border ${
                    isActive
                      ? "border-white/20 bg-white/[0.06]"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                  }`}
                  style={isActive ? { boxShadow: `inset 0 0 0 2px ${meta.color}66` } : {}}
                >
                  <div
                    className="w-6 h-6 rounded-full mb-2"
                    style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}55)` }}
                  />
                  <p className="text-[13px] font-semibold text-[#F5F0E6]">{sub.label}</p>
                  <p className="text-[10px] text-[#8a8a9a] mt-0.5 line-clamp-2">{meta.verbo} · {meta.paraQuando.replace("para ", "")}</p>
                  <p className="text-[10px] mt-1.5 text-[#666680]">
                    <span className={written === sub.albumCount ? "text-green-400" : ""}>{written}</span>
                    /{sub.albumCount} álbuns
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Active sub-coleção detail */}
        {activeSubObj && (
          <SubDetailPanel
            sub={activeSubObj}
            state={state}
            onChange={updateTrack}
          />
        )}

        {/* Manifesto */}
        <section className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
          <h3 className="text-[11px] uppercase tracking-widest text-[#8a8a9a] mb-3">Manifesto</h3>
          <div className="text-[12px] leading-relaxed text-[#a0a0b0] whitespace-pre-wrap max-h-64 overflow-y-auto pr-2">
            {PRESENCA_MANIFESTO}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: "green" | "purple" | "gold" }) {
  const c = accent === "green" ? "text-green-400" : accent === "purple" ? "text-purple-400" : accent === "gold" ? "text-[#C9A96E]" : "text-[#F5F0E6]";
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
      <p className="text-[10px] uppercase tracking-widest text-[#8a8a9a]">{label}</p>
      <p className={`text-lg font-semibold mt-1 ${c}`}>{value}</p>
    </div>
  );
}

function SubDetailPanel({
  sub,
  state,
  onChange,
}: {
  sub: PresencaSub;
  state: ProductionState;
  onChange: (key: string, patch: Partial<ProductionState[string]>) => void;
}) {
  const meta = PRESENCA_SUB_META[sub.slug as PresencaSubSlug];
  const albums = getAlbumsForSub(sub.slug as PresencaSubSlug);

  return (
    <section className="space-y-5">
      <div
        className="rounded-2xl p-5 border border-white/5"
        style={{ background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}05)` }}
      >
        <p className="text-[11px] uppercase tracking-widest text-[#a0a0b0]">{meta.verbo}</p>
        <h2 className="text-2xl font-semibold mt-1">{sub.label}</h2>
        <p className="text-sm text-[#c9c9d4] mt-2">{sub.funcao}</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-[11px]">
          {sub.instrumental && (
            <>
              <Field label="Sons">{sub.instrumental.sounds}</Field>
              <Field label="Tom">{sub.instrumental.key}</Field>
              <Field label="BPM">{sub.instrumental.bpm}</Field>
            </>
          )}
          {sub.layers && (
            <>
              <Field label="Solfeggio">{sub.layers.solfeggio}</Field>
              <Field label="Chakra">{sub.layers.chakra}</Field>
              <Field label="Tradição">{sub.layers.tradition}</Field>
            </>
          )}
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-sm text-[#8a8a9a]">
            Ainda não há álbuns escritos para <strong>{sub.label}</strong>.
          </p>
          <p className="text-[11px] text-[#666680] mt-1">
            {sub.albumCount} álbuns previstos. Cria os ficheiros <code>PRESENÇA_Project/*.md</code> no GitHub —
            o deploy seguinte parseia automaticamente.
          </p>
        </div>
      ) : (
        albums.map((album) => (
          <AlbumRow
            key={album.slug}
            sub={sub}
            album={album}
            state={state}
            onChange={onChange}
          />
        ))
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-black/20 px-3 py-2 border border-white/5">
      <p className="text-[9px] uppercase tracking-widest text-[#8a8a9a]">{label}</p>
      <p className="text-[11px] text-[#e5e5ec] mt-0.5 line-clamp-2">{children}</p>
    </div>
  );
}

function AlbumRow({
  sub,
  album,
  state,
  onChange,
}: {
  sub: PresencaSub;
  album: PresencaAlbum;
  state: ProductionState;
  onChange: (key: string, patch: Partial<ProductionState[string]>) => void;
}) {
  const [expanded, setExpanded] = useState(album.number === 1);
  const meta = PRESENCA_SUB_META[sub.slug as PresencaSubSlug];

  const counts = album.tracks.reduce(
    (acc, t) => {
      const k = trackKey(sub.slug, album.slug, t.number);
      const s = state[k]?.status ?? (t.flag === "aprovada" ? "aprovada" : t.sunoPrompt ? "letra-pronta" : "rascunho");
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-4 hover:bg-white/[0.03] text-left"
      >
        <div
          className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-sm font-semibold text-white"
          style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}55)` }}
        >
          {album.number}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-[#F5F0E6] truncate">{album.title}</h4>
          {album.funcao && <p className="text-[11px] text-[#a0a0b0] line-clamp-1">{album.funcao}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
          {Object.entries(counts).map(([k, v]) => (
            <span key={k} className={`px-2 py-0.5 rounded-full ${STATUS_COLOR[k as TrackStatus] ?? "bg-white/5 text-[#a0a0b0]"}`}>
              {v} {STATUS_LABEL[k as TrackStatus] ?? k}
            </span>
          ))}
        </div>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-[#666680] transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-white/5">
          {album.tracks.map((track) => (
            <TrackRow
              key={track.number}
              sub={sub}
              album={album}
              track={track}
              state={state[trackKey(sub.slug, album.slug, track.number)]}
              onChange={(patch) => onChange(trackKey(sub.slug, album.slug, track.number), patch)}
            />
          ))}
          <div className="px-4 py-2 border-t border-white/5 flex flex-wrap gap-3 text-[11px]">
            <Link
              href={`/presenca/${sub.slug}/${album.slug}`}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#c9c9d4]"
              target="_blank"
            >
              Abrir página pública →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackRow({
  sub,
  album,
  track,
  state,
  onChange,
}: {
  sub: PresencaSub;
  album: PresencaAlbum;
  track: PresencaTrack;
  state: ProductionState[string] | undefined;
  onChange: (patch: Partial<ProductionState[string]>) => void;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState<"lyrics" | "style" | null>(null);

  const status: TrackStatus = state?.status ?? (track.flag === "aprovada" ? "aprovada" : track.sunoPrompt ? "letra-pronta" : "rascunho");

  async function copy(text: string, which: "lyrics" | "style") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  return (
    <div className="px-4 py-3 border-b border-white/5 last:border-b-0">
      <div className="flex items-start gap-3 flex-wrap">
        <div className="text-[10px] uppercase tracking-widest text-[#666680] w-16 shrink-0 pt-1">
          {album.number}.{track.number}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-semibold text-[#F5F0E6]">{track.title}</p>
            <span className="text-[10px] text-[#8a8a9a]">{track.position}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLOR[status]}`}>
              {STATUS_LABEL[status]}
            </span>
          </div>
          {track.concept && (
            <p className="text-[11px] text-[#a0a0b0] mt-1 leading-relaxed">{track.concept}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={status}
            onChange={(e) => onChange({ status: e.target.value as TrackStatus })}
            className="text-[11px] bg-white/5 border border-white/10 rounded px-2 py-1 text-[#F5F0E6]"
          >
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          {track.sunoPrompt && (
            <>
              <button
                onClick={() => copy(track.sunoPrompt, "lyrics")}
                className="text-[11px] px-2.5 py-1 rounded bg-[#C9A96E]/15 hover:bg-[#C9A96E]/25 text-[#C9A96E]"
              >
                {copied === "lyrics" ? "✓" : "Lyrics"}
              </button>
              {track.style && (
                <button
                  onClick={() => copy(track.style, "style")}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#c9c9d4]"
                >
                  {copied === "style" ? "✓" : "Style"}
                </button>
              )}
              <button
                onClick={() => setShowPrompt((v) => !v)}
                className="text-[11px] px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#c9c9d4]"
              >
                {showPrompt ? "Esconder" : "Ver"}
              </button>
            </>
          )}
        </div>
      </div>

      {showPrompt && track.sunoPrompt && (
        <div className="mt-3 grid sm:grid-cols-2 gap-3">
          <pre className="text-[10.5px] leading-relaxed text-[#c9c9d4] whitespace-pre-wrap bg-black/30 rounded-lg p-3 border border-white/5 overflow-x-auto max-h-80 overflow-y-auto">
{track.sunoPrompt}
          </pre>
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-widest text-[#8a8a9a]">Style</p>
            <p className="text-[11px] leading-relaxed text-[#a0a0b0] bg-black/20 rounded-lg p-3 border border-white/5">
              {track.style}
            </p>
            <p className="text-[9px] uppercase tracking-widest text-[#8a8a9a] mt-3">Notas</p>
            <textarea
              value={state?.note ?? ""}
              onChange={(e) => onChange({ note: e.target.value })}
              placeholder="Notas da geração — clip ID, takes, ajustes..."
              className="w-full text-[11px] bg-black/20 border border-white/10 rounded-lg p-2 text-[#F5F0E6] min-h-[80px] resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
