import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A propos de CVpass — Notre mission | CVpass",
  description: "Decouvrez qui est derriere CVpass, pourquoi nous avons cree cet outil et notre mission : que le meilleur candidat obtienne l entretien.",
  alternates: { canonical: "https://cvpass.fr/a-propos" },
  openGraph: {
    title: "A propos de CVpass",
    description: "Notre mission : que le meilleur candidat obtienne l entretien, pas le mieux formate.",
    url: "https://cvpass.fr/a-propos",
  },
  twitter: {
    card: "summary_large_image",
    title: "A propos de CVpass",
    description: "Notre mission : que le meilleur candidat obtienne l entretien, pas le mieux formate.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-[36px] md:text-[48px] font-extrabold tracking-[-2px] leading-[1.08] mb-6">
            Le meilleur candidat devrait obtenir<br className="hidden md:block" /> <span className="text-green-400">l&apos;entretien</span>
          </h1>
          <p className="text-gray-400 text-[17px] max-w-xl mx-auto leading-relaxed">
            Pas le mieux formate. C&apos;est pour ca que CVpass existe.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-[20px]">
              GR
            </div>
            <div>
              <p className="font-bold text-gray-900 text-[16px]">Giovanni Russo</p>
              <p className="text-[14px] text-gray-500">Fondateur de CVpass</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-5 text-[16px] text-gray-600 leading-relaxed">
            <p>
              Tout a commence par un constat frustrant. Des gens competents, qualifies, avec de vraies experiences, qui envoyaient des dizaines de candidatures sans jamais recevoir de reponse.
            </p>
            <p>
              Pas parce qu&apos;ils manquaient de competences. Mais parce que leur CV etait rejete par une machine avant meme qu&apos;un humain ne le lise.
            </p>
            <p>
              En France, la majorite des grandes entreprises utilisent un logiciel ATS pour trier les candidatures. Ces logiciels eliminent automatiquement les CV mal formates, sans les bons mots-cles ou avec une structure incompatible. Des milliers de profils excellents passent a la trappe chaque jour.
            </p>
            <p>
              Les outils qui existaient donnaient un score et une liste de problemes. Point. Vous vous retrouviez seul face a votre CV sans savoir comment corriger.
            </p>
            <p className="font-semibold text-gray-900">
              J&apos;ai voulu aller plus loin : un outil qui ne se contente pas de diagnostiquer, mais qui corrige.
            </p>
            <p>
              CVpass analyse votre CV, identifie chaque point faible et propose une reecriture IA integrant les mots-cles de l&apos;offre que vous visez. Vous acceptez ou vous ignorez. Le score remonte en temps reel. Vous telechargez un PDF propre, optimise, pret a postuler.
            </p>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[28px] font-extrabold text-center mb-12 tracking-[-1px]">
            Ce en quoi on croit
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Transparence", desc: "Votre CV est traite en memoire vive et jamais stocke en base de donnees. On ne vend pas vos donnees. Point." },
              { title: "Efficacite", desc: "30 secondes pour analyser un CV. Pas 30 minutes. Votre temps de recherche d emploi est precieux." },
              { title: "Accessibilite", desc: "La premiere analyse est gratuite. Pas de carte bancaire demandee. Tout le monde merite un CV qui passe les filtres." },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <h3 className="font-bold text-gray-900 text-[18px] mb-2">{v.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[28px] font-extrabold text-center mb-12 tracking-[-1px]">
            CVpass en chiffres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "+1 200", label: "CVs analyses" },
              { value: "+30 pts", label: "Gain moyen de score" },
              { value: "30s", label: "Pour optimiser" },
              { value: "7", label: "Templates ATS" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display font-extrabold text-[28px] text-green-600">{s.value}</div>
                <div className="text-[13px] text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entreprise */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-[28px] font-extrabold mb-6 tracking-[-1px]">L&apos;entreprise</h2>
          <div className="text-[15px] text-gray-600 space-y-3">
            <p><strong>VertexLab</strong></p>
            <p>Societe francaise enregistree au RCS</p>
            <p>RGPD compliant — donnees traitees en memoire, jamais stockees</p>
            <p>Paiement securise par Stripe</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <a href="https://www.instagram.com/cvpass.fr/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">Instagram</a>
            <span className="text-gray-300">|</span>
            <a href="https://x.com/cvpassfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">X / Twitter</a>
            <span className="text-gray-300">|</span>
            <a href="https://www.tiktok.com/@cvpass4?lang=fr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">TikTok</a>
            <span className="text-gray-300">|</span>
            <a href="mailto:contact@cvpass.fr" className="text-gray-400 hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="font-display text-[24px] font-extrabold mb-4">Pret a optimiser votre CV ?</h2>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors"
        >
          Analyser mon CV gratuitement
          <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </section>
    </div>
  );
}
