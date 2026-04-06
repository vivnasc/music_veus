import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * POST /api/admin/suno/persona
 *
 * Creates a Suno Persona from an existing generated track.
 * The persona captures vocal identity and can be reused in future generations.
 *
 * Body: { taskId, audioId, name, description, vocalStart?, vocalEnd? }
 * Returns: { personaId, name, description }
 */

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const apiUrl = process.env.SUNO_API_URL;
  const apiKey = process.env.SUNO_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json({ error: "SUNO_API_URL ou SUNO_API_KEY nao configuradas." }, { status: 500 });
  }

  try {
    const { taskId, audioId, name, description, vocalStart, vocalEnd } = await req.json();

    if (!taskId || !audioId || !name) {
      return NextResponse.json({ error: "taskId, audioId e name obrigatorios." }, { status: 400 });
    }

    const body: Record<string, unknown> = {
      taskId,
      audioId,
      name,
      description: description || `Persona ${name}`,
    };

    if (vocalStart !== undefined) body.vocalStart = vocalStart;
    if (vocalEnd !== undefined) body.vocalEnd = vocalEnd;

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // Try both endpoint patterns
    let res = await fetch(`${apiUrl}/api/v1/generate/generate-persona`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (res.status === 404) {
      res = await fetch(`${apiUrl}/api/suno/generate-persona`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    }

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Suno API: ${res.status} — ${text}` }, { status: res.status });
    }

    const data = await res.json();
    console.log("[suno/persona] response:", JSON.stringify(data).slice(0, 500));

    const personaData = data.data || data;
    return NextResponse.json({
      personaId: personaData.personaId,
      name: personaData.name,
      description: personaData.description,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
