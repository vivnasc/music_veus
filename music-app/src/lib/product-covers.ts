/**
 * Hero cover for a collection (product). Optional — falls back to album-derived
 * cover if not uploaded. Stored in `audios/product-covers/{slug}.jpg`.
 */

export const PRODUCT_SLUGS = [
  "espelho", "no", "curso", "livro", "incenso", "eter",
  "nua", "sangue", "fibra", "grao", "mare",
] as const;

export type ProductSlug = (typeof PRODUCT_SLUGS)[number];

export const PRODUCT_LABELS: Record<ProductSlug, { pt: string; en: string; sub: string }> = {
  espelho: { pt: "Espelhos", en: "Mirrors", sub: "A transformação interior — os 7 véus" },
  no: { pt: "Nós", en: "Knots", sub: "Entre duas pessoas — os 7 nós" },
  curso: { pt: "Cursos", en: "Courses", sub: "Escola dos Véus" },
  livro: { pt: "Livro", en: "Book", sub: "Livro filosófico" },
  incenso: { pt: "Incenso", en: "Incense", sub: "O fumo que sobe — o sagrado sem nome" },
  eter: { pt: "Éter", en: "Ether", sub: "O invisível que se sente" },
  nua: { pt: "Nua", en: "Bare", sub: "A nudez emocional do amor" },
  sangue: { pt: "Sangue", en: "Blood", sub: "O que não se escolhe, o que se herda" },
  fibra: { pt: "Fibra", en: "Fiber", sub: "O corpo que insiste" },
  grao: { pt: "Grão", en: "Grain", sub: "O pequeno que faz o todo" },
  mare: { pt: "Maré", en: "Tide", sub: "O que vai e volta" },
};

export function productCoverUrl(product: ProductSlug, version?: number): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const v = version ?? 1;
  return `${base}/storage/v1/object/public/audios/product-covers/${product}.jpg?v=${v}`;
}
