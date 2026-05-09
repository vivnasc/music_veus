import { ALL_LISTS } from "@/data/curated-lists";
import { notFound } from "next/navigation";
import ListPageClient from "./ListPageClient";
import type { TrackEnergy } from "@/data/albums";
import { LORANNE_MOODS, MOOD_META, type LoranneMood } from "@/data/loranne-moods";

const MOOD_ENERGY_MAP: Record<string, TrackEnergy> = {
  "mood-sussurro": "whisper",
  "mood-constante": "steady",
  "mood-pulso": "pulse",
  "mood-hino": "anthem",
  "mood-cru": "raw",
};

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ALL_LISTS.map(l => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const list = ALL_LISTS.find(l => l.slug === slug);
  return { title: list ? `${list.title} — Véus` : "Lista — Véus" };
}

export default async function ListPage({ params }: Props) {
  const { slug } = await params;
  const list = ALL_LISTS.find(l => l.slug === slug);
  if (!list) notFound();

  const categoryLabel = list.category === "genero" ? "Género" : list.category === "mood" ? "Mood" : "Tema";
  const moodEnergy = MOOD_ENERGY_MAP[list.slug] || null;

  // Detect Loranne mood (mood-loranne-{slug}) — pass extra metadata for header
  let loranneMood: { mood: LoranneMood; vibe: string } | null = null;
  if (slug.startsWith("mood-loranne-")) {
    const moodSlug = slug.replace("mood-loranne-", "") as LoranneMood;
    if (LORANNE_MOODS.includes(moodSlug)) {
      loranneMood = { mood: moodSlug, vibe: MOOD_META[moodSlug].vibe };
    }
  }

  return <ListPageClient slug={slug} categoryLabel={categoryLabel} moodEnergy={moodEnergy} loranneMood={loranneMood} />;
}
