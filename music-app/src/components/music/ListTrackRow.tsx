"use client";

import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import type { ResolvedTrack } from "@/data/curated-lists";

type Props = {
  track: ResolvedTrack;
  index: number;
  allTracks: ResolvedTrack[];
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ListTrackRow({ track, index, allTracks }: Props) {
  const { playTrack, currentTrack, currentAlbum, isPlaying } = useMusicPlayer();

  const album = ALL_ALBUMS.find(a => a.slug === track.albumSlug);
  const isCurrentTrack = currentTrack?.number === track.number && currentAlbum?.slug === track.albumSlug;

  function handlePlay() {
    if (!album) return;
    // Play this track with its real album, using all list tracks as the queue
    playTrack(track, album, allTracks);
  }

  return (
    <div className="flex items-center gap-4 py-3 px-2 hover:bg-white/5 rounded-lg transition-colors group">
      {/* Play button / number */}
      <button
        onClick={handlePlay}
        className="w-6 flex-shrink-0 flex items-center justify-center"
      >
        {isCurrentTrack && isPlaying ? (
          <div className="flex items-end gap-[2px] h-4">
            <div className="w-[3px] rounded-full animate-pulse" style={{ backgroundColor: track.albumColor, height: "60%" }} />
            <div className="w-[3px] rounded-full animate-pulse" style={{ backgroundColor: track.albumColor, height: "100%", animationDelay: "0.15s" }} />
            <div className="w-[3px] rounded-full animate-pulse" style={{ backgroundColor: track.albumColor, height: "40%", animationDelay: "0.3s" }} />
          </div>
        ) : (
          <>
            <span className={`text-xs tabular-nums group-hover:hidden ${isCurrentTrack ? "" : "text-[#666680]"}`} style={isCurrentTrack ? { color: track.albumColor } : undefined}>
              {index + 1}
            </span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#F5F0E6] hidden group-hover:block">
              <path d="M8 5v14l11-7z" />
            </svg>
          </>
        )}
      </button>

      {/* Color dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: track.albumColor }}
      />

      {/* Info — click to play */}
      <button onClick={handlePlay} className="flex-1 min-w-0 text-left">
        <p className={`text-sm truncate ${isCurrentTrack ? "" : "text-[#F5F0E6]"}`} style={isCurrentTrack ? { color: track.albumColor } : undefined}>
          {track.title}
        </p>
        <p className="text-xs text-[#666680] truncate">{track.albumTitle}</p>
      </button>

      {/* Album link — hover only */}
      <Link
        href={`/album/${track.albumSlug}`}
        className="text-[10px] text-[#666680] hover:text-[#a0a0b0] transition-colors opacity-0 group-hover:opacity-100 shrink-0 px-2"
        title={`Ver album: ${track.albumTitle}`}
      >
        Ver album
      </Link>

      {/* Duration */}
      <span className="text-xs text-[#666680] tabular-nums flex-shrink-0">
        {formatTime(track.durationSeconds)}
      </span>
    </div>
  );
}
