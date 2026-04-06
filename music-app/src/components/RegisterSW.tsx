"use client";

import { useEffect, useState, useCallback } from "react";

export default function RegisterSW() {
  const [waitingSW, setWaitingSW] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      // If there's already a waiting SW when we load, show the banner
      if (registration.waiting) {
        setWaitingSW(registration.waiting);
      }

      // Detect when a new SW is installed and waiting
      registration.addEventListener("updatefound", () => {
        const newSW = registration.installing;
        if (!newSW) return;

        newSW.addEventListener("statechange", () => {
          if (newSW.state === "installed" && navigator.serviceWorker.controller) {
            // New version installed but waiting — show update banner
            setWaitingSW(newSW);
          }
        });
      });

      // Also check for updates periodically (every 30 minutes)
      const interval = setInterval(() => {
        registration.update();
      }, 30 * 60 * 1000);

      return () => clearInterval(interval);
    }).catch(() => {
      // SW registration failed — offline features won't work
    });

    // When the new SW takes over, reload the page
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = useCallback(() => {
    if (waitingSW) {
      waitingSW.postMessage({ type: "SKIP_WAITING" });
      setWaitingSW(null);
    }
  }, [waitingSW]);

  const handleDismiss = useCallback(() => {
    setWaitingSW(null);
  }, []);

  if (!waitingSW) return null;

  return (
    <div className="fixed bottom-28 left-4 right-4 z-[55] max-w-md mx-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1A1A2E] border border-[#C9A96E]/30 shadow-2xl shadow-black/40">
        {/* Icon */}
        <div className="w-9 h-9 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-4.5 w-4.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#F5F0E6]">Nova versão disponível</p>
          <p className="text-xs text-[#666680]">Actualiza para a versão mais recente.</p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="p-2 text-[#666680] hover:text-[#a0a0b0] transition-colors"
            aria-label="Ignorar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-full bg-[#C9A96E] text-[#0D0D1A] text-xs font-semibold hover:bg-[#d4b87a] transition-colors active:scale-95"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}
