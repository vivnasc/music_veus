"use client";

import { useEffect, useState } from "react";
import type { Album } from "@/data/albums";

let cache: Album[] | null = null;
let cachePromise: Promise<Album[]> | null = null;

async function fetchDbAlbums(): Promise<Album[]> {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = (async () => {
    try {
      const r = await fetch("/api/albums-db");
      if (!r.ok) return [];
      const data: { albums?: Album[] } = await r.json();
      cache = data.albums || [];
      return cache;
    } catch {
      cache = [];
      return cache;
    }
  })();
  return cachePromise;
}

/** Returns the list of published DB albums (in Album shape). Empty array while loading. */
export function useDbAlbums(): { albums: Album[]; loading: boolean } {
  const [albums, setAlbums] = useState<Album[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setAlbums(cache);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchDbAlbums().then((a) => {
      if (!cancelled) {
        setAlbums(a);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return { albums, loading };
}

/** Reset the in-memory cache (call after admin save so other pages refresh). */
export function clearDbAlbumsCache() {
  cache = null;
  cachePromise = null;
}
