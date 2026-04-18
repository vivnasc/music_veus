import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * PATCH  /api/admin/albums-db/[slug]  → update fields (title, subtitle, color, published, ...)
 * DELETE /api/admin/albums-db/[slug]  → delete album + tracks (cascade)
 */

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const { slug } = await params;
  const patch = await req.json();

  const allowed = [
    "title", "subtitle", "color", "collection",
    "published", "status", "distribution", "distrokid_upload_date",
  ];
  const filtered: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in patch) filtered[k] = patch[k];
  }
  filtered.updated_at = new Date().toISOString();

  const { error } = await auth.supabase
    .from("albums_db")
    .update(filtered)
    .eq("slug", slug);

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const { slug } = await params;

  const { error } = await auth.supabase
    .from("albums_db")
    .delete()
    .eq("slug", slug);

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
