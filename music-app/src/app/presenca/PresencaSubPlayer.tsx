"use client";

import { useEffect, useState } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useSubscriptionGate } from "@/contexts/SubscriptionContext";
import AddToPlaylistModal from "@/components/music/AddToPlaylistModal";
import { getPresencaAlbumsAsAlbums, type PresencaSubSlug } from "@/data/presenca";

/**
 * Player de sub-coleção Presença — Tocar tudo · Aleatório · Adicionar a playlist.
 *
 * Toca todos os álbuns da sub-coleção que têm áudio publicado, em sequência
 * (Tocar tudo) ou em shuffle. Filtra publishedKeys em /api/published-tracks
 * para não tocar faixas sem áudio gerado.
 *
 * Pode tocar UMA sub-coleção (passando `subSlug`) ou TODA a Presença (sem
 * subSlug).
 */
export function PresencaSubPlayer({
  subSlug,
  subLabel,
  accentColor,
}: {
  subSlug?: PresencaSubSlug;
  subLabel: string;
  accentColor: string;
}) {
  const { playAlbum, addToQueue, toggleShuffle, shuffle } = useMusicPlayer();
  const { isPremium, requestPlay } = useSubscriptionGate();
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Universo de álbuns Presença — todos ou só da sub indicada
  const allPresencaAlbums = getPresencaAlbumsAsAlbums();
  const scopedAlbums = subSlug
    ? allPresencaAlbums.filter((a) => a.slug.startsWith(`presenca-${subSlug}-`))
    : allPresencaAlbums;

  // Só álbuns com pelo menos UMA faixa publicada (áudio aprovado no Supabase)
  const playableAlbums = scopedAlbums.filter((album) =>
    album.tracks.some((t) => publishedKeys.has(`${album.slug}-t${t.number}`)),
  );

  // Faixas únicas reproduzíveis em todos os álbuns desta scope
  const totalPlayableTracks = playableAlbums.reduce(
    (sum, a) => sum + a.tracks.filter((t) => publishedKeys.has(`${a.slug}-t${t.number}`)).length,
    0,
  );

  if (loading) {
    return (
      <div className="mt-4 h-9 w-48 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (playableAlbums.length === 0) {
    return (
      <p className="mt-4 text-[11px] text-[#666680]">
        Sem áudio publicado ainda — aprova faixas em <code className="text-[#C9A96E]">/admin/producao?filter=presenca</code> para tocar daqui.
      </p>
    );
  }

  function playAllInOrder() {
    if (!isPremium) {
      requestPlay(2, subLabel, accentColor);
      return;
    }
    // Filtrar SEMPRE pelas tracks com áudio — caso contrário o player tenta
    // tocar faixas sem mp3 no Supabase e pára após a primeira.
    const albums = playableAlbums;
    const firstTracks = albums[0].tracks.filter((t) => publishedKeys.has(`${albums[0].slug}-t${t.number}`));
    if (firstTracks.length === 0) return;
    playAlbum({ ...albums[0], tracks: firstTracks });
    for (let i = 1; i < albums.length; i++) {
      const a = albums[i];
      const tracksWithAudio = a.tracks.filter((t) => publishedKeys.has(`${a.slug}-t${t.number}`));
      addToQueue(tracksWithAudio, a);
    }
  }

  function playShuffle() {
    if (!isPremium) {
      requestPlay(2, subLabel, accentColor);
      return;
    }
    if (!shuffle) toggleShuffle();
    const albums = playableAlbums;
    const firstIdx = Math.floor(Math.random() * albums.length);
    const first = albums[firstIdx];
    const firstTracks = first.tracks.filter((t) => publishedKeys.has(`${first.slug}-t${t.number}`));
    if (firstTracks.length === 0) return;
    const randomStart = Math.floor(Math.random() * firstTracks.length);
    playAlbum({ ...first, tracks: firstTracks }, randomStart);
    for (let i = 0; i < albums.length; i++) {
      if (i === firstIdx) continue;
      const a = albums[i];
      const tracksWithAudio = a.tracks.filter((t) => publishedKeys.has(`${a.slug}-t${t.number}`));
      addToQueue(tracksWithAudio, a);
    }
  }

  function addAllToQueue() {
    if (!isPremium) {
      requestPlay(2, subLabel, accentColor);
      return;
    }
    for (const a of playableAlbums) {
      const tracksWithAudio = a.tracks.filter((t) => publishedKeys.has(`${a.slug}-t${t.number}`));
      addToQueue(tracksWithAudio, a);
    }
  }

  // Batch de tracks para o AddToPlaylistModal (formato esperado pelo modal)
  const playlistBatch = playableAlbums.flatMap((a) =>
    a.tracks
      .filter((t) => publishedKeys.has(`${a.slug}-t${t.number}`))
      .map((t) => ({ trackNumber: t.number, albumSlug: a.slug })),
  );

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={playAllInOrder}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-black bg-[#F5F0E6] hover:bg-white transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M8 5v14l11-7z" />
          </svg>
          Ouvir tudo
        </button>
        <button
          onClick={playShuffle}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
            shuffle
              ? "text-[#C9A96E] border-[#C9A96E]/40 bg-[#C9A96E]/10"
              : "text-[#a0a0b0] border-white/10 hover:bg-white/5"
          }`}
          title="Aleatório"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Aleatório
        </button>
        <button
          onClick={addAllToQueue}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tocar a seguir
        </button>
        <button
          onClick={() => setShowPlaylistModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-[#a0a0b0] border border-white/10 hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />
          </svg>
          Adicionar a playlist
        </button>
        <span className="text-[11px] text-[#a0a0b0] ml-2">
          {playableAlbums.length} {playableAlbums.length === 1 ? "álbum" : "álbuns"} · {totalPlayableTracks} faixas
        </span>
      </div>

      {showPlaylistModal && (
        <AddToPlaylistModal
          trackNumber={playlistBatch[0]?.trackNumber || 1}
          albumSlug={playlistBatch[0]?.albumSlug || ""}
          batch={playlistBatch}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
}
