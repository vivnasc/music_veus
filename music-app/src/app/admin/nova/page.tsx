"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NOVA_ALBUMS } from "@/data/nova-albums";

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`shrink-0 rounded px-3 py-1.5 text-[11px] font-medium transition ${
        copied
          ? "bg-green-800/40 text-green-400"
          : "bg-mundo-muted-dark/20 text-mundo-muted hover:bg-mundo-muted-dark/40 hover:text-mundo-creme"
      }`}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}

export default function NovaAdminPage() {
  const [openAlbum, setOpenAlbum] = useState<string | null>(NOVA_ALBUMS[0]?.slug ?? null);
  const [openTrack, setOpenTrack] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const totalTracks = useMemo(
    () => NOVA_ALBUMS.reduce((s, a) => s + a.tracks.length, 0),
    []
  );

  const filteredAlbums = useMemo(() => {
    if (!search.trim()) return NOVA_ALBUMS;
    const q = search.toLowerCase();
    return NOVA_ALBUMS
      .map((a) => ({
        ...a,
        tracks: a.tracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            a.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        ),
      }))
      .filter((a) => a.tracks.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-violet-300 mb-1">NOVA</h1>
        <p className="text-xs text-mundo-muted">
          10 álbuns × 10 faixas — pop ético/profético, voz solo, EN com sussurros PT
        </p>
        <p className="text-[10px] text-mundo-muted-dark mt-1">
          {NOVA_ALBUMS.length} álbuns · {totalTracks} faixas no total
        </p>
      </div>

      {/* Nav */}
      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/admin/producao"
          className="shrink-0 rounded-lg bg-mundo-muted-dark/20 px-4 py-2 text-xs text-mundo-muted hover:bg-mundo-muted-dark/40 hover:text-mundo-creme transition"
        >
          ← Produção Loranne
        </Link>
        <Link
          href="/admin/ancient-ground"
          className="shrink-0 rounded-lg bg-amber-900/20 px-4 py-2 text-xs text-amber-400 hover:bg-amber-900/40 transition"
        >
          Ancient Ground
        </Link>
        <Link
          href="/admin/albums"
          className="shrink-0 rounded-lg bg-indigo-900/20 px-4 py-2 text-xs text-indigo-300 hover:bg-indigo-900/40 transition"
        >
          Gestor de Álbuns
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar faixa ou álbum..."
          className="w-full rounded-lg bg-black/30 border border-mundo-muted-dark/20 px-4 py-2.5 text-sm text-mundo-creme placeholder:text-mundo-muted-dark outline-none focus:border-violet-700/50"
        />
      </div>

      {/* Como usar */}
      <div className="mb-6 rounded-xl border border-violet-900/30 bg-violet-950/20 p-4">
        <p className="text-[11px] text-violet-300 leading-relaxed">
          Cada faixa tem 3 blocos para colar no Suno: <strong>STYLE</strong> (campo Style of Music),
          <strong> TITLE</strong> (campo Title), <strong>LYRICS</strong> (campo Lyrics).
          Usa a Persona criada a partir de &ldquo;Antenna&rdquo; em todas as faixas.
        </p>
      </div>

      {/* Albums */}
      <div className="space-y-3">
        {filteredAlbums.map((album) => {
          const isOpen = openAlbum === album.slug;
          return (
            <div
              key={album.slug}
              className="rounded-xl border border-mundo-muted-dark/20 bg-mundo-bg-light/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenAlbum(isOpen ? null : album.slug)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-mundo-muted-dark/10 transition"
              >
                <span
                  className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: `${album.color}33`, color: album.color }}
                >
                  {album.title.slice(0, 3)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-medium text-mundo-creme truncate">{album.title}</h2>
                  <p className="text-[10px] text-mundo-muted truncate">{album.subtitle}</p>
                </div>
                <span className="shrink-0 text-[10px] text-mundo-muted-dark">
                  {album.tracks.length} faixas
                </span>
                <span className="shrink-0 text-mundo-muted-dark">{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-mundo-muted-dark/20 divide-y divide-mundo-muted-dark/10">
                  {album.tracks.map((track) => {
                    const trackKey = `${album.slug}/${track.number}`;
                    const trackOpen = openTrack === trackKey;
                    return (
                      <div key={trackKey} className="px-4 py-3">
                        <button
                          onClick={() => setOpenTrack(trackOpen ? null : trackKey)}
                          className="w-full flex items-center gap-3 text-left"
                        >
                          <span className="shrink-0 w-7 h-7 rounded-full bg-violet-900/30 text-violet-300 flex items-center justify-center text-[10px] font-bold">
                            {String(track.number).padStart(2, "0")}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-mundo-creme truncate">{track.title}</p>
                            <p className="text-[10px] text-mundo-muted truncate">
                              {track.description}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] text-mundo-muted-dark">
                            {trackOpen ? "−" : "+"}
                          </span>
                        </button>

                        {trackOpen && (
                          <div className="mt-3 space-y-3">
                            {/* STYLE */}
                            <div className="rounded-lg bg-black/30 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase tracking-wider text-violet-400">
                                  Style of Music
                                </span>
                                <CopyButton text={track.prompt} label="Copiar STYLE" />
                              </div>
                              <pre className="text-[11px] text-mundo-creme/80 whitespace-pre-wrap font-mono break-words">
                                {track.prompt}
                              </pre>
                            </div>

                            {/* TITLE */}
                            <div className="rounded-lg bg-black/30 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase tracking-wider text-violet-400">
                                  Title
                                </span>
                                <CopyButton text={track.title} label="Copiar TITLE" />
                              </div>
                              <pre className="text-[11px] text-mundo-creme/80 whitespace-pre-wrap font-mono break-words">
                                {track.title}
                              </pre>
                            </div>

                            {/* LYRICS */}
                            <div className="rounded-lg bg-black/30 p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] uppercase tracking-wider text-violet-400">
                                  Lyrics
                                </span>
                                <CopyButton text={track.lyrics} label="Copiar LYRICS" />
                              </div>
                              <pre className="text-[11px] text-mundo-creme/80 whitespace-pre-wrap font-mono break-words max-h-96 overflow-auto">
                                {track.lyrics}
                              </pre>
                            </div>

                            {/* Link público */}
                            <Link
                              href={`/album/${album.slug}`}
                              className="block text-center text-[11px] text-violet-300 hover:text-violet-200"
                            >
                              Abrir página pública do álbum →
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAlbums.length === 0 && (
        <p className="text-center text-mundo-muted text-sm py-12">
          Nenhuma faixa encontrada.
        </p>
      )}
    </div>
  );
}
