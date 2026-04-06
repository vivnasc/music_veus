"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_ALBUMS } from "@/data/albums";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import type { Album, AlbumTrack } from "@/data/albums";
import Link from "next/link";
import { ESPELHO_NAMES_ARRAY } from "@/lib/album-covers";

// Ritual: a guided listening experience with breathing pauses,
// reflections, and progressive visual transformation.
// Nothing like this exists on any streaming platform.

type RitualPhase = "setup" | "breathing" | "listening" | "reflection" | "transition" | "closing";

type RitualConfig = {
  veu: number;
  duration: 10 | 20 | 30; // minutes
  intention: string;
};

const VEU_NAMES = ESPELHO_NAMES_ARRAY;
const VEU_COLORS = ["", "#c9b896", "#8b9b8e", "#b07a7a", "#ab9375", "#8aaaca", "#c08aaa", "#baaacc"];

const REFLECTIONS: Record<number, string[]> = {
  1: [
    "O que na tua vida foi escolhido por ti — e o que herdaste sem questionar?",
    "Se pudesses despir uma camada que já não te serve, qual seria?",
    "Onde no teu corpo sentes o peso daquilo que não é teu?",
  ],
  2: [
    "O que deixaste de dizer hoje por medo da reacção do outro?",
    "Se o medo fosse um mensageiro, que mensagem traria?",
    "Onde no teu corpo vive o medo? Como é que ele se manifesta?",
  ],
  3: [
    "Por que te castigas quando escolhes algo para ti?",
    "Que peso carregas que na verdade não te pertence?",
    "Se te pudesses perdoar por uma coisa, qual seria?",
  ],
  4: [
    "Quem és quando ninguém te observa?",
    "Que parte de ti escondes para ser aceite?",
    "Se pudesses ser inteiramente tu, o que mudaria?",
  ],
  5: [
    "O que aconteceria se largasses o controlo por um momento?",
    "Que relação na tua vida está a ser sufocada pelo teu aperto?",
    "Se confiasses mais, o que farias diferente?",
  ],
  6: [
    "O que desejas verdadeiramente — não o que achas que devias desejar?",
    "Onde procuras preenchimento que só tu podes dar a ti mesma?",
    "Se o desejo fosse um guia e não um vício, para onde te levaria?",
  ],
  7: [
    "De que te separaste para pertencer a algo que te diminui?",
    "O que significa pertencer a ti mesma?",
    "Se não precisasses de validação, o que farias neste momento?",
  ],
};

const BREATHING_PROMPTS = [
  "Inspira profundamente. Leva o ar até ao fundo.",
  "Segura. Sente o espaço que criaste.",
  "Expira devagar. Larga o que não precisas.",
  "Repete. O teu ritmo. O teu tempo.",
];

function getTracksForRitual(veu: number, durationMinutes: number): { track: AlbumTrack; album: Album }[] {
  // Get espelho + nó for this véu
  const espelho = ALL_ALBUMS.find(a => a.product === "espelho" && a.veu === veu);
  const no = ALL_ALBUMS.find(a => a.product === "no" && a.veu === veu);
  const curso = ALL_ALBUMS.find(a => a.product === "curso");

  const candidates: { track: AlbumTrack; album: Album }[] = [];

  // Mix whisper + raw tracks for ritualistic feeling
  const energies = ["whisper", "raw", "steady"];

  if (espelho) {
    for (const t of espelho.tracks) {
      if (energies.includes(t.energy)) candidates.push({ track: t, album: espelho });
    }
  }
  if (no) {
    for (const t of no.tracks) {
      if (energies.includes(t.energy)) candidates.push({ track: t, album: no });
    }
  }

  // Fill with curso tracks if needed
  if (curso && candidates.length < 4) {
    for (const t of curso.tracks) {
      if (t.energy === "whisper") candidates.push({ track: t, album: curso });
    }
  }

  // Select based on duration
  const targetTracks = durationMinutes <= 10 ? 2 : durationMinutes <= 20 ? 3 : 5;
  return candidates.slice(0, targetTracks);
}

export default function RitualPage() {
  const [config, setConfig] = useState<RitualConfig | null>(null);
  const [phase, setPhase] = useState<RitualPhase>("setup");
  const [breathCount, setBreathCount] = useState(0);
  const [currentBreathPrompt, setCurrentBreathPrompt] = useState(0);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [reflectionIdx, setReflectionIdx] = useState(0);
  const [veuProgress, setVeuProgress] = useState(0); // 0 to 1, the "veil dissolving"
  const [intention, setIntention] = useState("");
  const [selectedVeu, setSelectedVeu] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState<10 | 20 | 30>(20);

  const { playTrack, isPlaying, togglePlay, currentTime } = useMusicPlayer();
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const ritualTracks = config ? getTracksForRitual(config.veu, config.duration) : [];
  const color = config ? VEU_COLORS[config.veu] : "#C9A96E";

  // Breathing phase timer
  useEffect(() => {
    if (phase !== "breathing") return;

    timerRef.current = setInterval(() => {
      setCurrentBreathPrompt(p => {
        if (p >= BREATHING_PROMPTS.length - 1) {
          setBreathCount(c => {
            if (c >= 2) {
              // Done breathing, start listening
              setPhase("listening");
              return 0;
            }
            return c + 1;
          });
          return 0;
        }
        return p + 1;
      });
    }, 4000); // 4 seconds per breath prompt

    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Track véu progress
  useEffect(() => {
    if (phase === "listening" && ritualTracks.length > 0) {
      const progress = (currentTrackIdx + (currentTime / 240)) / ritualTracks.length;
      setVeuProgress(Math.min(1, progress));
    }
  }, [phase, currentTrackIdx, currentTime, ritualTracks.length]);

  const startRitual = useCallback(() => {
    setConfig({ veu: selectedVeu, duration: selectedDuration, intention });
    setPhase("breathing");
  }, [selectedVeu, selectedDuration, intention]);

  const startListening = useCallback(() => {
    if (ritualTracks.length > 0) {
      const { track, album } = ritualTracks[0];
      playTrack(track, album);
      setCurrentTrackIdx(0);
    }
  }, [ritualTracks, playTrack]);

  // When phase changes to listening, start the first track
  useEffect(() => {
    if (phase === "listening" && ritualTracks.length > 0 && currentTrackIdx === 0) {
      startListening();
    }
  }, [phase, startListening, ritualTracks.length, currentTrackIdx]);

  const advanceToReflection = useCallback(() => {
    if (isPlaying) togglePlay();
    setPhase("reflection");
  }, [isPlaying, togglePlay]);

  const advanceToNextTrack = useCallback(() => {
    const nextIdx = currentTrackIdx + 1;
    if (nextIdx >= ritualTracks.length) {
      setPhase("closing");
      return;
    }
    setCurrentTrackIdx(nextIdx);
    setReflectionIdx(r => (r + 1) % 3);
    setPhase("transition");

    // Brief transition pause, then breathing, then next track
    setTimeout(() => {
      setPhase("breathing");
      setBreathCount(0);
      setCurrentBreathPrompt(0);
    }, 3000);
  }, [currentTrackIdx, ritualTracks.length]);

  // When breathing finishes and we have a next track, play it
  useEffect(() => {
    if (phase === "listening" && currentTrackIdx > 0 && ritualTracks[currentTrackIdx]) {
      const { track, album } = ritualTracks[currentTrackIdx];
      playTrack(track, album);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentTrackIdx]);

  // ───── SETUP PHASE ─────
  if (phase === "setup") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#666680] hover:text-[#a0a0b0] text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto">
          {/* Moon icon */}
          <div className="w-20 h-20 rounded-full bg-[#C9A96E]/10 flex items-center justify-center mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" className="h-10 w-10">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </div>

          <h1 className="font-display text-3xl font-semibold text-[#F5F0E6] text-center mb-2">
            Ritual de Escuta
          </h1>
          <p className="text-sm text-[#666680] text-center mb-10">
            Uma experiência guiada. Respiração, música e reflexão.
          </p>

          {/* Véu selection */}
          <div className="w-full mb-6">
            <p className="text-xs uppercase tracking-widest text-[#666680] mb-3">Escolhe o teu veu</p>
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVeu(v)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
                    selectedVeu === v ? "ring-2 ring-white/40 scale-105" : "opacity-60 hover:opacity-80"
                  }`}
                  style={{ backgroundColor: VEU_COLORS[v] }}
                >
                  <span className="text-white/90 font-bold text-sm">{v}</span>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-[#F5F0E6] mt-2 font-display">
              {VEU_NAMES[selectedVeu]}
            </p>
          </div>

          {/* Duration */}
          <div className="w-full mb-6">
            <p className="text-xs uppercase tracking-widest text-[#666680] mb-3">Duracao</p>
            <div className="flex gap-3">
              {([10, 20, 30] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    selectedDuration === d
                      ? "bg-[#C9A96E]/20 text-[#C9A96E] ring-1 ring-[#C9A96E]/30"
                      : "bg-white/5 text-[#a0a0b0] hover:bg-white/10"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
          </div>

          {/* Intention */}
          <div className="w-full mb-8">
            <p className="text-xs uppercase tracking-widest text-[#666680] mb-3">Intencao (opcional)</p>
            <input
              type="text"
              value={intention}
              onChange={e => setIntention(e.target.value)}
              placeholder="O que queres ver hoje?"
              className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:ring-1 focus:ring-[#C9A96E]/30"
            />
          </div>

          <button
            onClick={startRitual}
            className="w-full py-4 rounded-2xl font-display text-lg font-semibold text-[#0D0D1A] bg-[#C9A96E] hover:bg-[#C9A96E]/90 transition-colors"
          >
            Comecar o ritual
          </button>
        </div>
      </div>
    );
  }

  // ───── Shared close button for fullscreen phases ─────
  const closeButton = (
    <Link
      href="/"
      className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[#a0a0b0] hover:text-[#F5F0E6]"
      onClick={() => { if (isPlaying) togglePlay(); }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </Link>
  );

  // ───── BREATHING PHASE ─────
  if (phase === "breathing") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center" style={{ background: `linear-gradient(180deg, ${color}15 0%, #0D0D1A 60%)` }}>
        {closeButton}
        {/* Breathing circle */}
        <div className="relative">
          <div
            className="w-48 h-48 rounded-full border-2 flex items-center justify-center"
            style={{
              borderColor: `${color}40`,
              animation: currentBreathPrompt < 2 ? "breatheIn 4s ease-in-out" : "breatheOut 4s ease-in-out",
            }}
          >
            <div
              className="w-32 h-32 rounded-full opacity-30"
              style={{
                backgroundColor: color,
                animation: "pulse 4s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <p className="font-display text-xl text-[#F5F0E6] mt-10 text-center px-8 transition-opacity duration-1000">
          {BREATHING_PROMPTS[currentBreathPrompt]}
        </p>

        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ backgroundColor: i <= breathCount ? color : "rgba(255,255,255,0.15)" }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes breatheIn {
            0% { transform: scale(0.8); }
            50% { transform: scale(1.15); }
            100% { transform: scale(0.8); }
          }
          @keyframes breatheOut {
            0% { transform: scale(1.15); }
            50% { transform: scale(0.8); }
            100% { transform: scale(1.15); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(0.7); opacity: 0.2; }
            50% { transform: scale(1); opacity: 0.4; }
          }
        `}</style>
      </div>
    );
  }

  // ───── LISTENING PHASE ─────
  if (phase === "listening") {
    const current = ritualTracks[currentTrackIdx];
    if (!current) return null;

    return (
      <div className="fixed inset-0 z-40 flex flex-col" style={{ background: `linear-gradient(180deg, ${color}15 0%, #0D0D1A 50%)` }}>
        {closeButton}
        {/* Véu dissolve progress */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-[3000ms]"
            style={{
              background: `radial-gradient(circle at 50% ${100 - veuProgress * 100}%, transparent ${veuProgress * 40}%, ${color}08 100%)`,
            }}
          />
          {/* Particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: color,
                opacity: 0.15 + veuProgress * 0.15,
                left: `${10 + (i * 7)}%`,
                top: `${20 + Math.sin(i * 0.8) * 30}%`,
                animation: `float ${3 + i * 0.3}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 text-center pt-8 px-6">
          <p className="text-xs uppercase tracking-widest text-[#666680]">
            Ritual — {VEU_NAMES[config?.veu || 1]}
          </p>
          {config?.intention && (
            <p className="text-sm text-[#a0a0b0] mt-1 font-display italic">&ldquo;{config.intention}&rdquo;</p>
          )}
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center mb-6"
            style={{
              background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12" style={{ color: `${color}80` }}>
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#F5F0E6] mb-1">
            {current.track.title}
          </h2>
          <p className="text-sm text-[#a0a0b0] mb-1">{current.album.title}</p>
          <p className="text-xs text-[#666680]">{current.track.description}</p>
        </div>

        {/* Bottom controls */}
        <div className="relative z-10 px-8 pb-8 flex flex-col items-center gap-4">
          {/* Progress through ritual */}
          <div className="flex gap-1.5 mb-2">
            {ritualTracks.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: i === currentTrackIdx ? "2rem" : "0.5rem",
                  backgroundColor: i <= currentTrackIdx ? color : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

          <button
            onClick={advanceToReflection}
            className="px-6 py-3 rounded-full text-sm font-medium transition-colors bg-white/10 text-[#F5F0E6] hover:bg-white/15"
          >
            Pausa para reflectir
          </button>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  // ───── REFLECTION PHASE ─────
  if (phase === "reflection") {
    const questions = REFLECTIONS[config?.veu || 1] || REFLECTIONS[1];
    const question = questions[reflectionIdx % questions.length];

    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-8" style={{ background: `linear-gradient(180deg, ${color}10 0%, #0D0D1A 60%)` }}>
        {closeButton}
        <div className="max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" className="h-6 w-6">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <p className="font-display text-2xl leading-relaxed text-[#F5F0E6]/90 mb-12">
            {question}
          </p>

          <button
            onClick={advanceToNextTrack}
            className="px-8 py-3 rounded-full text-sm font-medium transition-colors"
            style={{ backgroundColor: `${color}30`, color: "#F5F0E6" }}
          >
            {currentTrackIdx < ritualTracks.length - 1 ? "Continuar" : "Terminar o ritual"}
          </button>
        </div>
      </div>
    );
  }

  // ───── TRANSITION PHASE ─────
  if (phase === "transition") {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: "#0D0D1A" }}>
        {closeButton}
        <div
          className="w-4 h-4 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  // ───── CLOSING PHASE ─────
  if (phase === "closing") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center px-8" style={{ background: `linear-gradient(180deg, ${color}15 0%, #0D0D1A 60%)` }}>
        {closeButton}
        <div className="max-w-md text-center">
          {/* Véu fully dissolved visualization */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-[30px]"
              style={{ backgroundColor: color }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" className="h-16 w-16 opacity-60">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
          </div>

          <h2 className="font-display text-3xl font-semibold text-[#F5F0E6] mb-3">
            O véu dissolveu-se.
          </h2>
          <p className="text-[#a0a0b0] mb-2">
            {VEU_NAMES[config?.veu || 1]}
          </p>
          {config?.intention && (
            <p className="text-sm text-[#666680] font-display italic mb-8">
              &ldquo;{config.intention}&rdquo;
            </p>
          )}

          <p className="font-display text-lg text-[#F5F0E6]/70 mb-10 leading-relaxed">
            Não precisas de encontrar respostas agora.<br />
            Às vezes, ver já é o suficiente.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setPhase("setup"); setConfig(null); setVeuProgress(0); }}
              className="px-8 py-3 rounded-full text-sm font-medium bg-white/10 text-[#F5F0E6] hover:bg-white/15 transition-colors"
            >
              Novo ritual
            </button>
            <Link
              href="/"
              className="px-8 py-3 rounded-full text-sm font-medium text-[#666680] hover:text-[#a0a0b0] transition-colors"
            >
              Voltar a explorar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
