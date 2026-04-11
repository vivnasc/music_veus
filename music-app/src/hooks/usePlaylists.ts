"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type Playlist = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  trackCount: number;
};

export type PlaylistTrack = {
  trackNumber: number;
  albumSlug: string;
  position: number;
};

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadPlaylists = useCallback(async () => {
    if (!userId) { setLoading(false); return; }

    const { data } = await supabase
      .from("music_playlists")
      .select("id, name, description, is_public, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (data) {
      // Get track counts
      const counts = await Promise.all(
        data.map(p =>
          supabase
            .from("music_playlist_tracks")
            .select("id", { count: "exact", head: true })
            .eq("playlist_id", p.id)
        )
      );

      setPlaylists(data.map((p, i) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        isPublic: p.is_public,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        trackCount: counts[i].count || 0,
      })));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadPlaylists(); }, [loadPlaylists]);

  const createPlaylist = useCallback(async (name: string, description?: string): Promise<string | null> => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from("music_playlists")
      .insert({ user_id: userId, name, description: description || null })
      .select("id")
      .single();

    if (error || !data) return null;
    await loadPlaylists();
    return data.id;
  }, [userId, loadPlaylists]);

  const deletePlaylist = useCallback(async (playlistId: string) => {
    if (!userId) return;
    await supabase.from("music_playlists").delete().eq("id", playlistId).eq("user_id", userId);
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, [userId]);

  const renamePlaylist = useCallback(async (playlistId: string, name: string) => {
    if (!userId) return;
    await supabase.from("music_playlists").update({ name }).eq("id", playlistId).eq("user_id", userId);
    setPlaylists(prev => prev.map(p => p.id === playlistId ? { ...p, name } : p));
  }, [userId]);

  const getPlaylistTracks = useCallback(async (playlistId: string): Promise<PlaylistTrack[]> => {
    const { data } = await supabase
      .from("music_playlist_tracks")
      .select("track_number, album_slug, position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: true });

    return (data || []).map(t => ({
      trackNumber: t.track_number,
      albumSlug: t.album_slug,
      position: t.position,
    }));
  }, []);

  const addToPlaylist = useCallback(async (playlistId: string, trackNumber: number, albumSlug: string) => {
    // Get current max position
    const { data: existing } = await supabase
      .from("music_playlist_tracks")
      .select("position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: false })
      .limit(1);

    const nextPos = existing && existing.length > 0 ? existing[0].position + 1 : 0;

    await supabase
      .from("music_playlist_tracks")
      .upsert(
        { playlist_id: playlistId, track_number: trackNumber, album_slug: albumSlug, position: nextPos },
        { onConflict: "playlist_id, track_number, album_slug" }
      );

    await loadPlaylists();
  }, [loadPlaylists]);

  const addBatchToPlaylist = useCallback(async (playlistId: string, tracks: { trackNumber: number; albumSlug: string }[]) => {
    // Get current max position
    const { data: existing } = await supabase
      .from("music_playlist_tracks")
      .select("position")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: false })
      .limit(1);

    let nextPos = existing && existing.length > 0 ? existing[0].position + 1 : 0;

    const rows = tracks.map(t => ({
      playlist_id: playlistId,
      track_number: t.trackNumber,
      album_slug: t.albumSlug,
      position: nextPos++,
    }));

    await supabase
      .from("music_playlist_tracks")
      .upsert(rows, { onConflict: "playlist_id, track_number, album_slug" });

    await loadPlaylists();
  }, [loadPlaylists]);

  const removeFromPlaylist = useCallback(async (playlistId: string, trackNumber: number, albumSlug: string) => {
    await supabase
      .from("music_playlist_tracks")
      .delete()
      .eq("playlist_id", playlistId)
      .eq("track_number", trackNumber)
      .eq("album_slug", albumSlug);

    await loadPlaylists();
  }, [loadPlaylists]);

  return {
    playlists,
    loading,
    userId,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    getPlaylistTracks,
    addToPlaylist,
    addBatchToPlaylist,
    removeFromPlaylist,
    reload: loadPlaylists,
  };
}
