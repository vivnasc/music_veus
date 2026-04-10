import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";

export const maxDuration = 120;

/**
 * Create a training dataset ZIP from image URLs and upload to Supabase.
 *
 * POST /api/admin/lora/create-zip
 * { imageUrls: string[] }
 *
 * Returns: { zipUrl: string }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  try {
    const { imageUrls } = await req.json();
    if (!imageUrls?.length) {
      return NextResponse.json({ erro: "imageUrls obrigatório (array de URLs)." }, { status: 400 });
    }

    // Download all images and add to ZIP
    const zip = new JSZip();
    let added = 0;

    await Promise.all(
      imageUrls.map(async (url: string, idx: number) => {
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.warn(`Image ${idx}: HTTP ${res.status}`);
            return;
          }
          const blob = await res.blob();
          if (blob.size < 1000) {
            console.warn(`Image ${idx}: too small (${blob.size} bytes)`);
            return;
          }
          const buffer = Buffer.from(await blob.arrayBuffer());
          const ext = url.match(/\.(png|jpg|jpeg|webp)$/i)?.[1] || "png";
          zip.file(`image-${String(idx + 1).padStart(3, "0")}.${ext}`, buffer);
          added++;
        } catch (e) {
          console.warn(`Failed to fetch image ${idx}:`, e);
        }
      })
    );

    if (added === 0) {
      return NextResponse.json({ erro: "Nenhuma imagem descarregada com sucesso." }, { status: 400 });
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Upload to Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const timestamp = Date.now();
    const zipPath = `loranne/lora-dataset-${timestamp}.zip`;

    const { error: uploadError } = await supabase.storage
      .from("audios")
      .upload(zipPath, zipBuffer, { contentType: "application/zip", upsert: true });

    if (uploadError) {
      return NextResponse.json({ erro: `Upload ZIP: ${uploadError.message}` }, { status: 500 });
    }

    const zipUrl = `${supabaseUrl}/storage/v1/object/public/audios/${zipPath}`;

    return NextResponse.json({ zipUrl, imageCount: added });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
