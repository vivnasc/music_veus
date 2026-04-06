"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ALL_ALBUMS } from "@/data/albums";
import type { Album, AlbumTrack } from "@/data/albums";
import { useMusicPlayer, formatTime as fmt } from "@/contexts/MusicPlayerContext";
import { usePlaylists, type PlaylistTrack } from "@/hooks/usePlaylists";

function resolveTrack(trackNumber: number, albumSlug: string) {
  const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
  if (!album) return null;
  const track = album.tracks.find(t => t.number === trackNumber);
  if (!track) return null;
  return { track, album };
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { playlists, getPlaylistTracks, removeFromPlaylist, deletePlaylist, renamePlaylist } = usePlaylists();
  const { playTrack, currentTrack, currentAlbum, isPlaying, togglePlay } = useMusicPlayer();

  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const playlist = playlists.find(p => p.id === id);

  const loadTracks = useCallback(async () => {
    if (!id) return;
    const t = await getPlaylistTracks(id);
    setTracks(t);
    setLoading(false);
  }, [id, getPlaylistTracks]);

  useEffect(() => { loadTracks(); }, [loadTracks]);

  function handleTrackClick(track: AlbumTrack, album: Album) {
    if (currentTrack?.number === track.number && currentAlbum?.slug === album.slug) {
      togglePlay();
    } else {
      const resolved = tracks
        .map(t => resolveTrack(t.trackNumber, t.albumSlug))
        .filter(Boolean) as { track: AlbumTrack; album: Album }[];
      const trackList = resolved.map(r => ({ ...r.track, albumSlug: r.album.slug }));
      playTrack(track, album, trackList);
    }
  }

  function playAll() {
    const resolved = tracks
      .map(t => resolveTrack(t.trackNumber, t.albumSlug))
      .filter(Boolean) as { track: AlbumTrack; album: Album }[];
    if (resolved.length === 0) return;
    const trackList = resolved.map(r => ({ ...r.track, albumSlug: r.album.slug }));
    playTrack(resolved[0].track, resolved[0].album, trackList);
  }

  async function handleRemoveTrack(trackNumber: number, albumSlug: string) {
    await removeFromPlaylist(id, trackNumber, albumSlug);
    setTracks(prev => prev.filter(t => !(t.trackNumber === trackNumber && t.albumSlug === albumSlug)));
  }

  async function handleDelete() {
    await deletePlaylist(id);
    router.push("/library");
  }

  async function handleRename() {
    if (newName.trim()) {
      await renamePlaylist(id, newName.trim());
    }
    setEditing(false);
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6]">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a0a0b0]">
              <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            {editing ? (
              <form onSubmit={(e) => { e.preventDefault(); handleRename(); }} className="flex gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="flex-1 bg-white/10 text-sm px-3 py-1.5 rounded-lg border border-white/10 focus:border-[#C9A96E]/50 outline-none"
                />
                <button type="submit" className="text-xs text-[#C9A96E]">OK</button>
                <button type="button" onClick={() => setEditing(false)} className="text-xs text-[#666680]">Cancelar</button>
              </form>
            ) : (
              <button onClick={() => { setEditing(true); setNewName(playlist?.name || ""); }} className="text-left">
                <h1 className="text-lg font-semibold truncate">{playlist?.name || "Playlist"}</h1>
                <p className="text-xs text-[#666680]">{tracks.length} faixas</p>
              </button>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-[#666680] hover:text-red-400 transition-colors"
            title="Apagar playlist"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 pb-32">
        {loading ? (
          <div className="pt-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#333350] mb-4">
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
            <p className="text-[#F5F0E6] font-medium mb-1">Playlist vazia</p>
            <p className="text-sm text-[#666680]">Adiciona faixas a partir do menu de 3 pontos</p>
          </div>
        ) : (
          <>
            <div className="pt-4 mb-4">
              <button
                onClick={playAll}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A96E] text-[#0D0D1A] text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Ouvir tudo
              </button>
            </div>

            <div className="space-y-0.5">
              {tracks.map(item => {
                const resolved = resolveTrack(item.trackNumber, item.albumSlug);
                if (!resolved) return null;
                const { track, album } = resolved;
                const isActive = currentTrack?.number === track.number && currentAlbum?.slug === album.slug;

                return (
                  <div
                    key={`${item.albumSlug}-${item.trackNumber}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <button
                      onClick={() => handleTrackClick(track, album)}
                      className="flex-1 flex items-center gap-3 min-w-0 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>
                          {track.title}
                        </p>
                        <p className="text-xs text-[#666680] truncate">{album.title}</p>
                      </div>
                      <span className="text-[10px] text-[#666680] bg-white/5 px-1.5 py-0.5 rounded shrink-0">
                        {track.lang}
                      </span>
                      <span className="text-xs text-[#666680] tabular-nums w-10 text-right shrink-0">
                        {fmt(track.durationSeconds)}
                      </span>
                    </button>
                    <button
                      onClick={() => handleRemoveTrack(item.trackNumber, item.albumSlug)}
                      className="shrink-0 p-1.5 text-[#666680] hover:text-red-400 transition-colors"
                      title="Remover da playlist"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
