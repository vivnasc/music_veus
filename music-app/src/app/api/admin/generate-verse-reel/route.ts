import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

// Allow up to 60s for fal.ai — images generated in parallel
export const maxDuration = 60;

// ── Theme → visual element vocabulary ──
// Each entry maps a lyric keyword to a visual building block (NOT a full scene).
// The storyboard engine combines these per-segment to create unique scenes.
const VISUAL_ELEMENTS: [RegExp, string[]][] = [
  [/\b(luz|brilh|sol|amanhecer|dawn|light|sun|radi|dourad|clari)\b/i, [
    "golden light rays piercing through mist",
    "sunrise breaking through canopy, volumetric god rays",
    "light refracting through prisms onto ancient stone",
    "warm golden sun filtering through clouds",
  ]],
  [/\b(noite|escur|sombra|lua|night|dark|moon|estrela|star)\b/i, [
    "moonlit landscape, silver reflections on water",
    "starfield through ancient stone archway",
    "bioluminescent glow in dark forest",
    "deep blue twilight, first stars appearing",
  ]],
  [/\b(água|rio|mar|ocean|wave|chuva|rain|lago|flui|corrent)\b/i, [
    "slow-motion ripples on glass-still lake",
    "underwater light beams in turquoise depth",
    "rain catching golden light on stone",
    "river flowing through misty valley",
  ]],
  [/\b(fogo|cham|ard|burn|fire|flam|bras|incend)\b/i, [
    "candlelight flickering in dark space, amber glow",
    "embers floating upward against dark sky",
    "fire reflected in still water",
    "warm flames casting dancing shadows on walls",
  ]],
  [/\b(vento|ar|respir|breath|wind|voar|fly|asa|wing|sopro)\b/i, [
    "fabric billowing in warm wind",
    "dandelion seeds scattered by breeze, backlit",
    "wind-carved sand dunes, flowing light",
    "leaves caught in gentle wind spiral",
  ]],
  [/\b(terra|raiz|root|ground|semear|seed|jardim|garden|flor|flower|planta|crescer|grow)\b/i, [
    "roots intertwined with moss and wildflowers",
    "single flower growing through cracked earth",
    "lush garden in warm morning light",
    "seeds sprouting in rich dark soil, macro",
  ]],
  [/\b(espelho|mirror|reflex|reflec|vidro|glass)\b/i, [
    "fractured mirror reflecting golden light",
    "rain-covered window, abstract bokeh beyond",
    "perfect reflection on calm lake surface",
  ]],
  [/\b(caminho|path|estrada|road|viagem|journey|passos|steps|andar|walk)\b/i, [
    "winding path disappearing into golden mist",
    "ancient cobblestone road through archway",
    "footprints in sand leading toward horizon",
    "forest trail with dappled golden light",
  ]],
  [/\b(silêncio|silence|quiet|paz|peace|calm|seren|descan)\b/i, [
    "misty mountain lake at dawn, stillness",
    "empty corridor with streaming light",
    "snow falling on ancient stone steps",
    "calm zen garden, raked sand patterns",
  ]],
  [/\b(cor|cora[çg]|heart|amor|love|pele|skin|toqu|touch|abra[çg]|beij|kiss)\b/i, [
    "intertwined vines on sunlit wall",
    "golden light through curtains, intimate room",
    "rose petals on dark water, amber tones",
    "two trees growing together, branches touching",
  ]],
  [/\b(liber|free|abrir|open|solt|release|expand|largo)\b/i, [
    "birds taking flight from golden field",
    "door opening into vast bright landscape",
    "butterfly emerging, soft light",
    "chains dissolving into golden particles",
  ]],
  [/\b(memória|memory|lembr|remember|passado|past|tempo|time|reló|clock)\b/i, [
    "pocket watch on weathered wood, golden light",
    "handwritten letters on dark wood desk, candlelight",
    "faded photographs in warm wind, sepia",
    "hourglass with golden sand falling",
  ]],
  [/\b(for[çg]a|strong|poder|power|guerr|fight|resist|lutai?r?)\b/i, [
    "lightning over dramatic ocean cloudscape",
    "stone monument against fierce sunset",
    "waves crashing against lighthouse",
    "storm parting to reveal golden light beyond",
  ]],
  [/\b(alma|soul|espírit|spirit|sagra|sacred|divin|deus|god|ora[çg]|pray)\b/i, [
    "stained glass casting colors on stone floor",
    "incense smoke spiraling in temple light",
    "ancient tree glowing from within",
    "cathedral interior, rays of coloured light",
  ]],
  [/\b(voz|voice|cant|sing|som|sound|músic|music|melodia|melody|frequên|rhythm|ritmo)\b/i, [
    "sound waves visualized as golden ripples in air",
    "piano keys with golden light across them",
    "guitar strings vibrating with particles of light",
    "concentric sound ripples expanding on water surface",
  ]],
  [/\b(casa|home|lar|tecto|roof|porta|door|janela|window|quarto|room)\b/i, [
    "warm interior with golden light through window",
    "open door revealing sunlit landscape",
    "old house with warm light glowing inside",
    "windowsill with rain outside, cozy warmth within",
  ]],
  [/\b(corpo|body|dan[çg]|dance|mov|move|gir|spin|passo)\b/i, [
    "figure seen from behind, dancing in golden dust",
    "silhouette in motion, flowing fabric, backlit",
    "spinning fabric creating spiral of golden light",
    "shadow of a dancer on sunlit wall",
  ]],
  [/\b(chorar|cry|lágrim|tear|dor|pain|sofr|suffer|trist|sad|mágoa)\b/i, [
    "single raindrop on glass, blurred warm lights",
    "wilting flower in dramatic side light",
    "cracked dry earth with first drop of rain",
    "grey clouds with golden light breaking through",
  ]],
  [/\b(céu|sky|nuvem|cloud|alto|high|acima|above|infinit|vast)\b/i, [
    "dramatic cloudscape at golden hour",
    "vast sky reflected in desert salt flat",
    "clouds parting to reveal deep blue beyond",
    "bird soaring in open dramatic sky",
  ]],
  [/\b(noç|nós|together|junto|uni[rã]|union|dois|two|par)\b/i, [
    "two paths merging into one, golden light ahead",
    "two rivers joining, mixing waters",
    "pair of candles, flames leaning toward each other",
    "intertwined roots of two ancient trees",
  ]],
];

// Camera/composition progressions for storyboard coherence
const SCENE_PROGRESSIONS = [
  ["extreme wide shot", "wide shot", "medium shot", "close-up", "extreme close-up", "wide pull-back"],
  ["dawn light", "morning golden hour", "warm midday", "afternoon glow", "golden hour sunset", "blue twilight"],
  ["distant and vast", "approaching slowly", "intimate and close", "pulling back to reveal", "soaring above", "settling down gently"],
];

const NEGATIVE_PROMPT = "sensual, sexual, seductive, provocative, revealing clothing, cleavage, lingerie, bikini, nude, naked, asian stereotypes, stock photo, generic model, selfie, looking at camera, frontal portrait, text, words, letters, watermark, logo, signature, writing, cartoon, anime, 3D render, ugly, deformed";

const STYLE_BASE = "Fine art cinematic photography, 9:16 vertical, dramatic lighting, shallow depth of field, warm golden amber tones, atmospheric, African and Portuguese aesthetic, soulful. No text, no watermarks.";

/**
 * Generate verse reel images via fal.ai — STORYBOARD MODE.
 *
 * POST /api/admin/generate-verse-reel
 * { caption: string, lyrics?: string, numImages?: number, useLoRA?: boolean }
 *
 * The engine splits the lyrics into segments (one per clip), analyses each
 * segment's themes, and builds a unique visual scene for each — creating
 * a coherent visual narrative that follows the song's progression.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const falKey = process.env.FAL_KEY;
  if (!falKey) return NextResponse.json({ erro: "FAL_KEY não configurada." }, { status: 500 });

  const { caption, lyrics, numImages, loraUrl: explicitLoraUrl, triggerWord: explicitTrigger, useLoRA: useLoRAParam } = await req.json();
  if (!caption) return NextResponse.json({ erro: "caption é obrigatório." }, { status: 400 });
  const count = Math.min(numImages || 1, 4);
  const skipLoRA = useLoRAParam === false;

  // Auto-detect active LoRA from Supabase if not passed explicitly
  let loraUrl = explicitLoraUrl || null;
  let triggerWord = explicitTrigger || "loranne_artist";

  if (!loraUrl && !skipLoRA) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
      const loraConfigUrl = `${supabaseUrl}/storage/v1/object/public/audios/lora/active-lora.json`;
      const loraRes = await fetch(loraConfigUrl, { next: { revalidate: 300 } });
      if (loraRes.ok) {
        const loraConfig = await loraRes.json();
        if (loraConfig.loraUrl) {
          loraUrl = loraConfig.loraUrl;
          triggerWord = loraConfig.triggerWord || "loranne_artist";
        }
      }
    } catch { /* no active LoRA — use Flux Pro without LoRA */ }
  }

  // Build storyboard — one unique prompt per scene, derived from lyrics
  const storyboard = buildStoryboard(caption, lyrics || caption, count, loraUrl ? triggerWord : null);

  const endpoint = loraUrl
    ? "https://fal.run/fal-ai/flux-lora"
    : "https://fal.run/fal-ai/flux-pro/v1.1";

  // Generate ALL images in parallel — much faster than sequential
  const results = await Promise.allSettled(
    storyboard.map(async (scene) => {
      const body: Record<string, unknown> = {
        prompt: scene.prompt,
        negative_prompt: NEGATIVE_PROMPT,
        image_size: { width: 720, height: 1280 },
        num_images: 1,
        safety_tolerance: 5,
      };

      if (loraUrl) {
        body.loras = [{ path: loraUrl, scale: 0.4 }];
      }

      const falRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Key ${falKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!falRes.ok) {
        const err = await falRes.text();
        console.error(`[verse-reel] Scene ${scene.index + 1} fal.ai error: ${falRes.status} — ${err}`);
        return null;
      }

      const data = await falRes.json();
      const url = (data.images || [])[0]?.url || null;
      return url;
    })
  );

  const tempUrls: string[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) tempUrls.push(r.value);
  }

  if (tempUrls.length === 0) {
    return NextResponse.json({ erro: "fal.ai não devolveu imagens." }, { status: 502 });
  }

  // Persist images to Supabase so they never expire
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const permanentUrls: string[] = [];

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const ts = Date.now();
    await Promise.allSettled(
      tempUrls.map(async (url, i) => {
        try {
          const imgRes = await fetch(url);
          if (!imgRes.ok) { permanentUrls[i] = url; return; }
          const blob = await imgRes.blob();
          const buffer = Buffer.from(await blob.arrayBuffer());
          const path = `generated/scenes/${ts}-scene-${i + 1}.jpg`;
          const { error } = await supabase.storage
            .from("audios")
            .upload(path, buffer, { contentType: "image/jpeg", upsert: true });
          if (error) {
            console.error(`[verse-reel] Supabase upload error scene ${i + 1}:`, error.message);
            permanentUrls[i] = url;
          } else {
            permanentUrls[i] = `${supabaseUrl}/storage/v1/object/public/audios/${path}`;
          }
        } catch {
          permanentUrls[i] = url; // fallback to temp URL
        }
      })
    );
  } else {
    permanentUrls.push(...tempUrls);
  }

  return NextResponse.json({
    imageUrls: permanentUrls.filter(Boolean),
    storyboard: storyboard.map(s => ({ scene: s.index + 1, lyrics: s.lyricsSegment, prompt: s.prompt })),
  });
}

type StoryboardScene = {
  index: number;
  lyricsSegment: string;
  prompt: string;
};

/**
 * Build a storyboard: split lyrics into N segments, analyse each,
 * and create a unique visual prompt that follows the song's narrative.
 */
function buildStoryboard(caption: string, lyrics: string, count: number, triggerWord: string | null): StoryboardScene[] {
  // Clean lyrics into usable lines
  const allLines = lyrics.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith("["));

  // Also extract from caption if it has quoted lyrics
  const captionMatch = caption.match(/"([\s\S]+?)"/);
  if (captionMatch && allLines.length === 0) {
    allLines.push(...captionMatch[1].split(/[\/\n]/).map(l => l.trim()).filter(Boolean));
  }

  // If still no lyrics, use the caption as a single block
  if (allLines.length === 0) {
    allLines.push(caption.slice(0, 200));
  }

  // Split lyrics into N equal segments (one per scene)
  const segments: string[] = [];
  const linesPerSegment = Math.max(1, Math.ceil(allLines.length / count));

  for (let i = 0; i < count; i++) {
    const start = i * linesPerSegment;
    const end = Math.min(start + linesPerSegment, allLines.length);
    const segmentLines = allLines.slice(start, end);
    // If we've run out of lines, reuse the last segment
    segments.push(segmentLines.length > 0 ? segmentLines.join(" / ") : allLines[allLines.length - 1]);
  }

  // Pick a progression style for coherence across scenes
  const progression = SCENE_PROGRESSIONS[Math.floor(Math.random() * SCENE_PROGRESSIONS.length)];
  const trigger = triggerWord ? `${triggerWord}, ` : "";

  // Build each scene
  const scenes: StoryboardScene[] = [];

  for (let i = 0; i < count; i++) {
    const segment = segments[i];

    // Find visual elements that match THIS segment's themes
    const elements: string[] = [];
    for (const [pattern, visuals] of VISUAL_ELEMENTS) {
      if (pattern.test(segment)) {
        // Pick one visual from each matching theme (deterministic per segment position)
        const pick = visuals[i % visuals.length];
        elements.push(pick);
      }
    }

    // If no themes matched, create a direct visual interpretation
    if (elements.length === 0) {
      elements.push(`visual scene evoking: "${segment.slice(0, 100)}"`);
    }

    // Combine: visual elements + progression + lyrics mood
    const progressionStep = progression[Math.min(i, progression.length - 1)];
    const sceneDescription = elements.slice(0, 3).join(", ");
    const lyricsHint = segment.length > 10 ? ` Mood and feeling of: "${segment.slice(0, 120)}"` : "";

    const prompt = [
      `${trigger}Scene ${i + 1}: ${sceneDescription}.`,
      `${progressionStep}.`,
      `${lyricsHint}.`,
      STYLE_BASE,
      i === 0 ? "Opening scene, establishing shot." : "",
      i === count - 1 ? "Final scene, contemplative resolution." : "",
    ].filter(Boolean).join(" ");

    scenes.push({
      index: i,
      lyricsSegment: segment,
      prompt,
    });
  }

  return scenes;
}
