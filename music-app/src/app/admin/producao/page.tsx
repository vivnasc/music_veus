"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { parseBlob } from "music-metadata-browser";
import {
  ALL_ALBUMS,
  getAlbumsByProduct,
  ENERGY_LABELS,
  FLAVOR_LABELS,
  type Album,
  type AlbumTrack,
  type TrackEnergy,
  type TrackFlavor,
} from "@/data/albums";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { adminFetch } from "@/lib/admin-fetch";
import { useAlbumCovers } from "@/hooks/useAlbumCovers";
import { pickLorannImages } from "@/lib/loranne-images";

/** Read ID3 title from an MP3 File */
async function readId3Title(file: File): Promise<string | null> {
  try {
    const metadata = await parseBlob(file);
    return metadata.common.title || null;
  } catch {
    return null;
  }
}

/** Save title to database */
async function saveTitle(albumSlug: string, trackNumber: number, title: string, source: string) {
  await adminFetch("/api/admin/track-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ albumSlug, trackNumber, title, source }),
  }).catch(() => {});
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

type TrackStatus = "idle" | "uploading" | "done" | "error" | "generating" | "polling";

const ENERGY_OPTIONS = ["whisper", "steady", "pulse", "anthem", "raw"] as const;

type SunoClip = {
  id: string;
  status: string;
  audioUrl: string | null;
  originalAudioUrl?: string | null; // Original Suno CDN URL (for upload)
  title: string;
  imageUrl?: string | null;
  duration?: number | null;
  tags?: string | null;
  model?: string | null;
};

type GeneratedClips = {
  clips: SunoClip[];
};

type VersionInfo = { name: string; audioUrl: string; energy: string };

type PromptVersion = {
  id: string;
  label: string;
  prompt: string;
  style: string;
  flavor: string;
  createdAt: string;
};

type GenerationRecord = {
  id: string;
  timestamp: string;
  prompt: string;
  style: string;
  flavor: string;
  energy: string;
  model: string;
  rating?: "up" | "down";
};

// Artist references per flavor for prompt inspiration
const STYLE_ARTIST_REFS: Record<string, string[]> = {
  organic: ["Bon Iver", "Iron & Wine", "Fleet Foxes", "Sufjan Stevens"],
  marrabenta: ["Orchestra Marrabenta", "Wazimbo", "Mingas", "Dilon Djindji"],
  afrobeat: ["Burna Boy", "Fela Kuti", "Wizkid", "Tiwa Savage"],
  bossa: ["Tom Jobim", "João Gilberto", "Bebel Gilberto", "Rosa Passos"],
  jazz: ["Esperanza Spalding", "Gregory Porter", "Diana Krall", "Chet Baker"],
  folk: ["Joni Mitchell", "Nick Drake", "Laura Marling", "José Afonso"],
  funk: ["Anderson .Paak", "Vulfpeck", "D'Angelo", "Erykah Badu"],
  house: ["Disclosure", "Rufus Du Sol", "Channel Tres", "Peggy Gou"],
  gospel: ["Kirk Franklin", "Tasha Cobbs", "CeCe Winans", "Maverick City"],
};

// Words that are redundant given the selected flavor
const REDUNDANT_WORDS_BY_FLAVOR: Record<string, string[]> = {
  house: ["dance-floor", "dancefloor", "four-on-the-floor", "4/4 beat", "club", "electronic beat", "house beat"],
  marrabenta: ["marrabenta rhythm", "mozambican rhythm", "african guitar"],
  afrobeat: ["afrobeat rhythm", "african percussion", "afro groove", "afro beat"],
  bossa: ["bossa nova", "bossa rhythm", "brazilian jazz", "samba feel"],
  jazz: ["jazz harmony", "jazz chords", "swing feel", "jazz feel"],
  folk: ["acoustic folk", "folk guitar", "folk melody"],
  funk: ["funky bass", "funk groove", "funky rhythm", "funk beat"],
  gospel: ["gospel choir", "gospel harmony", "church choir"],
  organic: [],
};

function detectRedundancies(prompt: string, flavor: string | null): string[] {
  if (!flavor || !REDUNDANT_WORDS_BY_FLAVOR[flavor]) return [];
  const lower = prompt.toLowerCase();
  return REDUNDANT_WORDS_BY_FLAVOR[flavor].filter(w => lower.includes(w.toLowerCase()));
}

// ─── Prompt building blocks ───
const PROMPT_BLOCKS = {
  instrumentos: [
    "soft piano", "solo piano", "Rhodes", "acoustic guitar", "nylon guitar",
    "strings", "gentle strings", "synth pads", "reverb pads", "warm bass",
    "deep bass", "drums", "subtle percussion", "organic percussion",
    "body percussion", "shaker", "choir", "organ", "violin", "cello",
    "flute", "harp", "breath sounds", "bells",
  ],
  texturas: [
    "dreamy", "ethereal", "contemplative", "haunting", "spacious",
    "building", "swelling", "flowing", "nocturnal", "meditative",
    "hypnotic", "cosmic", "ancient", "primal", "tender",
    "fierce", "urgent", "patient", "crystalline", "smoky", "liquid",
    "intimate", "grounding", "warm", "vulnerable",
  ],
  producao: [
    "slow build", "driving beat", "walking rhythm", "vocal layers building",
    "close-mic", "water textures", "looping motif", "electronic pulse",
    "minimal", "stripped-back", "full arrangement", "vocal crescendo",
    "silence as instrument", "layered vocals", "rising strings",
  ],
};

const PROMPT_BLOCK_LABELS: Record<string, string> = {
  instrumentos: "Instrumentos",
  texturas: "Texturas / Mood",
  producao: "Produção",
};

// Auto-generate a prompt suggestion from energy + flavor + track description
// Flavor modifier texts that buildPromptWithFlavor() prepends to prompts.
// These are redundant because buildStyle() already sends flavor via the Style parameter.
const FLAVOR_MODIFIER_TEXTS: Record<string, string> = {
  marrabenta: "Mozambican marrabenta fusion with afro-pop, mid-tempo (100-110 BPM), guitar-driven but smoother groove, inspired by Neyma We Can Love, maintaining rhythmic repetition but with modern soft production, warm bass, joyful and grounded.",
  afrobeat: "Afrobeat influence, Afropop groove, syncopated guitar, talking drum patterns, warm bass groove, danceable West African feel, joyful and grounded.",
  bossa: "Bossa nova influence, gentle nylon guitar, soft brushed drums, warm upright bass, intimate Brazilian feel, swaying rhythm, velvet vocal tone.",
  jazz: "Contemporary jazz influence, Rhodes piano, walking bass, brushed cymbals, smoky intimate club feel, improvised phrasing, late-night warmth.",
  folk: "Acoustic folk influence, fingerpicked guitar, warm earthy tone, stomps and claps, storytelling vocal, campfire intimacy, raw and grounded.",
  funk: "Funk, Glossy Early-2000s R&B-Pop Hybrid at ~108 BPM, Female Vocals with smooth falsetto on the hook. Tight punchy drums, snappy claps, rubbery funky bassline, clean rhythm guitar licks, bright synth pads. Nostalgic, Funky, Rhythmic, Smooth, R&B, Clean, dancefloor-ready.",
  house: "House music influence, four-on-the-floor kick, deep bass, hi-hat groove, synth stabs, club warmth, dance-floor energy, infectious rhythmic drive.",
  gospel: "Gospel-inspired, choir harmonies, hand claps, organ warmth, uplifting spiritual energy, community singing feel, call-and-response vocals, celebratory, transcendent.",
};

// Clean a prompt by removing the redundant FLAVOR_MODIFIER prefix.
// Keeps all the track-specific emotion, production, and theme intact.
function cleanPrompt(originalPrompt: string, flavor: string | null): string {
  if (!flavor || !FLAVOR_MODIFIER_TEXTS[flavor]) return originalPrompt;
  const prefix = FLAVOR_MODIFIER_TEXTS[flavor];
  // The modifier is prepended with a space
  if (originalPrompt.startsWith(prefix)) {
    return originalPrompt.slice(prefix.length).trim();
  }
  return originalPrompt;
}

// Generate a prompt from scratch (only when track has no prompt or user wants a fresh start)
function suggestPromptFromScratch(
  energy: TrackEnergy,
  flavor: string,
  lang: "PT" | "EN",
  description: string,
): string {
  const energyBase: Record<string, string> = {
    whisper: "Warm female vocals with poetic lyrics. Intimate, contemplative, transformative. No autotune. Clean vocal production.",
    steady: "Warm female vocals with poetic lyrics. Mid-tempo groove, grounded rhythm. Walking pace, present, embodied. No autotune. Clean vocal production.",
    pulse: "Strong female vocals with conviction. Energy builds. Upbeat, momentum, forward motion. No autotune. Clean vocal production.",
    anthem: "Powerful female vocals, declarative, full-chested. Big chorus, layered vocals. Bold, celebratory, unstoppable. No autotune. Clean vocal production.",
    raw: "Raw female vocals, close-mic, imperfect beauty. Minimal production. Vulnerable, unpolished, real. No autotune. Clean vocal production.",
  };

  const flavorTextures: Record<string, string> = {
    organic: "",
    marrabenta: "guitar-driven warmth, joyful, grounded, sunny.",
    afrobeat: "syncopated groove, percussive warmth, danceable, joyful.",
    bossa: "nylon guitar, swaying, velvet vocal tone, intimate.",
    jazz: "Rhodes warmth, smoky, late-night, conversational phrasing.",
    folk: "fingerpicked guitar, earthy, campfire warmth, storytelling.",
    funk: "glossy, punchy, bright, smooth groove.",
    house: "deep house pads, soft kick, warm bass, spacious, floating.",
    gospel: "uplifting, transcendent, communal warmth, soaring.",
  };

  const langNote = lang === "PT" ? "Lyrics in Portuguese." : "Lyrics in English.";
  const base = energyBase[energy] || energyBase.steady;
  const texture = flavorTextures[flavor] || "";
  const theme = description ? `Theme: ${description}.` : "";

  const parts = [base, texture, langNote, theme].filter(Boolean);
  return parts.join(" ").trim();
}

function trackKey(albumSlug: string, trackNum: number) {
  return `${albumSlug}-t${trackNum}`;
}

function buildUploadForm(
  blob: Blob,
  filename: string,
  album: Album,
  track: AlbumTrack,
  titleOverride?: string | null
): FormData {
  const formData = new FormData();
  formData.append("file", new File([blob], filename, { type: "audio/mpeg" }));
  formData.append("filename", filename);
  formData.append("title", titleOverride || track.title);
  formData.append("artist", "Vivianne dos Santos");
  formData.append("album", album.title);
  formData.append("trackNumber", String(track.number));
  formData.append("year", "2026");
  formData.append("coverPath", getAlbumCover(album));
  return formData;
}

/**
 * Upload audio via signed URL (bypasses Vercel 4.5MB body limit).
 * Falls back to /api/admin/upload-audio for small files if signed URL fails.
 */
async function uploadViaSignedUrl(blob: Blob, filename: string): Promise<string> {
  // Validate blob has actual content
  if (!blob.size || blob.size < 1000) {
    throw new Error(`Ficheiro vazio ou demasiado pequeno (${blob.size} bytes). O download do Suno pode ter falhado.`);
  }

  // Step 1: Get signed upload URL
  const signedRes = await adminFetch("/api/admin/signed-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });

  if (!signedRes.ok) {
    const errData = await signedRes.json().catch(() => ({}));
    throw new Error(errData.erro || `Erro ao gerar URL de upload (${signedRes.status})`);
  }

  const { signedUrl } = await signedRes.json();

  // Step 2: Upload directly to Supabase Storage
  const contentType = filename.endsWith(".mp3") ? "audio/mpeg" : blob.type || "application/octet-stream";
  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => "");
    throw new Error(`Upload falhou (${uploadRes.status}): ${errText.slice(0, 120)}`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
  return `${supabaseUrl}/storage/v1/object/public/audios/${filename}`;
}

/** Upload reel via signed URL (bypasses Vercel 4.5MB limit) */
async function uploadReelDirect(blob: Blob, albumSlug: string, trackNumber: number): Promise<string> {
  const safeAlbum = albumSlug.replace(/[^a-z0-9-]/g, "");
  const safeTrack = String(trackNumber).padStart(2, "0");
  const ext = blob.type.includes("mp4") ? "mp4" : "webm";
  const filename = `albums/${safeAlbum}/faixa-${safeTrack}-reel.${ext}`;
  return uploadViaSignedUrl(blob, filename);
}

function ProductFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  const tabs = [
    { key: "all", label: "Todos" },
    { key: "espelho", label: "Espelhos" },
    { key: "no", label: "Nos" },
    { key: "livro", label: "Livro" },
    { key: "curso", label: "Cursos" },
    { key: "incenso", label: "Incenso" },
    { key: "eter", label: "Éter" },
    { key: "nua", label: "Nua" },
    { key: "sangue", label: "Sangue" },
    { key: "fibra", label: "Fibra" },
    { key: "grao", label: "Grão" },
    { key: "mare", label: "Maré" },
  ];

  return (
    <div className="flex gap-1 rounded-full bg-mundo-muted-dark/10 p-1 overflow-x-auto scrollbar-none -mx-4 px-4">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full px-4 py-2 text-xs font-sans uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
            active === t.key
              ? "bg-mundo-bg text-mundo-creme shadow-sm"
              : "text-mundo-muted hover:text-mundo-creme"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function formatTime(s: number) {
  if (!s || !isFinite(s) || isNaN(s)) return "--:--";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function MiniPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;

    const checkDuration = () => {
      const d = a.duration;
      if (d && isFinite(d) && !isNaN(d) && d > 0) {
        setDuration(d);
      }
    };

    const onTime = () => {
      setCurrent(a.currentTime);
      // Keep checking duration during playback (streaming sources)
      if (!duration || !isFinite(duration)) checkDuration();
    };
    const onEnd = () => { setPlaying(false); checkDuration(); };

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", checkDuration);
    a.addEventListener("durationchange", checkDuration);
    a.addEventListener("canplaythrough", checkDuration);
    a.addEventListener("ended", onEnd);

    // Force preload to get duration
    a.preload = "auto";
    a.load();

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", checkDuration);
      a.removeEventListener("durationchange", checkDuration);
      a.removeEventListener("canplaythrough", checkDuration);
      a.removeEventListener("ended", onEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function toggle() {
    const a = ref.current;
    if (!a) return;
    if (playing) { a.pause(); } else { a.play(); }
    setPlaying(!playing);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = ref.current;
    if (!a || !duration || !isFinite(duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * duration;
  }

  const hasDuration = duration > 0 && isFinite(duration);
  const pct = hasDuration ? (current / duration) * 100 : 0;

  return (
    <div className="mb-2">
      <audio ref={ref} src={src} preload="metadata" />
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="shrink-0 text-mundo-creme hover:text-white">
          {playing ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="4" width="3" height="12" rx="1"/><rect x="12" y="4" width="3" height="12" rx="1"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><polygon points="6,3 17,10 6,17"/></svg>
          )}
        </button>
        <span className="shrink-0 text-[10px] font-mono text-mundo-muted w-8 text-right">{formatTime(current)}</span>
        <div className="flex-1 h-2 rounded-full bg-mundo-muted-dark/30 cursor-pointer relative" onClick={seek}>
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${pct}%` }} />
          <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white shadow" style={{ left: `${pct}%`, marginLeft: -6 }} />
        </div>
        <span className="shrink-0 text-[10px] font-mono text-mundo-muted w-8">{duration > 0 ? formatTime(duration) : "--:--"}</span>
      </div>
    </div>
  );
}

function ClipApprovalRow({
  clip,
  clipIndex,
  hasMainAudio,
  existingVersions,
  trackEnergy,
  albumSlug,
  trackNumber,
  isSelected,
  onSelect,
  onApproveMain,
  onApproveVersion,
  onCreatePersona,
}: {
  clip: SunoClip;
  clipIndex: number;
  hasMainAudio: boolean;
  existingVersions: VersionInfo[];
  trackEnergy: string;
  albumSlug: string;
  trackNumber: number;
  isSelected: boolean;
  onSelect: () => void;
  onApproveMain: () => void;
  onApproveVersion: (name: string, energy: string) => void;
  onCreatePersona?: (clipTaskId: string, clipAudioId: string) => void;
}) {
  const [mode, setMode] = useState<"pick" | "version">("pick");
  const [versionName, setVersionName] = useState(`suno-v${clipIndex + 1}`);
  const [energy, setEnergy] = useState(trackEnergy || "whisper");

  const nameExists = existingVersions.some(v => v.name === versionName);

  return (
    <div className={`rounded-lg border p-3 transition-colors cursor-pointer ${isSelected ? "border-green-500/50 bg-green-950/20" : "border-mundo-muted-dark/20 bg-mundo-bg/50"}`} onClick={onSelect}>
      <div className="flex gap-3">
        {/* Selection indicator */}
        <div className="shrink-0 pt-1">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-green-500 bg-green-500" : "border-mundo-muted-dark/40"}`}>
            {isSelected && (
              <svg viewBox="0 0 24 24" fill="white" className="h-3 w-3"><path d="M20 6L9 17l-5-5" /></svg>
            )}
          </div>
        </div>
        {/* Suno cover image */}
        {clip.imageUrl ? (
          <div className="shrink-0 flex flex-col items-center gap-1">
            <a href={clip.imageUrl} target="_blank" rel="noopener noreferrer" title="Abrir imagem original do Suno">
              <img
                id={`clip-img-${albumSlug}-${trackNumber}-${clipIndex}`}
                src={`/api/admin/proxy-image?url=${encodeURIComponent(clip.imageUrl)}`}
                alt=""
                className="h-20 w-20 rounded-lg object-cover bg-mundo-muted-dark/30 cursor-pointer ring-1 ring-transparent hover:ring-violet-500"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (!img.src.includes(clip.imageUrl!)) img.src = clip.imageUrl!;
                }}
              />
            </a>
            <button
              onClick={async () => {
                const btn = document.activeElement as HTMLButtonElement;
                btn.disabled = true;
                btn.textContent = "...";
                try {
                  // Download full-size image via proxy (not thumbnail from DOM)
                  const proxyUrl = `/api/admin/proxy-image?url=${encodeURIComponent(clip.imageUrl!)}`;
                  const imgRes = await fetch(proxyUrl);
                  if (!imgRes.ok) throw new Error("Download falhou");
                  const blob = await imgRes.blob();
                  if (blob.size < 1000) throw new Error(`Imagem muito pequena (${blob.size} bytes)`);
                  // Upload with real upsert
                  const form = new FormData();
                  form.append("albumSlug", albumSlug);
                  form.append("trackNumber", String(trackNumber));
                  form.append("image", blob, "cover.jpg");
                  const res = await adminFetch("/api/admin/upload-cover", { method: "POST", body: form });
                  const data = await res.json();
                  if (!data.ok) throw new Error(data.erro || "Falhou");
                  btn.textContent = `OK! (${Math.round(blob.size/1024)}KB)`;
                } catch (e) {
                  btn.textContent = "Erro";
                  alert(String(e));
                }
                setTimeout(() => { btn.disabled = false; btn.textContent = "Guardar capa"; }, 2000);
              }}
              className="rounded-lg bg-amber-600/80 px-3 py-2 text-xs font-medium text-white hover:bg-amber-700 transition"
            >
              Guardar capa
            </button>
            <button
              id={`clip-reel-${albumSlug}-${trackNumber}-${clipIndex}`}
              onClick={async () => {
                const btn = document.getElementById(`clip-reel-${albumSlug}-${trackNumber}-${clipIndex}`) as HTMLButtonElement;
                if (!btn) return;
                btn.disabled = true;
                btn.textContent = "...";
                try {
                  const { generateReel } = await import("@/lib/reel-generator");
                  const alb = ALL_ALBUMS.find(a => a.slug === albumSlug);
                  if (!alb) throw new Error("Album nao encontrado");
                  const t = alb.tracks.find(tr => tr.number === trackNumber);
                  if (!t) throw new Error("Faixa nao encontrada");
                  const audioSrc = `/api/music/stream?album=${encodeURIComponent(albumSlug)}&track=${trackNumber}`;
                  const blob = await generateReel(t, alb, clip.imageUrl!, audioSrc, (p) => {
                    btn.textContent = p.message;
                  });
                  btn.textContent = "A enviar...";
                  const form = new FormData();
                  form.append("albumSlug", albumSlug);
                  form.append("trackNumber", String(trackNumber));
                  const videoUrl = await uploadReelDirect(blob, albumSlug, trackNumber);
                  {
                    btn.textContent = "Reel OK!";
                    const parent = btn.parentElement;
                    if (parent && videoUrl) {
                      const reelBlob = blob;
                      const reelUrl = videoUrl;

                      const container = document.createElement("div");
                      container.style.cssText = "margin-top:6px;max-width:180px";

                      const vid = document.createElement("video");
                      vid.src = reelUrl;
                      vid.controls = true;
                      vid.playsInline = true;
                      vid.muted = true;
                      vid.loop = true;
                      vid.style.cssText = "max-height:120px;border-radius:6px;width:100%";
                      container.appendChild(vid);

                      const actions = document.createElement("div");
                      actions.style.cssText = "display:flex;gap:6px;margin-top:6px;flex-wrap:wrap";

                      // Share button (WhatsApp Status / Instagram Reels)
                      const shareBtn = document.createElement("button");
                      shareBtn.textContent = "Partilhar";
                      shareBtn.style.cssText = "font-size:11px;padding:4px 12px;border-radius:6px;background:#C9A96E;color:#0D0D1A;font-weight:600;border:none;cursor:pointer";
                      shareBtn.onclick = async () => {
                        const file = new File([reelBlob], `${t.title} — Loranne.mp4`, { type: "video/mp4" });
                        const caption = `"${t.description}"\n${t.title} — Loranne\nmusic.seteveus.space`;
                        if (navigator.share && navigator.canShare?.({ files: [file] })) {
                          await navigator.share({ files: [file], title: t.title, text: caption }).catch(() => {});
                        } else {
                          // Fallback: copy caption + download video
                          navigator.clipboard.writeText(caption).catch(() => {});
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(reelBlob);
                          a.download = file.name;
                          a.click();
                          alert("Video guardado. Legenda copiada.\nAbre o WhatsApp Status ou Instagram Reels e selecciona o video.");
                        }
                      };
                      actions.appendChild(shareBtn);

                      // Download
                      const dlBtn = document.createElement("a");
                      dlBtn.href = reelUrl;
                      dlBtn.download = `${t.title} — Loranne.mp4`;
                      dlBtn.textContent = "Guardar";
                      dlBtn.style.cssText = "font-size:11px;padding:4px 12px;border-radius:6px;background:rgba(255,255,255,0.05);color:#a0a0b0;border:1px solid rgba(255,255,255,0.1);text-decoration:none;cursor:pointer";
                      actions.appendChild(dlBtn);

                      // Delete
                      const delBtn = document.createElement("button");
                      delBtn.textContent = "Apagar";
                      delBtn.style.cssText = "font-size:11px;padding:4px 12px;border-radius:6px;background:none;color:#f87171;border:none;cursor:pointer";
                      delBtn.onclick = async () => {
                        if (!confirm("Apagar este reel?")) return;
                        const safeT = String(trackNumber).padStart(2, "0");
                        await adminFetch("/api/admin/clear-covers", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ albumSlug, pattern: `faixa-${safeT}-reel` }),
                        });
                        container.innerHTML = "<p style='font-size:10px;color:#a0a0b0;margin-top:4px'>Reel apagado</p>";
                      };
                      actions.appendChild(delBtn);

                      container.appendChild(actions);
                      parent.appendChild(container);
                    }
                  }
                } catch (e) {
                  btn.textContent = "Erro";
                  alert(String(e));
                }
                setTimeout(() => { btn.disabled = false; btn.textContent = "Reel"; }, 3000);
              }}
              className="rounded-lg bg-violet-600/80 px-3 py-2 text-xs font-medium text-white hover:bg-violet-700 transition"
            >
              Reel
            </button>
          </div>
        ) : (
          <div className="h-20 w-20 shrink-0 rounded-lg bg-mundo-muted-dark/20 flex items-center justify-center">
            <span className="text-[8px] text-mundo-muted/40">Sem capa</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] text-mundo-muted font-mono">#{clipIndex + 1}</span>
        {clip.title && <span className="text-xs text-mundo-creme">{clip.title}</span>}
        {clip.model && <span className="text-[10px] text-mundo-muted/50">{clip.model}</span>}
      </div>
      <MiniPlayer src={clip.audioUrl!} />

      {mode === "pick" ? (
        <div className="flex items-center gap-2">
          {!hasMainAudio && (
            <button
              onClick={onApproveMain}
              className="rounded-lg bg-mundo-dourado px-3 py-1.5 text-xs text-white transition hover:bg-mundo-dourado/80"
            >
              Aprovar principal
            </button>
          )}
          <button
            onClick={() => setMode("version")}
            className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white transition hover:bg-violet-700"
          >
            Guardar versão
          </button>
          {hasMainAudio && (
            <button
              onClick={onApproveMain}
              className="rounded-lg bg-mundo-muted-dark/20 px-3 py-1.5 text-xs text-mundo-muted transition hover:bg-mundo-muted-dark/30"
            >
              Substituir principal
            </button>
          )}
          {onCreatePersona && clip.id && (
            <button
              onClick={() => onCreatePersona(String(clip.id), String(clip.id))}
              className="rounded-lg bg-pink-900/30 px-3 py-1.5 text-xs text-pink-400 transition hover:bg-pink-900/50"
              title="Criar persona com a voz deste clip"
            >
              Criar Persona
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={versionName}
              onChange={(e) => setVersionName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              placeholder="nome-da-versão"
              className="flex-1 rounded-lg bg-mundo-bg px-3 py-1.5 text-xs text-mundo-creme border border-mundo-muted-dark/30 focus:border-violet-500 focus:outline-none"
            />
          </div>
          {nameExists && (
            <p className="text-[10px] text-amber-400">Versão "{versionName}" já existe — será substituída.</p>
          )}
          <div className="flex gap-1">
            {ENERGY_OPTIONS.map((e) => (
              <button
                key={e}
                onClick={() => setEnergy(e)}
                className={`rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${
                  energy === e
                    ? ENERGY_LABELS[e].color
                    : "bg-mundo-muted-dark/10 text-mundo-muted hover:text-mundo-creme"
                }`}
              >
                {ENERGY_LABELS[e].emoji} {ENERGY_LABELS[e].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (versionName) onApproveVersion(versionName, energy);
              }}
              disabled={!versionName}
              className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              Guardar "{versionName}"
            </button>
            <button
              onClick={() => setMode("pick")}
              className="text-xs text-mundo-muted hover:text-mundo-creme"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
        </div>{/* end flex-1 */}
      </div>{/* end flex gap-3 */}
    </div>
  );
}


function TrackRow({
  track,
  albumSlug,
  status,
  error,
  onUpload,
  onRemove,
  onGenerate,
  onCancel,
  onApproveClip,
  onApproveAsVersion,
  onUploadVersion,
  onCreatePersona,
  audioUrl,
  existingVersions,
  generatedClips,
  selectedClipIndex,
  onSelectClip,
  editedTitle,
  onTitleChange,
  editedLyrics,
  onLyricsChange,
  editedStyle,
  onStyleChange,
  editedFlavor,
  onFlavorChange,
  isAlbumCover,
  onSetAlbumCover,
  editedPrompt,
  onPromptChange,
  promptVersions: pVersions,
  onSavePromptVersion,
  onLoadPromptVersion,
  generationHistory: genHistory,
  versionRatings,
  onRateVersion,
}: {
  track: AlbumTrack;
  albumSlug: string;
  status: TrackStatus;
  error: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onGenerate: () => void;
  onCancel: () => void;
  onApproveClip: (clipUrl: string, sunoTitle: string, imageUrl: string | null) => void;
  onApproveAsVersion: (clipUrl: string, sunoTitle: string, versionName: string, energy: string, imageUrl?: string | null) => void;
  onUploadVersion: (file: File, versionName: string, energy: string, coverFile?: File | null) => void;
  onCreatePersona?: (taskId: string, audioId: string) => void;
  audioUrl: string | null;
  existingVersions: VersionInfo[];
  generatedClips: GeneratedClips | null;
  selectedClipIndex: number;
  onSelectClip: (idx: number) => void;
  editedTitle: string | null;
  onTitleChange: (title: string) => void;
  editedLyrics: string | null;
  onLyricsChange: (lyrics: string) => void;
  editedStyle: string | null;
  onStyleChange: (style: string) => void;
  editedFlavor: TrackFlavor | null;
  onFlavorChange: (flavor: TrackFlavor) => void;
  isAlbumCover: boolean;
  onSetAlbumCover: () => void;
  editedPrompt: string | null;
  onPromptChange: (prompt: string) => void;
  promptVersions: PromptVersion[];
  onSavePromptVersion: (label: string) => void;
  onLoadPromptVersion: (version: PromptVersion) => void;
  generationHistory: GenerationRecord[];
  versionRatings: Record<string, "up" | "down">;
  onRateVersion: (versionKey: string, rating: "up" | "down") => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [promptVersionLabel, setPromptVersionLabel] = useState("");
  const [promptSaved, setPromptSaved] = useState(false);

  const currentPrompt = editedPrompt ?? track.prompt;
  const currentFlavor = editedFlavor || track.flavor || "organic";
  const redundancies = detectRedundancies(currentPrompt, currentFlavor);
  const artistRefs = STYLE_ARTIST_REFS[currentFlavor] || [];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  const [showVersionUpload, setShowVersionUpload] = useState(false);
  const [versionUploadName, setVersionUploadName] = useState("remix-1");
  const [versionUploadEnergy, setVersionUploadEnergy] = useState(track.energy || "whisper");
  const [versionCoverFile, setVersionCoverFile] = useState<File | null>(null);
  const versionInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const isGenerating = status === "generating" || status === "polling";
  const hasClips = generatedClips && generatedClips.clips.length > 0;
  const clipsReady = hasClips && generatedClips.clips.every(c => c.audioUrl);
  const displayTitle = editedTitle ?? track.title;

  return (
    <div className="rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg-light px-5 py-4">
      <div className="flex items-start gap-4">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mundo-muted-dark/10 font-mono text-sm text-mundo-muted">
          {String(track.number).padStart(2, "0")}
          <span className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-mundo-bg-light ${audioUrl ? "bg-green-500" : "bg-mundo-muted-dark/30"}`} />
        </div>
        <div className="min-w-0 flex-1">
          {/* Editable title */}
          <div className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={displayTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="bg-transparent font-medium text-mundo-creme border-b border-transparent hover:border-mundo-muted-dark/30 focus:border-mundo-dourado focus:outline-none px-0 py-0.5 min-w-0 flex-1 max-w-xs"
            />
            {editedTitle && editedTitle !== track.title && (
              <span className="rounded px-1.5 py-0.5 text-[10px] bg-mundo-dourado/20 text-mundo-dourado">
                editado
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${track.lang === "PT" ? "bg-mundo-muted-dark/15 text-mundo-muted" : "bg-violet-900/30 text-violet-400"}`}>{track.lang}</span>
            {track.energy && (
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${ENERGY_LABELS[track.energy].color}`}>
                {ENERGY_LABELS[track.energy].emoji} {ENERGY_LABELS[track.energy].label}
              </span>
            )}
            {(editedFlavor || track.flavor) && (editedFlavor || track.flavor) !== "organic" && (
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${FLAVOR_LABELS[editedFlavor || track.flavor || "organic"].color}`}>
                {FLAVOR_LABELS[editedFlavor || track.flavor || "organic"].emoji} {FLAVOR_LABELS[editedFlavor || track.flavor || "organic"].label}
              </span>
            )}
            {track.vocalMode === "duet" && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase bg-pink-900/30 text-pink-400">
                Dueto
              </span>
            )}
            {track.lyrics && (
              <span className="rounded px-1.5 py-0.5 text-[10px] bg-green-900/30 text-green-400">
                Letra
              </span>
            )}
          </div>
          <p className="text-sm text-mundo-muted mt-0.5">{track.description}</p>

          {/* Copy buttons — always visible */}
          <div className="mt-2 flex items-center gap-2">
            <CopyButton text={currentPrompt} label="Copiar prompt" />
            {track.lyrics && <CopyButton text={editedLyrics ?? track.lyrics} label="Copiar letra" />}
          </div>

          {/* === PROMPT — editable textarea === */}
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-mundo-muted/60 hover:text-mundo-muted py-2">
              Prompt {editedPrompt !== null && editedPrompt !== track.prompt && <span className="text-amber-400 ml-1">(editado)</span>}
            </summary>
            <div className="mt-1 space-y-2">
              <textarea
                value={currentPrompt}
                onChange={(e) => { onPromptChange(e.target.value); setPromptSaved(false); }}
                className="w-full rounded bg-mundo-bg p-3 font-mono text-xs text-mundo-muted/80 leading-relaxed min-h-[6rem] max-h-[20rem] overflow-y-auto border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none resize-y"
                spellCheck={false}
              />

              {/* Suggest + building blocks */}
              <div className="rounded border border-mundo-muted-dark/15 bg-mundo-bg/50 p-3 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      // Clean: remove redundant flavor prefix, keep track-specific content
                      const cleaned = cleanPrompt(track.prompt, track.flavor || null);
                      onPromptChange(cleaned);
                      setPromptSaved(false);
                    }}
                    className="rounded px-3 py-1.5 text-xs font-medium bg-mundo-dourado/20 text-mundo-dourado hover:bg-mundo-dourado/30 transition"
                  >
                    Limpar prompt
                  </button>
                  <button
                    onClick={() => {
                      const fresh = suggestPromptFromScratch(
                        track.energy || "steady",
                        currentFlavor,
                        track.lang,
                        track.description,
                      );
                      onPromptChange(fresh);
                      setPromptSaved(false);
                    }}
                    className="rounded px-3 py-1.5 text-xs font-medium bg-mundo-muted-dark/20 text-mundo-muted hover:text-mundo-creme transition"
                  >
                    Gerar do zero
                  </button>
                  <span className="text-[10px] text-mundo-muted/40">Limpar: remove redundância, mantém tudo. Gerar do zero: prompt novo simples.</span>
                </div>
                {/* Building blocks by category */}
                {(Object.keys(PROMPT_BLOCKS) as (keyof typeof PROMPT_BLOCKS)[]).map((cat) => (
                  <div key={cat}>
                    <p className="text-[10px] uppercase tracking-wider text-mundo-muted/40 mb-1">{PROMPT_BLOCK_LABELS[cat]}</p>
                    <div className="flex flex-wrap gap-1">
                      {PROMPT_BLOCKS[cat].map((block) => {
                        const isUsed = currentPrompt.toLowerCase().includes(block.toLowerCase());
                        return (
                          <button
                            key={block}
                            onClick={() => {
                              if (isUsed) return;
                              const sep = currentPrompt.endsWith(".") || currentPrompt.endsWith(",") || currentPrompt.endsWith(" ") ? " " : ", ";
                              onPromptChange(currentPrompt + sep + block);
                              setPromptSaved(false);
                            }}
                            className={`rounded px-1.5 py-0.5 text-[10px] transition ${
                              isUsed
                                ? "bg-violet-900/30 text-violet-400"
                                : "bg-mundo-muted-dark/10 text-mundo-muted/60 hover:text-mundo-creme hover:bg-mundo-muted-dark/20"
                            }`}
                          >
                            {isUsed ? `✓ ${block}` : `+ ${block}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Redundancy warnings */}
              {redundancies.length > 0 && (
                <div className="rounded bg-amber-950/40 border border-amber-700/30 px-3 py-2 text-xs text-amber-400">
                  Redundante com flavor <strong>{currentFlavor}</strong>: {redundancies.map((w) => (
                    <span key={w} className="font-mono bg-amber-900/40 rounded px-1 mx-0.5">{w}</span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => { onPromptChange(currentPrompt); setPromptSaved(true); setTimeout(() => setPromptSaved(false), 2000); }}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition ${promptSaved ? "bg-green-800/40 text-green-400" : "bg-violet-600 text-white hover:bg-violet-700"}`}
                >
                  {promptSaved ? "Guardado" : "Guardar"}
                </button>
                {editedPrompt !== null && editedPrompt !== track.prompt && (
                  <button
                    onClick={() => onPromptChange(track.prompt)}
                    className="rounded px-3 py-1.5 text-xs text-red-400 bg-red-900/20 hover:bg-red-900/40 transition"
                  >
                    Repor original
                  </button>
                )}
                {/* Save as named version */}
                <input
                  type="text"
                  value={promptVersionLabel}
                  onChange={(e) => setPromptVersionLabel(e.target.value)}
                  placeholder="Label (ex: v2 - chill)"
                  className="rounded bg-mundo-bg px-2 py-1.5 text-xs border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none w-40"
                />
                <button
                  onClick={() => {
                    if (!promptVersionLabel.trim()) return;
                    onSavePromptVersion(promptVersionLabel.trim());
                    setPromptVersionLabel("");
                  }}
                  disabled={!promptVersionLabel.trim()}
                  className="rounded px-3 py-1.5 text-xs text-mundo-dourado bg-mundo-dourado/20 hover:bg-mundo-dourado/30 transition disabled:opacity-40"
                >
                  Guardar versão
                </button>
              </div>
              {/* Saved prompt versions */}
              {pVersions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-mundo-muted/50">Versões guardadas</p>
                  {pVersions.map((v) => (
                    <div key={v.id} className="flex items-center gap-2 rounded bg-mundo-muted-dark/10 px-2 py-1">
                      <button
                        onClick={() => onLoadPromptVersion(v)}
                        className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                      >
                        {v.label}
                      </button>
                      <span className="text-[10px] text-mundo-muted/40">{new Date(v.createdAt).toLocaleDateString("pt-PT")}</span>
                      {v.style && <span className="text-[10px] text-mundo-muted/30 font-mono truncate max-w-[200px]">{v.style}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>

          {/* === STYLE — flavor buttons + custom override + artist refs === */}
          <details className="mt-1">
            <summary className="cursor-pointer text-sm text-mundo-muted/60 hover:text-mundo-muted py-2">
              Style {editedStyle !== null && <span className="text-amber-400 ml-1">(editado)</span>}
            </summary>
            <div className="mt-2 space-y-2">
              {/* Quick flavor change */}
              <div className="flex flex-wrap gap-1">
                {(Object.keys(FLAVOR_LABELS) as TrackFlavor[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      onStyleChange("");
                      onFlavorChange(f);
                    }}
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase transition ${
                      currentFlavor === f
                        ? FLAVOR_LABELS[f].color
                        : "bg-mundo-muted-dark/10 text-mundo-muted hover:text-mundo-creme"
                    }`}
                  >
                    {FLAVOR_LABELS[f].label}
                  </button>
                ))}
              </div>
              {/* Custom style override */}
              <input
                type="text"
                value={editedStyle ?? ""}
                onChange={(e) => onStyleChange(e.target.value)}
                placeholder="Custom style override (vazio = automático)"
                className="w-full rounded bg-mundo-bg px-3 py-2 font-mono text-xs text-mundo-muted/80 border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none"
              />
              <p className="text-xs text-mundo-muted/40">Clica num flavor para mudar o som. Ou escreve um style manual.</p>
              {/* Artist references for current flavor */}
              {artistRefs.length > 0 && currentFlavor !== "organic" && (
                <div className="rounded bg-mundo-muted-dark/10 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-mundo-muted/50 mb-1">Referências {currentFlavor}</p>
                  <div className="flex flex-wrap gap-1">
                    {artistRefs.map((artist) => (
                      <span key={artist} className="rounded bg-mundo-bg px-2 py-0.5 text-xs text-mundo-muted/70">{artist}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </details>

          {/* Lyrics expandable + editable — always visible so new tracks can have lyrics added */}
          <details className="mt-1" open={showLyrics} onToggle={(e) => setShowLyrics((e.target as HTMLDetailsElement).open)}>
            <summary className="cursor-pointer text-sm text-mundo-muted/60 hover:text-mundo-muted py-2">
              {(editedLyrics || track.lyrics) ? "Ver letra" : "+ Adicionar letra"} {editedLyrics !== null && editedLyrics !== track.lyrics && <span className="text-amber-400 ml-1">(editada)</span>}
            </summary>
            <textarea
              value={editedLyrics ?? track.lyrics ?? ""}
              onChange={(e) => onLyricsChange(e.target.value)}
              placeholder="Cola aqui a letra..."
              className="mt-1 w-full whitespace-pre-wrap rounded bg-mundo-bg p-3 font-mono text-xs text-mundo-muted/80 leading-relaxed min-h-[16rem] max-h-[32rem] overflow-y-auto border border-mundo-muted-dark/20 focus:border-violet-500 focus:outline-none resize-y"
              spellCheck={false}
            />
          </details>

          {error && <p className="mt-2 text-xs text-red-500 break-all">{error}</p>}

          {/* Current audio */}
          {audioUrl && !hasClips && (
            <audio controls src={audioUrl} className="mt-2 h-8 w-full max-w-xs" />
          )}

          {/* Upload/replace cover image */}
          {audioUrl && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                id={`cover-upload-${albumSlug}-${track.number}`}
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const label = document.getElementById(`cover-label-${albumSlug}-${track.number}`);
                  if (label) label.textContent = "A enviar...";
                  try {
                    const filename = `albums/${albumSlug}/faixa-${String(track.number).padStart(2, "0")}-cover.jpg`;
                    await uploadViaSignedUrl(file, filename);
                    if (label) label.textContent = "Capa guardada!";
                  } catch {
                    if (label) label.textContent = "Erro";
                  }
                  setTimeout(() => { if (label) label.textContent = "Carregar capa"; }, 2000);
                }}
              />
              <label
                id={`cover-label-${albumSlug}-${track.number}`}
                htmlFor={`cover-upload-${albumSlug}-${track.number}`}
                className="cursor-pointer rounded-lg bg-mundo-muted-dark/20 px-3 py-1.5 text-xs text-mundo-muted hover:bg-mundo-muted-dark/30 transition"
              >
                Carregar capa
              </label>
              <button
                onClick={async () => {
                  const { generateShareCard, downloadBlob } = await import("@/lib/share-card");
                  const { getAlbumCover, getTrackCoverUrl } = await import("@/lib/album-covers");
                  const alb = ALL_ALBUMS.find(a => a.slug === albumSlug);
                  if (!alb) return;
                  let cover = getAlbumCover(alb);
                  try {
                    const probe = await fetch(getTrackCoverUrl(albumSlug, track.number), { method: "HEAD" });
                    if (probe.ok) cover = getTrackCoverUrl(albumSlug, track.number);
                  } catch {}
                  const blob = await generateShareCard(track, alb, cover, "story");
                  downloadBlob(blob, `Story — ${track.title}.png`);
                }}
                className="rounded-lg bg-amber-700/30 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-700/50 transition min-h-[44px]"
              >
                Story
              </button>
              <button
                className={`rounded-lg px-3 py-2.5 text-[11px] min-h-[44px] transition ${
                  isAlbumCover
                    ? "bg-violet-600/40 text-violet-300"
                    : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-violet-900/20"
                }`}
                onClick={onSetAlbumCover}
              >
                {isAlbumCover ? "★ Capa do álbum" : "Usar como capa"}
              </button>
            </div>
          )}

          {/* Existing versions + ratings + add more */}
          <div className="mt-2">
            {existingVersions.length > 0 && (
              <div className="space-y-2 mb-2">
                {existingVersions.map((v) => {
                  const ratingKey = `${albumSlug}-t${track.number}-${v.name}`;
                  const rating = versionRatings[ratingKey];
                  return (
                    <div key={v.name} className="rounded-lg border border-violet-900/20 bg-violet-950/10 p-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-violet-900/30 px-2 py-0.5 text-[10px] text-violet-400">{v.name}</span>
                        {v.energy && <span className="text-xs text-mundo-muted">{v.energy}</span>}
                        <div className="ml-auto flex items-center gap-1">
                          <button
                            onClick={() => onRateVersion(ratingKey, "up")}
                            className={`text-sm px-1 transition ${rating === "up" ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                            title="Bom"
                          >
                            👍
                          </button>
                          <button
                            onClick={() => onRateVersion(ratingKey, "down")}
                            className={`text-sm px-1 transition ${rating === "down" ? "opacity-100" : "opacity-30 hover:opacity-70"}`}
                            title="Mau"
                          >
                            👎
                          </button>
                        </div>
                      </div>
                      {v.audioUrl && <MiniPlayer src={v.audioUrl} />}
                    </div>
                  );
                })}
              </div>
            )}
            <button
              onClick={() => setShowVersionUpload(!showVersionUpload)}
              className="text-sm text-violet-400 hover:text-violet-300 py-2 transition"
            >
              + Adicionar versão / remix
            </button>
            {showVersionUpload && (
              <div className="mt-2 rounded-lg border border-violet-800/30 bg-violet-950/20 p-3 space-y-2">
                <input
                  ref={versionInputRef}
                  type="file"
                  accept="audio/mpeg,audio/mp3"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && versionUploadName) {
                      onUploadVersion(f, versionUploadName, versionUploadEnergy, versionCoverFile);
                      setShowVersionUpload(false);
                      setVersionCoverFile(null);
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-mundo-muted w-12">Nome:</label>
                  <input
                    type="text"
                    value={versionUploadName}
                    onChange={(e) => setVersionUploadName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="remix-1, acoustic, live..."
                    className="flex-1 rounded bg-mundo-bg px-2 py-1 text-xs text-mundo-creme border border-mundo-muted-dark/30 focus:border-violet-500 focus:outline-none"
                  />
                </div>
                {existingVersions.some(v => v.name === versionUploadName) && (
                  <p className="text-[10px] text-amber-400">"{versionUploadName}" já existe — será substituída.</p>
                )}
                <div className="flex gap-1">
                  {ENERGY_OPTIONS.map((e) => (
                    <button
                      key={e}
                      onClick={() => setVersionUploadEnergy(e)}
                      className={`rounded-lg px-3 py-2 text-xs font-bold uppercase transition ${
                        versionUploadEnergy === e
                          ? ENERGY_LABELS[e].color
                          : "bg-mundo-muted-dark/10 text-mundo-muted hover:text-mundo-creme"
                      }`}
                    >
                      {ENERGY_LABELS[e].emoji} {ENERGY_LABELS[e].label}
                    </button>
                  ))}
                </div>
                {/* Cover image upload */}
                <div className="flex items-center gap-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setVersionCoverFile(f);
                    }}
                  />
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    className="rounded-lg bg-mundo-muted-dark/20 px-3 py-1.5 text-xs text-mundo-muted transition hover:bg-mundo-muted-dark/30"
                  >
                    {versionCoverFile ? `Capa: ${versionCoverFile.name.slice(0, 20)}` : "Adicionar capa (opcional)"}
                  </button>
                  {versionCoverFile && (
                    <button onClick={() => setVersionCoverFile(null)} className="text-[10px] text-red-400 hover:text-red-300">Remover</button>
                  )}
                </div>
                <button
                  onClick={() => versionInputRef.current?.click()}
                  disabled={!versionUploadName}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  Escolher MP3
                </button>
              </div>
            )}
          </div>

          {/* Generation history */}
          {genHistory.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-mundo-muted/60 hover:text-mundo-muted py-2">
                Histórico de gerações ({genHistory.length})
              </summary>
              <div className="mt-1 space-y-1 max-h-60 overflow-y-auto">
                {[...genHistory].reverse().map((rec) => (
                  <div key={rec.id} className="rounded bg-mundo-muted-dark/10 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-mundo-muted/50">{new Date(rec.timestamp).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                      <span className="rounded bg-mundo-bg px-1.5 py-0.5 text-[10px] text-mundo-muted">{rec.model}</span>
                      {rec.flavor && rec.flavor !== "organic" && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${FLAVOR_LABELS[rec.flavor as TrackFlavor]?.color || "text-mundo-muted"}`}>
                          {rec.flavor}
                        </span>
                      )}
                      {rec.energy && (
                        <span className={`rounded px-1.5 py-0.5 text-[10px] uppercase ${ENERGY_LABELS[rec.energy as TrackEnergy]?.color || "text-mundo-muted"}`}>
                          {rec.energy}
                        </span>
                      )}
                      {rec.rating && <span className="text-sm">{rec.rating === "up" ? "👍" : "👎"}</span>}
                    </div>
                    {rec.style && <p className="mt-1 font-mono text-[10px] text-mundo-muted/40 truncate">Style: {rec.style}</p>}
                    <p className="mt-0.5 font-mono text-[10px] text-mundo-muted/40 truncate">Prompt: {rec.prompt.slice(0, 120)}{rec.prompt.length > 120 ? "..." : ""}</p>
                    <button
                      onClick={() => { onPromptChange(rec.prompt); if (rec.style) onStyleChange(rec.style); }}
                      className="mt-1 text-[10px] text-violet-400 hover:text-violet-300"
                    >
                      Reusar este prompt
                    </button>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Generated clips — approve as main or save as version */}
          {clipsReady && (
            <div className="mt-3 rounded-lg border border-amber-700/30 bg-amber-950/30 p-3">
              <p className="mb-2 text-xs font-medium text-amber-400">
                {generatedClips.clips.length} versão(ões) gerada(s) — aprova ou guarda como versão:
              </p>
              <div className="space-y-3">
                {generatedClips.clips.map((clip, idx) => (
                  <ClipApprovalRow
                    key={clip.id}
                    clip={clip}
                    clipIndex={idx}
                    hasMainAudio={!!audioUrl}
                    existingVersions={existingVersions}
                    trackEnergy={track.energy}
                    albumSlug={albumSlug}
                    trackNumber={track.number}
                    isSelected={selectedClipIndex === idx}
                    onSelect={() => onSelectClip(idx)}
                    onApproveMain={() => {
                      if (!clip.audioUrl) { alert("Audio URL em falta. Tenta regenerar."); return; }
                      onApproveClip(clip.audioUrl, clip.title, clip.imageUrl || null);
                    }}
                    onApproveVersion={(name, energy) => onApproveAsVersion(clip.audioUrl!, clip.title, name, energy, clip.imageUrl || null)}
                    onCreatePersona={onCreatePersona ? (taskId, audioId) => onCreatePersona(taskId, audioId) : undefined}
                  />
                ))}
              </div>
              <button
                onClick={onGenerate}
                className="mt-2 text-xs text-mundo-muted hover:text-mundo-creme"
              >
                Regenerar
              </button>
            </div>
          )}

          {/* Polling indicator */}
          {isGenerating && !clipsReady && (
            <div className="mt-3 flex flex-col gap-1 rounded-lg bg-amber-950/30 p-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                <span className="text-xs text-amber-400">
                  {status === "generating" ? "A enviar para o Suno..." : "A aguardar geração (pode demorar 30-60s)..."}
                </span>
              </div>
              {error && (
                <span className="text-[10px] text-mundo-muted/60 font-mono">{error}</span>
              )}
              <button
                onClick={onCancel}
                className="mt-1 self-start text-[10px] text-red-400/70 underline hover:text-red-400"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Generate via Suno */}
          {!audioUrl && !isGenerating && !clipsReady && (
            <button
              onClick={onGenerate}
              disabled={!(editedLyrics || track.lyrics)}
              title={!(editedLyrics || track.lyrics) ? "Letra em falta" : "Gerar via Suno"}
              className={`rounded-lg px-4 py-2 text-xs transition ${
                !(editedLyrics || track.lyrics)
                  ? "bg-mundo-muted-dark/10 text-mundo-muted/40 cursor-not-allowed"
                  : "bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              Gerar via Suno
            </button>
          )}

          {/* Manual upload */}
          {!isGenerating && !clipsReady && (
            audioUrl ? (
              <button
                onClick={onRemove}
                className="rounded-lg bg-red-900/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-900/50"
              >
                Remover
              </button>
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                disabled={status === "uploading"}
                className={`rounded-lg px-4 py-2 text-xs transition ${
                  status === "uploading"
                    ? "animate-pulse bg-amber-900/30 text-amber-400"
                    : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/30"
                }`}
              >
                {status === "uploading" ? "A enviar..." : "Carregar MP3"}
              </button>
            )
          )}

          {/* Generate animated reel (Canvas + Audio) */}
          {(["status", "insta"] as const).map((reelType) => (
          <button
            key={reelType}
            id={`reel-btn-${reelType}-${albumSlug}-${track.number}`}
            onClick={async () => {
              const btn = document.getElementById(`reel-btn-${reelType}-${albumSlug}-${track.number}`) as HTMLButtonElement;
              const resultDiv = document.getElementById(`reel-result-${albumSlug}-${track.number}`);
              if (!btn) return;
              btn.disabled = true;
              btn.textContent = "A preparar...";
              if (resultDiv) resultDiv.innerHTML = "";

              try {
                const { generateReel, REEL_SIZE_STATUS, REEL_SIZE_INSTA } = await import("@/lib/reel-generator");
                const reelSize = reelType === "insta" ? REEL_SIZE_INSTA : REEL_SIZE_STATUS;
                const { getAlbumCover, getTrackCoverUrl } = await import("@/lib/album-covers");

                const alb = ALL_ALBUMS.find(a => a.slug === albumSlug);
                if (!alb) throw new Error("Album não encontrado");

                let coverSrc = getAlbumCover(alb);
                try {
                  const trackCoverUrl = getTrackCoverUrl(albumSlug, track.number);
                  const probe = await fetch(trackCoverUrl, { method: "HEAD" });
                  if (probe.ok) coverSrc = trackCoverUrl;
                } catch {}

                const audioSrc = `/api/music/stream?album=${encodeURIComponent(albumSlug)}&track=${track.number}`;

                const blob = await generateReel(track, alb, coverSrc, audioSrc, (p) => {
                  btn.textContent = p.message;
                }, undefined, reelSize);

                btn.textContent = "A enviar...";

                const form = new FormData();
                const reelVideoUrl = await uploadReelDirect(blob, albumSlug, track.number);

                {
                  btn.textContent = "Reel guardado!";
                  if (resultDiv) {
                    resultDiv.innerHTML = "";
                    const reelBlob = blob;

                    const vid = document.createElement("video");
                    vid.src = reelVideoUrl;
                    vid.controls = true;
                    vid.playsInline = true;
                    vid.muted = true;
                    vid.loop = true;
                    vid.style.cssText = "max-height:120px;border-radius:6px;margin-top:6px;width:100%";
                    resultDiv.appendChild(vid);

                    // Caption — ready to copy with hashtags
                    const lyricLines = track.lyrics?.split("\n").filter((l: string) => {
                      const t = l.trim();
                      return t.length > 15 && t.length < 80 && !t.startsWith("[");
                    }) || [];
                    const lyric = lyricLines.length > 0 ? lyricLines[Math.floor(Date.now() / 86400000) % lyricLines.length].trim() : "";

                    const baseHashtags = "#loranne #veus #musicanova #sentir #consciência #artistaindependente";
                    const energyTags: Record<string, string> = {
                      whisper: "#intimate #calma #profundo",
                      steady: "#groove #sentirestar #flow",
                      pulse: "#energia #dança #ritmo",
                      anthem: "#poder #hino #força",
                      raw: "#cru #acústico #verdade",
                    };
                    const productTags: Record<string, string> = {
                      espelho: "#despertar #autoconhecimento #espelho",
                      no: "#relações #amor #conexão",
                      livro: "#despertar #filosofia #consciência",
                      espiritual: "#sagrado #corpo #oração",
                      vida: "#vidareal #quotidiano #sentir",
                      cosmic: "#cósmico #viagem #infinito",
                      romance: "#amor #paixão #intimidade",
                      curso: "#transformação #aprender #crescer",
                    };
                    const albumObj = ALL_ALBUMS.find(a => a.slug === albumSlug);
                    const tags = [
                      baseHashtags,
                      energyTags[track.energy] || "",
                      productTags[albumObj?.product || ""] || "",
                      track.flavor === "marrabenta" ? "#tropical #dançável" : "",
                      track.flavor === "gospel" ? "#gospel #fé" : "",
                      track.flavor === "bossa" ? "#bossanova #suave" : "",
                      "#ouveoqueninguémdiz #musicaqueacorda",
                    ].filter(Boolean).join(" ");

                    const caption = lyric
                      ? `"${lyric}"\n\n${track.title} — Loranne\n${albumObj?.title || ""}\nmusic.seteveus.space\n\n${tags}`
                      : `${track.title} — Loranne\n${track.description}\nmusic.seteveus.space\n\n${tags}`;

                    const captionDiv = document.createElement("div");
                    captionDiv.style.cssText = "margin-top:8px;padding:8px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:8px;position:relative";
                    const captionText = document.createElement("p");
                    captionText.textContent = caption;
                    captionText.style.cssText = "font-size:12px;color:#a0a0b0;white-space:pre-line;line-height:1.5";
                    captionDiv.appendChild(captionText);
                    const copyBtn = document.createElement("button");
                    copyBtn.textContent = "Copiar";
                    copyBtn.style.cssText = "position:absolute;top:6px;right:6px;font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(201,169,110,0.2);color:#C9A96E;border:none;cursor:pointer";
                    copyBtn.onclick = (e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(caption);
                      copyBtn.textContent = "Copiado";
                      setTimeout(() => { copyBtn.textContent = "Copiar"; }, 1500);
                    };
                    captionDiv.appendChild(copyBtn);
                    resultDiv.appendChild(captionDiv);

                    const actions = document.createElement("div");
                    actions.style.cssText = "display:flex;gap:6px;margin-top:6px;flex-wrap:wrap";

                    // Share
                    const shareBtn = document.createElement("button");
                    shareBtn.textContent = "Partilhar";
                    shareBtn.style.cssText = "font-size:11px;padding:4px 12px;border-radius:6px;background:#C9A96E;color:#0D0D1A;font-weight:600;border:none;cursor:pointer";
                    shareBtn.onclick = async () => {
                      const file = new File([reelBlob], `${track.title} — Loranne.mp4`, { type: "video/mp4" });
                      const caption = `"${track.description}"\n${track.title} — Loranne\nmusic.seteveus.space`;
                      if (navigator.share && navigator.canShare?.({ files: [file] })) {
                        await navigator.share({ files: [file], title: track.title, text: caption }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(caption).catch(() => {});
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(reelBlob);
                        a.download = file.name;
                        a.click();
                        alert("Video guardado. Legenda copiada.\nAbre o WhatsApp Status ou Instagram Reels e selecciona o video.");
                      }
                    };
                    actions.appendChild(shareBtn);

                    // Download
                    const dl = document.createElement("a");
                    dl.href = reelVideoUrl;
                    dl.download = `${track.title} — Loranne.mp4`;
                    dl.textContent = "Guardar";
                    dl.style.cssText = "font-size:11px;padding:4px 12px;border-radius:6px;background:rgba(255,255,255,0.05);color:#a0a0b0;border:1px solid rgba(255,255,255,0.1);text-decoration:none";
                    actions.appendChild(dl);

                    // Delete
                    const del = document.createElement("button");
                    del.textContent = "Apagar";
                    del.style.cssText = "font-size:11px;padding:4px 12px;border-radius:6px;background:none;color:#f87171;border:none;cursor:pointer";
                    del.onclick = async () => {
                      if (!confirm("Apagar este reel?")) return;
                      const safeT = String(track.number).padStart(2, "0");
                      await adminFetch("/api/admin/clear-covers", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ albumSlug, pattern: `faixa-${safeT}-reel` }),
                      });
                      resultDiv.innerHTML = "<p style='font-size:10px;color:#a0a0b0;margin-top:4px'>Reel apagado</p>";
                    };
                    actions.appendChild(del);
                    resultDiv.appendChild(actions);
                  }
                }
              } catch (e) {
                btn.textContent = "Erro";
                if (resultDiv) resultDiv.innerHTML = `<p style="font-size:10px;color:#f87171;margin-top:4px">${String(e)}</p>`;
              }
              btn.disabled = false;
            }}
            className="rounded-lg bg-violet-900/30 px-3 py-1.5 text-xs text-violet-400 hover:bg-violet-900/50 transition"
          >
            {reelType === "status" ? "Reel Status" : "Reel Insta"}
          </button>
          ))}
          {/* Short — link to dedicated page */}
          <Link
            href={`/admin/shorts`}
            className="shrink-0 rounded px-3 py-2 text-xs font-medium bg-violet-900/30 text-violet-400 hover:bg-violet-900/50"
          >
            Shorts
          </Link>
          <div id={`reel-result-${albumSlug}-${track.number}`} style={{ maxWidth: "240px" }}></div>
        </div>
      </div>
    </div>
  );
}

export default function AlbumProductionPage() {
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"producao" | "letras">("producao");
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, TrackStatus>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [generatedClips, setGeneratedClips] = useState<Record<string, GeneratedClips>>({});
  const [selectedClipIdx, setSelectedClipIdx] = useState<Record<string, number>>({});
  const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
  const [editedLyrics, setEditedLyrics] = useState<Record<string, string>>({});
  const [editedStyles, setEditedStyles] = useState<Record<string, string>>({});
  const [editedFlavors, setEditedFlavors] = useState<Record<string, TrackFlavor>>({});
  const lyricsSaveRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [trackVersions, setTrackVersions] = useState<Record<string, VersionInfo[]>>({}); // key → versions
  const [sunoModel, setSunoModel] = useState("V5_5");
  const [personaId, setPersonaId] = useState<string>("");
  const [personaName, setPersonaName] = useState<string>("");
  const [creatingPersona, setCreatingPersona] = useState(false);
  const [personaResult, setPersonaResult] = useState<string | null>(null);
  const [editedPrompts, setEditedPrompts] = useState<Record<string, string>>({});
  const [promptVersions, setPromptVersions] = useState<Record<string, PromptVersion[]>>({});
  const [generationHistory, setGenerationHistory] = useState<Record<string, GenerationRecord[]>>({});
  const [versionRatings, setVersionRatings] = useState<Record<string, "up" | "down">>({});
  const pollingRef = useRef<Record<string, NodeJS.Timeout>>({});
  const titleSaveRef = useRef<Record<string, NodeJS.Timeout>>({});
  const { getCoverTrack, setCoverTrack } = useAlbumCovers();

  // Load existing audio status + saved titles on mount
  useEffect(() => {
    adminFetch("/api/admin/audio-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.existing) {
          const newStatuses: Record<string, TrackStatus> = {};
          const newUrls: Record<string, string> = {};
          for (const key of data.existing as string[]) {
            newStatuses[key] = "done";
            const match = key.match(/^(.+)-t(\d+)$/);
            if (match) {
              newUrls[key] = `/api/music/stream?album=${match[1]}&track=${match[2]}`;
            }
          }
          setStatuses((s) => ({ ...newStatuses, ...s }));
          setAudioUrls((u) => ({ ...newUrls, ...u }));
        }
      })
      .catch(() => {});

    // Load saved custom titles
    adminFetch("/api/admin/track-metadata")
      .then((r) => r.json())
      .then((data) => {
        if (data.titles) {
          const saved: Record<string, string> = {};
          for (const [key, val] of Object.entries(data.titles)) {
            saved[key] = (val as { title: string }).title;
          }
          setEditedTitles((t) => ({ ...saved, ...t }));
        }
      })
      .catch(() => {});

    // Load existing track versions
    adminFetch("/api/admin/track-versions")
      .then((r) => r.json())
      .then((data) => {
        if (data.versions) {
          const vMap: Record<string, VersionInfo[]> = {};
          for (const v of data.versions as { album_slug: string; track_number: number; version_name: string; audio_url: string; energy: string }[]) {
            const key = `${v.album_slug}-t${v.track_number}`;
            if (!vMap[key]) vMap[key] = [];
            vMap[key].push({ name: v.version_name, audioUrl: v.audio_url, energy: v.energy });
          }
          setTrackVersions(vMap);
        }
      })
      .catch(() => {});

    // Load saved custom lyrics
    adminFetch("/api/admin/track-lyrics")
      .then((r) => r.json())
      .then((data) => {
        if (data.lyrics) {
          setEditedLyrics((l) => ({ ...data.lyrics, ...l }));
        }
      })
      .catch(() => {});


    // Pending clips loading disabled — was causing clip loss and stale URLs
    // TODO: re-enable when upload reliability is improved
    // adminFetch("/api/admin/pending-clips")
    //   .then(...)

    // Load localStorage data (prompts, styles, flavors, versions, history, ratings)
    try {
      const lsPrompts = localStorage.getItem("producao_editedPrompts");
      if (lsPrompts) setEditedPrompts(JSON.parse(lsPrompts));
      const lsStyles = localStorage.getItem("producao_editedStyles");
      if (lsStyles) setEditedStyles(JSON.parse(lsStyles));
      const lsFlavors = localStorage.getItem("producao_editedFlavors");
      if (lsFlavors) setEditedFlavors(JSON.parse(lsFlavors));
      const lsVersions = localStorage.getItem("producao_promptVersions");
      if (lsVersions) setPromptVersions(JSON.parse(lsVersions));
      const lsHistory = localStorage.getItem("producao_generationHistory");
      if (lsHistory) setGenerationHistory(JSON.parse(lsHistory));
      const lsRatings = localStorage.getItem("producao_versionRatings");
      if (lsRatings) setVersionRatings(JSON.parse(lsRatings));
    } catch {}
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    try { localStorage.setItem("producao_editedPrompts", JSON.stringify(editedPrompts)); } catch {}
  }, [editedPrompts]);
  useEffect(() => {
    try { localStorage.setItem("producao_editedStyles", JSON.stringify(editedStyles)); } catch {}
  }, [editedStyles]);
  useEffect(() => {
    try { localStorage.setItem("producao_editedFlavors", JSON.stringify(editedFlavors)); } catch {}
  }, [editedFlavors]);
  useEffect(() => {
    try { localStorage.setItem("producao_promptVersions", JSON.stringify(promptVersions)); } catch {}
  }, [promptVersions]);
  useEffect(() => {
    try { localStorage.setItem("producao_generationHistory", JSON.stringify(generationHistory)); } catch {}
  }, [generationHistory]);
  useEffect(() => {
    try { localStorage.setItem("producao_versionRatings", JSON.stringify(versionRatings)); } catch {}
  }, [versionRatings]);

  useEffect(() => {
    return () => {
      Object.values(pollingRef.current).forEach(clearInterval);
    };
  }, []);

  const pollStatus = useCallback((key: string, clipIds: string[]) => {
    if (pollingRef.current[key]) {
      clearInterval(pollingRef.current[key]);
    }

    setStatuses((s) => ({ ...s, [key]: "polling" }));
    setErrors((e) => ({ ...e, [key]: "" }));

    let pollCount = 0;
    let lastPollInfo = "";
    const interval = setInterval(async () => {
      pollCount++;
      try {
        const res = await adminFetch(`/api/admin/suno/status?ids=${clipIds.join(",")}`);
        if (!res.ok) {
          lastPollInfo = `Poll #${pollCount}: HTTP ${res.status}`;
          setErrors((e) => ({ ...e, [key]: lastPollInfo }));
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        if (data.erro) {
          lastPollInfo = `Poll #${pollCount}: ${data.erro}`;
          setErrors((e) => ({ ...e, [key]: lastPollInfo }));
          throw new Error(data.erro);
        }

        // Show poll progress in the error field (as debug info)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const clipStatuses = (data.clips || []).map((c: any) => {
          const raw = c.rawStatus ? ` (raw:${c.rawStatus})` : "";
          const audio = c.audioUrl ? " +audio" : "";
          return `${c.status}${raw}${audio}`;
        });
        lastPollInfo = `Poll #${pollCount}: ${clipStatuses.join(", ")}`;
        setErrors((e) => ({ ...e, [key]: lastPollInfo }));

        // Check if any clip has an error
        const hasError = data.clips.some((c: SunoClip) => c.status === "error");
        if (hasError) {
          clearInterval(pollingRef.current[key]);
          delete pollingRef.current[key];
          setStatuses((s) => ({ ...s, [key]: "error" }));
          setErrors((e) => ({ ...e, [key]: "Suno devolveu erro na geração." }));
          return;
        }

        const allDone = data.clips.every((c: SunoClip) => c.status === "complete" && c.audioUrl);

        if (allDone) {
          clearInterval(pollingRef.current[key]);
          delete pollingRef.current[key];
          setErrors((e) => ({ ...e, [key]: "A descarregar clips..." }));

          // Download all clips to browser memory immediately
          const cached: SunoClip[] = [];
          for (const c of data.clips as SunoClip[]) {
            if (!c.audioUrl) { cached.push(c); continue; }
            try {
              const audioRes = await fetch(c.audioUrl);
              if (audioRes.ok) {
                const blob = await audioRes.blob();
                if (blob.size > 1000) {
                  const localUrl = URL.createObjectURL(blob);
                  cached.push({ ...c, audioUrl: localUrl, originalAudioUrl: c.audioUrl });
                  continue;
                }
              }
            } catch { /* keep original URL */ }
            cached.push(c);
          }

          setGeneratedClips((g) => ({
            ...g,
            [key]: { clips: cached },
          }));
          setStatuses((s) => ({ ...s, [key]: "idle" }));
          setErrors((e) => ({ ...e, [key]: "" }));
        }
      } catch (err) {
        console.warn(`[poll #${pollCount}] ${key} error:`, err);
      }
    }, 5000);

    pollingRef.current[key] = interval;

    setTimeout(() => {
      if (pollingRef.current[key]) {
        clearInterval(pollingRef.current[key]);
        delete pollingRef.current[key];
        setStatuses((s) => {
          if (s[key] === "polling") return { ...s, [key]: "error" };
          return s;
        });
        setErrors((e) => ({ ...e, [key]: `Timeout após 5 min. Último: ${lastPollInfo || "sem resposta"}` }));
      }
    }, 5 * 60 * 1000);
  }, []);

  const albums =
    filter === "all"
      ? ALL_ALBUMS
      : getAlbumsByProduct(filter as Album["product"]);

  const album = selectedAlbum
    ? ALL_ALBUMS.find((a) => a.slug === selectedAlbum) || null
    : null;

  const totalTracks = ALL_ALBUMS.reduce((s, a) => s + a.tracks.length, 0);
  const totalDone = Object.values(statuses).filter((s) => s === "done").length;
  const totalWithLyrics = ALL_ALBUMS.reduce(
    (s, a) => s + a.tracks.filter((t) => t.lyrics).length,
    0
  );
  const totalVersions = Object.values(trackVersions).reduce((s, v) => s + v.length, 0);

  async function generateTrack(albumSlug: string, track: AlbumTrack) {
    const key = trackKey(albumSlug, track.number);
    const usedPrompt = editedPrompts[key] || track.prompt;
    const usedStyle = editedStyles[key] || "";
    const usedFlavor = editedFlavors[key] || track.flavor || "";

    setStatuses((s) => ({ ...s, [key]: "generating" }));
    setErrors((e) => ({ ...e, [key]: "" }));
    setGeneratedClips((g) => {
      const copy = { ...g };
      delete copy[key];
      return copy;
    });

    // Clean up old pending clips for this track (regenerating)
    adminFetch("/api/admin/pending-clips", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_slug: albumSlug, track_number: track.number }),
    }).catch(() => {});

    // Record generation in history
    const historyRecord: GenerationRecord = {
      id: `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      prompt: usedPrompt,
      style: usedStyle,
      flavor: usedFlavor,
      energy: track.energy || "",
      model: sunoModel,
    };
    setGenerationHistory((h) => ({
      ...h,
      [key]: [...(h[key] || []), historyRecord],
    }));

    try {
      const res = await adminFetch("/api/admin/suno/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: usedPrompt,
          lyrics: editedLyrics[key] || track.lyrics,
          title: editedTitles[key] || track.title,
          instrumental: false,
          model: sunoModel,
          energy: track.energy,
          flavor: editedFlavors[key] || track.flavor,
          customStyle: editedStyles[key] || null,
          ...(personaId ? { personaId, personaModel: "voice_persona" } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ erro: `HTTP ${res.status}` }));
        throw new Error(data.erro || `Erro ${res.status}`);
      }

      const data = await res.json();
      if (!data.clips || data.clips.length === 0) {
        throw new Error("Nenhum clip retornado pelo Suno.");
      }

      const clipIds = data.clips.map((c: SunoClip) => c.id);
      const allReady = data.clips.every((c: SunoClip) => c.audioUrl);

      if (allReady) {
        setGeneratedClips((g) => ({
          ...g,
          [key]: { clips: data.clips },
        }));
        setStatuses((s) => ({ ...s, [key]: "idle" }));
      } else {
        pollStatus(key, clipIds);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStatuses((s) => ({ ...s, [key]: "error" }));
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  }

  async function approveClip(albumSlug: string, track: AlbumTrack, clipAudioUrl: string, sunoTitle: string, imageUrl?: string | null) {
    const key = trackKey(albumSlug, track.number);
    setStatuses((s) => ({ ...s, [key]: "uploading" }));

    // If Suno gave a better title, save it
    if (sunoTitle && sunoTitle !== track.title && !editedTitles[key]) {
      setEditedTitles((t) => ({ ...t, [key]: sunoTitle }));
      saveTitle(albumSlug, track.number, sunoTitle, "suno");
    }

    try {
      let blob: Blob | null = null;
      const isCached = clipAudioUrl.startsWith("blob:");

      // If cached in memory (blob: URL), fetch directly — always works
      if (isCached) {
        const res = await fetch(clipAudioUrl);
        if (res.ok) blob = await res.blob();
      } else {
        // Try direct download first
        try {
          const directRes = await fetch(clipAudioUrl);
          if (directRes.ok) blob = await directRes.blob();
        } catch { /* CORS blocked */ }

        // Fallback to server proxy if direct failed
        if (!blob || blob.size < 1000) {
          const proxyRes = await adminFetch("/api/admin/proxy-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: clipAudioUrl }),
          });
          if (!proxyRes.ok) throw new Error(`Download falhou (${proxyRes.status}). Tenta regenerar.`);
          blob = await proxyRes.blob();
        }
      }

      if (!blob || blob.size < 1000) throw new Error(`Audio vazio (${blob?.size || 0} bytes). Tenta regenerar.`);

      const filename = `albums/${albumSlug}/faixa-${String(track.number).padStart(2, "0")}.mp3`;
      const url = await uploadViaSignedUrl(blob, filename);

      // Save Suno cover — full-size via proxy + upload with upsert
      if (imageUrl) {
        try {
          const proxyUrl = `/api/admin/proxy-image?url=${encodeURIComponent(imageUrl)}`;
          const imgRes = await fetch(proxyUrl);
          if (imgRes.ok) {
            const imgBlob = await imgRes.blob();
            if (imgBlob.size > 1000) {
              const form = new FormData();
              form.append("albumSlug", albumSlug);
              form.append("trackNumber", String(track.number));
              form.append("image", imgBlob, "cover.jpg");
              await adminFetch("/api/admin/upload-cover", { method: "POST", body: form });
            }
          }
        } catch {
          // Image upload is optional — don't fail the approval
        }
      }

      setStatuses((s) => ({ ...s, [key]: "done" }));
      setAudioUrls((u) => ({ ...u, [key]: url }));
      // Keep ALL generated clips — user can swap later
      // Clean up approved clip from pending in Supabase
      const approvedClip = generatedClips[key]?.clips.find((c) => c.audioUrl === clipAudioUrl);
      if (approvedClip?.id) {
        adminFetch("/api/admin/pending-clips", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clip_id: approvedClip.id }),
        }).catch(() => {});
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStatuses((s) => ({ ...s, [key]: "error" }));
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  }

  async function approveAsVersion(
    albumSlug: string,
    track: AlbumTrack,
    clipAudioUrl: string,
    sunoTitle: string,
    versionName: string,
    energy: string
  ) {
    const key = trackKey(albumSlug, track.number);
    setStatuses((s) => ({ ...s, [key]: "uploading" }));

    try {
      const audioRes = await fetch(clipAudioUrl);
      if (!audioRes.ok) throw new Error("Erro ao descarregar o áudio.");
      const blob = await audioRes.blob();

      const filename = `albums/${albumSlug}/faixa-${String(track.number).padStart(2, "0")}-${versionName}.mp3`;
      const uploadUrl = await uploadViaSignedUrl(blob, filename);

      // Save version metadata to track_versions table
      await adminFetch("/api/admin/track-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          album_slug: albumSlug,
          track_number: track.number,
          version_name: versionName,
          energy,
          audio_url: uploadUrl,
        }),
      });

      // Save title if Suno provided one
      if (sunoTitle) {
        saveTitle(albumSlug, track.number, sunoTitle, "suno");
      }

      // Update local version list
      setTrackVersions((v) => {
        const existing = v[key] || [];
        if (!existing.some(e => e.name === versionName)) {
          return { ...v, [key]: [...existing, { name: versionName, audioUrl: uploadUrl, energy }] };
        }
        return v;
      });

      setStatuses((s) => ({ ...s, [key]: statuses[key] === "uploading" ? (audioUrls[key] ? "done" : "idle") : s[key] }));
      // Keep ALL generated clips — user can swap later
      // Clean up approved clip from pending in Supabase
      const approvedClip = generatedClips[key]?.clips.find((c) => c.audioUrl === clipAudioUrl);
      if (approvedClip?.id) {
        adminFetch("/api/admin/pending-clips", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clip_id: approvedClip.id }),
        }).catch(() => {});
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStatuses((s) => ({ ...s, [key]: "error" }));
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  }

  async function uploadVersion(albumSlug: string, track: AlbumTrack, file: File, versionName: string, energy: string, coverFile?: File | null) {
    const key = trackKey(albumSlug, track.number);
    setStatuses((s) => ({ ...s, [key]: "uploading" }));

    try {
      const album = ALL_ALBUMS.find(a => a.slug === albumSlug)!;
      const filename = `albums/${albumSlug}/faixa-${String(track.number).padStart(2, "0")}-${versionName}.mp3`;
      const uploadUrl = await uploadViaSignedUrl(file, filename);

      // Upload cover image if provided
      if (coverFile) {
        try {
          const ext = coverFile.name.split(".").pop() || "jpg";
          const coverFilename = `albums/${albumSlug}/faixa-${String(track.number).padStart(2, "0")}-${versionName}-cover.${ext}`;
          await uploadViaSignedUrl(coverFile, coverFilename);
        } catch { /* cover upload is optional */ }
      }

      // Save version metadata
      await adminFetch("/api/admin/track-versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          album_slug: albumSlug,
          track_number: track.number,
          version_name: versionName,
          energy,
          audio_url: uploadUrl,
        }),
      });

      // Update local version list
      setTrackVersions((v) => {
        const existing = v[key] || [];
        if (!existing.some(e => e.name === versionName)) {
          return { ...v, [key]: [...existing, { name: versionName, audioUrl: uploadUrl, energy }] };
        }
        return v;
      });

      setStatuses((s) => ({ ...s, [key]: audioUrls[key] ? "done" : "idle" }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStatuses((s) => ({ ...s, [key]: "error" }));
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  }

  async function uploadTrack(albumSlug: string, track: AlbumTrack, file: File) {
    const key = trackKey(albumSlug, track.number);
    setStatuses((s) => ({ ...s, [key]: "uploading" }));
    setErrors((e) => ({ ...e, [key]: "" }));

    try {
      // Read ID3 title from MP3 before uploading
      const id3Title = await readId3Title(file);

      const filename = `albums/${albumSlug}/faixa-${String(track.number).padStart(2, "0")}.mp3`;
      const url = await uploadViaSignedUrl(file, filename);

      setStatuses((s) => ({ ...s, [key]: "done" }));
      setAudioUrls((u) => ({ ...u, [key]: url }));

      // If MP3 has an ID3 title, use it (unless already manually edited)
      if (id3Title && !editedTitles[key]) {
        setEditedTitles((t) => ({ ...t, [key]: id3Title }));
        saveTitle(albumSlug, track.number, id3Title, "id3");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setStatuses((s) => ({ ...s, [key]: "error" }));
      setErrors((e) => ({ ...e, [key]: msg }));
    }
  }

  function removeTrack(albumSlug: string, trackNum: number) {
    const key = trackKey(albumSlug, trackNum);
    setStatuses((s) => ({ ...s, [key]: "idle" }));
    setAudioUrls((u) => {
      const copy = { ...u };
      delete copy[key];
      return copy;
    });
  }

  return (
    <div className="min-h-screen bg-mundo-bg">
      {/* Header */}
      <div className="border-b border-mundo-muted-dark/30 bg-mundo-bg-light/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 overflow-x-hidden">
          <Link
            href="/"
            className="mb-4 inline-block text-sm text-mundo-muted hover:text-mundo-creme"
          >
            ← Início
          </Link>
          <h1 className="font-display text-3xl text-mundo-creme">
            Produção de Álbuns
          </h1>
          <p className="mt-1 text-mundo-muted">
            Gera via Suno, ouve, edita o título, aprova.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-mundo-muted-dark/10 px-3 py-1 text-xs text-mundo-muted">
              {ALL_ALBUMS.length} albums
            </span>
            <span className="rounded-full bg-mundo-muted-dark/10 px-3 py-1 text-xs text-mundo-muted">
              {totalTracks} faixas
            </span>
            <span className="rounded-full bg-mundo-muted-dark/10 px-3 py-1 text-xs text-mundo-muted">
              {totalDone}/{totalTracks} carregadas
            </span>
            <span className="rounded-full bg-green-900/30 px-3 py-1 text-xs text-green-400">
              {totalWithLyrics}/{totalTracks} com letra
            </span>
            {totalVersions > 0 && (
              <span className="rounded-full bg-violet-900/30 px-3 py-1 text-xs text-violet-400">
                {totalVersions} versões
              </span>
            )}
            {(["whisper", "steady", "pulse", "anthem", "raw"] as TrackEnergy[]).map((e) => {
              const count = ALL_ALBUMS.reduce(
                (s, a) => s + a.tracks.filter((t) => t.energy === e).length,
                0
              );
              return count > 0 ? (
                <span key={e} className={`rounded-full px-3 py-1 text-xs ${ENERGY_LABELS[e].color}`}>
                  {ENERGY_LABELS[e].emoji} {count} {ENERGY_LABELS[e].label.toLowerCase()}
                </span>
              ) : null;
            })}
            {(["marrabenta", "afrobeat", "bossa", "jazz", "folk", "funk", "house", "gospel"] as TrackFlavor[]).map((f) => {
              const count = ALL_ALBUMS.reduce(
                (s, a) => s + a.tracks.filter((t) => t.flavor === f).length,
                0
              );
              return count > 0 ? (
                <span key={f} className={`rounded-full px-3 py-1 text-xs ${FLAVOR_LABELS[f].color}`}>
                  {FLAVOR_LABELS[f].emoji} {count} {FLAVOR_LABELS[f].label.toLowerCase()}
                </span>
              ) : null;
            })}
            <button
              onClick={() => {
                const exportData = ALL_ALBUMS.map(a => ({
                  album: a.title,
                  slug: a.slug,
                  product: a.product,
                  tracks: a.tracks.map(t => {
                    const key = trackKey(a.slug, t.number);
                    return {
                      number: t.number,
                      title: editedTitles[key] || t.title,
                      prompt: editedPrompts[key] || t.prompt,
                      style: editedStyles[key] || null,
                      flavor: editedFlavors[key] || t.flavor,
                      energy: t.energy,
                      lyrics: editedLyrics[key] || t.lyrics || null,
                      promptVersions: promptVersions[key] || [],
                      generationHistory: generationHistory[key] || [],
                      audioVersions: (trackVersions[key] || []).map(v => ({
                        ...v,
                        rating: versionRatings[`${key}-${v.name}`] || null,
                      })),
                    };
                  }),
                }));
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `prompts-backup-${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="rounded-full bg-mundo-muted-dark/10 px-3 py-1 text-xs text-mundo-dourado hover:bg-mundo-dourado/20 transition cursor-pointer"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {/* Filter + View Mode */}
        <div className="mb-6 space-y-4">
          <ProductFilter active={filter} onChange={setFilter} />
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-2 sm:flex-wrap sm:overflow-x-visible sm:mx-0 sm:px-0 sm:pb-0">
            {/* Suno model selector */}
            <div className="shrink-0 flex items-center gap-2">
              <label className="text-[10px] uppercase tracking-wider text-mundo-muted">Modelo</label>
              <select
                value={sunoModel}
                onChange={(e) => setSunoModel(e.target.value)}
                className="rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-3 py-1.5 text-xs text-mundo-creme focus:border-violet-500 focus:outline-none"
              >
                <option value="V5_5">Suno V5.5</option>
                <option value="V5">Suno V5</option>
                <option value="V4_5">Suno V4.5</option>
                <option value="V4">Suno V4</option>
                <option value="V3_5">Suno V3.5</option>
              </select>
            </div>

            {/* Persona selector */}
            <div className="shrink-0 flex items-center gap-2">
              <label className="text-[10px] uppercase tracking-wider text-mundo-muted">Persona</label>
              <input
                type="text"
                value={personaId}
                onChange={(e) => setPersonaId(e.target.value)}
                placeholder="Sem persona"
                className="rounded-lg border border-mundo-muted-dark/30 bg-mundo-bg px-3 py-1.5 text-xs text-mundo-creme focus:border-violet-500 focus:outline-none w-32"
              />
              {personaId && (
                <button
                  onClick={() => { setPersonaId(""); setPersonaName(""); }}
                  className="text-[10px] text-red-400 hover:text-red-300"
                >
                  Limpar
                </button>
              )}
              {personaName && (
                <span className="text-[10px] text-green-400">{personaName}</span>
              )}
              {creatingPersona && (
                <span className="text-[10px] text-amber-400 animate-pulse">A criar persona...</span>
              )}
              {personaResult && (
                <span className="text-[10px] text-amber-300">{personaResult}</span>
              )}
            </div>

            {/* Cleanup button */}
            {/* Rename folder button */}
            <button
              onClick={async () => {
                const from = prompt("Pasta de origem (ex: albums/cosmic-romance):");
                if (!from) return;
                const to = prompt("Pasta destino (ex: albums/romance-pele):");
                if (!to) return;
                if (!confirm(`Renomear "${from}" → "${to}"? Isto move todos os ficheiros.`)) return;
                try {
                  const res = await adminFetch("/api/admin/rename-folder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ from, to }),
                  });
                  const data = await res.json();
                  if (data.ok) {
                    alert(`Renomeado! ${data.results?.length || 0} ficheiros movidos.\n${(data.results || []).join("\n")}`);
                  } else {
                    alert(`Erro: ${data.erro || "Falhou"}`);
                  }
                } catch (e) {
                  alert(`Erro: ${e}`);
                }
              }}
              className="shrink-0 whitespace-nowrap rounded-lg bg-amber-900/30 px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-900/50 transition"
            >
              Renomear pasta
            </button>

            <Link
              href="/admin/shorts"
              className="shrink-0 whitespace-nowrap rounded-lg bg-violet-900/30 px-4 py-2.5 text-xs min-h-[44px] text-violet-400 hover:bg-violet-900/50 transition flex items-center"
            >
              Shorts
            </Link>

            <Link
              href="/admin/calendario"
              className="shrink-0 whitespace-nowrap rounded-lg bg-blue-900/30 px-4 py-2.5 text-xs min-h-[44px] text-blue-400 hover:bg-blue-900/50 transition flex items-center"
            >
              Calendario
            </Link>

            <Link
              href="/admin/lancamentos"
              className="shrink-0 whitespace-nowrap rounded-lg bg-purple-900/30 px-4 py-2.5 text-xs min-h-[44px] text-purple-400 hover:bg-purple-900/50 transition flex items-center"
            >
              Lançamentos
            </Link>

            <Link
              href="/admin/fotos"
              className="shrink-0 whitespace-nowrap rounded-lg bg-pink-900/30 px-4 py-2.5 text-xs min-h-[44px] text-pink-400 hover:bg-pink-900/50 transition flex items-center"
            >
              Gerar Fotos
            </Link>

            <button
              onClick={async () => {
                const title = prompt("Titulo da notificacao:", "Nova musica");
                if (!title) return;
                const body = prompt("Mensagem:", "Loranne lancou musica nova. Vem ouvir.");
                if (!body) return;
                const url = prompt("Link (ex: /album/espelho-ilusao):", "/");
                const res = await adminFetch("/api/admin/push-notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title, body, url: url || "/" }),
                });
                const data = await res.json();
                if (data.ok) alert(`Enviado a ${data.sent} subscritores (${data.failed} falharam)`);
                else alert(data.erro || "Erro");
              }}
              className="shrink-0 whitespace-nowrap rounded-lg bg-blue-900/30 px-4 py-2.5 text-xs text-blue-400 hover:bg-blue-900/50 transition"
            >
              Push notificacao
            </button>

            {/* LoRA Training */}
            <Link
              href="/admin/lora"
              className="shrink-0 whitespace-nowrap rounded-lg bg-fuchsia-900/30 px-4 py-2.5 text-xs text-fuchsia-400 hover:bg-fuchsia-900/50 transition flex items-center min-h-[44px]"
            >
              Treinar LoRA Loranne
            </Link>

            <div className="shrink-0 flex gap-1 rounded-full bg-mundo-muted-dark/10 p-1">
              <button
                onClick={() => setViewMode("producao")}
                className={`rounded-full px-4 py-2 text-xs font-sans uppercase tracking-wider transition-colors ${
                  viewMode === "producao"
                    ? "bg-mundo-bg text-mundo-creme shadow-sm"
                    : "text-mundo-muted hover:text-mundo-creme"
                }`}
              >
                Produção
              </button>
              <button
                onClick={() => setViewMode("letras")}
                className={`rounded-full px-4 py-2 text-xs font-sans uppercase tracking-wider transition-colors ${
                  viewMode === "letras"
                    ? "bg-mundo-bg text-mundo-creme shadow-sm"
                    : "text-mundo-muted hover:text-mundo-creme"
                }`}
              >
                Letras
              </button>
            </div>
          </div>
        </div>

        {/* Lyrics view */}
        {viewMode === "letras" && (
          <div className="space-y-8">
            <div className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-6">
              <p className="text-sm text-mundo-muted">
                Revisa todas as letras antes de gastar créditos.
              </p>
            </div>
            {albums.map((a) => (
              <div key={a.slug} className="rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light overflow-hidden">
                <div className="border-b border-mundo-muted-dark/20 p-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ background: a.color }} />
                  <h3 className="font-display text-lg text-mundo-creme">{a.title}</h3>
                  <span className="rounded bg-mundo-muted-dark/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-mundo-muted">
                    {a.product}
                  </span>
                  <span className="text-xs text-green-400 ml-auto">
                    {a.tracks.filter(t => t.lyrics).length}/{a.tracks.length} letras
                  </span>
                </div>
                <div className="divide-y divide-mundo-muted-dark/10">
                  {a.tracks.map((t) => (
                    <div key={t.number} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-mundo-muted/50">{String(t.number).padStart(2, "0")}</span>
                        <span className="font-medium text-mundo-creme">{t.title}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${t.lang === "PT" ? "bg-mundo-muted-dark/15 text-mundo-muted" : "bg-violet-900/30 text-violet-400"}`}>{t.lang}</span>
                        {t.energy && (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${ENERGY_LABELS[t.energy].color}`}>
                            {ENERGY_LABELS[t.energy].emoji} {ENERGY_LABELS[t.energy].label}
                          </span>
                        )}
                        {t.flavor && t.flavor !== "organic" && (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${FLAVOR_LABELS[t.flavor].color}`}>
                            {FLAVOR_LABELS[t.flavor].emoji} {FLAVOR_LABELS[t.flavor].label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-mundo-muted/60 mb-2">{t.description}</p>
                      {t.lyrics ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CopyButton text={t.lyrics} label="Copiar letra" />
                            <CopyButton text={t.prompt} label="Copiar prompt" />
                          </div>
                          <pre className="whitespace-pre-wrap rounded bg-mundo-bg/50 p-4 font-mono text-xs text-mundo-muted/80 leading-relaxed max-h-80 overflow-y-auto">
                            {t.lyrics}
                          </pre>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <p className="text-xs text-mundo-muted/40 italic">Letra ainda não escrita.</p>
                          <CopyButton text={t.prompt} label="Copiar prompt" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Album detail */}
        {viewMode === "producao" && album && (
          <div>
            <button
              onClick={() => setSelectedAlbum(null)}
              className="mb-6 text-sm text-mundo-muted hover:text-mundo-creme"
            >
              ← Voltar aos albums
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ background: album.color }} />
                <h2 className="font-display text-2xl text-mundo-creme">{album.title}</h2>
              </div>
              <p className="mt-1 text-mundo-muted">{album.subtitle}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="rounded bg-mundo-muted-dark/10 px-2 py-0.5 text-xs text-mundo-muted">
                  {album.product}{album.veu ? ` — Véu ${album.veu}` : ""}
                </span>
                <span className="text-xs text-mundo-muted/60">
                  {album.tracks.length} faixas · {Math.floor(album.tracks.reduce((s, t) => s + t.durationSeconds, 0) / 60)} min
                </span>
                {(() => {
                  const albumDone = album.tracks.filter(t => statuses[trackKey(album.slug, t.number)] === "done").length;
                  const albumVer = album.tracks.reduce((s, t) => s + (trackVersions[trackKey(album.slug, t.number)]?.length || 0), 0);
                  return (
                    <>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${albumDone === album.tracks.length ? "bg-green-900/30 text-green-400" : albumDone > 0 ? "bg-mundo-dourado/20 text-mundo-dourado" : "bg-mundo-muted-dark/10 text-mundo-muted/50"}`}>
                        {albumDone}/{album.tracks.length} com audio
                      </span>
                      {albumVer > 0 && (
                        <span className="rounded bg-violet-900/30 px-2 py-0.5 text-xs text-violet-400">
                          {albumVer} versoes
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Download for DistroKid */}
              <button
                id={`distro-btn-${album.slug}`}
                onClick={async () => {
                  const btn = document.getElementById(`distro-btn-${album.slug}`) as HTMLButtonElement;
                  btn.disabled = true;
                  try {
                    const { downloadAlbumForDistribution } = await import("@/lib/album-download");
                    // Fetch custom titles
                    let titleMap: Record<string, string> = {};
                    try {
                      const titlesRes = await fetch("/api/music/titles");
                      const titlesData = await titlesRes.json();
                      titleMap = titlesData.titles || {};
                    } catch {}
                    const getTitle = (slug: string, num: number, fallback: string) => titleMap[`${slug}-t${num}`] || fallback;
                    const coverTrack = prompt(`Capa do album — qual faixa? (1-${album.tracks.length})`, "1");
                    const coverTrackNum = coverTrack ? parseInt(coverTrack, 10) : 1;
                    await downloadAlbumForDistribution(album, (p) => {
                      btn.textContent = `${p.phase} (${p.current}/${p.total})`;
                    }, getTitle, coverTrackNum);
                    btn.textContent = "ZIP pronto!";
                  } catch (e) {
                    btn.textContent = "Erro";
                    alert(String(e));
                  }
                  setTimeout(() => { btn.disabled = false; btn.textContent = "DistroKid ZIP"; }, 3000);
                }}
                className="mt-3 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800 transition"
              >
                DistroKid ZIP
              </button>

              <button
                id={`carousel-btn-${album.slug}`}
                onClick={async () => {
                  const btn = document.getElementById(`carousel-btn-${album.slug}`) as HTMLButtonElement;
                  btn.disabled = true;
                  try {
                    const { generateCarousel } = await import("@/lib/carousel-generator");
                    const { getAlbumCover, getTrackCoverUrl } = await import("@/lib/album-covers");
                    let coverSrc = getAlbumCover(album);
                    try {
                      const coverTrackNum = getCoverTrack(album.slug);
                      const probe = await fetch(getTrackCoverUrl(album.slug, coverTrackNum), { method: "HEAD" });
                      if (probe.ok) coverSrc = getTrackCoverUrl(album.slug, coverTrackNum);
                    } catch {}
                    let titleMap: Record<string, string> = {};
                    try {
                      const r = await fetch("/api/music/titles");
                      titleMap = (await r.json()).titles || {};
                    } catch {}
                    const getTitle = (s: string, n: number, f: string) => titleMap[`${s}-t${n}`] || f;
                    await generateCarousel(album, coverSrc, (msg) => { btn.textContent = msg; }, getTitle);
                    btn.textContent = "Pronto!";
                  } catch (e) {
                    btn.textContent = "Erro";
                    alert(String(e));
                  }
                  setTimeout(() => { btn.disabled = false; btn.textContent = "Carrossel IG"; }, 3000);
                }}
                className="mt-3 rounded-lg bg-pink-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-800 transition"
              >
                Carrossel IG
              </button>

              <button
                onClick={() => {
                  const lines: string[] = [];
                  lines.push(`# ${album.title}`);
                  lines.push(`**${album.subtitle}**`);
                  lines.push(`*Loranne — Véus*`);
                  lines.push("");
                  lines.push("---");
                  lines.push("");
                  for (const t of album.tracks) {
                    const key = trackKey(album.slug, t.number);
                    const title = editedTitles[key] || t.title;
                    const lyrics = editedLyrics[key] || t.lyrics;
                    lines.push(`## ${String(t.number).padStart(2, "0")}. ${title}`);
                    lines.push(`*${t.description}*`);
                    lines.push(`Energia: ${t.energy} | Língua: ${t.lang}${t.flavor ? ` | Sabor: ${t.flavor}` : ""}`);
                    lines.push("");
                    if (lyrics) {
                      lines.push(lyrics);
                    } else {
                      lines.push("*(letra em falta)*");
                    }
                    lines.push("");
                    lines.push("---");
                    lines.push("");
                  }
                  const md = lines.join("\n");
                  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `${album.slug}-letras.md`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
                className="mt-3 rounded-lg bg-amber-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-800 transition"
              >
                Exportar Letras (.md)
              </button>

              <button
                id={`import-lyrics-btn-${album.slug}`}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".md,.txt";
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    const btn = document.getElementById(`import-lyrics-btn-${album.slug}`) as HTMLButtonElement;
                    btn.textContent = "A importar...";
                    btn.disabled = true;
                    try {
                      const text = await file.text();
                      // Parse: split by "## XX. Title" headers
                      const sections = text.split(/^## \d{2}\.\s+/m).slice(1);
                      let imported = 0;
                      for (const section of sections) {
                        const lines = section.split("\n");
                        // Skip: title line, italic description, metadata line, empty line
                        // Find lyrics: everything after the metadata line and first empty line
                        let lyricsStart = -1;
                        for (let i = 0; i < lines.length; i++) {
                          if (i >= 2 && lines[i].trim() === "" && lyricsStart === -1) {
                            lyricsStart = i + 1;
                            break;
                          }
                        }
                        if (lyricsStart === -1) continue;
                        // Collect lyrics until "---" separator
                        const lyricLines: string[] = [];
                        for (let i = lyricsStart; i < lines.length; i++) {
                          if (lines[i].trim() === "---") break;
                          lyricLines.push(lines[i]);
                        }
                        const lyrics = lyricLines.join("\n").trim();
                        if (!lyrics || lyrics === "*(letra em falta)*") continue;
                        // Match track number from position in album
                        const trackNum = imported + 1;
                        if (trackNum > album.tracks.length) break;
                        const key = trackKey(album.slug, trackNum);
                        // Update local state
                        setEditedLyrics((l) => ({ ...l, [key]: lyrics }));
                        // Save to DB
                        await adminFetch("/api/admin/track-lyrics", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ album_slug: album.slug, track_number: trackNum, lyrics }),
                        }).catch(() => {});
                        imported++;
                      }
                      btn.textContent = `${imported} letras importadas!`;
                    } catch (e) {
                      btn.textContent = "Erro";
                      alert(String(e));
                    }
                    setTimeout(() => { btn.disabled = false; btn.textContent = "Importar Letras (.md)"; }, 3000);
                  };
                  input.click();
                }}
                className="mt-3 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition"
              >
                Importar Letras (.md)
              </button>
            </div>

            {/* Batch clean/suggest prompts for all tracks */}
            <div className="mb-4 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => {
                  const newPrompts: Record<string, string> = {};
                  let cleaned = 0;
                  for (const t of album.tracks) {
                    const key = trackKey(album.slug, t.number);
                    const prompt = cleanPrompt(t.prompt, t.flavor || null);
                    if (prompt !== t.prompt) cleaned++;
                    newPrompts[key] = prompt;
                  }
                  setEditedPrompts((p) => ({ ...p, ...newPrompts }));
                  alert(`${cleaned} prompt(s) limpos (redundância de flavor removida). ${album.tracks.length - cleaned} já estavam limpos.`);
                }}
                className="rounded-lg bg-mundo-dourado/20 px-4 py-2 text-xs text-mundo-dourado hover:bg-mundo-dourado/30 transition"
              >
                Limpar prompts ({album.tracks.length} faixas)
              </button>
              <button
                onClick={() => {
                  const keysToRemove = album.tracks.map(t => trackKey(album.slug, t.number));
                  setEditedPrompts((p) => {
                    const copy = { ...p };
                    for (const k of keysToRemove) delete copy[k];
                    return copy;
                  });
                  alert("Prompts repostos ao original.");
                }}
                className="rounded-lg bg-mundo-muted-dark/20 px-4 py-2 text-xs text-mundo-muted hover:text-mundo-creme transition"
              >
                Repor originais
              </button>
              <span className="text-[10px] text-mundo-muted/40">Gera prompts limpos sem redundância de flavor</span>
            </div>

            {/* Bulk generate button */}
            {(() => {
              const pendingTracks = album.tracks.filter(t => {
                const k = trackKey(album.slug, t.number);
                const hasAudio = audioUrls[k] || t.audioUrl;
                const isBusy = statuses[k] === "generating" || statuses[k] === "polling";
                return !hasAudio && !isBusy && (editedLyrics[k] || t.lyrics);
              });
              const busyCount = album.tracks.filter(t => {
                const k = trackKey(album.slug, t.number);
                return statuses[k] === "generating" || statuses[k] === "polling";
              }).length;
              return pendingTracks.length > 0 ? (
                <div className="mb-4 flex items-center gap-3">
                  <button
                    onClick={() => {
                      // Generate tracks sequentially with 2s delay between each
                      pendingTracks.forEach((track, i) => {
                        setTimeout(() => generateTrack(album.slug, track), i * 2000);
                      });
                    }}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-xs text-white transition hover:bg-violet-700"
                  >
                    Gerar todas ({pendingTracks.length} faixas)
                  </button>
                  {busyCount > 0 && (
                    <span className="text-xs text-amber-400">{busyCount} em geração...</span>
                  )}
                </div>
              ) : busyCount > 0 ? (
                <div className="mb-4">
                  <span className="text-xs text-amber-400">{busyCount} faixa(s) em geração...</span>
                </div>
              ) : null;
            })()}

            {/* Bulk approve — approve selected clips for all tracks */}
            {(() => {
              const readyTracks = album.tracks.filter(t => {
                const k = trackKey(album.slug, t.number);
                const clips = generatedClips[k]?.clips || [];
                return clips.some(c => c.audioUrl);
              });
              if (readyTracks.length === 0) return null;
              return (
                <div className="mb-4 flex items-center gap-3">
                  <button
                    onClick={async () => {
                      const btn = document.getElementById(`bulk-approve-${album.slug}`) as HTMLButtonElement;
                      if (btn) { btn.disabled = true; btn.textContent = "A aprovar..."; }
                      let done = 0;
                      for (const t of readyTracks) {
                        const k = trackKey(album.slug, t.number);
                        const clips = generatedClips[k]?.clips || [];
                        const idx = selectedClipIdx[k] ?? 0;
                        const clip = clips[idx] || clips[0];
                        if (clip?.audioUrl) {
                          await approveClip(album.slug, t, clip.audioUrl, clip.title, clip.imageUrl || null);
                          done++;
                          if (btn) btn.textContent = `A aprovar... ${done}/${readyTracks.length}`;
                        }
                      }
                      if (btn) { btn.textContent = `${done} aprovadas!`; btn.disabled = false; }
                      setTimeout(() => { if (btn) btn.textContent = `Aprovar todas (${readyTracks.length})`; }, 3000);
                    }}
                    id={`bulk-approve-${album.slug}`}
                    className="rounded-lg bg-green-600 px-4 py-2 text-xs text-white transition hover:bg-green-700"
                  >
                    Aprovar todas ({readyTracks.length} faixas)
                  </button>
                  <span className="text-[10px] text-mundo-muted">Clica no clip que preferes em cada faixa antes de aprovar</span>
                </div>
              );
            })()}

            {/* Album reel + bulk reel generation */}
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              {(["status", "insta"] as const).map((reelType) => (
                <button
                  key={`album-${reelType}`}
                  id={`album-reel-${reelType}-${album.slug}`}
                  onClick={async () => {
                    const btn = document.getElementById(`album-reel-${reelType}-${album.slug}`) as HTMLButtonElement;
                    if (!btn) return;
                    btn.disabled = true;
                    btn.textContent = "A preparar...";

                    try {
                      const { generateAlbumReel, REEL_SIZE_STATUS, REEL_SIZE_INSTA } = await import("@/lib/reel-generator");
                      const { getAlbumCover } = await import("@/lib/album-covers");
                      const reelSize = reelType === "insta" ? REEL_SIZE_INSTA : REEL_SIZE_STATUS;
                      const alb = ALL_ALBUMS.find(a => a.slug === album.slug);
                      if (!alb) { btn.disabled = false; btn.textContent = "Erro"; return; }

                      const coverSrc = getAlbumCover(alb);
                      const tracksWithAudio = alb.tracks.filter(t => audioUrls[trackKey(album.slug, t.number)] || t.audioUrl);
                      const audioSources = tracksWithAudio.map(t => ({
                        track: t,
                        src: `/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${t.number}`,
                      }));

                      if (audioSources.length === 0) {
                        btn.textContent = "Sem audio";
                        btn.disabled = false;
                        setTimeout(() => { btn.textContent = reelType === "status" ? "Reel Album Status" : "Reel Album Insta"; }, 3000);
                        return;
                      }

                      const blob = await generateAlbumReel(alb, tracksWithAudio, coverSrc, audioSources, (p) => {
                        btn.textContent = p.message;
                      }, reelSize);

                      await uploadReelDirect(blob, album.slug, 0);
                      btn.textContent = "Reel album pronto!";

                      // Show result
                      const container = document.getElementById(`album-reel-result-${album.slug}`);
                      if (container) {
                        container.innerHTML = "";
                        const vid = document.createElement("video");
                        vid.src = URL.createObjectURL(blob);
                        vid.controls = true;
                        vid.playsInline = true;
                        vid.muted = true;
                        vid.style.maxWidth = "240px";
                        vid.style.borderRadius = "12px";
                        vid.style.marginTop = "8px";
                        container.appendChild(vid);
                      }
                    } catch (e) {
                      btn.textContent = `Erro: ${(e as Error).message.slice(0, 40)}`;
                    }
                    btn.disabled = false;
                    setTimeout(() => { btn.textContent = reelType === "status" ? "Reel Album Status" : "Reel Album Insta"; }, 5000);
                  }}
                  className="rounded-lg bg-emerald-900/30 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-900/50 transition"
                >
                  {reelType === "status" ? "Reel Album Status" : "Reel Album Insta"}
                </button>
              ))}
              <span className="text-[10px] text-mundo-muted">Gera reel de apresentacao do album</span>
            </div>
            <div id={`album-reel-result-${album.slug}`}></div>

            <div className="space-y-3">
              {album.tracks.map((track) => {
                const key = trackKey(album.slug, track.number);
                return (
                  <TrackRow
                    key={track.number}
                    track={track}
                    albumSlug={album.slug}
                    status={statuses[key] || "idle"}
                    error={errors[key] || null}
                    audioUrl={audioUrls[key] || track.audioUrl || null}
                    onUpload={(file) => uploadTrack(album.slug, track, file)}
                    onRemove={() => removeTrack(album.slug, track.number)}
                    onGenerate={() => generateTrack(album.slug, track)}
                    onCancel={() => {
                      const k = trackKey(album.slug, track.number);
                      if (pollingRef.current[k]) {
                        clearInterval(pollingRef.current[k]);
                        delete pollingRef.current[k];
                      }
                      setStatuses((s) => ({ ...s, [k]: "idle" }));
                      setErrors((e) => ({ ...e, [k]: "" }));
                      setGeneratedClips((g) => { const c = { ...g }; delete c[k]; return c; });
                    }}
                    onApproveClip={(url, title, imgUrl) => approveClip(album.slug, track, url, title, imgUrl)}
                    onApproveAsVersion={(url, title, name, energy) => approveAsVersion(album.slug, track, url, title, name, energy)}
                    onUploadVersion={(file, name, energy, coverFile) => uploadVersion(album.slug, track, file, name, energy, coverFile)}
                    onCreatePersona={async (taskId, audioId) => {
                      const pName = window.prompt("Nome da persona (ex: Loranne Whisper):");
                      if (!pName) return;
                      setCreatingPersona(true);
                      setPersonaResult(null);
                      try {
                        const res = await adminFetch("/api/admin/suno/persona", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ taskId, audioId, name: pName, description: `Persona vocal da Loranne — ${pName}` }),
                        });
                        const data = await res.json();
                        if (data.personaId) {
                          setPersonaId(data.personaId);
                          setPersonaName(data.name || pName);
                          setPersonaResult(`Persona criada: ${data.personaId}`);
                        } else {
                          setPersonaResult(`Erro: ${data.error || "Sem personaId"}`);
                        }
                      } catch (e: unknown) {
                        setPersonaResult(`Erro: ${e instanceof Error ? e.message : "desconhecido"}`);
                      } finally {
                        setCreatingPersona(false);
                      }
                    }}
                    existingVersions={trackVersions[key] || []}
                    generatedClips={generatedClips[key] || null}
                    selectedClipIndex={selectedClipIdx[key] ?? 0}
                    onSelectClip={(idx) => setSelectedClipIdx(s => ({ ...s, [key]: idx }))}
                    editedTitle={editedTitles[key] || null}
                    onTitleChange={(title) => {
                      setEditedTitles((t) => ({ ...t, [key]: title }));
                      if (titleSaveRef.current[key]) clearTimeout(titleSaveRef.current[key]);
                      titleSaveRef.current[key] = setTimeout(() => {
                        if (title && title !== track.title) {
                          saveTitle(album.slug, track.number, title, "manual");
                        }
                      }, 1000);
                    }}
                    editedLyrics={editedLyrics[key] || null}
                    onLyricsChange={(lyrics) => {
                      setEditedLyrics((l) => ({ ...l, [key]: lyrics }));
                      // Debounce save to DB (2s after last keystroke)
                      if (lyricsSaveRef.current[key]) clearTimeout(lyricsSaveRef.current[key]);
                      lyricsSaveRef.current[key] = setTimeout(() => {
                        const match = key.match(/^(.+)-t(\d+)$/);
                        if (match) {
                          adminFetch("/api/admin/track-lyrics", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ album_slug: match[1], track_number: parseInt(match[2]), lyrics }),
                          }).catch(() => {});
                        }
                      }, 2000);
                    }}
                    editedStyle={editedStyles[key] || null}
                    onStyleChange={(style) => setEditedStyles((s) => ({ ...s, [key]: style }))}
                    editedFlavor={editedFlavors[key] || null}
                    onFlavorChange={(flavor) => setEditedFlavors((f) => ({ ...f, [key]: flavor }))}
                    isAlbumCover={getCoverTrack(album.slug) === track.number}
                    onSetAlbumCover={async () => {
                      const ok = await setCoverTrack(album.slug, track.number);
                      if (ok) alert(`Capa do álbum → faixa ${track.number}`);
                    }}
                    editedPrompt={editedPrompts[key] || null}
                    onPromptChange={(prompt) => setEditedPrompts((p) => ({ ...p, [key]: prompt }))}
                    promptVersions={promptVersions[key] || []}
                    onSavePromptVersion={(label) => {
                      const version: PromptVersion = {
                        id: `pv-${Date.now()}`,
                        label,
                        prompt: editedPrompts[key] || track.prompt,
                        style: editedStyles[key] || "",
                        flavor: editedFlavors[key] || track.flavor || "",
                        createdAt: new Date().toISOString(),
                      };
                      setPromptVersions((pv) => ({ ...pv, [key]: [...(pv[key] || []), version] }));
                    }}
                    onLoadPromptVersion={(version) => {
                      setEditedPrompts((p) => ({ ...p, [key]: version.prompt }));
                      if (version.style) setEditedStyles((s) => ({ ...s, [key]: version.style }));
                      if (version.flavor) setEditedFlavors((f) => ({ ...f, [key]: version.flavor as TrackFlavor }));
                    }}
                    generationHistory={generationHistory[key] || []}
                    versionRatings={versionRatings}
                    onRateVersion={(versionKey, rating) => {
                      setVersionRatings((r) => {
                        if (r[versionKey] === rating) {
                          const copy = { ...r };
                          delete copy[versionKey];
                          return copy;
                        }
                        return { ...r, [versionKey]: rating };
                      });
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Album grid */}
        {viewMode === "producao" && !album && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((a) => {
              const done = a.tracks.filter(
                (t) => statuses[trackKey(a.slug, t.number)] === "done"
              ).length;
              const withLyrics = a.tracks.filter((t) => t.lyrics).length;
              const albumVersions = a.tracks.reduce(
                (s, t) => s + (trackVersions[trackKey(a.slug, t.number)]?.length || 0),
                0
              );
              const totalMin = Math.floor(
                a.tracks.reduce((s, t) => s + t.durationSeconds, 0) / 60
              );

              return (
                <button
                  key={a.slug}
                  onClick={() => setSelectedAlbum(a.slug)}
                  className="group rounded-xl border border-mundo-muted-dark/30 bg-mundo-bg-light p-5 text-left transition hover:border-mundo-muted-dark/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-2.5 w-2.5 rounded-full mt-1" style={{ background: a.color }} />
                    <span className="rounded bg-mundo-muted-dark/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-mundo-muted">
                      {a.product}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg text-mundo-creme group-hover:text-mundo-dourado transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-mundo-muted line-clamp-1">{a.subtitle}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-mundo-muted/60">
                      {a.tracks.length} faixas · ~{totalMin} min
                    </span>
                    <div className="flex items-center gap-2">
                      {withLyrics > 0 && (
                        <span className="text-[10px] text-green-400">{withLyrics} letras</span>
                      )}
                      {albumVersions > 0 && (
                        <span className="text-[10px] text-violet-400">{albumVersions} v.</span>
                      )}
                      <span className={`text-xs font-medium ${done === a.tracks.length ? "text-green-400" : done > 0 ? "text-mundo-dourado" : "text-mundo-muted/40"}`}>
                        {done}/{a.tracks.length} audio
                      </span>
                    </div>
                  </div>
                  {(done > 0 || withLyrics > 0) && (
                    <div className="mt-2 h-1 rounded-full bg-mundo-muted-dark/10">
                      <div
                        className="h-1 rounded-full bg-mundo-dourado transition-all"
                        style={{ width: `${(Math.max(done, withLyrics) / a.tracks.length) * 100}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
