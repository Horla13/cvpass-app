import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";

import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVpass — Scanner CV ATS gratuit | Optimise ton CV en ligne avec l'IA",
  description:
    "CVpass analyse ton CV, calcule ton score ATS et corrige chaque point faible avec l'IA. Scanner gratuit, compatible PDF et Word. Résultats en 30 secondes.",
  keywords: [
    "scanner ATS", "optimiser CV", "score ATS", "CV ATS France",
    "analyse CV IA", "CV compatible ATS", "améliorer CV",
    "mots-clés CV", "CV Canva ATS", "correction CV automatique",
    "scanner CV ATS", "analyser CV en ligne gratuit", "correction CV IA",
    "optimisation CV recruteur", "passer les ATS recrutement",
    "améliorer CV ATS", "score ATS CV",
  ],
  metadataBase: new URL("https://cvpass.fr"),
  openGraph: {
    title: "CVpass — Scanner CV ATS gratuit | Optimise ton CV avec l'IA",
    description:
      "CVpass analyse ton CV, calcule ton score ATS et corrige chaque point faible avec l'IA. Scanner gratuit, compatible PDF et Word. Résultats en 30 secondes.",
    url: "https://cvpass.fr",
    siteName: "CVpass",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVpass — Scanner CV ATS gratuit | Optimise ton CV avec l'IA",
    description:
      "CVpass analyse ton CV, calcule ton score ATS et corrige chaque point faible avec l'IA. Scanner gratuit, compatible PDF et Word. Résultats en 30 secondes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#16a34a",
  },
  verification: {},
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "CVpass",
      url: "https://cvpass.fr",
      logo: "https://cvpass.fr/icon.png",
      description: "Scanner IA gratuit pour optimiser votre CV et passer les filtres ATS des recruteurs en France.",
      sameAs: [
        "https://www.linkedin.com/in/giovanni-russo-a0b437300/",
        "https://www.instagram.com/cvpass.fr/",
      ],
    },
    {
      "@type": "WebSite",
      name: "CVpass",
      url: "https://cvpass.fr",
      description: "Scanner IA gratuit : analyse ton CV, calcule ton score ATS et réécrit automatiquement chaque point faible.",
      inLanguage: "fr",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://cvpass.fr/blog?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "CVpass",
      url: "https://cvpass.fr",
      description: "Scanner CV ATS gratuit propulsé par l'IA. Analyse, score et réécriture automatique de votre CV pour passer les filtres ATS.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", price: "0", priceCurrency: "EUR", name: "Gratuit", url: "https://cvpass.fr/pricing", availability: "https://schema.org/InStock" },
        { "@type": "Offer", price: "2.90", priceCurrency: "EUR", name: "Coup de pouce", url: "https://cvpass.fr/pricing", availability: "https://schema.org/InStock" },
        { "@type": "Offer", price: "8.90", priceCurrency: "EUR", name: "Recherche Active", url: "https://cvpass.fr/pricing", availability: "https://schema.org/InStock", priceSpecification: { "@type": "UnitPriceSpecification", price: "8.90", priceCurrency: "EUR", unitText: "MONTH" } },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakarta.variable} ${dmSans.variable} antialiased`}>
        <ClerkProvider localization={frFR}>
          <PostHogProvider>
              {children}
          </PostHogProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
