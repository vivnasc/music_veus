import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "audios";

/**
 * Public endpoint — lists tracks with published audio and album publication dates.
 * GET /api/published-tracks
 * Returns: {
 *   tracks: ["espelho-ilusao-t1", ...],
 *   albums: { "espelho-ilusao": { trackCount: 5, publishedAt: "2026-03-15T..." }, ... }
 * }
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ tracks: [], albums: {} });
  }

  const supabase = createClient(url, key);

  try {
    const tracks: string[] = [];
    const seen = new Set<string>();
    const albumDates: Record<string, { trackCount: number; publishedAt: string }> = {};

    // Collect all folders from both prefixes
    const allFolders: { prefix: string; name: string }[] = [];
    for (const prefix of ["albums", ""]) {
      const { data: folders } = await supabase.storage
        .from(BUCKET)
        .list(prefix || undefined, { limit: 500 });

      for (const folder of folders || []) {
        if (!folder.name) continue;
        if (folder.name.startsWith("carousel-") || folder.name.startsWith("citacao-")) continue;
        allFolders.push({ prefix, name: folder.name });
      }
    }

    // Scan all folders in parallel (much faster than sequential)
    const results = await Promise.all(
      allFolders.map(async ({ prefix, name }) => {
        const folderPath = prefix ? `${prefix}/${name}` : name;
        const { data: files } = await supabase.storage
          .from(BUCKET)
          .list(folderPath, { limit: 100 });

        let earliestDate: string | null = null;
        let trackCount = 0;
        const folderTracks: string[] = [];

        for (const file of files || []) {
          const mainMatch = file.name.match(/^faixa-(\d+)\.mp3$/);
          if (mainMatch) {
            const trackKey = `${name}-t${parseInt(mainMatch[1], 10)}`;
            folderTracks.push(trackKey);
            trackCount++;

            // Track earliest file date as album publication date (first upload = launch)
            const fileDate = (file as { created_at?: string }).created_at;
            if (fileDate && (!earliestDate || fileDate < earliestDate)) {
              earliestDate = fileDate;
            }
          }
        }

        return { name, trackCount, earliestDate, folderTracks };
      })
    );

    // Merge results
    for (const { name, trackCount, earliestDate, folderTracks } of results) {
      for (const trackKey of folderTracks) {
        if (!seen.has(trackKey)) {
          seen.add(trackKey);
          tracks.push(trackKey);
        }
      }
      if (trackCount > 0) {
        albumDates[name] = {
          trackCount,
          publishedAt: earliestDate || new Date().toISOString(),
        };
      }
    }

    return NextResponse.json(
      { tracks, albums: albumDates },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ tracks: [], albums: {} });
  }
}
