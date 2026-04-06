import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Save push subscription for web push notifications.
 * POST /api/push/subscribe { subscription, userId? }
 */
export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json();
    if (!subscription?.endpoint) {
      return NextResponse.json({ erro: "Subscription invalida." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
          user_id: userId || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ erro: "Tabela push_subscriptions nao existe." }, { status: 503 });
      }
      return NextResponse.json({ erro: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
