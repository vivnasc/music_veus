"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecommendations } from "@/hooks/useRecommendations";
import { ALL_LISTS, type CuratedList } from "@/data/curated-lists";
import { ALL_ALBUMS, type Album, type AlbumTrack } from "@/data/albums";
import { getTrackCoverUrl } from "@/lib/album-covers";
import AddToPlaylistModal from "@/components/music/AddToPlaylistModal";

const COLLECTION_PRODUCTS = ["espelho", "no", "curso", "livro", "incenso", "eter", "nua", "sangue", "fibra", "grao", "mare", "ancient-ground"] as const;

const COLLECTION_LABELS: Record<string, { pt: string; en: string; sub: string }> = {
  espelho: { pt: "Espelhos", en: "Mirrors", sub: "A transformação interior — os 7 véus" },
  no: { pt: "Nós", en: "Knots", sub: "Entre duas pessoas — os 7 nós" },
  curso: { pt: "Cursos", en: "Courses", sub: "Escola dos Véus" },
  livro: { pt: "Livro", en: "Book", sub: "Livro filosófico" },
  incenso: { pt: "Incenso", en: "Incense", sub: "O fumo que sobe — o sagrado sem nome" },
  eter: { pt: "Éter", en: "Ether", sub: "O invisível que se sente" },
  nua: { pt: "Nua", en: "Bare", sub: "A nudez emocional do amor" },
  sangue: { pt: "Sangue", en: "Blood", sub: "O que não se escolhe, o que se herda" },
  fibra: { pt: "Fibra", en: "Fiber", sub: "O corpo que insiste" },
  grao: { pt: "Grão", en: "Grain", sub: "O pequeno que faz o todo" },
  mare: { pt: "Maré", en: "Tide", sub: "O que vai e volta" },
  "ancient-ground": { pt: "Ancient Ground", en: "Ancient Ground", sub: "Música africana meditativa — mbira, kora, balafon" },
};

function getFeaturedAlbum(product: string, publishedKeys: Set<string>): Album | null {
  // Prefer an album that has published audio (and therefore covers)
  const published = ALL_ALBUMS.find(
    (a) => a.product === product && a.tracks.some((t) => publishedKeys.has(`${a.slug}-t${t.number}`))
  );
  if (published) return published;
  // Fallback to first album in collection
  return ALL_ALBUMS.find((a) => a.product === product) || null;
}

function getCollectionTracks(product: string, publishedKeys: Set<string>): { trackNumber: number; albumSlug: string }[] {
  return ALL_ALBUMS
    .filter(a => a.product === product)
    .flatMap(a => a.tracks
      .filter(t => publishedKeys.has(`${a.slug}-t${t.number}`))
      .map(t => ({ trackNumber: t.number, albumSlug: a.slug }))
    );
}

function CollectionGrid({ publishedKeys }: { publishedKeys: Set<string> }) {
  const [playlistProduct, setPlaylistProduct] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {COLLECTION_PRODUCTS.map((product) => {
          const album = getFeaturedAlbum(product, publishedKeys);
          const label = COLLECTION_LABELS[product];
          const hasPublished = ALL_ALBUMS.some(
            (a) => a.product === product && a.tracks.some((t) => publishedKeys.has(`${a.slug}-t${t.number}`))
          );
          if (!album || !label || !hasPublished) return null;
          const albumCount = ALL_ALBUMS.filter(a => a.product === product && a.tracks.some(t => publishedKeys.has(`${a.slug}-t${t.number}`))).length;
          return (
            <div key={product} className="group relative">
              <Link
                href={`/coleccao/${product}`}
                className="block rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${album.color}, ${album.color}44)` }}>
                  <Image
                    src={getTrackCoverUrl(album.slug, 1)}
                    alt={label.pt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform brightness-50"
                    unoptimized
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                    <span className="text-xl font-semibold text-white">{label.pt}</span>
                    <span className="text-[10px] text-white/50 mt-0.5">{label.en}</span>
                    {albumCount > 1 && (
                      <span className="text-[10px] text-white/40 mt-1">{albumCount} albuns</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <p className="text-[10px] text-[#666680] line-clamp-1 flex-1">{label.sub}</p>
                <button
                  onClick={() => setPlaylistProduct(product)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
                  title={`Adicionar ${label.pt} à playlist`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-3.5 w-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {playlistProduct && (
        <AddToPlaylistModal
          trackNumber={1}
          albumSlug=""
          batch={getCollectionTracks(playlistProduct, publishedKeys)}
          onClose={() => setPlaylistProduct(null)}
        />
      )}
    </>
  );
}

export default function DescobrePage() {
  const recommendations = useRecommendations(16);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const géneros = ALL_LISTS.filter((l) => l.category === "genero");
  const moods = ALL_LISTS.filter((l) => l.category === "mood");
  const temas = ALL_LISTS.filter((l) => l.category === "tema");

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Descobre</h1>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 space-y-10">
        {/* Para Ti */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">Para ti</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {recommendations.map(({ track, album }: { track: AlbumTrack; album: Album }) => (
                <Link
                  key={`rec-${album.slug}-${track.number}`}
                  href={`/album/${album.slug}`}
                  className="group text-left block"
                >
                  <div className="aspect-square rounded-lg mb-1.5 overflow-hidden bg-[#1a1a2e]">
                    <Image
                      src={getTrackCoverUrl(album.slug, track.number)}
                      alt={track.title}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs text-[#c0c0d0] truncate">{track.title}</p>
                  <p className="text-[10px] text-[#666680] truncate">{album.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Colecções */}
        <section>
          <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">Colecções</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i}>
                  <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-white/5 animate-pulse mt-1.5" />
                </div>
              ))}
            </div>
          ) : (
          <CollectionGrid publishedKeys={publishedKeys} />
          )}
        </section>

        {/* Géneros */}
        <CuratedSection title="Géneros" lists={géneros} publishedKeys={publishedKeys} loading={loading} />

        {/* Energia */}
        <CuratedSection title="Energia" lists={moods} publishedKeys={publishedKeys} loading={loading} />

        {/* Temas */}
        <CuratedSection title="Temas" lists={temas} publishedKeys={publishedKeys} loading={loading} />
      </div>
    </main>
  );
}

function CuratedSection({ title, lists, publishedKeys, loading }: { title: string; lists: CuratedList[]; publishedKeys: Set<string>; loading: boolean }) {
  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1,2,3].map(i => (
            <div key={i}>
              <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
              <div className="h-3 w-16 rounded bg-white/5 animate-pulse mt-1.5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Filter each list to only include published tracks, hide empty lists
  const filtered = lists
    .map((list) => ({
      ...list,
      tracks: list.tracks.filter((t) => publishedKeys.has(`${t.albumSlug}-t${t.trackNumber}`)),
    }))
    .filter((list) => list.tracks.length > 0);

  if (filtered.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((list) => {
          const coverTrack = list.tracks[0];
          return (
            <Link
              key={list.slug}
              href={`/lista/${list.slug}`}
              className="group block rounded-xl overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${list.color}44, ${list.color}11)` }}>
                <Image
                  src={getTrackCoverUrl(coverTrack.albumSlug, coverTrack.trackNumber)}
                  alt={list.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform brightness-[0.4]"
                  unoptimized
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                  <span className="text-lg font-semibold text-white">{list.title}</span>
                  <span className="text-[10px] text-white/50 mt-1 line-clamp-2 max-w-[80%]">{list.subtitle}</span>
                </div>
              </div>
              <p className="text-[10px] text-[#666680] mt-1.5 px-1">{list.tracks.length} faixas</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
