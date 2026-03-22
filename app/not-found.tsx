import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="text-[120px] font-extrabold leading-none tracking-tighter text-brand-green/20 select-none">
        404
      </div>
      <h1 className="mt-2 text-2xl font-bold text-brand-black tracking-tight">
        Page introuvable
      </h1>
      <p className="mt-3 text-brand-gray max-w-md text-[15px] leading-relaxed">
        Cette page n&apos;existe pas ou a été déplacée. Profitez-en pour analyser votre CV gratuitement.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl text-[14px] font-bold hover:bg-green-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Analyser mon CV
        </Link>
        <Link
          href="/"
          className="text-[14px] font-medium text-brand-gray hover:text-brand-black transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
