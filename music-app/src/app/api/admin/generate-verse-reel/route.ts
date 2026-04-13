import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

// Allow up to 60s for fal.ai to generate the image
export const maxDuration = 60;

// ── Visual vocabulary: maps lyric themes → concrete scene elements ──
const THEME_SCENES: [RegExp, string[]][] = [
  [/\b(luz|brilh|sol|amanhecer|dawn|light|sun|radi|dourad)\b/i, [
    "golden light rays piercing through morning mist over still water",
    "sunrise breaking through dense forest canopy, volumetric god rays",
    "light refracting through crystal prisms creating rainbow caustics on stone",
  ]],
  [/\b(noite|escur|sombra|lua|night|dark|moon|estrela|star)\b/i, [
    "moonlight reflecting on calm ocean surface, silver ripples",
    "starfield seen through ancient stone archway, deep blue cosmos",
    "bioluminescent forest floor glowing in darkness, midnight blue tones",
  ]],
  [/\b(água|rio|mar|ocean|wave|chuva|rain|lago|flui)\b/i, [
    "slow-motion water droplets creating concentric ripples on glass-still lake",
    "underwater light beams dancing through turquoise ocean depth",
    "rain falling on ancient stone fountain, water catching golden light",
  ]],
  [/\b(fogo|cham|ard|burn|fire|flam|bras)\b/i, [
    "candlelight flickering in dark cathedral, warm amber glow on stone walls",
    "embers floating upward against dark sky, orange and gold sparks",
    "fire reflected in still water creating mirror of flame and shadow",
  ]],
  [/\b(vento|ar|respir|breath|wind|voar|fly|asa|wing)\b/i, [
    "silk fabric billowing in warm wind over golden wheat field",
    "dandelion seeds scattered by breeze, backlit by golden hour sun",
    "wind-carved sand dunes with flowing golden light across ridges",
  ]],
  [/\b(terra|raiz|root|ground|semear|seed|jardim|garden|flor|flower)\b/i, [
    "ancient tree roots intertwined with moss and wildflowers, forest floor",
    "single wildflower growing through cracked earth, soft morning light",
    "Japanese zen garden with raked sand patterns, misty dawn",
  ]],
  [/\b(espelho|mirror|reflex|reflec|vidro|glass)\b/i, [
    "fractured mirror reflecting golden light in dark room, abstract",
    "rain-covered window with city lights blurred into abstract bokeh",
    "calm lake perfectly reflecting mountains and sky, symmetry",
  ]],
  [/\b(caminho|path|estrada|road|viagem|journey|passos|steps)\b/i, [
    "winding forest path disappearing into golden mist, autumn leaves",
    "ancient cobblestone road through archway into warm light",
    "railroad tracks converging toward distant golden horizon at sunset",
  ]],
  [/\b(silêncio|silence|quiet|paz|peace|calm|seren)\b/i, [
    "misty mountain lake at dawn, perfect stillness, soft pastels",
    "empty temple corridor with light streaming through paper screens",
    "snow falling silently on ancient stone steps, blue twilight",
  ]],
  [/\b(cor|cora[çg]|heart|amor|love|pele|skin|toqu|touch|abra[çg])\b/i, [
    "two intertwined vines growing up sunlit ancient wall",
    "warm golden light pouring through curtains into empty room",
    "rose petals scattered on dark water, warm amber tones",
  ]],
  [/\b(liber|free|abrir|open|solt|release|voar|expand)\b/i, [
    "flock of birds taking flight from golden field at sunrise",
    "door opening into vast bright landscape, light flooding through",
    "butterfly emerging from chrysalis in soft macro light",
  ]],
  [/\b(memória|memory|lembr|remember|passado|past|tempo|time)\b/i, [
    "vintage pocket watch on weathered wood, golden light, dust particles",
    "old handwritten letters scattered on dark wood desk, candlelight",
    "faded photographs caught in warm wind, sepia tones and golden light",
  ]],
  [/\b(for[çg]a|strong|poder|power|guerr|fight|resist)\b/i, [
    "lightning illuminating dramatic cloudscape over dark ocean",
    "ancient stone monument standing against fierce orange sunset",
    "waves crashing against lighthouse in golden storm light",
  ]],
  [/\b(alma|soul|espírit|spirit|sagra|sacred|divin)\b/i, [
    "light streaming through stained glass casting colors on stone floor",
    "incense smoke spiraling upward in shaft of temple light",
    "ancient tree with golden light emanating from within its hollow trunk",
  ]],
];

// Fallback scenes when no theme matches
const UNIVERSAL_SCENES = [
  "abstract golden light particles floating in dark atmospheric space",
  "warm amber bokeh lights dissolving into soft darkness, cinematic",
  "flowing golden silk fabric suspended in dark void, dramatic lighting",
  "golden hour light filtering through atmospheric haze, dust motes",
  "close-up of textured golden surface with dramatic side lighting",
  "abstract landscape of golden sand dunes under dramatic sky",
  "warm light refracting through glass creating prismatic patterns",
  "ancient stone texture with golden moss, intimate macro detail",
];

const NEGATIVE_PROMPT = "person, people, human, figure, face, portrait, body, hands, eyes, mouth, skin, man, woman, child, crowd, silhouette of person, text, words, letters, watermark, logo, signature, writing";

const STYLE_SUFFIX = "Fine art photography, cinematic composition, 9:16 vertical, dramatic lighting, shallow depth of field, warm golden amber tones, atmospheric, no text, no watermarks. Absolutely no people, no human figures, no faces, no silhouettes of people.";

/**
 * Generate verse reel images via fal.ai.
 *
 * POST /api/admin/generate-verse-reel
 * { caption: string, lyrics?: string, numImages?: number, useLoRA?: boolean }
 *
 * The prompt engine translates lyric themes into concrete visual scenes
 * (landscapes, objects, nature, light) — never people or faces.
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

  // Build visual prompts — one per image, each unique
  const visualPrompts = buildScenePrompts(caption, lyrics || caption, count, loraUrl ? triggerWord : null);

  const endpoint = loraUrl
    ? "https://fal.run/fal-ai/flux-lora"
    : "https://fal.run/fal-ai/flux-pro/v1.1";

  // Generate images — each with a unique prompt for variety
  const allImageUrls: string[] = [];

  for (const visualPrompt of visualPrompts) {
    const body: Record<string, unknown> = {
      prompt: visualPrompt,
      negative_prompt: NEGATIVE_PROMPT,
      image_size: { width: 720, height: 1280 },
      num_images: 1,
      safety_tolerance: 5,
    };

    if (loraUrl) {
      body.loras = [{ path: loraUrl, scale: 0.4 }];
    }

    try {
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
        console.error(`[verse-reel] fal.ai error: ${falRes.status} — ${err}`);
        continue;
      }

      const data = await falRes.json();
      const urls = (data.images || []).map((img: { url: string }) => img.url).filter(Boolean);
      allImageUrls.push(...urls);
    } catch (e) {
      console.error(`[verse-reel] fetch error:`, (e as Error).message);
    }
  }

  if (allImageUrls.length === 0) {
    return NextResponse.json({ erro: "fal.ai não devolveu imagens." }, { status: 502 });
  }

  return NextResponse.json({ imageUrls: allImageUrls });
}

/**
 * Build N unique visual prompts from lyrics, mapping lyric themes
 * to concrete scenes (nature, objects, light, texture).
 */
function buildScenePrompts(caption: string, lyrics: string, count: number, triggerWord: string | null): string[] {
  // Extract clean text from lyrics/caption
  const verseMatch = caption.match(/"([\s\S]+?)"/);
  const rawText = verseMatch ? verseMatch[1] : caption;
  const allText = `${rawText} ${lyrics}`.replace(/\[.*?\]/g, "").replace(/\n/g, " ");

  // Find matching themes from lyrics
  const matchedScenes: string[] = [];
  for (const [pattern, scenes] of THEME_SCENES) {
    if (pattern.test(allText)) {
      matchedScenes.push(...scenes);
    }
  }

  // If no themes matched, use universal scenes
  if (matchedScenes.length === 0) {
    matchedScenes.push(...UNIVERSAL_SCENES);
  }

  // Extract a short poetic essence from the lyrics to add specificity
  const lyricsLines = lyrics.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 10 && l.length < 80 && !l.startsWith("["));
  const poeticHint = lyricsLines.length > 0
    ? lyricsLines[Math.floor(Math.random() * lyricsLines.length)]
    : "";

  // Build unique prompts
  const trigger = triggerWord ? `${triggerWord}, ` : "";
  const prompts: string[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    // Pick a scene we haven't used yet
    let sceneIdx: number;
    if (used.size >= matchedScenes.length) used.clear();
    do {
      sceneIdx = Math.floor(Math.random() * matchedScenes.length);
    } while (used.has(sceneIdx) && used.size < matchedScenes.length);
    used.add(sceneIdx);

    const scene = matchedScenes[sceneIdx];
    const hint = poeticHint ? ` Evoking the mood of: "${poeticHint}".` : "";

    prompts.push(
      `${trigger}${scene}.${hint} ${STYLE_SUFFIX}`
    );
  }

  return prompts;
}

