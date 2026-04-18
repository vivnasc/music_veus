"use client";

import { useCallback, useEffect, useState } from "react";
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
  onTogglePublish,
  onDelete,
  onChanged,
}: {
  album: AlbumRow;
  onTogglePublish: () => void;
  onDelete: () => void;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
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
          onClick={() => setExpanded(!expanded)}
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
  const [busy, setBusy] = useState<string | null>(null);

  async function saveEdit() {
    setBusy("save");
    await adminFetch(`/api/admin/tracks-db/${track.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, lyrics, prompt }),
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

  async function generateSuno() {
    setBusy("suno");
    try {
      const res = await adminFetch("/api/admin/suno/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: track.prompt ?? "",
          title: track.title,
          customMode: true,
          instrumental: !(track.lyrics?.trim()),
          model: "V5_5",
          ...(track.lyrics?.trim() ? { lyrics: track.lyrics } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.erro || "?");
      alert(`Suno gerado! Task ID: ${data.taskId || data.id || "ok"}\nVai à página Ancient Ground ou Producao para acompanhar.`);
    } catch (e) {
      alert(`Erro Suno: ${e instanceof Error ? e.message : "?"}`);
    }
    setBusy(null);
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
            disabled={busy === "suno"}
            className="rounded px-2 py-1 text-[10px] bg-amber-700/30 text-amber-300 hover:bg-amber-700/50"
          >
            {busy === "suno" ? "..." : "Suno"}
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

      {editing && (
        <div className="mt-2 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="w-full rounded bg-black/40 border border-mundo-muted-dark/20 px-2 py-1.5 text-xs text-mundo-creme outline-none focus:border-amber-700/50"
          />
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
