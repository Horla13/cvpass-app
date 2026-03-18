import Link from "next/link";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function CTABanner({
  title = "Prêt à optimiser votre CV ?",
  subtitle = "Gratuit, sans inscription, en 30 secondes.",
  ctaText = "Analyser mon CV maintenant",
  ctaHref = "/signup",
}: CTABannerProps) {
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-[72px] px-8 text-center">
      <h2 className="font-display text-4xl font-extrabold tracking-tighter text-brand-black mb-3">
        {title}
      </h2>
      <p className="text-base text-brand-gray mb-8">{subtitle}</p>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-[10px] text-[15px] font-display font-bold transition-all duration-200 hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(22,163,74,0.3)]"
      >
        {ctaText}
        <svg width="16" height="16" fill="none">
          <path
            d="M3 8h10m0 0L9 4m4 4L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </section>
  );
}
