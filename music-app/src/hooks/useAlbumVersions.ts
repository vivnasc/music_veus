"use client";

import { useState, useEffect } from "react";
import type { TrackEnergy } from "@/data/albums";

export type AlbumVersion = {
  track_number: number;
  version_name: string;
  energy: TrackEnergy;
};

export function useAlbumVersions(albumSlug: string) {
  const [versions, setVersions] = useState<AlbumVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!albumSlug) { setLoading(false); return; }
    fetch(`/api/music/album-versions?album=${encodeURIComponent(albumSlug)}`)
      .then(r => r.json())
      .then(data => setVersions(data.versions || []))
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [albumSlug]);

  const versionsForTrack = (trackNumber: number) =>
    versions.filter(v => v.track_number === trackNumber);

  const hasVersions = (trackNumber: number) =>
    versions.some(v => v.track_number === trackNumber);

  return { versions, versionsForTrack, hasVersions, loading };
}
