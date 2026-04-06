import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

/** POST — submit a suggestion */
export async function POST(req: NextRequest) {
  try {
    const { name, type, content, userId } = await req.json();
    if (!content || content.trim().length < 3) {
      return NextResponse.json({ erro: "Escreve algo." }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from("music_suggestions")
      .insert({
        name: name || null,
        type: type || "theme",
        content: content.trim(),
        user_id: userId || null,
      });

    if (error) {
      if (error.code === "42P01") return NextResponse.json({ erro: "Tabela nao existe. Corre o SQL." }, { status: 503 });
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
