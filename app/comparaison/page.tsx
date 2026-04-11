import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CVpass vs Jobscan vs JobStep — Comparatif scanner CV ATS 2026",
  description: "Comparatif des meilleurs scanners CV ATS en 2026. CVpass vs Jobscan vs JobStep : fonctionnalites, prix, langue. Lequel choisir ?",
  alternates: { canonical: "https://cvpass.fr/comparaison" },
  openGraph: {
    title: "CVpass vs Jobscan vs JobStep — Comparatif 2026",
    description: "Quel scanner CV ATS choisir en 2026 ? Comparatif complet des fonctionnalites et prix.",
    url: "https://cvpass.fr/comparaison",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVpass vs Jobscan vs JobStep — Comparatif 2026",
    description: "Quel scanner CV ATS choisir en 2026 ?",
  },
};

const CHECK = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>;
const CROSS = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const PARTIAL = <span className="text-amber-500 font-bold text-[14px]">~</span>;

const FEATURES = [
  { feature: "Interface en francais", cvpass: CHECK, jobscan: CROSS, jobstep: CHECK },
  { feature: "Analyse ATS generale", cvpass: CHECK, jobscan: CHECK, jobstep: CHECK },
  { feature: "Match CV + offre emploi", cvpass: CHECK, jobscan: CHECK, jobstep: CROSS },
  { feature: "Reecriture IA des suggestions", cvpass: CHECK, jobscan: CROSS, jobstep: PARTIAL },
  { feature: "Score en temps reel", cvpass: CHECK, jobscan: CROSS, jobstep: CROSS },
  { feature: "Templates CV ATS", cvpass: CHECK, jobscan: CROSS, jobstep: CHECK },
  { feature: "Tracker candidatures", cvpass: CHECK, jobscan: CROSS, jobstep: PARTIAL },
  { feature: "Lettre de motivation IA", cvpass: CHECK, jobscan: CROSS, jobstep: CHECK },
  { feature: "Export PDF optimise", cvpass: CHECK, jobscan: CROSS, jobstep: CHECK },
  { feature: "CV jamais stocke (RGPD)", cvpass: CHECK, jobscan: CROSS, jobstep: CROSS },
  { feature: "Analyse gratuite", cvpass: CHECK, jobscan: PARTIAL, jobstep: PARTIAL },
  { feature: "Prix mensuel", cvpass: "8,90\u20AC", jobscan: "~20\u20AC", jobstep: "19,99\u20AC" },
];

export default function ComparaisonPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-green-50 text-green-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6">
            Comparatif 2026
          </span>
          <h1 className="font-display text-[32px] md:text-[44px] font-extrabold tracking-[-1.5px] text-gray-900 mb-4 leading-tight">
            CVpass vs Jobscan vs JobStep
          </h1>
          <p className="text-gray-500 text-[16px] max-w-xl mx-auto">
            Quel scanner CV ATS choisir en 2026 ? Comparaison objective des fonctionnalites, des prix et de la compatibilite avec le marche francais.
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table className="w-full text-[14px] bg-white rounded-xl border border-gray-200 overflow-hidden">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-5 font-display font-bold text-gray-900">Fonctionnalite</th>
                <th className="text-center py-4 px-5 font-display font-bold text-green-600 bg-green-50">CVpass</th>
                <th className="text-center py-4 px-5 font-display font-bold text-gray-500">Jobscan</th>
                <th className="text-center py-4 px-5 font-display font-bold text-gray-500">JobStep</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(({ feature, cvpass, jobscan, jobstep }, i) => (
                <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="py-3.5 px-5 font-medium text-gray-800">{feature}</td>
                  <td className="text-center py-3.5 px-5 bg-green-50/30">{cvpass}</td>
                  <td className="text-center py-3.5 px-5">{jobscan}</td>
                  <td className="text-center py-3.5 px-5">{jobstep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Why CVpass */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[28px] font-extrabold text-center mb-10 tracking-[-1px]">
            Pourquoi choisir CVpass ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Fait pour la France", desc: "Interface 100% en francais. Suggestions adaptees aux standards CV francais (anti-chronologique, normes ATS France, vocabulaire sectoriel)." },
              { title: "L IA corrige, pas juste diagnostique", desc: "Les autres outils listent les problemes. CVpass propose une reecriture pour chaque point faible. Vous cliquez Accepter, c est tout." },
              { title: "2x moins cher", desc: "8,90 euros par mois vs 20 euros chez Jobscan ou JobStep. Meme resultat, moitie prix." },
              { title: "Respect de la vie privee", desc: "Votre CV est traite en memoire et jamais stocke en base de donnees. Conforme RGPD." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-[16px] mb-2">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="font-display text-[24px] font-extrabold mb-4">Testez par vous-meme</h2>
        <p className="text-gray-500 text-[15px] mb-8">Premiere analyse gratuite. Sans carte bancaire.</p>
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
