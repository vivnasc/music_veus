"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { parse as parseYaml } from "yaml";
import { adminFetch } from "@/lib/admin-fetch";

type TrackDraft = {
  number: number;
  title: string;
  description?: string;
  lang?: "PT" | "EN";
  energy?: string;
  flavor?: string | null;
  vocal_mode?: string;
  prompt?: string;
  lyrics?: string;
  duration_seconds?: number;
  audio_url?: string | null;
  published?: boolean;
};

type AlbumDraft = {
  slug: string;
  title: string;
  subtitle?: string;
  color?: string;
  artist: { slug: string; name: string; bio?: string; photo_url?: string };
  collection: string;
  published?: boolean;
  status?: string;
  distribution?: boolean;
  distrokid_upload_date?: string | null;
  tracks: TrackDraft[];
};

type AlbumRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  collection: string;
  published: boolean;
  status: string;
  artists_db: { slug: string; name: string } | null;
  tracks_db: TrackRow[];
};

type TrackRow = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  lang: string | null;
  energy: string | null;
  flavor: string | null;
  prompt: string | null;
  lyrics: string | null;
  duration_seconds: number | null;
  audio_url: string | null;
  published: boolean;
};

const EXAMPLE_YAML = `# Um álbum ou single completo por ficheiro YAML.
# Copia, preenche, faz upload. Slugs em minúsculas com hífens.

slug: meu-album-novo
title: "Meu Álbum Novo"
subtitle: "Subtítulo curto"
color: "#C4745A"
collection: outros-mundos   # ou: espelho, no, eter, sangue, fibra, nua, mare, incenso, grao, livro, curso, ancient-ground

artist:
  slug: artista-convidado
  name: "Artista Convidado"
  bio: "Bio curta (opcional)"
  # photo_url: "https://..." (opcional)

published: false       # aparece na app?
status: draft          # draft | ready | produced | published
distribution: false    # ir para DistroKid?

tracks:
  - number: 1
    title: "Primeira Faixa"
    description: "Descrição curta visível no player"
    lang: PT           # PT ou EN
    energy: whisper    # whisper | steady | pulse | anthem | raw
    flavor: bossa      # bossa | jazz | folk | marrabenta | afrobeat | amapiano | gospel-africano | ambient | ... (livre)
    vocal_mode: solo   # solo | duet
    duration_seconds: 240
    prompt: |
      prompt completo para Suno, pode ter várias linhas
      segunda linha aqui
    lyrics: |
      [Intro]
      primeira linha da letra
      segunda linha

      [Verso 1]
      ...
    published: false

  - number: 2
    title: "Segunda Faixa"
    lang: EN
    energy: steady
    flavor: folk
    duration_seconds: 220
    prompt: "prompt suno"
    lyrics: |
      letras aqui
`;

export default function AlbumManagerPage() {
  const [yamlText, setYamlText] = useState("");
  const [draft, setDraft] = useState<AlbumDraft | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [albums, setAlbums] = useState<AlbumRow[]>([]);
  // Expanded album ids — kept in parent so it survives `loadAlbums` reloads
  // (e.g. after approving a Suno clip, the album list refetches but the user
  // should stay looking at the same expanded tracks).
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  const [loading, setLoading] = useState(true);

  const loadAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/albums-db");
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch {
      setAlbums([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAlbums();
  }, [loadAlbums]);

  // Parse + validate whenever yamlText changes
  useEffect(() => {
    setSaveMsg(null);
    if (!yamlText.trim()) {
      setDraft(null);
      setParseError(null);
      setValidationErrors([]);
      return;
    }
    try {
      const parsed = parseYaml(yamlText) as AlbumDraft;
      setParseError(null);

      const errs: string[] = [];
      if (!parsed?.slug) errs.push("Falta 'slug'.");
      if (!parsed?.title) errs.push("Falta 'title'.");
      if (!parsed?.collection) errs.push("Falta 'collection'.");
      if (!parsed?.artist?.slug || !parsed?.artist?.name) errs.push("Falta 'artist.slug' ou 'artist.name'.");
      if (!Array.isArray(parsed?.tracks) || parsed.tracks.length === 0) errs.push("Precisa de pelo menos 1 track.");
      else {
        parsed.tracks.forEach((t, i) => {
          if (typeof t.number !== "number") errs.push(`Track ${i + 1}: falta 'number'.`);
          if (!t.title) errs.push(`Track ${i + 1}: falta 'title'.`);
        });
        const numbers = parsed.tracks.map((t) => t.number).filter((n) => typeof n === "number");
        const dup = numbers.find((n, i) => numbers.indexOf(n) !== i);
        if (dup !== undefined) errs.push(`Número de track duplicado: ${dup}.`);
      }
      setValidationErrors(errs);
      setDraft(parsed);
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : String(e));
      setDraft(null);
      setValidationErrors([]);
    }
  }, [yamlText]);

  async function onUploadFile(f: File) {
    const text = await f.text();
    setYamlText(text);
  }

  async function onSave() {
    if (!draft || validationErrors.length > 0) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await adminFetch("/api/admin/albums-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMsg(`Erro: ${data.erro || "?"}`);
      } else {
        setSaveMsg(`Guardado! (${draft.tracks.length} faixas)`);
        setYamlText("");
        loadAlbums();
      }
    } catch (e) {
      setSaveMsg(`Erro: ${e instanceof Error ? e.message : "?"}`);
    }
    setSaving(false);
  }

  async function togglePublish(slug: string, current: boolean) {
    await adminFetch(`/api/admin/albums-db/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !current }),
    });
    loadAlbums();
  }

  async function deleteAlbum(slug: string) {
    if (!confirm(`Apagar "${slug}" e todas as suas faixas? Sem volta.`)) return;
    await adminFetch(`/api/admin/albums-db/${slug}`, { method: "DELETE" });
    loadAlbums();
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-amber-400 mb-1">Gestor de Álbuns</h1>
        <p className="text-xs text-mundo-muted">
          Carrega um ficheiro YAML por álbum. Sem deploys — fica já acessível na app.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <Link href="/admin/producao" className="rounded-lg bg-mundo-muted-dark/20 px-4 py-2 text-xs text-mundo-muted hover:bg-mundo-muted-dark/40 transition">
          ← Produção Loranne
        </Link>
        <Link href="/admin/ancient-ground" className="rounded-lg bg-amber-900/20 px-4 py-2 text-xs text-amber-400 hover:bg-amber-900/40 transition">
          Ancient Ground
        </Link>
      </div>

      {/* Upload / paste area */}
      <section className="mb-8 rounded-xl border border-mundo-muted-dark/20 bg-mundo-bg-light/50 p-4">
        <h2 className="text-sm font-semibold text-mundo-creme mb-3">Nova ficha (YAML)</h2>

        <div className="flex gap-2 flex-wrap mb-3">
          <label className="rounded-lg bg-indigo-800/30 text-indigo-300 hover:bg-indigo-800/50 px-4 py-2 text-xs cursor-pointer transition">
            Upload ficheiro .yaml
            <input
              type="file"
              accept=".yaml,.yml,text/yaml,application/x-yaml"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUploadFile(f);
                e.target.value = "";
              }}
            />
          </label>
          <button
            onClick={() => setYamlText(EXAMPLE_YAML)}
            className="rounded-lg bg-mundo-muted-dark/20 px-4 py-2 text-xs text-mundo-muted hover:bg-mundo-muted-dark/40 transition"
          >
            Usar exemplo
          </button>
          <button
            onClick={() => setYamlText("")}
            className="rounded-lg bg-mundo-muted-dark/20 px-4 py-2 text-xs text-mundo-muted hover:bg-mundo-muted-dark/40 transition"
          >
            Limpar
          </button>
        </div>

        <textarea
          value={yamlText}
          onChange={(e) => setYamlText(e.target.value)}
          placeholder="Cola aqui o YAML do álbum ou carrega um ficheiro acima..."
          className="w-full rounded-lg bg-black/40 border border-mundo-muted-dark/20 px-3 py-3 text-xs text-mundo-creme font-mono outline-none focus:border-amber-700/50 min-h-[300px]"
        />

        {parseError && (
          <p className="text-[11px] text-red-400 mt-2">Erro YAML: {parseError}</p>
        )}

        {validationErrors.length > 0 && (
          <ul className="text-[11px] text-red-400 mt-2 list-disc list-inside space-y-0.5">
            {validationErrors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}

        {/* Preview */}
        {draft && validationErrors.length === 0 && (
          <div className="mt-3 rounded-lg bg-black/30 p-3">
            <p className="text-xs text-green-400 mb-2">✓ Ficha válida</p>
            <dl className="text-[11px] text-mundo-creme grid grid-cols-2 gap-x-4 gap-y-1">
              <dt className="text-mundo-muted">slug</dt><dd className="font-mono">{draft.slug}</dd>
              <dt className="text-mundo-muted">título</dt><dd>{draft.title}</dd>
              <dt className="text-mundo-muted">artista</dt><dd>{draft.artist.name}</dd>
              <dt className="text-mundo-muted">colecção</dt><dd>{draft.collection}</dd>
              <dt className="text-mundo-muted">faixas</dt><dd>{draft.tracks.length}</dd>
              <dt className="text-mundo-muted">publicado</dt><dd>{draft.published ? "sim" : "não"}</dd>
            </dl>
            <details className="mt-2">
              <summary className="text-[11px] text-amber-500 cursor-pointer">Ver faixas ({draft.tracks.length})</summary>
              <ul className="mt-2 text-[11px] text-mundo-creme/80 space-y-1">
                {draft.tracks.map((t) => (
                  <li key={t.number} className="font-mono">
                    {String(t.number).padStart(2, "0")}. {t.title}
                    {" "}<span className="text-mundo-muted">({t.lang ?? "PT"}/{t.energy ?? "whisper"}{t.flavor ? `/${t.flavor}` : ""})</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}

        <button
          onClick={onSave}
          disabled={!draft || validationErrors.length > 0 || saving}
          className={`mt-3 w-full rounded-lg px-4 py-2.5 text-xs font-medium transition ${
            !draft || validationErrors.length > 0 || saving
              ? "bg-green-900/20 text-green-700 cursor-not-allowed"
              : "bg-green-800/30 text-green-300 hover:bg-green-800/50"
          }`}
        >
          {saving ? "A guardar..." : "Guardar no Supabase"}
        </button>

        {saveMsg && (
          <p className={`text-[11px] mt-2 ${saveMsg.startsWith("Erro") ? "text-red-400" : "text-green-400"}`}>{saveMsg}</p>
        )}
      </section>

      {/* Existing albums list */}
      <section>
        <h2 className="text-sm font-semibold text-mundo-creme mb-3">Álbuns em base de dados ({albums.length})</h2>

        {loading ? (
          <p className="text-xs text-mundo-muted">A carregar...</p>
        ) : albums.length === 0 ? (
          <p className="text-xs text-mundo-muted">Nenhum álbum ainda. Carrega uma ficha acima.</p>
        ) : (
          <div className="space-y-2">
            {albums.map((a) => (
              <AlbumRowItem
                key={a.id}
                album={a}
                expanded={expandedIds.has(a.id)}
                onToggleExpand={() => toggleExpanded(a.id)}
                onTogglePublish={() => togglePublish(a.slug, a.published)}
                onDelete={() => deleteAlbum(a.slug)}
                onChanged={loadAlbums}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Per-album expanded row with track actions ───
function AlbumRowItem({
  album,
  expanded,
  onToggleExpand,
  onTogglePublish,
  onDelete,
  onChanged,
}: {
  album: AlbumRow;
  expanded: boolean;
  onToggleExpand: () => void;
  onTogglePublish: () => void;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function downloadDistroZip() {
    setBusy("zip");
    try {
      const { downloadAlbumForDistribution } = await import("@/lib/album-download");
      // Map AlbumRow to Album shape for the download lib
      const albumObj = {
        slug: album.slug,
        title: album.title,
        subtitle: album.subtitle,
        artist: album.artists_db?.name,
        product: album.collection,
        color: album.color,
        status: album.status,
        distribution: true,
        distrokidUploadDate: null,
        tracks: album.tracks_db
          .sort((a, b) => a.number - b.number)
          .map((t) => ({
            number: t.number,
            title: t.title,
            description: t.description ?? "",
            lang: (t.lang === "EN" ? "EN" : "PT") as "PT" | "EN",
            energy: (t.energy ?? "whisper") as never,
            flavor: (t.flavor ?? null) as never,
            vocalMode: "solo" as const,
            prompt: t.prompt ?? "",
            lyrics: t.lyrics ?? "",
            durationSeconds: t.duration_seconds ?? 240,
            audioUrl: t.audio_url,
          })),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await downloadAlbumForDistribution(albumObj as any);
    } catch (e) {
      alert(`Erro ZIP: ${e instanceof Error ? e.message : "?"}`);
    }
    setBusy(null);
  }

  return (
    <div className="rounded-lg border border-mundo-muted-dark/20 bg-mundo-bg-light/50">
      <div className="p-3 flex items-center justify-between gap-3">
        <button
          onClick={onToggleExpand}
          className="flex-1 min-w-0 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-mundo-muted text-xs">{expanded ? "▾" : "▸"}</span>
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: album.color }} />
            <h3 className="text-sm font-medium text-mundo-creme truncate">{album.title}</h3>
            <span className="text-[10px] text-mundo-muted">/{album.slug}</span>
          </div>
          <p className="text-[11px] text-mundo-muted mt-0.5 ml-6">
            {album.artists_db?.name ?? "?"} · {album.collection} · {album.tracks_db?.length ?? 0} faixas · {album.status}
          </p>
        </button>
        <button
          onClick={downloadDistroZip}
          disabled={busy === "zip"}
          className="shrink-0 rounded px-3 py-1.5 text-[11px] bg-blue-800/30 text-blue-300 hover:bg-blue-800/50 transition"
          title="DistroKid ZIP"
        >
          {busy === "zip" ? "..." : "ZIP"}
        </button>
        <button
          onClick={onTogglePublish}
          className={`shrink-0 rounded px-3 py-1.5 text-[11px] transition ${
            album.published
              ? "bg-green-800/30 text-green-300 hover:bg-green-800/50"
              : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40"
          }`}
        >
          {album.published ? "Publicado" : "Rascunho"}
        </button>
        <button
          onClick={onDelete}
          className="shrink-0 rounded px-2 py-1.5 text-[11px] bg-red-900/20 text-red-400 hover:bg-red-900/40 transition"
          title="Apagar"
        >
          ✕
        </button>
      </div>

      {expanded && (
        <div className="border-t border-mundo-muted-dark/20 p-3 space-y-2">
          {album.tracks_db.sort((a, b) => a.number - b.number).map((t) => (
            <TrackRowItem
              key={t.id}
              track={t}
              albumSlug={album.slug}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type SunoClip = {
  id: string;
  status: string;
  audioUrl: string | null;
  originalAudioUrl?: string | null;
  title?: string;
  imageUrl?: string | null;
  duration?: number | null;
};

// ─── Per-track row with edit / Suno / upload actions ───
function TrackRowItem({
  track,
  albumSlug,
  onChanged,
}: {
  track: TrackRow;
  albumSlug: string;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(track.title);
  const [lyrics, setLyrics] = useState(track.lyrics ?? "");
  const [prompt, setPrompt] = useState(track.prompt ?? "");
  const [lang, setLang] = useState<string>(track.lang ?? "PT");
  const [energy, setEnergy] = useState<string>(track.energy ?? "whisper");
  const [flavor, setFlavor] = useState<string>(track.flavor ?? "");
  const [vocalMode, setVocalMode] = useState<string>("solo");
  const [duration, setDuration] = useState<number>(track.duration_seconds ?? 240);
  const [busy, setBusy] = useState<string | null>(null);
  const [approvingClipId, setApprovingClipId] = useState<string | null>(null);
  const [sunoStatus, setSunoStatus] = useState<"idle" | "generating" | "polling" | "ready" | "error">("idle");
  const [sunoMsg, setSunoMsg] = useState<string>("");
  const [sunoClips, setSunoClips] = useState<SunoClip[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup poll interval on unmount
  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  // Restore pending clips on mount — survives page reloads and Suno CDN expiry
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await adminFetch("/api/admin/pending-clips");
        if (!res.ok) return;
        const data: { clips?: { album_slug: string; track_number: number; clip_id: string; audio_url: string; title?: string; image_url?: string | null; duration?: number | null }[] } = await res.json();
        const mine = (data.clips || []).filter(
          (c) => c.album_slug === albumSlug && c.track_number === track.number
        );
        if (!cancelled && mine.length > 0) {
          setSunoClips(mine.map((c) => ({
            id: c.clip_id,
            status: "complete",
            audioUrl: c.audio_url,
            title: c.title || "",
            imageUrl: c.image_url || null,
            duration: c.duration || null,
          })));
          setSunoStatus("ready");
          setSunoMsg(`${mine.length} versão(ões) pendentes de aprovação.`);
        }
      } catch { /* table may not exist */ }
    })();
    return () => { cancelled = true; };
  }, [albumSlug, track.number]);

  async function saveEdit() {
    setBusy("save");
    await adminFetch(`/api/admin/tracks-db/${track.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        lyrics,
        prompt,
        lang,
        energy,
        flavor: flavor.trim() || null,
        vocal_mode: vocalMode,
        duration_seconds: duration,
      }),
    });
    setBusy(null);
    setEditing(false);
    onChanged();
  }

  async function uploadFile(file: File, kind: "audio" | "cover") {
    setBusy(kind);
    try {
      const safeNum = String(track.number).padStart(2, "0");
      const ext = kind === "audio" ? "mp3" : "jpg";
      const filename = `albums/${albumSlug}/faixa-${safeNum}${kind === "cover" ? "-cover" : ""}.${ext}`;
      const sigRes = await adminFetch("/api/admin/signed-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (!sigRes.ok) throw new Error("signed url failed");
      const { signedUrl } = await sigRes.json();
      const upRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": kind === "audio" ? "audio/mpeg" : "image/jpeg" },
        body: file,
      });
      if (!upRes.ok) throw new Error(`upload ${upRes.status}`);
      // Mark audio_url so app knows it's available
      if (kind === "audio") {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
        const audioUrl = `${supabaseUrl}/storage/v1/object/public/audios/${filename}`;
        await adminFetch(`/api/admin/tracks-db/${track.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_url: audioUrl }),
        });
      }
      onChanged();
    } catch (e) {
      alert(`Erro upload ${kind}: ${e instanceof Error ? e.message : "?"}`);
    }
    setBusy(null);
  }

  // Generate at Suno → poll until ready → show players for approval (mirrors producao flow)
  async function generateSuno() {
    setSunoStatus("generating");
    setSunoMsg("A enviar ao Suno...");
    setSunoClips([]);
    // Clear any previous pending clips for this track (regenerating)
    try {
      await adminFetch("/api/admin/pending-clips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ album_slug: albumSlug, track_number: track.number }),
      });
    } catch { /* ignore */ }
    try {
      const res = await adminFetch("/api/admin/suno/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: track.prompt ?? "",
          title: track.title,
          lyrics: track.lyrics ?? "",
          instrumental: !(track.lyrics?.trim()),
          model: "V5_5",
          // No customStyle, no energy, no flavor — the API route will use
          // extractStyleTags(prompt) to pull a whitelist-sanitized style
          // from the user's own prompt. No energy-base injection
          // ("soft female vocal, intimate, slow" etc.) and no raw prompt
          // risking SENSITIVE_WORD_ERROR from niche tags.
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || `HTTP ${res.status}`);
      if (!data.clips || data.clips.length === 0) throw new Error("Nenhum clip retornado.");

      const clipIds = data.clips.map((c: SunoClip) => c.id);
      pollSuno(clipIds);
    } catch (e) {
      setSunoStatus("error");
      setSunoMsg(`Erro Suno: ${e instanceof Error ? e.message : "?"}`);
    }
  }

  function pollSuno(clipIds: string[]) {
    if (pollRef.current) clearInterval(pollRef.current);
    setSunoStatus("polling");
    setSunoMsg("A gerar... (pode demorar 2-3 min)");

    let pollCount = 0;
    pollRef.current = setInterval(async () => {
      pollCount++;
      try {
        const res = await adminFetch(`/api/admin/suno/status?ids=${clipIds.join(",")}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.erro) throw new Error(data.erro);

        const info = (data.clips || []).map((c: SunoClip) => c.status).join(", ");
        setSunoMsg(`Poll #${pollCount}: ${info}`);

        if (data.clips.some((c: SunoClip) => c.status === "error")) {
          if (pollRef.current) clearInterval(pollRef.current);
          // Surface the raw Suno error fields so we can see what failed
          // (usually style too long, content policy, or quota).
          const clipErrors = data.clips as Record<string, unknown>[];
          const rawStatuses = clipErrors.map((c) => String(c.rawStatus || "")).join(" ");
          // Content-filter specific hint: the Suno API (apibox) is stricter
          // than suno.com web app. Tell the user to generate manually there
          // and upload the MP3 via the "Áudio" button.
          if (rawStatuses.includes("SENSITIVE_WORD")) {
            setSunoStatus("error");
            setSunoMsg("Suno API rejeitou (palavra sensível). Gera manualmente em suno.com e faz upload via botão \"Áudio\" →");
            return;
          }
          const errDetail = JSON.stringify(
            clipErrors.map((c) => ({
              status: c.status,
              rawStatus: c.rawStatus,
              errorMessage: c.errorMessage,
              errorType: c.errorType,
            }))
          );
          setSunoStatus("error");
          setSunoMsg(`Suno erro: ${errDetail}`);
          return;
        }

        const allDone = data.clips.every((c: SunoClip) => c.status === "complete" && c.audioUrl);
        if (allDone) {
          if (pollRef.current) clearInterval(pollRef.current);
          setSunoMsg("A guardar clips em Supabase (pendente de aprovação)...");

          // Persist each clip to Supabase Storage as pending/<slug>/<track>-<clipId>.mp3
          // This survives Suno's ~1h CDN expiry AND browser reloads.
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
          const persisted: SunoClip[] = [];
          for (const c of data.clips as SunoClip[]) {
            if (!c.audioUrl) { persisted.push(c); continue; }
            try {
              // Download from Suno CDN
              const r = await fetch(c.audioUrl);
              if (!r.ok) throw new Error(`fetch ${r.status}`);
              const blob = await r.blob();
              if (blob.size < 1000) throw new Error("small blob");

              // Upload to Supabase pending path
              const safeNum = String(track.number).padStart(2, "0");
              const filename = `albums/${albumSlug}/pending-${safeNum}-${c.id}.mp3`;
              const sigRes = await adminFetch("/api/admin/signed-upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename }),
              });
              if (!sigRes.ok) throw new Error("signed url failed");
              const { signedUrl } = await sigRes.json();
              const upRes = await fetch(signedUrl, {
                method: "PUT",
                headers: { "Content-Type": "audio/mpeg" },
                body: blob,
              });
              if (!upRes.ok) throw new Error(`upload ${upRes.status}`);

              const supabasePublic = `${supabaseUrl}/storage/v1/object/public/audios/${filename}`;
              persisted.push({ ...c, audioUrl: supabasePublic, originalAudioUrl: c.audioUrl });
            } catch (err) {
              console.warn(`Failed to persist clip ${c.id}:`, err);
              // Keep the (temporary) Suno URL so user can still listen now
              persisted.push(c);
            }
          }

          // Save metadata to pending_suno_clips table
          try {
            await adminFetch("/api/admin/pending-clips", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                album_slug: albumSlug,
                track_number: track.number,
                clips: persisted.map((c) => ({
                  clip_id: c.id,
                  audio_url: c.audioUrl,
                  title: c.title || track.title,
                  image_url: c.imageUrl || null,
                  duration: c.duration || null,
                })),
              }),
            });
          } catch { /* table may not exist */ }

          setSunoClips(persisted);
          setSunoStatus("ready");
          setSunoMsg(`${persisted.length} versões pendentes — escuta e aprova a que quiseres (ficam guardadas até aprovares).`);
        }
      } catch (err) {
        console.warn(`[poll #${pollCount}] track ${track.id}:`, err);
      }
    }, 5000);

    // Safety timeout: 5 min
    setTimeout(() => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
        if (sunoStatus === "polling") {
          setSunoStatus("error");
          setSunoMsg("Timeout (5 min) — verifica no painel Suno.");
        }
      }
    }, 5 * 60 * 1000);
  }

  async function approveClip(clip: SunoClip) {
    setApprovingClipId(clip.id);
    try {
      // Download blob (already cached as blob: URL by polling step)
      const audioSrc = clip.audioUrl!;
      let blob: Blob;
      if (audioSrc.startsWith("blob:")) {
        blob = await (await fetch(audioSrc)).blob();
      } else {
        const r = await adminFetch("/api/admin/proxy-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: audioSrc }),
        });
        blob = await r.blob();
      }
      if (blob.size < 1000) throw new Error("Áudio demasiado pequeno.");

      // Upload to Supabase as faixa-NN.mp3
      const safeNum = String(track.number).padStart(2, "0");
      const filename = `albums/${albumSlug}/faixa-${safeNum}.mp3`;
      const sigRes = await adminFetch("/api/admin/signed-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      if (!sigRes.ok) throw new Error("signed url failed");
      const { signedUrl } = await sigRes.json();
      const upRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/mpeg" },
        body: blob,
      });
      if (!upRes.ok) throw new Error(`upload ${upRes.status}`);

      // Cover (if Suno provided one)
      if (clip.imageUrl) {
        try {
          const coverRes = await fetch(clip.imageUrl);
          if (coverRes.ok) {
            const coverBlob = await coverRes.blob();
            if (coverBlob.size > 1000) {
              const coverFilename = `albums/${albumSlug}/faixa-${safeNum}-cover.jpg`;
              const cs = await adminFetch("/api/admin/signed-upload-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: coverFilename }),
              });
              if (cs.ok) {
                const { signedUrl: csu } = await cs.json();
                await fetch(csu, { method: "PUT", headers: { "Content-Type": "image/jpeg" }, body: coverBlob });
              }
            }
          }
        } catch { /* cover optional */ }
      }

      // Mark audio_url on the track
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
      const audioUrl = `${supabaseUrl}/storage/v1/object/public/audios/${filename}`;
      await adminFetch(`/api/admin/tracks-db/${track.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio_url: audioUrl }),
      });

      // Clean up pending clips row in DB (the pending storage files stay but
      // are overridden on next generation — cheap and simple)
      try {
        await adminFetch("/api/admin/pending-clips", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ album_slug: albumSlug, track_number: track.number }),
        });
      } catch { /* ignore */ }

      setSunoStatus("idle");
      setSunoMsg("");
      setSunoClips([]);
      onChanged();
    } catch (e) {
      alert(`Erro a aprovar: ${e instanceof Error ? e.message : "?"}`);
    }
    setApprovingClipId(null);
  }

  return (
    <div className="rounded bg-black/20 p-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-mundo-creme truncate">
            <span className="text-mundo-muted font-mono">{String(track.number).padStart(2, "0")}.</span> {track.title}
            {track.audio_url && <span className="ml-2 text-[10px] text-green-400">✓ áudio</span>}
          </p>
          <p className="text-[10px] text-mundo-muted">
            {track.lang}/{track.energy}{track.flavor ? `/${track.flavor}` : ""} · {track.duration_seconds}s
          </p>
          {/* Admin preview player — only visible here in /admin/albums.
              Lets you listen to drafts without publishing them to the app. */}
          {track.audio_url && (
            <audio src={track.audio_url} controls preload="metadata" className="w-full h-7 mt-1" />
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => setEditing(!editing)}
            className="rounded px-2 py-1 text-[10px] bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40"
          >
            {editing ? "Fechar" : "Editar"}
          </button>
          <button
            onClick={generateSuno}
            disabled={sunoStatus === "generating" || sunoStatus === "polling"}
            className={`rounded px-2 py-1 text-[10px] transition ${
              sunoStatus === "generating" || sunoStatus === "polling"
                ? "bg-amber-900/20 text-amber-600 animate-pulse"
                : "bg-amber-700/30 text-amber-300 hover:bg-amber-700/50"
            }`}
          >
            {sunoStatus === "generating" ? "..." : sunoStatus === "polling" ? "polling" : sunoClips.length > 0 ? "Regerar" : "Suno"}
          </button>
          <label className="rounded px-2 py-1 text-[10px] bg-blue-700/30 text-blue-300 hover:bg-blue-700/50 cursor-pointer">
            {busy === "audio" ? "..." : "Áudio"}
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, "audio");
                e.target.value = "";
              }}
            />
          </label>
          <label className="rounded px-2 py-1 text-[10px] bg-purple-700/30 text-purple-300 hover:bg-purple-700/50 cursor-pointer">
            {busy === "cover" ? "..." : "Capa"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f, "cover");
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {/* Suno status banner + listen+approve panel (mirrors producao flow) */}
      {sunoStatus !== "idle" && sunoMsg && (
        <p className={`text-[11px] mt-2 ${sunoStatus === "error" ? "text-red-400" : "text-amber-400"} ${sunoStatus === "polling" || sunoStatus === "generating" ? "animate-pulse" : ""}`}>
          {sunoMsg}
        </p>
      )}
      {sunoStatus === "ready" && sunoClips.length > 0 && (
        <div className="mt-2 space-y-2">
          {sunoClips.map((c, i) => (
            <div key={c.id || i} className="rounded bg-black/30 p-2">
              <div className="flex items-center gap-2 mb-1">
                {c.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imageUrl} alt="" className="w-8 h-8 rounded object-cover" />
                )}
                <span className="text-[11px] text-amber-300 font-medium">
                  Versão {String.fromCharCode(65 + i)} {c.duration ? `(${Math.floor(c.duration / 60)}:${String(Math.floor(c.duration % 60)).padStart(2, "0")})` : ""}
                </span>
              </div>
              {c.audioUrl && (
                <audio src={c.audioUrl} controls className="w-full h-8" preload="metadata" />
              )}
              <button
                onClick={() => approveClip(c)}
                disabled={approvingClipId !== null}
                className={`mt-1.5 w-full rounded px-2 py-1 text-[10px] transition ${
                  approvingClipId === c.id
                    ? "bg-green-900/20 text-green-600 animate-pulse cursor-wait"
                    : approvingClipId !== null
                    ? "bg-mundo-muted-dark/10 text-mundo-muted-dark cursor-not-allowed"
                    : "bg-green-800/30 text-green-300 hover:bg-green-800/50"
                }`}
              >
                {approvingClipId === c.id ? `A aprovar Versão ${String.fromCharCode(65 + i)}...` : `Aprovar Versão ${String.fromCharCode(65 + i)}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="mt-2 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1.5 text-xs text-mundo-creme outline-none focus:border-amber-700/50"
          />

          {/* Metadados em linha */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <label className="text-[10px] text-mundo-muted">
              Lang
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1 text-xs text-mundo-creme mt-0.5"
              >
                <option value="PT">PT</option>
                <option value="EN">EN</option>
              </select>
            </label>
            <label className="text-[10px] text-mundo-muted">
              Energy
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1 text-xs text-mundo-creme mt-0.5"
              >
                <option value="whisper">whisper</option>
                <option value="steady">steady</option>
                <option value="pulse">pulse</option>
                <option value="anthem">anthem</option>
                <option value="raw">raw</option>
              </select>
            </label>
            <label className="text-[10px] text-mundo-muted col-span-2 sm:col-span-1">
              Flavor
              <input
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                placeholder="ex: marrabenta-rnb"
                className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1 text-xs text-mundo-creme mt-0.5"
              />
            </label>
            <label className="text-[10px] text-mundo-muted">
              Vocal
              <select
                value={vocalMode}
                onChange={(e) => setVocalMode(e.target.value)}
                className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1 text-xs text-mundo-creme mt-0.5"
              >
                <option value="solo">solo</option>
                <option value="duet">duet</option>
              </select>
            </label>
            <label className="text-[10px] text-mundo-muted">
              Duração (s)
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value, 10) || 240)}
                className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1 text-xs text-mundo-creme mt-0.5"
              />
            </label>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt Suno"
            className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1.5 text-xs text-mundo-creme font-mono outline-none focus:border-amber-700/50 min-h-[60px]"
          />
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Letras (vazio = instrumental)"
            className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1.5 text-xs text-mundo-creme font-mono outline-none focus:border-amber-700/50 min-h-[100px]"
          />
          <button
            onClick={saveEdit}
            disabled={busy === "save"}
            className="rounded px-3 py-1.5 text-[11px] bg-green-800/30 text-green-300 hover:bg-green-800/50"
          >
            {busy === "save" ? "A guardar..." : "Guardar"}
          </button>
        </div>
      )}
    </div>
  );
}
