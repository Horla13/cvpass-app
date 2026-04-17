import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenge #MonScoreATS | Testez votre CV | CVpass",
  description: "Participez au challenge #MonScoreATS. Testez votre CV, partagez votre score et montrez votre progression. Gratuit.",
  alternates: { canonical: "https://cvpass.fr/challenge" },
  openGraph: {
    title: "Challenge #MonScoreATS | Testez votre CV",
    description: "Quel est votre score ATS ? Testez votre CV gratuitement et partagez votre resultat.",
    url: "https://cvpass.fr/challenge",
  },
};

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-green-500/20 text-green-400 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-500/30">
            Challenge TikTok
          </span>
          <h1 className="font-display text-[40px] md:text-[56px] font-extrabold tracking-[-2px] leading-[1.08] mb-6">
            <span className="text-green-400">#MonScoreATS</span>
          </h1>
          <p className="text-gray-400 text-[18px] max-w-lg mx-auto mb-10 leading-relaxed">
            Testez votre CV. Filmez votre score. Postez sur TikTok.
            Montrez au monde que votre CV est pret.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors"
          >
            Tester mon CV gratuitement
            <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>

      {/* How to participate */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-[28px] font-extrabold text-center mb-12">
            Comment participer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Testez votre CV", desc: "Allez sur cvpass.fr, uploadez votre CV et découvrez votre score ATS.", icon: "📄" },
              { step: "2", title: "Filmez votre écran", desc: "Enregistrez votre écran pendant que le score apparait. Montrez votre reaction.", icon: "📱" },
              { step: "3", title: "Postez avec #MonScoreATS", desc: "Publiez sur TikTok ou Instagram avec le hashtag #MonScoreATS.", icon: "🎬" },
            ].map((item) => (
              <div key={item.step} className="text-center p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                <span className="text-[32px] mb-3 block">{item.icon}</span>
                <div className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-2">Étape {item.step}</div>
                <h3 className="font-bold text-[18px] mb-2">{item.title}</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scores showcase */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-[28px] font-extrabold mb-4">
            Les scores de la communaute
          </h2>
          <p className="text-gray-400 text-[16px] mb-12">Qui aura le meilleur score ?</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { score: 87, label: "Record", color: "#16a34a" },
              { score: 73, label: "Moyenne", color: "#f59e0b" },
              { score: 42, label: "Debutant", color: "#ef4444" },
              { score: 95, label: "A battre", color: "#16a34a" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="text-[36px] font-extrabold" style={{ color: s.color }}>{s.score}</div>
                <div className="text-[12px] text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-gray-800 text-center">
        <h2 className="font-display text-[24px] font-extrabold mb-4">
          Prêt a relever le defi ?
        </h2>
        <p className="text-gray-400 text-[16px] mb-8">
          Votre score ATS en 30 secondes. Gratuit. Sans inscription.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors"
        >
          Tester mon CV maintenant
          <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </section>
    </div>
  );
}
