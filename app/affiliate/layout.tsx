import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programme affilié CVpass — 30% de commission + -15% pour vos filleuls",
  description: "Devenez affilié CVpass : gagnez 30% de commission sur chaque vente. Vos filleuls reçoivent -15% automatiquement. Inscription gratuite, paiement mensuel.",
  alternates: { canonical: "https://cvpass.fr/affiliate/join" },
  openGraph: {
    title: "Programme affilié CVpass — 30% de commission",
    description: "Gagnez 30% de commission en recommandant CVpass. Vos filleuls obtiennent -15% automatiquement.",
    url: "https://cvpass.fr/affiliate/join",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programme affilié CVpass — 30% de commission",
    description: "Gagnez 30% de commission en recommandant CVpass. Vos filleuls obtiennent -15% automatiquement.",
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
