"use client";

import Link from "next/link";

type AdminSection = {
  href: string;
  title: string;
  subtitle: string;
  emoji: string;
  group: "produzir" | "publicar" | "capas" | "outras";
};

const SECTIONS: AdminSection[] = [
  // Produzir
  { href: "/admin/producao", title: "Produção", subtitle: "Gerar tracks Suno, gerir personas e clips", emoji: "🎼", group: "produzir" },
  { href: "/admin/nova", title: "Nova", subtitle: "Bulk editor de letras e prompts", emoji: "✍️", group: "produzir" },
  { href: "/admin/venna", title: "VENNA", subtitle: "Wrapper de letras e accent locks", emoji: "🎙", group: "produzir" },
  { href: "/admin/lora", title: "LoRA", subtitle: "Treino e zip de imagens Loranne", emoji: "🧬", group: "produzir" },

  // Publicar
  { href: "/admin/calendario", title: "Calendário", subtitle: "Releases e DistroKid", emoji: "📅", group: "publicar" },
  { href: "/admin/lancamentos", title: "Lançamentos", subtitle: "Estado de cada álbum por semana", emoji: "🚀", group: "publicar" },
  { href: "/admin/shorts", title: "Shorts", subtitle: "Reels e clips para redes", emoji: "🎬", group: "publicar" },

  // Capas
  { href: "/admin/moods", title: "Capas dos 7 moods", subtitle: "Elevar, Aterrar, Acordar, Lembrar, Reunir-se, Respirar, Atravessar", emoji: "🌒", group: "capas" },
  { href: "/admin/coleccoes", title: "Capas das 11 coleções", subtitle: "Incenso, Fibra, Maré, Grão, Nua, Sangue, Espelho, Nó, Éter, Livro, Curso", emoji: "📚", group: "capas" },
  { href: "/admin/fotos", title: "Fotos / Loranne images", subtitle: "Banco de imagens da Loranne", emoji: "📷", group: "capas" },

  // Outras
  { href: "/admin/albums", title: "Álbuns DB", subtitle: "Editar metadata na base de dados", emoji: "💿", group: "outras" },
  { href: "/admin/analytics", title: "Analytics", subtitle: "Plays, top tracks, retenção", emoji: "📊", group: "outras" },
  { href: "/admin/ancient-ground", title: "Ancient Ground", subtitle: "Singles e materiais antigos", emoji: "🪨", group: "outras" },
  { href: "/admin/migrate-slugs", title: "Migrar slugs", subtitle: "Renomear pastas no storage", emoji: "🔧", group: "outras" },
];

const GROUP_TITLES: Record<AdminSection["group"], string> = {
  produzir: "Produzir",
  publicar: "Publicar",
  capas: "Capas (upload Midjourney)",
  outras: "Base e operações",
};

export default function AdminIndexPage() {
  const groups: AdminSection["group"][] = ["produzir", "publicar", "capas", "outras"];

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-[#F5F0E6] pb-32">
      <div className="sticky top-0 z-20 bg-[#0D0D1A]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3 max-w-screen-lg mx-auto">
          <Link href="/" className="p-1.5 rounded-lg hover:bg-white/5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold">Admin Loranne</h1>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-4 py-6 space-y-8">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="text-xs uppercase tracking-widest text-mundo-muted mb-3">{GROUP_TITLES[group]}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SECTIONS.filter((s) => s.group === group).map((s) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0" aria-hidden>{s.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-mundo-creme">{s.title}</p>
                      <p className="text-[11px] text-mundo-muted leading-snug mt-0.5">{s.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
