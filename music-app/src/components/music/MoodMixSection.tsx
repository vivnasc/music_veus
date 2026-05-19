"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOODS, getMoodTracks, moodMixCoverUrl, weightedShuffle, type MoodSlug } from "@/data/moods";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useMoodLikes } from "@/hooks/useMoodLikes";

/**
 * 4 mood cards na home. Clicar num card → inicia imediatamente o shuffle
 * ponderado desse mood (faixas com like têm peso x3). Sem detail page no
 * meio, sem playlists a criar. O ícone ⋯ leva para o detail page onde se
 * pode dar likes e ver a lista completa.
 */
export default function MoodMixSection() {
  const [publishedKeys, setPublishedKeys] = useState<Set<string> | null>(null);
  const [coverFailed, setCoverFailed] = useState<Record<string, boolean>>({});
  const { playTrack } = useMusicPlayer();
  const { isLiked, getLikedCount } = useMoodLikes();

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => setPublishedKeys(new Set()));
  }, []);

  // Conta faixas elegíveis por mood (memoizado).
  const counts = useMemo(() => {
    if (!publishedKeys) return {} as Record<MoodSlug, number>;
    const out = {} as Record<MoodSlug, number>;
    for (const m of MOODS) {
      out[m.slug] = getMoodTracks(m.slug, publishedKeys).length;
    }
    return out;
  }, [publishedKeys]);

  function startMix(mood: MoodSlug) {
    if (!publishedKeys || counts[mood] === 0) return;
    const all = getMoodTracks(mood, publishedKeys);
    const ordered = weightedShuffle(all, (t) => isLiked(mood, t.key));
    if (ordered.length === 0) return;
    const first = ordered[0];
    // Player aceita custom trackList no playTrack — vai ficar como a fila.
    const trackList = ordered.map((t) => ({ ...t.track, albumSlug: t.album.slug }));
    playTrack(first.track, first.album, trackList);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F5F0E6]">Mix do teu mood</h2>
          <p className="text-xs text-[#666680] mt-0.5">Toca uma — começa já a tocar.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOODS.map((m) => {
          const count = counts[m.slug] ?? 0;
          const likedCount = getLikedCount(m.slug);
          const isReady = publishedKeys !== null && count > 0;
          const hasCover = !coverFailed[m.slug];

          return (
            <div
              key={m.slug}
              className="relative group"
            >
              <button
                onClick={() => startMix(m.slug)}
                disabled={!isReady}
                aria-label={`Tocar mix ${m.label}`}
                className="w-full aspect-[5/4] rounded-2xl text-left transition-all relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02]"
                style={
                  !hasCover
                    ? { background: `linear-gradient(135deg, ${m.color} 0%, ${m.color2} 100%)` }
                    : undefined
                }
              >
                {hasCover && (
                  <Image
                    src={moodMixCoverUrl(m.slug)}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized
                    onError={() => setCoverFailed((s) => ({ ...s, [m.slug]: true }))}
                  />
                )}
                {/* Texto-overlay: gradiente escuro só no terço inferior, onde fica o título. */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />
                {/* Hover state subtil — apenas escurece ligeiramente, não esconde a imagem. */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-lg font-semibold text-white drop-shadow-md">{m.label}</p>
                  <p className="text-[11px] text-white/85 mt-0.5 line-clamp-1 drop-shadow">{m.description}</p>
                  <p className="text-[10px] text-white/75 mt-1.5 drop-shadow">
                    {publishedKeys === null
                      ? "…"
                      : count === 0
                        ? "Sem faixas"
                        : `${count} faixa${count === 1 ? "" : "s"}${likedCount > 0 ? ` · ${likedCount} ♥` : ""}`}
                  </p>
                </div>
                {/* Play hint icon */}
                <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
              {/* "Ver" link → detail page */}
              <Link
                href={`/mood/${m.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-2 right-2 text-[10px] text-white/80 hover:text-white px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm transition-colors"
                aria-label={`Ver lista ${m.label}`}
              >
                ver
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
