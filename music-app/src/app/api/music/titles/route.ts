import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Public endpoint: get all custom track titles.
 * GET /api/music/titles
 * Returns: { titles: { "album-slug-tN": "Custom Title", ... } }
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ titles: {} });

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("track_metadata")
      .select("album_slug, track_number, custom_title");

    if (error) return NextResponse.json({ titles: {} });

    const titles: Record<string, string> = {};
    for (const row of data || []) {
      if (row.custom_title) {
        titles[`${row.album_slug}-t${row.track_number}`] = row.custom_title;
      }
    }

    return NextResponse.json(
      { titles },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json({ titles: {} });
  }
}
