"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useMusicPlayer, formatTime } from "@/contexts/MusicPlayerContext";
import { useCustomTitles } from "@/hooks/useCustomTitles";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";

export default function MiniPlayer() {
  const {
    currentTrack,
    currentAlbum,
    queue,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    audioError,
    previewExpired,
    togglePlay,
    next,
    previous,
    setShowFullPlayer,
    clearAudioError,
    stop,
  } = useMusicPlayer();

  // Track-specific cover (Suno artwork)
  const [trackCover, setTrackCover] = useState<string | null>(null);
  useEffect(() => {
    if (!currentAlbum || !currentTrack) { setTrackCover(null); return; }
    const url = getTrackCoverUrl(currentAlbum.slug, currentTrack.number);
    const img = new window.Image();
    img.onload = () => setTrackCover(url);
    img.onerror = () => setTrackCover(null);
    img.src = url;
  }, [currentAlbum?.slug, currentTrack?.number]);

  const { getTitle } = useCustomTitles();

  if (!currentTrack) return null;

  const displayTitle = getTitle(currentAlbum?.slug || "", currentTrack.number, currentTrack.title);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const albumColor = currentAlbum?.color || "#C9A96E";
  const coverSrc = trackCover || (currentAlbum ? getAlbumCover(currentAlbum) : "/poses/loranne-hero.png");

  // Find next track in queue
  const currentIdx = queue.findIndex(t => {
    if (t.number !== currentTrack.number) return false;
    const tSlug = (t as { albumSlug?: string }).albumSlug;
    if (tSlug && currentAlbum) return tSlug === currentAlbum.slug;
    return true;
  });
  const nextTrack = !shuffle && currentIdx >= 0 && currentIdx < queue.length - 1
    ? queue[currentIdx + 1]
    : null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} role="region" aria-label="Mini player">
      {/* Preview expired — CTA to register */}
      {previewExpired && (
        <div className="bg-[#C9A96E]/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-[#0D0D1A] font-medium">Cria conta gratis para ouvir sem limites</p>
          <a href="/registar" className="ml-3 px-4 py-1.5 rounded-full bg-[#0D0D1A] text-[#C9A96E] text-xs font-semibold shrink-0">
            Registar
          </a>
        </div>
      )}
      {/* Audio error toast */}
      {audioError && (
        <div className="bg-red-900/90 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between">
          <p className="text-xs text-red-200">{audioError}</p>
          <button onClick={clearAudioError} className="ml-3 text-red-300 hover:text-white text-xs shrink-0">
            Fechar
          </button>
        </div>
      )}
      {/* Progress bar */}
      <div className="h-0.5 bg-white/10">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: albumColor }}
        />
      </div>

      <div className="bg-[#1A1A2E]/95 backdrop-blur-xl border-t border-white/5 cursor-pointer" onClick={() => setShowFullPlayer(true)}>
        <div className="mx-auto max-w-screen-lg px-4 py-3 flex items-center gap-3">
          {/* Album art thumbnail — uses track cover if available */}
          <div className="h-11 w-11 shrink-0 rounded-lg shadow-lg overflow-hidden relative">
            <Image
              src={coverSrc}
              alt={displayTitle}
              fill
              sizes="44px"
              className="object-cover"
              unoptimized={!!trackCover}
            />
          </div>

          {/* Track info + next track */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-[#F5F0E6] truncate">
              {displayTitle}
            </p>
            {nextTrack ? (
              <p className="text-xs text-[#666680] truncate">
                A seguir: {nextTrack.title}
              </p>
            ) : (
              <p className="text-xs text-[#a0a0b0] truncate">
                {currentAlbum?.title || "Sete Veus"}
              </p>
            )}
          </div>

          {/* Controls — stopPropagation to not open FullPlayer */}
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={previous} className="p-2 text-[#a0a0b0] hover:text-[#F5F0E6] transition-colors min-h-[44px]" aria-label="Faixa anterior">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full text-[#0D0D1A] transition-transform hover:scale-105"
              style={{ backgroundColor: "#F5F0E6" }}
              aria-label={isPlaying ? "Pausar" : "Reproduzir"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button onClick={next} className="p-2 text-[#a0a0b0] hover:text-[#F5F0E6] transition-colors min-h-[44px]" aria-label="Próxima faixa">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Time */}
          <span className="hidden sm:block text-xs text-[#666680] tabular-nums w-20 text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); stop(); }}
            className="p-2 text-[#666680] hover:text-[#a0a0b0] transition-colors min-h-[44px]"
            aria-label="Fechar player"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
