"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useSubscription, type SubscriptionStatus } from "@/hooks/useSubscription";
import SubscriptionModal from "@/components/music/SubscriptionModal";

type SubscriptionContextType = {
  status: SubscriptionStatus;
  isPremium: boolean;
  canPlay: (trackNumber: number) => boolean;
  isTrackFree: (trackNumber: number) => boolean;
  /** Call this before playing a track. Returns true if allowed, false if gate shown. */
  requestPlay: (trackNumber: number, trackTitle?: string, albumColor?: string) => boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function useSubscriptionGate() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptionGate must be used within SubscriptionProvider");
  return ctx;
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { status, isPremium, canPlay, isTrackFree } = useSubscription();
  const [modal, setModal] = useState<{ trackTitle?: string; albumColor?: string } | null>(null);

  const requestPlay = useCallback((trackNumber: number, trackTitle?: string, albumColor?: string): boolean => {
    if (canPlay(trackNumber)) return true;
    setModal({ trackTitle, albumColor });
    return false;
  }, [canPlay]);

  return (
    <SubscriptionContext.Provider value={{ status, isPremium, canPlay, isTrackFree, requestPlay }}>
      {children}
      {modal && (
        <SubscriptionModal
          onClose={() => setModal(null)}
          trackTitle={modal.trackTitle}
          albumColor={modal.albumColor}
        />
      )}
    </SubscriptionContext.Provider>
  );
}
