"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SUBSCRIPTION_PRICE } from "@/hooks/useSubscription";
import { supabase } from "@/lib/supabase";

type Props = {
  onClose: () => void;
  trackTitle?: string;
  albumColor?: string;
};

export default function SubscriptionModal({ onClose, trackTitle, albumColor = "#C9A96E" }: Props) {
  const router = useRouter();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  async function handleSubscribe() {
    if (!userId) {
      router.push("/login");
      return;
    }

    // Payment integration not yet available — show message
    alert("Pagamento ainda não disponível. Contacta viv.saraiva@gmail.com para acesso.");
  }

  const selected = SUBSCRIPTION_PRICE[plan];
  const savings = plan === "yearly"
    ? Math.round((1 - SUBSCRIPTION_PRICE.yearly.amount / (SUBSCRIPTION_PRICE.monthly.amount * 12)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${albumColor}15 0%, #0D0D1A 30%)` }}
      >
        <div className="border border-white/10 rounded-2xl p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#666680] hover:text-[#a0a0b0] transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${albumColor}20` }}
            >
              <svg viewBox="0 0 24 24" fill={albumColor} className="h-8 w-8 opacity-80">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-display text-xl font-semibold text-[#F5F0E6] text-center">
            Veus Music
          </h2>
          {trackTitle && (
            <p className="text-sm text-[#a0a0b0] text-center mt-1">
              Para ouvir "{trackTitle}" e todas as faixas.
            </p>
          )}

          {/* What you get */}
          <div className="mt-6 space-y-3">
            {[
              "175 faixas originais, sem limites",
              "Downloads para ouvir offline",
              "Ritual diário personalizado",
              "Novas faixas a cada lançamento",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" stroke={albumColor} strokeWidth="2" className="h-4 w-4 shrink-0">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-sm text-[#F5F0E6]/80">{item}</span>
              </div>
            ))}
          </div>

          {/* Plan picker */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlan("monthly")}
              className={`p-3 rounded-xl border text-left transition-colors ${
                plan === "monthly"
                  ? "border-[#C9A96E]/50 bg-[#C9A96E]/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <p className="text-xs text-[#666680]">Mensal</p>
              <p className="text-lg font-semibold text-[#F5F0E6] mt-0.5">$4.99</p>
              <p className="text-[10px] text-[#666680]">por mês</p>
            </button>
            <button
              onClick={() => setPlan("yearly")}
              className={`p-3 rounded-xl border text-left transition-colors relative ${
                plan === "yearly"
                  ? "border-[#C9A96E]/50 bg-[#C9A96E]/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {savings > 0 && (
                <span className="absolute -top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-[#C9A96E] text-[#0D0D1A] font-semibold">
                  -{savings}%
                </span>
              )}
              <p className="text-xs text-[#666680]">Anual</p>
              <p className="text-lg font-semibold text-[#F5F0E6] mt-0.5">$39.99</p>
              <p className="text-[10px] text-[#666680]">$3.33/mês</p>
            </button>
          </div>

          {/* Subscribe button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-full text-sm font-semibold text-[#0D0D1A] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: albumColor }}
          >
            {loading ? "A processar..." : userId ? `Subscrever — ${selected.label}` : "Iniciar sessão para subscrever"}
          </button>

          {/* Fine print */}
          <p className="text-[10px] text-[#666680] text-center mt-3">
            Cancela a qualquer momento. A primeira faixa de cada álbum é sempre gratuita.
          </p>
        </div>
      </div>
    </div>
  );
}
