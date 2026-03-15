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
  const [featured, ...rest] = posts;

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog CVpass",
    description: "Guides pratiques pour optimiser ton CV pour les ATS et décrocher plus d'entretiens en France.",
    url: "https://cvpass.fr/blog",
    publisher: { "@type": "Organization", name: "CVpass", url: "https://cvpass.fr" },
    inLanguage: "fr",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "var(--nav-bg)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: "0 1px 0 rgba(0,0,0,.03), 0 4px 20px rgba(0,0,0,.04)",
        padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary)", textDecoration: "none" }}>
          CV<span style={{ color: "#16a34a" }}>pass</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/#pricing" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", padding: "7px 12px", borderRadius: 8 }}>Tarifs</Link>
          <Link href="/blog" style={{ fontSize: 14, fontWeight: 500, color: "#16a34a", textDecoration: "none", padding: "7px 12px", borderRadius: 8, background: "#f0fdf4" }}>Blog</Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", padding: "9px 20px", borderRadius: 10, textDecoration: "none", boxShadow: "0 1px 3px rgba(22,163,74,.25)" }}>
            Analyser mon CV →
          </Link>
        </div>
      </nav>

      {/* BREADCRUMBS */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 40px 0" }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Blog</span>
        </nav>
      </div>

      {/* HEADER */}
      <section style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border-color)", padding: "48px 40px 44px", marginTop: 8 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#16a34a", marginBottom: 14 }}>Blog</div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.07, color: "var(--text-primary)", marginBottom: 16 }}>
            Conseils CV et ATS<br />pour décrocher plus d&apos;entretiens.
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 520, margin: 0 }}>
              Guides pratiques sur l&apos;optimisation ATS, les mots-clés, les formats de CV et les outils pour candidater efficacement en France.
            </p>
            <span style={{
              fontSize: 13, fontWeight: 700, padding: "6px 14px", borderRadius: 100,
              background: "#f0fdf4", color: "#15803d", whiteSpace: "nowrap",
            }}>
              {posts.length} articles publiés
            </span>
          </div>
        </div>
      </section>

      {/* FEATURED POST */}
      {featured && (
        <section style={{ padding: "48px 40px 0" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 16 }}>
              Dernier article
            </div>
            <BlogCard post={featured} featured />
          </div>
        </section>
      )}

      {/* ALL ARTICLES */}
      <section style={{ padding: "48px 40px 96px" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 20 }}>
            Tous les articles
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {rest.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-color)", padding: "64px 40px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: "-1.2px", color: "var(--text-primary)", marginBottom: 14 }}>
            Prêt à optimiser ton CV ?
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.7 }}>
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
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-primary)" }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>© 2026 CVpass</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          <Link href="/mentions-legales" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Confidentialité</Link>
          <Link href="/conditions-generales" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>CGU/CGV</Link>
          <Link href="/politique-cookies" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Cookies</Link>
          <a href="mailto:contact@cvpass.fr" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
