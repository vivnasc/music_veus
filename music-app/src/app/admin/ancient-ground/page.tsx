"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ANCIENT_GROUND_SINGLES, type AncientGroundSingle } from "@/data/ancient-ground-singles";
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

type SingleState = {
  status: "idle" | "generating" | "polling" | "done" | "error";
  error: string;
  clips: SunoClip[];
};

// ─── Helpers ───

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
      className={`shrink-0 rounded px-3 py-2 text-xs font-medium transition ${
        copied
          ? "bg-green-800/40 text-green-400"
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
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="4" width="3" height="12" rx="1"/><rect x="12" y="4" width="3" height="12" rx="1"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><polygon points="6,3 17,10 6,17"/></svg>
          )}
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
          <div className="h-full bg-amber-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[10px] text-mundo-muted tabular-nums shrink-0">
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

// ─── Single Card ───

function SingleCard({
  single,
  state,
  sunoModel,
  onGenerate,
  onDownloadClip,
  onApprove,
  onBuildLoop,
}: {
  single: AncientGroundSingle;
  state: SingleState;
  sunoModel: string;
  onGenerate: () => void;
  onDownloadClip: (url: string, title: string) => void;
  onApprove: (single: AncientGroundSingle, clips: SunoClip[]) => void;
  onBuildLoop: (single: AncientGroundSingle) => void;
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  const isWorking = state.status === "generating" || state.status === "polling";

  return (
    <div className="rounded-xl border border-mundo-muted-dark/20 bg-mundo-bg-light/50 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="shrink-0 w-8 h-8 rounded-full bg-amber-900/40 text-amber-400 flex items-center justify-center text-xs font-bold">
            {single.number}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-mundo-creme truncate">{single.title}</h3>
            <p className="text-[10px] text-mundo-muted truncate">{single.prompt.slice(0, 60)}...</p>
          </div>
        </div>
        {state.status === "done" && (
          <span className="shrink-0 text-[10px] text-green-400 bg-green-900/20 rounded-full px-2 py-0.5">gerado</span>
        )}
      </div>

      {/* Prompt toggle */}
      <button
        onClick={() => setShowPrompt(!showPrompt)}
        className="text-[11px] text-amber-500 hover:text-amber-400 mb-2"
      >
        {showPrompt ? "Esconder prompt" : "Ver prompt"}
      </button>

      {showPrompt && (
        <div className="mb-3 rounded-lg bg-black/30 p-3">
          <p className="text-xs text-mundo-creme/80 whitespace-pre-wrap font-mono">{single.prompt}</p>
          <div className="mt-2 flex gap-2">
            <CopyButton text={single.prompt} label="Copiar prompt" />
          </div>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <p className="text-[11px] text-red-400 mb-2">{state.error}</p>
      )}

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={isWorking}
        className={`w-full rounded-lg px-4 py-2.5 text-xs font-medium transition mb-3 ${
          isWorking
            ? "bg-amber-900/20 text-amber-600 animate-pulse cursor-wait"
            : "bg-amber-700/30 text-amber-300 hover:bg-amber-700/50"
        }`}
      >
        {state.status === "generating"
          ? "A enviar ao Suno..."
          : state.status === "polling"
          ? "A gerar... (polling)"
          : state.clips.length > 0
          ? "Regenerar no Suno"
          : `Gerar no Suno (${sunoModel})`}
      </button>

      {/* Generated clips — Suno generates 2 versions per prompt */}
      {state.clips.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] text-mundo-muted">
            {state.clips.length} versões geradas — usa ambas para um loop mais rico
          </p>
          {state.clips.map((clip, i) => (
            <div key={clip.id || i} className="rounded-lg bg-black/20 p-3">
              <div className="flex items-start gap-3 mb-2">
                {clip.imageUrl && (
                  <img src={clip.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                )}
                <p className="text-[11px] text-amber-300 font-medium">
                  Versão {String.fromCharCode(65 + i)} {clip.duration ? `(${formatTime(clip.duration)})` : ""}
                </p>
              </div>
              {clip.audioUrl && <MiniPlayer src={clip.audioUrl} />}
              <div className="flex gap-2 flex-wrap">
                {clip.audioUrl && (
                  <button
                    onClick={() => onDownloadClip(clip.originalAudioUrl || clip.audioUrl!, `${single.title} - v${String.fromCharCode(65 + i)}`)}
                    className="rounded px-3 py-1.5 text-[10px] bg-green-900/30 text-green-400 hover:bg-green-900/50 transition"
                  >
                    Download Versão {String.fromCharCode(65 + i)}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Approve — upload both clips to Supabase */}
          {state.clips.some(c => c.audioUrl) && (
            <button
              onClick={() => onApprove(single, state.clips)}
              className="w-full rounded-lg px-4 py-2.5 text-xs font-medium bg-green-800/30 text-green-300 hover:bg-green-800/50 transition"
            >
              Aprovar e guardar no Supabase ({state.clips.filter(c => c.audioUrl).length} versões)
            </button>
          )}

          {/* Build 1h loop — after approval */}
          <button
            onClick={() => onBuildLoop(single)}
            disabled={state.status === "generating"}
            className="w-full rounded-lg px-4 py-2.5 text-xs font-medium bg-blue-800/30 text-blue-300 hover:bg-blue-800/50 transition"
          >
            {state.status === "generating" ? "A montar loop..." : "Montar loop 1h e guardar"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───

export default function AncientGroundPage() {
  const [sunoModel, setSunoModel] = useState("V5_5");
  const [states, setStates] = useState<Record<number, SingleState>>({});
  const [search, setSearch] = useState("");
  const pollingRef = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  // Get state for a single (default idle)
  function getState(num: number): SingleState {
    return states[num] || { status: "idle", error: "", clips: [] };
  }

  // Poll Suno status
  const pollStatus = useCallback((singleNum: number, clipIds: string[]) => {
    setStates((s) => ({
      ...s,
      [singleNum]: { ...s[singleNum], status: "polling", error: "" },
    }));

    let pollCount = 0;
    const interval = setInterval(async () => {
      pollCount++;
      try {
        const res = await adminFetch(`/api/admin/suno/status?ids=${clipIds.join(",")}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data.erro) throw new Error(data.erro);

        // Update debug info
        const info = (data.clips || []).map((c: SunoClip) => c.status).join(", ");
        setStates((s) => ({
          ...s,
          [singleNum]: { ...s[singleNum], error: `Poll #${pollCount}: ${info}` },
        }));

        // Check errors
        if (data.clips.some((c: SunoClip) => c.status === "error")) {
          clearInterval(pollingRef.current[singleNum]);
          delete pollingRef.current[singleNum];
          // Show raw status for debugging
          const rawInfo = JSON.stringify(data.clips.map((c: Record<string, unknown>) => ({
            status: c.status, rawStatus: c.rawStatus, id: c.id,
          })));
          setStates((s) => ({
            ...s,
            [singleNum]: { status: "error", error: `Suno erro: ${rawInfo}`, clips: [] },
          }));
          return;
        }

        // Check completion
        const allDone = data.clips.every((c: SunoClip) => c.status === "complete" && c.audioUrl);
        if (allDone) {
          clearInterval(pollingRef.current[singleNum]);
          delete pollingRef.current[singleNum];

          // Cache clips in browser memory
          const cached: SunoClip[] = [];
          for (const c of data.clips as SunoClip[]) {
            if (!c.audioUrl) { cached.push(c); continue; }
            try {
              const audioRes = await fetch(c.audioUrl);
              if (audioRes.ok) {
                const blob = await audioRes.blob();
                if (blob.size > 1000) {
                  cached.push({ ...c, audioUrl: URL.createObjectURL(blob), originalAudioUrl: c.audioUrl });
                  continue;
                }
              }
            } catch { /* keep original */ }
            cached.push(c);
          }

          setStates((s) => ({
            ...s,
            [singleNum]: { status: "done", error: "", clips: cached },
          }));
        }
      } catch (err) {
        console.warn(`[poll #${pollCount}] single ${singleNum}:`, err);
      }
    }, 5000);

    pollingRef.current[singleNum] = interval;

    // Timeout after 5 min
    setTimeout(() => {
      if (pollingRef.current[singleNum]) {
        clearInterval(pollingRef.current[singleNum]);
        delete pollingRef.current[singleNum];
        setStates((s) => {
          const cur = s[singleNum];
          if (cur?.status === "polling") {
            return { ...s, [singleNum]: { ...cur, status: "error", error: "Timeout após 5 min." } };
          }
          return s;
        });
      }
    }, 10 * 60 * 1000);
  }, []);

  // Generate a single
  async function generateSingle(single: AncientGroundSingle) {
    setStates((s) => ({
      ...s,
      [single.number]: { status: "generating", error: "", clips: [] },
    }));

    try {
      const res = await adminFetch("/api/admin/suno/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: single.prompt,
          instrumental: true,
          title: single.title,
          model: sunoModel,
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
        setStates((s) => ({
          ...s,
          [single.number]: { status: "done", error: "", clips: data.clips },
        }));
      } else {
        pollStatus(single.number, data.clips.map((c: SunoClip) => c.id));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStates((s) => ({
        ...s,
        [single.number]: { status: "error", error: msg, clips: [] },
      }));
    }
  }

  // Approve single — upload clips + cover to Supabase
  async function approveSingle(single: AncientGroundSingle, clips: SunoClip[]) {
    const num = single.number;
    setStates((s) => ({
      ...s,
      [num]: { ...s[num], status: "generating" as const, error: "A guardar no Supabase..." },
    }));

    try {
      const safeTrack = String(num).padStart(2, "0");
      const clipsWithAudio = clips.filter((c) => c.audioUrl);

      for (let i = 0; i < clipsWithAudio.length; i++) {
        const clip = clipsWithAudio[i];
        const suffix = clipsWithAudio.length > 1 ? `-v${String.fromCharCode(65 + i)}` : "";

        // Download audio blob
        let blob: Blob;
        const audioSrc = clip.originalAudioUrl || clip.audioUrl!;
        if (audioSrc.startsWith("blob:")) {
          blob = await (await fetch(audioSrc)).blob();
        } else {
          const r = await adminFetch("/api/admin/proxy-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: audioSrc }),
          });
          blob = await r.blob();
        }

        if (blob.size < 1000) throw new Error(`Clip ${i + 1} demasiado pequeno (${blob.size} bytes)`);

        // Upload versioned file (vA, vB) for loop building
        const versionedFilename = `albums/ancient-ground/faixa-${safeTrack}${suffix}.mp3`;
        let signedRes = await adminFetch("/api/admin/signed-upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: versionedFilename }),
        });
        if (!signedRes.ok) throw new Error("Erro ao gerar URL de upload");
        const { signedUrl } = await signedRes.json();

        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          headers: { "Content-Type": "audio/mpeg" },
          body: blob,
        });
        if (!uploadRes.ok) throw new Error(`Upload falhou (${uploadRes.status})`);

        // First clip also becomes faixa-XX.mp3 (the version the app player uses)
        if (i === 0) {
          const playerFilename = `albums/ancient-ground/faixa-${safeTrack}.mp3`;
          signedRes = await adminFetch("/api/admin/signed-upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: playerFilename }),
          });
          if (signedRes.ok) {
            const { signedUrl: playerUrl } = await signedRes.json();
            await fetch(playerUrl, {
              method: "PUT",
              headers: { "Content-Type": "audio/mpeg" },
              body: blob,
            });
          }
        }

        // Register version B as alternative in track_versions (playable in app)
        if (i > 0) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
          const audioUrl = `${supabaseUrl}/storage/v1/object/public/audios/${versionedFilename}`;
          await adminFetch("/api/admin/track-versions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              album_slug: "ancient-ground",
              track_number: num,
              version_name: `Versão ${String.fromCharCode(65 + i)}`,
              energy: "whisper",
              audio_url: audioUrl,
            }),
          }).catch(() => {});
        }
      }

      // Upload cover for each clip that has an image
      for (let i = 0; i < clipsWithAudio.length; i++) {
        const clip = clipsWithAudio[i];
        if (!clip.imageUrl) continue;
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
          if (coverBlob.size < 1000) continue;

          // First clip cover → faixa-XX-cover.jpg (main cover for player)
          if (i === 0) {
            const mainCover = `albums/ancient-ground/faixa-${safeTrack}-cover.jpg`;
            const res = await adminFetch("/api/admin/signed-upload-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filename: mainCover }),
            });
            if (res.ok) {
              const { signedUrl } = await res.json();
              await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: coverBlob });
            }
          }

          // Each clip gets its own versioned cover
          const suffix = clipsWithAudio.length > 1 ? `-v${String.fromCharCode(65 + i)}` : "";
          const vCover = `albums/ancient-ground/faixa-${safeTrack}${suffix}-cover.jpg`;
          const res2 = await adminFetch("/api/admin/signed-upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: vCover }),
          });
          if (res2.ok) {
            const { signedUrl } = await res2.json();
            await fetch(signedUrl, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: coverBlob });
          }
        } catch (e) {
          console.warn(`Cover ${i} upload failed:`, e);
        }
      }

      setStates((s) => ({
        ...s,
        [num]: { ...s[num], status: "done", error: `Guardado! ${clipsWithAudio.length} versões no Supabase.` },
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStates((s) => ({
        ...s,
        [num]: { ...s[num], status: "error", error: msg },
      }));
    }
  }

  // Download a clip as MP3
  async function downloadClip(url: string, title: string) {
    try {
      let blob: Blob;
      if (url.startsWith("blob:")) {
        const r = await fetch(url);
        blob = await r.blob();
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

  // Build 1h loop from Supabase clips (pure JS byte concatenation)
  async function buildLoop(single: AncientGroundSingle) {
    const num = single.number;
    const safeTrack = String(num).padStart(2, "0");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
    const basePath = `${supabaseUrl}/storage/v1/object/public/audios/albums/ancient-ground`;

    setStates((s) => ({
      ...s,
      [num]: { ...(s[num] || { clips: [] }), status: "generating", error: "A montar loop 1h..." },
    }));

    try {
      // Fetch both versions from Supabase
      const buffers: ArrayBuffer[] = [];
      for (const suffix of ["-vA", "-vB"]) {
        const url = `${basePath}/faixa-${safeTrack}${suffix}.mp3`;
        const res = await fetch(url);
        if (res.ok) {
          buffers.push(await res.arrayBuffer());
        }
      }

      if (buffers.length === 0) {
        // Try without version suffix
        const url = `${basePath}/faixa-${safeTrack}.mp3`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Nenhum áudio encontrado no Supabase. Aprova primeiro.");
        buffers.push(await res.arrayBuffer());
      }

      // Concatenate A+B into one segment
      const segmentSize = buffers.reduce((s, b) => s + b.byteLength, 0);
      // Estimate duration from file size (MP3 ~128-192kbps → ~16-24KB/s)
      // For 1 hour (3600s) at ~20KB/s = ~72MB. Use repetitions instead:
      // Each Suno clip is ~3 min. 2 clips = ~6 min. Need ~10 repeats for 1h.
      const estimatedSecsPerSegment = buffers.length * 180; // ~3 min each
      const repeats = Math.ceil(3600 / estimatedSecsPerSegment);

      setStates((s) => ({
        ...s,
        [num]: { ...(s[num] || { clips: [] }), status: "generating", error: `A montar ${repeats}x repetições (~${Math.round(segmentSize * repeats / 1024 / 1024)}MB)...` },
      }));

      // Build the 1h file by repeating the segment
      const totalSize = segmentSize * repeats;
      const result = new Uint8Array(totalSize);
      let offset = 0;
      for (let i = 0; i < repeats; i++) {
        for (const buf of buffers) {
          result.set(new Uint8Array(buf), offset);
          offset += buf.byteLength;
        }
      }

      // Upload to Supabase
      setStates((s) => ({
        ...s,
        [num]: { ...(s[num] || { clips: [] }), status: "generating", error: "A fazer upload do loop 1h..." },
      }));

      const filename = `albums/ancient-ground/faixa-${safeTrack}-1h.mp3`;
      const signedRes = await adminFetch("/api/admin/signed-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (!signedRes.ok) throw new Error("Erro ao gerar URL de upload");
      const { signedUrl } = await signedRes.json();

      const blob = new Blob([result], { type: "audio/mpeg" });
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/mpeg" },
        body: blob,
      });
      if (!uploadRes.ok) throw new Error(`Upload falhou (${uploadRes.status})`);

      setStates((s) => ({
        ...s,
        [num]: { ...(s[num] || { clips: [] }), status: "done", error: `Loop 1h guardado! (${Math.round(totalSize / 1024 / 1024)}MB)` },
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStates((s) => ({
        ...s,
        [num]: { ...(s[num] || { clips: [] }), status: "error", error: msg },
      }));
    }
  }

  // Filter singles
  const filtered = search
    ? ANCIENT_GROUND_SINGLES.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.prompt.toLowerCase().includes(search.toLowerCase()) ||
          String(s.number) === search
      )
    : ANCIENT_GROUND_SINGLES;

  // Stats
  const totalGenerated = Object.values(states).filter((s) => s.status === "done").length;

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-amber-400 mb-1">Ancient Ground</h1>
        <p className="text-xs text-mundo-muted">
          49 singles instrumentais africanos meditativos — Mbira, Kora, Balafon
        </p>
        <p className="text-[10px] text-mundo-muted-dark mt-1">
          {totalGenerated} / 49 gerados
        </p>
      </div>

      {/* Nav */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/admin/producao"
          className="shrink-0 rounded-lg bg-mundo-muted-dark/20 px-4 py-2.5 text-xs text-mundo-muted hover:bg-mundo-muted-dark/40 hover:text-mundo-creme transition flex items-center"
        >
          Producao Loranne
        </Link>
        <Link
          href="/admin/lancamentos"
          className="shrink-0 rounded-lg bg-purple-900/30 px-4 py-2.5 text-xs text-purple-400 hover:bg-purple-900/50 transition flex items-center"
        >
          Lancamentos
        </Link>

        {/* Suno model selector */}
        <select
          value={sunoModel}
          onChange={(e) => setSunoModel(e.target.value)}
          className="rounded-lg bg-amber-900/20 px-3 py-2 text-xs text-amber-300 border border-amber-800/30"
        >
          <option value="V5_5">Suno V5.5</option>
          <option value="V5">Suno V5</option>
          <option value="V4_5">Suno V4.5</option>
          <option value="V4">Suno V4</option>
        </select>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar por nome, prompt ou numero..."
          className="w-full rounded-lg bg-black/30 border border-mundo-muted-dark/20 px-4 py-2.5 text-sm text-mundo-creme placeholder:text-mundo-muted-dark outline-none focus:border-amber-700/50"
        />
      </div>

      {/* Singles grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((single) => (
          <SingleCard
            key={single.number}
            single={single}
            state={getState(single.number)}
            sunoModel={sunoModel}
            onGenerate={() => generateSingle(single)}
            onDownloadClip={downloadClip}
            onApprove={approveSingle}
            onBuildLoop={buildLoop}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-mundo-muted text-sm py-12">
          Nenhum single encontrado.
        </p>
      )}
    </div>
  );
}
