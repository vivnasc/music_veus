"use client";

import Link from "next/link";
import Image from "next/image";
import { ALL_ALBUMS, type Album } from "@/data/albums";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { useAlbumCovers } from "@/hooks/useAlbumCovers";
import { usePublishedTracks } from "@/hooks/usePublishedTracks";

export default function NovidadesSection() {
  const { getCoverTrack } = useAlbumCovers();
  const { publishedAlbums, loading } = usePublishedTracks();

  const albums = (() => {
    if (Object.keys(publishedAlbums).length === 0) return [];

    const items: { album: Album; trackCount: number; publishedAt: string }[] = [];
    for (const [slug, info] of Object.entries(publishedAlbums)) {
      const album = ALL_ALBUMS.find(a => a.slug === slug);
      if (album) {
        items.push({ album, trackCount: info.trackCount, publishedAt: info.publishedAt });
      }
    }

    // Sort by publication date — newest first, show only recent (last 30 days or top 6)
    items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = items.filter(i => new Date(i.publishedAt).getTime() > thirtyDaysAgo);
    return recent.length >= 3 ? recent.slice(0, 10) : items.slice(0, 10);
  })();

  if (!loading && albums.length === 0) return null;

  if (loading) {
    return (
      <section>
        <div className="h-7 w-32 rounded bg-white/5 animate-pulse mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i}>
              <div className="aspect-square rounded-xl bg-white/5 animate-pulse mb-2" />
              <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-4">
        Novidades
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {albums.map(({ album, trackCount }) => (
          <Link
            key={`nov-${album.slug}`}
            href={`/album/${album.slug}`}
            className="group"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-lg mb-2">
              <Image
                src={getTrackCoverUrl(album.slug, getCoverTrack(album.slug))}
                alt={album.title}
                width={160}
                height={160}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
                onError={(e) => { (e.target as HTMLImageElement).src = getAlbumCover(album); }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] text-white/70 bg-black/30 px-1.5 py-0.5 rounded">
                  {trackCount} faixa{trackCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#F5F0E6] truncate">{album.title}</p>
            <p className="text-xs text-[#666680] truncate">{album.subtitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
