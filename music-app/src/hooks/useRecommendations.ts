"use client";

import { useMemo } from "react";
import { useLocalListeningData } from "./useLocalListeningData";
import { buildTasteProfile, getRecommendations } from "@/lib/taste-engine";
import type { AlbumTrack, Album } from "@/data/albums";

type Recommendation = {
  track: AlbumTrack;
  album: Album;
};

export function useRecommendations(limit = 8): Recommendation[] {
  const { topEnergy, topFlavor, playCounts, totalPlays, energyCounts, flavorCounts, recents } =
    useLocalListeningData();

  return useMemo(() => {
    // Need at least 3 plays to generate recommendations
    if (totalPlays < 3) return [];
    if (!topEnergy && !topFlavor) return [];

    const profile = buildTasteProfile(energyCounts, flavorCounts, playCounts, recents);
    const scored = getRecommendations(profile, limit, { onlyWithAudio: true });

    return scored.map(({ track, album }) => ({ track, album }));
  }, [topEnergy, topFlavor, playCounts, totalPlays, energyCounts, flavorCounts, recents, limit]);
}
