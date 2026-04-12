import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Qui est derrière CVpass ? | CVpass",
  description: "CVpass est un scanner CV ATS français créé par Giovanni Russo. Pourquoi cet outil existe et comment il fonctionne.",
  alternates: { canonical: "https://cvpass.fr/a-propos" },
  openGraph: {
    title: "Qui est derrière CVpass ?",
    description: "Un outil créé par un fondateur français pour que les bons candidats ne soient plus filtrés par des robots.",
    url: "https://cvpass.fr/a-propos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Qui est derrière CVpass ?",
    description: "Un outil créé par un fondateur français pour que les bons candidats ne soient plus filtrés par des robots.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-green-600 text-[14px] font-semibold mb-4">A propos</p>
          <h1 className="font-display text-[32px] md:text-[42px] font-extrabold tracking-[-1.5px] text-gray-900 leading-tight mb-6">
            Pourquoi j&apos;ai créé CVpass
          </h1>
        </div>
      </section>

      {/* Story — voix perso Giovanni, pas de corporate speak */}
      <section className="pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-[20px] shrink-0">
              GR
            </div>
            <div>
              <p className="font-bold text-gray-900 text-[16px]">Giovanni Russo</p>
              <p className="text-[14px] text-gray-500">Fondateur</p>
            </div>
          </div>

          <div className="space-y-5 text-[16px] text-gray-600 leading-[1.7]">
            <p>
              Un truc m&apos;a toujours énervé dans la recherche d&apos;emploi : le silence. Vous postulez, vous attendez, rien ne se passe. Vous recommencez. Toujours rien.
            </p>
            <p>
              Pendant longtemps, j&apos;ai cru que c&apos;était normal. Que les recruteurs étaient juste débordés. Et c&apos;est vrai, ils le sont. Mais ce que je ne savais pas, c&apos;est qu&apos;un logiciel éliminait mon CV avant qu&apos;un humain ne le voie.
            </p>
            <p>
              Ces logiciels s&apos;appellent des ATS. Quasiment toutes les entreprises de plus de 50 salariés en utilisent un. Le principe est simple : le robot scanne votre CV, cherche des mots-clés, et si votre CV ne colle pas, il est classé en bas de la pile. Ou carrément supprimé.
            </p>
            <p>
              J&apos;ai cherché des outils pour vérifier si mon CV passait ces filtres. J&apos;en ai trouvé. Ils donnaient un score et une liste de problèmes. Et après ? Rien. Débrouillez-vous.
            </p>
            <p className="text-gray-900 font-medium">
              C&apos;est là que j&apos;ai eu l&apos;idée de CVpass. Un outil qui ne se contente pas de pointer les problèmes, mais qui les corrige.
            </p>
            <p>
              Concrètement : vous uploadez votre CV, l&apos;IA identifie ce qui bloque et propose une reformulation pour chaque point faible. Vous cliquez Accepter si ça vous va, Ignorer sinon. Le score remonte en temps réel. Vous téléchargez le PDF corrigé.
            </p>
            <p>
              Pas de magie. Pas de promesse de &quot;décrocher un job en 24h&quot;. Juste un CV qui sera lu par un humain au lieu d&apos;être filtré par un robot.
            </p>
          </div>
        </div>
      </section>

      {/* Comment ca marche — concret, pas de bullshit */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[24px] font-extrabold text-gray-900 mb-8 tracking-[-0.5px]">
            Ce que fait CVpass (et ce qu&apos;il ne fait pas)
          </h2>
          <div className="space-y-6 text-[15px] text-gray-600 leading-[1.7]">
            <div className="flex gap-3">
              <span className="text-green-500 text-[18px] mt-0.5 shrink-0">&#10003;</span>
              <p>Analyse votre CV comme le ferait un logiciel ATS de recruteur. Score sur 100, mots-clés manquants, problèmes de format.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500 text-[18px] mt-0.5 shrink-0">&#10003;</span>
              <p>Propose des corrections IA pour chaque point faible. Vous choisissez ce que vous gardez.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500 text-[18px] mt-0.5 shrink-0">&#10003;</span>
              <p>Compare votre CV avec une offre d&apos;emploi précise pour adapter les mots-clés.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-500 text-[18px] mt-0.5 shrink-0">&#10003;</span>
              <p>Génère un PDF propre, lisible par tous les ATS du marché.</p>
            </div>
            <div className="flex gap-3 mt-4">
              <span className="text-red-400 text-[18px] mt-0.5 shrink-0">&#10007;</span>
              <p>Ne stocke jamais votre CV. Il est traité en mémoire et disparaît à la fermeture de l&apos;onglet.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-red-400 text-[18px] mt-0.5 shrink-0">&#10007;</span>
              <p>Ne garantit pas un emploi. Personne ne peut faire ça. Mais ça augmente vos chances d&apos;être lu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres — sans titre pompeux */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display font-extrabold text-[28px] text-green-600">+1 200</div>
              <div className="text-[13px] text-gray-500 mt-1">CVs analysés</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-[28px] text-green-600">+30 pts</div>
              <div className="text-[13px] text-gray-500 mt-1">de gain en moyenne</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-[28px] text-green-600">30s</div>
              <div className="text-[13px] text-gray-500 mt-1">par analyse</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-[28px] text-green-600">0</div>
              <div className="text-[13px] text-gray-500 mt-1">CV stocké en base</div>
            </div>
          </div>
        </div>
      </section>

      {/* Entreprise — factuel */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[24px] font-extrabold text-gray-900 mb-6 tracking-[-0.5px]">L&apos;entreprise</h2>
          <div className="text-[15px] text-gray-600 space-y-2 leading-[1.7]">
            <p>CVpass est édité par <strong className="text-gray-900">VertexLab</strong>, société française (SASU) enregistrée au RCS.</p>
            <p>Siège en France. Données traitées en mémoire, jamais stockées. Paiements sécurisés par Stripe.</p>
            <p>Contact : <a href="mailto:contact@cvpass.fr" className="text-green-600 hover:underline">contact@cvpass.fr</a></p>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <a href="https://www.instagram.com/cvpass.fr/" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors">Instagram</a>
            <a href="https://x.com/cvpassfr" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors">X</a>
            <a href="https://www.tiktok.com/@cvpass4?lang=fr" target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors">TikTok</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <p className="text-gray-500 text-[16px] mb-6">La première analyse est gratuite. Pas de carte bancaire.</p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors"
        >
          Tester mon CV
          <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </section>
    </div>
  );
}
