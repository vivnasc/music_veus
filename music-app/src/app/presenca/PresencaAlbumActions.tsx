"use client";

import { useEffect, useState } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useSubscriptionGate } from "@/contexts/SubscriptionContext";
import AddToPlaylistModal from "@/components/music/AddToPlaylistModal";
import { getPresencaAlbumsAsAlbums, type PresencaSubSlug } from "@/data/presenca";

/**
 * Acções do álbum Presença — espelho do PresencaSubPlayer mas com
 * escopo de UM único álbum. Mantém as mesmas ferramentas que existem
 * na página da sub-coleção (e nos álbuns standard /album/{slug}):
 * Ouvir álbum · Aleatório · Tocar a seguir · Adicionar a playlist.
 *
 * Recebe o `albumSlug` (formato `presenca-{sub}-{...}`) e usa
 * /api/published-tracks para filtrar só faixas com áudio aprovado.
 */
export function PresencaAlbumActions({
  subSlug,
  albumSlug,
  albumTitle,
  accentColor,
}: {
  subSlug: PresencaSubSlug;
  albumSlug: string;
  albumTitle: string;
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

  // Slug efectivo do álbum no formato usado por ALL_ALBUMS / publishedKeys
  const fullSlug = `presenca-${subSlug}-${albumSlug}`;
  const album = getPresencaAlbumsAsAlbums().find((a) => a.slug === fullSlug);

  if (loading) {
    return <div className="mt-5 h-9 w-48 rounded-full bg-white/5 animate-pulse" />;
  }

  if (!album) {
    return null;
  }

  const playableTracks = album.tracks.filter((t) =>
    publishedKeys.has(`${album.slug}-t${t.number}`),
  );

  if (playableTracks.length === 0) {
    return (
      <p className="mt-5 text-[11px] text-[#666680]">
        Sem áudio publicado ainda — aprova faixas em{" "}
        <code className="text-[#C9A96E]">/admin/producao?filter=presenca</code> para tocar daqui.
      </p>
    );
  }

  function playAllInOrder() {
    if (!album) return;
    if (!isPremium) {
      requestPlay(2, albumTitle, accentColor);
      return;
    }
    // Passar só as faixas com áudio aprovado — caso contrário o player
    // tentaria tocar faixas sem mp3 no Supabase e parava após a primeira.
    if (playableTracks.length === 0) return;
    const filteredAlbum = { ...album, tracks: playableTracks };
    playAlbum(filteredAlbum);
  }

  function playShuffle() {
    if (!album) return;
    if (!isPremium) {
      requestPlay(2, albumTitle, accentColor);
      return;
    }
    if (playableTracks.length === 0) return;
    if (!shuffle) toggleShuffle();
    const filteredAlbum = { ...album, tracks: playableTracks };
    const randomStart = Math.floor(Math.random() * playableTracks.length);
    playAlbum(filteredAlbum, randomStart);
  }

  function addAllToQueue() {
    if (!album) return;
    if (!isPremium) {
      requestPlay(2, albumTitle, accentColor);
      return;
    }
    addToQueue(playableTracks, album);
  }

  const playlistBatch = playableTracks.map((t) => ({
    trackNumber: t.number,
    albumSlug: fullSlug,
  }));

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
          Ouvir álbum
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
          {playableTracks.length} {playableTracks.length === 1 ? "faixa" : "faixas"}
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
