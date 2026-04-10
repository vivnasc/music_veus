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
  // Energy-specific base (short, just the energy feel)
  const energyBase: Record<string, string> = {
    whisper: "soft female vocal, intimate, slow",
    steady: "mid-tempo, warm female vocal, grounded",
    pulse: "upbeat, strong female vocal, driving, energetic",
    anthem: "powerful, bold female vocal, big chorus, epic",
    raw: "stripped-back, raw female vocal, minimal, close-mic",
  };

  // Flavor-specific overrides (completely change the genre)
  const flavorStyles: Record<string, string> = {
    organic: "",
    marrabenta: "marrabenta, Mozambican guitar groove, shaker, danceable, warm bass",
    afrobeat: "afrobeat, afropop, syncopated guitar, talking drums, West African groove",
    bossa: "bossa nova, nylon guitar, brushed drums, Brazilian, swaying, velvet",
    jazz: "jazz, Rhodes piano, walking bass, brushed cymbals, smoky, late-night",
    folk: "acoustic folk, fingerpicked guitar, stomps, earthy, campfire, storytelling",
    funk: "funk, R&B-pop, glossy, punchy drums, funky bassline, bright synth, dancefloor, 108 BPM",
    house: "", // handled below per energy
    gospel: "Gospel-pop power anthem, female vocals, steady tom-driven build, pulsing synth stabs, rising strings, half-time pre-chorus, stadium chorus with big kick, claps, soaring choir harmonies, piano, organ, contemporary, clean",
  };

  // House style adapts to energy — whisper/steady = chill, pulse/anthem = club
  const houseByEnergy: Record<string, string> = {
    whisper: "deep house, soft kick, warm sub-bass, gentle pads, ambient, lo-fi house, chill",
    steady: "deep house, mellow groove, warm bass, soft hi-hat, Rhodes, sunset chill",
    pulse: "house, driving beat, deep bass, hi-hat, synth stabs, energetic groove",
    anthem: "house, big kick, deep bass, hi-hat, synth stabs, euphoric build, anthemic",
    raw: "minimal house, soft kick, sparse percussion, close-mic, stripped-back",
  };

  const base = energyBase[energy || "steady"] || energyBase.steady;
  let flavorMod = flavorStyles[flavor || "organic"] || "";

  // Use energy-specific house style
  if (flavor === "house") {
    flavorMod = houseByEnergy[energy || "steady"] || houseByEnergy.steady;
  }

  let style: string;

  if (flavorMod) {
    // Non-organic: flavor defines the genre
    style = `${flavorMod}, ${base}`;
  } else if (prompt) {
    // Organic: extract UNIQUE production details from this track's prompt
    // Each track has specific instruments, textures, moods in its prompt
    const uniqueKeywords: string[] = [];
    const instruments = [
      "piano", "solo piano", "soft piano", "Rhodes", "guitar", "acoustic guitar",
      "nylon guitar", "strings", "gentle strings", "synth", "synth pads",
      "reverb pads", "bass", "warm bass", "deep bass", "drums", "percussion",
      "subtle percussion", "organic percussion", "body percussion",
      "shaker", "choir", "organ", "violin", "cello", "flute", "harp",
      "breath sounds", "water textures", "tidal", "drone", "bells",
    ];
    const moods = [
      "dreamy", "ethereal", "contemplative", "haunting", "spacious",
      "building", "swelling", "flowing", "tidal", "nocturnal",
      "meditative", "hypnotic", "cosmic", "ancient", "primal",
      "tender", "fierce", "urgent", "patient", "volcanic",
      "skeletal", "crystalline", "smoky", "dusty", "liquid",
    ];
    const lower = prompt.toLowerCase();
    // Extract instruments mentioned in this specific track
    for (const inst of instruments) {
      if (lower.includes(inst) && !uniqueKeywords.some(k => k.includes(inst) || inst.includes(k))) {
        uniqueKeywords.push(inst);
        if (uniqueKeywords.length >= 4) break;
      }
    }
    // Extract moods mentioned in this specific track
    for (const mood of moods) {
      if (lower.includes(mood) && !uniqueKeywords.includes(mood)) {
        uniqueKeywords.push(mood);
        if (uniqueKeywords.length >= 6) break;
      }
    }
    // Combine: unique details + energy base
    style = uniqueKeywords.length > 0
      ? `${uniqueKeywords.join(", ")}, ${base}`
      : base;
  } else {
    style = base;
  }

  // Add language
  if (prompt?.includes("Portuguese")) style += ", Portuguese";
  else if (prompt?.includes("English")) style += ", English";

  // Always add "full song"
  style += ", full song";

  // Trim to 200 chars max
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

    if (hasLyrics) {
      // Custom mode: prompt = lyrics, style = specific tags per energy+flavor
      body.prompt = lyrics;
      body.style = customStyle || buildStyle(energy, flavor, prompt);
      body.title = title || "Sem titulo";
    } else {
      body.prompt = prompt.length > 480 ? prompt.slice(0, 480) : prompt;
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
