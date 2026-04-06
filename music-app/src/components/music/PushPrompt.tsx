"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Asks user to enable push notifications.
 * Shows once, remembers the choice.
 */
export default function PushPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if: no support, already subscribed, or dismissed
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem("veus:push-dismissed")) return;

    // Show after 30 seconds of engagement
    const timer = setTimeout(() => setShow(true), 30000);
    return () => clearTimeout(timer);
  }, []);

  async function subscribe() {
    // Hide immediately — never wait for async
    localStorage.setItem("veus:push-dismissed", "1");
    setShow(false);

    // Do the actual subscription in background
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const reg = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) return;

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      const { data } = await supabase.auth.getUser();

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: sub.toJSON(),
          userId: data.user?.id || null,
        }),
      });
    } catch {
      // Subscription failed — already dismissed
    }
  }

  function dismiss() {
    localStorage.setItem("veus:push-dismissed", "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-28 left-4 right-4 z-[55] max-w-md mx-auto animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1A1A2E] border border-[#C9A96E]/30 shadow-2xl shadow-black/40">
        <div className="w-9 h-9 rounded-xl bg-[#C9A96E]/10 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-4.5 w-4.5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#F5F0E6]">Receber notificacoes?</p>
          <p className="text-xs text-[#666680]">Avisamos quando sair musica nova.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={dismiss} className="p-2 text-[#666680] hover:text-[#a0a0b0]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={subscribe}
            className="px-4 py-2 rounded-full bg-[#C9A96E] text-[#0D0D1A] text-xs font-semibold hover:bg-[#d4b87a] transition-colors active:scale-95"
          >
            Sim
          </button>
        </div>
      </div>
    </div>
  );
}
