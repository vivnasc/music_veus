"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * Browsing and playback are open (anon users get a 3-track soft-wall via
 * the music player). Only personal/admin areas require an account.
 */

const PROTECTED_ROUTES = ["/conta", "/library", "/upload", "/admin"];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  const isPublic = !PROTECTED_ROUTES.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (isPublic) {
      setChecked(true);
      setAuthed(true);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthed(true);
      } else {
        router.replace("/login");
      }
      setChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthed(true);
      } else if (!isPublic) {
        router.replace("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, isPublic, router]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D1A]">
        <div className="w-6 h-6 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed && !isPublic) return null;

  return <>{children}</>;
}
