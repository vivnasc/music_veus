"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ALL_ALBUMS } from "@/data/albums";
import { MOOD_META, type LoranneMood, type CompactMoodsData } from "@/data/loranne-moods";
import LORANNE_MOODS_DATA from "@/data/loranne-moods-data.json";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { getTrackCoverUrl } from "@/lib/album-covers";
import NavBar from "@/components/music/NavBar";

const MOODS_DATA = LORANNE_MOODS_DATA as unknown as CompactMoodsData;

export default function MixPageClient({ moods }: { moods: string[] }) {
  const validMoods = moods.filter((m) =>
    Object.keys(MOOD_META).includes(m)
  ) as LoranneMood[];

  const { playTrack, currentTrack, currentAlbum } = useMusicPlayer();
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => {});
  }, []);

  // Build mix track list — tracks tagged with ANY selected mood,
  // sorted by affinity (how many of selected moods they have)
  const tracks = useMemo(() => {
    if (validMoods.length === 0) return [];

    const candidates: Array<{
      key: string;
      albumSlug: string;
      trackNumber: number;
      affinity: number;
      confidence: number;
    }> = [];

    for (const [key, compact] of Object.entries(MOODS_DATA.tracks)) {
      const tagMoods = compact[0].split(",");
      const matches = tagMoods.filter((m) =>
        validMoods.includes(m as LoranneMood)
      ).length;
      if (matches === 0) continue;

      const m = key.match(/^(.+)\/(\d+)$/);
      if (!m) continue;
      candidates.push({
        key,
        albumSlug: m[1],
        trackNumber: parseInt(m[2], 10),
        affinity: matches,
        confidence: compact[1] || 0.5,
      });
    }

    // Filter to published only
    const published = publishedKeys.size > 0
      ? candidates.filter((c) =>
          publishedKeys.has(`${c.albumSlug}-t${c.trackNumber}`)
        )
      : candidates;

    // Sort: affinity desc, then confidence desc
    published.sort((a, b) => {
      if (b.affinity !== a.affinity) return b.affinity - a.affinity;
      return b.confidence - a.confidence;
    });

    // Resolve to ResolvedTrack shape
    const albumMap: Map<string, typeof ALL_ALBUMS[number]> = new Map(ALL_ALBUMS.map((a) => [a.slug, a]));
    const resolved = [];
    for (const c of published) {
      const album = albumMap.get(c.albumSlug);
      if (!album) continue;
      const track = album.tracks.find((t) => t.number === c.trackNumber);
      if (!track) continue;
      resolved.push({
        ...track,
        albumSlug: album.slug,
        albumTitle: album.title,
        albumColor: album.color,
        affinity: c.affinity,
      });
    }
    return resolved;
  }, [validMoods, publishedKeys]);

  function playAll() {
    if (tracks.length === 0) return;
    const first = tracks[0];
    const album = ALL_ALBUMS.find((a) => a.slug === first.albumSlug);
    if (!album) return;
    playTrack(first, album, tracks);
  }

  function playShuffle() {
    if (tracks.length === 0) return;
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    const first = shuffled[0];
    const album = ALL_ALBUMS.find((a) => a.slug === first.albumSlug);
    if (!album) return;
    playTrack(first, album, shuffled);
  }

  // Gradient from selected mood colors
  const gradient = validMoods.length > 0
    ? `linear-gradient(135deg, ${validMoods.map((m) => MOOD_META[m].color).join(", ")})`
    : "linear-gradient(135deg, #C9A96E, #B08050)";

  if (validMoods.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6]">
        <NavBar />
        <div className="max-w-screen-lg mx-auto px-6 py-12 text-center">
          <p className="text-mundo-muted">Nenhum mood seleccionado.</p>
          <Link href="/descobre" className="text-[#C9A96E] underline text-sm mt-2 inline-block">
            Voltar a Descobre
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6]">
      <NavBar />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: gradient }} />
        <div className="relative max-w-screen-lg mx-auto px-6 pt-8 pb-10">
          <Link
            href="/descobre"
            className="text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors"
          >
            &larr; Descobre
          </Link>

          <p className="text-xs text-[#a0a0b0] uppercase tracking-wider mt-3">Mix</p>
          <h1 className="text-3xl font-semibold mt-1">
            {validMoods.map((m) => MOOD_META[m].label).join(" + ")}
          </h1>
          <p className="text-sm text-[#a0a0b0] mt-2 max-w-xl">
            {validMoods.map((m) => MOOD_META[m].paraQuem).join(" · ")}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {validMoods.map((m) => {
              const meta = MOOD_META[m];
              return (
                <span
                  key={m}
                  className="text-[11px] px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: `${meta.color}33`,
                    color: meta.color,
                    border: `1px solid ${meta.color}66`,
                  }}
                >
                  {meta.label}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={playAll}
              disabled={tracks.length === 0}
              className="bg-[#C9A96E] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#D4B57F] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ▶ Tocar mix
            </button>
            <button
              onClick={playShuffle}
              disabled={tracks.length === 0}
              className="bg-white/10 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              🔀 Aleatório
            </button>
            <span className="text-xs text-[#a0a0b0]">
              {tracks.length} {tracks.length === 1 ? "faixa" : "faixas"}
            </span>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="max-w-screen-lg mx-auto px-4 pb-32">
        {tracks.length === 0 ? (
          <p className="text-center text-mundo-muted py-12 text-sm">
            Nenhuma faixa publicada para este mix ainda.
          </p>
        ) : (
          <div className="space-y-1">
            {tracks.map((track, idx) => {
              const album = ALL_ALBUMS.find((a) => a.slug === track.albumSlug);
              if (!album) return null;
              const isCurrent = currentAlbum?.slug === track.albumSlug && currentTrack?.number === track.number;

              return (
                <div
                  key={`${track.albumSlug}-${track.number}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group"
                >
                  <div className="w-12 h-12 shrink-0 rounded-md overflow-hidden bg-[#1a1a2e]">
                    <Image
                      src={getTrackCoverUrl(track.albumSlug, track.number)}
                      alt={track.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    onClick={() => playTrack(track, album, tracks)}
                    className="flex-1 text-left min-w-0"
                  >
                    <p className={`text-sm truncate ${isCurrent ? "text-[#C9A96E]" : "text-[#F5F0E6]"}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-[#666680] truncate">
                      {track.albumTitle}
                    </p>
                  </button>
                  {/* Affinity badge — how many of the selected moods this track has */}
                  {track.affinity > 1 && (
                    <span
                      className="text-[10px] text-white/60 px-2 py-0.5 rounded-full bg-white/10"
                      title={`Match ${track.affinity}/${validMoods.length} dos moods seleccionados`}
                    >
                      ★ {track.affinity}/{validMoods.length}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
