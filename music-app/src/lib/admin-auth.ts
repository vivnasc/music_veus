import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./supabase-server";

const ADMIN_EMAIL = "viv.saraiva@gmail.com";

export { ADMIN_EMAIL };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = SupabaseClient<any, any, any>;

/**
 * Extract the access token from the request.
 * Checks Authorization header first, then falls back to cookies.
 */
function extractToken(reqOrCookie: NextRequest | string | null): string | null {
  if (reqOrCookie instanceof Request) {
    // Check Authorization: Bearer <token>
    const authHeader = reqOrCookie.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return authHeader.slice(7);
    }
    // Fallback to cookie
    const cookie = reqOrCookie.headers.get("cookie");
    if (cookie) {
      const match = cookie.match(/sb-[^-]+-auth-token=([^;]+)/);
      if (match) {
        try {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          return Array.isArray(parsed) ? parsed[0] : parsed;
        } catch {
          return decodeURIComponent(match[1]);
        }
      }
    }
    return null;
  }
  // Legacy: raw cookie string
  if (typeof reqOrCookie === "string") {
    const match = reqOrCookie.match(/sb-[^-]+-auth-token=([^;]+)/);
    if (match) {
      try {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        return Array.isArray(parsed) ? parsed[0] : parsed;
      } catch {
        return decodeURIComponent(match[1]);
      }
    }
  }
  return null;
}

/**
 * Verify the request comes from the admin user.
 * Accepts NextRequest (reads Authorization header + cookies) or raw cookie string.
 * Returns the Supabase service client if authorized, or a 401/403 response.
 */
export async function requireAdmin(reqOrCookie: NextRequest | string | null): Promise<
  | { ok: true; supabase: AnySupabaseClient }
  | { ok: false; response: NextResponse }
> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { erro: "SUPABASE_SERVICE_ROLE_KEY nao configurada." },
        { status: 500 }
      ),
    };
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!anonKey) {
    return {
      ok: false,
      response: NextResponse.json(
        { erro: "NEXT_PUBLIC_SUPABASE_ANON_KEY nao configurada." },
        { status: 500 }
      ),
    };
  }

  const token = extractToken(reqOrCookie);

  // Create client with the extracted token
  const userClient = createClient(SUPABASE_URL, anonKey, {
    auth: { persistSession: false },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });

  const { data: { user }, error } = await userClient.auth.getUser();

  if (error || !user || user.email !== ADMIN_EMAIL) {
    return {
      ok: false,
      response: NextResponse.json(
        { erro: "Acesso negado. Apenas a administradora pode aceder." },
        { status: 403 }
      ),
    };
  }

  const serviceClient = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false },
  });

  return { ok: true, supabase: serviceClient };
}
