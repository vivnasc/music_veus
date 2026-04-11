"use client";

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type RecentEntry = {
  trackNumber: number;
  albumSlug: string;
  playedAt: string;
};

type CountMap = Record<string, number>;

// ─────────────────────────────────────────────
// localStorage keys
// ─────────────────────────────────────────────

const KEY_RECENTS = "veus:recents";
const KEY_PLAY_COUNTS = "veus:play-counts";
const KEY_ENERGY_COUNTS = "veus:energy-counts";
const KEY_FLAVOR_COUNTS = "veus:flavor-counts";

const MAX_RECENTS = 20;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silently ignore
  }
}

function topKey(counts: CountMap): string | null {
  let best: string | null = null;
  let max = 0;
  for (const [key, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      best = key;
    }
  }
  return best;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useLocalListeningData() {
  const [recents, setRecents] = useState<RecentEntry[]>([]);
  const [playCounts, setPlayCounts] = useState<CountMap>({});
  const [energyCounts, setEnergyCounts] = useState<CountMap>({});
  const [flavorCounts, setFlavorCounts] = useState<CountMap>({});

  // Hydrate from localStorage on mount (SSR-safe)
  useEffect(() => {
    setRecents(readJSON<RecentEntry[]>(KEY_RECENTS, []));
    setPlayCounts(readJSON<CountMap>(KEY_PLAY_COUNTS, {}));
    setEnergyCounts(readJSON<CountMap>(KEY_ENERGY_COUNTS, {}));
    setFlavorCounts(readJSON<CountMap>(KEY_FLAVOR_COUNTS, {}));
  }, []);

  const recordPlay = useCallback(
    (trackNumber: number, albumSlug: string, energy: string, flavor: string | null) => {
      // Update recents
      setRecents((prev) => {
        const filtered = prev.filter(
          (r) => !(r.trackNumber === trackNumber && r.albumSlug === albumSlug)
        );
        const next = [
          { trackNumber, albumSlug, playedAt: new Date().toISOString() },
          ...filtered,
        ].slice(0, MAX_RECENTS);
        writeJSON(KEY_RECENTS, next);
        return next;
      });

      // Update play counts
      const trackKey = `${albumSlug}:${trackNumber}`;
      setPlayCounts((prev) => {
        const next = { ...prev, [trackKey]: (prev[trackKey] || 0) + 1 };
        writeJSON(KEY_PLAY_COUNTS, next);
        return next;
      });

      // Update energy counts
      if (energy) {
        setEnergyCounts((prev) => {
          const next = { ...prev, [energy]: (prev[energy] || 0) + 1 };
          writeJSON(KEY_ENERGY_COUNTS, next);
          return next;
        });
      }

      // Update flavor counts
      if (flavor) {
        setFlavorCounts((prev) => {
          const next = { ...prev, [flavor]: (prev[flavor] || 0) + 1 };
          writeJSON(KEY_FLAVOR_COUNTS, next);
          return next;
        });
      }
    },
    []
  );

  const topEnergy = topKey(energyCounts);
  const topFlavor = topKey(flavorCounts);

  const totalPlays = Object.values(playCounts).reduce((a, b) => a + b, 0);

  return {
    recents,
    playCounts,
    energyCounts,
    flavorCounts,
    recordPlay,
    topEnergy,
    topFlavor,
    totalPlays,
  };
}
