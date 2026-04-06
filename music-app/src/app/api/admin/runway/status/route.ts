import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const RUNWAY_API = "https://api.dev.runwayml.com/v1";
const BUCKET = "audios";

/**
 * Poll Runway task status and auto-store completed video in Supabase.
 *
 * GET /api/admin/runway/status?taskId=XXX&album=slug&track=1
 *
 * When video is ready:
 * 1. Download from Runway's temporary URL
 * 2. Upload to Supabase Storage (permanent)
 * 3. Return permanent public URL
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.RUNWAY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ erro: "RUNWAY_API_KEY não configurada." }, { status: 500 });
  }

  const taskId = req.nextUrl.searchParams.get("taskId");
  const albumSlug = req.nextUrl.searchParams.get("album");
  const trackNumber = req.nextUrl.searchParams.get("track");

  if (!taskId) {
    return NextResponse.json({ erro: "taskId obrigatório." }, { status: 400 });
  }

  try {
    // Poll Runway
    const res = await fetch(`${RUNWAY_API}/tasks/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "X-Runway-Version": "2024-11-06",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ erro: `Runway: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const status = (data.status || "").toUpperCase();

    // Still processing
    if (status === "QUEUED" || status === "PROCESSING" || status === "RUNNING" || status === "PENDING") {
      return NextResponse.json({ status: "processing", taskId, progress: data.progress || null });
    }

    // Failed
    if (status === "FAILED" || status === "CANCELLED") {
      return NextResponse.json({
        status: "error",
        taskId,
        error: data.failure || data.failureCode || "Generation failed",
      });
    }

    // Succeeded — download and store
    if (status === "SUCCEEDED" && data.output?.length > 0) {
      const videoUrl = data.output[0];

      // If we have album/track info, store permanently
      if (albumSlug && trackNumber) {
        const safeAlbum = albumSlug.replace(/[^a-z0-9-]/g, "");
        const safeTrack = String(parseInt(trackNumber, 10)).padStart(2, "0");
        const videoPath = `albums/${safeAlbum}/faixa-${safeTrack}-hook.mp4`;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Download video from Runway's temporary URL
        const videoRes = await fetch(videoUrl);
        if (videoRes.ok) {
          const videoBlob = await videoRes.blob();
          const buffer = Buffer.from(await videoBlob.arrayBuffer());

          // Upload to Supabase
          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(videoPath, buffer, {
              contentType: "video/mp4",
              upsert: true,
            });

          if (uploadError) {
            console.error("[runway/status] Upload error:", uploadError);
            // Still return the temporary URL as fallback
            return NextResponse.json({
              status: "complete",
              taskId,
              videoUrl,
              stored: false,
              error: uploadError.message,
            });
          }

          const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${videoPath}`;
          return NextResponse.json({
            status: "complete",
            taskId,
            videoUrl: publicUrl,
            stored: true,
          });
        }
      }

      // No album/track info or download failed — return temp URL
      return NextResponse.json({
        status: "complete",
        taskId,
        videoUrl,
        stored: false,
      });
    }

    // Unknown state
    return NextResponse.json({ status: "processing", taskId, rawStatus: status });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ erro: msg }, { status: 500 });
  }
}
