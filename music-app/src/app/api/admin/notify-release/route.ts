import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Get all active WhatsApp subscribers for broadcast.
 * GET /api/admin/notify-release
 * Returns: { subscribers: [{ whatsapp, name }] }
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase
      .from("music_album_subscribers")
      .select("whatsapp, name, subscribed_at")
      .eq("active", true)
      .order("subscribed_at", { ascending: false });

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ subscribers: data || [] });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
