import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { ADMIN_EMAIL } from "@/lib/admin-auth";

/**
 * Analytics for the music app — excludes admin plays.
 * GET /api/admin/analytics
 *
 * Returns:
 * - topTracks: most listened tracks (by total listens across all non-admin users)
 * - topFavorited: most favorited tracks
 * - topPlaylisted: tracks in most playlists
 * - totalListeners: unique non-admin users who played anything
 * - totalPlays: total listens (non-admin)
 * - recentListeners: users active in last 7 days
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  try {
    // Get admin user ID to exclude
    const { data: adminUsers } = await supabase
      .from("music_listening_stats")
      .select("user_id")
      .limit(1);

    // Find admin user_id by checking auth.users
    const { data: allUsers } = await supabase.auth.admin.listUsers({ perPage: 500 });
    const adminUserId = allUsers?.users?.find(u => u.email === ADMIN_EMAIL)?.id;

    // ── Top tracks by total listens (excluding admin) ──
    const { data: stats } = await supabase
      .from("music_listening_stats")
      .select("album_slug, track_number, listen_count, user_id, last_listened_at")
      .order("listen_count", { ascending: false });

    const nonAdminStats = (stats || []).filter(s => s.user_id !== adminUserId);

    // Aggregate per track
    const trackMap = new Map<string, { album_slug: string; track_number: number; total_listens: number; unique_listeners: number; last_listened: string }>();
    for (const s of nonAdminStats) {
      const key = `${s.album_slug}:${s.track_number}`;
      const existing = trackMap.get(key);
      if (existing) {
        existing.total_listens += s.listen_count;
        existing.unique_listeners += 1;
        if (s.last_listened_at > existing.last_listened) existing.last_listened = s.last_listened_at;
      } else {
        trackMap.set(key, {
          album_slug: s.album_slug,
          track_number: s.track_number,
          total_listens: s.listen_count,
          unique_listeners: 1,
          last_listened: s.last_listened_at,
        });
      }
    }
    const topTracks = [...trackMap.values()]
      .sort((a, b) => b.total_listens - a.total_listens)
      .slice(0, 30);

    // ── Top favorited tracks (excluding admin) ──
    const { data: favorites } = await supabase
      .from("music_favorites")
      .select("album_slug, track_number, user_id");

    const nonAdminFavs = (favorites || []).filter(f => f.user_id !== adminUserId);
    const favMap = new Map<string, { album_slug: string; track_number: number; count: number }>();
    for (const f of nonAdminFavs) {
      const key = `${f.album_slug}:${f.track_number}`;
      const existing = favMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        favMap.set(key, { album_slug: f.album_slug, track_number: f.track_number, count: 1 });
      }
    }
    const topFavorited = [...favMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    // ── Tracks in most playlists (excluding admin) ──
    const { data: playlists } = await supabase
      .from("music_playlists")
      .select("id, user_id")
      .neq("user_id", adminUserId || "");

    const playlistIds = (playlists || []).map(p => p.id);
    let topPlaylisted: { album_slug: string; track_number: number; count: number }[] = [];

    if (playlistIds.length > 0) {
      const { data: playlistTracks } = await supabase
        .from("music_playlist_tracks")
        .select("album_slug, track_number, playlist_id")
        .in("playlist_id", playlistIds);

      const plMap = new Map<string, { album_slug: string; track_number: number; count: number }>();
      for (const pt of playlistTracks || []) {
        const key = `${pt.album_slug}:${pt.track_number}`;
        const existing = plMap.get(key);
        if (existing) existing.count += 1;
        else plMap.set(key, { album_slug: pt.album_slug, track_number: pt.track_number, count: 1 });
      }
      topPlaylisted = [...plMap.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);
    }

    // ── Summary stats ──
    const uniqueListeners = new Set(nonAdminStats.map(s => s.user_id)).size;
    const totalPlays = nonAdminStats.reduce((sum, s) => sum + s.listen_count, 0);

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const recentListeners = new Set(
      nonAdminStats.filter(s => s.last_listened_at >= sevenDaysAgo).map(s => s.user_id)
    ).size;

    // ── WhatsApp release subscribers (list + count) ──
    let subscriberCount = 0;
    let whatsappSubscribers: { whatsapp: string; name: string | null; subscribed_at: string }[] = [];
    try {
      const { data: subs, count } = await supabase
        .from("music_album_subscribers")
        .select("whatsapp, name, subscribed_at", { count: "exact" })
        .eq("active", true)
        .order("subscribed_at", { ascending: false })
        .limit(200);
      subscriberCount = count || 0;
      whatsappSubscribers = subs || [];
    } catch { /* table may not exist */ }

    // ── Registered users (auth.users, excluding admin) ──
    const registeredUsers = (allUsers?.users || [])
      .filter(u => u.email !== ADMIN_EMAIL)
      .map(u => ({
        id: u.id,
        email: u.email || "",
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
      }))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    const userEmailById = new Map(registeredUsers.map(u => [u.id, u.email]));

    // ── Push subscribers (count only — endpoint isn't user-friendly) ──
    let pushSubscriberCount = 0;
    try {
      const { count } = await supabase
        .from("push_subscriptions")
        .select("*", { count: "exact", head: true });
      pushSubscriberCount = count || 0;
    } catch { /* table may not exist */ }

    // ── Paid subscribers (Veus Music) ──
    let paidSubscribers: { user_id: string; email: string; plan: string; status: string; expires_at: string | null; started_at: string }[] = [];
    try {
      const { data: paid } = await supabase
        .from("music_subscriptions")
        .select("user_id, plan, status, expires_at, started_at")
        .neq("status", "expired")
        .order("started_at", { ascending: false });
      paidSubscribers = (paid || []).map(p => ({
        user_id: p.user_id,
        email: userEmailById.get(p.user_id) || "",
        plan: p.plan,
        status: p.status,
        expires_at: p.expires_at,
        started_at: p.started_at,
      }));
    } catch { /* table may not exist */ }

    // ── Supporters (donations) ──
    let supporters: { user_id: string; email: string; tier: string | null; created_at: string }[] = [];
    try {
      const { data: sup } = await supabase
        .from("music_supporters")
        .select("user_id, tier, created_at")
        .order("created_at", { ascending: false });
      supporters = (sup || []).map(s => ({
        user_id: s.user_id,
        email: userEmailById.get(s.user_id) || "",
        tier: s.tier,
        created_at: s.created_at,
      }));
    } catch { /* table may not exist */ }

    return NextResponse.json({
      topTracks,
      topFavorited,
      topPlaylisted,
      totalListeners: uniqueListeners,
      totalPlays,
      recentListeners,
      subscriberCount,
      registeredUsers,
      whatsappSubscribers,
      pushSubscriberCount,
      paidSubscribers,
      supporters,
    });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
