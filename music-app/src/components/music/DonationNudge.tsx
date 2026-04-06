"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

const NUDGE_EVERY_N_TRACKS = 10;
const STORAGE_KEY = "veus-nudge-count";
const DISMISS_KEY = "veus-nudge-dismissed";

/**
 * Gentle, non-intrusive donation prompt.
 * Appears after every N tracks played. Dismissable.
 * Never appears if user already dismissed recently (7 days).
 */
export default function DonationNudge() {
  const { currentTrack, currentAlbum } = useMusicPlayer();
  const [show, setShow] = useState(false);
  const [trackKey, setTrackKey] = useState<string | null>(null);

  const dismiss = useCallback(() => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  }, []);

  useEffect(() => {
    if (!currentTrack || !currentAlbum) return;

    const key = `${currentAlbum.slug}:${currentTrack.number}`;
    if (key === trackKey) return;
    setTrackKey(key);

    // Check if recently dismissed (7 days)
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000) return;

    // Check if user is already a supporter
    if (localStorage.getItem("veus-supporter") === "true") return;

    // Increment count
    const count = Number(localStorage.getItem(STORAGE_KEY) || "0") + 1;
    localStorage.setItem(STORAGE_KEY, String(count));

    if (count % NUDGE_EVERY_N_TRACKS === 0) {
      setShow(true);
    }
  }, [currentTrack, currentAlbum, trackKey]);

  if (!show) return null;

  const albumColor = currentAlbum?.color || "#C9A96E";

  return (
    <div className="fixed bottom-20 left-0 right-0 z-45 px-4 animate-[slideUp_400ms_ease-out]">
      <div className="max-w-md mx-auto rounded-2xl bg-[#1A1A2E]/95 backdrop-blur-xl border border-white/10 p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${albumColor}15` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke={albumColor} strokeWidth="1.5" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#F5F0E6] mb-1">A Loranne agradece cada minuto.</p>
            <p className="text-xs text-[#666680] leading-relaxed">
              Toda a musica e gratuita. Se quiseres ajudar a criar mais, qualquer valor conta.
            </p>
          </div>
          <button
            onClick={dismiss}
            className="shrink-0 p-1 text-[#666680] hover:text-[#a0a0b0]"
            aria-label="Fechar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            href="/apoiar"
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-center transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: `${albumColor}25`, color: albumColor }}
            onClick={dismiss}
          >
            Apoiar
          </Link>
          <button
            onClick={dismiss}
            className="px-4 py-2.5 rounded-xl text-sm text-[#666680] hover:text-[#a0a0b0] bg-white/[0.04] transition-colors"
          >
            Agora nao
          </button>
        </div>
      </div>
    </div>
  );
}
