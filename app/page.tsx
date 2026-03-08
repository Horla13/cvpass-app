import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Importez votre CV",
    description: "Glissez-déposez votre CV en PDF ou DOCX. Traitement instantané.",
  },
  {
    number: "02",
    title: "Collez l'offre d'emploi",
    description:
      "CVpass analyse les mots-clés manquants entre votre CV et le poste visé.",
  },
  {
    number: "03",
    title: "Optimisez en un clic",
    description:
      "Acceptez les suggestions IA et téléchargez votre CV optimisé pour l'ATS.",
  },
];

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-xl font-bold text-brand-black">
          CV<span className="text-brand-green">pass</span>
        </span>
        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm text-brand-gray hover:text-brand-black transition-colors"
          >
            Tarifs
          </Link>
          <Link
            href="/login"
            className="text-sm text-brand-green font-semibold hover:underline"
          >
            Connexion
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-brand-black leading-tight mb-6">
          Votre CV optimisé pour{" "}
          <span className="text-brand-green">passer les filtres ATS</span>
        </h1>
        <p className="text-xl text-brand-gray mb-10 max-w-2xl mx-auto leading-relaxed">
          CVpass analyse votre CV face à une offre d&apos;emploi et vous propose
          des reformulations précises pour maximiser vos chances d&apos;être
          contacté.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-brand-green text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-green-700 transition-colors shadow-md"
        >
          Corriger mon CV gratuitement →
        </Link>
        <p className="text-sm text-brand-gray mt-4">
          <b>Gratuit</b> · Sans carte de crédit · Sans engagement
        </p>
      </main>

      {/* 3 étapes */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-brand-black text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-green text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bas */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-brand-black mb-6">
          Prêt à décrocher plus d&apos;entretiens ?
        </h2>
        <Link
          href="/signup"
          className="inline-block bg-brand-green text-white font-bold px-10 py-4 rounded-xl text-lg hover:bg-green-700 transition-colors"
        >
          Commencer gratuitement
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-brand-gray">
        <Link href="/mentions-legales" className="hover:underline">
          Mentions légales
        </Link>
        {" · "}
        <Link href="/pricing" className="hover:underline">
          Tarifs
        </Link>
        {" · "}© 2026 CVpass — VertexLab SASU
      </footer>
    </div>
  );
}
