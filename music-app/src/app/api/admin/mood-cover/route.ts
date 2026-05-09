import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { LORANNE_MOODS } from "@/data/loranne-moods";

const BUCKET = "audios";

/**
 * Upload a cover image for one of the 7 Loranne moods.
 * POST /api/admin/mood-cover (multipart: moodSlug, image)
 * Storage path: mood-covers/{slug}.jpg
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const form = await req.formData();
    const moodSlug = form.get("moodSlug") as string;
    const image = form.get("image") as File;

    if (!moodSlug || !image) {
      return NextResponse.json({ erro: "moodSlug e image obrigatórios." }, { status: 400 });
    }

    if (!LORANNE_MOODS.includes(moodSlug as typeof LORANNE_MOODS[number])) {
      return NextResponse.json({ erro: `moodSlug inválido. Aceitos: ${LORANNE_MOODS.join(", ")}` }, { status: 400 });
    }

    const filePath = `mood-covers/${moodSlug}.jpg`;
    const buffer = Buffer.from(await image.arrayBuffer());

    const { error } = await auth.supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}?v=${Date.now()}`;

    return NextResponse.json({ ok: true, url: publicUrl, moodSlug });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

/**
 * Delete a mood cover.
 * DELETE /api/admin/mood-cover?moodSlug=elevar
 */
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const moodSlug = req.nextUrl.searchParams.get("moodSlug");
    if (!moodSlug) {
      return NextResponse.json({ erro: "moodSlug obrigatório." }, { status: 400 });
    }
    const filePath = `mood-covers/${moodSlug}.jpg`;
    const { error } = await auth.supabase.storage.from(BUCKET).remove([filePath]);
    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

/**
 * List existing mood covers (returns object: { elevar: "https://...", aterrar: null, ... })
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase.storage
      .from(BUCKET)
      .list("mood-covers", { limit: 100 });

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const covers: Record<string, string | null> = {};
    for (const mood of LORANNE_MOODS) {
      const file = (data || []).find((f) => f.name === `${mood}.jpg`);
      covers[mood] = file
        ? `${supabaseUrl}/storage/v1/object/public/${BUCKET}/mood-covers/${mood}.jpg?v=${file.updated_at || Date.now()}`
        : null;
    }
    return NextResponse.json({ covers });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
