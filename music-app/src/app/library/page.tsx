"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ALL_ALBUMS } from "@/data/albums";
import type { Album, AlbumTrack } from "@/data/albums";
import { useMusicPlayer, formatTime as fmt } from "@/contexts/MusicPlayerContext";
import { useLibrary } from "@/hooks/useLibrary";
import { useDownloads } from "@/hooks/useDownloads";
import { usePlaylists } from "@/hooks/usePlaylists";
import { usePublishedTracks } from "@/hooks/usePublishedTracks";
import { getAlbumCover } from "@/lib/album-covers";
import AlbumCard from "@/components/music/AlbumCard";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function resolveTrack(trackNumber: number, albumSlug: string) {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) return null;
  const track = album.tracks.find(t => t.number === trackNumber);
  if (!track) return null;
  return { track, album };
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `ha ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `ha ${hours}h`;
  const days = Math.floor(hours / 24);
  return `ha ${days}d`;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

type Tab = "albums" | "favoritos" | "playlists" | "recentes" | "offline";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("albums");
  const { publishedKeys } = usePublishedTracks();
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { favorites, recents } = useLibrary();
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay } = useMusicPlayer();
  const { savedMeta, removeTrack } = useDownloads();
  const { playlists, createPlaylist, deletePlaylist, userId: playlistUserId } = usePlaylists();
  const router = useRouter();

  function handleTrackClick(track: AlbumTrack, album: Album) {
    if (currentTrack?.number === track.number && currentAlbum?.slug === album.slug) {
      togglePlay();
    } else {
      playTrack(track, album);
    }
  }

  function playAllFavorites() {
    if (favorites.length === 0) return;
    const resolved = favorites
      .slice()
      .reverse()
      .map(f => resolveTrack(f.trackNumber, f.albumSlug))
      .filter(Boolean) as { track: AlbumTrack; album: Album }[];
    if (resolved.length === 0) return;
    const trackList = resolved.map(r => ({ ...r.track, albumSlug: r.album.slug }));
    playTrack(resolved[0].track, resolved[0].album, trackList);
  }

  async function handleCreatePlaylist(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const id = await createPlaylist(newPlaylistName.trim());
    setCreatingPlaylist(false);
    setNewPlaylistName("");
    if (id) router.push(`/playlists/${id}`);
  }

  // Albums with at least one published track
  const publishedAlbums = ALL_ALBUMS.filter(album =>
    album.tracks.some(t => publishedKeys.has(`${album.slug}-t${t.number}`))
  );

  const tabs: { key: Tab; label: string; count?: number; icon?: React.ReactNode }[] = [
    { key: "albums", label: "Albums", count: publishedAlbums.length },
    { key: "favoritos", label: "Favoritos" },
    { key: "playlists", label: "Playlists" },
    { key: "recentes", label: "Recentes" },
    {
      key: "offline",
      label: "Offline",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a0a0b0]">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">A tua biblioteca</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? "text-[#F5F0E6] border-[#C9A96E]"
                  : "text-[#666680] border-transparent hover:text-[#a0a0b0]"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.key === "offline" && savedMeta.length > 0 && (
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{savedMeta.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-32">
        {/* ── ALBUMS PUBLICADOS ── */}
        {activeTab === "albums" && (
          publishedAlbums.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333350" strokeWidth="1.5" className="mb-4">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
              <p className="text-sm text-[#666680]">Nenhum album publicado ainda</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {publishedAlbums.map(album => (
                <AlbumCard key={album.slug} album={album} />
              ))}
            </div>
          )
        )}

        {/* ── FAVORITOS ── */}
        {activeTab === "favoritos" && (
          favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333350] mb-4">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p className="text-[#F5F0E6] font-medium mb-1">Ainda sem favoritos</p>
              <p className="text-sm text-[#666680]">Toca no coracao ao ouvir uma faixa</p>
            </div>
          ) : (
            <>
              {/* Play all + count */}
              <div className="flex items-center justify-between pt-4 mb-3">
                <button
                  onClick={playAllFavorites}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A96E] text-[#0D0D1A] text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ouvir tudo
                </button>
                <span className="text-xs text-[#666680]">{favorites.length} faixas</span>
              </div>

              <div className="space-y-0.5">
                {favorites
                  .slice()
                  .reverse()
                  .map(fav => {
                    const resolved = resolveTrack(fav.trackNumber, fav.albumSlug);
                    if (!resolved) return null;
                    const { track, album } = resolved;
                    const isActive = currentTrack?.number === track.number && currentAlbum?.slug === album.slug;

                    return (
                      <button
                        key={`${fav.albumSlug}-${fav.trackNumber}`}
                        onClick={() => handleTrackClick(track, album)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                          isActive ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="shrink-0">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>{track.title}</p>
                          <p className="text-xs text-[#666680] truncate">{album.title}</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-medium text-[#666680] bg-white/5 px-1.5 py-0.5 rounded">{track.lang}</span>
                        <span className="shrink-0 text-xs text-[#666680] tabular-nums w-10 text-right">{fmt(track.durationSeconds)}</span>
                      </button>
                    );
                  })}
              </div>
            </>
          )
        )}

        {/* ── PLAYLISTS ── */}
        {activeTab === "playlists" && (
          <div className="pt-4">
            {/* Create playlist */}
            {creatingPlaylist ? (
              <form onSubmit={handleCreatePlaylist} className="flex gap-2 mb-4">
                <input
                  autoFocus
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  placeholder="Nome da playlist..."
                  className="flex-1 bg-white/10 text-sm px-3 py-2 rounded-lg border border-white/10 focus:border-[#C9A96E]/50 outline-none placeholder:text-[#666680]"
                />
                <button type="submit" className="px-3 py-2 text-sm text-[#C9A96E] hover:bg-white/5 rounded-lg">Criar</button>
                <button type="button" onClick={() => { setCreatingPlaylist(false); setNewPlaylistName(""); }} className="px-3 py-2 text-sm text-[#666680] hover:bg-white/5 rounded-lg">Cancelar</button>
              </form>
            ) : (
              <button
                onClick={() => { if (!playlistUserId) { router.push("/login"); return; } setCreatingPlaylist(true); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors text-left mb-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#C9A96E]/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-5 w-5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F5F0E6]">Criar playlist</p>
                  <p className="text-xs text-[#666680]">Organiza as tuas faixas</p>
                </div>
              </button>
            )}

            {/* Top tracks shortcut */}
            <Link
              href="/top"
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors text-left mb-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" className="h-5 w-5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[#F5F0E6]">Mais ouvidas</p>
                <p className="text-xs text-[#666680]">As tuas faixas mais escutadas</p>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#666680" strokeWidth="2" className="h-4 w-4 ml-auto shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Playlist list */}
            {playlists.length === 0 && !creatingPlaylist ? (
              <div className="flex flex-col items-center justify-center pt-16 text-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#333350] mb-4">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
                <p className="text-[#F5F0E6] font-medium mb-1">Sem playlists</p>
                <p className="text-sm text-[#666680]">Cria a tua primeira playlist</p>
              </div>
            ) : (
              <div className="space-y-1">
                {playlists.map(pl => (
                  <Link
                    key={pl.id}
                    href={`/playlists/${pl.id}`}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#a0a0b0" strokeWidth="2" className="h-5 w-5">
                        <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F5F0E6] truncate">{pl.name}</p>
                      <p className="text-xs text-[#666680]">{pl.trackCount} faixas</p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#666680" strokeWidth="2" className="h-4 w-4 shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── RECENTES ── */}
        {activeTab === "recentes" && (
          recents.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#333350] mb-4">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-[#F5F0E6] font-medium mb-1">Ainda sem histórico</p>
              <p className="text-sm text-[#666680]">As faixas que ouves aparecem aqui</p>
            </div>
          ) : (
            <div className="pt-4 space-y-0.5">
              {recents.map(rec => {
                const resolved = resolveTrack(rec.trackNumber, rec.albumSlug);
                if (!resolved) return null;
                const { track, album } = resolved;
                const isActive = currentTrack?.number === track.number && currentAlbum?.slug === album.slug;

                return (
                  <button
                    key={`${rec.albumSlug}-${rec.trackNumber}-${rec.playedAt}`}
                    onClick={() => handleTrackClick(track, album)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>{track.title}</p>
                      <p className="text-xs text-[#666680] truncate">{album.title}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium text-[#666680] bg-white/5 px-1.5 py-0.5 rounded">{track.lang}</span>
                    <span className="shrink-0 text-xs text-[#666680] tabular-nums w-16 text-right">{timeAgo(rec.playedAt)}</span>
                  </button>
                );
              })}
            </div>
          )
        )}

        {/* ── OFFLINE ── */}
        {activeTab === "offline" && (
          savedMeta.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-24 text-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-[#333350] mb-4">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <p className="text-[#F5F0E6] font-medium mb-1">Nada guardado offline</p>
              <p className="text-sm text-[#666680] max-w-[240px]">Toca no icone de download numa faixa para a ouvir sem internet</p>
            </div>
          ) : (
            <div className="pt-4 space-y-0.5">
              {savedMeta.map(meta => {
                const resolved = resolveTrack(meta.trackNumber, meta.albumSlug);
                if (!resolved) return null;
                const { track, album } = resolved;
                const isActive = currentTrack?.number === track.number && currentAlbum?.slug === album.slug;

                return (
                  <div
                    key={`${meta.albumSlug}-${meta.trackNumber}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <button
                      onClick={() => handleTrackClick(track, album)}
                      className="flex-1 flex items-center gap-3 min-w-0 text-left"
                    >
                      <div className="shrink-0">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-green-400/60">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>{track.title}</p>
                        <p className="text-xs text-[#666680] truncate">{album.title}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-medium text-[#666680] bg-white/5 px-1.5 py-0.5 rounded">{track.lang}</span>
                      <span className="shrink-0 text-xs text-[#666680] tabular-nums w-10 text-right">{fmt(track.durationSeconds)}</span>
                    </button>
                    <button
                      onClick={() => removeTrack(meta.albumSlug, meta.trackNumber)}
                      className="shrink-0 p-1.5 text-[#666680] hover:text-red-400 transition-colors"
                      title="Remover do offline"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
