/**
 * Mood-based instant mixes.
 *
 * Em vez de criar playlists manualmente, o utilizador escolhe um dos 4 moods
 * e a app gera um mix instantâneo atravessando TODAS as colecções e artistas
 * (Loranne, NNova, AG, Presença) baseado em energy + flavor de cada faixa.
 *
 * O mapping mood ⇄ (energy, flavor) está abaixo. Não há tag nova em faixa
 * nenhuma — derivamos do que já existe.
 */

import { ALL_ALBUMS, type Album, type AlbumTrack, type TrackEnergy, type TrackFlavor } from "@/data/albums";
import { getPresencaAlbumsAsAlbums } from "@/data/presenca";

export type MoodSlug = "meditativo" | "introspectivo" | "animado" | "energetico";

export interface MoodMeta {
  slug: MoodSlug;
  label: string;
  emoji: string;
  description: string;
  /** Para gradiente de card. */
  color: string;
  /** Cor secundária do gradiente. */
  color2: string;
}

export const MOODS: MoodMeta[] = [
  {
    slug: "meditativo",
    label: "Meditativo",
    emoji: "🌱",
    description: "Presença, calma, respiração",
    color: "#7A9B8E",
    color2: "#4A6B5E",
  },
  {
    slug: "introspectivo",
    label: "Introspectivo",
    emoji: "💭",
    description: "Para dentro, contemplação, noite",
    color: "#8B7AB8",
    color2: "#5A4A88",
  },
  {
    slug: "animado",
    label: "Animado",
    emoji: "🌞",
    description: "Caminhar, dia bom, movimento leve",
    color: "#D4A853",
    color2: "#B07A2A",
  },
  {
    slug: "energetico",
    label: "Energético",
    emoji: "🔥",
    description: "Correr, treinar, dançar",
    color: "#E04A2F",
    color2: "#A02A15",
  },
];

export const MOOD_BY_SLUG: Record<MoodSlug, MoodMeta> = MOODS.reduce(
  (acc, m) => ({ ...acc, [m.slug]: m }),
  {} as Record<MoodSlug, MoodMeta>,
);

/** Faixas Presença são todas meditativas/introspectivas por natureza (whisper, low-register). */
function isPresencaAlbum(slug: string): boolean {
  return slug.startsWith("presenca-");
}

/**
 * Predicado: esta faixa pertence a este mood?
 *
 * Regras (não são exclusivas — uma faixa pode pertencer a mais que um mood):
 * - MEDITATIVO: tudo Presença + whisper sem flavor agressivo
 * - INTROSPECTIVO: whisper/raw + jazz/folk (noite, intimidade)
 * - ANIMADO: steady + bossa/marrabenta/folk; ou pulse calmo
 * - ENERGÉTICO: pulse/anthem; ou flavors house/gospel-africano/afrobeat
 */
export function trackBelongsToMood(
  energy: TrackEnergy | undefined,
  flavor: TrackFlavor | null | undefined,
  albumSlug: string,
  mood: MoodSlug,
): boolean {
  const e = energy ?? "whisper";
  const f = flavor ?? null;
  const presenca = isPresencaAlbum(albumSlug);

  switch (mood) {
    case "meditativo":
      if (presenca) return true;
      return e === "whisper" && (f === null || f === "folk");

    case "introspectivo":
      if (presenca) return true;
      return (e === "whisper" || e === "raw") && (f === null || f === "folk" || f === "jazz" || f === "bossa");

    case "animado":
      if (presenca) return false;
      if (e === "steady") return f === "bossa" || f === "marrabenta" || f === "folk" || f === "funk" || f === "house" || f === null;
      if (e === "pulse") return f !== "gospel-africano";
      return false;

    case "energetico":
      if (presenca) return false;
      if (e === "anthem" || e === "pulse") return true;
      return f === "house" || f === "gospel-africano" || f === "afrobeat" || f === "amapiano";
  }
}

export interface MoodTrack {
  track: AlbumTrack;
  album: Album;
  /** Chave estável para likes + dedup: "{albumSlug}/{trackNumber}". */
  key: string;
}

/**
 * Devolve todas as faixas elegíveis para um mood, atravessando ALL_ALBUMS +
 * Presença. Filtra pelos publishedKeys (só faixas com áudio publicado). Sem
 * `publishedKeys` devolve tudo (para preview de contagem antes do fetch).
 */
export function getMoodTracks(
  mood: MoodSlug,
  publishedKeys?: Set<string>,
): MoodTrack[] {
  const pool: Album[] = [...ALL_ALBUMS, ...getPresencaAlbumsAsAlbums()];
  const result: MoodTrack[] = [];

  for (const album of pool) {
    for (const track of album.tracks) {
      if (!trackBelongsToMood(track.energy, track.flavor, album.slug, mood)) continue;
      const key = `${album.slug}-t${track.number}`;
      if (publishedKeys && !publishedKeys.has(key)) continue;
      result.push({ track, album, key: `${album.slug}/${track.number}` });
    }
  }
  return result;
}

/**
 * Shuffle ponderado: faixas com like têm peso `likedWeight` (default 3),
 * sem like peso 1. Implementação: sample sem reposição com probabilidade
 * proporcional ao peso. O(n²) — aceitável para N < 500 faixas.
 */
export function weightedShuffle<T>(
  items: T[],
  isLiked: (item: T) => boolean,
  likedWeight = 3,
): T[] {
  const pool = items.map((item) => ({ item, weight: isLiked(item) ? likedWeight : 1 }));
  const result: T[] = [];
  while (pool.length > 0) {
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < pool.length; idx++) {
      r -= pool[idx].weight;
      if (r <= 0) break;
    }
    if (idx >= pool.length) idx = pool.length - 1;
    result.push(pool[idx].item);
    pool.splice(idx, 1);
  }
  return result;
}
