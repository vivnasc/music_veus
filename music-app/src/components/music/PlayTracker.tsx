"use client";

import { useEffect, useRef } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useLibrary } from "@/hooks/useLibrary";
import { useLocalListeningData } from "@/hooks/useLocalListeningData";

/**
 * Invisible component that tracks plays.
 * Records a listen when a new track starts playing (after 3 seconds).
 * Tracks in Supabase (authenticated) AND localStorage (always).
 */
export default function PlayTracker() {
  const { currentTrack, currentAlbum, isPlaying } = useMusicPlayer();
  const { addToRecents, userId } = useLibrary();
  const { recordPlay } = useLocalListeningData();
  const trackedRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!currentTrack || !currentAlbum || !isPlaying) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const key = `${currentAlbum.slug}:${currentTrack.number}`;
    if (trackedRef.current === key) return;

    // Wait 3 seconds before counting the listen (avoid skips)
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      trackedRef.current = key;

      // Always track in localStorage
      recordPlay(
        currentTrack.number,
        currentAlbum.slug,
        currentTrack.energy,
        currentTrack.flavor
      );

      // Track in Supabase if authenticated
      if (userId) {
        addToRecents(currentTrack.number, currentAlbum.slug);
      }
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentTrack, currentAlbum, isPlaying, userId, addToRecents, recordPlay]);

  // Reset tracked ref when track changes
  useEffect(() => {
    const key = currentTrack && currentAlbum
      ? `${currentAlbum.slug}:${currentTrack.number}`
      : null;
    if (key !== trackedRef.current && trackedRef.current !== null) {
      trackedRef.current = null;
    }
  }, [currentTrack, currentAlbum]);

  return null;
}
