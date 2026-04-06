"use client";

import { useState, useEffect } from "react";
import type { TrackEnergy } from "@/data/albums";

export type TrackVersion = {
  id: string;
  album_slug: string;
  track_number: number;
  version_name: string;
  energy: TrackEnergy;
  audio_url: string;
  created_at: string;
};

export function useTrackVersions(energy?: TrackEnergy) {
  const [versions, setVersions] = useState<TrackVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/track-versions")
      .then(r => r.json())
      .then(data => {
        const all: TrackVersion[] = data.versions || [];
        if (energy) {
          setVersions(all.filter(v => v.energy === energy));
        } else {
          setVersions(all);
        }
      })
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [energy]);

  return { versions, loading };
}
