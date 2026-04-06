import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const RUNWAY_API = "https://api.dev.runwayml.com/v1";

/**
 * Generate a verse reel: fal.ai image from caption → Runway video animation.
 *
 * POST /api/admin/generate-verse-reel
 * { caption: string, albumSlug: string, trackNumber?: number, duration?: number }
 *
 * Pipeline:
 * 1. Build visual prompt from the verse/caption
 * 2. Generate image via fal.ai flux-pro (1080x1920 vertical)
 * 3. Animate via Runway Gen-3 (image→video, 5s)
 * 4. Return task IDs for polling
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  const runwayKey = process.env.RUNWAY_API_KEY;

  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });
  if (!runwayKey) return NextResponse.json({ erro: "RUNWAY_API_KEY não configurada." }, { status: 500 });

  const { caption, albumSlug, trackNumber, duration } = await req.json();
  if (!caption) return NextResponse.json({ erro: "caption é obrigatório." }, { status: 400 });

  const visualPrompt = buildVisualPrompt(caption);

  try {
    // Step 1: Generate image via fal.ai (synchronous with fal.run)
    const falRes = await fetch("https://fal.run/fal-ai/flux-pro/v1.1", {
      method: "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: visualPrompt,
        image_size: { width: 720, height: 1280 },
        num_images: 1,
        safety_tolerance: "5",
      }),
    });

    if (!falRes.ok) {
      const err = await falRes.text();
      return NextResponse.json({ erro: `fal.ai: ${err}` }, { status: 502 });
    }

    const falData = await falRes.json();
    const imageUrl = falData.images?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json({ erro: "fal.ai não devolveu imagem." }, { status: 502 });
    }

    // Step 2: Download image and convert to base64 for Runway
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) {
      return NextResponse.json({ erro: "Falha a descarregar imagem do fal.ai." }, { status: 502 });
    }
    const imgBlob = await imgRes.blob();
    const imgBuffer = Buffer.from(await imgBlob.arrayBuffer());
    const promptImage = `data:${imgBlob.type || "image/png"};base64,${imgBuffer.toString("base64")}`;

    // Step 3: Send to Runway for animation
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
        promptText: buildMotionPrompt(caption),
        duration: duration || 5,
        ratio: "720:1280",
        watermark: false,
      }),
    });

    if (!runwayRes.ok) {
      const err = await runwayRes.text();
      return NextResponse.json({ erro: `Runway: ${runwayRes.status} — ${err}`, imageUrl }, { status: 502 });
    }

    const runwayData = await runwayRes.json();

    return NextResponse.json({
      status: "generating",
      imageUrl,
      runwayTaskId: runwayData.id,
      albumSlug,
      trackNumber,
    });
  } catch (e) {
    return NextResponse.json({ erro: `Erro: ${(e as Error).message}` }, { status: 500 });
  }
}

function buildVisualPrompt(caption: string): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ") : caption.slice(0, 200);

  return [
    "Cinematic vertical frame, moody and atmospheric.",
    "Dark tones with warm golden light accents, film grain, shallow depth of field.",
    "No text, no words, no letters, no watermarks, no people's faces.",
    "Emotionally evocative scene, dreamlike, European art-house cinema aesthetic.",
    `Visual interpretation of: "${verse.slice(0, 250)}"`,
    "Colour palette: deep blacks, warm amber, soft gold, muted earth tones.",
    "9:16 vertical composition, cinematic lighting.",
  ].join(" ");
}

function buildMotionPrompt(caption: string): string {
  const verseMatch = caption.match(/"([^"]+)"/);
  const verse = verseMatch ? verseMatch[1].replace(/\n/g, " ").slice(0, 100) : "";

  // Subtle, poetic motion — not dramatic
  const moods = [
    "Slow cinematic push-in, gentle light particles drifting",
    "Slow dolly movement, soft atmospheric haze shifting",
    "Gentle camera drift, warm light rays moving slowly",
    "Subtle parallax movement, floating dust particles in golden light",
  ];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  return `${mood}. Ethereal, dreamy, contemplative atmosphere. ${verse ? `Mood: ${verse}` : ""}`;
}
