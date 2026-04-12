import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimiseur LinkedIn gratuit — Optimisez votre profil | CVpass",
  description: "Analysez votre profil LinkedIn et obtenez un titre, un resume et des competences optimises pour les recruteurs. En francais, par l IA.",
};

export default function LinkedInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
