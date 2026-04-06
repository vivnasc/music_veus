import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

/**
 * Verifica o estado de clips Suno em geracao (API.box / apibox.erweima.ai).
 * GET ?ids=taskId1,taskId2
 *
 * API.box usa /api/v1/generate/record-info?taskId=XXX
 * Retorna: { clips: [{ id, status, audioUrl, title, duration }] }
 */
export async function GET(req: NextRequest) {
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

  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) {
    return NextResponse.json(
      { erro: "ids em falta." },
      { status: 400 }
    );
  }

  try {
    const taskIds = ids.split(",").map(s => s.trim()).filter(Boolean);
    const allClips: Record<string, unknown>[] = [];

    for (const taskId of taskIds) {
      const headers = { Authorization: `Bearer ${apiKey}` };

      // Try multiple endpoints — API.box has several
      let data: Record<string, unknown> | null = null;

      // 1. GET /api/suno/fetch?taskId=XXX
      let res = await fetch(`${apiUrl}/api/suno/fetch?taskId=${taskId}`, { headers });

      if (res.ok) {
        data = await res.json();
      } else if (res.status !== 404) {
        // Try POST variant
        res = await fetch(`${apiUrl}/api/suno/fetch`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ taskId }),
        });
        if (res.ok) data = await res.json();
      }

      // 2. Fallback: GET /api/v1/generate/record-info?taskId=XXX
      if (!data) {
        res = await fetch(`${apiUrl}/api/v1/generate/record-info?taskId=${taskId}`, { headers });
        if (res.ok) data = await res.json();
      }

      console.log("[suno/status] taskId:", taskId, "raw:", JSON.stringify(data).slice(0, 800));

      if (!data) {
        allClips.push({ id: taskId, status: "processing", audioUrl: null, title: "", duration: null });
        continue;
      }

      // Parse the response — API.box nests data in various ways:
      // { data: { taskId, status, response: { sunoData: [...] } } }
      // { data: { taskId, status, response: { data: [...] } } }
      const record = (data.data as Record<string, unknown>) || data;
      const response = (record.response as Record<string, unknown>) || record;
      const sunoData = (response.sunoData || response.data || record.sunoData || record.suno_data || []) as Record<string, unknown>[];
      const items = Array.isArray(sunoData) ? sunoData : [sunoData];

      // Extract clips from sunoData with full metadata
      if (items.length > 0 && (items[0]?.id || items[0]?.audio_url || items[0]?.audioUrl)) {
        for (const item of items) {
          allClips.push({
            id: item.id || taskId,
            status: item.status || record.status || "processing",
            audioUrl: item.audioUrl || item.audio_url || item.streamAudioUrl || item.stream_audio_url || null,
            title: item.title || "",
            duration: item.duration || null,
            // Metadata from Suno
            imageUrl: item.imageUrl || item.image_url || item.imageLargeUrl || item.image_large_url || item.coverUrl || item.cover_url || null,
            tags: item.tags || (item.metadata as Record<string, unknown>)?.tags || item.style || null,
            model: item.modelName || item.model_name || item.model || null,
            prompt: item.prompt || null,
            gptDescriptionPrompt: item.gptDescriptionPrompt || item.gpt_description_prompt || null,
            lyric: item.lyric || null,
          });
        }
      } else {
        allClips.push({
          id: taskId,
          status: (record.status as string) || "processing",
          audioUrl: null,
          title: (record.title as string) || "",
          duration: null,
          imageUrl: null,
          tags: null,
          model: null,
        });
      }
    }

    return NextResponse.json({
      clips: allClips.map((c: Record<string, unknown>) => ({
        id: c.id || "",
        status: mapStatus(c.status as string),
        rawStatus: c.status || null,
        audioUrl: c.audioUrl || c.audio_url || c.streamAudioUrl || null,
        title: c.title || "",
        duration: c.duration || null,
        imageUrl: c.imageUrl || c.image_url || c.imageLargeUrl || c.image_large_url || null,
        tags: c.tags || null,
        model: c.model || null,
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { erro: "Excepção: " + msg },
      { status: 500 }
    );
  }
}

/** Map API.box status to our standard statuses */
function mapStatus(status: string | undefined): string {
  if (!status) return "processing";
  const s = status.toLowerCase();
  if (s.includes("success") || s === "complete" || s === "completed" || s === "done") return "complete";
  if (s.includes("fail") || s.includes("error") || s === "cancelled" || s === "canceled") return "error";
  if (s === "text" || s === "first" || s === "processing" || s === "pending" || s === "queued" || s === "running") return "processing";
  return s;
}
