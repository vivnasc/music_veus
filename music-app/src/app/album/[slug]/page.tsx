"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ALL_ALBUMS as ALBUMS, ENERGY_LABELS } from "@/data/albums";
import { useState } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import AddToPlaylistModal from "@/components/music/AddToPlaylistModal";
import { useSubscriptionGate } from "@/contexts/SubscriptionContext";
import { useDownloads } from "@/hooks/useDownloads";
import { getAlbumCover, getAlbumBadge, getTrackCoverUrl } from "@/lib/album-covers";
import TrackRow from "@/components/music/TrackRow";
import { useAlbumVersions, type AlbumVersion } from "@/hooks/useAlbumVersions";
import { useAlbumCovers } from "@/hooks/useAlbumCovers";
import type { Album, AlbumTrack } from "@/data/albums";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const ENERGY_DARK_COLORS: Record<string, string> = {
  whisper: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  steady: "text-green-400 border-green-400/30 bg-green-400/10",
  pulse: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  anthem: "text-red-400 border-red-400/30 bg-red-400/10",
  raw: "text-purple-400 border-purple-400/30 bg-purple-400/10",
};

function VersionRow({
  version,
  track,
  album,
}: {
  version: AlbumVersion;
  track: AlbumTrack;
  album: Album;
}) {
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay } = useMusicPlayer();
  const label = ENERGY_LABELS[version.energy] || ENERGY_LABELS.whisper;
  const colorClass = ENERGY_DARK_COLORS[version.energy] || ENERGY_DARK_COLORS.whisper;

  const versionAudioUrl = `/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${track.number}&version=${encodeURIComponent(version.version_name)}`;
  const isActive =
    currentTrack?.number === track.number &&
    currentAlbum?.slug === album.slug &&
    currentTrack?.audioUrl === versionAudioUrl;

  function handlePlay() {
    if (isActive) {
      togglePlay();
      return;
    }
    const versionTrack: AlbumTrack = {
      ...track,
      title: `${track.title} (${version.version_name})`,
      audioUrl: versionAudioUrl,
    };
    playTrack(versionTrack, album);
  }

  return (
    <button
      onClick={handlePlay}
      className="w-full flex items-center gap-3 px-4 py-2 pl-12 rounded-lg hover:bg-white/5 transition-colors text-left"
    >
      {/* Playing indicator or play icon */}
      <div className="w-6 text-center shrink-0">
        {isActive && isPlaying ? (
          <div className="flex items-end justify-center gap-0.5 h-3">
            <div className="w-0.5 bg-current animate-pulse" style={{ height: "60%", color: album.color }} />
            <div className="w-0.5 bg-current animate-pulse" style={{ height: "100%", color: album.color, animationDelay: "0.2s" }} />
            <div className="w-0.5 bg-current animate-pulse" style={{ height: "40%", color: album.color, animationDelay: "0.4s" }} />
          </div>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 mx-auto text-[#666680]">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </div>

      {/* Version name */}
      <span className={`text-xs flex-1 truncate ${isActive ? "font-medium" : "text-[#a0a0b0]"}`}
        style={isActive ? { color: album.color } : {}}
      >
        {version.version_name}
      </span>

      {/* Energy badge */}
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${colorClass}`}>
        {label.emoji} {label.label}
      </span>
    </button>
  );
}

export default function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const album = ALBUMS.find(a => a.slug === slug);
  const { currentTrack, currentAlbum, playAlbum, addToQueue } = useMusicPlayer();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const { isPremium, requestPlay } = useSubscriptionGate();
  const { saveAlbum, isSaved } = useDownloads();
  const { versionsForTrack, hasVersions } = useAlbumVersions(slug);
  const { getCoverTrack } = useAlbumCovers();
  const [expandedTrack, setExpandedTrack] = useState<number | null>(null);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#a0a0b0] text-lg mb-4">Álbum não encontrado.</p>
          <Link href="/" className="text-sm text-[#C9A96E] hover:underline">
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  const totalDuration = album.tracks.reduce((acc, t) => acc + t.durationSeconds, 0);
  const totalMinutes = Math.ceil(totalDuration / 60);
  const albumColor = album.color;
  const sunoCover = getTrackCoverUrl(album.slug, getCoverTrack(album.slug));
  const poseCover = getAlbumCover(album);
  const badge = getAlbumBadge(album);

  return (
    <div className="min-h-screen">
      {/* Album header */}
      <div className="relative overflow-hidden">
        {/* Background image blur */}
        <div className="absolute inset-0">
          <img
            src={sunoCover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[60px] scale-110 opacity-30"
            onError={(e) => { (e.target as HTMLImageElement).src = poseCover; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A]/50 via-[#0D0D1A]/80 to-[#0D0D1A]" />
        </div>

        <div className="relative px-6 pt-12 pb-8 max-w-screen-lg mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#666680] hover:text-[#a0a0b0] transition-colors mb-8 py-3 pr-4 min-h-[44px] -ml-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Album art */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl shadow-2xl shrink-0 overflow-hidden relative">
              <img
                src={sunoCover}
                alt={album.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = poseCover; }}
              />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{ backgroundColor: albumColor }}
              />
            </div>

            {/* Album info */}
            <div className="flex-1">
              <span className="text-xs uppercase tracking-widest text-[#666680]">
                Album
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F5F0E6] mt-1 leading-tight">
                {album.title}
              </h1>
              <p className="text-sm text-[#C9A96E] mt-1">Loranne</p>
              <p className="text-[#a0a0b0] mt-2">{album.subtitle}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-[#666680]">
                <span>{album.tracks.length} faixas</span>
                <span>~{totalMinutes} min</span>
                {badge && (
                  <span className="px-2 py-0.5 rounded-full border border-white/10">
                    {badge}
                  </span>
                )}
              </div>

              {/* Play all + upload buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  onClick={() => playAlbum(album)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-[#0D0D1A] transition-transform hover:scale-105"
                  style={{ backgroundColor: "#F5F0E6" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ouvir album
                </button>
                {(() => {
                  const allSaved = album.tracks.every(t => isSaved(album.slug, t.number));
                  return (
                    <button
                      onClick={() => {
                        if (!isPremium) { requestPlay(2, album.title, albumColor); return; }
                        saveAlbum(album);
                      }}
                      disabled={allSaved}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm border transition-colors ${
                        allSaved
                          ? "text-green-400 border-green-400/20 bg-green-400/5"
                          : "text-[#a0a0b0] border-white/10 hover:bg-white/5"
                      } disabled:cursor-default`}
                    >
                      {allSaved ? (
                        <>
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Guardado offline
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                          </svg>
                          Guardar offline
                        </>
                      )}
                    </button>
                  );
                })()}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: album.title,
                        text: `${album.title} — Loranne`,
                        url: `${window.location.origin}/album/${album.slug}`,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(`${album.title} — Loranne\n${window.location.origin}/album/${album.slug}`);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                  </svg>
                  Partilhar
                </button>
                <button
                  onClick={() => addToQueue(album.tracks, album)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tocar a seguir
                </button>
                <button
                  onClick={() => setShowPlaylistModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
                  </svg>
                  Adicionar a playlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="max-w-screen-lg mx-auto px-6 py-6">
        <div className="space-y-0.5">
          {album.tracks.map(track => {
            const trackVersions = versionsForTrack(track.number);
            const hasVer = trackVersions.length > 0;
            const isExpanded = expandedTrack === track.number;

            return (
              <div key={track.number}>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <TrackRow
                      track={track}
                      album={album}
                      isActive={currentTrack?.number === track.number && currentAlbum?.slug === album.slug}
                    />
                  </div>
                  {hasVer && (
                    <button
                      onClick={() => setExpandedTrack(isExpanded ? null : track.number)}
                      className="shrink-0 p-2 text-[#666680] hover:text-[#a0a0b0] transition-colors"
                      title={`${trackVersions.length} ${trackVersions.length === 1 ? "versão" : "versões"}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-[10px]">{trackVersions.length}v</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>

                {/* Expanded versions */}
                {hasVer && isExpanded && (
                  <div className="border-l-2 ml-8 mb-2" style={{ borderColor: `${albumColor}30` }}>
                    {trackVersions.map(v => (
                      <VersionRow
                        key={v.version_name}
                        version={v}
                        track={track}
                        album={album}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Album footer */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs text-[#666680]">
            {album.tracks.length} faixas — {fmt(totalDuration)} de duração total
          </p>
          <p className="text-xs text-[#666680] mt-1">
            Véus
          </p>
        </div>
      </div>

      {/* Playlist modal for album */}
      {showPlaylistModal && (
        <AddToPlaylistModal
          trackNumber={album.tracks[0]?.number || 1}
          albumSlug={album.slug}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}
