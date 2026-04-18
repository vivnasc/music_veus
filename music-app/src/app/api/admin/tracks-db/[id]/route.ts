import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * PATCH /api/admin/tracks-db/[id]  → update individual track fields
 * (title, lyrics, prompt, audio_url, etc.)
 */

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const patch = await req.json();

  const allowed = [
    "title", "description", "lang", "energy", "flavor", "vocal_mode",
    "prompt", "lyrics", "duration_seconds", "audio_url", "published",
  ];
  const filtered: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in patch) filtered[k] = patch[k];
  }
  filtered.updated_at = new Date().toISOString();

  const { error } = await auth.supabase
    .from("tracks_db")
    .update(filtered)
    .eq("id", id);

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
