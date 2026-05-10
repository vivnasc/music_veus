"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_SLUGS, PRODUCT_LABELS, type ProductSlug } from "@/lib/product-covers";
import { adminFetch } from "@/lib/admin-fetch";

type CoverMap = Record<string, string | null>;

export default function ProductCoversAdminPage() {
  const [covers, setCovers] = useState<CoverMap>({});
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<ProductSlug | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function loadCovers() {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/product-cover");
      const data = await res.json();
      if (res.ok) setCovers(data.covers || {});
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => { loadCovers(); }, []);

  async function uploadCover(product: ProductSlug, file: File) {
    setUploadingFor(product);
    setErrors((e) => ({ ...e, [product]: "" }));
    try {
      const form = new FormData();
      form.append("productSlug", product);
      form.append("image", file);
      const res = await adminFetch("/api/admin/product-cover", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setErrors((e) => ({ ...e, [product]: data.erro || "Erro" }));
      } else {
        setCovers((c) => ({ ...c, [product]: data.url }));
      }
    } catch (e) {
      setErrors((errs) => ({ ...errs, [product]: e instanceof Error ? e.message : "?" }));
    }
    setUploadingFor(null);
  }

  async function deleteCover(product: ProductSlug) {
    if (!confirm(`Apagar capa de ${PRODUCT_LABELS[product].pt}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/product-cover?productSlug=${product}`, { method: "DELETE" });
      if (res.ok) setCovers((c) => ({ ...c, [product]: null }));
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
            <h1 className="text-lg font-semibold">Capas das 11 coleções</h1>
            <p className="text-[11px] text-mundo-muted">
              Hero das páginas /coleccao/{"{slug}"} — Midjourney 1024×1024 JPG
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        {loading ? (
          <p className="text-sm text-mundo-muted">A carregar…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {PRODUCT_SLUGS.map((product) => {
              const meta = PRODUCT_LABELS[product];
              const url = covers[product];
              const isUploading = uploadingFor === product;
              const err = errors[product];

              return (
                <div key={product} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                  <div className="aspect-square relative bg-gradient-to-br from-mundo-noite to-[#1a1a2e]">
                    {url && (
                      <Image
                        src={url}
                        alt={meta.pt}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <span className="text-2xl font-semibold text-white drop-shadow">{meta.pt}</span>
                      <span className="text-[11px] text-white/80 mt-0.5">{meta.en}</span>
                      <span className="text-[10px] text-white/60 italic mt-0.5">{meta.sub}</span>
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
                      ref={(el) => { fileInputs.current[product] = el; }}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadCover(product, file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      onClick={() => fileInputs.current[product]?.click()}
                      disabled={isUploading}
                      className="flex-1 text-xs px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-40 transition"
                    >
                      {url ? "Substituir" : "Carregar capa"}
                    </button>
                    {url && (
                      <button
                        onClick={() => deleteCover(product)}
                        disabled={isUploading}
                        className="text-xs px-3 py-2 rounded-full text-red-400 hover:bg-red-400/10 disabled:opacity-40 transition"
                      >
                        Apagar
                      </button>
                    )}
                  </div>

                  {err && <p className="text-[11px] text-red-400 px-3 pb-3">Erro: {err}</p>}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-[11px] text-mundo-muted">
          <p><strong className="text-mundo-creme">Recomendações Midjourney:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>1024×1024 (square) — vai ser apresentada como hero blur 60px + miniatura nítida</li>
            <li>Composição abstracta ou figurativa subtil — texto será sobreposto em branco</li>
            <li>Formato JPG. PNG aceite mas convertido para JPG no upload</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
