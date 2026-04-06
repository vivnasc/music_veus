import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Subscribe/unsubscribe to release notifications via WhatsApp number.
 *
 * POST /api/subscribe-releases { whatsapp, name?, userId? }
 * DELETE /api/subscribe-releases { whatsapp }
 * GET /api/subscribe-releases?whatsapp=258...  → check status
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { whatsapp, name, userId } = await req.json();
    if (!whatsapp) {
      return NextResponse.json({ erro: "Número de WhatsApp obrigatório." }, { status: 400 });
    }

    // Clean phone number — keep only digits and +
    const clean = whatsapp.replace(/[^0-9+]/g, "");
    if (clean.length < 9) {
      return NextResponse.json({ erro: "Número inválido." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase
      .from("music_album_subscribers")
      .upsert(
        { whatsapp: clean, name: name || null, user_id: userId || null, active: true, unsubscribed_at: null },
        { onConflict: "whatsapp" }
      );

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ erro: "Tabela ainda não existe. Corre o SQL." }, { status: 503 });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, subscribed: true });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { whatsapp } = await req.json();
    if (!whatsapp) return NextResponse.json({ ok: true });

    const clean = whatsapp.replace(/[^0-9+]/g, "");
    const supabase = getSupabase();
    await supabase
      .from("music_album_subscribers")
      .update({ active: false, unsubscribed_at: new Date().toISOString() })
      .eq("whatsapp", clean);

    return NextResponse.json({ ok: true, subscribed: false });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function GET(req: NextRequest) {
  const whatsapp = req.nextUrl.searchParams.get("whatsapp");
  if (!whatsapp) return NextResponse.json({ subscribed: false });

  try {
    const clean = whatsapp.replace(/[^0-9+]/g, "");
    const supabase = getSupabase();
    const { data } = await supabase
      .from("music_album_subscribers")
      .select("active")
      .eq("whatsapp", clean)
      .single();

    return NextResponse.json({ subscribed: !!data?.active });
  } catch {
    return NextResponse.json({ subscribed: false });
  }
}
