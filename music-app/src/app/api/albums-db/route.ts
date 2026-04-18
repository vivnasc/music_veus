import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Public endpoint: list all PUBLISHED DB albums in the same shape as Album
 * (so they can be merged into ALL_ALBUMS at runtime).
 *
 * GET /api/albums-db
 * Returns: { albums: Album[] }
 */

type DbTrack = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  lang: string | null;
  energy: string | null;
  flavor: string | null;
  vocal_mode: string | null;
  prompt: string | null;
  lyrics: string | null;
  duration_seconds: number | null;
  audio_url: string | null;
  published: boolean;
};

type DbAlbum = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  color: string | null;
  collection: string;
  published: boolean;
  status: string | null;
  distribution: boolean | null;
  distrokid_upload_date: string | null;
  artists_db: { slug: string; name: string } | null;
  tracks_db: DbTrack[];
};

export const revalidate = 30;

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ albums: [] });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("albums_db")
      .select("*, artists_db(slug, name), tracks_db(*)")
      .eq("published", true)
      .returns<DbAlbum[]>();

    if (error) {
      // Table may not exist yet — return empty
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ albums: [] });
      }
      return NextResponse.json({ albums: [], erro: error.message });
    }

    // Map to the same shape as static Album type
    const albums = (data || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      subtitle: a.subtitle ?? "",
      artist: a.artists_db?.name,
      product: a.collection,
      color: a.color ?? "#C9A96E",
      status: a.status ?? "draft",
      distribution: a.distribution ?? false,
      distrokidUploadDate: a.distrokid_upload_date,
      _isDbAlbum: true, // sentinel so consumers can distinguish if needed
      tracks: (a.tracks_db || [])
        .sort((x, y) => x.number - y.number)
        .map((t) => ({
          number: t.number,
          title: t.title,
          description: t.description ?? "",
          lang: (t.lang === "EN" ? "EN" : "PT"),
          energy: t.energy ?? "whisper",
          flavor: t.flavor,
          vocalMode: (t.vocal_mode === "duet" ? "duet" : "solo"),
          prompt: t.prompt ?? "",
          lyrics: t.lyrics ?? "",
          durationSeconds: t.duration_seconds ?? 240,
          audioUrl: t.audio_url,
          published: t.published,
        })),
    }));

    return NextResponse.json(
      { albums },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch (e) {
    return NextResponse.json({ albums: [], erro: e instanceof Error ? e.message : "?" });
  }
}
