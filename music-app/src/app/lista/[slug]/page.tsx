import { ALL_LISTS, resolveList } from "@/data/curated-lists";
import { notFound } from "next/navigation";
import Link from "next/link";
import ListTrackRow from "@/components/music/ListTrackRow";
import VersionTracks from "@/components/music/VersionTracks";
import NavBar from "@/components/music/NavBar";
import type { TrackEnergy } from "@/data/albums";

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

  const tracks = resolveList(list);
  const categoryLabel = list.category === "genero" ? "Género" : list.category === "mood" ? "Mood" : "Tema";
  const moodEnergy = MOOD_ENERGY_MAP[list.slug];

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at center top, ${list.color}, transparent 70%)` }}
        />
        <div className="relative max-w-screen-lg mx-auto px-6 pt-8 pb-10">
          <Link href="/" className="text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors">
            &larr; Explorar
          </Link>

          <div className="mt-6 flex items-start gap-5">
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ backgroundColor: `${list.color}20`, border: `1px solid ${list.color}30` }}
            >
              <ListIcon name={list.icon} color={list.color} />
            </div>

            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-widest" style={{ color: list.color }}>
                {categoryLabel}
              </span>
              <h1 className="font-display text-3xl font-bold text-[#F5F0E6] mt-1">{list.title}</h1>
              <p className="text-sm text-[#a0a0b0] mt-1">{list.subtitle}</p>
              <p className="text-xs text-[#666680] mt-2">{tracks.length} faixas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="max-w-screen-lg mx-auto px-6 pb-32">
        <div className="divide-y divide-white/5">
          {tracks.map((track, i) => (
            <ListTrackRow key={`${track.albumSlug}-${track.number}`} track={track} index={i} allTracks={tracks} />
          ))}
        </div>

        {/* Version variants for mood lists */}
        {moodEnergy && (
          <VersionTracks energy={moodEnergy} listColor={list.color} startIndex={tracks.length} />
        )}
      </div>
    </div>
  );
}

function ListIcon({ name, color }: { name: string; color: string }) {
  const props = { viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "1.5", className: "h-8 w-8" };
  const lc = "round";

  switch (name) {
    case "leaf":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M11 20A7 7 0 019.8 6.9C15.5 4.9 20 4 20 4s-.9 4.5-2.9 10.1A7 7 0 0111 20z" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>;
    case "flame":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></svg>;
    case "zap":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="4" /><path strokeLinecap={lc} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>;
    case "moon":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>;
    case "footprints":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7 9.33 8 8 10H4zM20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 1.5.67 2.5 2 4.5h4z" /></svg>;
    case "heart-pulse":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.572" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M5 12h2l2-3 3 6 2-3h2" /></svg>;
    case "crown":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM5 20h14" /></svg>;
    case "droplet":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>;
    case "heart":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.572z" /></svg>;
    case "shield":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "tree-deciduous":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 22v-7M8 9a4 4 0 118 0 3 3 0 11-2 5.65V15H10v-.35A3 3 0 018 9z" /></svg>;
    case "person-standing":
      return <svg {...props}><circle cx="12" cy="5" r="1" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M12 8v6M9 22l3-8 3 8M8 12h8" /></svg>;
    case "sprout":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path strokeLinecap={lc} strokeLinejoin={lc} d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.2 1.7-4.6-2.7.1-4 1-4.9 2z" /></svg>;
    case "volume-x":
      return <svg {...props}><path strokeLinecap={lc} strokeLinejoin={lc} d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="4" /></svg>;
  }
}
