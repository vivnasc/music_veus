"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOODS, type MoodSlug } from "@/data/moods";
import { adminFetch } from "@/lib/admin-fetch";

type CoverMap = Record<string, string | null>;

export default function MoodMixCoversAdminPage() {
  const [covers, setCovers] = useState<CoverMap>({});
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<MoodSlug | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draggingOver, setDraggingOver] = useState<MoodSlug | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function loadCovers() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/mood-mix-cover");
      const data = await res.json();
      if (res.ok) setCovers(data.covers || {});
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCovers();
  }, []);

  async function uploadCover(mood: MoodSlug, file: File) {
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, [mood]: "Tem de ser imagem (JPG/PNG)." }));
      return;
    }
    setUploadingFor(mood);
    setErrors((e) => ({ ...e, [mood]: "" }));
    try {
      const form = new FormData();
      form.append("moodSlug", mood);
      form.append("image", file);
      const res = await adminFetch("/api/admin/mood-mix-cover", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((e) => ({ ...e, [mood]: data.erro || "Erro" }));
      } else {
        setCovers((c) => ({ ...c, [mood]: data.url }));
      }
    } catch (e) {
      setErrors((errs) => ({ ...errs, [mood]: e instanceof Error ? e.message : "?" }));
    }
    setUploadingFor(null);
  }

  async function deleteCover(mood: MoodSlug) {
    if (!confirm(`Apagar capa de ${mood}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/mood-mix-cover?moodSlug=${mood}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCovers((c) => ({ ...c, [mood]: null }));
      }
    } catch {}
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          <Link href="/admin" className="p-1.5 rounded-lg hover:bg-white/5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Capas dos 4 Mix de Mood</h1>
            <p className="text-[11px] text-mundo-muted">
              Arrasta uma imagem (Midjourney) ou clica para escolher. Vai aparecer na home em "Mix do teu mood".
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {loading ? (
          <p className="text-sm text-mundo-muted">A carregar…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {MOODS.map((meta) => {
              const mood = meta.slug;
              const url = covers[mood];
              const isUploading = uploadingFor === mood;
              const isDragging = draggingOver === mood;
              const err = errors[mood];

              return (
                <div
                  key={mood}
                  className={`rounded-2xl overflow-hidden bg-white/5 border-2 transition-colors ${
                    isDragging ? "border-[#C9A96E]" : "border-white/10"
                  }`}
                >
                  <div
                    className="aspect-[5/4] relative"
                    style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color2})` }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDraggingOver(mood);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = "copy";
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Only clear if leaving to outside this element
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setDraggingOver(null);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDraggingOver(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file) uploadCover(mood, file);
                    }}
                  >
                    {url && (
                      <Image
                        src={url}
                        alt={meta.label}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-2xl font-semibold text-white drop-shadow">
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-white/80 mt-0.5">{meta.description}</span>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-sm text-white">A carregar…</span>
                      </div>
                    )}
                    {isDragging && !isUploading && (
                      <div className="absolute inset-0 bg-[#C9A96E]/30 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <span className="text-sm font-medium text-white drop-shadow">Largar para fazer upload</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      ref={(el) => { fileInputs.current[mood] = el; }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadCover(mood, file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      onClick={() => fileInputs.current[mood]?.click()}
                      disabled={isUploading}
                      className="flex-1 text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40 transition"
                    >
                      {url ? "Substituir" : "Carregar capa"}
                    </button>
                    {url && (
                      <button
                        onClick={() => deleteCover(mood)}
                        disabled={isUploading}
                        className="text-xs px-3 py-2 rounded-full text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition"
                      >
                        Apagar
                      </button>
                    )}
                  </div>

                  {err && (
                    <p className="text-[11px] text-red-400 px-3 pb-3">Erro: {err}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-[11px] text-mundo-muted">
          <p><strong className="text-mundo-creme">Como funciona:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Arrasta o ficheiro da imagem para cima do card, ou clica em "Carregar capa"</li>
            <li>Aspect 5:4 (1280×1024 ideal) — corresponde ao card na home</li>
            <li>Formato JPG/PNG aceite, convertido para JPG no servidor</li>
            <li>Substituir = upload por cima, descarta a anterior</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
