import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CVpass vs Jobscan vs JobStep — Quel scanner CV ATS choisir ?",
  description: "Comparatif honnete des scanners CV ATS en 2026. CVpass, Jobscan, JobStep : prix, fonctionnalites, langue. On vous dit tout.",
  alternates: { canonical: "https://cvpass.fr/comparaison" },
  openGraph: {
    title: "CVpass vs Jobscan vs JobStep — Comparatif 2026",
    description: "Quel scanner CV ATS choisir ? Comparatif des prix et fonctionnalites.",
    url: "https://cvpass.fr/comparaison",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVpass vs Jobscan vs JobStep — Comparatif 2026",
    description: "Quel scanner CV ATS choisir ?",
  },
};

const OUI = <span className="text-green-600 font-bold">Oui</span>;
const NON = <span className="text-red-400 font-bold">Non</span>;
const PARTIEL = <span className="text-amber-500 font-bold">Partiel</span>;

const ROWS: [string, React.ReactNode, React.ReactNode, React.ReactNode][] = [
  ["En fran\u00E7ais", OUI, NON, OUI],
  ["Analyse ATS g\u00E9n\u00E9rale", OUI, OUI, OUI],
  ["Match CV + offre d'emploi", OUI, OUI, NON],
  ["L'IA corrige le CV (pas juste un score)", OUI, NON, PARTIEL],
  ["Score en temps r\u00E9el", OUI, NON, NON],
  ["Templates CV", OUI, NON, OUI],
  ["Suivi des candidatures", OUI, NON, PARTIEL],
  ["Lettre de motivation", OUI, NON, OUI],
  ["Export PDF", OUI, NON, OUI],
  ["CV jamais stock\u00E9", OUI, NON, NON],
  ["Analyse gratuite", OUI, PARTIEL, PARTIEL],
  ["Prix mensuel", "8,90\u20AC", "~20\u20AC", "19,99\u20AC"],
];

export default function ComparaisonPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-green-600 text-[14px] font-semibold mb-4">Comparatif 2026</p>
          <h1 className="font-display text-[32px] md:text-[42px] font-extrabold tracking-[-1.5px] text-gray-900 leading-tight mb-4">
            CVpass vs Jobscan vs JobStep
          </h1>
          <p className="text-gray-500 text-[16px] leading-relaxed max-w-xl">
            On va pas se mentir : il existe d&apos;autres outils. Voici une comparaison honn&ecirc;te pour que vous puissiez choisir en connaissance de cause.
          </p>
        </div>
      </section>

      {/* Tableau */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-display font-bold text-gray-900 w-[40%]"></th>
                <th className="text-center py-4 px-4 font-display font-bold text-green-600 bg-green-50/50 rounded-t-lg">CVpass</th>
                <th className="text-center py-4 px-4 font-display font-bold text-gray-400">Jobscan</th>
                <th className="text-center py-4 px-4 font-display font-bold text-gray-400">JobStep</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([feature, cvpass, jobscan, jobstep], i) => (
                <tr key={feature as string} className={`border-b border-gray-100 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="py-3.5 px-4 text-gray-700">{feature}</td>
                  <td className="text-center py-3.5 px-4 bg-green-50/20">{cvpass}</td>
                  <td className="text-center py-3.5 px-4">{jobscan}</td>
                  <td className="text-center py-3.5 px-4">{jobstep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Avis honnete */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[24px] font-extrabold text-gray-900 mb-8 tracking-[-0.5px]">
            Notre avis (sans langue de bois)
          </h2>
          <div className="space-y-6 text-[15px] text-gray-600 leading-[1.7]">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Jobscan</h3>
              <p>Le plus connu des scanners ATS. Le matching CV + offre est bien fait. Mais tout est en anglais, le prix tourne autour de 20&euro;/mois, et il ne corrige rien. Il vous dit &quot;il manque 8 mots-cl&eacute;s&quot; et c&apos;est &agrave; vous de vous d&eacute;brouiller pour les int&eacute;grer. Si vous postulez en France, c&apos;est pas id&eacute;al.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">JobStep</h3>
              <p>Un concurrent suisse avec une interface propre. Ils ont des templates et une lettre de motivation. Tarif : 19,99&euro;/mois. Honn&ecirc;tement, c&apos;est un bon produit. Ce qui nous diff&eacute;rencie : la r&eacute;&eacute;criture IA qui corrige directement le CV (eux donnent surtout un score), et on est deux fois moins cher.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">CVpass</h3>
              <p>On va pas pr&eacute;tendre &ecirc;tre objectifs, c&apos;est notre outil. Ce qu&apos;on fait diff&eacute;remment : l&apos;IA ne liste pas juste les probl&egrave;mes, elle propose une correction pour chacun. Vous cliquez Accepter, le score monte. En fran&ccedil;ais, &agrave; 8,90&euro;/mois, et votre CV n&apos;est jamais stock&eacute;.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lequel choisir */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[24px] font-extrabold text-gray-900 mb-8 tracking-[-0.5px]">
            Lequel choisir ?
          </h2>
          <div className="space-y-4 text-[15px] text-gray-600 leading-[1.7]">
            <p>
              Si vous postulez surtout &agrave; des postes internationaux en anglais, Jobscan peut &ecirc;tre un bon choix.
            </p>
            <p>
              Si vous voulez un outil complet avec des templates et que le budget n&apos;est pas un probl&egrave;me, JobStep fait le travail.
            </p>
            <p>
              Si vous cherchez un outil en fran&ccedil;ais qui corrige concr&egrave;tement votre CV pour les recruteurs fran&ccedil;ais, &agrave; un prix correct, c&apos;est pour &ccedil;a qu&apos;on a cr&eacute;&eacute; CVpass.
            </p>
            <p className="text-gray-400 text-[13px] mt-8">
              Comparatif mis &agrave; jour en avril 2026. Les prix et fonctionnalit&eacute;s peuvent changer. Si vous trouvez une erreur, &eacute;crivez-nous &agrave; contact@cvpass.fr.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-[16px] mb-6">Testez par vous-m&ecirc;me. La premi&egrave;re analyse est gratuite.</p>
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
