"use client";

import { useState, useEffect, useCallback } from "react";

type LyricsMap = Record<string, string>; // "albumSlug/trackNumber" → custom lyrics

let cachedLyrics: LyricsMap | null = null;

/**
 * Load custom (edited) lyrics from track_custom_lyrics table.
 * Caches globally so multiple components share the same data.
 */
export function useCustomLyrics() {
  const [lyrics, setLyrics] = useState<LyricsMap>(cachedLyrics || {});

  useEffect(() => {
    if (cachedLyrics) return;
    fetch("/api/music/lyrics")
      .then(r => r.json())
      .then(data => {
        const map: LyricsMap = data.lyrics || {};
        cachedLyrics = map;
        setLyrics(map);
      })
      .catch(() => {});
  }, []);

  const getLyrics = useCallback((albumSlug: string, trackNumber: number, fallback: string): string => {
    const key = `${albumSlug}/${trackNumber}`;
    return lyrics[key] || fallback;
  }, [lyrics]);

  /** Force refresh (e.g. after editing in production page) */
  const refresh = useCallback(() => {
    cachedLyrics = null;
    fetch("/api/music/lyrics")
      .then(r => r.json())
      .then(data => {
        const map: LyricsMap = data.lyrics || {};
        cachedLyrics = map;
        setLyrics(map);
      })
      .catch(() => {});
  }, []);

  return { getLyrics, lyrics, refresh };
}
