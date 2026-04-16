"use client";

import Link from "next/link";
import { useRecommendations } from "@/hooks/useRecommendations";
import { getArtist, type AlbumTrack, type Album } from "@/data/albums";

export default function ParaTiSection() {
  const recommendations = useRecommendations(8);

  if (recommendations.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-4">
        Para ti
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {recommendations.map(({ track, album }: { track: AlbumTrack; album: Album }) => (
          <Link
            key={`rec-${album.slug}-${track.number}`}
            href={`/album/${album.slug}`}
            className="group text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-all block"
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
          </Link>
        ))}
      </div>
    </section>
  );
}
