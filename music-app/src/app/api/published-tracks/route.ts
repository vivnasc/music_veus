import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "audios";

/**
 * Public endpoint — lists tracks with published audio.
 * GET /api/published-tracks
 * Returns: { tracks: ["espelho-ilusao-t1", "espelho-ilusao-t3", ...] }
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ tracks: [] });
  }

  const supabase = createClient(url, key);

  try {
    const tracks: string[] = [];
    const seen = new Set<string>();

    // Scan both "albums/" prefix and root level folders
    for (const prefix of ["albums", ""]) {
      const { data: folders } = await supabase.storage
        .from(BUCKET)
        .list(prefix || undefined, { limit: 200 });

      for (const folder of folders || []) {
        if (!folder.name) continue;
        // Skip non-album folders
        if (folder.name.startsWith("carousel-") || folder.name.startsWith("citacao-")) continue;

        const folderPath = prefix ? `${prefix}/${folder.name}` : folder.name;
        const { data: files } = await supabase.storage
          .from(BUCKET)
          .list(folderPath, { limit: 100 });

        for (const file of files || []) {
          const mainMatch = file.name.match(/^faixa-(\d+)\.mp3$/);
          if (mainMatch) {
            const key = `${folder.name}-t${parseInt(mainMatch[1], 10)}`;
            if (!seen.has(key)) {
              seen.add(key);
              tracks.push(key);
            }
          }
        }
      }
    }

    return NextResponse.json(
      { tracks },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ tracks: [] });
  }
}
