"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ALL_LISTS, resolveList, type ResolvedTrack } from "@/data/curated-lists";
import { ALL_ALBUMS, type Album } from "@/data/albums";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { getTrackCoverUrl } from "@/lib/album-covers";
import { useAlbumCovers } from "@/hooks/useAlbumCovers";
import ListTrackRow from "@/components/music/ListTrackRow";
import VersionTracks from "@/components/music/VersionTracks";
import NavBar from "@/components/music/NavBar";
import type { TrackEnergy } from "@/data/albums";

type AlbumGroup = {
  album: Album;
  tracks: ResolvedTrack[];
};

type Props = {
  slug: string;
  categoryLabel: string;
  moodEnergy: TrackEnergy | null;
};

export default function ListPageClient({ slug, categoryLabel, moodEnergy }: Props) {
  const list = ALL_LISTS.find(l => l.slug === slug)!;
  const allTracks = resolveList(list);
  const { playTrack, playAlbum, currentTrack, currentAlbum } = useMusicPlayer();
  const { getCoverTrack } = useAlbumCovers();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => {});
  }, []);

  // Only show published tracks
  const publishedTracks = publishedKeys.size > 0
    ? allTracks.filter((t) => publishedKeys.has(`${t.albumSlug}-t${t.number}`))
    : allTracks;

  // Group tracks by album
  const albumGroups: AlbumGroup[] = [];
  const seen = new Set<string>();
  for (const track of publishedTracks) {
    if (!seen.has(track.albumSlug)) {
      seen.add(track.albumSlug);
      const album = ALL_ALBUMS.find(a => a.slug === track.albumSlug);
      if (album) {
        albumGroups.push({
          album,
          tracks: publishedTracks.filter(t => t.albumSlug === track.albumSlug),
        });
      }
    }
  }

  function playAll() {
    if (publishedTracks.length === 0) return;
    const first = publishedTracks[0];
    const album = ALL_ALBUMS.find(a => a.slug === first.albumSlug);
    if (!album) return;
    playTrack(first, album, publishedTracks);
  }

  function playShuffle() {
    if (publishedTracks.length === 0) return;
    const shuffled = [...publishedTracks].sort(() => Math.random() - 0.5);
    const first = shuffled[0];
    const album = ALL_ALBUMS.find(a => a.slug === first.albumSlug);
    if (!album) return;
    playTrack(first, album, shuffled);
  }

  // Currently visible tracks (filtered by album or all)
  const visibleTracks = selectedAlbum
    ? publishedTracks.filter(t => t.albumSlug === selectedAlbum)
    : publishedTracks;

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at center top, ${list.color}, transparent 70%)` }}
        />
        <div className="relative max-w-screen-lg mx-auto px-6 pt-8 pb-10">
          <Link href="/descobre" className="text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors">
            &larr; Descobre
          </Link>

          <div className="mt-6 flex items-start gap-5">
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ backgroundColor: `${list.color}20`, border: `1px solid ${list.color}30` }}
            >
              <ListIcon name={list.icon} color={list.color} />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-widest" style={{ color: list.color }}>
                {categoryLabel}
              </span>
              <h1 className="font-display text-3xl font-bold text-[#F5F0E6] mt-1">{list.title}</h1>
              <p className="text-sm text-[#a0a0b0] mt-1">{list.subtitle}</p>
              <p className="text-xs text-[#666680] mt-2">
                {albumGroups.length > 1 && <>{albumGroups.length} albuns &middot; </>}
                {publishedTracks.length} faixas
              </p>

              {/* Play all / Shuffle */}
              {publishedTracks.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
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
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-6 pb-32">
        {/* Album cards — only show if more than 1 album */}
        {albumGroups.length > 1 && (
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-2 px-2">
              {/* "All" pill */}
              <button
                onClick={() => setSelectedAlbum(null)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-colors ${
                  selectedAlbum === null
                    ? "bg-white/10 text-[#F5F0E6]"
                    : "text-[#666680] hover:text-[#a0a0b0] hover:bg-white/5"
                }`}
              >
                Todos ({publishedTracks.length})
              </button>

              {albumGroups.map(({ album, tracks: groupTracks }) => {
                const isSelected = selectedAlbum === album.slug;
                const coverUrl = getTrackCoverUrl(album.slug, getCoverTrack(album.slug));

                return (
                  <button
                    key={album.slug}
                    onClick={() => setSelectedAlbum(isSelected ? null : album.slug)}
                    className={`shrink-0 flex items-center gap-2.5 pl-1 pr-4 py-1 rounded-full transition-all ${
                      isSelected
                        ? "bg-white/10 text-[#F5F0E6] ring-1 ring-white/20"
                        : "text-[#a0a0b0] hover:bg-white/5"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 relative" style={{ backgroundColor: `${album.color}30` }}>
                      <Image
                        src={coverUrl}
                        alt={album.title}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-medium truncate max-w-[120px]">{album.title}</p>
                      <p className="text-[10px] text-[#666680]">{groupTracks.length} faixas</p>
                    </div>
                    {/* Inline play */}
                    <button
                      onClick={(e) => { e.stopPropagation(); playAlbum(album); }}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
                      title={`Ouvir ${album.title}`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" style={{ color: list.color }}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected album header */}
        {selectedAlbum && (() => {
          const group = albumGroups.find(g => g.album.slug === selectedAlbum);
          if (!group) return null;
          return (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ background: group.album.color }} />
                <h2 className="text-lg font-semibold text-[#F5F0E6]">{group.album.title}</h2>
                <span className="text-xs text-[#666680]">{group.tracks.length} faixas</span>
              </div>
              <Link
                href={`/album/${group.album.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
              >
                Ver album
              </Link>
            </div>
          );
        })()}

        {/* Track list */}
        <div className="divide-y divide-white/5">
          {visibleTracks.map((track, i) => (
            <ListTrackRow
              key={`${track.albumSlug}-${track.number}`}
              track={track}
              index={i}
              allTracks={selectedAlbum ? visibleTracks : publishedTracks}
            />
          ))}
        </div>

        {/* Version variants for mood lists */}
        {!selectedAlbum && moodEnergy && (
          <VersionTracks energy={moodEnergy} listColor={list.color} startIndex={publishedTracks.length} />
        )}
      </div>
    </div>
  );
}

function ListIcon({ name, color }: { name: string; color: string }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "1.5", className: "h-8 w-8" };
  const lc = "round";

  switch (name) {
    case "leaf":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 4 20 4s-.9 4.5-2.9 10.1A7 7 0 0111 20z" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>;
    case "flame":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>;
    case "zap":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="4" /><path strokeLinecap={lc} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>;
    case "moon":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>;
    case "footprints":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7 9.33 8 8 10H4zM20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 1.5.67 2.5 2 4.5h4z" /></svg>;
    case "heart-pulse":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.572" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M5 12h2l2-3 3 6 2-3h2" /></svg>;
    case "crown":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14" /></svg>;
    case "droplet":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>;
    case "heart":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.572z" /></svg>;
    case "shield":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "tree-deciduous":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 22v-7M8 9a4 4 0 118 0 3 3 0 11-2 5.65V15H10v-.35A3 3 0 018 9z" /></svg>;
    case "person-standing":
      return <svg {...props}><circle cx="12" cy="5" r="1" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 8v6M9 22l3-8 3 8M8 12h8" /></svg>;
    case "sprout":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.2 1.7-4.6-2.7.1-4 1-4.9 2z" /></svg>;
    case "volume-x":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="4" /></svg>;
  }
}
