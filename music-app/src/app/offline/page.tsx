import Link from "next/link";
import Image from "next/image";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center px-6 text-center">
      <Image
        src="/veus_music_favicon-192.png"
        alt="Véus"
        width={64}
        height={64}
        className="mb-6 opacity-50"
      />
      <h1 className="font-display text-xl text-[#F5F0E6] mb-2">Sem ligacao</h1>
      <p className="text-sm text-[#666680] mb-8 max-w-xs">
        As faixas que guardaste offline continuam disponiveis na tua biblioteca.
      </p>
      <Link
        href="/library"
        className="px-6 py-3 rounded-full bg-[#C9A96E]/10 text-sm text-[#C9A96E] border border-[#C9A96E]/20 hover:bg-[#C9A96E]/20 transition-colors"
      >
        Ir para a biblioteca
      </Link>
    </div>
  );
}
