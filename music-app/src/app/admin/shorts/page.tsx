"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ALL_ALBUMS,
  type Album,
  type AlbumTrack,
} from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";


const STORAGE_KEY = "veus:short-builder";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ShortImage = { url: string; isLoranne?: boolean };

type ShortState = {
  albumSlug: string;
  trackNumber: number;
  images: ShortImage[];
  totalDuration: number;      // total video duration in seconds (15, 30, 60, or custom)
  audioStart: number;         // audio start point in seconds
  fullSong: boolean;
  step: "idle" | "images" | "runway" | "shotstack";
  resultUrl: string | null;
};

const RUNWAY_PROMPTS = [
  "figure swaying gently to music, veils flowing rhythmically, golden particles pulsing, slow camera orbit",
  "slow cinematic push-in, gentle atmospheric haze, warm light rays shifting, dreamy and contemplative",
  "gentle camera drift, soft light particles floating, fabric rippling like sound waves, golden glow",
  "slow camera orbit around figure, veils dancing in wind, warm light breathing, ethereal atmosphere",
  "slow dolly out, atmospheric dust particles, volumetric light beams, ethereal and meditative",
  "figure with arms rising slowly, fabric rippling, golden glow intensifying, peaceful contemplation",
];

function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function ShortsPage() {
  // Persisted state
  const [state, setState] = useState<ShortState>(() => {
    if (typeof window === "undefined") return defaultState();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate from old format (audioTrim) to new (audioStart/audioEnd)
        return {
          ...defaultState(),
          ...parsed,
          totalDuration: parsed.totalDuration || 30,
          audioStart: typeof parsed.audioStart === "number" ? parsed.audioStart : (parsed.audioTrim || 30),
        };
      }
    } catch {}
    return defaultState();
  });

  // Transient state
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [useLoRA, setUseLoRA] = useState(true);
  const previewRef = useRef<HTMLAudioElement | null>(null);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  // Load published tracks
  useEffect(() => {
    fetch("/api/published-tracks")
      .then(r => r.json())
      .then(d => { if (d.tracks) setPublishedKeys(new Set(d.tracks)); })
      .catch(() => {});
  }, []);

  const album = ALL_ALBUMS.find(a => a.slug === state.albumSlug);
  const track = album?.tracks.find(t => t.number === state.trackNumber);

  // Published albums/tracks
  const publishedAlbums = ALL_ALBUMS.filter(a =>
    a.tracks.some(t => publishedKeys.has(`${a.slug}-t${t.number}`))
  );

  const trackDur = track?.durationSeconds || 240;
  const totalDuration = state.fullSong ? trackDur : (state.totalDuration || 30);
  const audioStart = Math.min(Number.isFinite(state.audioStart) ? state.audioStart : 30, trackDur - totalDuration);
  const audioEnd = Math.min(audioStart + totalDuration, trackDur);
  // Runway generates 5s or 10s clips — use 5s for shorts ≤30s, 10s for longer
  const clipDuration = totalDuration <= 30 ? 5 : 10;
  const numClips = Math.max(1, Math.ceil(totalDuration / clipDuration));
  const numAiImages = Math.min(Math.ceil(numClips * 0.67), 4);

  function update(partial: Partial<ShortState>) {
    setState(s => ({ ...s, ...partial }));
  }

  // ─────── Step 1: Generate images ───────

  async function generateImages() {
    if (!track || !album) return;
    setError(null);
    update({ step: "images", images: [] });
    try {
      const aiRes = await adminFetch("/api/admin/generate-verse-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: track.description, numImages: Math.min(numAiImages, 4), useLoRA }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.imageUrls?.length) throw new Error(`fal.ai: ${aiData.erro || "sem imagens"}`);
      const allUrls = [...aiData.imageUrls];

      // If we need more images than one batch (fal.ai max 4), generate more
      while (allUrls.length < numClips) {
        const moreRes = await adminFetch("/api/admin/generate-verse-reel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption: track.description, numImages: Math.min(numClips - allUrls.length, 4), useLoRA }),
        });
        const moreData = await moreRes.json();
        if (moreRes.ok && moreData.imageUrls?.length) {
          allUrls.push(...moreData.imageUrls);
        } else break;
      }

      const built: ShortImage[] = [];
      for (let i = 0; i < numClips; i++) {
        built.push({ url: allUrls[i % allUrls.length] });
      }
      update({ images: built });
    } catch (err) {
      setError((err as Error).message);
      update({ step: "idle" });
    }
  }

  async function regenerateSlot(idx: number) {
    if (!track) return;
    setRegeneratingIdx(idx);
    try {
      const aiRes = await adminFetch("/api/admin/generate-verse-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: track.description, numImages: 1, useLoRA }),
      });
      const aiData = await aiRes.json();
      if (aiRes.ok && aiData.imageUrls?.[0]) {
        update({ images: state.images.map((img, i) => i === idx ? { url: aiData.imageUrls[0] } : img) });
      }
    } catch {}
    setRegeneratingIdx(null);
  }

  // ─────── Step 2: Runway ───────

  async function sendToRunway() {
    if (!track || !album) return;
    setError(null);
    update({ step: "runway" });
    setProgress("A enviar para Runway...");
    try {
      const imageInputs: { imageUrl: string }[] = [];
      for (const img of state.images) {
        imageInputs.push({ imageUrl: img.url });
      }

      const runwayResults = await Promise.all(imageInputs.map(async (imgPayload, idx) => {
        const clipTrackNum = track.number * 100 + idx + 1;
        const res = await adminFetch("/api/admin/runway/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            albumSlug: state.albumSlug,
            trackNumber: clipTrackNum,
            ...imgPayload,
            promptText: RUNWAY_PROMPTS[idx % RUNWAY_PROMPTS.length],
            duration: clipDuration,
            ratio: "1080:1920",
          }),
        });
        return { ...(await res.json()), clipTrackNum };
      }));

      const clipUrls: string[] = [];
      for (let idx = 0; idx < runwayResults.length; idx++) {
        const rd = runwayResults[idx];
        if (rd.status === "exists" && rd.videoUrl) { clipUrls.push(rd.videoUrl); continue; }
        if (!rd.taskId) continue;
        const params = new URLSearchParams({ taskId: rd.taskId, album: state.albumSlug, track: String(rd.clipTrackNum) });
        let found = false;
        for (let i = 0; i < 120; i++) {
          await new Promise(r => setTimeout(r, 3000));
          const sRes = await adminFetch(`/api/admin/runway/status?${params}`);
          const sData = await sRes.json();
          if (sData.status === "complete" && sData.videoUrl) { clipUrls.push(sData.videoUrl); found = true; break; }
          if (sData.status === "error") break;
          setProgress(`Clip ${idx + 1}/${state.images.length} — ${Math.min(Math.round(i * 1.2), 95)}%`);
        }
        if (!found) console.warn(`Clip ${idx + 1} nao disponivel`);
      }
      if (clipUrls.length < Math.min(4, state.images.length)) throw new Error(`Apenas ${clipUrls.length} clip(s).`);

      // Step 3: Shotstack
      update({ step: "shotstack" });
      setProgress("A montar Short...");

      const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
      const audioUrl = `${sbUrl}/storage/v1/object/public/audios/albums/${state.albumSlug.replace(/[^a-z0-9-]/g, "")}/faixa-${String(track.number).padStart(2, "0")}.mp3`;

      const verse = (() => {
        if (!track.lyrics) return "";
        const lines = track.lyrics.split("\n").filter((l: string) => { const tr = l.trim(); return tr.length > 15 && tr.length < 80 && !tr.startsWith("["); });
        return lines.slice(0, 3).map((l: string) => l.trim()).join("\n") || "";
      })();

      const shotRes = await adminFetch("/api/admin/shotstack/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clipUrls,
          audioUrl,
          audioTrim: state.fullSong ? 0 : audioStart,
          clipDuration,
          verse,
          trackTitle: track.title,
          albumTitle: album.title,
        }),
      });
      const shotData = await shotRes.json();
      if (!shotRes.ok || !shotData.id) throw new Error(`Shotstack: ${shotData.erro || "falhou"}`);

      for (let i = 0; i < 120; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const sRes = await adminFetch(`/api/admin/shotstack/status?id=${shotData.id}`);
        const sData = await sRes.json();
        if (sData.status === "done" && sData.videoUrl) { update({ resultUrl: sData.videoUrl, step: "idle" }); return; }
        if (sData.status === "failed") throw new Error("Render falhou");
        setProgress(`Render ${Math.min(Math.round(i * 1.2), 95)}%`);
      }
    } catch (err) {
      setError((err as Error).message);
      update({ step: "images" });
    }
  }

  const albumColor = album?.color || "#C9A96E";
  const coverUrl = album ? `/api/music/stream?album=${album.slug}&track=${state.trackNumber}&type=cover` : "";
  const audioSrc = album ? `/api/music/stream?album=${album.slug}&track=${state.trackNumber}` : "";
  const isWorking = state.step === "runway" || state.step === "shotstack";

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      {/* ── Hero header with album art ── */}
      <div className="relative overflow-hidden">
        {album && (
          <>
            <div className="absolute inset-0">
              <img src={coverUrl} alt="" className="w-full h-full object-cover blur-[60px] scale-125 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A]/60 to-[#0D0D1A]" />
            </div>
          </>
        )}
        <div className="relative max-w-3xl mx-auto px-5 pt-5 pb-6">
          <div className="flex items-center gap-4 text-xs text-[#666680] mb-5">
            <Link href="/admin/producao" className="hover:text-[#a0a0b0] transition">← Producao</Link>
            <Link href="/admin/calendario" className="hover:text-[#a0a0b0] transition">Calendario</Link>
            <Link href="/admin/lora" className="hover:text-[#a0a0b0] transition">LoRA</Link>
          </div>

          <div className="flex items-start gap-5">
            {/* Cover art */}
            {album && (
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-xl ring-1 ring-white/10">
                <img src={coverUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.15em] text-[#C9A96E]">Shorts</p>
              <h1 className="font-display text-xl sm:text-2xl text-[#F5F0E6] mt-0.5 truncate">
                {track ? track.title : "Selecciona uma faixa"}
              </h1>
              {album && <p className="text-xs text-[#666680] mt-1">{album.title} — Loranne</p>}
              {track && <p className="text-xs text-[#a0a0b0] mt-1 line-clamp-1">{track.description}</p>}
            </div>
          </div>

          {/* Track selectors — inline, compact */}
          <div className="flex gap-2 mt-4">
            <select
              value={state.albumSlug}
              onChange={e => update({ albumSlug: e.target.value, trackNumber: 1, images: [], resultUrl: null, step: "idle" })}
              className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#F5F0E6] focus:border-[#C9A96E]/50 focus:outline-none backdrop-blur"
            >
              <option value="" className="bg-[#0D0D1A]">Album...</option>
              {publishedAlbums.map(a => (
                <option key={a.slug} value={a.slug} className="bg-[#0D0D1A]">{a.title}</option>
              ))}
            </select>
            <select
              value={state.trackNumber}
              onChange={e => update({ trackNumber: parseInt(e.target.value), images: [], resultUrl: null, step: "idle" })}
              className="flex-1 min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#F5F0E6] focus:border-[#C9A96E]/50 focus:outline-none backdrop-blur"
              disabled={!album}
            >
              {album?.tracks
                .filter(t => publishedKeys.has(`${album.slug}-t${t.number}`))
                .map(t => (
                  <option key={t.number} value={t.number} className="bg-[#0D0D1A]">
                    {String(t.number).padStart(2, "0")}. {t.title} ({fmtTime(t.durationSeconds)})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      {track && (
        <div className="max-w-3xl mx-auto px-5 pb-20 space-y-4">

          {/* Duration presets */}
          <div className="rounded-xl bg-[#1A1A2E]/80 px-4 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#666680] shrink-0">Duracao:</span>
              {[15, 30, 60].map(d => (
                <button key={d} onClick={() => update({ totalDuration: d, fullSong: false, audioStart: Math.min(state.audioStart, trackDur - d), images: [], step: "idle" })} className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition ${!state.fullSong && state.totalDuration === d ? "text-white shadow" : "text-[#666680] hover:text-[#a0a0b0]"}`} style={!state.fullSong && state.totalDuration === d ? { backgroundColor: `${albumColor}40` } : {}}>
                  {d}s
                </button>
              ))}
              <button onClick={() => update({ fullSong: true, images: [], step: "idle" })} className={`rounded-full px-3.5 py-1.5 text-[11px] font-medium transition ${state.fullSong ? "text-white shadow" : "text-[#666680] hover:text-[#a0a0b0]"}`} style={state.fullSong ? { backgroundColor: `${albumColor}40` } : {}}>
                Inteira ({fmtTime(trackDur)})
              </button>
              <span className="text-[11px] text-[#666680] font-mono ml-auto">{numClips} clips x {clipDuration}s</span>
              <div className="w-px h-4 bg-white/10" />
              <label className="flex items-center gap-1.5 cursor-pointer shrink-0" title="Usar LoRA treinada para gerar imagens">
                <input type="checkbox" checked={useLoRA} onChange={e => setUseLoRA(e.target.checked)} className="accent-fuchsia-500 w-3.5 h-3.5" />
                <span className={`text-[11px] ${useLoRA ? "text-fuchsia-400" : "text-[#666680]"}`}>LoRA</span>
              </label>
            </div>

            {/* Audio position slider */}
            {!state.fullSong && (
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#666680] font-mono shrink-0">{fmtTime(audioStart)}</span>
                <div className="flex-1 relative h-8 flex items-center">
                  {/* Track bar */}
                  <div className="absolute inset-x-0 h-2 rounded-full bg-white/8" />
                  {/* Selected range highlight */}
                  <div className="absolute h-2 rounded-full" style={{ left: `${(audioStart / trackDur) * 100}%`, width: `${(totalDuration / trackDur) * 100}%`, background: `${albumColor}50` }} />
                  {/* Single slider — moves the start point, range stays fixed width */}
                  <input
                    type="range" min={0} max={Math.max(0, trackDur - totalDuration)} value={audioStart}
                    onChange={e => update({ audioStart: Number(e.target.value) })}
                    className="absolute inset-x-0 h-8 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-white/20"
                  />
                </div>
                <span className="text-[11px] text-[#666680] font-mono shrink-0">{fmtTime(audioEnd)}</span>
                {/* Preview play */}
                <button
                  onClick={() => {
                    if (previewPlaying) { previewRef.current?.pause(); setPreviewPlaying(false); return; }
                    if (!previewRef.current) {
                      previewRef.current = new Audio(audioSrc);
                      previewRef.current.addEventListener("ended", () => setPreviewPlaying(false));
                      previewRef.current.addEventListener("timeupdate", () => {
                        if (previewRef.current && previewRef.current.currentTime >= audioEnd) { previewRef.current.pause(); setPreviewPlaying(false); }
                      });
                    }
                    previewRef.current.currentTime = audioStart;
                    previewRef.current.play();
                    setPreviewPlaying(true);
                  }}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition ${previewPlaying ? "bg-white/20" : "bg-white/10 hover:bg-white/20"}`}
                >
                  {previewPlaying ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-white"><rect x="5" y="4" width="3" height="12" rx="1"/><rect x="12" y="4" width="3" height="12" rx="1"/></svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-white ml-0.5"><polygon points="6,3 17,10 6,17"/></svg>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && <div className="rounded-xl bg-red-900/20 border border-red-500/20 px-4 py-3 text-xs text-red-400">{error}</div>}

          {/* ── Images grid ── */}
          {state.images.length === 0 && state.step === "idle" && !state.resultUrl && (
            <button
              onClick={generateImages}
              className="w-full rounded-xl py-4 text-sm font-medium text-white transition hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: `linear-gradient(135deg, ${albumColor}80, ${albumColor}30)` }}
            >
              Gerar {numClips} imagens
            </button>
          )}

          {state.step === "images" && state.images.length === 0 && (
            <div className="flex items-center justify-center gap-3 py-8 rounded-xl bg-[#1A1A2E]/50">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${albumColor}60`, borderTopColor: "transparent" }} />
              <p className="text-sm text-[#a0a0b0]">A gerar imagens...</p>
            </div>
          )}

          {state.images.length > 0 && (
            <div className="rounded-xl bg-[#1A1A2E]/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-[#666680]">Clica para regenerar. <span className="text-[#C9A96E]">L</span> = Loranne</p>
                {state.step === "images" && (
                  <div className="flex items-center gap-2">
                    <button onClick={generateImages} className="text-[11px] text-[#666680] hover:text-[#a0a0b0] transition">Todas de novo</button>
                    <button onClick={() => update({ images: [], step: "idle" })} className="text-[11px] text-red-400/50 hover:text-red-400 transition">Limpar</button>
                  </div>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {state.images.map((img, idx) => (
                  <div key={idx} className="relative group shrink-0" style={{ width: `${Math.max(100 / Math.min(state.images.length, 8), 10)}%`, minWidth: "60px" }}>
                    <img
                      src={img.isLoranne ? img.url : `/api/admin/proxy-image?url=${encodeURIComponent(img.url)}`}
                      alt=""
                      className={`w-full aspect-[9/16] object-cover rounded-lg ring-1 ring-white/10 ${regeneratingIdx === idx ? "opacity-30 animate-pulse" : ""}`}
                    />
                    <div className={`absolute top-1 left-1 text-[8px] px-1 py-0.5 rounded font-bold ${img.isLoranne ? "bg-[#C9A96E]/90 text-[#0D0D1A]" : "bg-black/70 text-white/80"}`}>
                      {idx + 1}{img.isLoranne ? " L" : ""}
                    </div>
                    {!img.isLoranne && state.step === "images" && (
                      <button onClick={() => regenerateSlot(idx)} disabled={regeneratingIdx !== null} className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-lg">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {state.step === "images" && (
                <button onClick={sendToRunway} className="mt-3 w-full rounded-lg py-3 text-sm font-medium text-white transition hover:brightness-110" style={{ background: `linear-gradient(135deg, #22c55e90, #16a34a90)` }}>
                  Aprovar → gerar {state.images.length} clips
                </button>
              )}
            </div>
          )}

          {/* Progress */}
          {isWorking && (
            <div className="flex items-center gap-3 rounded-xl bg-[#1A1A2E]/80 px-4 py-4">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: state.step === "runway" ? "#f59e0b60" : `${albumColor}60`, borderTopColor: "transparent" }} />
              <p className="text-sm" style={{ color: state.step === "runway" ? "#f59e0b" : albumColor }}>{progress}</p>
            </div>
          )}

          {/* ── Result ── */}
          {state.resultUrl && (
            <div className="rounded-xl overflow-hidden ring-1 ring-[#C9A96E]/20">
              <div className="bg-gradient-to-r from-[#C9A96E]/10 to-transparent px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#C9A96E]">Short pronto</span>
                <button onClick={() => update({ images: [], resultUrl: null, step: "idle" })} className="text-[11px] text-[#666680] hover:text-[#a0a0b0]">Novo</button>
              </div>
              <div className="flex flex-col sm:flex-row">
                <video src={state.resultUrl} controls playsInline muted loop className="sm:max-w-[280px] bg-black" />
                <div className="flex sm:flex-col gap-2 p-3">
                  <a href={state.resultUrl} download={`Short-${track.title}.mp4`} className="flex-1 sm:flex-initial rounded-lg px-4 py-2.5 text-xs font-medium bg-[#C9A96E] text-[#0D0D1A] hover:bg-[#d4b87a] transition text-center">Descarregar</a>
                  <button onClick={() => { if (navigator.share) navigator.share({ title: `${track.title} — Loranne`, url: state.resultUrl! }).catch(() => {}); }} className="flex-1 sm:flex-initial rounded-lg px-4 py-2.5 text-xs text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition text-center">Partilhar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function defaultState(): ShortState {
  return {
    albumSlug: "",
    trackNumber: 1,
    images: [],
    totalDuration: 30,
    audioStart: 30,
    fullSong: false,
    step: "idle",
    resultUrl: null,
  };
}
