import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Gera musica via API.box (apibox.erweima.ai) — wrapper Suno.
 * Env vars:
 *   SUNO_API_URL — base URL (ex: https://apibox.erweima.ai)
 *   SUNO_API_KEY — Bearer token
 *
 * POST body: { prompt, lyrics?, instrumental?, title?, model?, personaId?, personaModel? }
 *
 * Custom mode (lyrics present): prompt=lyrics, style=condensed tags from prompt
 * Non-custom mode: prompt=free description
 */

const MAX_STYLE_LENGTH = 120; // Suno works best with short, clean style tags
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000;

/**
 * Extract clean style tags from a verbose prompt.
 * Suno V5.5 works best with short genre/mood tags, not paragraphs.
 * Example: "ambient, female vocal, intimate, Portuguese, warm piano"
 */
function extractStyleTags(prompt: string): string {
  // Common style keywords to look for
  const keywords = [
    // Genres
    "ambient", "electronic", "organic", "pop", "folk", "jazz", "gospel",
    "house", "afrobeat", "afropop", "bossa nova", "bossa",
    "marrabenta", "mozambican", "funk", "r&b", "funky",
    // Instruments
    "piano", "guitar", "acoustic guitar", "nylon guitar", "strings",
    "synth", "bass", "drums", "percussion", "organ", "Rhodes",
    "shaker", "choir",
    // Mood/feel
    "intimate", "ethereal", "contemplative", "raw", "powerful",
    "driving", "gentle", "warm", "dark", "bright", "building",
    "minimal", "spacious", "grounded", "cosmic", "dreamy",
    "anthemic", "triumphant", "vulnerable", "tender", "haunting",
    "rhythmic", "danceable", "hypnotic", "meditative",
    // Production
    "close-mic", "reverb", "lo-fi",
    // Vocal
    "female vocal", "female vocals", "warm female", "male vocal",
    "duet", "whisper", "belted",
    // Language
    "Portuguese", "English",
  ];

  const lower = prompt.toLowerCase();
  const found: string[] = [];

  // Extract matching keywords (longest first to avoid partial matches)
  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  for (const kw of sorted) {
    if (lower.includes(kw.toLowerCase()) && !found.some(f => f.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(f.toLowerCase()))) {
      found.push(kw);
    }
  }

  let result = found.slice(0, 10).join(", ");

  // Ensure under limit
  if (result.length > MAX_STYLE_LENGTH) {
    result = found.slice(0, 6).join(", ");
  }

  // Always append "full song" to encourage complete generation
  if (result && !result.includes("full")) {
    result += ", full song";
  }

  return result || prompt.slice(0, MAX_STYLE_LENGTH);
}

/**
 * Build a distinct, specific style string based on energy + flavor.
 * Each combination produces a DIFFERENT sound, not generic "organic electronic".
 */
function buildStyle(energy?: string, flavor?: string, prompt?: string): string {
  // Energy-specific base (short, vocal + feel)
  const energyBase: Record<string, string> = {
    whisper: "soft female vocal, intimate, slow",
    steady: "mid-tempo, warm female vocal, grounded",
    pulse: "upbeat, strong female vocal, driving, energetic",
    anthem: "powerful, bold female vocal, big chorus, epic",
    raw: "stripped-back, raw female vocal, minimal, close-mic",
  };

  // Flavor genre tag (short — just the genre identity)
  // Must use terms Suno recognizes — not just genre names
  const flavorGenre: Record<string, string> = {
    organic: "",
    marrabenta: "Afropop, upbeat, 115 BPM, syncopated drums, claps, bright percussion, punchy bass, celebratory, high energy",
    afrobeat: "afrobeat, afropop, West African groove",
    bossa: "bossa nova, nylon guitar, Brazilian",
    jazz: "jazz, Rhodes piano, brushed cymbals",
    folk: "acoustic folk, fingerpicked guitar",
    funk: "funk, R&B-pop, glossy groove",
    house: "deep house",
    gospel: "gospel-pop, choir harmonies",
  };

  // ─── Extract unique keywords from THIS track's prompt ───
  // This runs for ALL flavors, making each track's style unique.
  const uniqueKeywords: string[] = [];

  if (prompt) {
    const lower = prompt.toLowerCase();

    // Instruments — what makes THIS track sound different
    const instruments = [
      "solo piano", "soft piano", "piano", "Rhodes", "acoustic guitar",
      "nylon guitar", "guitar", "gentle strings", "strings", "synth pads",
      "reverb pads", "warm bass", "deep bass", "bass", "brushed drums",
      "drums", "subtle percussion", "organic percussion", "percussion",
      "shaker", "choir", "organ", "violin", "cello", "flute", "harp",
      "breath sounds", "bells", "claps", "hi-hat",
    ];
    // Textures — the sensory/atmospheric identity of this track
    const textures = [
      "sunset", "sunrise", "golden", "moonlit", "starlight", "twinkling",
      "oceanic", "rain", "water", "ice", "mist", "fog", "dust",
      "neon", "velvet", "silk", "balcony", "campfire", "nocturnal",
      "lullaby", "cinematic", "ambient", "lo-fi",
    ];
    // Moods — the emotional fingerprint
    const moods = [
      "dreamy", "ethereal", "contemplative", "haunting", "spacious",
      "building", "swelling", "flowing", "meditative", "hypnotic",
      "cosmic", "ancient", "primal", "tender", "fierce", "urgent",
      "patient", "crystalline", "smoky", "liquid", "luminous",
      "melancholic", "euphoric", "serene", "restless",
    ];

    // Extract up to 3 instruments
    let instCount = 0;
    for (const word of instruments) {
      if (instCount >= 3) break;
      if (lower.includes(word) && !uniqueKeywords.some(k => k.includes(word) || word.includes(k))) {
        uniqueKeywords.push(word);
        instCount++;
      }
    }
    // Extract up to 2 textures
    let texCount = 0;
    for (const word of textures) {
      if (texCount >= 2) break;
      if (lower.includes(word) && !uniqueKeywords.includes(word)) {
        uniqueKeywords.push(word);
        texCount++;
      }
    }
    // Extract up to 2 moods
    let moodCount = 0;
    for (const word of moods) {
      if (moodCount >= 2) break;
      if (lower.includes(word) && !uniqueKeywords.includes(word)) {
        uniqueKeywords.push(word);
        moodCount++;
      }
    }
  }

  // ─── Assemble style: genre + unique keywords + energy base ───
  const base = energyBase[energy || "steady"] || energyBase.steady;
  const genre = flavor === "house"
    ? (energy === "pulse" || energy === "anthem" ? "house" : "deep house, chill")
    : (flavorGenre[flavor || "organic"] || "");

  const parts: string[] = [];
  if (genre) parts.push(genre);
  if (uniqueKeywords.length > 0) parts.push(uniqueKeywords.join(", "));
  parts.push(base);

  // Add language
  if (prompt?.includes("Portuguese")) parts.push("Portuguese");
  else if (prompt?.includes("English")) parts.push("English");

  parts.push("full song");

  let style = parts.join(", ");

  // Trim to 200 chars max (Suno limit)
  if (style.length > 200) style = style.slice(0, 200);

  return style;
}

async function callSunoApi(
  apiUrl: string,
  apiKey: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; data?: Record<string, unknown>; error?: string }> {
  const jsonBody = JSON.stringify(body);
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  console.log("[suno/generate] prompt length:", body.prompt ? String(body.prompt).length : 0, "style length:", body.style ? String(body.style).length : 0, "model:", body.model);
  console.log("[suno/generate] style:", body.style);
  console.log("[suno/generate] prompt (first 500):", String(body.prompt).slice(0, 500));

  // Try /api/suno/submit/music first, fallback to /api/v1/generate
  let res = await fetch(`${apiUrl}/api/suno/submit/music`, {
    method: "POST", headers, body: jsonBody,
  });

  if (res.status === 404) {
    res = await fetch(`${apiUrl}/api/v1/generate`, {
      method: "POST", headers, body: jsonBody,
    });
  }

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Suno API: ${res.status} — ${text}` };
  }

  const data = await res.json();
  console.log("[suno/generate] raw response:", JSON.stringify(data).slice(0, 1000));

  if (data.code && data.code !== 200) {
    return { ok: false, error: `Suno API code ${data.code}: ${data.msg || JSON.stringify(data)}` };
  }

  return { ok: true, data };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiUrl = process.env.SUNO_API_URL;
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { erro: "SUNO_API_URL ou SUNO_API_KEY não configuradas." },
      { status: 500 }
    );
  }

  try {
    const { prompt, lyrics, instrumental, title, model, energy, flavor, customStyle, personaId, personaModel } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { erro: "Prompt em falta." },
        { status: 400 }
      );
    }

    const hasLyrics = lyrics && typeof lyrics === "string" && lyrics.trim().length > 0;

    // Build the app's base URL for the callback
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
      || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`)
      || req.nextUrl.origin;

    // Build request body
    const body: Record<string, unknown> = {
      customMode: hasLyrics,
      instrumental: instrumental ?? false,
      model: model || "V5_5",
      callBackUrl: `${appUrl}/api/admin/suno/callback`,
    };

    // Persona support — consistent vocal identity
    if (personaId) {
      body.personaId = personaId;
      body.personaModel = personaModel || "voice_persona";
    }

    // Always build a style — ensures each track gets unique style tags
    const finalStyle = customStyle || buildStyle(energy, flavor, prompt);

    if (hasLyrics) {
      // Custom mode: prompt = lyrics, style = musical direction
      body.prompt = lyrics;
      body.style = finalStyle;
      body.title = title || "Sem titulo";
    } else {
      // Description mode: prompt = description, style = extra musical context
      body.prompt = prompt.length > 480 ? prompt.slice(0, 480) : prompt;
      body.style = finalStyle;
    }

    // Try with retries
    let lastError = "";
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        console.log(`[suno/generate] retry #${attempt} after ${RETRY_DELAY_MS}ms`);
        await sleep(RETRY_DELAY_MS);
      }

      const result = await callSunoApi(apiUrl, apiKey, body);

      if (!result.ok) {
        lastError = result.error || "Unknown error";
        // Don't retry on 400 errors (bad request) — only on server errors
        if (lastError.includes("400")) break;
        continue;
      }

      const data = result.data!;
      const taskId = data.data ? (data.data as Record<string, unknown>).taskId : data.taskId;
      const innerData = (data.data || {}) as Record<string, unknown>;
      const innerResponse = (innerData.response || {}) as Record<string, unknown>;
      const sunoData = (innerData.sunoData || innerResponse.sunoData || []) as Record<string, unknown>[];
      const clips = Array.isArray(sunoData) && sunoData.length > 0 ? sunoData : [];

      const resultClips = clips.length > 0
        ? clips.map((c) => ({
            id: c.id || taskId,
            status: c.status || "processing",
            audioUrl: c.audioUrl || c.audio_url || c.streamAudioUrl || null,
            title: c.title || title || "",
            duration: c.duration || null,
          }))
        : [{
            id: taskId,
            status: "processing",
            audioUrl: null,
            title: title || "",
            duration: null,
          }];

      console.log("[suno/generate] taskId:", taskId, "clips:", resultClips.length, "attempt:", attempt);

      return NextResponse.json({ taskId, clips: resultClips });
    }

    return NextResponse.json(
      { erro: lastError || "Suno falhou após múltiplas tentativas." },
      { status: 500 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { erro: "Excepção: " + msg },
      { status: 500 }
    );
  }
}
