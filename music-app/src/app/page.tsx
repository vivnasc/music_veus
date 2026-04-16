import FraseDoDia from "@/components/music/FraseDoDia";
import TopTracksSection from "@/components/music/TopTracksSection";
import RecentlyPlayedSection from "@/components/music/RecentlyPlayedSection";
import ParaTiSection from "@/components/music/ParaTiSection";
import NovidadesSection from "@/components/music/NovidadesSection";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/music/NavBar";
import SubscribeSection from "@/components/music/SubscribeSection";
import LiveReviewsFeed from "@/components/music/LiveReviewsFeed";
import OutrosMundosSection from "@/components/music/OutrosMundosSection";

export const metadata = {
  title: "Explorar",
  description: "A banda sonora da tua transformação. Música original de Loranne.",
};

export default function MusicHomePage() {
  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Hero — minimal */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/Loranne.png" alt="" fill className="object-cover object-top opacity-30 blur-[2px]" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D1A]/50 to-[#0D0D1A]" />
        </div>
        <div className="relative flex flex-col items-center text-center px-6 pt-6 pb-8">
          <Image src="/Loranne.png" alt="Loranne" width={200} height={250} className="h-36 w-auto rounded-2xl shadow-2xl ring-1 ring-white/10" priority />
          <Image src="/veus_music_favicon-192.png" alt="Véus" width={40} height={40} className="h-10 w-10 mt-4" />
          <p className="mt-1 font-display text-xl font-semibold text-[#F5F0E6] tracking-[0.2em]">VÉUS</p>
          <p className="mt-1 text-xs text-[#C9A96E] tracking-widest font-display">by Loranne</p>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-6 space-y-10 pb-32">

        <FraseDoDia />
        <RecentlyPlayedSection />
        <ParaTiSection />
        <NovidadesSection />
        <TopTracksSection />

        <OutrosMundosSection />

        <LiveReviewsFeed />

        {/* Subscribe for new releases */}
        <SubscribeSection />

        {/* CTA para explorar — quando não há conteúdo pessoal ainda */}
        <div className="text-center py-6">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 border border-[#C9A96E]/20 rounded-full text-sm text-[#C9A96E] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explorar todo o repertório
          </Link>
        </div>

      </div>
    </div>
  );
}
