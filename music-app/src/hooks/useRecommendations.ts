"use client";

import { useMemo } from "react";
import { useLocalListeningData } from "./useLocalListeningData";
import { ALL_ALBUMS, type AlbumTrack, type Album } from "@/data/albums";

type Recommendation = {
  track: AlbumTrack;
  album: Album;
};

function allTracks(): { track: AlbumTrack; album: Album }[] {
  return ALL_ALBUMS.flatMap((album) =>
    album.tracks.map((track) => ({ track, album }))
  );
}

export function useRecommendations(limit = 8): Recommendation[] {
  const { topEnergy, topFlavor, playCounts, totalPlays } =
    useLocalListeningData();

  return useMemo(() => {
    // Need at least 3 plays to generate recommendations
    if (totalPlays < 3) return [];
    if (!topEnergy && !topFlavor) return [];

    const playedSet = new Set(Object.keys(playCounts));

    const candidates = allTracks().filter(({ track, album }) => {
      // Must have audio
      if (!track.audioUrl) return false;
      // Must not have been played
      const key = `${album.slug}:${track.number}`;
      return !playedSet.has(key);
    });

    // Score by energy/flavor match
    const scored = candidates.map(({ track, album }) => {
      let score = 0;
      if (topEnergy && track.energy === topEnergy) score += 2;
      if (topFlavor && track.flavor === topFlavor) score += 1;
      return { track, album, score };
    });

    // Sort by score descending, then by track number for stable order
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.track.number - b.track.number;
    });

    return scored.slice(0, limit).map(({ track, album }) => ({ track, album }));
  }, [topEnergy, topFlavor, playCounts, totalPlays, limit]);
}
