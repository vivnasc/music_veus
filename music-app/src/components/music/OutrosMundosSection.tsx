"use client";

import Link from "next/link";
import Image from "next/image";
import { ALL_ALBUMS, getArtist } from "@/data/albums";
import { getTrackCoverUrl } from "@/lib/album-covers";

const OTHER_WORLDS_PRODUCTS = ["ancient-ground"] as const;

export default function OutrosMundosSection() {
  const albums = ALL_ALBUMS.filter((a) =>
    (OTHER_WORLDS_PRODUCTS as readonly string[]).includes(a.product)
  );

  if (albums.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-1">
        Outros Mundos
      </h2>
      <p className="text-[11px] text-[#666680] mb-4">
        Artistas e sonoridades além do universo Loranne
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {albums.map((album) => {
          const coverTrack = album.tracks[0];
          return (
            <Link
              key={album.slug}
              href={`/album/${album.slug}`}
              className="group block rounded-xl overflow-hidden"
            >
              <div
                className="aspect-square relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${album.color}44, ${album.color}11)` }}
              >
                {coverTrack && (
                  <Image
                    src={getTrackCoverUrl(album.slug, coverTrack.number)}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform brightness-[0.4]"
                    unoptimized
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                  <span className="text-lg font-semibold text-white">{album.title}</span>
                  <span className="text-[10px] text-[#C9A96E] mt-1">{getArtist(album)}</span>
                  <span className="text-[10px] text-white/50 mt-1 line-clamp-2 max-w-[85%]">{album.subtitle}</span>
                </div>
              </div>
              <p className="text-[10px] text-[#666680] mt-1.5 px-1">{album.tracks.length} faixas</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
