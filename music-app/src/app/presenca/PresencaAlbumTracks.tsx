"use client";

import { useMemo } from "react";
import TrackRow from "@/components/music/TrackRow";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { getPresencaAlbumsAsAlbums, type PresencaSubSlug } from "@/data/presenca";

/**
 * Lista standard de faixas do álbum Presença — usa TrackRow (mesmo
 * componente do /album/{slug}). Substitui a antiga listagem com Suno
 * prompts que era admin-only.
 */
export function PresencaAlbumTracks({
  subSlug,
  albumSlug,
}: {
  subSlug: PresencaSubSlug;
  albumSlug: string;
}) {
  const { currentTrack, currentAlbum } = useMusicPlayer();
  const album = useMemo(() => {
    const fullSlug = `presenca-${subSlug}-${albumSlug}`;
    return getPresencaAlbumsAsAlbums().find((a) => a.slug === fullSlug);
  }, [subSlug, albumSlug]);

  if (!album) return null;

  return (
    <div className="space-y-1">
      {album.tracks.map((track) => (
        <TrackRow
          key={track.number}
          track={track}
          album={album}
          isActive={currentTrack?.number === track.number && currentAlbum?.slug === album.slug}
        />
      ))}
    </div>
  );
}
