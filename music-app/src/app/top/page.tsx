"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import type { Album, AlbumTrack } from "@/data/albums";
import { useMusicPlayer, formatTime as fmt } from "@/contexts/MusicPlayerContext";
import { useTopTracks } from "@/hooks/useTopTracks";

type Period = "week" | "month" | "year" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  week: "Esta semana",
  month: "Este mês",
  year: "Este ano",
  all: "Sempre",
};

function resolveTrack(trackNumber: number, albumSlug: string) {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) return null;
  const track = album.tracks.find(t => t.number === trackNumber);
  if (!track) return null;
  return { track, album };
}

export default function TopTracksPage() {
  const [period, setPeriod] = useState<Period>("month");
  const { tracks, loading, userId } = useTopTracks(period, 50);
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay } = useMusicPlayer();

  function handleClick(track: AlbumTrack, album: Album) {
    if (currentTrack?.number === track.number && currentAlbum?.slug === album.slug) {
      togglePlay();
    } else {
      const resolved = tracks
        .map(t => resolveTrack(t.trackNumber, t.albumSlug))
        .filter(Boolean) as { track: AlbumTrack; album: Album }[];
      const trackList = resolved.map(r => ({ ...r.track, albumSlug: r.album.slug }));
      playTrack(track, album, trackList);
    }
  }

  function playAll() {
    if (tracks.length === 0) return;
    const resolved = tracks
      .map(t => resolveTrack(t.trackNumber, t.albumSlug))
      .filter(Boolean) as { track: AlbumTrack; album: Album }[];
    if (resolved.length === 0) return;
    const trackList = resolved.map(r => ({ ...r.track, albumSlug: r.album.slug }));
    playTrack(resolved[0].track, resolved[0].album, trackList);
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a0a0b0]">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Mais ouvidas</h1>
            <p className="text-xs text-[#666680]">As tuas faixas mais escutadas</p>
          </div>
        </div>

        {/* Period pills */}
        <div className="flex gap-2">
          {(["week", "month", "year", "all"] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                period === p
                  ? "bg-[#C9A96E]/20 text-[#C9A96E]"
                  : "bg-white/5 text-[#666680] hover:text-[#a0a0b0]"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-32">
        {!userId ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#333350] mb-4">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
            <p className="text-[#F5F0E6] font-medium mb-1">Inicia sessão</p>
            <p className="text-sm text-[#666680]">Para ver as tuas mais ouvidas</p>
            <Link href="/login" className="mt-4 text-sm text-[#C9A96E] hover:underline">Entrar</Link>
          </div>
        ) : loading ? (
          <div className="pt-4 space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#333350] mb-4">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className="text-[#F5F0E6] font-medium mb-1">Sem dados ainda</p>
            <p className="text-sm text-[#666680]">Ouve música e as tuas mais ouvidas aparecerão aqui</p>
          </div>
        ) : (
          <>
            {/* Play all button */}
            <div className="pt-4 mb-4">
              <button
                onClick={playAll}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A96E] text-[#0D0D1A] text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Ouvir tudo
              </button>
            </div>

            <div className="space-y-0.5">
              {tracks.map((item, idx) => {
                const resolved = resolveTrack(item.trackNumber, item.albumSlug);
                if (!resolved) return null;
                const { track, album } = resolved;
                const isActive = currentTrack?.number === track.number && currentAlbum?.slug === album.slug;

                return (
                  <button
                    key={`${item.albumSlug}-${item.trackNumber}`}
                    onClick={() => handleClick(track, album)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="w-6 text-center text-xs font-bold tabular-nums" style={{ color: idx < 3 ? "#C9A96E" : "#666680" }}>
                      {idx + 1}
                    </span>

                    {isActive && isPlaying ? (
                      <div className="w-4 flex items-end justify-center gap-0.5 h-4 shrink-0">
                        <div className="w-0.5 bg-[#C9A96E] animate-pulse" style={{ height: "60%" }} />
                        <div className="w-0.5 bg-[#C9A96E] animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                        <div className="w-0.5 bg-[#C9A96E] animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                      </div>
                    ) : (
                      <div className="w-4" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-[#666680] truncate">{album.title}</p>
                    </div>
                    <span className="text-[10px] text-[#666680] bg-white/5 px-1.5 py-0.5 rounded tabular-nums shrink-0">
                      {item.listenCount}x
                    </span>
                    <span className="text-[10px] text-[#666680] bg-white/5 px-1.5 py-0.5 rounded shrink-0">
                      {track.lang}
                    </span>
                    <span className="text-xs text-[#666680] tabular-nums w-10 text-right shrink-0">
                      {fmt(track.durationSeconds)}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
