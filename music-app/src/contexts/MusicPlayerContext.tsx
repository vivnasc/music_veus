"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { ALL_ALBUMS, type Album, type AlbumTrack } from "@/data/albums";
import { getCachedAudioUrl } from "@/hooks/useDownloads";
import { getAlbumCover } from "@/lib/album-covers";
import { supabase } from "@/lib/supabase";

export function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// Extended track type that may carry albumSlug from curated lists
type QueueTrack = AlbumTrack & { albumSlug?: string };

/**
 * Resolve the album for a track in the queue.
 * If track has albumSlug (from curated list), use that. Otherwise fallback to queueAlbum.
 */
function resolveAlbumForTrack(track: QueueTrack, fallback: Album | null): Album | null {
  if (track.albumSlug) {
    return ALL_ALBUMS.find(a => a.slug === track.albumSlug) || fallback;
  }
  return fallback;
}

function proxyUrl(track: AlbumTrack, album: Album): string {
  if (track.audioUrl?.startsWith("/api/music/stream")) return track.audioUrl;
  return `/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${track.number}`;
}

async function resolveAudioSrc(track: AlbumTrack, album: Album): Promise<string> {
  try {
    const cached = await getCachedAudioUrl(album.slug, track.number);
    if (cached) return cached;
  } catch {
    // IndexedDB unavailable, fall through
  }
  return proxyUrl(track, album);
}

type RepeatMode = "off" | "all" | "one";

type MusicPlayerState = {
  currentTrack: AlbumTrack | null;
  currentAlbum: Album | null;
  queue: QueueTrack[];
  queueAlbum: Album | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  shuffleHistory: number[];
  infinite: boolean;
  repeat: RepeatMode;
  showFullPlayer: boolean;
  showLyrics: boolean;
  audioError: string | null;
  previewMode: boolean;
  previewExpired: boolean;
};

type MusicPlayerActions = {
  playTrack: (track: AlbumTrack, album: Album, trackList?: AlbumTrack[]) => void;
  playAlbum: (album: Album, startIndex?: number) => void;
  addToQueue: (tracks: AlbumTrack[], album: Album) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  toggleInfinite: () => void;
  cycleRepeat: () => void;
  setShowFullPlayer: (v: boolean) => void;
  clearPreviewExpired: () => void;
  setShowLyrics: (v: boolean) => void;
  clearAudioError: () => void;
  stop: () => void;
};

const MusicPlayerContext = createContext<(MusicPlayerState & MusicPlayerActions) | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return ctx;
}

async function setSourceAndPlay(
  audio: HTMLAudioElement,
  track: AlbumTrack,
  album: Album,
  prevBlobRef: React.MutableRefObject<string | null>
) {
  if (prevBlobRef.current) {
    URL.revokeObjectURL(prevBlobRef.current);
    prevBlobRef.current = null;
  }

  const src = await resolveAudioSrc(track, album);

  if (src.startsWith("blob:")) {
    prevBlobRef.current = src;
  }

  audio.src = src;
  audio.play().catch(() => {});
}

// Persist queue to localStorage
const QUEUE_KEY = "veus:player-queue";

function saveQueue(state: MusicPlayerState) {
  try {
    if (!state.currentTrack || !state.currentAlbum) {
      localStorage.removeItem(QUEUE_KEY);
      return;
    }
    localStorage.setItem(QUEUE_KEY, JSON.stringify({
      trackNumber: state.currentTrack.number,
      albumSlug: state.currentAlbum.slug,
      queue: state.queue.map(t => ({ number: t.number, albumSlug: (t as QueueTrack).albumSlug })),
      queueAlbumSlug: state.queueAlbum?.slug || null,
      shuffle: state.shuffle,
      repeat: state.repeat,
      infinite: state.infinite,
    }));
  } catch {}
}

function loadQueue(): Partial<MusicPlayerState> | null {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const album = ALL_ALBUMS.find(a => a.slug === saved.albumSlug);
    const track = album?.tracks.find(t => t.number === saved.trackNumber);
    if (!album || !track) return null;

    const queueAlbum = saved.queueAlbumSlug ? ALL_ALBUMS.find(a => a.slug === saved.queueAlbumSlug) || album : album;
    const queue: QueueTrack[] = (saved.queue || []).map((q: { number: number; albumSlug?: string }) => {
      const qa = q.albumSlug ? ALL_ALBUMS.find(a => a.slug === q.albumSlug) : queueAlbum;
      const qt = qa?.tracks.find(t => t.number === q.number);
      return qt ? { ...qt, albumSlug: qa?.slug } : null;
    }).filter(Boolean) as QueueTrack[];

    return {
      currentTrack: track,
      currentAlbum: album,
      queue: queue.length > 0 ? queue : album.tracks,
      queueAlbum: queueAlbum,
      shuffle: saved.shuffle || false,
      repeat: saved.repeat || "off",
      infinite: saved.infinite || false,
    };
  } catch { return null; }
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [state, setState] = useState<MusicPlayerState>(() => {
    const base: MusicPlayerState = {
      currentTrack: null,
      currentAlbum: null,
      queue: [],
      queueAlbum: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      shuffle: false,
      shuffleHistory: [],
      infinite: false,
      repeat: "off",
      showFullPlayer: false,
      showLyrics: false,
      audioError: null,
      previewMode: false,
      previewExpired: false,
    };
    if (typeof window === "undefined") return base;
    const saved = loadQueue();
    return saved ? { ...base, ...saved } : base;
  });

  // Persist queue changes
  useEffect(() => {
    saveQueue(state);
  }, [state.currentTrack, state.currentAlbum, state.queue, state.shuffle, state.repeat, state.infinite]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
    }
    const audio = audioRef.current;

    const PREVIEW_LIMIT = 45;
    const onTime = () => setState(s => {
      // Preview mode: pause at 45s for non-logged users
      if (s.previewMode && audio.currentTime >= PREVIEW_LIMIT) {
        audio.pause();
        return { ...s, currentTime: audio.currentTime, isPlaying: false, previewExpired: true };
      }
      // Fallback: if duration is still 0 and audio.duration is now valid, update it
      if (s.duration === 0 && isFinite(audio.duration) && audio.duration > 0) {
        return { ...s, currentTime: audio.currentTime, duration: audio.duration };
      }
      return { ...s, currentTime: audio.currentTime };
    });
    const onMeta = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setState(s => ({ ...s, duration: audio.duration }));
      }
    };
    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setState(s => ({ ...s, duration: audio.duration }));
      }
    };
    const onEnded = () => handleEnded();
    const onPlay = () => setState(s => ({ ...s, isPlaying: true }));
    const onPause = () => setState(s => ({ ...s, isPlaying: false }));
    const onError = () => {
      setState(s => ({
        ...s,
        isPlaying: false,
        audioError: s.currentTrack
          ? `"${s.currentTrack.title}" ainda não tem áudio disponível.`
          : "Erro ao carregar áudio.",
      }));
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    // Check auth — preview mode for non-logged users
    supabase.auth.getUser().then(({ data }) => {
      setState(s => ({ ...s, previewMode: !data.user }));
    });

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnded = useCallback(() => {
    setState(prev => {
      if (prev.repeat === "one") {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
        return prev;
      }

      const currentIdx = prev.queue.findIndex(t => {
        if (t.number !== prev.currentTrack?.number) return false;
        const trackAlbum = (t as QueueTrack).albumSlug;
        const currentAlbum = prev.currentAlbum?.slug;
        if (trackAlbum && currentAlbum) return trackAlbum === currentAlbum;
        return true;
      });
      let nextIdx: number;

      let shuffleHistoryUpdate: number[] | undefined;
      if (prev.shuffle) {
        const history = new Set(prev.shuffleHistory || []);
        history.add(currentIdx);
        let availableIndices = prev.queue.map((_, i) => i).filter(i => !history.has(i));
        if (availableIndices.length === 0) {
          // All played, reset
          availableIndices = prev.queue.map((_, i) => i).filter(i => i !== currentIdx);
          history.clear();
        }
        if (availableIndices.length === 0) return { ...prev, isPlaying: false };
        // Prefer different energy
        const currentEnergy = prev.currentTrack?.energy;
        const differentEnergy = availableIndices.filter(i => prev.queue[i].energy !== currentEnergy);
        const pool = differentEnergy.length > 0 ? differentEnergy : availableIndices;
        nextIdx = pool[Math.floor(Math.random() * pool.length)];
        shuffleHistoryUpdate = [...Array.from(history), nextIdx];
      } else {
        nextIdx = currentIdx + 1;
      }

      if (nextIdx >= prev.queue.length) {
        if (prev.repeat === "all") {
          nextIdx = 0;
        } else if (prev.infinite && prev.currentTrack) {
          const currentEnergy = prev.currentTrack.energy;
          const allTracks = ALL_ALBUMS.flatMap(a =>
            a.tracks.map(t => ({ ...t, albumSlug: a.slug } as QueueTrack))
          );
          const sameEnergy = allTracks.filter(
            t => t.energy === currentEnergy && !(t.number === prev.currentTrack!.number && t.albumSlug === prev.currentAlbum?.slug)
          );
          if (sameEnergy.length > 0) {
            const pick = sameEnergy[Math.floor(Math.random() * sameEnergy.length)];
            const pickAlbum = ALL_ALBUMS.find(a => a.slug === pick.albumSlug);
            if (pickAlbum) {
              const newQueue = [...prev.queue, pick];
              // Fire async play outside setState
              setTimeout(() => setSourceAndPlay(audioRef.current!, pick, pickAlbum, blobUrlRef), 0);
              return {
                ...prev,
                currentTrack: pick,
                currentAlbum: pickAlbum,
                queue: newQueue,
                isPlaying: true,
              };
            }
          }
          return { ...prev, isPlaying: false };
        } else {
          return { ...prev, isPlaying: false };
        }
      }

      const nextTrack = prev.queue[nextIdx];
      const album = resolveAlbumForTrack(nextTrack, prev.queueAlbum);
      if (nextTrack && album) {
        // Fire async play outside setState
        setTimeout(() => setSourceAndPlay(audioRef.current!, nextTrack, album, blobUrlRef), 0);
      }

      return {
        ...prev,
        currentTrack: nextTrack,
        currentAlbum: album,
        isPlaying: !!(nextTrack && album),
        previewExpired: false,
        ...(shuffleHistoryUpdate !== undefined ? { shuffleHistory: shuffleHistoryUpdate } : {}),
      };
    });
  }, []);

  const playTrack = useCallback((track: AlbumTrack, album: Album, trackList?: AlbumTrack[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const queue = trackList || album.tracks;
    setSourceAndPlay(audio, track, album, blobUrlRef);

    // Fire-and-forget play event tracking
    fetch("/api/music/play-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        albumSlug: album.slug,
        trackNumber: track.number,
        energy: track.energy,
        flavor: track.flavor,
        duration: track.durationSeconds,
      }),
    }).catch(() => {});

    setState(s => ({
      ...s,
      currentTrack: track,
      currentAlbum: album,
      queue,
      queueAlbum: album,
      isPlaying: true,
      showFullPlayer: true,
      audioError: null,
      shuffleHistory: [],
    }));
  }, []);

  const playAlbum = useCallback((album: Album, startIndex = 0) => {
    const track = album.tracks[startIndex];
    if (!track) return;
    playTrack(track, album, album.tracks);
  }, [playTrack]);

  // Add tracks to play next (after current track)
  const addToQueue = useCallback((tracks: AlbumTrack[], album: Album) => {
    setState(s => {
      if (!s.currentTrack) {
        // Nothing playing — start playing the first track
        const audio = audioRef.current;
        if (audio && tracks[0]) {
          setSourceAndPlay(audio, tracks[0], album, blobUrlRef);
          return {
            ...s,
            currentTrack: tracks[0],
            currentAlbum: album,
            queue: tracks,
            queueAlbum: album,
            isPlaying: true,
            showFullPlayer: true,
            audioError: null,
          };
        }
        return s;
      }
      // Insert after current track in queue
      const currentIdx = s.queue.findIndex(t => {
        if (t.number !== s.currentTrack!.number) return false;
        const tAlbum = (t as QueueTrack).albumSlug;
        if (tAlbum && s.currentAlbum) return tAlbum === s.currentAlbum.slug;
        return true;
      });
      const newQueue = [...s.queue];
      const insertAt = currentIdx >= 0 ? currentIdx + 1 : newQueue.length;
      newQueue.splice(insertAt, 0, ...tracks);
      return { ...s, queue: newQueue };
    });
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;
    if (state.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [state.isPlaying, state.currentTrack]);

  const next = useCallback(() => {
    handleEnded();
  }, [handleEnded]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    setState(prev => {
      const currentIdx = prev.queue.findIndex(t => {
        if (t.number !== prev.currentTrack?.number) return false;
        const trackAlbum = (t as QueueTrack).albumSlug;
        const currentAlbum = prev.currentAlbum?.slug;
        if (trackAlbum && currentAlbum) return trackAlbum === currentAlbum;
        return true;
      });
      const prevIdx = currentIdx - 1;
      if (prevIdx < 0) {
        audio.currentTime = 0;
        return prev;
      }

      const prevTrack = prev.queue[prevIdx];
      const album = resolveAlbumForTrack(prevTrack, prev.queueAlbum);
      if (prevTrack && album) {
        setSourceAndPlay(audio, prevTrack, album, blobUrlRef);
      }

      return {
        ...prev,
        currentTrack: prevTrack,
        currentAlbum: album,
        isPlaying: !!(prevTrack && album),
      };
    });
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = time;
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setState(s => ({ ...s, volume: v }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(s => ({ ...s, shuffle: !s.shuffle, shuffleHistory: [] }));
  }, []);

  const toggleInfinite = useCallback(() => {
    setState(s => ({ ...s, infinite: !s.infinite }));
  }, []);

  const cycleRepeat = useCallback(() => {
    setState(s => ({
      ...s,
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    }));
  }, []);

  const setShowFullPlayer = useCallback((v: boolean) => {
    setState(s => ({ ...s, showFullPlayer: v }));
  }, []);

  const setShowLyrics = useCallback((v: boolean) => {
    setState(s => ({ ...s, showLyrics: v }));
  }, []);

  const clearAudioError = useCallback(() => {
    setState(s => ({ ...s, audioError: null }));
  }, []);

  const clearPreviewExpired = useCallback(() => {
    setState(s => ({ ...s, previewExpired: false }));
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setState(s => ({
      ...s,
      currentTrack: null,
      currentAlbum: null,
      queue: [],
      queueAlbum: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      showFullPlayer: false,
      audioError: null,
      shuffleHistory: [],
    }));
  }, []);

  // ── Stop audio on logout ──
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        stop();
        setState(s => ({ ...s, previewMode: true }));
      } else if (session?.user) {
        setState(s => ({ ...s, previewMode: false, previewExpired: false }));
      }
    });
    return () => subscription.unsubscribe();
  }, [stop]);

  // ── MediaSession API — lock screen / notification controls ──
  useEffect(() => {
    if (!("mediaSession" in navigator) || !state.currentTrack) return;

    const track = state.currentTrack;
    const album = state.currentAlbum;
    // Track-specific Suno cover (via stream proxy), fallback to album pose
    const trackCoverUrl = album
      ? `${window.location.origin}/api/music/stream?album=${encodeURIComponent(album.slug)}&track=${track.number}&type=cover`
      : null;
    const albumCoverUrl = album
      ? `${window.location.origin}${getAlbumCover(album)}`
      : `${window.location.origin}/icon-512.png`;

    // Fetch custom title if available
    let displayTitle = track.title;
    try {
      const cached = sessionStorage.getItem("veus:titles");
      if (cached) {
        const titles = JSON.parse(cached);
        const key = `${album?.slug}-t${track.number}`;
        if (titles[key]) displayTitle = titles[key];
      }
    } catch {}

    navigator.mediaSession.metadata = new MediaMetadata({
      title: displayTitle,
      artist: "Loranne",
      album: album?.title || "Véus",
      artwork: [
        ...(trackCoverUrl ? [{ src: trackCoverUrl, sizes: "512x512", type: "image/jpeg" }] : []),
        { src: albumCoverUrl, sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
    navigator.mediaSession.setActionHandler("previoustrack", () => previous());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
  }, [state.currentTrack, state.currentAlbum, togglePlay, next, previous]);

  // ── Wake Lock — keep audio playing when screen locks ──
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        wakeLock = await navigator.wakeLock.request("screen");
      } catch { /* Wake lock not available */ }
    }

    if (state.isPlaying) {
      requestWakeLock();
      const onVisibility = () => {
        if (document.visibilityState === "visible" && state.isPlaying) {
          requestWakeLock();
        }
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () => {
        document.removeEventListener("visibilitychange", onVisibility);
        if (wakeLock) wakeLock.release().catch(() => {});
      };
    }
    return () => { if (wakeLock) wakeLock.release().catch(() => {}); };
  }, [state.isPlaying]);

  return (
    <MusicPlayerContext.Provider
      value={{
        ...state,
        playTrack,
        playAlbum,
        addToQueue,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleShuffle,
        toggleInfinite,
        cycleRepeat,
        setShowFullPlayer,
        setShowLyrics,
        clearAudioError,
        clearPreviewExpired,
        stop,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
