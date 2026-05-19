"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MOOD_BY_SLUG, getMoodTracks, weightedShuffle, type MoodSlug, type MoodTrack } from "@/data/moods";
import { useMusicPlayer, formatTime } from "@/contexts/MusicPlayerContext";
import { useMoodLikes } from "@/hooks/useMoodLikes";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { getArtist } from "@/data/albums";
import NavBar from "@/components/music/NavBar";

function isMoodSlug(s: string): s is MoodSlug {
  return s === "meditativo" || s === "introspectivo" || s === "animado" || s === "energetico";
}

export default function MoodDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [publishedKeys, setPublishedKeys] = useState<Set<string> | null>(null);
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay, addToQueue } = useMusicPlayer();
  const { isLiked, toggle, getLikedCount } = useMoodLikes();

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => setPublishedKeys(new Set()));
  }, []);

  const validMood: MoodSlug | null = isMoodSlug(slug) ? slug : null;

  const tracks: MoodTrack[] = useMemo(() => {
    if (!publishedKeys || !validMood) return [];
    return getMoodTracks(validMood, publishedKeys);
  }, [validMood, publishedKeys]);

  if (!validMood) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] flex items-center justify-center">
        <p className="text-[#666680]">Mood não encontrado.</p>
      </main>
    );
  }

  const meta = MOOD_BY_SLUG[validMood];

  function playShuffleMix() {
    if (!validMood || tracks.length === 0) return;
    const ordered = weightedShuffle(tracks, (t) => isLiked(validMood, t.key));
    const trackList = ordered.map((t) => ({ ...t.track, albumSlug: t.album.slug }));
    playTrack(ordered[0].track, ordered[0].album, trackList);
  }

  function playJust(mt: MoodTrack) {
    if (!validMood) return;
    const others = weightedShuffle(
      tracks.filter((t) => t.key !== mt.key),
      (t) => isLiked(validMood, t.key),
    );
    const trackList = [mt, ...others].map((t) => ({ ...t.track, albumSlug: t.album.slug }));
    playTrack(mt.track, mt.album, trackList);
  }

  function addJustToQueue(mt: MoodTrack) {
    addToQueue([mt.track], mt.album);
  }

  const likedCount = getLikedCount(validMood);

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      <NavBar />

      {/* Hero card */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: `linear-gradient(135deg, ${meta.color} 0%, ${meta.color2} 100%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D0D1A]" />
        <div className="relative max-w-screen-lg mx-auto px-6 pt-8 pb-12">
          <Link href="/" className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            voltar
          </Link>
          <div className="mt-4 flex items-end gap-4">
            <div className="text-6xl drop-shadow-lg">{meta.emoji}</div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-widest">Mix do mood</p>
              <h1 className="font-display text-4xl font-bold text-white drop-shadow">{meta.label}</h1>
              <p className="text-sm text-white/80 mt-1">{meta.description}</p>
              <p className="text-xs text-white/60 mt-2">
                {publishedKeys === null ? "…" : `${tracks.length} faixa${tracks.length === 1 ? "" : "s"}`}
                {likedCount > 0 && ` · ${likedCount} ♥`}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={playShuffleMix}
              disabled={tracks.length === 0}
              className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
              Tocar mix
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-6 mt-2">
        {publishedKeys === null ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <p className="text-[#666680] text-sm py-12 text-center">Ainda não há faixas para este mood.</p>
        ) : (
          <div className="space-y-0.5">
            {tracks.map((mt) => {
              const isActive = currentTrack?.number === mt.track.number && currentAlbum?.slug === mt.album.slug;
              const liked = isLiked(validMood, mt.key);
              return (
                <div
                  key={mt.key}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <button
                    onClick={() => (isActive ? togglePlay() : playJust(mt))}
                    className="h-10 w-10 shrink-0 rounded-md overflow-hidden relative"
                    style={{ background: `linear-gradient(135deg, ${mt.album.color}, ${mt.album.color}88)` }}
                    aria-label={isActive && isPlaying ? "Pausar" : "Tocar"}
                  >
                    <Image
                      src={getTrackCoverUrl(mt.album.slug, mt.track.number)}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.onerror = null;
                        img.src = getAlbumCover(mt.album);
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                        {isActive && isPlaying ? (
                          <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                        ) : (
                          <path d="M8 5v14l11-7z" />
                        )}
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={() => (isActive ? togglePlay() : playJust(mt))}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>
                      {mt.track.title}
                    </p>
                    <p className="text-xs text-[#666680] truncate">
                      {mt.album.title} · {getArtist(mt.album)}
                    </p>
                  </button>

                  {/* Heart per-mood */}
                  <button
                    onClick={() => toggle(validMood, mt.key)}
                    aria-label={liked ? "Remover like" : "Dar like neste mood"}
                    title={liked ? "Tens like — esta faixa sai mais vezes" : "Dar like — sai mais no próximo mix"}
                    className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-full transition-colors ${
                      liked ? "text-[#E04A6E] hover:bg-white/10" : "text-[#666680] hover:text-[#F5F0E6] hover:bg-white/5"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </button>

                  {/* Add to queue */}
                  <button
                    onClick={() => addJustToQueue(mt)}
                    aria-label="Adicionar à fila"
                    title="Adicionar à fila"
                    className="shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-[#666680] hover:text-[#F5F0E6] hover:bg-white/5 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h13M3 12h13M3 18h9M16 16v6M19 19h-6" />
                    </svg>
                  </button>

                  <span className="text-xs text-[#666680] tabular-nums w-10 text-right shrink-0 hidden sm:inline">
                    {formatTime(mt.track.durationSeconds)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
