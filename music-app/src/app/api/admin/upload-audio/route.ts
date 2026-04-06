import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { SUPABASE_URL } from "@/lib/supabase-server";

const BUCKET = "audios";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const filename = formData.get("filename") as string | null;

    // Optional metadata for ID3 tags
    const title = formData.get("title") as string | null;
    const artist = formData.get("artist") as string | null;
    const album = formData.get("album") as string | null;
    const trackNumber = formData.get("trackNumber") as string | null;
    const coverPath = formData.get("coverPath") as string | null;
    const year = formData.get("year") as string | null;

    if (!file || !filename) {
      return NextResponse.json({ erro: "Ficheiro ou nome em falta." }, { status: 400 });
    }

    let audioBuffer = Buffer.from(await file.arrayBuffer());

    // Embed ID3 tags only if metadata provided — dynamic import to avoid breaking
    // the route when node-id3 can't load on Vercel
    if (title || artist || album) {
      try {
        const NodeID3 = (await import("node-id3")).default;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tags: any = {};
        if (title) tags.title = title;
        if (artist) tags.artist = artist;
        if (album) tags.album = album;
        if (trackNumber) tags.trackNumber = trackNumber;
        if (year) tags.year = year;

        // Fetch and embed cover art
        if (coverPath) {
          try {
            const coverBuffer = await fetchCoverImage(coverPath, supabase);
            if (coverBuffer) {
              tags.image = {
                mime: "image/png",
                type: { id: 3, name: "front cover" },
                description: "Album cover",
                imageBuffer: coverBuffer,
              };
            }
          } catch {
            // Cover fetch failed — continue without cover
          }
        }

        const tagged = NodeID3.update(tags, audioBuffer);
        if (tagged) {
          audioBuffer = Buffer.from(tagged);
        }
      } catch {
        // node-id3 failed to load — upload without tags
        console.warn("node-id3 unavailable, uploading without ID3 tags");
      }
    }

    const uint8 = new Uint8Array(audioBuffer);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, uint8, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ erro: "Supabase upload erro: " + error.message }, { status: 500 });
    }

    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: "Excepção não apanhada: " + msg }, { status: 500 });
  }
}

/**
 * Fetch cover image — tries Supabase Storage first, then public URL
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchCoverImage(
  coverPath: string,
  supabase: any
): Promise<Buffer | null> {
  // If it's a Supabase storage URL
  if (coverPath.startsWith("http")) {
    const res = await fetch(coverPath);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    return null;
  }

  // If it's a relative path like /poses/loranne7-01.png, try to read from public dir
  // First try Supabase storage bucket "assets"
  const { data } = await supabase.storage
    .from("assets")
    .download(coverPath.replace(/^\//, ""));
  if (data) return Buffer.from(await data.arrayBuffer());

  // Fallback: fetch from the app's own public URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (appUrl) {
    const base = appUrl.startsWith("http") ? appUrl : `https://${appUrl}`;
    const res = await fetch(`${base}${coverPath}`);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
  }

  return null;
}
