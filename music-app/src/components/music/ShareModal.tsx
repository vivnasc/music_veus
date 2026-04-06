"use client";

import { useState, useRef, useEffect } from "react";
import type { Album, AlbumTrack } from "@/data/albums";
import { getShareUrl } from "@/lib/share-utils";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { generateShareCard, downloadBlob, shareImage } from "@/lib/share-card";

type Props = {
  track: AlbumTrack;
  album: Album;
  onClose: () => void;
};

function pickLyric(track: AlbumTrack): string | null {
  if (!track.lyrics) return null;
  const lines = track.lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 80 && !t.startsWith("[");
  });
  if (lines.length === 0) return null;
  const day = Math.floor(Date.now() / 86400000);
  return lines[day % lines.length].trim();
}

export default function ShareModal({ track, album, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [showTip, setShowTip] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [cardFormat, setCardFormat] = useState<"story" | "square">("story");
  const previewRef = useRef<string | null>(null);

  // Resolve best cover (track cover > album cover)
  const [resolvedCover, setResolvedCover] = useState<string>(getAlbumCover(album));
  useEffect(() => {
    const trackCover = getTrackCoverUrl(album.slug, track.number);
    const img = new Image();
    img.onload = () => setResolvedCover(trackCover);
    img.onerror = () => {}; // keep album cover
    img.src = trackCover;
  }, [album.slug, track.number]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  // ── Video hook (read-only — generated in production) ──
  const [hookVideoUrl, setHookVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/music/hook-video?album=${encodeURIComponent(album.slug)}&track=${track.number}`)
      .then(r => r.json())
      .then(data => {
        if (data.exists && data.videoUrl) setHookVideoUrl(data.videoUrl);
      })
      .catch(() => {});
  }, [album.slug, track.number]);

  const shareUrl = getShareUrl(album.slug, track.number);
  const lyric = pickLyric(track);
  const shareText = lyric
    ? `"${lyric}"\n— ${track.title}, Loranne`
    : `${track.title} — Loranne`;

  // Auto-generate story card on open
  useEffect(() => {
    generateCard("story");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCover]);

  async function generateCard(format: "story" | "square") {
    setGenerating(true);
    setCardFormat(format);
    try {
      const blob = await generateShareCard(track, album, resolvedCover, format);
      setCardBlob(blob);
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      const url = URL.createObjectURL(blob);
      previewRef.current = url;
      setPreviewUrl(url);
    } catch {
      setShowTip("Erro ao gerar imagem. Tenta de novo.");
      setTimeout(() => setShowTip(null), 3000);
    } finally {
      setGenerating(false);
    }
  }

  async function handleShareImage() {
    if (!cardBlob) return;
    const shared = await shareImage(cardBlob, track);
    if (!shared) {
      downloadBlob(cardBlob, `${track.title} — Loranne.png`);
    }
  }

  async function handleDownload() {
    if (!cardBlob) return;
    downloadBlob(cardBlob, `${track.title} — Loranne.png`);
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: track.title, text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    }
  }

  function shareWhatsApp() {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(url, "_blank");
  }

  function shareWhatsAppStatus() {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
      setShowTip("Texto copiado. Abre o WhatsApp → Status → Cola o texto.");
      setTimeout(() => setShowTip(null), 4000);
    }).catch(() => {});
  }

  function shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank");
  }

  function shareInstagram() {
    // Generate story card and prompt to save
    if (!cardBlob) {
      generateCard("story").then(() => {
        setShowTip("Imagem pronta. Guarda e abre no Instagram → Story.");
      });
    } else {
      downloadBlob(cardBlob, `${track.title} — Loranne.png`);
      setShowTip("Imagem guardada. Abre o Instagram → Story → Selecciona a imagem.");
      setTimeout(() => setShowTip(null), 4000);
    }
  }

  const hasNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-sm bg-[#1A1A2E] rounded-t-2xl sm:rounded-2xl p-6 border border-white/10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-semibold text-[#F5F0E6] mb-1">Partilhar</h3>
        <p className="text-sm text-[#a0a0b0] mb-2 truncate">{track.title} — {album.title}</p>
        {lyric && (
          <p className="text-xs italic text-[#666680] mb-4">&ldquo;{lyric}&rdquo;</p>
        )}

        {/* Tip message */}
        {showTip && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-green-900/20 border border-green-800/30">
            <p className="text-xs text-green-400">{showTip}</p>
          </div>
        )}

        {/* ─── VISUAL CARD SECTION ─── */}
        <div className="mb-5 rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <p className="text-xs text-[#a0a0b0] mb-3">Imagem para stories e posts</p>

          {/* Preview */}
          {previewUrl && (
            <div className="mb-3 flex justify-center">
              <img
                src={previewUrl}
                alt="Share card"
                className="rounded-lg shadow-lg"
                style={{
                  maxHeight: cardFormat === "story" ? 280 : 200,
                  width: "auto",
                }}
              />
            </div>
          )}

          {/* Format buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => generateCard("story")}
              disabled={generating}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                previewUrl && cardFormat === "story"
                  ? "bg-white/10 text-[#F5F0E6] border border-white/20"
                  : "bg-white/5 text-[#a0a0b0] hover:bg-white/10 border border-white/5"
              } disabled:opacity-50`}
            >
              {generating && cardFormat === "story" ? (
                <span className="animate-pulse">A gerar...</span>
              ) : (
                "Story (9:16)"
              )}
            </button>
            <button
              onClick={() => generateCard("square")}
              disabled={generating}
              className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-all ${
                previewUrl && cardFormat === "square"
                  ? "bg-white/10 text-[#F5F0E6] border border-white/20"
                  : "bg-white/5 text-[#a0a0b0] hover:bg-white/10 border border-white/5"
              } disabled:opacity-50`}
            >
              {generating && cardFormat === "square" ? (
                <span className="animate-pulse">A gerar...</span>
              ) : (
                "Post (1:1)"
              )}
            </button>
          </div>

          {/* Save/Share image buttons */}
          {cardBlob && (
            <div className="flex gap-2">
              <button
                onClick={handleShareImage}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all text-[#0D0D1A]"
                style={{ backgroundColor: album.color || "#C9A96E" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                Partilhar imagem
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium bg-white/5 text-[#a0a0b0] hover:bg-white/10 transition-colors border border-white/5"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Guardar
              </button>
            </div>
          )}
        </div>

        {/* ─── VIDEO HOOK (if exists) ─── */}
        {hookVideoUrl && (
          <div className="mb-5 rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <p className="text-xs text-[#a0a0b0] mb-3">Video hook</p>
            <video
              src={hookVideoUrl}
              className="w-full rounded-lg mb-3"
              style={{ maxHeight: 280 }}
              controls
              playsInline
              muted
              loop
            />
            <div className="flex gap-2">
              <a
                href={hookVideoUrl}
                download={`${track.title} — Loranne hook.mp4`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all text-[#0D0D1A]"
                style={{ backgroundColor: album.color || "#C9A96E" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Guardar video
              </a>
              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(hookVideoUrl);
                      const blob = await res.blob();
                      const file = new File([blob], `${track.title} — Loranne.mp4`, { type: "video/mp4" });
                      if (navigator.canShare?.({ files: [file] })) {
                        await navigator.share({ files: [file], title: track.title });
                      }
                    } catch { /* cancelled */ }
                  }}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium bg-white/5 text-[#a0a0b0] hover:bg-white/10 transition-colors border border-white/5"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                  </svg>
                  Partilhar
                </button>
              )}
            </div>
          </div>
        )}

        {/* ─── LINK SHARING ─── */}

        {/* Primary: Native Share */}
        {hasNativeShare && (
          <button
            onClick={nativeShare}
            className="w-full flex items-center justify-center gap-2 py-3.5 mb-4 rounded-xl text-sm font-medium transition-all text-[#0D0D1A]"
            style={{ backgroundColor: album.color || "#C9A96E" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
            Partilhar link
          </button>
        )}

        {/* Social options */}
        <div className={`grid ${hasNativeShare ? "grid-cols-5" : "grid-cols-4"} gap-2 mb-4`}>
          <button
            onClick={shareWhatsApp}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#25D366]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="text-[9px] text-[#a0a0b0]">Chat</span>
          </button>

          <button
            onClick={shareWhatsAppStatus}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" className="h-6 w-6">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <span className="text-[9px] text-[#a0a0b0]">Status</span>
          </button>

          <button
            onClick={shareInstagram}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <defs>
                <linearGradient id="ig-grad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFDC80" />
                  <stop offset="25%" stopColor="#F77737" />
                  <stop offset="50%" stopColor="#E1306C" />
                  <stop offset="75%" stopColor="#C13584" />
                  <stop offset="100%" stopColor="#833AB4" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
              <circle cx="12" cy="12" r="5" stroke="url(#ig-grad)" strokeWidth="2" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-grad)" />
            </svg>
            <span className="text-[9px] text-[#a0a0b0]">Story</span>
          </button>

          <button
            onClick={shareTwitter}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-[#F5F0E6]">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-[9px] text-[#a0a0b0]">X</span>
          </button>

          <button
            onClick={copyAll}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" className="h-6 w-6">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-[#a0a0b0]">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )}
            <span className="text-[9px] text-[#a0a0b0]">{copied ? "Feito" : "Copiar"}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm text-[#666680] hover:text-[#a0a0b0] transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
