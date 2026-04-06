"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type TopTrackItem = {
  trackNumber: number;
  albumSlug: string;
  listenCount: number;
};

type Period = "week" | "month" | "year" | "all";

function periodStart(period: Period): string | null {
  const now = new Date();
  switch (period) {
    case "week": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d.toISOString();
    }
    case "month": {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return d.toISOString();
    }
    case "year": {
      const d = new Date(now);
      d.setFullYear(d.getFullYear() - 1);
      return d.toISOString();
    }
    case "all":
      return null;
  }
}

export function useTopTracks(period: Period = "month", limit = 20) {
  const [tracks, setTracks] = useState<TopTrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!userId) { setLoading(false); return; }

    let query = supabase
      .from("music_listening_stats")
      .select("track_number, album_slug, listen_count, last_listened_at")
      .eq("user_id", userId)
      .order("listen_count", { ascending: false })
      .limit(limit);

    const start = periodStart(period);
    if (start) {
      query = query.gte("last_listened_at", start);
    }

    const { data } = await query;

    setTracks(
      (data || []).map(t => ({
        trackNumber: t.track_number,
        albumSlug: t.album_slug,
        listenCount: t.listen_count,
      }))
    );
    setLoading(false);
  }, [userId, period, limit]);

  useEffect(() => { load(); }, [load]);

  return { tracks, loading, userId, reload: load };
}
