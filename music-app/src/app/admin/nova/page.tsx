"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { NOVA_ALBUMS } from "@/data/nova-albums";
import type { Album, AlbumTrack } from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";

// ─── Types ───

type SunoClip = {
  id: string;
  status: string;
  audioUrl: string | null;
  originalAudioUrl?: string | null;
  title: string;
  imageUrl?: string | null;
  duration?: number | null;
};

type TrackState = {
  status: "idle" | "generating" | "polling" | "done" | "error" | "uploaded";
  error: string;
  clips: SunoClip[];
  uploadedAt?: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";

function trackKey(albumSlug: string, n: number) { return `${albumSlug}/${n}`; }

function formatTime(s: number) {
  if (!s || !isFinite(s) || isNaN(s)) return "--:--";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`shrink-0 rounded px-3 py-1.5 text-[11px] font-medium transition ${
        copied ? "bg-green-800/40 text-green-400"
               : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40 hover:text-mundo-creme"
      }`}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

// ─── Mini Player ───

function MiniPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => { if (a.duration && isFinite(a.duration)) setDuration(a.duration); };
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("ended", onEnd);
    a.preload = "auto";
    a.load();
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const hasDur = duration > 0 && isFinite(duration);
  const pct = hasDur ? (current / duration) * 100 : 0;

  return (
    <div className="mb-2">
      <audio ref={ref} src={src} preload="metadata" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            if (playing) a.pause(); else a.play();
            setPlaying(!playing);
          }}
          className="shrink-0 text-mundo-creme hover:text-white"
        >
          {playing
            ? <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="4" width="3" height="12" rx="1"/><rect x="12" y="4" width="3" height="12" rx="1"/></svg>
            : <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><polygon points="6,3 17,10 6,17"/></svg>}
        </button>
        <div
          className="flex-1 h-1.5 bg-mundo-muted-dark/30 rounded-full cursor-pointer"
          onClick={(e) => {
            const a = ref.current;
            if (!a || !hasDur) return;
            const rect = e.currentTarget.getBoundingClientRect();
            a.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration;
          }}
        >
          <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-mundo-muted tabular-nums shrink-0">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

// ─── Track Card ───

function TrackCard({
  album, track, state, sunoModel, personaId,
  editedStyle, editedTitle, editedLyrics,
  onEditStyle, onEditTitle, onEditLyrics,
  onGenerate, onApprove, onDownload,
}: {
  album: Album;
  track: AlbumTrack;
  state: TrackState;
  sunoModel: string;
  personaId: string;
  editedStyle: string | null;
  editedTitle: string | null;
  editedLyrics: string | null;
  onEditStyle: (s: string | null) => void;
  onEditTitle: (s: string | null) => void;
  onEditLyrics: (s: string | null) => void;
  onGenerate: () => void;
  onApprove: (clips: SunoClip[]) => void;
  onDownload: (url: string, title: string) => void;
}) {
  const [showStyle, setShowStyle] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  const isWorking = state.status === "generating" || state.status === "polling";

  // Valor actual (edição se existir, senão a fonte do .md)
  const styleValue = editedStyle ?? track.prompt;
  const titleValue = editedTitle ?? track.title;
  const lyricsValue = editedLyrics ?? track.lyrics;
  const styleEdited = editedStyle !== null && editedStyle !== track.prompt;
  const titleEdited = editedTitle !== null && editedTitle !== track.title;
  const lyricsEdited = editedLyrics !== null && editedLyrics !== track.lyrics;

  return (
    <div className="rounded-xl border border-mundo-muted-dark/20 bg-mundo-bg-light/50 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 w-8 h-8 rounded-full bg-violet-900/40 text-violet-300 flex items-center justify-center text-xs font-bold">
            {track.number}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-mundo-creme truncate">{titleValue}</h3>
            <p className="text-[10px] text-mundo-muted truncate">{track.description}</p>
          </div>
        </div>
        {state.status === "uploaded" && (
          <span className="shrink-0 text-[10px] rounded-full px-2 py-0.5 text-green-400 bg-green-900/20">
            no Supabase
          </span>
        )}
        {state.status === "done" && (
          <span className="shrink-0 text-[10px] rounded-full px-2 py-0.5 text-amber-400 bg-amber-900/20">
            gerado
          </span>
        )}
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-2 mb-2 text-[11px]">
        <button onClick={() => setShowTitle(!showTitle)} className="text-violet-300 hover:text-violet-200">
          {showTitle ? "Esconder TITLE" : "Editar TITLE"}{titleEdited && <span className="text-amber-400 ml-1">●</span>}
        </button>
        <button onClick={() => setShowStyle(!showStyle)} className="text-violet-300 hover:text-violet-200">
          {showStyle ? "Esconder STYLE" : "Editar STYLE"}{styleEdited && <span className="text-amber-400 ml-1">●</span>}
        </button>
        <button onClick={() => setShowLyrics(!showLyrics)} className="text-violet-300 hover:text-violet-200">
          {showLyrics ? "Esconder LYRICS" : "Editar LYRICS"}{lyricsEdited && <span className="text-amber-400 ml-1">●</span>}
        </button>
      </div>

      {showTitle && (
        <div className="mb-3 rounded-lg bg-black/30 p-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-[10px] uppercase tracking-wider text-violet-400">
              Title{titleEdited && <span className="text-amber-400 ml-1">(editado)</span>}
            </span>
            <div className="flex items-center gap-2">
              {titleEdited && (
                <button
                  onClick={() => { if (window.confirm("Repor título original?")) onEditTitle(null); }}
                  className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#a0a0b0] hover:bg-white/10 transition"
                >
                  ↺ Repor
                </button>
              )}
              <CopyButton text={titleValue} label="Copiar" />
            </div>
          </div>
          <input
            type="text"
            value={titleValue}
            onChange={(e) => onEditTitle(e.target.value)}
            className="w-full bg-mundo-bg p-2 rounded text-xs text-mundo-creme/90 font-mono border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none"
          />
        </div>
      )}

      {showStyle && (
        <div className="mb-3 rounded-lg bg-black/30 p-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-[10px] uppercase tracking-wider text-violet-400">
              Style of Music{styleEdited && <span className="text-amber-400 ml-1">(editado)</span>}
            </span>
            <div className="flex items-center gap-2">
              {styleEdited && (
                <button
                  onClick={() => { if (window.confirm("Repor STYLE original do .md?")) onEditStyle(null); }}
                  className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#a0a0b0] hover:bg-white/10 transition"
                >
                  ↺ Repor
                </button>
              )}
              <CopyButton text={styleValue} label="Copiar" />
            </div>
          </div>
          <textarea
            value={styleValue}
            onChange={(e) => {
              const next = e.target.value;
              if (track.prompt.length > 50 && next.trim().length < 10) {
                if (!window.confirm(`Vais apagar o STYLE inteiro (${styleValue.length} chars). Continuar?`)) return;
              }
              onEditStyle(next);
            }}
            className="w-full bg-mundo-bg p-2 rounded text-[11px] text-mundo-creme/90 font-mono border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none min-h-[5rem] max-h-72 resize-y"
            spellCheck={false}
          />
          <p className="text-[9px] text-mundo-muted-dark mt-1">{styleValue.length} caracteres</p>
        </div>
      )}

      {showLyrics && (
        <div className="mb-3 rounded-lg bg-black/30 p-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className="text-[10px] uppercase tracking-wider text-violet-400">
              Lyrics{lyricsEdited && <span className="text-amber-400 ml-1">(editado)</span>}
            </span>
            <div className="flex items-center gap-2">
              {lyricsEdited && (
                <button
                  onClick={() => { if (window.confirm("Repor LYRICS original do .md?")) onEditLyrics(null); }}
                  className="text-[10px] px-2 py-1 rounded bg-white/5 text-[#a0a0b0] hover:bg-white/10 transition"
                >
                  ↺ Repor
                </button>
              )}
              <CopyButton text={lyricsValue} label="Copiar" />
            </div>
          </div>
          <textarea
            value={lyricsValue}
            onChange={(e) => {
              const next = e.target.value;
              if (track.lyrics.trim().length > 50 && next.trim().length < 10) {
                if (!window.confirm(`Vais apagar a letra inteira (${lyricsValue.length} chars). O .md original mantém-se. Continuar?`)) return;
              }
              onEditLyrics(next);
            }}
            className="w-full bg-mundo-bg p-2 rounded text-[11px] text-mundo-creme/90 font-mono leading-relaxed border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none min-h-[16rem] max-h-[32rem] resize-y"
            spellCheck={false}
          />
          <p className="text-[9px] text-mundo-muted-dark mt-1">{lyricsValue.length} caracteres</p>
        </div>
      )}

      {state.error && state.status === "error" && (
        <p className="text-[11px] text-red-400 mb-2 break-words">{state.error}</p>
      )}
      {state.error && state.status !== "error" && (
        <p className="text-[10px] text-mundo-muted mb-2 break-words">{state.error}</p>
      )}

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={isWorking}
        className={`w-full rounded-lg px-4 py-2.5 text-xs font-medium transition mb-3 ${
          isWorking
            ? "bg-violet-900/20 text-violet-600 animate-pulse cursor-wait"
            : "bg-violet-700/30 text-violet-200 hover:bg-violet-700/50"
        }`}
      >
        {state.status === "generating" ? "A enviar ao Suno..."
         : state.status === "polling" ? "A gerar... (polling)"
         : state.clips.length > 0 ? "Regenerar no Suno"
         : `Gerar no Suno (${sunoModel}${personaId ? " · persona" : ""})`}
      </button>

      {/* Generated clips */}
      {state.clips.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] text-mundo-muted">
            {state.clips.length} versões geradas — escolhe a melhor para guardar
          </p>
          {state.clips.map((clip, i) => (
            <div key={clip.id || i} className="rounded-lg bg-black/20 p-3">
              <div className="flex items-start gap-3 mb-2">
                {clip.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={clip.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                )}
                <p className="text-[11px] text-violet-300 font-medium">
                  Versão {String.fromCharCode(65 + i)} {clip.duration ? `(${formatTime(clip.duration)})` : ""}
                </p>
              </div>
              {clip.audioUrl && <MiniPlayer src={clip.audioUrl} />}
              <div className="flex gap-2 flex-wrap">
                {clip.audioUrl && (
                  <button
                    onClick={() => onDownload(clip.originalAudioUrl || clip.audioUrl!, `${track.title} - v${String.fromCharCode(65 + i)}`)}
                    className="rounded px-3 py-1.5 text-[10px] bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40 transition"
                  >
                    Download
                  </button>
                )}
                {clip.audioUrl && (
                  <button
                    onClick={() => onApprove([clip])}
                    className="rounded px-3 py-1.5 text-[10px] bg-green-800/30 text-green-300 hover:bg-green-800/50 transition"
                  >
                    Aprovar versão {String.fromCharCode(65 + i)}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Save best — guarda a primeira versão por defeito */}
          {state.clips.some(c => c.audioUrl) && (
            <p className="text-[10px] text-mundo-muted-dark text-center">
              Guarda em <code>albums/{album.slug}/faixa-{String(track.number).padStart(2, "0")}.mp3</code>
            </p>
          )}
        </div>
      )}

      {/* Custom cover upload (Midjourney) */}
    </div>
  );
}

// ─── Album actions bar (DistroKid + custom album cover) ───

function AlbumActionsBar({
  album,
  onDistroZip,
  onUploadAlbumCover,
}: {
  album: Album;
  onDistroZip: (album: Album, btn: HTMLButtonElement) => Promise<void>;
  onUploadAlbumCover: (album: Album, file: File) => Promise<void>;
}) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  return (
    <div className="border-t border-mundo-muted-dark/20 p-4 flex flex-wrap gap-2 items-center">
      <button
        id={`distro-btn-${album.slug}`}
        onClick={(e) => onDistroZip(album, e.currentTarget as HTMLButtonElement)}
        className="rounded-lg bg-green-700/80 px-3 py-2 text-xs font-medium text-white hover:bg-green-800 transition"
      >
        DistroKid ZIP
      </button>

      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          setMsg("");
          try {
            await onUploadAlbumCover(album, file);
            setMsg(`Capa do álbum enviada (${Math.round(file.size / 1024)}KB)`);
            setTimeout(() => setMsg(""), 4000);
          } catch (err: unknown) {
            setMsg(`Erro: ${err instanceof Error ? err.message : String(err)}`);
          } finally {
            setUploading(false);
            if (coverInputRef.current) coverInputRef.current.value = "";
          }
        }}
      />
      <button
        onClick={() => coverInputRef.current?.click()}
        disabled={uploading}
        className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
          uploading
            ? "bg-pink-900/20 text-pink-500 animate-pulse cursor-wait"
            : "bg-pink-700/80 text-white hover:bg-pink-800"
        }`}
      >
        {uploading ? "A enviar capa..." : "Capa do álbum (Midjourney)"}
      </button>

      <p className="text-[10px] text-mundo-muted">
        ZIP: WAVs + capa 3000×3000 + metadata. Capa do álbum: 1 imagem para todo o álbum (capas Suno por faixa continuam intactas).
      </p>

      {msg && (
        <p className="basis-full text-[10px] text-mundo-muted break-words">{msg}</p>
      )}
    </div>
  );
}

// ─── Main ───

// localStorage key para edições
const EDITS_LS_KEY = "nova_admin_edits_v1";
type Edit = { style?: string; title?: string; lyrics?: string };
type EditsMap = Record<string, Edit>; // trackKey → edits

function loadEdits(): EditsMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(EDITS_LS_KEY) || "{}"); } catch { return {}; }
}
function saveEdits(map: EditsMap): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(EDITS_LS_KEY, JSON.stringify(map)); } catch {}
}

export default function NovaAdminPage() {
  const [sunoModel, setSunoModel] = useState("V5_5");
  const [personaId, setPersonaId] = useState("");
  const [states, setStates] = useState<Record<string, TrackState>>({});
  const [openAlbum, setOpenAlbum] = useState<string | null>(NOVA_ALBUMS[0]?.slug ?? null);
  const [search, setSearch] = useState("");
  const pollingRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Edições por faixa — persistidas em localStorage. Cada campo é
  // independente: undefined = usa o original do .md; string = usa esse valor
  // (mesmo que vazio, para permitir intencionalmente apagar).
  const [edits, setEdits] = useState<EditsMap>({});
  useEffect(() => { setEdits(loadEdits()); }, []);
  useEffect(() => { saveEdits(edits); }, [edits]);

  function setField(key: string, field: keyof Edit, value: string | null) {
    setEdits((e) => {
      const cur = e[key] || {};
      const next = { ...cur };
      if (value === null) delete next[field];
      else next[field] = value;
      const out = { ...e, [key]: next };
      // Limpa entrada se ficar vazia
      if (Object.keys(next).length === 0) delete out[key];
      return out;
    });
  }
  function getEdit(key: string, field: keyof Edit): string | null {
    return edits[key]?.[field] ?? null;
  }

  const totalTracks = useMemo(
    () => NOVA_ALBUMS.reduce((s, a) => s + a.tracks.length, 0),
    []
  );

  // On mount: HEAD-check Supabase to see which tracks already exist
  useEffect(() => {
    const basePath = `${SUPABASE_URL}/storage/v1/object/public/audios/albums`;
    async function checkExisting() {
      const found: Record<string, TrackState> = {};
      const checks: Promise<void>[] = [];
      for (const album of NOVA_ALBUMS) {
        for (const track of album.tracks) {
          const tn = String(track.number).padStart(2, "0");
          const url = `${basePath}/${album.slug}/faixa-${tn}.mp3`;
          checks.push(
            fetch(url, { method: "HEAD" }).then((r) => {
              if (r.ok) {
                found[trackKey(album.slug, track.number)] = {
                  status: "uploaded",
                  error: "Já existe no Supabase",
                  clips: [],
                };
              }
            }).catch(() => {})
          );
        }
      }
      await Promise.all(checks);
      if (Object.keys(found).length > 0) setStates((s) => ({ ...s, ...found }));
    }
    checkExisting();
  }, []);

  function getState(key: string): TrackState {
    return states[key] || { status: "idle", error: "", clips: [] };
  }

  // Poll Suno
  const pollStatus = useCallback((key: string, clipIds: string[]) => {
    setStates((s) => ({ ...s, [key]: { ...(s[key] || { clips: [], status: "polling", error: "" }), status: "polling", error: "" } }));
    let pollCount = 0;
    const interval = setInterval(async () => {
      pollCount++;
      try {
        const res = await adminFetch(`/api/admin/suno/status?ids=${clipIds.join(",")}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.erro) throw new Error(data.erro);

        const info = (data.clips || []).map((c: SunoClip) => c.status).join(", ");
        setStates((s) => ({ ...s, [key]: { ...(s[key] || { clips: [], status: "polling", error: "" }), error: `Poll #${pollCount}: ${info}` } }));

        if (data.clips.some((c: SunoClip) => c.status === "error")) {
          clearInterval(pollingRef.current[key]);
          delete pollingRef.current[key];
          setStates((s) => ({ ...s, [key]: { status: "error", error: `Suno erro: ${JSON.stringify(data.clips.map((c: SunoClip) => c.status))}`, clips: [] } }));
          return;
        }

        const allDone = data.clips.every((c: SunoClip) => c.status === "complete" && c.audioUrl);
        if (allDone) {
          clearInterval(pollingRef.current[key]);
          delete pollingRef.current[key];

          // Cache audio in browser memory (avoid CDN expiry)
          const cached: SunoClip[] = [];
          for (const c of data.clips as SunoClip[]) {
            if (!c.audioUrl) { cached.push(c); continue; }
            try {
              const r = await fetch(c.audioUrl);
              if (r.ok) {
                const blob = await r.blob();
                if (blob.size > 1000) {
                  cached.push({ ...c, audioUrl: URL.createObjectURL(blob), originalAudioUrl: c.audioUrl });
                  continue;
                }
              }
            } catch { /* keep original */ }
            cached.push(c);
          }
          setStates((s) => ({ ...s, [key]: { status: "done", error: "", clips: cached } }));
        }
      } catch (err) {
        console.warn(`[poll #${pollCount}] ${key}:`, err);
      }
    }, 5000);

    pollingRef.current[key] = interval;
    setTimeout(() => {
      if (pollingRef.current[key]) {
        clearInterval(pollingRef.current[key]);
        delete pollingRef.current[key];
        setStates((s) => {
          const cur = s[key];
          if (cur?.status === "polling") return { ...s, [key]: { ...cur, status: "error", error: "Timeout após 10 min." } };
          return s;
        });
      }
    }, 10 * 60 * 1000);
  }, []);

  // Generate via Suno API — passa STYLE verbatim como customStyle, lyrics, title
  async function generateTrack(album: Album, track: AlbumTrack) {
    const key = trackKey(album.slug, track.number);
    setStates((s) => ({ ...s, [key]: { status: "generating", error: "", clips: [] } }));

    // Usa edições se existirem, senão a versão original do .md.
    const styleVal  = edits[key]?.style  ?? track.prompt;
    const titleVal  = edits[key]?.title  ?? track.title;
    const lyricsVal = edits[key]?.lyrics ?? track.lyrics;

    try {
      const res = await adminFetch("/api/admin/suno/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: styleVal,
          customStyle: styleVal,
          lyrics: lyricsVal,
          title: titleVal,
          instrumental: false,
          model: sunoModel,
          ...(personaId ? { personaId, personaModel: "voice_persona" } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ erro: `HTTP ${res.status}` }));
        throw new Error(data.erro || `Erro ${res.status}`);
      }
      const data = await res.json();
      if (!data.clips?.length) throw new Error("Nenhum clip retornado.");

      const allReady = data.clips.every((c: SunoClip) => c.audioUrl);
      if (allReady) {
        setStates((s) => ({ ...s, [key]: { status: "done", error: "", clips: data.clips } }));
      } else {
        pollStatus(key, data.clips.map((c: SunoClip) => c.id));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStates((s) => ({ ...s, [key]: { status: "error", error: msg, clips: [] } }));
    }
  }

  // Approve — upload to Supabase as albums/<slug>/faixa-XX.mp3 (+ cover)
  async function approveTrack(album: Album, track: AlbumTrack, clips: SunoClip[]) {
    const key = trackKey(album.slug, track.number);
    const tn = String(track.number).padStart(2, "0");
    setStates((s) => ({ ...s, [key]: { ...(s[key] || { clips: [], status: "generating", error: "" }), status: "generating", error: "A guardar no Supabase..." } }));

    try {
      const clip = clips.find((c) => c.audioUrl);
      if (!clip || !clip.audioUrl) throw new Error("Sem audioUrl no clip.");

      // Audio
      let blob: Blob;
      if (clip.audioUrl.startsWith("blob:")) {
        blob = await (await fetch(clip.audioUrl)).blob();
      } else {
        const r = await adminFetch("/api/admin/proxy-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: clip.audioUrl }),
        });
        blob = await r.blob();
      }
      if (blob.size < 1000) throw new Error(`MP3 demasiado pequeno (${blob.size} bytes)`);

      const filename = `albums/${album.slug}/faixa-${tn}.mp3`;
      const sign = await adminFetch("/api/admin/signed-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (!sign.ok) {
        const e = await sign.json().catch(() => ({}));
        throw new Error(`Signed URL falhou (${sign.status}): ${e.erro || JSON.stringify(e).slice(0, 100)}`);
      }
      const { signedUrl } = await sign.json();
      const up = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/mpeg" },
        body: blob,
      });
      if (!up.ok) {
        const t = await up.text().catch(() => "");
        throw new Error(`Upload falhou (${up.status}): ${t.slice(0, 100)}`);
      }
      // Verify
      const verifyUrl = `${SUPABASE_URL}/storage/v1/object/public/audios/${filename}`;
      const v = await fetch(verifyUrl, { method: "HEAD", cache: "no-store" });
      if (!v.ok) throw new Error(`MP3 enviado mas não acessível (${v.status}).`);

      // Cover
      if (clip.imageUrl) {
        try {
          let coverBlob: Blob;
          try {
            coverBlob = await (await fetch(clip.imageUrl)).blob();
          } catch {
            const r = await adminFetch("/api/admin/proxy-download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: clip.imageUrl }),
            });
            coverBlob = await r.blob();
          }
          if (coverBlob.size > 1000) {
            const coverFile = `albums/${album.slug}/faixa-${tn}-cover.jpg`;
            const sign2 = await adminFetch("/api/admin/signed-upload-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filename: coverFile }),
            });
            if (sign2.ok) {
              const { signedUrl } = await sign2.json();
              await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: coverBlob });
            }
          }
        } catch (e) { console.warn("Cover upload failed:", e); }
      }

      setStates((s) => ({ ...s, [key]: { status: "uploaded", error: `Guardado: faixa-${tn}.mp3`, clips: [], uploadedAt: new Date().toISOString() } }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStates((s) => ({ ...s, [key]: { ...(s[key] || { clips: [], status: "error", error: "" }), status: "error", error: msg } }));
    }
  }

  // Upload album cover (Midjourney etc.) — vai para albums/<slug>/cover.<ext>
  // SEPARADO das capas Suno por faixa (faixa-XX-cover.jpg) — essas continuam
  // a funcionar para a vista por faixa.
  async function uploadAlbumCover(album: Album, file: File) {
    if (file.size < 1000) throw new Error("Ficheiro demasiado pequeno.");
    if (file.size > 10 * 1024 * 1024) throw new Error("Ficheiro > 10MB. Reduz primeiro.");

    // Detectar extensão a partir do MIME (default jpg)
    const ext = file.type === "image/png" ? "png"
              : file.type === "image/webp" ? "webp"
              : "jpg";
    const filename = `albums/${album.slug}/cover.${ext}`;
    const sign = await adminFetch("/api/admin/signed-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    if (!sign.ok) {
      const e = await sign.json().catch(() => ({}));
      throw new Error(`Signed URL falhou (${sign.status}): ${e.erro || ""}`);
    }
    const { signedUrl } = await sign.json();
    const up = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "image/jpeg" },
      body: file,
    });
    if (!up.ok) {
      const t = await up.text().catch(() => "");
      throw new Error(`Upload falhou (${up.status}): ${t.slice(0, 100)}`);
    }
  }

  // Download album as DistroKid-ready ZIP (WAVs + cover 3000x3000 + metadata)
  async function downloadDistrokidZip(album: Album, btn: HTMLButtonElement) {
    const original = btn.textContent || "DistroKid ZIP";
    btn.disabled = true;
    try {
      const { downloadAlbumForDistribution } = await import("@/lib/album-download");
      const coverInput = window.prompt(`Capa do álbum — qual faixa? (1-${album.tracks.length})`, "1");
      const coverTrackNum = coverInput ? parseInt(coverInput, 10) : 1;
      await downloadAlbumForDistribution(
        album,
        (p) => { btn.textContent = `${p.phase} (${p.current}/${p.total})`; },
        undefined, // no custom title map for NOVA — usa o título original
        coverTrackNum,
      );
      btn.textContent = "ZIP pronto!";
    } catch (e) {
      btn.textContent = "Erro";
      alert(String(e));
    }
    setTimeout(() => { btn.disabled = false; btn.textContent = original; }, 3000);
  }

  // Download a clip
  async function downloadClip(url: string, title: string) {
    try {
      let blob: Blob;
      if (url.startsWith("blob:")) {
        blob = await (await fetch(url)).blob();
      } else {
        const r = await adminFetch("/api/admin/proxy-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        blob = await r.blob();
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.mp3`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("Download failed:", err);
    }
  }

  // Search filter
  const filteredAlbums = useMemo(() => {
    if (!search.trim()) return NOVA_ALBUMS;
    const q = search.toLowerCase();
    return NOVA_ALBUMS
      .map((a) => ({
        ...a,
        tracks: a.tracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            a.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        ),
      }))
      .filter((a) => a.tracks.length > 0);
  }, [search]);

  // Stats
  const uploadedCount = Object.values(states).filter((s) => s.status === "uploaded").length;
  const generatedCount = Object.values(states).filter((s) => s.status === "done").length;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-violet-300 mb-1">NOVA</h1>
        <p className="text-xs text-mundo-muted">
          10 álbuns × 10 faixas — pop ético/profético, voz solo, EN com sussurros PT
        </p>
        <p className="text-[10px] text-mundo-muted-dark mt-1">
          {uploadedCount} / {totalTracks} no Supabase · {generatedCount} gerados pendentes de aprovar
        </p>
      </div>

      {/* Nav */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/admin/producao"
          className="shrink-0 rounded-lg bg-mundo-muted-dark/20 px-4 py-2 text-xs text-mundo-muted hover:bg-mundo-muted-dark/40 transition"
        >
          ← Produção Loranne
        </Link>
        <Link
          href="/admin/ancient-ground"
          className="shrink-0 rounded-lg bg-amber-900/20 px-4 py-2 text-xs text-amber-400 hover:bg-amber-900/40 transition"
        >
          Ancient Ground
        </Link>
        <Link
          href="/admin/albums"
          className="shrink-0 rounded-lg bg-indigo-900/20 px-4 py-2 text-xs text-indigo-300 hover:bg-indigo-900/40 transition"
        >
          Gestor de Álbuns
        </Link>

        <select
          value={sunoModel}
          onChange={(e) => setSunoModel(e.target.value)}
          className="rounded-lg bg-violet-900/20 px-3 py-2 text-xs text-violet-300 border border-violet-800/30"
        >
          <option value="V5_5">Suno V5.5</option>
          <option value="V5">Suno V5</option>
          <option value="V4_5">Suno V4.5</option>
          <option value="V4">Suno V4</option>
        </select>

        <input
          type="text"
          value={personaId}
          onChange={(e) => setPersonaId(e.target.value)}
          placeholder="Persona ID (opcional)"
          className="rounded-lg bg-black/30 border border-mundo-muted-dark/20 px-3 py-2 text-xs text-mundo-creme placeholder:text-mundo-muted-dark outline-none focus:border-violet-700/50 min-w-[180px]"
        />
      </div>

      {/* Como usar */}
      <div className="mb-6 rounded-xl border border-violet-900/30 bg-violet-950/20 p-4">
        <p className="text-[11px] text-violet-300 leading-relaxed">
          Cada faixa envia ao Suno o STYLE verbatim (campo Style of Music), as LYRICS verbatim, e o TITLE — em modo Custom + com letra. Se quiseres usar a Persona criada a partir de &ldquo;Antenna&rdquo; em todas as faixas, cola o Persona ID acima.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar faixa ou álbum..."
          className="w-full rounded-lg bg-black/30 border border-mundo-muted-dark/20 px-4 py-2.5 text-sm text-mundo-creme placeholder:text-mundo-muted-dark outline-none focus:border-violet-700/50"
        />
      </div>

      {/* Albums */}
      <div className="space-y-3">
        {filteredAlbums.map((album) => {
          const isOpen = openAlbum === album.slug;
          const albumUploaded = album.tracks.filter((t) => states[trackKey(album.slug, t.number)]?.status === "uploaded").length;
          return (
            <div key={album.slug} className="rounded-xl border border-mundo-muted-dark/20 bg-mundo-bg-light/40 overflow-hidden">
              <button
                onClick={() => setOpenAlbum(isOpen ? null : album.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-mundo-muted-dark/10 transition"
              >
                <span
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: `${album.color}33`, color: album.color }}
                >
                  {album.title.slice(0, 3)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-medium text-mundo-creme truncate">{album.title}</h2>
                  <p className="text-[10px] text-mundo-muted truncate">{album.subtitle}</p>
                </div>
                <span className="shrink-0 text-[10px] text-mundo-muted-dark">
                  {albumUploaded}/{album.tracks.length} guardadas
                </span>
                <span className="shrink-0 text-mundo-muted-dark">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <>
                  {/* Album-level actions */}
                  <AlbumActionsBar
                    album={album}
                    onDistroZip={downloadDistrokidZip}
                    onUploadAlbumCover={uploadAlbumCover}
                  />

                  <div className="border-t border-mundo-muted-dark/20 p-4 grid gap-3 sm:grid-cols-2">
                    {album.tracks.map((track) => {
                      const key = trackKey(album.slug, track.number);
                      return (
                        <TrackCard
                          key={key}
                          album={album}
                          track={track}
                          state={getState(key)}
                          sunoModel={sunoModel}
                          personaId={personaId}
                          editedStyle={getEdit(key, "style")}
                          editedTitle={getEdit(key, "title")}
                          editedLyrics={getEdit(key, "lyrics")}
                          onEditStyle={(v) => setField(key, "style", v)}
                          onEditTitle={(v) => setField(key, "title", v)}
                          onEditLyrics={(v) => setField(key, "lyrics", v)}
                          onGenerate={() => generateTrack(album, track)}
                          onApprove={(clips) => approveTrack(album, track, clips)}
                          onDownload={downloadClip}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {filteredAlbums.length === 0 && (
        <p className="text-center text-mundo-muted text-sm py-12">Nenhuma faixa encontrada.</p>
      )}
    </div>
  );
}
