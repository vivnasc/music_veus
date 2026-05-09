import MixPageClient from "./MixPageClient";

type Props = {
  searchParams: Promise<{ moods?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: Props) {
  const { moods } = await searchParams;
  const list = (moods || "").split(",").filter(Boolean);
  const title = list.length > 0
    ? `Mix: ${list.map((m) => m[0].toUpperCase() + m.slice(1)).join(" + ")} — Véus`
    : "Mix — Véus";
  return { title };
}

export default async function MixPage({ searchParams }: Props) {
  const { moods } = await searchParams;
  const moodsList = (moods || "").split(",").filter(Boolean);
  return <MixPageClient moods={moodsList} />;
}
