"use client";

import React, { useState, useRef, type ChangeEvent } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

const QUICK_PROMPTS = [
  "silhueta sentada num cafe, luz da tarde pela janela, veu caindo sobre o rosto",
  "a caminhar na praia ao por do sol, vento no veu, apenas silhueta contra a luz",
  "num estudio de gravacao, auscultadores sobre o veu, costas para a camera",
  "de pe numa varanda em Lisboa, vista para o rio, silhueta recortada contra o ceu",
  "silhueta a cantar ao vivo num palco pequeno, luz quente por tras, rosto oculto",
  "deitada na relva, veu dourado espalhado, sem rosto visivel, luz suave",
  "sentada no chao com guitarra, quarto escuro, apenas contorno e tecido",
  "a caminhar numa rua estreita de Lisboa, sombras longas, figura envolta em veu",
];

const IMAGE_COUNTS = [1, 2, 4] as const;

export default function FotosPage() {
  const [prompt, setPrompt] = useState("");
  const [numImages, setNumImages] = useState<number>(4);
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ prompt: string; urls: string[] }>>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleGenerate() {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await adminFetch("/api/admin/generate-loranne", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), numImages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.erro || `Erro ${res.status}`);
        return;
      }

      const urls = data.imageUrls || [];
      setImages(urls);
      if (urls.length > 0) {
        setHistory((prev) => [{ prompt: prompt.trim(), urls }, ...prev].slice(0, 20));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  function useQuickPrompt(text: string) {
    setPrompt(text);
    textareaRef.current?.focus();
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] px-4 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/admin/producao"
            className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors"
          >
            &larr; Producao
          </Link>
          <Link
            href="/admin/calendario"
            className="text-xs text-[#666680] hover:text-[#C9A96E] transition-colors"
          >
            Calendario &rarr;
          </Link>
        </div>

        <h1 className="text-2xl font-bold font-display tracking-wide mb-1">
          Gerar Novas Fotos
        </h1>
        <p className="text-sm text-[#a0a0b0] mb-6">
          LoRA activo — trigger: <strong className="text-[#c08aaa]">loranne_artist</strong>.
          Descreve o cenario — a identidade (veu, silhueta, sem rosto) e adicionada automaticamente.
        </p>

        {/* Generator */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mb-6">
          <div className="flex gap-3">
            {/* Prompt textarea */}
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                placeholder="Ex: sentada num cafe em Lisboa, luz da tarde pela janela, veu a cair sobre os ombros"
                className="w-full h-24 rounded-xl bg-[#1a1a2e] border border-white/10 px-4 py-3 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#c08aaa]/50 resize-y"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <select
                value={numImages}
                onChange={(e) => setNumImages(Number(e.target.value))}
                className="rounded-lg bg-[#1a1a2e] border border-white/10 px-3 py-2 text-sm text-[#F5F0E6] focus:outline-none focus:border-[#c08aaa]/50"
              >
                {IMAGE_COUNTS.map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "imagem" : "imagens"}
                  </option>
                ))}
              </select>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="px-5 py-2 rounded-lg font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: generating
                    ? "rgba(192,138,170,0.3)"
                    : "linear-gradient(135deg, #c08aaa, #a06a8a)",
                  color: "#fff",
                }}
              >
                {generating ? "A gerar..." : "Gerar"}
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp}
                onClick={() => useQuickPrompt(qp)}
                className="text-[11px] px-3 py-1.5 rounded-full border border-white/10 text-[#a0a0b0] hover:text-[#c08aaa] hover:border-[#c08aaa]/30 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 mb-6">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Generating indicator */}
        {generating && (
          <div className="text-center py-12 mb-6">
            <div className="inline-block w-8 h-8 border-2 border-[#c08aaa]/30 border-t-[#c08aaa] rounded-full animate-spin mb-3" />
            <p className="text-sm text-[#666680]">A gerar {numImages} {numImages === 1 ? "imagem" : "imagens"}...</p>
          </div>
        )}

        {/* Results */}
        {images.length > 0 && !generating && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#c08aaa] uppercase tracking-wider mb-4">
              Resultado ({images.length} {images.length === 1 ? "imagem" : "imagens"})
            </h2>
            <div
              className={`grid gap-4 ${
                images.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : images.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2"
              }`}
            >
              {images.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={url}
                    alt={`Loranne ${i + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`loranne-${Date.now()}-${i + 1}.jpg`}
                      className="text-xs px-4 py-2 rounded-full bg-white/90 text-[#0D0D1A] font-semibold hover:bg-white transition"
                    >
                      Descarregar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#C9A96E] uppercase tracking-wider mb-4">
              Historico ({history.length})
            </h2>
            <div className="space-y-4">
              {history.map((entry, hi) => (
                <div
                  key={hi}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-[#a0a0b0] italic flex-1 truncate">
                      &ldquo;{entry.prompt}&rdquo;
                    </p>
                    <button
                      onClick={() => useQuickPrompt(entry.prompt)}
                      className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-[#666680] hover:text-[#c08aaa] hover:border-[#c08aaa]/30 transition-colors ml-2 flex-shrink-0"
                    >
                      Reutilizar
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {entry.urls.map((url, ii) => (
                      <a
                        key={ii}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover border border-white/10 hover:border-[#c08aaa]/50 transition"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 mt-8">
          <h3 className="text-sm font-semibold text-[#C9A96E] mb-2">Dicas</h3>
          <ul className="text-xs text-[#a0a0b0] space-y-1.5">
            <li>A <strong className="text-[#c08aaa]">identidade</strong> (veu dourado, silhueta, rosto oculto, sem raca) e injectada automaticamente.</li>
            <li>Tu descreves apenas o <strong>cenario</strong>, a <strong>luz</strong> e o <strong>estado de espirito</strong>.</li>
            <li>A Loranne nao tem rosto — o <strong>veu e a identidade</strong>. Prompts com &ldquo;face&rdquo; ou &ldquo;portrait&rdquo; sao evitados.</li>
            <li>Usa <span className="text-[#F5F0E6]">Ctrl+Enter</span> para gerar rapidamente.</li>
            <li>As imagens sao temporarias — descarrega as que quiseres guardar.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
