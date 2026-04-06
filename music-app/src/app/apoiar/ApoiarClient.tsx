"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const MPESA_NUMBER = "851006473";
const PAYPAL_LINK = "https://paypal.me/vivsaraiva";
const SITE_URL = "https://seteveus.space";

const MZN_AMOUNTS = [100, 250, 500, 1000];
const USD_AMOUNTS = [3, 7, 15, 30];

const IMPACT_MESSAGES: Record<number, string> = {
  3: "Cobre uma hora de produção de áudio.",
  7: "Financia uma faixa nova completa.",
  15: "Paga a masterização de um álbum inteiro.",
  30: "Sustenta um mês de criação musical.",
};

const MZN_IMPACT: Record<number, string> = {
  100: "Ajuda a manter os servidores activos.",
  250: "Cobre uma hora de produção.",
  500: "Financia uma faixa nova.",
  1000: "Sustenta uma semana de criação.",
};

export default function ApoiarClient() {
  const [method, setMethod] = useState<"mpesa" | "paypal" | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedMzn, setSelectedMzn] = useState<number | null>(null);
  const [selectedUsd, setSelectedUsd] = useState<number | null>(null);

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center px-6 py-12">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#C9A96E] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center text-center" style={{ maxWidth: "24rem" }}>
        {/* Back button */}
        <Link
          href="/"
          className="self-start mb-6 flex items-center gap-1.5 text-xs text-[#666680] hover:text-[#a0a0b0] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Voltar
        </Link>

        {/* Logo */}
        <div className="mb-6">
          <Image src="/veus_music_favicon-192.png" alt="Veus" width={48} height={48} />
        </div>

        {/* Star badge */}
        <div className="mb-6 w-16 h-16 rounded-full bg-[#C9A96E]/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </div>

        {/* Message */}
        <h1 className="font-display text-2xl font-bold text-[#F5F0E6] mb-3">
          Apoiar a Loranne
        </h1>
        <p className="text-sm text-[#a0a0b0] leading-relaxed mb-2">
          Toda a música é gratuita. Sempre será.
        </p>
        <p className="text-sm text-[#a0a0b0] leading-relaxed mb-3">
          Não há paywall, não há anúncios, não há truques.
          Apenas uma artista independente a criar com o coração.
        </p>
        <p className="text-sm text-[#F5F0E6]/80 leading-relaxed mb-8">
          Se alguma faixa te tocou, o teu apoio ajuda a criar mais
          e a manter tudo aberto para quem precisar de ouvir.
        </p>

        {/* Supporter benefits */}
        <div className="w-full rounded-2xl bg-[#C9A96E]/5 border border-[#C9A96E]/10 p-4 mb-8">
          <p className="text-[10px] uppercase tracking-widest text-[#C9A96E]/60 mb-3">Quem apoia recebe</p>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="#C9A96E" className="h-3.5 w-3.5 shrink-0">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-sm text-[#F5F0E6]/80">Distintivo de apoiante na conta</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="#C9A96E" className="h-3.5 w-3.5 shrink-0">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-sm text-[#F5F0E6]/80">Acesso antecipado a faixas novas</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="#C9A96E" className="h-3.5 w-3.5 shrink-0">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-sm text-[#F5F0E6]/80">Nome nos créditos (se quiseres)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="#C9A96E" className="h-3.5 w-3.5 shrink-0">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
              <span className="text-sm text-[#F5F0E6]/80">A gratidão eterna da Loranne</span>
            </div>
          </div>
        </div>

        {!method ? (
          <>
            {/* Method selection */}
            <div className="w-full space-y-3 mb-8">
              <button
                onClick={() => setMethod("mpesa")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E21B24]/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[#E21B24]">M</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F5F0E6]">M-Pesa</p>
                  <p className="text-xs text-[#666680]">Moçambique — MZN</p>
                </div>
              </button>

              <button
                onClick={() => setMethod("paypal")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0070BA]/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-[#0070BA]">P</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F5F0E6]">PayPal</p>
                  <p className="text-xs text-[#666680]">Internacional — USD, EUR, BRL</p>
                </div>
              </button>
            </div>
          </>
        ) : method === "mpesa" ? (
          <div className="w-full mb-8">
            <button
              onClick={() => setMethod(null)}
              className="mb-6 text-xs text-[#666680] hover:text-[#a0a0b0]"
            >
              &larr; Voltar
            </button>

            {/* Amount suggestions */}
            <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-3">Valor sugerido (MZN)</p>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {MZN_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedMzn(a)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedMzn === a
                      ? "bg-[#C9A96E]/20 text-[#C9A96E] border border-[#C9A96E]/30"
                      : "bg-white/[0.04] text-[#a0a0b0] border border-white/5 hover:bg-white/[0.08]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            {selectedMzn && MZN_IMPACT[selectedMzn] && (
              <p className="text-xs text-[#C9A96E]/60 mb-4 h-5">{MZN_IMPACT[selectedMzn]}</p>
            )}
            {!selectedMzn && <div className="h-5 mb-4" />}

            {/* MPesa instructions */}
            <div className="w-full rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-left space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-1">Número M-Pesa</p>
                <div className="flex items-center gap-3">
                  <p className="text-xl font-bold text-[#F5F0E6] tracking-wider">{MPESA_NUMBER}</p>
                  <button
                    onClick={() => copyText(MPESA_NUMBER)}
                    className="px-3 py-1 rounded-lg bg-white/5 text-xs text-[#a0a0b0] hover:text-[#F5F0E6] transition-colors"
                  >
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-1">Nome</p>
                <p className="text-sm text-[#F5F0E6]">Vivianne dos Santos</p>
              </div>
              {selectedMzn && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-1">Valor</p>
                  <p className="text-sm text-[#F5F0E6]">{selectedMzn} MZN</p>
                </div>
              )}
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs text-[#666680]">
                  Envia via M-Pesa para o número acima.
                  Qualquer valor é bem-vindo. Obrigada.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full mb-8">
            <button
              onClick={() => setMethod(null)}
              className="mb-6 text-xs text-[#666680] hover:text-[#a0a0b0]"
            >
              &larr; Voltar
            </button>

            {/* Amount suggestions (USD) */}
            <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-3">Valor sugerido (USD)</p>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {USD_AMOUNTS.map(a => (
                <button
                  key={a}
                  onClick={() => setSelectedUsd(a)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedUsd === a
                      ? "bg-[#0070BA]/20 text-[#0070BA] border border-[#0070BA]/30"
                      : "bg-white/[0.04] text-[#a0a0b0] border border-white/5 hover:bg-white/[0.08]"
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>
            {selectedUsd && IMPACT_MESSAGES[selectedUsd] && (
              <p className="text-xs text-[#0070BA]/60 mb-4 h-5">{IMPACT_MESSAGES[selectedUsd]}</p>
            )}
            {!selectedUsd && <div className="h-5 mb-4" />}

            {/* PayPal */}
            <div className="w-full rounded-2xl bg-white/[0.04] border border-white/5 p-5 text-left space-y-4">
              <a
                href={selectedUsd ? `${PAYPAL_LINK}/${selectedUsd}USD` : PAYPAL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-xl bg-[#0070BA] text-white text-sm font-medium text-center transition-all hover:bg-[#005EA6] active:scale-[0.98]"
              >
                {selectedUsd ? `Enviar $${selectedUsd} via PayPal` : "Abrir PayPal"}
              </a>
              <p className="text-xs text-[#666680] text-center">
                Aceita USD, EUR, BRL e outras moedas.
                Qualquer valor. Sem mínimo.
              </p>
            </div>
          </div>
        )}

        {/* Gratitude */}
        <div className="w-full rounded-2xl bg-white/[0.02] border border-white/5 p-5 mb-8">
          <p className="text-xs text-[#666680] italic text-center leading-relaxed">
            &ldquo;Cada nota que escrevo é um pedaço de mim que decido partilhar.
            O teu apoio não paga a música — paga a coragem de continuar.&rdquo;
          </p>
          <p className="text-[10px] text-[#666680] text-center mt-2">— Loranne</p>
        </div>

        {/* Transparency */}
        <div className="w-full mb-8">
          <p className="text-[10px] uppercase tracking-widest text-[#666680] mb-3 text-center">Para onde vai o teu apoio</p>
          <div className="space-y-2">
            {[
              { label: "Produção musical (áudio, masterização)", pct: 40 },
              { label: "Servidores e plataforma", pct: 25 },
              { label: "Distribuição nas plataformas de streaming", pct: 20 },
              { label: "Novas faixas e experiências", pct: 15 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#a0a0b0]">{item.label}</span>
                  <span className="text-[#666680]">{item.pct}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-[#C9A96E]/30"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel to main site */}
        <div className="w-full space-y-3">
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-sm text-center text-[#a0a0b0] hover:text-[#F5F0E6] transition-all"
          >
            Conhecer Os Sete Véus
          </a>
          <Link
            href="/"
            className="block w-full py-3 text-sm text-center text-[#666680] hover:text-[#a0a0b0] transition-colors"
          >
            Voltar a ouvir
          </Link>
        </div>

        {/* Branding */}
        <div className="mt-12 flex items-center gap-2 opacity-40">
          <Image src="/veus_music_favicon-192.png" alt="Veus" width={16} height={16} />
          <span className="text-[10px] text-[#666680] tracking-widest">VEUS BY LORANNE</span>
        </div>
      </div>
    </div>
  );
}
