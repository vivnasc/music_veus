import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const RUNWAY_API = "https://api.dev.runwayml.com/v1";

/**
 * Step 2: Send a generated image to Runway for animation.
 *
 * POST /api/admin/generate-verse-reel/animate
 * { imageUrl: string, caption?: string, albumSlug?: string, trackNumber?: number, duration?: number }
 *
 * Returns: { runwayTaskId: string, status: "generating" }
 * Client then polls /api/admin/runway/status?taskId=xxx
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const runwayKey = process.env.RUNWAY_API_KEY;
  if (!runwayKey) return NextResponse.json({ erro: "RUNWAY_API_KEY não configurada." }, { status: 500 });

  const { imageUrl, caption, albumSlug, trackNumber, duration } = await req.json();
  if (!imageUrl) return NextResponse.json({ erro: "imageUrl é obrigatório." }, { status: 400 });

  try {
    // Download image and convert to base64
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ erro: "Falha a descarregar imagem." }, { status: 502 });
    }
    const imgBlob = await imgRes.blob();
    const imgBuffer = Buffer.from(await imgBlob.arrayBuffer());
    const promptImage = `data:${imgBlob.type || "image/png"};base64,${imgBuffer.toString("base64")}`;

    const motionPrompt = buildMotionPrompt(caption || "");

    const runwayRes = await fetch(`${RUNWAY_API}/image_to_video`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${runwayKey}`,
        "Content-Type": "application/json",
        "X-Runway-Version": "2024-11-06",
      },
      body: JSON.stringify({
        model: "gen3a_turbo",
        promptImage,
        promptText: motionPrompt,
        duration: duration || 5,
        ratio: "720:1280",
        watermark: false,
      }),
    });

    if (!runwayRes.ok) {
      const err = await runwayRes.text();
      return NextResponse.json({ erro: `Runway: ${runwayRes.status} — ${err}` }, { status: 502 });
    }

    const data = await runwayRes.json();

    return NextResponse.json({
      runwayTaskId: data.id,
      status: "generating",
      albumSlug,
      trackNumber,
    });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildMotionPrompt(caption: string): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ").slice(0, 100) : "";

  const moods = [
    "Slow cinematic push-in, gentle light particles drifting",
    "Slow dolly movement, soft atmospheric haze shifting",
    "Gentle camera drift, warm light rays moving slowly",
    "Subtle parallax movement, floating dust particles in golden light",
  ];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  return `${mood}. Ethereal, dreamy, contemplative atmosphere. ${verse ? `Mood: ${verse}` : ""}`;
}
