"use client";

import { useState, useEffect } from "react";

/**
 * Global subscribe section — user gives WhatsApp number once
 * to receive notifications about new releases.
 */
export default function SubscribeSection() {
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("veus-whatsapp");
    if (saved) {
      fetch(`/api/subscribe-releases?whatsapp=${encodeURIComponent(saved)}`)
        .then(r => r.json())
        .then(d => { if (d.subscribed) setSubscribed(true); })
        .catch(() => {})
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    const clean = whatsapp.replace(/[^0-9+]/g, "");
    if (clean.length < 9) return;
    setLoading(true);

    const res = await fetch("/api/subscribe-releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp: clean, name: name || null }),
    }).catch(() => null);

    if (res?.ok) {
      localStorage.setItem("veus-whatsapp", clean);
      setSubscribed(true);
    }
    setLoading(false);
  }

  if (checking) return null;
  if (subscribed) return null;

  return (
    <section className="px-6 py-8">
      <div className="max-w-screen-lg mx-auto rounded-2xl bg-white/[0.02] border border-white/5 p-6">
        <p className="text-sm text-[#F5F0E6] mb-1">Receber novidades</p>
        <p className="text-xs text-[#666680] mb-4">
          Deixa o teu WhatsApp e avisamos quando sair musica nova.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-wrap items-center gap-2">
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="+258 84 ..."
            required
            className="w-40 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
          />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome (opcional)"
            className="w-36 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50"
          />
          <button
            type="submit"
            disabled={loading || whatsapp.replace(/[^0-9+]/g, "").length < 9}
            className="px-5 py-2.5 rounded-xl bg-[#C9A96E] text-[#0D0D1A] text-sm font-medium hover:bg-[#d4b87a] transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Subscrever"}
          </button>
        </form>
      </div>
    </section>
  );
}
