import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";
const PREFIX = "presenca-covers";

const PRESENCA_SUBS = [
  "medo", "magoa", "apatia", "inquietacao", "sufoco", "confusao", "vazio",
] as const;

type PresencaSubSlug = (typeof PRESENCA_SUBS)[number];

function isSubSlug(s: string): s is PresencaSubSlug {
  return (PRESENCA_SUBS as readonly string[]).includes(s);
}

/**
 * Upload a hero cover for a Presença sub-coleção.
 * POST /api/admin/presenca-cover (multipart: subSlug, image)
 * Storage path: presenca-covers/{slug}.jpg
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const form = await req.formData();
    const subSlug = form.get("subSlug") as string;
    const image = form.get("image") as File;

    if (!subSlug || !image) {
      return NextResponse.json({ erro: "subSlug e image obrigatórios." }, { status: 400 });
    }
    if (!isSubSlug(subSlug)) {
      return NextResponse.json({ erro: `subSlug inválido. Aceitos: ${PRESENCA_SUBS.join(", ")}` }, { status: 400 });
    }

    const filePath = `${PREFIX}/${subSlug}.jpg`;
    const buffer = Buffer.from(await image.arrayBuffer());

    const { error } = await auth.supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}?v=${Date.now()}`;
    return NextResponse.json({ ok: true, url: publicUrl, subSlug });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const subSlug = req.nextUrl.searchParams.get("subSlug");
    if (!subSlug) return NextResponse.json({ erro: "subSlug obrigatório." }, { status: 400 });
    const filePath = `${PREFIX}/${subSlug}.jpg`;
    const { error } = await auth.supabase.storage.from(BUCKET).remove([filePath]);
    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase.storage.from(BUCKET).list(PREFIX, { limit: 100 });
    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const covers: Record<string, string | null> = {};
    for (const slug of PRESENCA_SUBS) {
      const file = (data || []).find((f) => f.name === `${slug}.jpg`);
      covers[slug] = file
        ? `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${PREFIX}/${slug}.jpg?v=${file.updated_at || Date.now()}`
        : null;
    }
    return NextResponse.json({ covers });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
