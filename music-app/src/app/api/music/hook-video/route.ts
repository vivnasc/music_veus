import { NextRequest, NextResponse } from "next/server";

const BUCKET = "audios";

/**
 * Check if a reel/hook video exists for a track.
 * GET /api/music/hook-video?album=espelho-ilusao&track=1
 * Checks for: reel.webm, reel.mp4, hook.mp4
 * Returns: { exists: boolean, videoUrl?: string }
 */
export async function GET(req: NextRequest) {
  const album = req.nextUrl.searchParams.get("album");
  const track = req.nextUrl.searchParams.get("track");

  if (!album || !track) {
    return NextResponse.json({ exists: false });
  }

  const safeAlbum = album.replace(/[^a-z0-9-]/g, "");
  const safeTrack = String(parseInt(track, 10)).padStart(2, "0");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return NextResponse.json({ exists: false });
  }

  // Check multiple formats: reel (Canvas-generated) and hook (Runway-generated)
  const candidates = [
    `albums/${safeAlbum}/faixa-${safeTrack}-reel.mp4`,
    `albums/${safeAlbum}/faixa-${safeTrack}-reel.webm`,
    `albums/${safeAlbum}/faixa-${safeTrack}-hook.mp4`,
  ];

  try {
    for (const path of candidates) {
      const videoUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
      const res = await fetch(videoUrl, { method: "HEAD" });
      if (res.ok) {
        return NextResponse.json(
          { exists: true, videoUrl },
          { headers: { "Cache-Control": "public, s-maxage=300" } }
        );
      }
    }
    return NextResponse.json({ exists: false });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
