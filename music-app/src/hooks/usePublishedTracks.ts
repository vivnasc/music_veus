"use client";

import { useState, useEffect } from "react";

let cachedKeys: Set<string> | null = null;
let cachedAlbumDates: Record<string, string> | null = null;
let fetchPromise: Promise<{ keys: Set<string>; albumDates: Record<string, string> }> | null = null;

/**
 * Shared hook for published track keys. Single fetch, shared across all components.
 */
export function usePublishedTracks() {
  const [keys, setKeys] = useState<Set<string>>(cachedKeys || new Set());
  const [albumDates, setAlbumDates] = useState<Record<string, string>>(cachedAlbumDates || {});
  const [loading, setLoading] = useState(!cachedKeys);

  useEffect(() => {
    if (cachedKeys) { setKeys(cachedKeys); setAlbumDates(cachedAlbumDates || {}); setLoading(false); return; }

    if (!fetchPromise) {
      fetchPromise = fetch("/api/published-tracks")
        .then(r => r.json())
        .then(data => {
          const set = new Set<string>(data.tracks || []);
          const dates = (data.albumDates || {}) as Record<string, string>;
          cachedKeys = set;
          cachedAlbumDates = dates;
          return { keys: set, albumDates: dates };
        })
        .catch(() => ({ keys: new Set<string>(), albumDates: {} as Record<string, string> }));
    }

    fetchPromise.then(result => {
      setKeys(result.keys);
      setAlbumDates(result.albumDates);
      setLoading(false);
    });
  }, []);

  return { publishedKeys: keys, albumDates, loading };
}
