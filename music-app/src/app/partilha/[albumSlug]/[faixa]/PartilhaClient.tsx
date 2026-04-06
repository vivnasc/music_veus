"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getShareUrl } from "@/lib/share-utils";

const PREVIEW_SECONDS = 45;

type Props = {
  albumSlug: string;
  albumTitle: string;
  albumColor: string;
  trackNumber: number;
  trackTitle: string;
  trackDescription: string;
  coverSrc: string;
  trackCoverSrc?: string;
  lyricLine?: string;
};

export default function PartilhaClient({
  albumSlug, albumTitle, albumColor,
  trackNumber, trackTitle, trackDescription,
  coverSrc, trackCoverSrc, lyricLine,
}: Props) {
  const [isSubscriber, setIsSubscriber] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState<string | null>(null);

  // Try to load track-specific Suno cover, fall back to album cover
  useEffect(() => {
    if (!trackCoverSrc) { setCoverLoaded(null); return; }
    const img = new window.Image();
    img.onload = () => setCoverLoaded(trackCoverSrc);
    img.onerror = () => setCoverLoaded(null);
    img.src = trackCoverSrc;
  }, [trackCoverSrc]);

  const displayCover = coverLoaded || coverSrc;
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ended, setEnded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build stream URL — preview mode for unauthenticated share pages
  const streamUrl = `/api/music/stream?album=${encodeURIComponent(albumSlug)}&track=${trackNumber}&preview=1`;

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setIsSubscriber(false);
        return;
      }
      // Check actual subscription status
      const { data: sub } = await supabase
        .from("music_subscriptions")
        .select("status, expires_at")
        .eq("user_id", data.user.id)
        .eq("status", "active")
        .single();
      setIsSubscriber(!!sub && new Date(sub.expires_at) > new Date());
    });
  }, []);

  useEffect(() => {
    if (isSubscriber) {
      window.location.href = `/album/${albumSlug}?faixa=${trackNumber}`;
    }
  }, [isSubscriber, albumSlug, trackNumber]);

  useEffect(() => {
    const audio = new Audio(streamUrl);
    audioRef.current = audio;

    const onTime = () => {
      if (audio.currentTime >= PREVIEW_SECONDS) {
        audio.pause();
        setPlaying(false);
        setEnded(true);
        setProgress(100);
        setCurrentTime(PREVIEW_SECONDS);
      } else {
        setProgress((audio.currentTime / PREVIEW_SECONDS) * 100);
        setCurrentTime(audio.currentTime);
      }
    };
    const onEnded = () => { setPlaying(false); setEnded(true); setProgress(100); };
    const onError = () => { /* audio not available yet — show CTA anyway */ };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    // Auto-play on load (will work if user has interacted with the page before)
    audio.play().catch(() => {
      // Autoplay blocked — user will tap play manually
    });
    if (!playing) setPlaying(true);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [streamUrl]);

  function togglePlay() {
    if (!audioRef.current || ended) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        // autoplay blocked or audio unavailable
      });
      setPlaying(true);
    }
  }

  function replay() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setEnded(false);
    setProgress(0);
    setCurrentTime(0);
    audioRef.current.play().catch(() => {});
    setPlaying(true);
  }

  async function shareThis() {
    const shareUrl = getShareUrl(albumSlug, trackNumber);
    const shareText = `"${trackTitle}" — Loranne`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: trackTitle, text: shareText, url: shareUrl });
        return;
      } catch { /* cancelled */ }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (isSubscriber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
        <p className="text-sm text-[#666680] animate-pulse">A abrir na tua conta...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center px-6 py-12">
      <div
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center top, ${albumColor}40 0%, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        {/* Preview badge */}
        <div className="mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
          <p className="text-[11px] text-[#a0a0b0] tracking-wider">PREVIEW 45s</p>
        </div>

        {/* Album cover */}
        <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl mb-8">
          <Image src={displayCover} alt={albumTitle} fill className="object-cover" unoptimized={!!coverLoaded} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Track info */}
        <p className="text-xs uppercase tracking-widest text-[#666680] mb-2">{albumTitle}</p>
        <h1 className="font-display text-2xl font-bold text-[#F5F0E6] mb-1">{trackTitle}</h1>
        <p className="text-sm text-[#a0a0b0] mb-2">{trackDescription}</p>
        <p className="text-xs text-[#666680] mb-6">by Loranne</p>

        {/* Lyric highlight */}
        {lyricLine && (
          <blockquote className="w-full text-sm italic text-[#F5F0E6]/70 mb-6 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
            &ldquo;{lyricLine}&rdquo;
          </blockquote>
        )}

        {/* Player */}
        <div className="w-full mb-6">
          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/10 mb-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: albumColor }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#666680] tabular-nums mb-4">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(PREVIEW_SECONDS)} preview</span>
          </div>

          {!ended ? (
            <button
              onClick={togglePlay}
              className="mx-auto flex items-center justify-center w-16 h-16 rounded-full transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: albumColor }}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="#0D0D1A" className="h-7 w-7">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="#0D0D1A" className="h-7 w-7 ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#F5F0E6]">Isto foi apenas um fragmento.</p>
              <p className="text-xs text-[#a0a0b0]">A faixa completa guarda o que falta ouvir.</p>
              <button
                onClick={replay}
                className="text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors underline underline-offset-2"
              >
                Ouvir de novo
              </button>
            </div>
          )}
        </div>

        {/* Primary CTA */}
        <Link
          href="/registar"
          className="w-full py-4 rounded-xl font-medium text-sm text-center transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg border border-white/10"
          style={{ backgroundColor: `${albumColor}40`, color: "#F5F0E6" }}
        >
          Ouvir a faixa completa
        </Link>

        {/* Secondary CTA */}
        <Link
          href="/"
          className="mt-3 w-full py-3 rounded-xl text-sm text-center bg-white/5 hover:bg-white/10 transition-colors text-[#a0a0b0] border border-white/5"
        >
          Descobrir Loranne
        </Link>

        {/* Funnel to main site */}
        <a
          href="https://seteveus.space"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full py-3 text-sm text-center text-[#666680] hover:text-[#a0a0b0] transition-colors"
        >
          Conhecer Os Sete Véus
        </a>

        {/* Share button */}
        <button
          onClick={shareThis}
          className="mt-4 flex items-center gap-1.5 text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-green-400">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Link copiado
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Partilhar esta faixa
            </>
          )}
        </button>

        {/* Branding */}
        <div className="mt-12 flex items-center gap-2 opacity-50">
          <Image src="/veus_music_favicon-192.png" alt="Véus" width={20} height={20} />
          <span className="text-xs text-[#666680] tracking-wider">VÉUS</span>
        </div>
      </div>
    </div>
  );
}
