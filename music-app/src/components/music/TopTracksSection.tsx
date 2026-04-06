"use client";

import { useState } from "react";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import type { Album, AlbumTrack } from "@/data/albums";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { useMusicPlayer, formatTime as fmt } from "@/contexts/MusicPlayerContext";
import { useTopTracks } from "@/hooks/useTopTracks";

type Period = "week" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  week: "Esta semana",
  month: "Este mês",
  year: "Este ano",
};

function resolveTrack(trackNumber: number, albumSlug: string) {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) return null;
  const track = album.tracks.find(t => t.number === trackNumber);
  if (!track) return null;
  return { track, album };
}

export default function TopTracksSection() {
  const [period, setPeriod] = useState<Period>("month");
  const { tracks, loading, userId } = useTopTracks(period, 10);
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay } = useMusicPlayer();

  if (!userId || (tracks.length === 0 && !loading)) return null;

  function handleClick(track: AlbumTrack, album: Album) {
    if (currentTrack?.number === track.number && currentAlbum?.slug === album.slug) {
      togglePlay();
    } else {
      // Build a queue from all resolved top tracks
      const resolved = tracks
        .map(t => resolveTrack(t.trackNumber, t.albumSlug))
        .filter(Boolean) as { track: AlbumTrack; album: Album }[];
      const trackList = resolved.map(r => ({ ...r.track, albumSlug: r.album.slug }));
      playTrack(track, album, trackList);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-semibold text-[#F5F0E6]">Mais ouvidas</h2>
        <Link href="/top" className="text-xs text-[#C9A96E] hover:underline">Ver tudo</Link>
      </div>

      {/* Period pills */}
      <div className="flex gap-2 mb-4">
        {(["week", "month", "year"] as Period[]).map(p => (
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

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
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
                <span className="w-6 text-center text-xs font-medium text-[#666680] tabular-nums">
                  {idx + 1}
                </span>
                <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden" style={{ background: `linear-gradient(135deg, ${album.color}, ${album.color}88)` }}>
                  <img
                    src={getTrackCoverUrl(album.slug, track.number)}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { const img = e.target as HTMLImageElement; img.onerror = null; img.src = getAlbumCover(album); }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-[#666680] truncate">{album.title}</p>
                </div>
                <span className="text-[10px] text-[#666680] bg-white/5 px-1.5 py-0.5 rounded tabular-nums">
                  {item.listenCount}x
                </span>
                <span className="text-xs text-[#666680] tabular-nums w-10 text-right">
                  {fmt(track.durationSeconds)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
