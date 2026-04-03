import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme affilié — Gagnez 50% de commission | CVpass",
  description: "Devenez affilié CVpass et gagnez 50% de commission sur chaque premier achat. Partagez votre lien, gagnez sans limite.",
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
