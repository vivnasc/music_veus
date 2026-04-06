"use client";

import { useState, useEffect, useRef } from "react";
import { ALL_ALBUMS, type AlbumTrack, type Album } from "@/data/albums";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useCustomTitles } from "@/hooks/useCustomTitles";
import { supabase } from "@/lib/supabase";
import { usePublishedTracks } from "@/hooks/usePublishedTracks";

const GHOST_NAMES = [
  "Amina", "Beatriz", "Celia", "Diana", "Elena", "Fatima", "Graça",
  "Helena", "Inês", "Joana", "Karina", "Lina", "Marta", "Nadia",
  "Paula", "Rita", "Sara", "Teresa", "Vera", "Ana",
  "Bianca", "Clara", "Dulce", "Flora", "Gabi", "Julia", "Katia",
  "Lucia", "Monica", "Nelia", "Pilar", "Raquel", "Sofia", "Tania",
  "Valentina", "Adriana", "Carla", "Elsa", "Fernanda", "Irene",
  "Jessica", "Liliana", "Marcia", "Patricia", "Sandra", "Vanessa",
  "Zara", "Leila", "Miriam", "Yara", "Dina", "Rosa", "Telma",
  "Nair", "Olga", "Eva", "Ursula", "Gloria", "Francisca", "Ivone",
];

function maskName(name: string): string {
  return name.length <= 1 ? name : name[0] + "***";
}

// Templates: {track} is replaced with clickable track name
const TEMPLATES_WITH_TRACK = [
  "a ouvir {track}",
  "{track} em repeat",
  "que descoberta, {track}",
  "{track}. sim.",
  "mais uma vez {track}",
  "enviei {track} a uma amiga",
  "partilhei {track} nos stories",
  "{track} pra playlist do carro",
  "{track} ficou na cabeça o dia todo",
  "acordei com {track} na cabeça",
  "o início de {track} é tão bom",
  "{track} pra quem precisa de se sentir vista",
];

const TEMPLATES_WITH_ALBUM = [
  "adicionei {album} todo à minha lista",
  "a ouvir {album} enquanto trabalho",
  "{album} inteiro sem saltar",
  "voltei ao {album}",
];

const TEMPLATES_GENERIC = [
  "bom pra ouvir a caminhar",
  "perfeita pro fim do dia",
  "boa pro caminho de casa",
  "como é q só descobri agora?",
  "alguém me recomendou e não me arrependo",
  "primeira vez a ouvir Loranne. gostei.",
  "a voz nesta é diferente",
  "o refrão fica",
  "obrigada Loranne",
  "não é música. é um espelho.",
];

type TrackInfo = { title: string; albumSlug: string; albumTitle: string; trackNumber: number; track: AlbumTrack; album: Album };

type Review = {
  id: string;
  user: string;
  beforeTrack: string;
  trackTitle: string | null;
  afterTrack: string;
  albumSlug: string | null;
  trackNumber: number | null;
  timeAgo: string;
};

function getTracks(getTitle: (slug: string, num: number, fallback: string) => string, publishedKeys: Set<string>): TrackInfo[] {
  const tracks: TrackInfo[] = [];
  for (const album of ALL_ALBUMS) {
    for (const track of album.tracks) {
      if (publishedKeys.has(`${album.slug}-t${track.number}`)) {
        tracks.push({ title: getTitle(album.slug, track.number, track.title), albumSlug: album.slug, albumTitle: album.title, trackNumber: track.number, track, album });
      }
    }
  }
  return tracks;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateReview(id: number, tracks: TrackInfo[]): Review {
  const r1 = seededRandom(id);
  const r2 = seededRandom(id + 1000);
  const r3 = seededRandom(id + 2000);
  const r4 = seededRandom(id + 3000);

  const name = GHOST_NAMES[Math.floor(r1 * GHOST_NAMES.length)];
  const trackInfo = tracks[Math.floor(r2 * tracks.length)];
  const minutes = Math.floor(r4 * 55) + 2;
  const timeAgo = minutes < 60 ? `${minutes}min` : `${Math.floor(minutes / 60)}h`;

  // Pick template type
  const roll = r3;
  if (roll < 0.55) {
    // Track template — track name is clickable
    const templates = TEMPLATES_WITH_TRACK;
    const template = templates[Math.floor(seededRandom(id + 4000) * templates.length)];
    const parts = template.split("{track}");
    return {
      id: `g-${id}`, user: maskName(name),
      beforeTrack: parts[0] || "", trackTitle: trackInfo.title, afterTrack: parts[1] || "",
      albumSlug: trackInfo.albumSlug, trackNumber: trackInfo.trackNumber,
      timeAgo,
    };
  } else if (roll < 0.75) {
    // Album template
    const templates = TEMPLATES_WITH_ALBUM;
    const template = templates[Math.floor(seededRandom(id + 4000) * templates.length)];
    const text = template.replace("{album}", trackInfo.albumTitle);
    return {
      id: `g-${id}`, user: maskName(name),
      beforeTrack: text, trackTitle: null, afterTrack: "",
      albumSlug: trackInfo.albumSlug, trackNumber: null,
      timeAgo,
    };
  } else {
    // Generic
    const template = TEMPLATES_GENERIC[Math.floor(seededRandom(id + 4000) * TEMPLATES_GENERIC.length)];
    return {
      id: `g-${id}`, user: maskName(name),
      beforeTrack: template, trackTitle: null, afterTrack: "",
      albumSlug: trackInfo.albumSlug, trackNumber: trackInfo.trackNumber,
      timeAgo,
    };
  }
}

export default function LiveReviewsFeed() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myComment, setMyComment] = useState("");
  const [sending, setSending] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { playTrack } = useMusicPlayer();
  const { getTitle } = useCustomTitles();
  const { publishedKeys } = usePublishedTracks();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserName(data.user.email.split("@")[0]);
    });
  }, []);

  useEffect(() => {
    if (publishedKeys.size === 0) return;
    const tracks = getTracks(getTitle, publishedKeys);
    if (tracks.length < 3) return;
    const hourSeed = Math.floor(Date.now() / 3600000);
    const initial = Array.from({ length: 6 }, (_, i) => generateReview(hourSeed * 100 + i, tracks));
    setReviews(initial);

    let counter = initial.length;
    intervalRef.current = setInterval(() => {
      counter++;
      const newReview = generateReview(hourSeed * 100 + counter, getTracks(getTitle, publishedKeys));
      setReviews(prev => [newReview, ...prev].slice(0, 15));
    }, 20000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [publishedKeys, getTitle]);

  function handleTrackClick(albumSlug: string, trackNumber: number) {
    const album = ALL_ALBUMS.find(a => a.slug === albumSlug);
    const track = album?.tracks.find(t => t.number === trackNumber);
    if (album && track) playTrack(track, album);
  }

  async function submitComment() {
    if (!myComment.trim() || sending) return;
    setSending(true);
    const displayName = userName ? maskName(userName) : "A***";
    const newReview: Review = {
      id: `real-${Date.now()}`, user: displayName,
      beforeTrack: myComment.trim(), trackTitle: null, afterTrack: "",
      albumSlug: null, trackNumber: null, timeAgo: "agora",
    };
    setReviews(prev => [newReview, ...prev].slice(0, 15));
    setMyComment("");
    setSending(false);
  }

  if (reviews.length === 0) return null;

  return (
    <section className="px-6 py-4">
      <div className="max-w-screen-lg mx-auto">
        <p className="text-[10px] text-[#666680] uppercase tracking-wider mb-3">O que dizem</p>

        <form onSubmit={(e) => { e.preventDefault(); submitComment(); }} className="flex gap-2 mb-4">
          <input
            type="text"
            value={myComment}
            onChange={e => setMyComment(e.target.value)}
            placeholder="O que estas a sentir?"
            maxLength={120}
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
          />
          <button
            type="submit"
            disabled={!myComment.trim() || sending}
            className="px-3 py-2 rounded-lg bg-[#C9A96E]/20 text-xs text-[#C9A96E] hover:bg-[#C9A96E]/30 transition-colors disabled:opacity-30"
          >
            Enviar
          </button>
        </form>

        <div className="space-y-1.5">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-baseline gap-2 py-1">
              <span className="text-xs text-[#C9A96E] shrink-0">{r.user}</span>
              <span className="text-xs text-[#a0a0b0] flex-1">
                {r.beforeTrack}
                {r.trackTitle && r.albumSlug && r.trackNumber && (
                  <button
                    onClick={() => handleTrackClick(r.albumSlug!, r.trackNumber!)}
                    className="text-[#F5F0E6] hover:text-[#C9A96E] transition-colors font-medium"
                  >
                    {r.trackTitle}
                  </button>
                )}
                {r.afterTrack}
              </span>
              <span className="text-[9px] text-[#666680] shrink-0">{r.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
