import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Public endpoint: get all custom (edited) lyrics.
 * GET /api/music/lyrics
 * Returns: { lyrics: { "album-slug/trackNumber": "lyrics...", ... } }
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ lyrics: {} });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("track_custom_lyrics")
      .select("album_slug, track_number, lyrics");

    if (error) return NextResponse.json({ lyrics: {} });

    const lyrics: Record<string, string> = {};
    for (const row of data || []) {
      if (row.lyrics) {
        lyrics[`${row.album_slug}/${row.track_number}`] = row.lyrics;
      }
    }

    return NextResponse.json(
      { lyrics },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json({ lyrics: {} });
  }
}
