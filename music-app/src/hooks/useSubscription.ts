"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export type SubscriptionStatus = "free" | "active" | "cancelled" | "loading";

const PRICE = {
  monthly: { amount: 4.99, label: "$4.99/mês" },
  yearly: { amount: 39.99, label: "$39.99/ano" },
} as const;

export { PRICE as SUBSCRIPTION_PRICE };

const ADMIN_EMAIL = "viv.saraiva@gmail.com";

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>("loading");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("free");
        setUserId(null);
        return;
      }
      setUserId(user.id);

      // Admin bypasses subscription gate
      if (user.email === ADMIN_EMAIL) {
        setStatus("active");
        return;
      }

      const { data: profile } = await supabase
        .from("music_subscriptions")
        .select("status, expires_at")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        setStatus("free");
        return;
      }

      // Check if expired
      if (profile.expires_at && new Date(profile.expires_at) < new Date()) {
        setStatus("free");
        return;
      }

      setStatus(profile.status === "active" ? "active" : "free");
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => subscription.unsubscribe();
  }, []);

  const isPremium = status === "active";

  const isTrackFree = useCallback((_trackNumber: number): boolean => {
    // All tracks are free — music is the funnel, not the product
    return true;
  }, []);

  const canPlay = useCallback((_trackNumber: number): boolean => {
    // All tracks playable by everyone
    return true;
  }, [isPremium, isTrackFree]);

  return { status, isPremium, isTrackFree, canPlay, userId };
}
