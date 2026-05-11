"use client";

import { useState } from "react";

export function TrackPromptCopy({
  trackTitle,
  sunoPrompt,
  style,
}: {
  trackTitle: string;
  sunoPrompt: string;
  style: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"prompt" | "style" | null>(null);

  async function copy(text: string, which: "prompt" | "style") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  return (
    <div>
      <div className="px-4 py-2 flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#c9c9d4] transition"
        >
          {open ? "Esconder prompt" : "Ver prompt Suno"}
        </button>
        <button
          onClick={() => copy(sunoPrompt, "prompt")}
          className="text-[11px] px-3 py-1.5 rounded-full bg-[#C9A96E]/15 hover:bg-[#C9A96E]/25 text-[#C9A96E] transition"
        >
          {copied === "prompt" ? "Copiado" : "Copiar lyrics"}
        </button>
        {style && (
          <button
            onClick={() => copy(style, "style")}
            className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#c9c9d4] transition"
            title={`Style para Suno — ${trackTitle}`}
          >
            {copied === "style" ? "Copiado" : "Copiar style"}
          </button>
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <pre className="text-[11px] leading-relaxed text-[#c9c9d4] whitespace-pre-wrap bg-black/30 rounded-lg p-3 border border-white/5 overflow-x-auto">
{sunoPrompt}
          </pre>
          {style && (
            <div>
              <p className="text-[9px] uppercase tracking-widest text-[#8a8a9a] mb-1">Style</p>
              <p className="text-[11px] leading-relaxed text-[#a0a0b0] bg-black/20 rounded-lg p-3 border border-white/5">
                {style}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
