import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

/**
 * Upload a cover image directly via server with real upsert.
 * POST /api/admin/upload-cover (multipart: albumSlug, trackNumber, image)
 *
 * Uses supabase.storage.upload() with upsert:true — works for both
 * new files AND replacements. The signed URL approach does NOT support
 * upsert, which is why replacements were failing silently.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const form = await req.formData();
    const albumSlug = form.get("albumSlug") as string;
    const trackNumber = form.get("trackNumber") as string;
    const image = form.get("image") as File;

    if (!albumSlug || !trackNumber || !image) {
      return NextResponse.json({ erro: "albumSlug, trackNumber e image obrigatórios." }, { status: 400 });
    }

    const safeAlbum = albumSlug.replace(/[^a-z0-9-]/g, "");
    const safeTrack = String(parseInt(trackNumber, 10)).padStart(2, "0");
    const filePath = `albums/${safeAlbum}/faixa-${safeTrack}-cover.jpg`;

    const buffer = Buffer.from(await image.arrayBuffer());

    const { error } = await auth.supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;

    return NextResponse.json({ ok: true, url: publicUrl });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
