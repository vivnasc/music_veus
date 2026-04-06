import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "audios";

/**
 * Public endpoint — lists tracks with published audio.
 * GET /api/published-tracks
 * Returns: { tracks: ["espelho-ilusao-t1", ...], albumDates: { "espelho-ilusao": "2025-01-15T..." } }
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ tracks: [], albumDates: {} });
  }

  const supabase = createClient(url, key);

  try {
    const tracks: string[] = [];
    const seen = new Set<string>();
    const albumDates: Record<string, string> = {};

    // Scan both "albums/" prefix and root level folders
    // First: list all folders in parallel
    const [rootResult, albumsResult] = await Promise.all([
      supabase.storage.from(BUCKET).list(undefined, { limit: 200 }),
      supabase.storage.from(BUCKET).list("albums", { limit: 200 }),
    ]);

    type FolderEntry = { name: string; prefix: string };
    const allFolders: FolderEntry[] = [];
    for (const folder of rootResult.data || []) {
      if (!folder.name || folder.name.startsWith("carousel-") || folder.name.startsWith("citacao-")) continue;
      allFolders.push({ name: folder.name, prefix: "" });
    }
    for (const folder of albumsResult.data || []) {
      if (!folder.name || folder.name.startsWith("carousel-") || folder.name.startsWith("citacao-")) continue;
      allFolders.push({ name: folder.name, prefix: "albums" });
    }

    // Then: list files in all folders in parallel (batched)
    const BATCH_SIZE = 20;
    for (let i = 0; i < allFolders.length; i += BATCH_SIZE) {
      const batch = allFolders.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(f => {
          const path = f.prefix ? `${f.prefix}/${f.name}` : f.name;
          return supabase.storage.from(BUCKET).list(path, { limit: 100 }).then(r => ({ folder: f, files: r.data }));
        })
      );

      for (const { folder, files } of results) {
        for (const file of files || []) {
          const mainMatch = file.name.match(/^faixa-(\d+)\.mp3$/);
          if (mainMatch) {
            const key = `${folder.name}-t${parseInt(mainMatch[1], 10)}`;
            if (!seen.has(key)) {
              seen.add(key);
              tracks.push(key);
            }
            // Track the most recent upload date per album
            const fileDate = (file as { created_at?: string }).created_at;
            if (fileDate) {
              const prev = albumDates[folder.name];
              if (!prev || fileDate > prev) {
                albumDates[folder.name] = fileDate;
              }
            }
          }
        }
      }
    }

    return NextResponse.json(
      { tracks, albumDates },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ tracks: [], albumDates: {} });
  }
}
