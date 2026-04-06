import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "audios";

/**
 * List all audio files for a track (main + versions).
 * GET /api/music/versions?album=espelho-ilusao&track=1
 * Returns: { main: boolean, versions: ["remix-1", "suno-v1", ...] }
 */
export async function GET(req: NextRequest) {
  const album = req.nextUrl.searchParams.get("album");
  const track = req.nextUrl.searchParams.get("track");

  if (!album || !track) {
    return NextResponse.json({ main: false, versions: [] });
  }

  const safeAlbum = album.replace(/[^a-z0-9-]/g, "");
  const safeTrack = String(parseInt(track, 10)).padStart(2, "0");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ main: false, versions: [] });
  }

  try {
    const supabase = createClient(url, key);
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(`albums/${safeAlbum}`, { limit: 100 });

    let hasMain = false;
    const versions: string[] = [];

    for (const f of files || []) {
      if (f.name === `faixa-${safeTrack}.mp3`) {
        hasMain = true;
      }
      const vMatch = f.name.match(new RegExp(`^faixa-${safeTrack}-(.+)\\.mp3$`));
      if (vMatch && !vMatch[1].includes("cover")) {
        versions.push(vMatch[1]);
      }
    }

    return NextResponse.json(
      { main: hasMain, versions },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  } catch {
    return NextResponse.json({ main: false, versions: [] });
  }
}
