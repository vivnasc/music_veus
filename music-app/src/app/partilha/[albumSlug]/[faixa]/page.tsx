import type { Metadata } from "next";
import { ALL_ALBUMS as ALBUMS } from "@/data/albums";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import PartilhaClient from "./PartilhaClient";

type Props = {
  params: Promise<{ albumSlug: string; faixa: string }>;
};

function pickLyricLine(lyrics: string | undefined): string | undefined {
  if (!lyrics) return undefined;
  const lines = lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 100 && !t.startsWith("[");
  });
  if (lines.length === 0) return undefined;
  // Deterministic: pick based on day (frase do dia)
  const day = Math.floor(Date.now() / 86400000);
  return lines[day % lines.length].trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug, faixa } = await params;
  const trackNum = parseInt(faixa, 10);
  const album = ALBUMS.find(a => a.slug === albumSlug);
  const track = album?.tracks.find(t => t.number === trackNum);

  if (!album || !track) {
    return { title: "Véus" };
  }

  const lyric = pickLyricLine(track.lyrics);

  // OG image: track cover from Supabase (absolute URL)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const pad = String(track.number).padStart(2, "0");
  const ogImage = `${supabaseUrl}/storage/v1/object/public/audios/albums/${album.slug}/faixa-${pad}-cover.jpg`;

  // SEO misterioso e envolvente — convite, não descrição
  const title = lyric
    ? `"${lyric}" — Loranne`
    : `${track.title} — Loranne`;
  const description = track.description
    ? `${track.description}. Ouve o que ninguem te diz em voz alta.`
    : `Ha coisas que so se ouvem quando tudo o resto se cala.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "Veus by Loranne",
      locale: "pt_PT",
      type: "music.song",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${track.title} — ${album.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PartilhaPage({ params }: Props) {
  const { albumSlug, faixa } = await params;
  const trackNum = parseInt(faixa, 10);
  const album = ALBUMS.find(a => a.slug === albumSlug);
  const track = album?.tracks.find(t => t.number === trackNum);

  if (!album || !track) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
        <p className="text-[#a0a0b0] text-lg">Faixa nao encontrada.</p>
      </div>
    );
  }

  const albumCoverPage = getAlbumCover(album);
  const trackCoverPage = getTrackCoverUrl(album.slug, track.number);
  const lyricLine = pickLyricLine(track.lyrics);

  return (
    <PartilhaClient
      albumSlug={album.slug}
      albumTitle={album.title}
      albumColor={album.color}
      trackNumber={track.number}
      trackTitle={track.title}
      trackDescription={track.description}
      coverSrc={albumCoverPage}
      trackCoverSrc={trackCoverPage || undefined}
      lyricLine={lyricLine}
    />
  );
}
