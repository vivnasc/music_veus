import { NextResponse } from "next/server";

/**
 * Log new registration. No external notifications — admin sees users in the app.
 * POST /api/notify-register { email }
 */
export async function POST() {
  return NextResponse.json({ ok: true });
}
