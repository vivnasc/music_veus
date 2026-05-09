"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRecommendations } from "@/hooks/useRecommendations";
import { ALL_LISTS, type CuratedList } from "@/data/curated-lists";
import { ALL_ALBUMS, type Album, type AlbumTrack } from "@/data/albums";
import { LORANNE_MOODS, MOOD_META, type LoranneMood, type CompactMoodsData } from "@/data/loranne-moods";
import LORANNE_MOODS_DATA from "@/data/loranne-moods-data.json";
import { getTrackCoverUrl } from "@/lib/album-covers";
import AddToPlaylistModal from "@/components/music/AddToPlaylistModal";
import OutrosMundosSection from "@/components/music/OutrosMundosSection";
import { useDbAlbums } from "@/hooks/useDbAlbums";

const MOODS_DATA = LORANNE_MOODS_DATA as unknown as CompactMoodsData;

// Pre-compute lookup map for mood badges to avoid repeated string splits per render
const MOOD_LOOKUP: Map<string, { moods: string[]; confidence: number }> = (() => {
  const map = new Map<string, { moods: string[]; confidence: number }>();
  for (const [key, compact] of Object.entries(MOODS_DATA.tracks)) {
    map.set(key, { moods: compact[0].split(","), confidence: compact[1] });
  }
  return map;
})();

// Time-of-day → suggested moods
function suggestedMoodsByHour(hour: number): LoranneMood[] {
  if (hour >= 6 && hour < 11) return ["acordar", "respirar"];
  if (hour >= 11 && hour < 18) return ["aterrar", "elevar"];
  if (hour >= 18 && hour < 23) return ["reunir-se", "atravessar"];
  return ["respirar", "lembrar"];
}

const COLLECTION_PRODUCTS = ["espelho", "no", "curso", "livro", "incenso", "eter", "nua", "sangue", "fibra", "grao", "mare"] as const;

const COLLECTION_LABELS: Record<string, { pt: string; en: string; sub: string }> = {
  espelho: { pt: "Espelhos", en: "Mirrors", sub: "A transformação interior — os 7 véus" },
  no: { pt: "Nós", en: "Knots", sub: "Entre duas pessoas — os 7 nós" },
  curso: { pt: "Cursos", en: "Courses", sub: "Escola dos Véus" },
  livro: { pt: "Livro", en: "Book", sub: "Livro filosófico" },
  incenso: { pt: "Incenso", en: "Incense", sub: "O fumo que sobe — o sagrado sem nome" },
  eter: { pt: "Éter", en: "Ether", sub: "O invisível que se sente" },
  nua: { pt: "Nua", en: "Bare", sub: "A nudez emocional do amor" },
  sangue: { pt: "Sangue", en: "Blood", sub: "O que não se escolhe, o que se herda" },
  fibra: { pt: "Fibra", en: "Fiber", sub: "O corpo que insiste" },
  grao: { pt: "Grão", en: "Grain", sub: "O pequeno que faz o todo" },
  mare: { pt: "Maré", en: "Tide", sub: "O que vai e volta" },
};

function getFeaturedAlbum(product: string, publishedKeys: Set<string>): Album | null {
  // Prefer an album that has published audio (and therefore covers)
  const published = ALL_ALBUMS.find(
    (a) => a.product === product && a.tracks.some((t) => publishedKeys.has(`${a.slug}-t${t.number}`))
  );
  if (published) return published;
  // Fallback to first album in collection
  return ALL_ALBUMS.find((a) => a.product === product) || null;
}

function getCollectionTracks(product: string, publishedKeys: Set<string>): { trackNumber: number; albumSlug: string }[] {
  return ALL_ALBUMS
    .filter(a => a.product === product)
    .flatMap(a => a.tracks
      .filter(t => publishedKeys.has(`${a.slug}-t${t.number}`))
      .map(t => ({ trackNumber: t.number, albumSlug: a.slug }))
    );
}

function CollectionGrid({ publishedKeys, loading, dbAlbums }: { publishedKeys: Set<string>; loading: boolean; dbAlbums: Album[] }) {
  const [playlistProduct, setPlaylistProduct] = useState<string | null>(null);

  // Add DB-only collections (not in COLLECTION_PRODUCTS) so user-created
  // collections via /admin/albums YAML upload also appear here.
  const extraProducts = Array.from(
    new Set(dbAlbums.map((a) => a.product).filter((p) => !COLLECTION_PRODUCTS.includes(p as never)))
  );
  const allProducts = [...COLLECTION_PRODUCTS, ...extraProducts];

  // While the published-tracks API is still loading, show skeleton tiles
  // (one per collection) instead of an empty grid.
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allProducts.map((product) => (
          <div key={product}>
            <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
            <div className="h-3 w-20 rounded bg-white/5 animate-pulse mt-1.5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allProducts.map((product) => {
          const dbAlbumsForProduct = dbAlbums.filter((a) => a.product === product);
          const album = getFeaturedAlbum(product, publishedKeys) ?? dbAlbumsForProduct[0];
          const label = COLLECTION_LABELS[product] ?? {
            pt: product.split("-").map((s) => s[0]?.toUpperCase() + s.slice(1)).join(" "),
            en: "",
            sub: "",
          };
          const legacyHasPublished = ALL_ALBUMS.some(
            (a) => a.product === product && a.tracks.some((t) => publishedKeys.has(`${a.slug}-t${t.number}`))
          );
          const hasPublished = legacyHasPublished || dbAlbumsForProduct.length > 0;
          if (!album || !hasPublished) return null;
          const legacyCount = ALL_ALBUMS.filter(a => a.product === product && a.tracks.some(t => publishedKeys.has(`${a.slug}-t${t.number}`))).length;
          const albumCount = legacyCount + dbAlbumsForProduct.length;
          return (
            <div key={product} className="group relative">
              <Link
                href={`/coleccao/${product}`}
                className="block rounded-xl overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${album.color}, ${album.color}44)` }}>
                  <Image
                    src={getTrackCoverUrl(album.slug, 1)}
                    alt={label.pt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform brightness-50"
                    unoptimized
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                    <span className="text-xl font-semibold text-white">{label.pt}</span>
                    <span className="text-[10px] text-white/50 mt-0.5">{label.en}</span>
                    {albumCount > 1 && (
                      <span className="text-[10px] text-white/40 mt-1">{albumCount} albuns</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <p className="text-[10px] text-[#666680] line-clamp-1 flex-1">{label.sub}</p>
                <button
                  onClick={() => setPlaylistProduct(product)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
                  title={`Adicionar ${label.pt} à playlist`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-3.5 w-3.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {playlistProduct && (
        <AddToPlaylistModal
          trackNumber={1}
          albumSlug=""
          batch={getCollectionTracks(playlistProduct, publishedKeys)}
          onClose={() => setPlaylistProduct(null)}
        />
      )}
    </>
  );
}

export default function DescobrePage() {
  const recommendations = useRecommendations(16);
  const [publishedKeys, setPublishedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { albums: dbAlbums } = useDbAlbums();
  const router = useRouter();

  // Mix state — Set of selected moods. Persists in localStorage so users
  // can return to refine.
  const [mixMoods, setMixMoods] = useState<Set<LoranneMood>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("loranne-mood-mix");
      return raw ? new Set(JSON.parse(raw) as LoranneMood[]) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    try {
      localStorage.setItem("loranne-mood-mix", JSON.stringify(Array.from(mixMoods)));
    } catch {}
  }, [mixMoods]);

  function toggleMood(mood: LoranneMood) {
    setMixMoods((prev) => {
      const next = new Set(prev);
      if (next.has(mood)) next.delete(mood); else next.add(mood);
      return next;
    });
  }

  function clearMix() { setMixMoods(new Set()); }

  // Mix preview — count of unique tracks across selected moods (published)
  const mixCount = useMemo(() => {
    if (mixMoods.size === 0) return 0;
    let count = 0;
    for (const [key, info] of MOOD_LOOKUP) {
      if (info.moods.some((m) => mixMoods.has(m as LoranneMood))) {
        const m = key.match(/^(.+)\/(\d+)$/);
        if (m && publishedKeys.has(`${m[1]}-t${m[2]}`)) count++;
      }
    }
    return count;
  }, [mixMoods, publishedKeys]);

  const suggestedHour = typeof window !== "undefined" ? new Date().getHours() : 10;
  const suggested = suggestedMoodsByHour(suggestedHour);

  useEffect(() => {
    fetch("/api/published-tracks")
      .then((r) => r.json())
      .then((data: { tracks?: string[] }) => {
        if (data.tracks) setPublishedKeys(new Set(data.tracks));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const géneros = ALL_LISTS.filter((l) => l.category === "genero");
  const moodsLoranne = ALL_LISTS.filter((l) => l.slug.startsWith("mood-loranne-"));
  const moodsEnergia = ALL_LISTS.filter((l) => l.category === "mood" && !l.slug.startsWith("mood-loranne-"));
  const temas = ALL_LISTS.filter((l) => l.category === "tema");

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="shrink-0 p-1.5 -ml-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Voltar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Descobre</h1>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 space-y-10 pb-32">
        {/* HERO — Como te sentes agora? (7 moods Loranne) */}
        <HeroMoodSelector
          publishedKeys={publishedKeys}
          mixMoods={mixMoods}
          onToggleMood={toggleMood}
          suggested={suggested}
        />

        {/* Para Ti */}
        {recommendations.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">Para ti</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {recommendations.map(({ track, album }: { track: AlbumTrack; album: Album }) => (
                <Link
                  key={`rec-${album.slug}-${track.number}`}
                  href={`/album/${album.slug}`}
                  className="group text-left block"
                >
                  <div className="aspect-square rounded-lg mb-1.5 overflow-hidden bg-[#1a1a2e]">
                    <Image
                      src={getTrackCoverUrl(album.slug, track.number)}
                      alt={track.title}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                  <p className="text-xs text-[#c0c0d0] truncate">{track.title}</p>
                  <p className="text-[10px] text-[#666680] truncate">{album.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Colecções */}
        <section>
          <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">Colecções</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i}>
                  <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-white/5 animate-pulse mt-1.5" />
                </div>
              ))}
            </div>
          ) : (
          <CollectionGrid publishedKeys={publishedKeys} loading={loading} dbAlbums={dbAlbums} />
          )}
        </section>

        {/* Géneros */}
        <CuratedSection title="Géneros" lists={géneros} publishedKeys={publishedKeys} loading={loading} />

        {/* Energia */}
        <CuratedSection title="Energia" lists={moodsEnergia} publishedKeys={publishedKeys} loading={loading} />

        {/* Temas */}
        <CuratedSection title="Temas" lists={temas} publishedKeys={publishedKeys} loading={loading} />

        {/* Outros Mundos */}
        <OutrosMundosSection />
      </div>

      {/* Mix sticky bar */}
      {mixMoods.size > 0 && (
        <MixBar
          mixMoods={mixMoods}
          mixCount={mixCount}
          onClear={clearMix}
          onPlay={() => {
            const moodsParam = Array.from(mixMoods).join(",");
            router.push(`/lista/mix?moods=${moodsParam}`);
          }}
        />
      )}
    </main>
  );
}

// ─────────────────────────────────────────────
// HeroMoodSelector — 7 mood cards, big and emotive
// ─────────────────────────────────────────────

function HeroMoodSelector({
  publishedKeys,
  mixMoods,
  onToggleMood,
  suggested,
}: {
  publishedKeys: Set<string>;
  mixMoods: Set<LoranneMood>;
  onToggleMood: (m: LoranneMood) => void;
  suggested: LoranneMood[];
}) {
  // Count published tracks per mood
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const [key, info] of MOOD_LOOKUP) {
      const m = key.match(/^(.+)\/(\d+)$/);
      if (!m || !publishedKeys.has(`${m[1]}-t${m[2]}`)) continue;
      for (const mood of info.moods) {
        c[mood] = (c[mood] || 0) + 1;
      }
    }
    return c;
  }, [publishedKeys]);

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#F5F0E6]">Como te sentes agora?</h2>
        <p className="text-xs text-[#a0a0b0] mt-1">
          Toca para ouvir · ou junta vários para fazer o teu mix
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {LORANNE_MOODS.map((mood) => {
          const meta = MOOD_META[mood];
          const isSelected = mixMoods.has(mood);
          const isSuggested = suggested.includes(mood);
          const count = counts[mood] || 0;
          if (count === 0) return null;
          return (
            <div
              key={mood}
              className="group relative rounded-2xl overflow-hidden transition-transform"
              style={{
                boxShadow: isSelected
                  ? `inset 0 0 0 3px ${meta.color}, 0 4px 20px ${meta.color}55`
                  : "none",
              }}
            >
              <Link
                href={`/lista/mood-loranne-${meta.playlistSlug}`}
                className="block aspect-[5/4] relative"
                style={{
                  background: `linear-gradient(135deg, ${meta.color}, ${meta.color}33)`,
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-2xl font-semibold text-white drop-shadow-sm">
                      {meta.label}
                    </span>
                    {isSuggested && (
                      <span className="text-[10px] text-white/90 bg-black/30 px-2 py-0.5 rounded-full">
                        agora
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/80 line-clamp-2 mb-1">
                    {meta.paraQuem}
                  </p>
                  <p className="text-[10px] text-white/50">{count} faixas</p>
                </div>
              </Link>

              {/* Mix toggle button (top-right) */}
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleMood(mood); }}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isSelected ? "bg-white text-black" : "bg-black/40 text-white/80 hover:bg-black/60"
                }`}
                title={isSelected ? "Remover do mix" : "Juntar ao mix"}
                aria-label={isSelected ? "Remover do mix" : "Juntar ao mix"}
              >
                {isSelected ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// MixBar — sticky bottom bar when mix is active
// ─────────────────────────────────────────────

function MixBar({
  mixMoods,
  mixCount,
  onClear,
  onPlay,
}: {
  mixMoods: Set<LoranneMood>;
  mixCount: number;
  onClear: () => void;
  onPlay: () => void;
}) {
  const moodList = Array.from(mixMoods).map((m) => MOOD_META[m].label).join(" + ");
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#1a1a2e] border-t border-white/10 px-4 py-3 backdrop-blur-md">
      <div className="max-w-screen-lg mx-auto flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            Mix: {moodList}
          </p>
          <p className="text-[11px] text-white/60">
            {mixCount} {mixCount === 1 ? "faixa" : "faixas"}
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-white/60 hover:text-white px-3 py-2"
        >
          Limpar
        </button>
        <button
          onClick={onPlay}
          disabled={mixCount === 0}
          className={`text-xs font-semibold px-4 py-2 rounded-full transition ${
            mixCount === 0
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "bg-[#C9A96E] text-black hover:bg-[#D4B57F]"
          }`}
        >
          ▶ Tocar mix
        </button>
      </div>
    </div>
  );
}

function CuratedSection({ title, lists, publishedKeys, loading }: { title: string; lists: CuratedList[]; publishedKeys: Set<string>; loading: boolean }) {
  if (loading) {
    return (
      <section>
        <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1,2,3].map(i => (
            <div key={i}>
              <div className="aspect-square rounded-xl bg-white/5 animate-pulse" />
              <div className="h-3 w-16 rounded bg-white/5 animate-pulse mt-1.5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Filter each list to only include published tracks, hide empty lists
  const filtered = lists
    .map((list) => ({
      ...list,
      tracks: list.tracks.filter((t) => publishedKeys.has(`${t.albumSlug}-t${t.trackNumber}`)),
    }))
    .filter((list) => list.tracks.length > 0);

  if (filtered.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((list) => {
          const coverTrack = list.tracks[0];
          return (
            <Link
              key={list.slug}
              href={`/lista/${list.slug}`}
              className="group block rounded-xl overflow-hidden"
            >
              <div className="aspect-square relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${list.color}44, ${list.color}11)` }}>
                <Image
                  src={getTrackCoverUrl(coverTrack.albumSlug, coverTrack.trackNumber)}
                  alt={list.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform brightness-[0.4]"
                  unoptimized
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                  <span className="text-lg font-semibold text-white">{list.title}</span>
                  <span className="text-[10px] text-white/50 mt-1 line-clamp-2 max-w-[80%]">{list.subtitle}</span>
                </div>
              </div>
              <p className="text-[10px] text-[#666680] mt-1.5 px-1">{list.tracks.length} faixas</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
