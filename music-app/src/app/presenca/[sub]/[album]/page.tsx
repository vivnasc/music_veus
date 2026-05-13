import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  PRESENCA_SUBS,
  PRESENCA_SUB_META,
  getSub,
  getAlbum,
  getAlbumsForSub,
  presencaAlbumCoverUrl,
  type PresencaSubSlug,
} from "@/data/presenca";
import { TrackPromptCopy } from "./TrackPromptCopy";
import { PresencaAlbumActions } from "../../PresencaAlbumActions";

export function generateStaticParams() {
  const params: { sub: string; album: string }[] = [];
  for (const sub of PRESENCA_SUBS) {
    for (const album of getAlbumsForSub(sub.slug)) {
      params.push({ sub: sub.slug, album: album.slug });
    }
  }
  return params;
}

type Params = { params: Promise<{ sub: string; album: string }> };

export default async function PresencaAlbumPage({ params }: Params) {
  const { sub: subParam, album: albumParam } = await params;
  const sub = getSub(subParam);
  if (!sub) notFound();
  const album = getAlbum(sub.slug as PresencaSubSlug, albumParam);
  if (!album) notFound();
  const meta = PRESENCA_SUB_META[sub.slug as PresencaSubSlug];

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          <Link href={`/presenca/${sub.slug}`} className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/5" aria-label="Voltar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate">{album.title}</h1>
            <p className="text-[11px] text-[#a0a0b0]">
              {sub.label} · Álbum {album.number}
            </p>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative px-4 pt-8 pb-8"
        style={{ background: `linear-gradient(180deg, ${meta.color}22, transparent 80%)` }}
      >
        <div className="max-w-screen-lg mx-auto grid sm:grid-cols-[220px_1fr] gap-6 items-start">
          <div
            className="aspect-square rounded-2xl overflow-hidden relative"
            style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}33)` }}
          >
            <Image
              src={presencaAlbumCoverUrl(sub.slug as PresencaSubSlug, album.slug)}
              alt={album.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#a0a0b0]">
              {sub.label} · {meta.verbo} · Álbum {album.number}
            </p>
            <h2 className="text-3xl font-semibold mt-1">{album.title}</h2>
            {album.funcao && (
              <p className="text-sm text-[#c9c9d4] mt-3 leading-relaxed">{album.funcao}</p>
            )}
            {album.horaInterior && (
              <p className="text-[11px] text-[#8a8a9a] mt-2">
                Hora interior: {album.horaInterior}
              </p>
            )}

            {/* Acções do álbum — mesmas ferramentas que a sub-coleção e os
                álbuns standard: Ouvir · Aleatório · Tocar a seguir · Playlist */}
            <PresencaAlbumActions
              subSlug={sub.slug as PresencaSubSlug}
              albumSlug={album.slug}
              albumTitle={album.title}
              accentColor={meta.color}
            />
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-screen-lg mx-auto px-4 mt-4 space-y-3">
        <h3 className="text-sm font-semibold text-[#a0a0b0] uppercase tracking-wider mb-1">
          7 faixas — arco ritual
        </h3>
        {album.tracks.map((track) => (
          <article
            key={track.number}
            className="rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden"
          >
            <header className="px-4 py-3 flex items-start justify-between gap-3 border-b border-white/5">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-[#8a8a9a]">
                  {album.number}.{track.number} · {track.position}
                </p>
                <h4 className="text-base font-semibold mt-0.5 text-[#F5F0E6]">{track.title}</h4>
                {track.concept && (
                  <p className="text-[12px] text-[#a0a0b0] mt-1 leading-relaxed">{track.concept}</p>
                )}
              </div>
              {track.flag === "aprovada" && (
                <span className="shrink-0 text-[10px] uppercase tracking-widest bg-green-500/15 text-green-400 px-2 py-1 rounded-full">
                  aprovada
                </span>
              )}
            </header>

            {track.sunoPrompt && (
              <TrackPromptCopy
                trackTitle={track.title}
                sunoPrompt={track.sunoPrompt}
                style={track.style}
              />
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
