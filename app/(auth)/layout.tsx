import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branded panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-black text-white flex-col justify-between p-12 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 via-transparent to-brand-green/5 pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="font-display text-[24px] font-extrabold tracking-[-1px]">
            <span className="text-white">CV</span>
            <span className="text-brand-green">pass</span>
          </Link>
        </div>

        {/* Center: Headline + badges */}
        <div className="relative z-10 max-w-[420px]">
          <h1 className="font-display text-[38px] font-extrabold tracking-[-2px] leading-[1.1] mb-6">
            Rejoignez{" "}
            <span className="text-brand-green">+1 200</span>{" "}
            professionnels qui ont décroché leur emploi
          </h1>
          <p className="text-white/60 text-[15px] leading-relaxed mb-8">
            Optimisation de CV par IA — passez les filtres ATS et obtenez plus
            d&apos;entretiens.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap gap-3">
            {["Score ATS instantané", "Suggestions IA", "Export PDF"].map(
              (badge) => (
                <div
                  key={badge}
                  className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.1] rounded-full px-4 py-2"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[13px] font-medium text-white/80">
                    {badge}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom: Testimonial */}
        <div className="relative z-10 bg-white/[0.06] border border-white/[0.08] rounded-[14px] p-6 max-w-[420px]">
          <p className="text-[14px] text-white/70 leading-relaxed italic mb-4">
            &ldquo;CVpass m&apos;a permis d&apos;identifier les lacunes
            critiques de mon CV. J&apos;ai obtenu 3x plus de réponses en une
            semaine.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center text-[11px] font-bold text-brand-green">
              ML
            </div>
            <div>
              <div className="text-[13px] font-bold text-white/90">
                Marie L.
              </div>
              <div className="text-[12px] text-white/40">
                Chef de projet · Paris
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/[0.04]" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full border border-white/[0.03]" />
      </div>

      {/* ── Right auth panel ── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden p-6">
          <Link
            href="/"
            className="font-display text-[21px] font-extrabold tracking-[-0.8px]"
          >
            <span className="text-brand-black">CV</span>
            <span className="text-brand-green">pass</span>
          </Link>
        </div>

        {/* Centered auth form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>

        {/* Bottom links */}
        <div className="p-6 text-center lg:text-right">
          <Link
            href="/"
            className="text-[13px] text-brand-gray hover:text-brand-black transition-colors"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
