import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 px-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-[20px] font-extrabold tracking-[-0.8px]">
              <span className="text-white">CV</span>
              <span className="text-green-500">pass</span>
            </Link>
            <p className="text-[13px] text-gray-500 mt-3 leading-relaxed">
              Optimisez votre CV pour les logiciels de recrutement. Score ATS, suggestions IA, templates professionnels.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              <a href="https://www.instagram.com/cvpass.fr/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://x.com/cvpassfr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" aria-label="X (Twitter)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@cvpass4?lang=fr" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors" aria-label="TikTok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-white text-[13px] font-bold uppercase tracking-wider mb-4">Produit</h4>
            <div className="space-y-2.5">
              <Link href="/analyze" className="block text-[14px] hover:text-white transition-colors py-0.5">Analyser un CV</Link>
              <Link href="/tracker" className="block text-[14px] hover:text-white transition-colors py-0.5">Tracker candidatures</Link>
              <Link href="/pricing" className="block text-[14px] hover:text-white transition-colors py-0.5">Tarifs</Link>
              <Link href="/blog" className="block text-[14px] hover:text-white transition-colors py-0.5">Blog</Link>
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="text-white text-[13px] font-bold uppercase tracking-wider mb-4">Programmes</h4>
            <div className="space-y-2.5">
              <Link href="/challenge" className="block text-[14px] hover:text-white transition-colors py-0.5">Challenge #MonScoreATS</Link>
              <Link href="/affiliate/join" className="block text-[14px] hover:text-white transition-colors py-0.5">Affiliation (30%)</Link>
              <a href="mailto:contact@cvpass.fr" className="block text-[14px] hover:text-white transition-colors py-0.5">Partenariats</a>
              <a href="mailto:contact@cvpass.fr" className="block text-[14px] hover:text-white transition-colors py-0.5">Contact</a>
            </div>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white text-[13px] font-bold uppercase tracking-wider mb-4">Légal</h4>
            <div className="space-y-2.5">
              <Link href="/mentions-legales" className="block text-[14px] hover:text-white transition-colors py-0.5">Mentions légales</Link>
              <Link href="/conditions-generales" className="block text-[14px] hover:text-white transition-colors py-0.5">CGU/CGV</Link>
              <Link href="/politique-confidentialite" className="block text-[14px] hover:text-white transition-colors py-0.5">Confidentialité</Link>
              <Link href="/politique-cookies" className="block text-[14px] hover:text-white transition-colors py-0.5">Cookies</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-gray-500">© 2026 VertexLab SASU. Tous droits réservés.</p>
          <p className="text-[13px] text-gray-600">
            Fait avec <span className="text-green-500">&#9829;</span> en France
          </p>
        </div>
      </div>
    </footer>
  );
}
