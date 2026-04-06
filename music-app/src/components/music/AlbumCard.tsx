"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Album } from "@/data/albums";
import { getAlbumCover, getAlbumBadge, getTrackCoverUrl } from "@/lib/album-covers";
import { useAlbumCovers } from "@/hooks/useAlbumCovers";

type Props = {
  album: Album;
};

export default function AlbumCard({ album }: Props) {
  const fallback = getAlbumCover(album);
  const badge = getAlbumBadge(album);
  const [cover, setCover] = useState(fallback);
  const { getCoverTrack } = useAlbumCovers();
  const coverTrack = getCoverTrack(album.slug);

  // Try to load Suno cover from selected track (default: 1)
  useEffect(() => {
    const url = getTrackCoverUrl(album.slug, coverTrack);
    const img = new window.Image();
    img.onload = () => setCover(url);
    img.onerror = () => {}; // keep fallback
    img.src = url;
  }, [album.slug, coverTrack]);

  return (
    <Link
      href={`/album/${album.slug}`}
      className="group block"
    >
      <div className="relative aspect-square rounded-xl shadow-lg overflow-hidden transition-transform group-hover:scale-[1.03] group-hover:shadow-2xl">
        <Image
          src={cover}
          alt={album.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover"
          unoptimized={cover !== fallback}
        />
        {/* Color overlay for brand identity */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{ backgroundColor: album.color }}
        />
        {/* Bottom gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Badge */}
        {badge && (
          <span
            className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm"
            style={{ backgroundColor: `${album.color}80`, color: "#F5F0E6" }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-[#F5F0E6] truncate">{album.title}</p>
      <p className="text-xs text-[#a0a0b0] truncate">Loranne</p>
    </Link>
  );
}
