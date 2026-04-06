import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

/**
 * Upload a generated reel video to Supabase Storage.
 * POST /api/admin/upload-reel (multipart form: albumSlug, trackNumber, video)
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const form = await req.formData();
    const albumSlug = form.get("albumSlug") as string;
    const trackNumber = form.get("trackNumber") as string;
    const video = form.get("video") as File;

    if (!albumSlug || !trackNumber || !video) {
      return NextResponse.json({ erro: "albumSlug, trackNumber e video obrigatórios." }, { status: 400 });
    }

    const safeAlbum = albumSlug.replace(/[^a-z0-9-]/g, "");
    const safeTrack = String(parseInt(trackNumber, 10)).padStart(2, "0");
    const ext = video.type.includes("mp4") ? "mp4" : "webm";
    const filePath = `albums/${safeAlbum}/faixa-${safeTrack}-reel.${ext}`;

    const buffer = Buffer.from(await video.arrayBuffer());

    const { error } = await auth.supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: video.type,
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;

    return NextResponse.json({ ok: true, videoUrl: publicUrl, path: filePath });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
