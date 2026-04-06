"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type FavoriteItem = {
  trackNumber: number;
  albumSlug: string;
  addedAt: string;
};

type RecentItem = {
  trackNumber: number;
  albumSlug: string;
  playedAt: string;
};

export function useLibrary() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
      setUserEmail(data.user?.email || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase when authenticated
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function load() {
      const [favsResult, recentsResult] = await Promise.all([
        supabase
          .from("music_favorites")
          .select("track_number, album_slug, created_at")
          .eq("user_id", userId!)
          .order("created_at", { ascending: false }),
        supabase
          .from("music_recents")
          .select("track_number, album_slug, played_at")
          .eq("user_id", userId!)
          .order("played_at", { ascending: false })
          .limit(50),
      ]);

      if (favsResult.data) {
        setFavorites(favsResult.data.map(f => ({
          trackNumber: f.track_number,
          albumSlug: f.album_slug,
          addedAt: f.created_at,
        })));
      }

      if (recentsResult.data) {
        setRecents(recentsResult.data.map(r => ({
          trackNumber: r.track_number,
          albumSlug: r.album_slug,
          playedAt: r.played_at,
        })));
      }

      setLoading(false);
    }

    load();
  }, [userId]);

  const isFavorite = useCallback((trackNumber: number, albumSlug: string) => {
    return favorites.some(f => f.trackNumber === trackNumber && f.albumSlug === albumSlug);
  }, [favorites]);

  const toggleFavorite = useCallback(async (trackNumber: number, albumSlug: string) => {
    const exists = favorites.some(f => f.trackNumber === trackNumber && f.albumSlug === albumSlug);

    if (exists) {
      setFavorites(prev => prev.filter(f => !(f.trackNumber === trackNumber && f.albumSlug === albumSlug)));
      if (userId) {
        await supabase
          .from("music_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("track_number", trackNumber)
          .eq("album_slug", albumSlug);
      }
    } else {
      const item: FavoriteItem = { trackNumber, albumSlug, addedAt: new Date().toISOString() };
      setFavorites(prev => [item, ...prev]);
      if (userId) {
        await supabase
          .from("music_favorites")
          .insert({ user_id: userId, track_number: trackNumber, album_slug: albumSlug });
      }
    }
  }, [favorites, userId]);

  const addToRecents = useCallback(async (trackNumber: number, albumSlug: string) => {
    const item: RecentItem = { trackNumber, albumSlug, playedAt: new Date().toISOString() };
    setRecents(prev => {
      const filtered = prev.filter(r => !(r.trackNumber === trackNumber && r.albumSlug === albumSlug));
      return [item, ...filtered].slice(0, 50);
    });

    if (userId) {
      await supabase
        .from("music_recents")
        .upsert(
          { user_id: userId, track_number: trackNumber, album_slug: albumSlug, played_at: new Date().toISOString() },
          { onConflict: "user_id, track_number, album_slug" }
        );

      // Update listening stats (upsert)
      const { data: existing } = await supabase
        .from("music_listening_stats")
        .select("id, listen_count")
        .eq("user_id", userId)
        .eq("album_slug", albumSlug)
        .eq("track_number", trackNumber)
        .single();

      if (existing) {
        await supabase
          .from("music_listening_stats")
          .update({
            listen_count: existing.listen_count + 1,
            last_listened_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("music_listening_stats")
          .insert({ user_id: userId, album_slug: albumSlug, track_number: trackNumber });
      }
    }
  }, [userId]);

  return { favorites, recents, isFavorite, toggleFavorite, addToRecents, userId, userEmail, loading };
}
