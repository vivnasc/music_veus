"use client";

import { useState, useEffect, useCallback } from "react";

type TitleMap = Record<string, string>; // "albumSlug-tN" → custom title

let cachedTitles: TitleMap | null = null;

/**
 * Load custom track titles from track_metadata table.
 * Caches globally so multiple components share the same data.
 */
export function useCustomTitles() {
  const [titles, setTitles] = useState<TitleMap>(cachedTitles || {});

  useEffect(() => {
    if (cachedTitles) return;
    fetch("/api/music/titles")
      .then(r => r.json())
      .then(data => {
        const map: TitleMap = data.titles || {};
        cachedTitles = map;
        setTitles(map);
        try { sessionStorage.setItem("veus:titles", JSON.stringify(map)); } catch {}
      })
      .catch(() => {});
  }, []);

  const getTitle = useCallback((albumSlug: string, trackNumber: number, fallback: string): string => {
    const key = `${albumSlug}-t${trackNumber}`;
    return titles[key] || fallback;
  }, [titles]);

  return { getTitle, titles };
}
