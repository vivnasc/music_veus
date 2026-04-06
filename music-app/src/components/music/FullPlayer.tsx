"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useCustomTitles } from "@/hooks/useCustomTitles";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { useDownloads } from "@/hooks/useDownloads";
import { useLibrary } from "@/hooks/useLibrary";
import ShareModal from "./ShareModal";
import SleepTimer from "./SleepTimer";
import { useCustomLyrics } from "@/hooks/useCustomLyrics";

/**
 * Synced lyrics — highlights the current section based on playback time.
 * Parses [Verse], [Chorus], etc. and estimates timing from total duration.
 * Auto-scrolls to the active section.
 */
function SyncedLyrics({ lyrics, currentTime, duration, albumColor }: {
  lyrics: string;
  currentTime: number;
  duration: number;
  albumColor: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Parse lyrics into sections
  const sections = useMemo(() => {
    const lines = lyrics.split("\n");
    const result: { tag: string | null; lines: string[]; startLine: number }[] = [];
    let current: { tag: string | null; lines: string[]; startLine: number } | null = null;

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("[")) {
        if (current) result.push(current);
        current = { tag: trimmed.replace(/[\[\]]/g, ""), lines: [], startLine: i };
      } else if (trimmed) {
        if (!current) current = { tag: null, lines: [], startLine: i };
        current.lines.push(trimmed);
      }
    });
    if (current) result.push(current);
    return result;
  }, [lyrics]);

  // Estimate which section is active based on time
  const totalTextLines = sections.reduce((s, sec) => s + sec.lines.length, 0);
  const activeSectionIdx = useMemo(() => {
    if (duration <= 0 || totalTextLines === 0) return 0;
    const progress = currentTime / duration;
    let linesSoFar = 0;
    for (let i = 0; i < sections.length; i++) {
      linesSoFar += sections[i].lines.length;
      if (linesSoFar / totalTextLines >= progress) return i;
    }
    return sections.length - 1;
  }, [currentTime, duration, sections, totalTextLines]);

  // Auto-scroll to active section
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSectionIdx]);

  return (
    <div ref={containerRef} className="space-y-1 px-2 lyrics-content" data-no-copy>
      {sections.map((sec, i) => {
        const isActive = i === activeSectionIdx;
        const isPast = i < activeSectionIdx;
        return (
          <div
            key={i}
            ref={isActive ? activeRef : undefined}
            className={`transition-opacity duration-700 ${isActive ? "opacity-100" : isPast ? "opacity-30" : "opacity-50"}`}
          >
            {sec.tag && (
              <p
                className="text-[10px] uppercase tracking-[0.25em] pt-8 pb-2"
                style={{ color: isActive ? albumColor : "#666680" }}
              >
                {sec.tag}
              </p>
            )}
            {sec.lines.map((line, j) => (
              <p
                key={j}
                className={`text-[18px] leading-[1.7] font-display transition-all duration-500 ${
                  isActive ? "text-[#F5F0E6]" : "text-[#F5F0E6]/40"
                }`}
                style={isActive ? { textShadow: `0 0 30px ${albumColor}20` } : {}}
              >
                {line}
              </p>
            ))}
          </div>
        );
      })}
      <div className="h-[20vh]" />
    </div>
  );
}


function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

type ViewTab = "cover" | "lyrics" | "queue";

export default function FullPlayer() {
  const {
    currentTrack,
    currentAlbum,
    queue,
    queueAlbum,
    isPlaying,
    currentTime,
    duration,
    shuffle,
    infinite,
    repeat,
    showFullPlayer,
    togglePlay,
    next,
    previous,
    seek,
    toggleShuffle,
    toggleInfinite,
    cycleRepeat,
    setShowFullPlayer,
    playTrack,
  } = useMusicPlayer();

  const [showShare, setShowShare] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>("cover");
  const [trackCover, setTrackCover] = useState<string | null>(null);
  const { saveTrack, removeTrack, getSaveState, isSaved } = useDownloads();
  const { isFavorite, toggleFavorite, userId } = useLibrary();
  const { getTitle } = useCustomTitles();
  const displayTitle = currentTrack ? getTitle(currentAlbum?.slug || "", currentTrack.number, currentTrack.title) : "";
  const { getLyrics: getCustomLyrics } = useCustomLyrics();
  const router = useRouter();

  // ── Track-specific cover ──
  useEffect(() => {
    if (!currentTrack || !currentAlbum) { setTrackCover(null); return; }
    const url = getTrackCoverUrl(currentAlbum.slug, currentTrack.number);
    if (!url) { setTrackCover(null); return; }
    const img = new window.Image();
    img.onload = () => setTrackCover(url);
    img.onerror = () => setTrackCover(null);
    img.src = url;
  }, [currentTrack, currentAlbum]);

  // Reset view on track change
  useEffect(() => { setActiveTab("cover"); }, [currentTrack]);


  // ── Browser back button ──
  const didPushState = useRef(false);
  useEffect(() => {
    if (showFullPlayer && currentTrack) {
      if (!didPushState.current) {
        window.history.pushState({ veusPlayer: true }, "");
        didPushState.current = true;
      }
      function onPopState() { setShowFullPlayer(false); }
      window.addEventListener("popstate", onPopState);
      return () => window.removeEventListener("popstate", onPopState);
    } else {
      if (didPushState.current) {
        didPushState.current = false;
        if (window.history.state?.veusPlayer) window.history.back();
      }
    }
  }, [showFullPlayer, currentTrack, setShowFullPlayer]);

  // ── Swipe down to close ──
  const SWIPE_THRESHOLD = 12;
  const touchStartY = useRef(0);
  const touchDeltaY = useRef(0);
  const isSwiping = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchDeltaY.current = 0;
    isSwiping.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaY.current = e.touches[0].clientY - touchStartY.current;
    if (!isSwiping.current) {
      if (touchDeltaY.current > SWIPE_THRESHOLD) isSwiping.current = true;
      else return;
    }
    if (touchDeltaY.current > 0 && containerRef.current) {
      const translate = Math.min(touchDeltaY.current * 0.5, 200);
      containerRef.current.style.transform = `translateY(${translate}px)`;
      containerRef.current.style.opacity = `${1 - translate / 400}`;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = "";
      containerRef.current.style.opacity = "";
    }
    if (isSwiping.current && touchDeltaY.current > 80) setShowFullPlayer(false);
    isSwiping.current = false;
  }, [setShowFullPlayer]);

  if (!showFullPlayer || !currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const albumColor = currentAlbum?.color || "#C9A96E";
  const coverSrc = trackCover || (currentAlbum ? getAlbumCover(currentAlbum) : "/poses/loranne-hero.png");
  const resolvedLyrics = currentAlbum
    ? getCustomLyrics(currentAlbum.slug, currentTrack.number, currentTrack.lyrics || "")
    : currentTrack.lyrics || "";
  const hasLyrics = !!resolvedLyrics;
  const currentIdx = queue.findIndex(t => t.number === currentTrack.number);
  const upcomingTracks = currentIdx >= 0 ? queue.slice(currentIdx + 1) : [];
  const nextTrack = upcomingTracks[0] || null;
  const fav = isFavorite(currentTrack.number, currentAlbum?.slug || "");

  return (
    <>
    <div
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden transition-[transform,opacity] duration-200 ease-out"
    >
      {/* ── BLURRED COVER BACKGROUND ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={coverSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-[60px] opacity-30"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A]/70 via-[#0D0D1A]/85 to-[#0D0D1A]" />
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3 shrink-0">
        <button
          onClick={() => setShowFullPlayer(false)}
          className="p-2 -ml-2 text-[#a0a0b0] hover:text-[#F5F0E6] transition-colors active:scale-95 rounded-xl"
          aria-label="Fechar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="text-center min-w-0 flex-1">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#666680]">A ouvir</p>
          <p className="text-[11px] font-medium text-[#a0a0b0] truncate">{currentAlbum?.title}</p>
        </div>
        <div className="flex items-center">
          <button onClick={() => setShowSleep(true)} className="p-2 text-[#666680] hover:text-[#a0a0b0]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>
          <button onClick={() => setShowShare(true)} className="p-2 text-[#666680] hover:text-[#a0a0b0]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex-1 overflow-y-auto scrollbar-none">
        <div className="max-w-md mx-auto px-6 pb-4 animate-[fadeIn_300ms_ease-out]" key={activeTab}>

          {/* ═══ COVER VIEW ═══ */}
          {activeTab === "cover" && (
            <div className="flex flex-col items-center pt-2">
              {/* BIG COVER — fills width */}
              <div className="relative w-full max-w-[90vw] sm:max-w-[360px]">
                {isPlaying && (
                  <div className="absolute inset-0 -m-4 pointer-events-none">
                    <div className="w-full h-full rounded-3xl opacity-40 blur-[40px] animate-pulse" style={{ backgroundColor: albumColor }} />
                  </div>
                )}
                <div className="relative aspect-square rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                  <img
                    src={coverSrc}
                    alt={displayTitle}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      setTrackCover(null);
                      if (currentAlbum) (e.target as HTMLImageElement).src = getAlbumCover(currentAlbum);
                    }}
                  />
                </div>
              </div>

              {/* Track info */}
              <div className="mt-6 w-full">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-bold text-[#F5F0E6] truncate">{displayTitle}</h2>
                    <p className="text-sm text-[#a0a0b0] truncate">{currentAlbum?.title}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!userId) { router.push("/login"); return; }
                      if (currentAlbum) toggleFavorite(currentTrack.number, currentAlbum.slug);
                    }}
                    className="p-2 shrink-0 transition-transform active:scale-90"
                  >
                    <svg viewBox="0 0 24 24" fill={fav ? "#e74c3c" : "none"} stroke={fav ? "#e74c3c" : "#a0a0b0"} strokeWidth="2" className="h-6 w-6">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                {nextTrack && <p className="text-xs text-[#666680] mt-1">A seguir: {nextTrack.title}</p>}
              </div>
            </div>
          )}

          {/* ═══ LYRICS VIEW ═══ */}
          {activeTab === "lyrics" && (
            <div className="py-4 min-h-[50vh]">
              {hasLyrics ? (
                <SyncedLyrics
                  lyrics={resolvedLyrics}
                  currentTime={currentTime}
                  duration={duration}
                  albumColor={albumColor}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#666680" strokeWidth="1.5" className="h-10 w-10 mb-3 opacity-50">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                  <p className="text-sm text-[#666680]">Sem letra disponivel</p>
                </div>
              )}
            </div>
          )}

          {/* ═══ QUEUE VIEW ═══ */}
          {activeTab === "queue" && (
            <div className="py-4">
              {/* Now playing */}
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#666680] mb-3">A tocar</p>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.06] mb-8">
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-lg">
                  <img src={coverSrc} alt={displayTitle} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: albumColor }}>{displayTitle}</p>
                  <p className="text-xs text-[#666680] truncate">{currentAlbum?.title}</p>
                </div>
                {isPlaying && (
                  <div className="flex items-end gap-[3px] h-4 shrink-0 mr-1">
                    {[60, 100, 40, 80].map((h, j) => (
                      <div key={j} className="w-[3px] rounded-full animate-pulse" style={{ height: `${h}%`, backgroundColor: albumColor, animationDelay: `${j * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Up next */}
              {upcomingTracks.length > 0 && (
                <>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#666680] mb-3">A seguir</p>
                  <div className="space-y-0.5">
                    {upcomingTracks.map((track, i) => (
                      <button
                        key={`${track.number}-${i}`}
                        onClick={() => {
                          const album = currentAlbum || queueAlbum;
                          if (album) playTrack(track, album, queue);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] active:bg-white/[0.08] transition-colors text-left"
                      >
                        <span className="text-[11px] text-[#666680]/60 w-5 text-center tabular-nums shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#F5F0E6] truncate">{track.title}</p>
                          <p className="text-[11px] text-[#666680] truncate">{track.description}</p>
                        </div>
                        <span className="text-[11px] text-[#666680]/60 tabular-nums shrink-0">{fmt(track.durationSeconds)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {upcomingTracks.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-sm text-[#666680]">
                    {infinite ? "Modo infinito activo" : "Ultima faixa da fila"}
                  </p>
                </div>
              )}

              {/* Queue badges */}
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <span className="text-[10px] text-[#666680]/60">{queue.length} faixa{queue.length !== 1 ? "s" : ""}</span>
                {shuffle && <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] text-[#a0a0b0]">Aleatorio</span>}
                {infinite && <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] text-[#a0a0b0]">Infinito</span>}
                {repeat !== "off" && <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] text-[#a0a0b0]">Repetir{repeat === "one" ? " 1" : ""}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="relative z-10 shrink-0 flex justify-center gap-1 px-6 pt-1.5 pb-1">
        {(["cover", "lyrics", "queue"] as ViewTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-full text-[11px] font-medium transition-all duration-300 ${
              activeTab === tab
                ? "text-white"
                : "text-[#666680] hover:text-[#a0a0b0]"
            }`}
          >
            {activeTab === tab && (
              <span className="absolute inset-0 rounded-full bg-white/10" style={{ boxShadow: `0 0 20px ${albumColor}20` }} />
            )}
            <span className="relative">
              {tab === "cover" ? "Capa" : tab === "lyrics" ? "Letra" : "Fila"}
            </span>
          </button>
        ))}
      </div>

      {/* ── FIXED BOTTOM: progress + controls ── */}
      <div className="relative z-10 shrink-0 px-6 pb-6 pt-2">
        <div className="max-w-md mx-auto">
          {/* Progress */}
          <div className="mb-3">
            <input
              type="range" min={0} max={duration || 0} value={currentTime}
              onChange={e => seek(Number(e.target.value))}
              className="w-full h-1 appearance-none rounded-full cursor-pointer"
              style={{ background: `linear-gradient(to right, ${albumColor} ${progress}%, rgba(255,255,255,0.08) ${progress}%)` }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[#666680] tabular-nums">{fmt(currentTime)}</span>
              <span className="text-[10px] text-[#666680] tabular-nums">{fmt(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button onClick={toggleShuffle} className={`p-2 transition-colors ${shuffle ? "text-white" : "text-[#666680] hover:text-[#a0a0b0]"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
              </svg>
            </button>
            <button onClick={previous} className="p-3 text-[#F5F0E6] hover:text-white active:scale-90 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
            </button>
            <button
              onClick={togglePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full text-[#0D0D1A] transition-transform hover:scale-105 active:scale-95 shadow-lg ring-1 ring-white/20"
              style={{ backgroundColor: "#F5F0E6" }}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button onClick={next} className="p-3 text-[#F5F0E6] hover:text-white active:scale-90 transition-all">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
            </button>
            <button onClick={cycleRepeat} className={`p-2 relative transition-colors ${repeat !== "off" ? "text-white" : "text-[#666680] hover:text-[#a0a0b0]"}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" />
              </svg>
              {repeat === "one" && <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold">1</span>}
            </button>
          </div>

          {/* Infinite + Share */}
          <div className="flex justify-center items-center gap-3 mt-2">
            <button
              onClick={toggleInfinite}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] transition-colors ${infinite ? "bg-white/10 text-white" : "text-[#666680] hover:text-[#a0a0b0]"}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
              </svg>
              Infinito
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-[#666680] hover:text-[#a0a0b0] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Partilhar
            </button>
            <a
              href="/apoiar"
              onClick={(e) => { e.preventDefault(); setShowFullPlayer(false); router.push("/apoiar"); }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-[#C9A96E]/60 hover:text-[#C9A96E] transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              Apoiar
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Modals */}
    {showShare && currentTrack && currentAlbum && (
      <ShareModal track={currentTrack} album={currentAlbum} onClose={() => setShowShare(false)} />
    )}
    <SleepTimer isOpen={showSleep} onClose={() => setShowSleep(false)} />
    </>
  );
}
