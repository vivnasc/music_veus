"use client";

import { useState, useEffect, useCallback } from "react";
import type { Album, AlbumTrack } from "@/data/albums";

/**
 * Offline audio cache using IndexedDB.
 * Audio files are stored as blobs inside the browser — they never leave the app.
 * When offline, the player uses the cached blob URL instead of the streaming proxy.
 */

type SavedTrackMeta = {
  albumSlug: string;
  trackNumber: number;
  title: string;
  albumTitle: string;
  albumColor: string;
  lang: string;
  durationSeconds: number;
  savedAt: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

const DB_NAME = "veus-offline";
const DB_VERSION = 1;
const AUDIO_STORE = "audio";
const META_STORE = "meta";

function trackKey(albumSlug: string, trackNumber: number) {
  return `${albumSlug}/${trackNumber}`;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE);
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function putBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, "readwrite");
    tx.objectStore(AUDIO_STORE).put(blob, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getBlob(key: string): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, "readonly");
    const req = tx.objectStore(AUDIO_STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function deleteBlob(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, "readwrite");
    tx.objectStore(AUDIO_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function putMeta(key: string, meta: SavedTrackMeta): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readwrite");
    tx.objectStore(META_STORE).put(meta, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function deleteMeta(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readwrite");
    tx.objectStore(META_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllMeta(): Promise<SavedTrackMeta[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readonly");
    const req = tx.objectStore(META_STORE).getAll();
    req.onsuccess = () => resolve(req.result as SavedTrackMeta[]);
    req.onerror = () => reject(req.error);
  });
}

async function getAllKeys(): Promise<string[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(AUDIO_STORE, "readonly");
    const req = tx.objectStore(AUDIO_STORE).getAllKeys();
    req.onsuccess = () => resolve(req.result as string[]);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get a blob URL for a cached track.
 * Returns null if the track is not cached.
 */
export async function getCachedAudioUrl(albumSlug: string, trackNumber: number): Promise<string | null> {
  try {
    const blob = await getBlob(trackKey(albumSlug, trackNumber));
    if (!blob) return null;
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export function useDownloads() {
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [savedMeta, setSavedMeta] = useState<SavedTrackMeta[]>([]);
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({});

  // Load saved track keys on mount
  useEffect(() => {
    getAllKeys().then(keys => setSavedKeys(new Set(keys))).catch(() => {});
    getAllMeta().then(metas => {
      metas.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      setSavedMeta(metas);
    }).catch(() => {});
  }, []);

  const isSaved = useCallback(
    (albumSlug: string, trackNumber: number) => savedKeys.has(trackKey(albumSlug, trackNumber)),
    [savedKeys]
  );

  const saveTrack = useCallback(async (track: AlbumTrack, album: Album) => {
    const key = trackKey(album.slug, track.number);
    setSaveStates(prev => ({ ...prev, [key]: "saving" }));

    try {
      // Fetch the audio via the streaming proxy
      const url = `/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${track.number}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Falhou");
      const blob = await res.blob();

      // Store audio blob in IndexedDB
      await putBlob(key, blob);

      // Store metadata
      const meta: SavedTrackMeta = {
        albumSlug: album.slug,
        trackNumber: track.number,
        title: track.title,
        albumTitle: album.title,
        albumColor: album.color,
        lang: track.lang,
        durationSeconds: track.durationSeconds,
        savedAt: new Date().toISOString(),
      };
      await putMeta(key, meta);

      setSavedKeys(prev => new Set([...prev, key]));
      setSavedMeta(prev => [meta, ...prev.filter(m => trackKey(m.albumSlug, m.trackNumber) !== key)]);
      setSaveStates(prev => ({ ...prev, [key]: "saved" }));
    } catch {
      setSaveStates(prev => ({ ...prev, [key]: "error" }));
    }
  }, []);

  const removeTrack = useCallback(async (albumSlug: string, trackNumber: number) => {
    const key = trackKey(albumSlug, trackNumber);
    try {
      await deleteBlob(key);
      await deleteMeta(key);
      setSavedKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
      setSavedMeta(prev => prev.filter(m => trackKey(m.albumSlug, m.trackNumber) !== key));
      setSaveStates(prev => ({ ...prev, [key]: "idle" }));
    } catch {
      // ignore
    }
  }, []);

  const saveAlbum = useCallback(async (album: Album) => {
    for (const track of album.tracks) {
      if (!savedKeys.has(trackKey(album.slug, track.number))) {
        await saveTrack(track, album);
      }
    }
  }, [saveTrack, savedKeys]);

  const getSaveState = useCallback(
    (albumSlug: string, trackNumber: number): SaveState => {
      const key = trackKey(albumSlug, trackNumber);
      if (saveStates[key]) return saveStates[key];
      return savedKeys.has(key) ? "saved" : "idle";
    },
    [saveStates, savedKeys]
  );

  return {
    savedMeta,
    isSaved,
    saveTrack,
    removeTrack,
    saveAlbum,
    getSaveState,
  };
}
