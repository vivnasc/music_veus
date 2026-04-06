"use client";

import { useState, useEffect } from "react";

export type PublishedAlbumInfo = {
  trackCount: number;
  publishedAt: string;
};

type PublishedData = {
  keys: Set<string>;
  albums: Record<string, PublishedAlbumInfo>;
};

let cached: PublishedData | null = null;
let fetchPromise: Promise<PublishedData> | null = null;

/**
 * Shared hook for published track keys and album publication dates.
 * Single fetch, shared across all components.
 */
export function usePublishedTracks() {
  const [data, setData] = useState<PublishedData>(cached || { keys: new Set(), albums: {} });
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) { setData(cached); setLoading(false); return; }

    if (!fetchPromise) {
      fetchPromise = fetch("/api/published-tracks")
        .then(r => r.json())
        .then(res => {
          const result: PublishedData = {
            keys: new Set<string>(res.tracks || []),
            albums: res.albums || {},
          };
          cached = result;
          return result;
        })
        .catch(() => ({ keys: new Set<string>(), albums: {} }));
    }

    fetchPromise.then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return {
    publishedKeys: data.keys,
    publishedAlbums: data.albums,
    loading,
  };
}
