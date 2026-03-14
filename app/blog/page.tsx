import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog CVpass – Conseils CV, ATS et recherche d'emploi en France",
  description:
    "Guides pratiques pour optimiser ton CV pour les ATS, choisir les bons mots-clés et décrocher plus d'entretiens en France.",
  alternates: { canonical: "https://cvpass.fr/blog" },
  openGraph: {
    title: "Blog CVpass – Conseils CV, ATS et recherche d'emploi",
    description:
      "Guides pratiques pour optimiser ton CV pour les ATS et décrocher plus d'entretiens.",
    url: "https://cvpass.fr/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "var(--font-geist-sans), -apple-system, sans-serif" }}>
      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(229,231,235,0.8)",
        boxShadow: "0 1px 0 rgba(0,0,0,.03), 0 4px 20px rgba(0,0,0,.04)",
        padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: "#111827", textDecoration: "none" }}>
          CV<span style={{ color: "#16a34a" }}>pass</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/#pricing" style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", textDecoration: "none", padding: "7px 12px", borderRadius: 8 }}>Tarifs</Link>
          <Link href="/blog" style={{ fontSize: 14, fontWeight: 500, color: "#16a34a", textDecoration: "none", padding: "7px 12px", borderRadius: 8, background: "#f0fdf4" }}>Blog</Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", padding: "9px 20px", borderRadius: 10, textDecoration: "none", boxShadow: "0 1px 3px rgba(22,163,74,.25)" }}>
            Analyser mon CV →
          </Link>
        </div>
      </nav>

      {/* HEADER */}
      <section style={{ background: "#fff", borderBottom: "1px solid rgba(229,231,235,.8)", padding: "64px 40px 56px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#16a34a", marginBottom: 14 }}>Blog</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.07, color: "#111827", marginBottom: 16 }}>
            Conseils CV et ATS<br />pour décrocher plus d&apos;entretiens.
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", lineHeight: 1.7, maxWidth: 520 }}>
            Guides pratiques sur l&apos;optimisation ATS, les mots-clés, les formats de CV et les outils pour candidater efficacement en France.
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section style={{ padding: "64px 40px 96px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#fff", borderTop: "1px solid rgba(229,231,235,.8)", padding: "64px 40px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: "-1.2px", color: "#111827", marginBottom: 14 }}>
            Prêt à optimiser ton CV ?
          </h2>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 28, lineHeight: 1.7 }}>
            Analyse gratuite, score ATS immédiat, réécriture IA en 1 clic.
          </p>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 15, fontWeight: 700,
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            color: "#fff", padding: "14px 32px", borderRadius: 12, textDecoration: "none",
            boxShadow: "0 2px 8px rgba(22,163,74,.3), 0 8px 24px rgba(22,163,74,.15)",
          }}>
            Analyser mon CV gratuitement →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(229,231,235,.8)", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
        <span style={{ fontSize: 13, color: "#9ca3af" }}>© 2026 CVpass</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          <Link href="/mentions-legales" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/conditions-generales" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>CGU/CGV</Link>
          <Link href="/politique-cookies" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Cookies</Link>
          <a href="mailto:contact@cvpass.fr" style={{ fontSize: 13, color: "#9ca3af", textDecoration: "none" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
