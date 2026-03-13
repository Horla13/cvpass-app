import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs CVpass – Plans et crédits flexibles | Dès 0€",
  description:
    "Commencez gratuitement avec 2 crédits. Pack Coup de pouce à 2,90€ ou Recherche Active dès 8,90€/mois avec -5% de fidélité chaque mois.",
  alternates: {
    canonical: "https://cvpass.fr/pricing",
  },
  openGraph: {
    title: "Tarifs CVpass – Plans et crédits flexibles",
    description: "Analyse ATS gratuite. Pack 4 crédits à 2,90€. Illimité dès 8,90€/mois.",
    url: "https://cvpass.fr/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
