"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Check if the current user is a supporter (has donated).
 * Reads from music_supporters table. Admin can mark users as supporters.
 * Also stores supporter status in localStorage for offline badge display.
 */
export function useSupporterStatus() {
  const [isSupporter, setIsSupporter] = useState(false);
  const [supporterSince, setSupporterSince] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for instant display
    const cached = localStorage.getItem("veus-supporter");
    if (cached === "true") setIsSupporter(true);

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }

      const { data: supporter } = await supabase
        .from("music_supporters")
        .select("created_at, tier")
        .eq("user_id", data.user.id)
        .single();

      if (supporter) {
        setIsSupporter(true);
        setSupporterSince(supporter.created_at);
        localStorage.setItem("veus-supporter", "true");
      } else {
        setIsSupporter(false);
        localStorage.removeItem("veus-supporter");
      }
      setLoading(false);
    });
  }, []);

  return { isSupporter, supporterSince, loading };
}
