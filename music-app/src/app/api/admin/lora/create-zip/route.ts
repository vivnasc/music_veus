import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import JSZip from "jszip";
import { readFile } from "fs/promises";
import { join } from "path";

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
          let buffer: Buffer | null = null;

          // Try to read from local public/ folder first (for /poses/* and /Loranne.png)
          const urlObj = new URL(url, "http://localhost");
          const pathname = urlObj.pathname;
          if (pathname.startsWith("/poses/") || pathname === "/Loranne.png") {
            try {
              const localPath = join(process.cwd(), "public", pathname);
              buffer = await readFile(localPath);
            } catch {
              // local read failed, fall through to HTTP fetch
            }
          }

          // Fallback: HTTP fetch (handles absolute URLs from client and Supabase URLs)
          if (!buffer) {
            const fetchUrl = url.startsWith("http") ? url : `https://${req.headers.get("host") || "localhost"}${url}`;
            const res = await fetch(fetchUrl, { signal: AbortSignal.timeout(30000) });
            if (!res.ok) {
              console.warn(`[create-zip] HTTP fetch failed for ${fetchUrl}: ${res.status}`);
              return;
            }
            const blob = await res.blob();
            buffer = Buffer.from(await blob.arrayBuffer());
          }

          // Validate buffer has actual content
          if (buffer.length < 1000) {
            console.warn(`[create-zip] Image ${idx}: too small (${buffer.length} bytes), skipping`);
            return;
          }
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
