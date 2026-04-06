import type { Metadata } from "next";
import { ALL_ALBUMS } from "@/data/albums";
import { createClient } from "@supabase/supabase-js";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getAlbumCoverTrack(slug: string): Promise<number> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return 1;
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from("album_cover_track")
      .select("track_number")
      .eq("album_slug", slug)
      .single();
    return data?.track_number || 1;
  } catch { return 1; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = ALL_ALBUMS.find(a => a.slug === slug);
  if (!album) return { title: "Loranne — Véus" };

  const coverTrack = await getAlbumCoverTrack(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://music.seteveus.space";
  const ogImage = `${baseUrl}/api/og?album=${encodeURIComponent(slug)}&track=${coverTrack}`;

  return {
    title: `${album.title} — Loranne`,
    description: album.subtitle,
    openGraph: {
      title: `${album.title} — Loranne`,
      description: `${album.subtitle}. ${album.tracks.length} faixas. Ouve agora.`,
      siteName: "Véus by Loranne",
      locale: "pt_PT",
      type: "music.album",
      images: [{ url: ogImage, width: 1200, height: 630, alt: album.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${album.title} — Loranne`,
      description: album.subtitle,
      images: [ogImage],
    },
  };
}

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
