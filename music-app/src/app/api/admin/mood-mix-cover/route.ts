import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { MOODS, type MoodSlug } from "@/data/moods";

const BUCKET = "audios";
const VALID_SLUGS = MOODS.map((m) => m.slug) as MoodSlug[];

/**
 * Upload de capa para um dos 4 mood-mix (meditativo/introspectivo/animado/energetico).
 * POST /api/admin/mood-mix-cover (multipart: moodSlug, image)
 * Storage path: mood-mix-covers/{slug}.jpg
 *
 * Distinto de /api/admin/mood-cover que faz upload para mood-covers/ (7 moods Loranne).
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

    if (!VALID_SLUGS.includes(moodSlug as MoodSlug)) {
      return NextResponse.json(
        { erro: `moodSlug inválido. Aceitos: ${VALID_SLUGS.join(", ")}` },
        { status: 400 },
      );
    }

    const filePath = `mood-mix-covers/${moodSlug}.jpg`;
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

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const moodSlug = req.nextUrl.searchParams.get("moodSlug");
    if (!moodSlug) {
      return NextResponse.json({ erro: "moodSlug obrigatório." }, { status: 400 });
    }
    const filePath = `mood-mix-covers/${moodSlug}.jpg`;
    const { error } = await auth.supabase.storage.from(BUCKET).remove([filePath]);
    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

/** Lista capas existentes para os 4 mood-mix (objecto {slug: url|null}). */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase.storage
      .from(BUCKET)
      .list("mood-mix-covers", { limit: 100 });

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const covers: Record<string, string | null> = {};
    for (const slug of VALID_SLUGS) {
      const file = (data || []).find((f) => f.name === `${slug}.jpg`);
      covers[slug] = file
        ? `${supabaseUrl}/storage/v1/object/public/${BUCKET}/mood-mix-covers/${slug}.jpg?v=${file.updated_at || Date.now()}`
        : null;
    }
    return NextResponse.json({ covers });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
