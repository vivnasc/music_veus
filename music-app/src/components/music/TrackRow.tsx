"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useSubscriptionGate } from "@/contexts/SubscriptionContext";
import { useDownloads } from "@/hooks/useDownloads";
import { useLibrary } from "@/hooks/useLibrary";
import ShareModal from "./ShareModal";
import AddToPlaylistModal from "./AddToPlaylistModal";
import type { Album, AlbumTrack } from "@/data/albums";
import { getTrackCoverUrl, getAlbumCover } from "@/lib/album-covers";
import { useCustomTitles } from "@/hooks/useCustomTitles";

type Props = {
  track: AlbumTrack;
  album: Album;
  isActive: boolean;
};

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function TrackRow({ track, album, isActive }: Props) {
  const { playTrack, isPlaying, togglePlay, addToQueue } = useMusicPlayer();
  const { canPlay, requestPlay } = useSubscriptionGate();
  const { saveTrack, removeTrack, isSaved } = useDownloads();
  const { isFavorite: isFav, toggleFavorite, userId } = useLibrary();
  const { getTitle } = useCustomTitles();
  const router = useRouter();
  const albumColor = album.color || "#C9A96E";
  const displayTitle = getTitle(album.slug, track.number, track.title);
  const locked = !canPlay(track.number);
  const favorited = isFav(track.number, album.slug);
  const saved = isSaved(album.slug, track.number);

  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  function handleClick() {
    if (locked) {
      requestPlay(track.number, track.title, albumColor);
      return;
    }
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, album);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left min-h-[56px] ${
          isActive ? "bg-white/5" : "hover:bg-white/5"
        }`}
      >
        {/* Track cover with number overlay */}
        <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden relative bg-white/5">
          <Image
            src={getTrackCoverUrl(album.slug, track.number)}
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-cover"
            unoptimized
            onError={(e) => { (e.target as HTMLImageElement).src = getAlbumCover(album); }}
          />
          {/* Number or playing indicator overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            {isActive && isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-4">
                <div className="w-0.5 bg-white animate-pulse" style={{ height: "60%" }} />
                <div className="w-0.5 bg-white animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                <div className="w-0.5 bg-white animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
              </div>
            ) : locked ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-4 w-4 opacity-60">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            ) : (
              <span className="text-xs font-bold text-white/80">{track.number}</span>
            )}
          </div>
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm truncate ${isActive ? "font-semibold" : "text-[#F5F0E6]"}`}
            style={isActive ? { color: albumColor } : {}}
          >
            {displayTitle}
          </p>
          <p className="text-xs text-[#666680] truncate">{track.description}</p>
        </div>

        {/* Duration — desktop only */}
        <span className="hidden sm:block text-xs text-[#666680] tabular-nums shrink-0">
          {fmt(track.durationSeconds)}
        </span>

        {/* 3-dots menu — primary action on mobile */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-2 text-[#666680] hover:text-[#a0a0b0] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-56 py-1 rounded-xl bg-[#1A1A2E] border border-white/10 shadow-xl z-40">
              {/* Favorite */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  if (!userId) { router.push("/login"); return; }
                  toggleFavorite(track.number, album.slug);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F5F0E6] hover:bg-white/5 transition-colors text-left min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" fill={favorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${favorited ? "text-red-400" : "text-[#a0a0b0]"}`}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {favorited ? "Remover favorito" : "Favorito"}
              </button>

              {/* Save offline */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  if (locked) return;
                  saved ? removeTrack(album.slug, track.number) : saveTrack(track, album);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F5F0E6] hover:bg-white/5 transition-colors text-left min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${saved ? "text-green-400" : "text-[#a0a0b0]"}`}>
                  {saved ? <path d="M20 6L9 17l-5-5" /> : <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />}
                </svg>
                {saved ? "Remover do offline" : "Guardar offline"}
              </button>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  setShareOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F5F0E6] hover:bg-white/5 transition-colors text-left min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[#a0a0b0]">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                </svg>
                Partilhar
              </button>

              {/* Add to queue */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  addToQueue([track], album);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F5F0E6] hover:bg-white/5 transition-colors text-left min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[#a0a0b0]">
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tocar a seguir
              </button>

              {/* Add to playlist */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  setPlaylistOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F5F0E6] hover:bg-white/5 transition-colors text-left min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[#a0a0b0]">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Adicionar a playlist
              </button>

              {/* View album */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  router.push(`/album/${album.slug}`);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#F5F0E6] hover:bg-white/5 transition-colors text-left min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-[#a0a0b0]">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
                Ver album
              </button>

              {/* Info line */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2 text-[10px] text-[#666680]">
                <span>{track.lang}</span>
                <span>·</span>
                <span>{fmt(track.durationSeconds)}</span>
                {favorited && <span className="text-red-400">♥</span>}
                {saved && <span className="text-green-400">↓</span>}
              </div>
            </div>
          )}
        </div>
      </button>

      {shareOpen && (
        <ShareModal track={track} album={album} onClose={() => setShareOpen(false)} />
      )}
      {playlistOpen && (
        <AddToPlaylistModal
          trackNumber={track.number}
          albumSlug={album.slug}
          onClose={() => setPlaylistOpen(false)}
        />
      )}
    </>
  );
}
