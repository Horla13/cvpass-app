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
  title: "CVpass – Optimise ton CV pour les ATS en 1 clic | Scanner IA gratuit",
  description:
    "CVpass analyse ton CV, calcule ton score ATS et réécrit automatiquement chaque point faible. Gratuit. Compatible PDF et Word. Résultats en 30 secondes.",
  keywords: [
    "scanner ATS", "optimiser CV", "score ATS", "CV ATS France",
    "analyse CV IA", "CV compatible ATS", "améliorer CV",
    "mots-clés CV", "CV Canva ATS", "correction CV automatique",
  ],
  metadataBase: new URL("https://cvpass.fr"),
  alternates: {
    canonical: "https://cvpass.fr",
  },
  openGraph: {
    title: "CVpass – Optimise ton CV pour les ATS en 1 clic",
    description:
      "CVpass analyse ton CV, calcule ton score ATS et réécrit automatiquement chaque point faible. Gratuit. Compatible PDF et Word.",
    url: "https://cvpass.fr",
    siteName: "CVpass",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVpass – Optimise ton CV pour les ATS en 1 clic",
    description:
      "Scanner IA gratuit : analyse ton CV, calcule ton score ATS et réécrit automatiquement chaque point faible.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
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
