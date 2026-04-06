import type { Metadata } from "next";
import { ALL_ALBUMS } from "@/data/albums";
import { getAlbumCover, getTrackCoverUrl } from "@/lib/album-covers";
import { parseShareCode } from "@/lib/share-utils";
import PartilhaClient from "@/app/partilha/[albumSlug]/[faixa]/PartilhaClient";

type Props = {
  params: Promise<{ code: string }>;
};

function pickLyricLine(lyrics: string | undefined): string | undefined {
  if (!lyrics) return undefined;
  const lines = lyrics.split("\n").filter(l => {
    const t = l.trim();
    return t.length > 15 && t.length < 100 && !t.startsWith("[");
  });
  if (lines.length === 0) return undefined;
  const day = Math.floor(Date.now() / 86400000);
  return lines[day % lines.length].trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const parsed = parseShareCode(code);
  if (!parsed) return { title: "Loranne — Veus" };

  const album = ALL_ALBUMS.find(a => a.slug === parsed.albumSlug);
  const track = album?.tracks.find(t => t.number === parsed.trackNumber);
  if (!album || !track) return { title: "Loranne — Veus" };

  const lyric = pickLyricLine(track.lyrics);

  // OG image: use dynamic OG image generator (works with WhatsApp/social crawlers)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://music.seteveus.space";
  const ogImage = `${baseUrl}/api/og?album=${encodeURIComponent(album.slug)}&track=${track.number}`;

  // SEO misterioso — a frase convida, não descreve
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
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${track.title} — ${album.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ShortSharePage({ params }: Props) {
  const { code } = await params;
  const parsed = parseShareCode(code);

  if (!parsed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
        <p className="text-[#a0a0b0] text-lg">Faixa nao encontrada.</p>
      </div>
    );
  }

  const album = ALL_ALBUMS.find(a => a.slug === parsed.albumSlug);
  const track = album?.tracks.find(t => t.number === parsed.trackNumber);

  if (!album || !track) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
        <p className="text-[#a0a0b0] text-lg">Faixa nao encontrada.</p>
      </div>
    );
  }

  const cover = getAlbumCover(album);
  const trackCoverUrl = getTrackCoverUrl(album.slug, track.number);
  const lyricLine = pickLyricLine(track.lyrics);

  return (
    <PartilhaClient
      albumSlug={album.slug}
      albumTitle={album.title}
      albumColor={album.color}
      trackNumber={track.number}
      trackTitle={track.title}
      trackDescription={track.description}
      coverSrc={cover}
      trackCoverSrc={trackCoverUrl || undefined}
      lyricLine={lyricLine}
    />
  );
}
