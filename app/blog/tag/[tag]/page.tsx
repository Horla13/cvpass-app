import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, tagToSlug, getPostsByTag, getTagName } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tagToSlug(tag) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag } = await params;
  const tagName = getTagName(tag);
  if (!tagName) return {};
  return {
    title: `${tagName} — Articles et guides | Blog CVpass`,
    description: `Tous les articles CVpass sur le thème ${tagName}. Guides pratiques pour optimiser ton CV et passer les filtres ATS.`,
    alternates: { canonical: `https://cvpass.fr/blog/tag/${tag}` },
    openGraph: {
      title: `${tagName} — Blog CVpass`,
      description: `Articles et guides sur ${tagName} pour optimiser ton CV ATS.`,
      url: `https://cvpass.fr/blog/tag/${tag}`,
      type: "website",
    },
  };
}

export default async function TagPage(
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const tagName = getTagName(tag);
  if (!tagName) notFound();

  const posts = getPostsByTag(tag);
  const allTags = getAllTags();

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
          <Link href="/blog" style={{ fontSize: 14, fontWeight: 500, color: "#6b7280", textDecoration: "none", padding: "7px 12px", borderRadius: 8 }}>← Blog</Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", padding: "9px 20px", borderRadius: 10, textDecoration: "none", boxShadow: "0 1px 3px rgba(22,163,74,.25)" }}>
            Analyser mon CV →
          </Link>
        </div>
      </nav>

      {/* BREADCRUMBS */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "16px 40px 0" }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af" }}>
          <Link href="/" style={{ color: "#6b7280", textDecoration: "none" }}>Accueil</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: "#6b7280", textDecoration: "none" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>{tagName}</span>
        </nav>
      </div>

      {/* HEADER */}
      <section style={{ background: "#fff", borderBottom: "1px solid rgba(229,231,235,.8)", padding: "48px 40px 44px", marginTop: 8 }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#111827", marginBottom: 12 }}>
            {tagName}
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7 }}>
            {posts.length} article{posts.length > 1 ? "s" : ""} sur ce thème
          </p>
        </div>
      </section>

      {/* TAG CLOUD */}
      <section style={{ padding: "24px 40px 0" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {allTags.map((t) => {
            const tSlug = tagToSlug(t);
            const isActive = tSlug === tag;
            return (
              <Link
                key={t}
                href={`/blog/tag/${tSlug}`}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 100,
                  background: isActive ? "#16a34a" : "#f3f4f6",
                  color: isActive ? "#fff" : "#6b7280",
                  textDecoration: "none",
                  transition: "background .2s, color .2s",
                }}
              >
                {t}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ARTICLES */}
      <section style={{ padding: "32px 40px 96px" }}>
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
