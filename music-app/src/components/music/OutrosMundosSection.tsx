"use client";

import Link from "next/link";
import { ALL_ALBUMS, getArtist } from "@/data/albums";

const OTHER_WORLDS_PRODUCTS = ["ancient-ground"] as const;

export default function OutrosMundosSection() {
  const albums = ALL_ALBUMS.filter((a) =>
    (OTHER_WORLDS_PRODUCTS as readonly string[]).includes(a.product)
  );

  if (albums.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-1">
        Outros Mundos
      </h2>
      <p className="text-xs text-[#666680] mb-4">
        Artistas e sonoridades além do universo Loranne
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {albums.map((album) => (
          <Link
            key={album.slug}
            href={`/album/${album.slug}`}
            className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] transition-all"
          >
            <div
              className="shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${album.color} 0%, ${album.color}66 100%)`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-white/70">
                <path d="M9 19V6l12-3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="6" cy="19" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#F5F0E6] truncate">
                {album.title}
              </p>
              <p className="text-xs text-[#C9A96E] truncate">
                {getArtist(album)}
              </p>
              <p className="text-[11px] text-[#666680] mt-0.5 truncate">
                {album.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
