import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs scanner CV ATS — Plans dès 0€ | CVpass",
  description:
    "Analysez votre CV ATS gratuitement. Pack 4 crédits à 2,90€ ou accès illimité dès 8,90€/mois. Prix optimisation CV transparents, sans engagement.",
  alternates: {
    canonical: "https://cvpass.fr/pricing",
  },
  openGraph: {
    title: "Tarifs scanner CV ATS — Plans dès 0€ | CVpass",
    description: "Analysez votre CV ATS gratuitement. Pack 4 crédits à 2,90€ ou accès illimité dès 8,90€/mois.",
    url: "https://cvpass.fr/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarifs scanner CV ATS — Plans dès 0€ | CVpass",
    description: "Analysez votre CV ATS gratuitement. Pack 4 crédits à 2,90€ ou accès illimité dès 8,90€/mois.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
