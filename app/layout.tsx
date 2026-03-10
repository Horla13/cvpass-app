import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
    icon: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
