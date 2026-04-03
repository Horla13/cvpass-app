import { LandingPage } from "@/components/LandingPage";

// SYNC with FAQAccordion items in LandingPage.tsx (section 11)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qu'est-ce qu'un score ATS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Un score ATS mesure la compatibilité de votre CV avec les logiciels de tri automatique (Applicant Tracking Systems) utilisés par les recruteurs. Plus votre score est élevé, plus votre CV a de chances de passer les filtres automatiques et d'être lu par un humain.",
      },
    },
    {
      "@type": "Question",
      name: "Mes données sont-elles protégées ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Il disparaît automatiquement à la fermeture de votre onglet. Aucune donnée personnelle n'est conservée au-delà de votre session.",
      },
    },
    {
      "@type": "Question",
      name: "Est-ce que ça marche avec les CVs Canva ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. CVpass détecte automatiquement si votre CV est au format image et vous guide pour l'exporter correctement. Les CVs créés avec Canva, Word ou tout autre outil sont pris en charge.",
      },
    },
    {
      "@type": "Question",
      name: "Je peux essayer gratuitement ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, votre première analyse est gratuite, sans carte de crédit. Vous obtenez votre score ATS et les 3 premiers problèmes identifiés. Pour un accès complet aux suggestions IA et à l'export PDF, découvrez nos offres payantes.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence avec les autres outils ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les autres scanners ATS vous donnent un score et une liste de problèmes. CVpass va plus loin : pour chaque point faible, l'IA propose une réécriture complète intégrant les mots-clés de votre offre. Vous acceptez ou ignorez — c'est tout.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de temps prend l'analyse ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'analyse complète prend environ 30 secondes. Vous obtenez votre score ATS, la liste des points faibles et les suggestions de réécriture IA en une seule opération. L'export PDF est instantané.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
