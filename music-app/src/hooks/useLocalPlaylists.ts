"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "veus:playlists";

export type LocalPlaylist = {
  id: string;
  name: string;
  tracks: { trackNumber: number; albumSlug: string }[];
  createdAt: string;
};

function load(): LocalPlaylist[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(playlists: LocalPlaylist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
}

export function useLocalPlaylists() {
  const [playlists, setPlaylists] = useState<LocalPlaylist[]>([]);

  useEffect(() => {
    setPlaylists(load());
  }, []);

  const createPlaylist = useCallback((name: string): string => {
    const id = crypto.randomUUID();
    const pl: LocalPlaylist = { id, name, tracks: [], createdAt: new Date().toISOString() };
    const updated = [...load(), pl];
    save(updated);
    setPlaylists(updated);
    return id;
  }, []);

  const addToPlaylist = useCallback((playlistId: string, trackNumber: number, albumSlug: string) => {
    const all = load();
    const pl = all.find(p => p.id === playlistId);
    if (!pl) return;
    if (pl.tracks.some(t => t.trackNumber === trackNumber && t.albumSlug === albumSlug)) return;
    pl.tracks.push({ trackNumber, albumSlug });
    save(all);
    setPlaylists([...all]);
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, trackNumber: number, albumSlug: string) => {
    const all = load();
    const pl = all.find(p => p.id === playlistId);
    if (!pl) return;
    pl.tracks = pl.tracks.filter(t => !(t.trackNumber === trackNumber && t.albumSlug === albumSlug));
    save(all);
    setPlaylists([...all]);
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    const updated = load().filter(p => p.id !== playlistId);
    save(updated);
    setPlaylists(updated);
  }, []);

  const renamePlaylist = useCallback((playlistId: string, name: string) => {
    const all = load();
    const pl = all.find(p => p.id === playlistId);
    if (!pl) return;
    pl.name = name;
    save(all);
    setPlaylists([...all]);
  }, []);

  return { playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist, renamePlaylist };
}
