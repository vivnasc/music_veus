"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "@/lib/admin-fetch";

type CoverMap = Record<string, number>; // albumSlug → track number

let cachedCovers: CoverMap | null = null;

/**
 * Load album cover track selections.
 * Returns which track number to use as album cover (default: 1).
 */
export function useAlbumCovers() {
  const [covers, setCovers] = useState<CoverMap>(cachedCovers || {});

  useEffect(() => {
    if (cachedCovers) return;
    fetch("/api/admin/album-cover")
      .then(r => r.json())
      .then(data => {
        const map: CoverMap = data.covers || {};
        cachedCovers = map;
        setCovers(map);
      })
      .catch(() => {});
  }, []);

  const getCoverTrack = useCallback((albumSlug: string): number => {
    return covers[albumSlug] || 1;
  }, [covers]);

  const setCoverTrack = useCallback(async (albumSlug: string, trackNumber: number) => {
    const res = await adminFetch("/api/admin/album-cover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ album_slug: albumSlug, track_number: trackNumber }),
    });
    if (res.ok) {
      const updated = { ...cachedCovers, [albumSlug]: trackNumber };
      cachedCovers = updated;
      setCovers(updated);
    }
    return res.ok;
  }, []);

  return { getCoverTrack, setCoverTrack, covers };
}
