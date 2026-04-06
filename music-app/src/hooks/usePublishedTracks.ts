"use client";

import { useState, useEffect } from "react";

let cachedKeys: Set<string> | null = null;
let fetchPromise: Promise<Set<string>> | null = null;

/**
 * Shared hook for published track keys. Single fetch, shared across all components.
 */
export function usePublishedTracks() {
  const [keys, setKeys] = useState<Set<string>>(cachedKeys || new Set());
  const [loading, setLoading] = useState(!cachedKeys);

  useEffect(() => {
    if (cachedKeys) { setKeys(cachedKeys); setLoading(false); return; }

    if (!fetchPromise) {
      fetchPromise = fetch("/api/published-tracks")
        .then(r => r.json())
        .then(data => {
          const set = new Set<string>(data.tracks || []);
          cachedKeys = set;
          return set;
        })
        .catch(() => new Set<string>());
    }

    fetchPromise.then(set => {
      setKeys(set);
      setLoading(false);
    });
  }, []);

  return { publishedKeys: keys, loading };
}
