import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

/**
 * Rename a folder in Supabase Storage by copying all files and deleting originals.
 * POST /api/admin/rename-folder { from: "old-slug", to: "new-slug" }
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = auth.supabase;

  try {
    const { from, to } = await req.json();
    if (!from || !to) {
      return NextResponse.json({ erro: "from e to obrigatórios." }, { status: 400 });
    }

    // List all files in source folder
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET)
      .list(from, { limit: 200 });

    if (listError) {
      return NextResponse.json({ erro: listError.message }, { status: 500 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ erro: `Pasta "${from}" vazia ou não existe.` }, { status: 404 });
    }

    const results: string[] = [];

    for (const file of files) {
      if (!file.name) continue;

      const srcPath = `${from}/${file.name}`;
      const destPath = `${to}/${file.name}`;

      // Download file
      const { data: blob, error: dlError } = await supabase.storage
        .from(BUCKET)
        .download(srcPath);

      if (dlError || !blob) {
        results.push(`SKIP ${file.name}: ${dlError?.message || "empty"}`);
        continue;
      }

      // Upload to new path
      const { error: upError } = await supabase.storage
        .from(BUCKET)
        .upload(destPath, blob, { upsert: true });

      if (upError) {
        results.push(`FAIL ${file.name}: ${upError.message}`);
        continue;
      }

      // Delete original
      await supabase.storage.from(BUCKET).remove([srcPath]);
      results.push(`OK ${file.name}`);
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
