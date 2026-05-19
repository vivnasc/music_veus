"use client";

import Link from "next/link";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { getArtist, type AlbumTrack, type Album } from "@/data/albums";

export default function ParaTiSection() {
  const recommendations = useRecommendations(8);
  const { playTrack, addToQueue } = useMusicPlayer();

  if (recommendations.length === 0) return null;

  function play(track: AlbumTrack, album: Album) {
    const trackList = recommendations.map(({ track: t, album: a }) => ({ ...t, albumSlug: a.slug }));
    playTrack(track, album, trackList);
  }

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-4">
        Para ti
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {recommendations.map(({ track, album }: { track: AlbumTrack; album: Album }) => (
          <div
            key={`rec-${album.slug}-${track.number}`}
            className="group relative text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-all"
          >
            <button
              onClick={() => play(track, album)}
              className="block w-full text-left"
              aria-label={`Tocar ${track.title}`}
            >
              <div
                className="aspect-square rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${album.color} 0%, ${album.color}66 100%)`,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-8 w-8 text-white/20 group-hover:text-white/40 transition-colors"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#F5F0E6] truncate">
                {track.title}
              </p>
              <p className="text-xs text-[#666680] truncate mt-0.5">{getArtist(album)}</p>
            </button>

            {/* Hover actions: + to queue, open album */}
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); addToQueue([track], album); }}
                aria-label="Adicionar à fila"
                title="Adicionar à fila"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h13M3 12h13M3 18h9M16 16v6M19 19h-6" />
                </svg>
              </button>
              <Link
                href={`/album/${album.slug}`}
                onClick={(e) => e.stopPropagation()}
                aria-label="Ver álbum"
                title="Ver álbum"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
