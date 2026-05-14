import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PresencaSubPlayer } from "../PresencaSubPlayer";
import { getTrackCoverUrl } from "@/lib/album-covers";
import {
  PRESENCA_SUBS,
  PRESENCA_SUB_META,
  getSub,
  getAlbumsForSub,
  presencaSubCoverUrl,
  type PresencaSubSlug,
} from "@/data/presenca";

export function generateStaticParams() {
  return PRESENCA_SUBS.map((s) => ({ sub: s.slug }));
}

type Params = { params: Promise<{ sub: string }> };

export default async function PresencaSubPage({ params }: Params) {
  const { sub: subParam } = await params;
  const sub = getSub(subParam);
  if (!sub) notFound();
  const meta = PRESENCA_SUB_META[sub.slug as PresencaSubSlug];
  const albums = getAlbumsForSub(sub.slug);
  const totalSlots = sub.albumCount;

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          <Link href="/presenca" className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/5" aria-label="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{sub.label}</h1>
            <p className="text-[11px] text-[#a0a0b0]">Presença · {meta.verbo}</p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative px-4 pt-8 pb-10"
        style={{ background: `linear-gradient(180deg, ${meta.color}22, transparent 80%)` }}
      >
        <div className="max-w-screen-lg mx-auto grid sm:grid-cols-[200px_1fr] gap-6 items-center">
          <div
            className="aspect-square rounded-2xl overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}33)` }}
          >
            <Image
              src={presencaSubCoverUrl(sub.slug as PresencaSubSlug)}
              alt={sub.label}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-[#a0a0b0] mb-1">{meta.verbo}</p>
            <h2 className="text-3xl font-semibold mb-3">{sub.label}</h2>
            <p className="text-sm text-[#c9c9d4] leading-relaxed">{sub.funcao}</p>
            <p className="text-[11px] text-[#8a8a9a] mt-2">{meta.paraQuando}.</p>

            {/* Identidade técnica */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              {sub.instrumental && (
                <>
                  <Box label="Sons">{sub.instrumental.sounds}</Box>
                  <Box label="Tom">{sub.instrumental.key}</Box>
                  <Box label="BPM">{sub.instrumental.bpm}</Box>
                </>
              )}
              {sub.layers?.solfeggio && <Box label="Solfeggio">{sub.layers.solfeggio}</Box>}
            </div>

            {/* Tocar tudo / Aleatório / Adicionar a playlist — sub-coleção inteira */}
            <PresencaSubPlayer
              subSlug={sub.slug as PresencaSubSlug}
              subLabel={sub.label}
              accentColor={meta.color}
            />
          </div>
        </div>
      </section>

      {/* Albums */}
      <section className="max-w-screen-lg mx-auto px-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider">
            Álbuns
          </h3>
          <p className="text-[11px] text-[#666680]">
            {albums.length} de {totalSlots} previstos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => {
            const approved = album.tracks.filter((t) => t.flag === "aprovada").length;
            const written = album.tracks.filter((t) => t.sunoPrompt).length;
            return (
              <Link
                key={album.slug}
                href={`/presenca/${sub.slug}/${album.slug}`}
                className="group block rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition"
              >
                <div
                  className="aspect-[5/4] relative"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}33)` }}
                >
                  <Image
                    src={getTrackCoverUrl(`presenca-${sub.slug}-${album.slug}`, 1)}
                    alt={album.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-90 transition"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <p className="text-[10px] uppercase tracking-widest text-white/60">
                      Álbum {album.number} · {sub.label}
                    </p>
                    <h4 className="text-2xl font-semibold text-white mt-1 drop-shadow">{album.title}</h4>
                    {album.funcao && (
                      <p className="text-[11px] text-white/75 mt-1 line-clamp-2">{album.funcao}</p>
                    )}
                  </div>
                </div>
                <div className="px-4 py-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#a0a0b0]">{written}/7 escritas</span>
                  {approved > 0 && (
                    <span className="text-green-400">{approved} aprovada{approved > 1 ? "s" : ""}</span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Placeholders for unwritten albums */}
          {Array.from({ length: Math.max(0, totalSlots - albums.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="rounded-xl border border-dashed border-white/10 p-6 flex items-center justify-center min-h-[180px]"
            >
              <span className="text-[11px] text-[#666680]">
                Álbum {albums.length + i + 1} · por escrever
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Box({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-2 border border-white/5">
      <p className="text-[9px] uppercase tracking-widest text-[#8a8a9a]">{label}</p>
      <p className="text-[11px] text-[#e5e5ec] mt-0.5 line-clamp-2">{children}</p>
    </div>
  );
}
