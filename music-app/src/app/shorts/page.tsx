"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ALL_ALBUMS } from "@/data/albums";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import type { Album, AlbumTrack } from "@/data/albums";
import Link from "next/link";

type ShortItem = {
  track: AlbumTrack;
  album: Album;
};

// Build shorts from all tracks that have lyrics
function buildShorts(): ShortItem[] {
  const items: ShortItem[] = [];
  for (const album of ALL_ALBUMS) {
    for (const track of album.tracks) {
      if (track.lyrics && track.lyrics.trim().length > 0) {
        items.push({ track, album });
      }
    }
  }
  // Shuffle deterministically based on current hour (changes every hour)
  const seed = Math.floor(Date.now() / 3600000);
  return items.sort((a, b) => {
    const ha = hashCode(a.track.title + seed);
    const hb = hashCode(b.track.title + seed);
    return ha - hb;
  });
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

function getLyricSnippet(lyrics: string): string[] {
  const lines = lyrics.split("\n").filter(l => l.trim() && !l.startsWith("["));
  // Return 4–6 lines from the middle (usually the chorus)
  const mid = Math.floor(lines.length / 2);
  const start = Math.max(0, mid - 2);
  return lines.slice(start, start + 5);
}

export default function ShortsPage() {
  const shorts = buildShorts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay } = useMusicPlayer();

  const current = shorts[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, shorts.length - 1));
  }, [shorts.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowUp") { e.preventDefault(); goPrev(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Touch swipe
  const touchStartY = useRef(0);
  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50) goNext();
    if (diff < -50) goPrev();
  }

  if (!current) return null;

  const isCurrentPlaying = currentTrack?.title === current.track.title &&
    currentAlbum?.slug === current.album.slug;

  const snippet = getLyricSnippet(current.track.lyrics || "");

  return (
    <div className="fixed inset-0 z-40 bg-[#0D0D1A] flex flex-col">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <Link href="/" className="p-2 text-[#a0a0b0] hover:text-[#F5F0E6]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-display text-lg font-semibold text-[#C9A96E]">Shorts</h1>
        <span className="text-xs text-[#666680] tabular-nums">{currentIndex + 1}/{shorts.length}</span>
      </div>

      {/* Short card */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-6 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
          style={{
            background: `linear-gradient(180deg, ${current.album.color}40 0%, ${current.album.color}15 40%, #0D0D1A 100%)`,
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-30 blur-[80px] pointer-events-none"
            style={{ backgroundColor: current.album.color }}
          />

          {/* Album info top */}
          <div className="relative z-10 p-6 pt-8">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
                style={{ backgroundColor: current.album.color }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/40">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#F5F0E6]">{current.album.title}</p>
                <p className="text-xs text-[#a0a0b0]">Loranne</p>
              </div>
            </div>
          </div>

          {/* Lyrics snippet center */}
          <div className="relative z-10 flex-1 flex items-center justify-center px-8">
            <div className="space-y-3 text-center">
              {snippet.map((line, i) => (
                <p
                  key={i}
                  className="font-display text-xl sm:text-2xl leading-relaxed text-[#F5F0E6]/90"
                  style={{
                    opacity: i === Math.floor(snippet.length / 2) ? 1 : 0.6,
                    fontSize: i === Math.floor(snippet.length / 2) ? "1.5rem" : "1.15rem",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Track info + play bottom */}
          <div className="relative z-10 p-6 pb-8">
            <p className="font-display text-lg font-semibold text-[#F5F0E6] mb-1">
              {current.track.title}
            </p>
            <p className="text-sm text-[#a0a0b0] mb-4">{current.track.description}</p>

            <button
              onClick={() => {
                if (isCurrentPlaying) {
                  togglePlay();
                } else {
                  playTrack(current.track, current.album);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: current.album.color,
                color: "#0D0D1A",
              }}
            >
              {isCurrentPlaying && isPlaying ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  Pausar
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ouvir
                </>
              )}
            </button>
          </div>

          {/* Side actions */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
            <Link
              href={`/album/${current.album.slug}`}
              className="p-2 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 py-4">
        <button onClick={goPrev} disabled={currentIndex === 0} className="p-2 text-[#666680] hover:text-[#F5F0E6] disabled:opacity-30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div className="flex gap-1">
          {shorts.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, i) => {
            const idx = Math.max(0, currentIndex - 2) + i;
            return (
              <div
                key={idx}
                className={`rounded-full transition-all ${
                  idx === currentIndex ? "w-6 h-1.5" : "w-1.5 h-1.5"
                }`}
                style={{ backgroundColor: idx === currentIndex ? current.album.color : "rgba(255,255,255,0.2)" }}
              />
            );
          })}
        </div>
        <button onClick={goNext} disabled={currentIndex === shorts.length - 1} className="p-2 text-[#666680] hover:text-[#F5F0E6] disabled:opacity-30">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
