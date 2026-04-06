import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import webpush from "web-push";

/**
 * Send push notification to all subscribers.
 * POST /api/admin/push-notify { title, body, url? }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ erro: "VAPID keys nao configuradas." }, { status: 500 });
  }

  try {
    const { title, body, url } = await req.json();
    if (!title || !body) {
      return NextResponse.json({ erro: "title e body obrigatorios." }, { status: 400 });
    }

    webpush.setVapidDetails("mailto:viv.saraiva@gmail.com", vapidPublic, vapidPrivate);

    const { data: subs, error } = await auth.supabase
      .from("push_subscriptions")
      .select("endpoint, keys");

    if (error) {
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    const payload = JSON.stringify({ title, body, url: url || "/" });
    let sent = 0;
    let failed = 0;

    for (const sub of subs || []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        );
        sent++;
      } catch {
        failed++;
        // Remove invalid subscriptions
        await auth.supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      }
    }

    return NextResponse.json({ ok: true, sent, failed });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
