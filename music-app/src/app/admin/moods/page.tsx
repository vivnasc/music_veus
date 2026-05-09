"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LORANNE_MOODS, MOOD_META, type LoranneMood } from "@/data/loranne-moods";
import { adminFetch } from "@/lib/admin-fetch";

type CoverMap = Record<string, string | null>;

export default function MoodCoversAdminPage() {
  const [covers, setCovers] = useState<CoverMap>({});
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<LoranneMood | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function loadCovers() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/mood-cover");
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

  async function uploadCover(mood: LoranneMood, file: File) {
    setUploadingFor(mood);
    setErrors((e) => ({ ...e, [mood]: "" }));
    try {
      const form = new FormData();
      form.append("moodSlug", mood);
      form.append("image", file);
      const res = await adminFetch("/api/admin/mood-cover", {
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

  async function deleteCover(mood: LoranneMood) {
    if (!confirm(`Apagar capa de ${MOOD_META[mood].label}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/mood-cover?moodSlug=${mood}`, {
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
            <h1 className="text-lg font-semibold">Capas dos 7 moods</h1>
            <p className="text-[11px] text-mundo-muted">
              Upload de imagens (Midjourney) — vão aparecer em /descobre e /lista/mood-loranne-{"{slug}"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {loading ? (
          <p className="text-sm text-mundo-muted">A carregar…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {LORANNE_MOODS.map((mood) => {
              const meta = MOOD_META[mood];
              const url = covers[mood];
              const isUploading = uploadingFor === mood;
              const err = errors[mood];

              return (
                <div key={mood} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <div
                    className="aspect-square relative"
                    style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}33)` }}
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
                      <span className="text-[11px] text-white/80 mt-0.5">{meta.paraQuem}</span>
                      <span className="text-[10px] text-white/60 italic mt-0.5">{meta.vibe}</span>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-sm text-white">A carregar…</span>
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
          <p><strong className="text-mundo-creme">Recomendações Midjourney:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>1024×1024 (square) — vai ser apresentada no grid 4:3 e aspect-square</li>
            <li>Paleta consistente com a cor do mood (ex.: <code>{"{label}: {color}"}</code>)</li>
            <li>Composição abstracta ou figurativa subtil — texto será sobreposto em branco</li>
            <li>Formato JPG. PNG aceite mas convertido para JPG no upload</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
