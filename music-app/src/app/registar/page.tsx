"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegistarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/library`,
      },
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Este email já tem conta. Tenta entrar.");
      } else {
        setError(authError.message);
      }
    } else {
      // Notify admin of new registration (fire and forget)
      fetch("/api/notify-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});

      // Try to auto-login
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (!loginErr) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] flex flex-col items-center justify-center px-6 py-12">
      <div style={{ width: "100%", maxWidth: "24rem" }} className="mx-auto flex flex-col items-center">
      <Link href="/" className="mb-10">
        <Image
          src="/veus_music_favicon-192.png"
          alt="Véus"
          width={64}
          height={64}
          className="h-16 w-16"
        />
      </Link>

      <div className="w-full">
        <h1 className="font-display text-2xl font-semibold text-[#F5F0E6] text-center mb-2">
          Cria a tua conta
        </h1>
        <p className="text-sm text-[#666680] text-center mb-8">
          Guarda favoritos e ouve a tua jornada.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs text-[#a0a0b0] mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="o-teu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-[#a0a0b0] mb-1.5">
              Palavra-passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-sm text-[#F5F0E6] placeholder-[#666680] focus:outline-none focus:border-[#C9A96E]/50 transition-colors"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#666680] hover:text-[#a0a0b0] transition-colors"
                aria-label={showPassword ? "Esconder palavra-passe" : "Mostrar palavra-passe"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 rounded-xl bg-[#C9A96E] text-[#0D0D1A] font-medium text-sm hover:bg-[#d4b87a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "A criar..." : "Criar conta"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#666680]">
            Já tens conta?{" "}
            <Link href="/login" className="text-[#C9A96E] hover:underline">
              Entra aqui
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-[#666680] hover:text-[#a0a0b0] transition-colors"
          >
            Voltar a explorar
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
