"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

interface SleepTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TimerOption = {
  label: string;
  minutes: number | null; // null = end of track
};

const TIMER_OPTIONS: TimerOption[] = [
  { label: "5 min", minutes: 5 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "60 min", minutes: 60 },
  { label: "Fim desta faixa", minutes: null },
];

const FADE_DURATION = 10_000; // 10 seconds
const FADE_INTERVAL = 200; // update every 200ms

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SleepTimer({ isOpen, onClose }: SleepTimerProps) {
  const { togglePlay, isPlaying, volume, setVolume, currentTrack } =
    useMusicPlayer();

  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [waitForTrackEnd, setWaitForTrackEnd] = useState(false);
  const [showGoodnightMessage, setShowGoodnightMessage] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedVolumeRef = useRef<number>(1);
  const trackAtSelectionRef = useRef<string | null>(null);

  const clearAllIntervals = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const showGoodnight = useCallback(() => {
    setShowGoodnightMessage(true);
    setTimeout(() => {
      setShowGoodnightMessage(false);
    }, 3000);
  }, []);

  const fadeAndPause = useCallback(() => {
    savedVolumeRef.current = volume;
    const startVolume = volume;
    const steps = FADE_DURATION / FADE_INTERVAL;
    let currentStep = 0;

    fadeRef.current = setInterval(() => {
      currentStep++;
      const newVolume = Math.max(
        0,
        startVolume * (1 - currentStep / steps)
      );
      setVolume(newVolume);

      if (currentStep >= steps) {
        if (fadeRef.current) {
          clearInterval(fadeRef.current);
          fadeRef.current = null;
        }
        if (isPlaying) {
          togglePlay();
        }
        // Restore volume after pausing
        setTimeout(() => {
          setVolume(savedVolumeRef.current);
        }, 500);
        showGoodnight();
        setRemainingSeconds(null);
        setWaitForTrackEnd(false);
      }
    }, FADE_INTERVAL);
  }, [volume, setVolume, isPlaying, togglePlay, showGoodnight]);

  // Countdown timer — restart interval whenever remainingSeconds changes from null/0 to a positive value
  const isCountingDown = remainingSeconds !== null && remainingSeconds > 0;
  useEffect(() => {
    if (!isCountingDown) return;

    countdownRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [isCountingDown]);

  // When countdown reaches 0, start fade
  useEffect(() => {
    if (remainingSeconds === 0 && !waitForTrackEnd) {
      fadeAndPause();
    }
  }, [remainingSeconds, waitForTrackEnd, fadeAndPause]);

  // "End of track" mode: watch for track change
  useEffect(() => {
    if (!waitForTrackEnd) return;

    const currentTrackId = currentTrack?.title ?? null;
    if (
      trackAtSelectionRef.current !== null &&
      currentTrackId !== trackAtSelectionRef.current
    ) {
      // Track changed, fade and pause
      fadeAndPause();
      setWaitForTrackEnd(false);
    }
  }, [currentTrack, waitForTrackEnd, fadeAndPause]);

  // Also pause at end if playback stops naturally while waiting for track end
  useEffect(() => {
    if (waitForTrackEnd && !isPlaying) {
      setWaitForTrackEnd(false);
      showGoodnight();
    }
  }, [isPlaying, waitForTrackEnd, showGoodnight]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, [clearAllIntervals]);

  const handleSelectTimer = (option: TimerOption) => {
    clearAllIntervals();

    if (option.minutes === null) {
      // End of current track
      setRemainingSeconds(null);
      setWaitForTrackEnd(true);
      trackAtSelectionRef.current = currentTrack?.title ?? null;
    } else {
      setWaitForTrackEnd(false);
      setRemainingSeconds(option.minutes * 60);
    }
  };

  const handleCancel = () => {
    clearAllIntervals();
    setRemainingSeconds(null);
    setWaitForTrackEnd(false);
  };

  const isTimerActive = remainingSeconds !== null || waitForTrackEnd;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl bg-[#1A1A2E] p-6 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="mb-3 text-[#C9A96E]"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="currentColor"
              fillOpacity="0.15"
            />
          </svg>
          <h2 className="text-lg font-semibold text-[#F5F0E6]">
            Temporizador
          </h2>
          <p className="text-sm text-[#F5F0E6]/50 mt-1">
            A música pára suavemente
          </p>
        </div>

        {/* Goodnight message */}
        {showGoodnightMessage && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#1A1A2E]/95 z-10">
            <p className="text-xl font-light text-[#C9A96E] animate-pulse">
              Boa noite
            </p>
          </div>
        )}

        {/* Timer content */}
        {isTimerActive ? (
          <div className="flex flex-col items-center gap-5">
            {/* Countdown display */}
            <div className="flex flex-col items-center gap-2">
              {waitForTrackEnd ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#C9A96E]/70"
                  >
                    <path
                      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-[#F5F0E6]/70 text-sm">
                    Para no fim desta faixa
                  </p>
                  {currentTrack && (
                    <p className="text-[#F5F0E6]/40 text-xs text-center truncate max-w-[200px]">
                      {currentTrack.title}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <span className="text-4xl font-light text-[#F5F0E6] tabular-nums tracking-wider">
                    {formatTime(remainingSeconds ?? 0)}
                  </span>
                  <p className="text-[#F5F0E6]/40 text-xs">restante</p>
                </>
              )}
            </div>

            {/* Cancel button */}
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-full border border-[#F5F0E6]/20 text-[#F5F0E6]/70 text-sm hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {TIMER_OPTIONS.map((option) => (
              <button
                key={option.label}
                onClick={() => handleSelectTimer(option)}
                className={`flex items-center gap-2 justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-[#C9A96E]/20 hover:border-[#C9A96E]/40 border border-white/10 text-[#F5F0E6]/80 ${
                  option.minutes === null ? "col-span-2" : ""
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#C9A96E]/60 shrink-0"
                >
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {option.label}
              </button>
            ))}
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full text-[#F5F0E6]/40 hover:text-[#F5F0E6]/70 hover:bg-white/5 transition-colors"
          aria-label="Fechar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
