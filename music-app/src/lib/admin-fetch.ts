import { supabase } from "./supabase";

/**
 * Fetch wrapper that includes the Supabase access token in the Authorization header.
 * Use this for all admin API calls from client components.
 */
export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, { ...init, headers });
}
