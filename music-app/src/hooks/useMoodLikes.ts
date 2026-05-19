"use client";

import { useCallback, useEffect, useState } from "react";
import type { MoodSlug } from "@/data/moods";

const STORAGE_KEY = "veus:mood-likes";

/**
 * Likes guardados por mood: para cada mood, o utilizador pode dar like a
 * faixas específicas. As faixas com like ganham peso x3 no shuffle ponderado
 * da próxima vez que esse mood for invocado — assim a app "aprende".
 *
 * Shape:
 *   { [mood: string]: { [trackKey: string]: true } }
 *
 * trackKey = "{albumSlug}/{trackNumber}" (mesma chave usada em MoodTrack).
 */
type MoodLikesState = Record<string, Record<string, boolean>>;

function safeRead(): MoodLikesState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function safeWrite(state: MoodLikesState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // quota / private mode — ignorar
  }
}

export function useMoodLikes() {
  const [likes, setLikes] = useState<MoodLikesState>({});

  useEffect(() => {
    setLikes(safeRead());
  }, []);

  const isLiked = useCallback(
    (mood: MoodSlug, trackKey: string) => !!likes[mood]?.[trackKey],
    [likes],
  );

  const toggle = useCallback((mood: MoodSlug, trackKey: string) => {
    setLikes((prev) => {
      const moodLikes = { ...(prev[mood] || {}) };
      if (moodLikes[trackKey]) {
        delete moodLikes[trackKey];
      } else {
        moodLikes[trackKey] = true;
      }
      const next = { ...prev, [mood]: moodLikes };
      safeWrite(next);
      return next;
    });
  }, []);

  const getLikedCount = useCallback(
    (mood: MoodSlug) => Object.keys(likes[mood] || {}).length,
    [likes],
  );

  return { isLiked, toggle, getLikedCount };
}
