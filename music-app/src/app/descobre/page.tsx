"use client";

import Link from "next/link";
import { useRecommendations } from "@/hooks/useRecommendations";
import { ALL_LISTS, type CuratedList } from "@/data/curated-lists";
import { ALL_ALBUMS, type Album, type AlbumTrack } from "@/data/albums";

const COLLECTION_PRODUCTS = ["incenso", "eter", "nua", "sangue", "fibra", "grao", "mare"] as const;

const COLLECTION_LABELS: Record<string, string> = {
  incenso: "Incenso",
  eter: "Eter",
  nua: "Nua",
  sangue: "Sangue",
  fibra: "Fibra",
  grao: "Grao",
  mare: "Mare",
};

function getFeaturedAlbum(product: string): Album | null {
  return ALL_ALBUMS.find((a) => a.product === product) || null;
}

export default function DescobrePage() {
  const recommendations = useRecommendations(16);

  const generos = ALL_LISTS.filter((l) => l.category === "genero");
  const moods = ALL_LISTS.filter((l) => l.category === "mood");
  const temas = ALL_LISTS.filter((l) => l.category === "tema");

  return (
    <main className="min-h-screen bg-[#0a0a0f] pb-32">
      <div className="max-w-screen-lg mx-auto px-6 py-8 space-y-12">
        {/* Header */}
        <h1 className="font-display text-3xl font-bold text-[#F5F0E6]">
          Descobre
        </h1>

        {/* Para Ti */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-4">
              Para ti
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {recommendations.map(
                ({
                  track,
                  album,
                }: {
                  track: AlbumTrack;
                  album: Album;
                }) => (
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
                    <p className="text-xs text-[#666680] truncate mt-0.5">
                      Loranne
                    </p>
                  </Link>
                )
              )}
            </div>
          </section>
        )}

        {/* Curated: Generos */}
        <CuratedSection title="Generos" lists={generos} />

        {/* Curated: Moods */}
        <CuratedSection title="Mood" lists={moods} />

        {/* Curated: Temas */}
        <CuratedSection title="Temas" lists={temas} />

        {/* Collections */}
        <section>
          <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-4">
            Colecoes
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {COLLECTION_PRODUCTS.map((product) => {
              const album = getFeaturedAlbum(product);
              if (!album) return null;
              return (
                <Link
                  key={product}
                  href={`/album/${album.slug}`}
                  className="group block rounded-xl overflow-hidden bg-white/[0.03] hover:bg-white/[0.07] transition-all"
                >
                  <div
                    className="aspect-square flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${album.color} 0%, ${album.color}44 100%)`,
                    }}
                  >
                    <span className="text-white/30 text-lg font-display font-semibold group-hover:text-white/50 transition-colors">
                      {COLLECTION_LABELS[product]}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-[#c0c0d0] truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-[#666680] truncate mt-0.5">
                      {album.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function CuratedSection({
  title,
  lists,
}: {
  title: string;
  lists: CuratedList[];
}) {
  if (lists.length === 0) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {lists.map((list) => (
          <div
            key={list.slug}
            className="group p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] transition-all cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center"
              style={{ backgroundColor: `${list.color}33` }}
            >
              <span
                className="text-lg font-bold"
                style={{ color: list.color }}
              >
                {list.title.charAt(0)}
              </span>
            </div>
            <p className="text-sm font-medium text-[#c0c0d0]">{list.title}</p>
            <p className="text-xs text-[#a0a0b0] mt-1 line-clamp-2">
              {list.subtitle}
            </p>
            <p className="text-xs text-[#666680] mt-2">
              {list.tracks.length} faixas
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
