import Link from "next/link";
import Image from "next/image";
import {
  PRESENCA_SUBS,
  PRESENCA_SUB_META,
  getAlbumsForSub,
  presencaSubCoverUrl,
  type PresencaSubSlug,
} from "@/data/presenca";

export const metadata = {
  title: "Presença — Loranne & Ancient Ground",
  description:
    "Sete sub-colecções de meditação cantada. Voz Loranne, instrumental Ancient Ground.",
};

export default function PresencaLandingPage() {
  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          <Link
            href="/descobre"
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/5"
            aria-label="Voltar"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Presença</h1>
            <p className="text-[11px] text-[#a0a0b0]">
              Loranne · Ancient Ground · sob Veus
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-10">
        {/* Manifesto curto */}
        <section className="space-y-3 max-w-2xl">
          <p className="text-sm leading-relaxed text-[#c9c9d4]">
            Uma coleção de meditação cantada. Sete sub-colecções, cada uma
            respondendo a uma necessidade humana concreta — enraizar, acolher,
            acender, clarear, alinhar, ver, pousar.
          </p>
          <p className="text-xs leading-relaxed text-[#8a8a9a]">
            49 álbuns × 7 faixas = 343 mantras. Cadência: 1-2 álbuns por mês.
            Não vai para Apple Music nem DistroKid. Vive aqui e no YouTube.
          </p>
        </section>

        {/* 7 sub-colecções */}
        <section>
          <h2 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-4">
            As 7 sub-colecções
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESENCA_SUBS.map((sub) => {
              const meta = PRESENCA_SUB_META[sub.slug];
              const albumsWritten = getAlbumsForSub(sub.slug).length;
              return (
                <Link
                  key={sub.slug}
                  href={`/presenca/${sub.slug}`}
                  className="group block rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition"
                  style={{ background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}0d)` }}
                >
                  <div
                    className="aspect-[4/3] relative"
                    style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}33)` }}
                  >
                    <Image
                      src={presencaSubCoverUrl(sub.slug)}
                      alt={sub.label}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 transition"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">
                        {meta.verbo}
                      </p>
                      <h3 className="text-2xl font-semibold text-white drop-shadow">
                        {sub.label}
                      </h3>
                      <p className="text-[11px] text-white/80 mt-1">
                        {meta.paraQuando}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between text-[11px] text-[#a0a0b0]">
                    <span>{sub.albumCount} álbuns previstos</span>
                    {albumsWritten > 0 && (
                      <span className="text-[#C9A96E]">{albumsWritten} escritos</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
