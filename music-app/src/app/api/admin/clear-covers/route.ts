import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

/**
 * Delete cover images or reels for an album.
 * POST /api/admin/clear-covers { albumSlug, pattern? }
 *
 * pattern: optional filter (e.g. "faixa-01-reel" to delete only that reel)
 * Without pattern: deletes all covers (*-cover.*)
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { albumSlug, pattern } = await req.json();
    if (!albumSlug) {
      return NextResponse.json({ erro: "albumSlug obrigatório." }, { status: 400 });
    }

    const supabase = auth.supabase;
    const safeSlug = albumSlug.replace(/[^a-z0-9-]/g, "");
    const deleted: string[] = [];

    for (const folder of [`albums/${safeSlug}`, safeSlug]) {
      const { data: files } = await supabase.storage.from(BUCKET).list(folder, { limit: 200 });
      if (!files) continue;

      const match = pattern
        ? files.filter(f => f.name.includes(pattern))
        : files.filter(f => f.name.includes("-cover."));

      const paths = match.map(f => `${folder}/${f.name}`);
      if (paths.length > 0) {
        await supabase.storage.from(BUCKET).remove(paths);
        deleted.push(...paths);
      }
    }

    return NextResponse.json({ ok: true, deleted, count: deleted.length });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
