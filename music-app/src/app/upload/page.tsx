"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ALL_ALBUMS as ALBUMS, type Album, type AlbumTrack, type TrackEnergy, ENERGY_LABELS } from "@/data/albums";
import { supabase } from "@/lib/supabase";
import { detectEnergyFromVersion, ENERGY_OPTIONS } from "@/lib/version-energy";

import { ADMIN_EMAIL } from "@/lib/admin-auth";
import { adminFetch } from "@/lib/admin-fetch";

type UploadState = "idle" | "uploading" | "done" | "error";

type TrackUploadStatus = {
  state: UploadState;
  progress: number;
  url?: string;
  error?: string;
};

type TrackVersion = {
  name: string;
  path: string;
  created_at: string;
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function buildFilename(albumSlug: string, trackNumber: number, version?: string): string {
  if (version) {
    return `albums/${albumSlug}/faixa-${String(trackNumber).padStart(2, "0")}-${version}.mp3`;
  }
  return `albums/${albumSlug}/faixa-${String(trackNumber).padStart(2, "0")}.mp3`;
}

export default function UploadPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [uploadStatuses, setUploadStatuses] = useState<Record<string, TrackUploadStatus>>({});
  const [filter, setFilter] = useState<string>("");
  const [versionName, setVersionName] = useState<string>("");
  const [versionEnergy, setVersionEnergy] = useState<TrackEnergy | "">("");
  const [trackVersions, setTrackVersions] = useState<Record<string, TrackVersion[]>>({});
  const [showVersions, setShowVersions] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Auth check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const email = data.user?.email || null;
      setUserEmail(email);
      setAuthed(email === ADMIN_EMAIL);
    });
  }, []);

  const trackKey = (albumSlug: string, trackNumber: number) => `${albumSlug}/${trackNumber}`;

  const filteredAlbums = filter
    ? ALBUMS.filter(a =>
        a.title.toLowerCase().includes(filter.toLowerCase()) ||
        a.slug.toLowerCase().includes(filter.toLowerCase()) ||
        a.product.toLowerCase().includes(filter.toLowerCase())
      )
    : ALBUMS;

  const loadVersions = useCallback(async (albumSlug: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("audios")
        .list(`albums/${albumSlug}`, { limit: 500 });
      if (error || !data) return;

      const versionMap: Record<string, TrackVersion[]> = {};
      for (const file of data) {
        // Match faixa-NN or faixa-NN-versionname
        const match = file.name.match(/^faixa-(\d+)(?:-(.+))?\.mp3$/);
        if (!match) continue;
        const num = parseInt(match[1], 10);
        const ver = match[2] || "original";
        const key = trackKey(albumSlug, num);
        if (!versionMap[key]) versionMap[key] = [];
        versionMap[key].push({
          name: ver,
          path: `albums/${albumSlug}/${file.name}`,
          created_at: file.created_at || "",
        });
      }
      setTrackVersions(versionMap);
    } catch {
      // ignore
    }
  }, []);

  // Track which album slugs have audio in Supabase Storage (persists across refresh)
  const [storageStatus, setStorageStatus] = useState<Record<string, boolean>>({});

  // Load audio status for all albums on mount (shows which tracks exist in storage)
  useEffect(() => {
    if (!authed) return;
    adminFetch("/api/admin/audio-status")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.existing) return;
        const map: Record<string, boolean> = {};
        for (const key of data.existing as string[]) {
          map[key] = true;
        }
        setStorageStatus(map);
      })
      .catch(() => {});
  }, [authed]);

  // Load versions for selected album
  useEffect(() => {
    if (!selectedAlbum) return;
    loadVersions(selectedAlbum.slug);
  }, [selectedAlbum, loadVersions]);

  const uploadFile = useCallback(async (file: File, album: Album, track: AlbumTrack, version?: string) => {
    const key = trackKey(album.slug, track.number);
    const filename = buildFilename(album.slug, track.number, version);

    setUploadStatuses(prev => ({
      ...prev,
      [key]: { state: "uploading", progress: 0 },
    }));

    try {
      // Step 1: Get a signed upload URL from the server (uses service role key)
      const signedRes = await adminFetch("/api/admin/signed-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      if (!signedRes.ok) {
        const errData = await signedRes.json().catch(() => ({}));
        throw new Error(errData.erro || `Erro ao gerar URL de upload (${signedRes.status})`);
      }

      const { signedUrl } = await signedRes.json();

      // Step 2: Upload directly to Supabase Storage (bypasses Vercel 4.5MB limit)
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/mpeg" },
        body: file,
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => "");
        throw new Error(`Upload falhou (${uploadRes.status}): ${errText.slice(0, 120)}`);
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://tdytdamtfillqyklgrmb.supabase.co";
      const url = `${supabaseUrl}/storage/v1/object/public/audios/${filename}`;

      setUploadStatuses(prev => ({
        ...prev,
        [key]: { state: "done", progress: 100, url },
      }));

      // Save version metadata if this is a named version
      if (version) {
        const matchedTrack = album.tracks.find(t => trackKey(album.slug, t.number) === key);
        const energy = versionEnergy || matchedTrack?.energy || "whisper";
        try {
          await adminFetch("/api/admin/track-versions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              album_slug: album.slug,
              track_number: matchedTrack?.number,
              version_name: version,
              energy,
              audio_url: url,
            }),
          });
        } catch {
          // Version metadata save is best-effort
        }
      }

      // Update storage status for this track
      const sKey = `${album.slug}-t${track.number}`;
      if (!version) {
        setStorageStatus(prev => ({ ...prev, [sKey]: true }));
      }

      // Reload versions
      await loadVersions(album.slug);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setUploadStatuses(prev => ({
        ...prev,
        [key]: { state: "error", progress: 0, error: msg },
      }));
    }
  }, [versionEnergy]);

  const handleFileSelect = useCallback((album: Album, track: AlbumTrack, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const isAudio = file.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac|wma)$/i.test(file.name);
    if (!isAudio) {
      const key = trackKey(album.slug, track.number);
      setUploadStatuses(prev => ({
        ...prev,
        [key]: { state: "error", progress: 0, error: "Ficheiro deve ser audio (MP3, WAV, etc.)" },
      }));
      return;
    }
    const version = versionName.trim() || undefined;
    uploadFile(file, album, track, version);
  }, [uploadFile, versionName]);

  // Bulk upload
  const handleBulkUpload = useCallback(async (album: Album, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter(f => f.type.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg|flac|wma)$/i.test(f.name));
    fileArray.sort((a, b) => a.name.localeCompare(b.name));
    const version = versionName.trim() || undefined;

    for (let i = 0; i < Math.min(fileArray.length, album.tracks.length); i++) {
      const track = album.tracks[i];
      await uploadFile(fileArray[i], album, track, version);
    }
  }, [uploadFile, versionName]);

  const bulkInputRef = useRef<HTMLInputElement | null>(null);

  // Auth gate
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#666680]">A verificar acesso...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="#666680" strokeWidth="1.5" className="h-12 w-12 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <h1 className="font-display text-xl font-semibold text-[#F5F0E6] mb-2">Acesso restrito</h1>
        <p className="text-sm text-[#666680] text-center mb-6 max-w-xs">
          Esta página é exclusiva para a administradora.
          {userEmail && (
            <span className="block mt-2 text-[#a0a0b0]">Sessão: {userEmail}</span>
          )}
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl bg-[#C9A96E] text-[#0D0D1A] font-medium text-sm hover:bg-[#d4b87a] transition-colors"
        >
          Entrar com outra conta
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 max-w-screen-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors mb-8"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        <h1 className="font-display text-3xl font-bold text-[#F5F0E6]">
          Carregar Músicas
        </h1>
        <p className="text-sm text-[#a0a0b0] mt-2">
          Carrega ficheiros de audio para o Supabase. Aceita MP3, WAV e outros formatos de audio.
        </p>

        {/* Search + Version name */}
        <div className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666680]">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Procurar album..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
            />
          </div>
          <div className="relative w-48">
            <input
              type="text"
              placeholder="Versao (ex: v2, remix)"
              value={versionName}
              onChange={e => {
                const val = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "");
                setVersionName(val);
                const detected = detectEnergyFromVersion(val);
                if (detected) setVersionEnergy(detected);
                else if (val === "") setVersionEnergy("");
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
            />
          </div>
        </div>
        {versionName && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-[#C9A96E]">
              Os uploads serão guardados como versão "{versionName}" (ex: faixa-01-{versionName}.mp3)
            </p>

            {/* Energy picker for version */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666680]">Energia da versão:</span>
              <div className="flex gap-1.5">
                {ENERGY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setVersionEnergy(opt.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                      versionEnergy === opt.value
                        ? "border-[#C9A96E] text-[#F5F0E6] bg-[#C9A96E]/20"
                        : "border-white/10 text-[#666680] hover:text-[#a0a0b0] hover:bg-white/5"
                    }`}
                  >
                    {ENERGY_LABELS[opt.value].emoji} {opt.label}
                  </button>
                ))}
              </div>
              {versionEnergy && (
                <button
                  onClick={() => setVersionEnergy("")}
                  className="text-[10px] text-[#666680] hover:text-[#a0a0b0]"
                >
                  limpar
                </button>
              )}
            </div>
            {!versionEnergy && (
              <p className="text-[10px] text-[#666680]">
                Sem energia? Usa a energia original da faixa.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Album list or album detail */}
      <div className="max-w-screen-lg mx-auto px-6 pb-12">
        {selectedAlbum ? (
          /* Track list for selected album */
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setSelectedAlbum(null); setShowVersions(null); }}
                  className="p-2 -ml-2 text-[#a0a0b0] hover:text-[#F5F0E6] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#F5F0E6]">
                    {selectedAlbum.title}
                  </h2>
                  <p className="text-xs text-[#666680]">{selectedAlbum.tracks.length} faixas</p>
                </div>
              </div>

              {/* Bulk upload */}
              <div>
                <input
                  ref={bulkInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg"
                  multiple
                  className="hidden"
                  onChange={e => handleBulkUpload(selectedAlbum, e.target.files)}
                />
                <button
                  onClick={() => bulkInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-[#a0a0b0] hover:text-[#F5F0E6] hover:bg-white/10 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  Carregar todas
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {selectedAlbum.tracks.map(track => {
                const key = trackKey(selectedAlbum.slug, track.number);
                const status = uploadStatuses[key];
                const storageKey = `${selectedAlbum.slug}-t${track.number}`;
                const inStorage = !!storageStatus[storageKey];
                const hasAudio = !!track.audioUrl || status?.state === "done" || inStorage;
                const versions = trackVersions[key] || [];
                const isExpanded = showVersions === key;

                return (
                  <div key={track.number}>
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.02] hover:bg-white/5 transition-colors"
                    >
                      {/* Track number */}
                      <span className="w-8 text-center text-sm tabular-nums text-[#666680]">
                        {track.number}
                      </span>

                      {/* Track info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#F5F0E6] truncate">{track.title}</p>
                        <p className="text-xs text-[#666680] truncate">
                          {track.lang} — {fmt(track.durationSeconds)}
                          {(track.audioUrl || inStorage) && (
                            <span className="ml-2 text-green-400/70">audio existente</span>
                          )}
                        </p>
                      </div>

                      {/* Versions count */}
                      {versions.length > 0 && (
                        <button
                          onClick={() => setShowVersions(isExpanded ? null : key)}
                          className="shrink-0 text-xs text-[#C9A96E]/70 hover:text-[#C9A96E] transition-colors flex items-center gap-1"
                        >
                          <span>{versions.length} {versions.length === 1 ? "versão" : "versões"}</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                            <path d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}

                      {/* Status */}
                      <div className="shrink-0 w-28 text-right">
                        {status?.state === "uploading" && (
                          <span className="text-xs text-[#C9A96E] animate-pulse">A carregar...</span>
                        )}
                        {status?.state === "done" && (
                          <span className="text-xs text-green-400">Carregado</span>
                        )}
                        {status?.state === "error" && (
                          <span className="text-xs text-red-400 truncate" title={status.error}>
                            {status.error}
                          </span>
                        )}
                      </div>

                      {/* Upload button */}
                      <div className="shrink-0">
                        <input
                          ref={el => { fileInputRefs.current[key] = el; }}
                          type="file"
                          accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/aac,audio/ogg"
                          className="hidden"
                          onChange={e => handleFileSelect(selectedAlbum, track, e.target.files)}
                        />
                        <button
                          onClick={() => fileInputRefs.current[key]?.click()}
                          disabled={status?.state === "uploading"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                            hasAudio
                              ? "bg-white/5 text-[#a0a0b0] hover:text-[#F5F0E6] hover:bg-white/10"
                              : "bg-[#C9A96E]/20 text-[#C9A96E] hover:bg-[#C9A96E]/30"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          {versionName ? `+ ${versionName}` : hasAudio ? "Substituir" : "Carregar"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded versions */}
                    {isExpanded && versions.length > 0 && (
                      <div className="ml-12 mb-2 mt-1 space-y-1">
                        {versions.map(v => (
                          <div
                            key={v.path}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] text-xs"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="#666680" strokeWidth="1.5" className="h-3.5 w-3.5 shrink-0">
                              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                            </svg>
                            <span className="text-[#a0a0b0] flex-1 truncate font-mono">{v.name}</span>
                            <span className="text-[#666680] shrink-0">{v.path.split("/").pop()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Info */}
            <div className="mt-8 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-xs text-[#666680]">
                Os ficheiros sao guardados no Supabase Storage no bucket <code className="text-[#a0a0b0]">audios</code> com o caminho:
              </p>
              <p className="text-xs text-[#a0a0b0] mt-1 font-mono">
                albums/{selectedAlbum.slug}/faixa-01.mp3
              </p>
              {versionName && (
                <p className="text-xs text-[#C9A96E] mt-1 font-mono">
                  albums/{selectedAlbum.slug}/faixa-01-{versionName}.mp3 (versão)
                </p>
              )}
              <p className="text-xs text-[#666680] mt-2">
                O upload com "Carregar todas" associa os ficheiros por ordem (primeiro ficheiro = faixa 1, etc.).
              </p>
              <p className="text-xs text-[#666680] mt-1">
                Para adicionar versões alternativas, escreve o nome da versão no campo acima (ex: "v2", "remix", "acoustic").
              </p>
            </div>
          </div>
        ) : (
          /* Album grid */
          <div className="space-y-8">
            {(["espelho", "no", "livro", "curso", "incenso", "eter", "nua", "sangue", "fibra", "grao", "mare"] as const).map(product => {
              const albumsInCategory = filteredAlbums.filter(a => a.product === product);
              if (albumsInCategory.length === 0) return null;

              const labels: Record<string, string> = {
                espelho: "Espelhos",
                no: "Nos",
                livro: "Livro Filosofico",
                curso: "Cursos",
                espiritual: "Espiritual",
              };

              return (
                <section key={product}>
                  <h2 className="text-sm uppercase tracking-widest text-[#666680] mb-3">{labels[product]}</h2>
                  <div className="space-y-1">
                    {albumsInCategory.map(album => {
                      const total = album.tracks.length;
                      const ready = album.tracks.filter(t => {
                        const key = trackKey(album.slug, t.number);
                        const sKey = `${album.slug}-t${t.number}`;
                        return !!t.audioUrl || uploadStatuses[key]?.state === "done" || !!storageStatus[sKey];
                      }).length;

                      return (
                        <button
                          key={album.slug}
                          onClick={() => setSelectedAlbum(album)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                        >
                          {/* Color block */}
                          <div
                            className="h-10 w-10 rounded-lg shrink-0"
                            style={{ backgroundColor: album.color }}
                          />

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#F5F0E6] truncate">{album.title}</p>
                            <p className="text-xs text-[#666680]">{total} faixas</p>
                          </div>

                          {/* Progress */}
                          <div className="shrink-0 flex items-center gap-3">
                            {ready > 0 && (
                              <span className={`text-xs ${ready === total ? "text-green-400" : "text-[#C9A96E]"}`}>
                                {ready}/{total}
                              </span>
                            )}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-[#666680]">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
