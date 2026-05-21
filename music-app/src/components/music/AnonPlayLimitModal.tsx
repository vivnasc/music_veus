"use client";

import Image from "next/image";
import Link from "next/link";
import { ANON_PLAY_LIMIT } from "@/contexts/MusicPlayerContext";

type Props = {
  onClose: () => void;
};

export default function AnonPlayLimitModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="anon-limit-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#1A1A2E] border border-[#C9A96E]/30 p-6 shadow-2xl">
        <div className="flex justify-center mb-4">
          <Image src="/veus_music_favicon-192.png" alt="Véus" width={56} height={56} className="h-14 w-14" />
        </div>
        <h2 id="anon-limit-title" className="font-display text-xl font-semibold text-[#F5F0E6] text-center mb-2">
          Já ouviste {ANON_PLAY_LIMIT} faixas.
        </h2>
        <p className="text-sm text-[#a0a0b0] text-center mb-6 leading-relaxed">
          Cria conta gratuita para continuar a ouvir sem limites — e guardar os teus favoritos.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/registar"
            className="w-full text-center px-4 py-3 rounded-xl bg-[#C9A96E] text-[#0D0D1A] text-sm font-semibold hover:bg-[#d4b87a] transition-colors"
          >
            Criar conta gratis
          </Link>
          <Link
            href="/login"
            className="w-full text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] hover:bg-white/10 transition-colors"
          >
            Já tenho conta
          </Link>
          <button
            onClick={onClose}
            className="mt-1 text-xs text-[#666680] hover:text-[#a0a0b0] py-2 transition-colors"
          >
            Continuar a explorar
          </button>
        </div>
      </div>
    </div>
  );
}
