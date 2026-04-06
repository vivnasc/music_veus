import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Public endpoint: list all versions for a given album.
 * GET /api/music/album-versions?album=espelho-ilusao
 * Returns: { versions: [{ track_number, version_name, energy }] }
 */
export async function GET(req: NextRequest) {
  const album = req.nextUrl.searchParams.get("album");
  if (!album) {
    return NextResponse.json({ versions: [] });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ versions: [] });
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("track_versions")
      .select("track_number, version_name, energy")
      .eq("album_slug", album)
      .order("track_number")
      .order("version_name");

    if (error) {
      // Table may not exist yet
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json({ versions: [] });
      }
      return NextResponse.json({ versions: [] });
    }

    return NextResponse.json(
      { versions: data || [] },
      { headers: { "Cache-Control": "public, s-maxage=120" } }
    );
  } catch {
    return NextResponse.json({ versions: [] });
  }
}
