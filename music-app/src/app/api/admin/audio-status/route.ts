import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

/**
 * Lista todas as faixas que existem no bucket audios/albums/.
 * Retorna um Set-like array de chaves "albumSlug/trackNumber".
 * GET /api/admin/audio-status
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  // List all folders inside albums/
  const { data: folders, error: foldersError } = await supabase.storage
    .from(BUCKET)
    .list("albums", { limit: 1000 });

  if (foldersError) {
    return NextResponse.json({ erro: foldersError.message }, { status: 500 });
  }

  const existing: string[] = [];
  const versions: string[] = [];

  // For each album folder, list files
  for (const folder of folders || []) {
    if (!folder.name) continue;
    const { data: files } = await supabase.storage
      .from(BUCKET)
      .list(`albums/${folder.name}`, { limit: 100 });

    for (const file of files || []) {
      // faixa-01.mp3 → main track
      const mainMatch = file.name.match(/^faixa-(\d+)\.mp3$/);
      if (mainMatch) {
        const trackNum = parseInt(mainMatch[1], 10);
        existing.push(`${folder.name}-t${trackNum}`);
        continue;
      }
      // faixa-01-suno-v1.mp3 → version
      const versionMatch = file.name.match(/^faixa-(\d+)-(.+)\.mp3$/);
      if (versionMatch) {
        const trackNum = parseInt(versionMatch[1], 10);
        versions.push(`${folder.name}-t${trackNum}-${versionMatch[2]}`);
      }
    }
  }

  return NextResponse.json({ existing, versions });
}
