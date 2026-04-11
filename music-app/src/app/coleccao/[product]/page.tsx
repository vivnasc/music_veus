"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ALL_ALBUMS, type Album, type AlbumTrack } from "@/data/albums";
import { getTrackCoverUrl, getAlbumCover } from "@/lib/album-covers";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import NavBar from "@/components/music/NavBar";
import TrackRow from "@/components/music/TrackRow";
import { useAlbumCovers } from "@/hooks/useAlbumCovers";

const COLLECTION_LABELS: Record<string, { pt: string; en: string; sub: string }> = {
  espelho: { pt: "Espelhos", en: "Mirrors", sub: "A transformacao interior — os 7 veus" },
  no: { pt: "Nos", en: "Knots", sub: "Entre duas pessoas — os 7 nos" },
  curso: { pt: "Cursos", en: "Courses", sub: "Escola dos Veus" },
  livro: { pt: "Livro", en: "Book", sub: "Livro filosofico" },
  incenso: { pt: "Incenso", en: "Incense", sub: "O fumo que sobe — o sagrado sem nome" },
  eter: { pt: "Eter", en: "Ether", sub: "O invisivel que se sente" },
  nua: { pt: "Nua", en: "Bare", sub: "A nudez emocional do amor" },
  sangue: { pt: "Sangue", en: "Blood", sub: "O que nao se escolhe, o que se herda" },
  fibra: { pt: "Fibra", en: "Fiber", sub: "O corpo que insiste" },
  grao: { pt: "Grao", en: "Grain", sub: "O pequeno que faz o todo" },
  mare: { pt: "Mare", en: "Tide", sub: "O que vai e volta" },
};

export default function CollectionPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params);
  const label = COLLECTION_LABELS[product];
  const albums = ALL_ALBUMS.filter((a) => a.product === product);
  const { playTrack, playAlbum, currentTrack, currentAlbum } = useMusicPlayer();
  const { getCoverTrack } = useAlbumCovers();
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => {});
  }, []);

  const publishedAlbums = albums.filter((a) =>
    a.tracks.some((t) => publishedKeys.has(`${a.slug}-t${t.number}`))
  );

  const allPublishedTracks: { track: AlbumTrack; album: Album }[] = [];
  for (const album of publishedAlbums) {
    for (const track of album.tracks) {
      if (publishedKeys.has(`${album.slug}-t${track.number}`)) {
        allPublishedTracks.push({ track, album });
      }
    }
  }

  function playAll() {
    if (allPublishedTracks.length === 0) return;
    const firstItem = allPublishedTracks[0];
    const tracks = allPublishedTracks.map(({ track, album }) => ({
      ...track,
      albumSlug: album.slug,
    }));
    playTrack(tracks[0], firstItem.album, tracks);
  }

  function playShuffle() {
    if (allPublishedTracks.length === 0) return;
    const shuffled = [...allPublishedTracks].sort(() => Math.random() - 0.5);
    const firstItem = shuffled[0];
    const tracks = shuffled.map(({ track, album }) => ({
      ...track,
      albumSlug: album.slug,
    }));
    playTrack(tracks[0], firstItem.album, tracks);
  }

  if (!label || albums.length === 0) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-[#a0a0b0] text-lg mb-4">Coleccao nao encontrada.</p>
            <Link href="/descobre" className="text-sm text-[#C9A96E] hover:underline">Voltar</Link>
          </div>
        </div>
      </div>
    );
  }

  const featuredAlbum = publishedAlbums[0] || albums[0];
  const coverUrl = getTrackCoverUrl(featuredAlbum.slug, getCoverTrack(featuredAlbum.slug));

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={coverUrl}
            alt=""
            fill
            className="object-cover blur-[60px] scale-110 opacity-30"
            quality={20}
            unoptimized
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A]/50 via-[#0D0D1A]/80 to-[#0D0D1A]" />
        </div>

        <div className="relative max-w-screen-lg mx-auto px-6 pt-8 pb-10">
          <Link href="/descobre" className="text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors">
            &larr; Descobre
          </Link>

          <div className="mt-6 flex items-start gap-5">
            <div
              className="w-24 h-24 rounded-2xl flex-shrink-0 overflow-hidden relative shadow-lg"
              style={{ backgroundColor: `${featuredAlbum.color}20`, border: `1px solid ${featuredAlbum.color}30` }}
            >
              <Image
                src={coverUrl}
                alt={label.pt}
                fill
                className="object-cover brightness-75"
                unoptimized
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold text-white drop-shadow-lg">{label.pt}</span>
              </div>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-widest text-[#666680]">Coleccao</span>
              <h1 className="font-display text-3xl font-bold text-[#F5F0E6] mt-1">{label.pt}</h1>
              <p className="text-sm text-[#a0a0b0] mt-1">{label.sub}</p>
              <p className="text-xs text-[#666680] mt-2">
                {publishedAlbums.length} {publishedAlbums.length === 1 ? "album" : "albuns"} &middot; {allPublishedTracks.length} faixas
              </p>
            </div>
          </div>

          {/* Play all / Shuffle buttons */}
          {allPublishedTracks.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
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
          )}
        </div>
      </div>

      {/* Albums */}
      <div className="max-w-screen-lg mx-auto px-6 pb-32">
        {/* Album cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {publishedAlbums.map((album) => {
            const albumCover = getTrackCoverUrl(album.slug, getCoverTrack(album.slug));
            const trackCount = album.tracks.filter((t) => publishedKeys.has(`${album.slug}-t${t.number}`)).length;
            const isSelected = selectedAlbum === album.slug;

            return (
              <button
                key={album.slug}
                onClick={() => setSelectedAlbum(isSelected ? null : album.slug)}
                className={`group block rounded-xl overflow-hidden text-left transition-all ${
                  isSelected ? "ring-2 ring-[#C9A96E]" : "ring-0"
                }`}
              >
                <div className="aspect-square relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${album.color}, ${album.color}44)` }}>
                  <Image
                    src={albumCover}
                    alt={album.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform brightness-[0.6]"
                    unoptimized
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                    <span className="text-base font-semibold text-white drop-shadow">{album.title}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1.5 px-1">
                  <p className="text-[10px] text-[#666680] truncate">{trackCount} faixas</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); playAlbum(album); }}
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    title="Ouvir album"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-[#C9A96E]">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected album tracks or all tracks */}
        {selectedAlbum ? (
          <div>
            {(() => {
              const album = publishedAlbums.find((a) => a.slug === selectedAlbum);
              if (!album) return null;
              const publishedTracks = album.tracks.filter((t) => publishedKeys.has(`${album.slug}-t${t.number}`));
              return (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ background: album.color }} />
                      <h2 className="text-lg font-semibold text-[#F5F0E6]">{album.title}</h2>
                      <span className="text-xs text-[#666680]">{publishedTracks.length} faixas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playAlbum(album)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-[#F5F0E6] bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Ouvir
                      </button>
                      <Link
                        href={`/album/${album.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
                      >
                        Ver album
                      </Link>
                    </div>
                  </div>
                  <div className="divide-y divide-white/5">
                    {publishedTracks.map((track) => (
                      <TrackRow
                        key={`${album.slug}-${track.number}`}
                        track={track}
                        album={album}
                        isActive={currentTrack?.number === track.number && currentAlbum?.slug === album.slug}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-4">Todas as faixas</h2>
            <div className="divide-y divide-white/5">
              {allPublishedTracks.map(({ track, album }) => (
                <TrackRow
                  key={`${album.slug}-${track.number}`}
                  track={track}
                  album={album}
                  isActive={currentTrack?.number === track.number && currentAlbum?.slug === album.slug}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
