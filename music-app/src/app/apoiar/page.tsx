import type { Metadata } from "next";
import ApoiarClient from "./ApoiarClient";

export const metadata: Metadata = {
  title: "Apoiar a Loranne — Véus",
  description: "A música é gratuita. Se te tocou, podes apoiar.",
};

export default function ApoiarPage() {
  return <ApoiarClient />;
}
