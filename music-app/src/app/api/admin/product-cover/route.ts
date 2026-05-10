import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "audios";

const PRODUCT_SLUGS = [
  "espelho", "no", "curso", "livro", "incenso", "eter",
  "nua", "sangue", "fibra", "grao", "mare",
] as const;

type ProductSlug = (typeof PRODUCT_SLUGS)[number];

function isProductSlug(s: string): s is ProductSlug {
  return (PRODUCT_SLUGS as readonly string[]).includes(s);
}

/**
 * Upload a hero cover for a collection (product).
 * POST /api/admin/product-cover (multipart: productSlug, image)
 * Storage path: product-covers/{slug}.jpg
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const form = await req.formData();
    const productSlug = form.get("productSlug") as string;
    const image = form.get("image") as File;

    if (!productSlug || !image) {
      return NextResponse.json({ erro: "productSlug e image obrigatórios." }, { status: 400 });
    }
    if (!isProductSlug(productSlug)) {
      return NextResponse.json({ erro: `productSlug inválido. Aceitos: ${PRODUCT_SLUGS.join(", ")}` }, { status: 400 });
    }

    const filePath = `product-covers/${productSlug}.jpg`;
    const buffer = Buffer.from(await image.arrayBuffer());

    const { error } = await auth.supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "3600",
      });

    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}?v=${Date.now()}`;
    return NextResponse.json({ ok: true, url: publicUrl, productSlug });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const productSlug = req.nextUrl.searchParams.get("productSlug");
    if (!productSlug) return NextResponse.json({ erro: "productSlug obrigatório." }, { status: 400 });
    const filePath = `product-covers/${productSlug}.jpg`;
    const { error } = await auth.supabase.storage.from(BUCKET).remove([filePath]);
    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { data, error } = await auth.supabase.storage.from(BUCKET).list("product-covers", { limit: 100 });
    if (error) return NextResponse.json({ erro: error.message }, { status: 500 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const covers: Record<string, string | null> = {};
    for (const slug of PRODUCT_SLUGS) {
      const file = (data || []).find((f) => f.name === `${slug}.jpg`);
      covers[slug] = file
        ? `${supabaseUrl}/storage/v1/object/public/${BUCKET}/product-covers/${slug}.jpg?v=${file.updated_at || Date.now()}`
        : null;
    }
    return NextResponse.json({ covers });
  } catch (err: unknown) {
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}
