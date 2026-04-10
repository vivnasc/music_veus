"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ALL_ALBUMS,
  type Album,
  type AlbumTrack,
} from "@/data/albums";
import { adminFetch } from "@/lib/admin-fetch";
import { pickLorannImages } from "@/lib/loranne-images";

const STORAGE_KEY = "veus:short-builder";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type ShortImage = { url: string; isLoranne?: boolean };

type ShortState = {
  albumSlug: string;
  trackNumber: number;
  images: ShortImage[];
  clipDuration: number;
  fullSong: boolean;
  audioTrim: number;
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
      if (saved) return JSON.parse(saved);
    } catch {}
    return defaultState();
  });

  // Transient state
  const [regeneratingIdx, setRegeneratingIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());

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

  const totalSecs = state.fullSong && track ? track.durationSeconds : 30;
  const numClips = Math.ceil(totalSecs / state.clipDuration);
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
        body: JSON.stringify({ caption: track.description, numImages: Math.min(numAiImages, 4) }),
      });
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.imageUrls?.length) throw new Error(`fal.ai: ${aiData.erro || "sem imagens"}`);

      const loranneImgs = pickLorannImages(state.albumSlug, track.number, Math.max(numClips - numAiImages, 2));
      const built: ShortImage[] = [];
      let aiIdx = 0, lIdx = 0;
      for (let i = 0; i < numClips; i++) {
        if (i % 3 === 0 && lIdx < loranneImgs.length) {
          built.push({ url: loranneImgs[lIdx++], isLoranne: true });
        } else {
          built.push({ url: aiData.imageUrls[aiIdx % aiData.imageUrls.length] });
          aiIdx++;
        }
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
        body: JSON.stringify({ caption: track.description, numImages: 1 }),
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
      const imageInputs: { imageUrl?: string; imageBase64?: string }[] = [];
      for (const img of state.images) {
        if (img.isLoranne) {
          try {
            const res = await fetch(img.url);
            if (res.ok) {
              const blob = await res.blob();
              const b64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
              imageInputs.push({ imageBase64: b64 });
            } else {
              imageInputs.push({ imageUrl: `${window.location.origin}${img.url}` });
            }
          } catch { imageInputs.push({ imageUrl: `${window.location.origin}${img.url}` }); }
        } else {
          imageInputs.push({ imageUrl: img.url });
        }
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
            duration: state.clipDuration,
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
          audioTrim: state.fullSong ? 0 : state.audioTrim,
          clipDuration: state.clipDuration,
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

  // ─────── Render ───────

  return (
    <div className="min-h-screen bg-mundo-bg">
      {/* Header */}
      <div className="border-b border-mundo-muted-dark/30 bg-mundo-bg-light/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/producao" className="text-sm text-mundo-muted hover:text-mundo-creme">← Producao</Link>
            <Link href="/admin/calendario" className="text-sm text-mundo-muted hover:text-mundo-creme">Calendario</Link>
          </div>
          <h1 className="font-display text-2xl text-mundo-creme">Shorts</h1>
          <p className="mt-1 text-sm text-mundo-muted">Pipeline de producao de video clips musicais</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        {/* ═══ Track Selector ═══ */}
        <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-5 mb-6">
          <h2 className="text-sm font-semibold text-mundo-muted uppercase tracking-wider mb-3">1. Escolher faixa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-mundo-muted uppercase tracking-wider">Album</label>
              <select
                value={state.albumSlug}
                onChange={e => update({ albumSlug: e.target.value, trackNumber: 1, images: [], resultUrl: null, step: "idle" })}
                className="mt-1 w-full rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-3 py-2 text-sm text-mundo-creme focus:border-violet-500 focus:outline-none"
              >
                <option value="">Seleccionar album...</option>
                {publishedAlbums.map(a => (
                  <option key={a.slug} value={a.slug}>{a.title} ({a.tracks.length} faixas)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-mundo-muted uppercase tracking-wider">Faixa</label>
              <select
                value={state.trackNumber}
                onChange={e => update({ trackNumber: parseInt(e.target.value), images: [], resultUrl: null, step: "idle" })}
                className="mt-1 w-full rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-3 py-2 text-sm text-mundo-creme focus:border-violet-500 focus:outline-none"
                disabled={!album}
              >
                {album?.tracks
                  .filter(t => publishedKeys.has(`${album.slug}-t${t.number}`))
                  .map(t => (
                    <option key={t.number} value={t.number}>
                      {String(t.number).padStart(2, "0")}. {t.title} ({fmtTime(t.durationSeconds)})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {track && (
            <div className="mt-3 p-3 rounded-lg bg-mundo-bg/50">
              <p className="text-sm text-mundo-creme font-medium">{track.title}</p>
              <p className="text-xs text-mundo-muted mt-1">{track.description}</p>
              {track.lyrics && (
                <p className="text-[10px] text-mundo-muted-dark mt-2 italic line-clamp-2">{track.lyrics.split("\n").filter(l => l.trim() && !l.trim().startsWith("[")).slice(0, 2).join(" / ")}</p>
              )}
            </div>
          )}
        </div>

        {/* ═══ Settings ═══ */}
        {track && (
          <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-5 mb-6">
            <h2 className="text-sm font-semibold text-mundo-muted uppercase tracking-wider mb-3">2. Configurar</h2>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-mundo-muted">Duracao por clip:</label>
                {[5, 10].map(d => (
                  <button key={d} onClick={() => update({ clipDuration: d, images: [], step: "idle" })} className={`rounded-lg px-3 py-1.5 text-xs transition ${state.clipDuration === d ? "bg-violet-900/40 text-violet-400 ring-1 ring-violet-500/30" : "text-mundo-muted hover:text-mundo-creme bg-mundo-bg"}`}>
                    {d}s
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={state.fullSong} onChange={e => update({ fullSong: e.target.checked, images: [], step: "idle" })} className="accent-violet-500 w-4 h-4" />
                <span className="text-xs text-mundo-muted">Musica inteira ({fmtTime(track.durationSeconds)})</span>
              </label>

              <span className="text-xs text-mundo-muted-dark bg-mundo-bg px-3 py-1.5 rounded-lg">
                {numClips} clips x {state.clipDuration}s = {fmtTime(numClips * state.clipDuration)}
              </span>
            </div>

            {!state.fullSong && (
              <div className="flex items-center gap-3">
                <label className="text-xs text-mundo-muted whitespace-nowrap">Audio inicio:</label>
                <input
                  type="text"
                  value={fmtTime(state.audioTrim)}
                  onChange={e => {
                    const m = e.target.value.match(/^(\d+):(\d{0,2})$/);
                    if (m) update({ audioTrim: Math.max(0, Math.min(parseInt(m[1]) * 60 + parseInt(m[2] || "0"), track.durationSeconds - 30)) });
                  }}
                  className="w-16 rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-2 py-1.5 text-xs text-mundo-creme text-center font-mono focus:border-violet-500 focus:outline-none"
                />
                <input
                  type="range" min={0} max={Math.max(0, track.durationSeconds - 30)} value={state.audioTrim}
                  onChange={e => update({ audioTrim: Number(e.target.value) })}
                  className="flex-1 h-1.5 appearance-none rounded-full bg-mundo-muted-dark/30 cursor-pointer accent-violet-500"
                />
                <span className="text-xs text-mundo-muted font-mono shrink-0">
                  {fmtTime(state.audioTrim)} — {fmtTime(state.audioTrim + 30)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ═══ Image Generation ═══ */}
        {track && (
          <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-5 mb-6">
            <h2 className="text-sm font-semibold text-mundo-muted uppercase tracking-wider mb-3">3. Imagens</h2>

            {error && <p className="text-xs text-red-400 mb-3 p-2 rounded-lg bg-red-900/10">{error}</p>}

            {state.images.length === 0 && state.step === "idle" && (
              <button
                onClick={generateImages}
                className="rounded-lg px-5 py-2.5 text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition"
              >
                Gerar {numClips} imagens
              </button>
            )}

            {state.step === "images" && state.images.length === 0 && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-mundo-muted">A gerar imagens com fal.ai...</p>
              </div>
            )}

            {state.images.length > 0 && (
              <div>
                <p className="text-xs text-mundo-muted mb-3">Clica numa imagem IA para regenerar. Imagens com <span className="text-amber-400">L</span> sao poses Loranne.</p>
                <div className={`grid gap-2 mb-4 ${state.images.length <= 6 ? "grid-cols-6" : state.images.length <= 9 ? "grid-cols-6 sm:grid-cols-9" : "grid-cols-6 sm:grid-cols-8"}`}>
                  {state.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.isLoranne ? img.url : `/api/admin/proxy-image?url=${encodeURIComponent(img.url)}`}
                        alt={`Slot ${idx + 1}`}
                        className={`w-full aspect-[9/16] object-cover rounded-lg border border-mundo-muted-dark/20 ${regeneratingIdx === idx ? "opacity-30 animate-pulse" : ""}`}
                      />
                      <div className={`absolute top-1 left-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${img.isLoranne ? "bg-amber-500/80 text-black" : "bg-black/60 text-white"}`}>
                        {idx + 1}{img.isLoranne ? " L" : ""}
                      </div>
                      {!img.isLoranne && state.step === "images" && (
                        <button
                          onClick={() => regenerateSlot(idx)}
                          disabled={regeneratingIdx !== null}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          title="Regenerar esta imagem"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-6 w-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {state.step === "images" && (
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={sendToRunway} className="rounded-lg px-5 py-2.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition">
                      Aprovar e gerar clips ({state.images.length} clips)
                    </button>
                    <button onClick={generateImages} className="rounded-lg px-4 py-2.5 text-sm text-mundo-muted hover:text-mundo-creme bg-mundo-bg hover:bg-mundo-muted-dark/20 transition">
                      Regenerar todas
                    </button>
                    <button onClick={() => update({ images: [], step: "idle" })} className="rounded-lg px-4 py-2.5 text-sm text-red-400/60 hover:text-red-400 transition">
                      Limpar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Runway progress */}
            {state.step === "runway" && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-amber-400">{progress}</p>
              </div>
            )}

            {/* Shotstack progress */}
            {state.step === "shotstack" && (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-violet-400">{progress}</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ Result ═══ */}
        {state.resultUrl && (
          <div className="rounded-xl border border-green-500/30 bg-green-900/10 p-5">
            <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Short pronto</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <video src={state.resultUrl} controls playsInline muted loop className="rounded-lg max-h-[300px]" />
              <div className="flex flex-col gap-2">
                <a
                  href={state.resultUrl}
                  download={`Short-${track?.title || "video"}.mp4`}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition text-center"
                >
                  Descarregar
                </a>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      const title = `${track?.title || ""} — Loranne`;
                      navigator.share({ title, text: `${title}\nmusic.seteveus.space`, url: state.resultUrl! }).catch(() => {});
                    }
                  }}
                  className="rounded-lg px-4 py-2.5 text-sm text-mundo-creme bg-mundo-bg hover:bg-mundo-muted-dark/20 transition text-center"
                >
                  Partilhar
                </button>
                <button
                  onClick={() => update({ images: [], resultUrl: null, step: "idle" })}
                  className="rounded-lg px-4 py-2.5 text-sm text-mundo-muted hover:text-mundo-creme transition text-center"
                >
                  Novo Short
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function defaultState(): ShortState {
  return {
    albumSlug: "",
    trackNumber: 1,
    images: [],
    clipDuration: 5,
    fullSong: false,
    audioTrim: 30,
    step: "idle",
    resultUrl: null,
  };
}
