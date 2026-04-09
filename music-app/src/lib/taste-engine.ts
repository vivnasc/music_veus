/**
 * Taste Engine — Véus Music
 *
 * Builds a taste profile from listening history and scores any track
 * against it. Used by:
 * - useRecommendations (Para Ti, homepage)
 * - Infinite mode (auto-queue when playlist ends)
 * - "A seguir" suggestions
 *
 * Signals used (all from localStorage via useLocalListeningData):
 * - energyCounts: how many times each energy was played
 * - flavorCounts: how many times each flavor was played
 * - playCounts: per-track play count (albumSlug:trackNumber → count)
 * - recents: last 20 played tracks (for recency and context)
 *
 * Scoring dimensions:
 * 1. Energy affinity  — does this track match the user's preferred energies?
 * 2. Flavor affinity   — does this track match the user's preferred flavors?
 * 3. Product affinity  — does the user gravitate to certain collections?
 * 4. Language match     — does the user prefer PT or EN?
 * 5. Freshness         — boost unplayed tracks, penalize overplayed
 * 6. Context flow      — when continuing from a current track, smooth transitions
 * 7. Variety nudge     — gentle push to explore outside comfort zone
 */

import { ALL_ALBUMS, type Album, type AlbumTrack, type TrackEnergy } from "@/data/albums";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type CountMap = Record<string, number>;

export type TasteProfile = {
  energyCounts: CountMap;
  flavorCounts: CountMap;
  playCounts: CountMap;
  productCounts: CountMap;
  langCounts: CountMap;
  totalPlays: number;
  recentAlbumSlugs: string[];   // last N album slugs played (ordered, most recent first)
  recentTrackKeys: string[];    // last N track keys played
};

export type ScoredTrack = {
  track: AlbumTrack;
  album: Album;
  score: number;
};

// ─────────────────────────────────────────────
// Build profile from raw listening data
// ─────────────────────────────────────────────

export function buildTasteProfile(
  energyCounts: CountMap,
  flavorCounts: CountMap,
  playCounts: CountMap,
  recents: Array<{ trackNumber: number; albumSlug: string }>
): TasteProfile {
  // Derive product counts from play counts
  const productCounts: CountMap = {};
  const langCounts: CountMap = {};

  for (const [key, count] of Object.entries(playCounts)) {
    const [albumSlug] = key.split(":");
    const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
    if (album) {
      productCounts[album.product] = (productCounts[album.product] || 0) + count;
    }
    // Derive language preference
    const trackNum = parseInt(key.split(":")[1], 10);
    const track = album?.tracks.find(t => t.number === trackNum);
    if (track) {
      langCounts[track.lang] = (langCounts[track.lang] || 0) + count;
    }
  }

  const totalPlays = Object.values(playCounts).reduce((a, b) => a + b, 0);

  return {
    energyCounts,
    flavorCounts,
    playCounts,
    productCounts,
    langCounts,
    totalPlays,
    recentAlbumSlugs: recents.map(r => r.albumSlug),
    recentTrackKeys: recents.map(r => `${r.albumSlug}:${r.trackNumber}`),
  };
}

// ─────────────────────────────────────────────
// Normalize a CountMap to ratios (0-1)
// ─────────────────────────────────────────────

function ratios(counts: CountMap): CountMap {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return {};
  const result: CountMap = {};
  for (const [key, val] of Object.entries(counts)) {
    result[key] = val / total;
  }
  return result;
}

// ─────────────────────────────────────────────
// Energy flow map — which energies transition well
// ─────────────────────────────────────────────

const ENERGY_FLOW: Record<TrackEnergy, TrackEnergy[]> = {
  whisper: ["whisper", "steady"],
  steady:  ["whisper", "steady", "pulse"],
  pulse:   ["steady", "pulse", "anthem"],
  anthem:  ["pulse", "anthem", "raw"],
  raw:     ["anthem", "raw", "pulse"],
};

// ─────────────────────────────────────────────
// Score a single track against a profile
// ─────────────────────────────────────────────

export function scoreTrack(
  track: AlbumTrack,
  album: Album,
  profile: TasteProfile,
  context?: { currentEnergy?: TrackEnergy; currentProduct?: string }
): number {
  let score = 0;
  const key = `${album.slug}:${track.number}`;

  // 1. Energy affinity (0-3 pts)
  const energyRatios = ratios(profile.energyCounts);
  const energyAffinity = energyRatios[track.energy] || 0;
  score += energyAffinity * 3;

  // 2. Flavor affinity (0-2 pts)
  if (track.flavor) {
    const flavorRatios = ratios(profile.flavorCounts);
    const flavorAffinity = flavorRatios[track.flavor] || 0;
    score += flavorAffinity * 2;
  }

  // 3. Product affinity (0-1.5 pts)
  const productRatios = ratios(profile.productCounts);
  const productAffinity = productRatios[album.product] || 0;
  score += productAffinity * 1.5;

  // 4. Language match (0-0.5 pts)
  const langRatios = ratios(profile.langCounts);
  const langAffinity = langRatios[track.lang] || 0;
  score += langAffinity * 0.5;

  // 5. Freshness — boost unplayed, penalize overplayed (−1 to +2 pts)
  const playCount = profile.playCounts[key] || 0;
  if (playCount === 0) {
    score += 2;  // Discovery boost
  } else if (playCount <= 2) {
    score += 0.5; // Slight boost for lightly played
  } else if (playCount >= 6) {
    score -= 1;   // Fatigue penalty
  }

  // 6. Recency penalty — don't repeat what was just played (−2 pts)
  const recentIdx = profile.recentTrackKeys.indexOf(key);
  if (recentIdx >= 0 && recentIdx < 5) {
    score -= 2;  // Strong penalty for last 5 tracks
  } else if (recentIdx >= 5 && recentIdx < 10) {
    score -= 0.5; // Mild penalty for tracks 5-10
  }

  // 7. Context flow — smooth energy transitions (0-1.5 pts)
  if (context?.currentEnergy) {
    const goodTransitions = ENERGY_FLOW[context.currentEnergy] || [];
    if (goodTransitions.includes(track.energy)) {
      score += 1.5;
    }
  }

  // 8. Same collection bonus when in context (0-0.5 pts)
  if (context?.currentProduct && album.product === context.currentProduct) {
    score += 0.5;
  }

  // 9. Variety nudge — small bonus for albums not recently played (0-0.5 pts)
  if (!profile.recentAlbumSlugs.includes(album.slug)) {
    score += 0.5;
  }

  return score;
}

// ─────────────────────────────────────────────
// Get top N recommendations from full catalog
// ─────────────────────────────────────────────

export function getRecommendations(
  profile: TasteProfile,
  limit: number,
  options?: {
    excludeKeys?: Set<string>;
    context?: { currentEnergy?: TrackEnergy; currentProduct?: string };
    onlyWithAudio?: boolean;
  }
): ScoredTrack[] {
  const excludeKeys = options?.excludeKeys || new Set<string>();
  const onlyWithAudio = options?.onlyWithAudio ?? true;

  const candidates: ScoredTrack[] = [];

  for (const album of ALL_ALBUMS) {
    for (const track of album.tracks) {
      if (onlyWithAudio && !track.audioUrl) continue;
      const key = `${album.slug}:${track.number}`;
      if (excludeKeys.has(key)) continue;

      const score = scoreTrack(track, album, profile, options?.context);
      candidates.push({ track, album, score });
    }
  }

  // Sort by score descending, add small random jitter for variety
  candidates.sort((a, b) => {
    const jitter = (Math.random() - 0.5) * 0.3;
    return (b.score + jitter) - a.score;
  });

  return candidates.slice(0, limit);
}

// ─────────────────────────────────────────────
// Generate "up next" queue continuation
// When current queue ends, pick N tracks that flow well
// ─────────────────────────────────────────────

export function generateContinuation(
  profile: TasteProfile,
  currentTrack: AlbumTrack,
  currentAlbum: Album,
  currentQueue: AlbumTrack[],
  count = 10
): ScoredTrack[] {
  // Build exclude set from current queue
  const excludeKeys = new Set<string>();
  for (const t of currentQueue) {
    // Try to find the album for this track
    const qAlbum = ALL_ALBUMS.find(a => a.tracks.some(at => at.number === t.number && at.title === t.title));
    if (qAlbum) {
      excludeKeys.add(`${qAlbum.slug}:${t.number}`);
    }
  }

  return getRecommendations(profile, count, {
    excludeKeys,
    context: {
      currentEnergy: currentTrack.energy,
      currentProduct: currentAlbum.product,
    },
  });
}
