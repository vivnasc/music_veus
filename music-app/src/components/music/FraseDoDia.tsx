"use client";

import { useState, useMemo } from "react";
import { ALL_ALBUMS, getArtist } from "@/data/albums";

/**
 * Frase do Dia — a daily lyric card.
 * Selects a poetic line from the entire catalog, changing once per day.
 * Shareable. Intimate. Like a daily oracle from the music.
 */

function getDailyLyric() {
  const allLines: { line: string; trackTitle: string; trackNumber: number; albumTitle: string; albumSlug: string; albumColor: string; artist: string }[] = [];

  for (const album of ALL_ALBUMS) {
    for (const track of album.tracks) {
      if (!track.lyrics) continue;
      const lines = track.lyrics.split("\n").filter(l => {
        const trimmed = l.trim();
        return trimmed.length > 15 && trimmed.length < 100 && !trimmed.startsWith("[");
      });
      for (const line of lines) {
        allLines.push({
          line: line.trim(),
          trackTitle: track.title,
          trackNumber: track.number,
          albumTitle: album.title,
          albumSlug: album.slug,
          albumColor: album.color,
          artist: getArtist(album),
        });
      }
    }
  }

  if (allLines.length === 0) return null;

  // Deterministic daily seed: day since epoch
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  const idx = daysSinceEpoch % allLines.length;
  return allLines[idx];
}

export default function FraseDoDia() {
  const daily = useMemo(() => getDailyLyric(), []);
  const [copied, setCopied] = useState(false);

  if (!daily) return null;

  const partilhaUrl = `/partilha/${daily.albumSlug}/${daily.trackNumber}`;

  async function share() {
    const fullUrl = typeof window !== "undefined"
      ? `${window.location.origin}${partilhaUrl}`
      : partilhaUrl;
    const text = `"${daily!.line}"\n— ${daily!.trackTitle}, ${daily!.artist}\n\n${fullUrl}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url: fullUrl });
        return;
      } catch {
        // User cancelled or not supported
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  }

  return (
    <section className="relative overflow-hidden rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${daily.albumColor}15 0%, ${daily.albumColor}08 100%)` }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-[60px]" style={{ backgroundColor: daily.albumColor }} />

      <p className="text-xs uppercase tracking-widest text-[#666680] mb-4">Frase do dia</p>

      <blockquote className="font-display text-lg sm:text-xl leading-relaxed text-[#F5F0E6]/90 mb-4">
        &ldquo;{daily.line}&rdquo;
      </blockquote>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#a0a0b0]">{daily.trackTitle}</p>
          <p className="text-xs text-[#666680]">{daily.albumTitle}</p>
        </div>

        <button
          onClick={share}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-white/5 hover:bg-white/10 transition-colors text-[#a0a0b0]"
          aria-label="Partilhar frase do dia"
        >
          {copied ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-green-400">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Copiado
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Partilhar
            </>
          )}
        </button>
      </div>
    </section>
  );
}
