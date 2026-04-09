"use client";

import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { ALL_ALBUMS } from "@/data/albums";
import type { ResolvedTrack } from "@/data/curated-lists";

type Props = {
  tracks: ResolvedTrack[];
};

export default function ListPlayButtons({ tracks }: Props) {
  const { playTrack } = useMusicPlayer();

  if (tracks.length === 0) return null;

  function playAll() {
    const first = tracks[0];
    const album = ALL_ALBUMS.find((a) => a.slug === first.albumSlug);
    if (!album) return;
    playTrack(first, album, tracks);
  }

  function playShuffle() {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    const first = shuffled[0];
    const album = ALL_ALBUMS.find((a) => a.slug === first.albumSlug);
    if (!album) return;
    playTrack(first, album, shuffled);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mt-5">
      <button
        onClick={playAll}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-[#0D0D1A] transition-transform hover:scale-105"
        style={{ backgroundColor: "#F5F0E6" }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M8 5v14l11-7z" />
        </svg>
        Ouvir tudo
      </button>
      <button
        onClick={playShuffle}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
        </svg>
        Shuffle
      </button>
    </div>
  );
}
