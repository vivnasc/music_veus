import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/** GET — list all suggestions (admin) */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { data, error } = await auth.supabase
    .from("music_suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ suggestions: data || [] });
}

/** PATCH — update status/note (admin) */
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { id, status, admin_note } = await req.json();
  if (!id) return NextResponse.json({ erro: "id obrigatório." }, { status: 400 });

  const update: Record<string, string> = {};
  if (status) update.status = status;
  if (admin_note !== undefined) update.admin_note = admin_note;

  const { error } = await auth.supabase
    .from("music_suggestions")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
