import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

/**
 * Delete all cover images from the OLD root path (without albums/ prefix).
 * These were created by the old Pollinations AI generator.
 * POST /api/admin/cleanup-old-covers
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const supabase = auth.supabase;

    // List all root-level folders (these are the old-style paths)
    const { data: folders } = await supabase.storage.from(BUCKET).list("", { limit: 200 });
    if (!folders) return NextResponse.json({ ok: true, deleted: 0 });

    let totalDeleted = 0;
    const details: string[] = [];

    for (const folder of folders) {
      // Skip the "albums" folder — that's the correct path
      if (folder.name === "albums") continue;
      // Only check folders that look like album slugs
      if (!folder.id) continue;

      const { data: files } = await supabase.storage.from(BUCKET).list(folder.name, { limit: 200 });
      if (!files) continue;

      const covers = files.filter(f => f.name.includes("-cover."));
      if (covers.length === 0) continue;

      const paths = covers.map(f => `${folder.name}/${f.name}`);
      const { error } = await supabase.storage.from(BUCKET).remove(paths);
      if (!error) {
        totalDeleted += paths.length;
        details.push(`${folder.name}: ${paths.length} capas apagadas`);
      }
    }

    return NextResponse.json({ ok: true, deleted: totalDeleted, details });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
