"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const TYPES = [
  { value: "theme", label: "Tema para musica", placeholder: "Ex: Uma musica sobre o medo de ser feliz..." },
  { value: "lyrics", label: "Verso ou letra", placeholder: "Escreve um verso, uma frase, algo que sentes..." },
  { value: "collab", label: "Colaboracao", placeholder: "Tenho uma ideia para fazermos juntas..." },
  { value: "message", label: "Mensagem", placeholder: "Algo que queiras dizer a Loranne..." },
];

export default function InspiraPage() {
  const [type, setType] = useState("theme");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const res = await fetch("/api/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || null, type, content, userId }),
    }).catch(() => null);

    if (res?.ok) setSent(true);
    setLoading(false);
  }

  const currentType = TYPES.find(t => t.value === type) || TYPES[0];

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C9A96E]/10 flex items-center justify-center mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2" className="h-8 w-8">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="font-display text-2xl text-[#F5F0E6] mb-2">Recebido.</h1>
        <p className="text-sm text-[#a0a0b0] mb-8 max-w-xs">
          A Loranne le tudo. Algumas coisas viram musica.
        </p>
        <Link href="/" className="text-sm text-[#C9A96E] hover:underline">
          Voltar a ouvir
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] px-6 py-12">
      <div className="max-w-md mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#666680] hover:text-[#a0a0b0] mb-8">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Image src="/poses/loranne-hero.png" alt="Loranne" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
          <div>
            <h1 className="font-display text-xl text-[#F5F0E6]">Inspira a Loranne</h1>
            <p className="text-xs text-[#666680]">Propoe temas, partilha versos, envia mensagens.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type selector */}
          <div className="flex flex-wrap gap-2">
            {TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  type === t.value
                    ? "bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/30"
                    : "bg-white/5 text-[#a0a0b0] border border-white/5 hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="O teu nome (opcional)"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={currentType.placeholder}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50 resize-y leading-relaxed"
          />

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full py-3 rounded-xl bg-[#C9A96E] text-[#0D0D1A] font-medium text-sm hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
          >
            {loading ? "A enviar..." : "Enviar"}
          </button>

          <p className="text-[10px] text-[#666680] text-center">
            A Loranne le tudo. Nem tudo vira musica, mas tudo inspira.
          </p>
        </form>
      </div>
    </div>
  );
}
