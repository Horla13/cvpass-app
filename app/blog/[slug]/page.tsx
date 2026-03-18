import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { ShareButtons } from "@/components/ShareButtons";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://cvpass.fr/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `https://cvpass.fr/blog/${post.slug}`,
      type: "article",
      images: [{ url: `https://cvpass.fr${post.image}`, width: 1200, height: 630, alt: post.title }],
    },
  };
}

/** Extract H2 headings from content for TOC */
function extractHeadings(content: string): { id: string; text: string }[] {
  const lines = content.split("\n");
  const headings: { id: string; text: string }[] = [];
  for (const line of lines) {
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      const text = line.replace("## ", "").trim();
      const id = text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ id, text });
    }
  }
  return headings;
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[\s\-|]+\|$/));
      elements.push(
        <div key={key++} style={{ overflowX: "auto", margin: "24px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split("|").filter((_, ci) => ci !== 0 && ci !== row.split("|").length - 1);
                const isHeader = ri === 0;
                return (
                  <tr key={ri} style={{ background: isHeader ? "var(--bg-surface)" : ri % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)" }}>
                    {cells.map((cell, ci) => {
                      const Tag = isHeader ? "th" : "td";
                      return (
                        <Tag key={ci} style={{
                          padding: "10px 16px",
                          border: "1px solid var(--border-light)",
                          textAlign: "left",
                          fontWeight: isHeader ? 700 : 400,
                          color: isHeader ? "var(--text-secondary)" : "var(--text-body)",
                          fontSize: isHeader ? 12 : 13.5,
                          letterSpacing: isHeader ? ".4px" : 0,
                          textTransform: isHeader ? "uppercase" : "none",
                        }}>
                          {cell.trim()}
                        </Tag>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: "28px 0 10px", letterSpacing: "-.3px", lineHeight: 1.35 }}>
          {line.replace("### ", "")}
        </h3>
      );
      i++;
      continue;
    }

    // H2 — with anchor id for TOC
    if (line.startsWith("## ")) {
      const text = line.replace("## ", "");
      const id = text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      elements.push(
        <h2 key={key++} id={id} style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", margin: "40px 0 12px", letterSpacing: "-.5px", lineHeight: 1.25, paddingTop: 8, borderTop: "1px solid var(--border-light)", scrollMarginTop: 80 }}>
          {text}
        </h2>
      );
      i++;
      continue;
    }

    // HR
    if (line.startsWith("---")) {
      elements.push(<hr key={key++} style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "36px 0" }} />);
      i++;
      continue;
    }

    // List item
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace("- ", ""));
        i++;
      }
      elements.push(
        <ul key={key++} style={{ paddingLeft: 20, margin: "12px 0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.68 }}>
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Bold line (starts and ends with **)
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={key++} style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", margin: "16px 0 6px" }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} style={{ fontSize: 15, color: "var(--text-body)", lineHeight: 1.78, margin: "0 0 16px" }}>
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return elements;
}

function InlineMarkdown({ text }: { text: string }) {
  // Handle links: [text](url)
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`)/g);
  return (
    <>
      {parts.map((part, i) => {
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <Link key={i} href={linkMatch[2]} style={{ color: "#16a34a", fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(22,163,74,.4)" }}>
              {linkMatch[1]}
            </Link>
          );
        }
        const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
        if (boldMatch) {
          return <strong key={i} style={{ fontWeight: 700, color: "var(--text-primary)" }}>{boldMatch[1]}</strong>;
        }
        const codeMatch = part.match(/^`(.*?)`$/);
        if (codeMatch) {
          return <code key={i} style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, background: "var(--code-bg)", padding: "2px 6px", borderRadius: 4, color: "var(--text-body)" }}>{codeMatch[1]}</code>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts().filter((p) => p.slug !== slug).slice(0, 3);
  const headings = extractHeadings(post.content);

  const dateObj = new Date(post.date);
  const dateLabel = dateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "CVpass", url: "https://cvpass.fr" },
    publisher: { "@type": "Organization", name: "CVpass", url: "https://cvpass.fr", logo: { "@type": "ImageObject", url: "https://cvpass.fr/icon.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://cvpass.fr/blog/${post.slug}` },
    inLanguage: "fr",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://cvpass.fr" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://cvpass.fr/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://cvpass.fr/blog/${post.slug}` },
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)", fontFamily: "var(--font-geist-sans), -apple-system, sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <Link href="/blog" style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none", padding: "7px 12px", borderRadius: 8 }}>← Blog</Link>
          <Link href="/analyze" style={{ display: "inline-flex", alignItems: "center", fontSize: 14, fontWeight: 700, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", padding: "9px 20px", borderRadius: 10, textDecoration: "none", boxShadow: "0 1px 3px rgba(22,163,74,.25)" }}>
            Analyser mon CV →
          </Link>
        </div>
      </nav>

      {/* BREADCRUMBS */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 40px 0" }}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Accueil</Link>
          <span>/</span>
          <Link href="/blog" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Blog</Link>
          <span>/</span>
          <span style={{ color: "var(--text-body)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{post.title}</span>
        </nav>
      </div>

      {/* HERO IMAGE */}
      <div style={{ maxWidth: 720, margin: "12px auto 0", padding: "0 40px" }}>
        <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "1200/630", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>

      {/* ARTICLE HEADER */}
      <section style={{ background: "var(--bg-primary)", padding: "32px 40px 40px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100, background: "#f0fdf4", color: "#15803d" }}>{post.category}</span>
            {post.tags?.filter(t => t !== post.category).map((tag) => (
              <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "var(--code-bg)", color: "var(--text-secondary)" }}>{tag}</span>
            ))}
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{dateLabel}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>·</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.readTime} de lecture</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1.3px", lineHeight: 1.12, margin: 0 }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 40px 80px" }}>

        {/* TABLE OF CONTENTS */}
        {headings.length >= 3 && (
          <div style={{
            background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 16,
            padding: "24px 28px", marginBottom: 32,
            boxShadow: "0 1px 2px rgba(0,0,0,.04)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14 }}>
              Sommaire
            </div>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {headings.map((h, idx) => (
                <li key={idx} style={{ fontSize: 14, lineHeight: 1.5 }}>
                  <a href={`#${h.id}`} style={{ color: "var(--text-body)", textDecoration: "none", fontWeight: 500 }}>
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}

        <article style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: 20, padding: "48px 52px", boxShadow: "var(--card-shadow)" }}>
          {renderContent(post.content)}
        </article>

        {/* SHARE BUTTONS */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Partager cet article</span>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {/* CTA dans l'article */}
        <div style={{
          marginTop: 32, padding: "36px 40px", borderRadius: 20,
          background: "linear-gradient(145deg, #f0fdf4, #fafffe)",
          border: "2px solid rgba(22,163,74,.2)",
          boxShadow: "0 4px 16px rgba(22,163,74,.08)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#14532d", marginBottom: 8, letterSpacing: "-.4px" }}>
            Prêt à optimiser ton CV ?
          </p>
          <p style={{ fontSize: 14, color: "#166534", marginBottom: 22 }}>
            Analyse gratuite · Score ATS immédiat · Réécriture IA en 1 clic
          </p>
          <Link href="/analyze" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 15, fontWeight: 700,
            background: "linear-gradient(135deg,#16a34a,#15803d)",
            color: "#fff", padding: "13px 28px", borderRadius: 12, textDecoration: "none",
            boxShadow: "0 2px 8px rgba(22,163,74,.3), 0 8px 24px rgba(22,163,74,.15)",
          }}>
            Analyser mon CV gratuitement →
          </Link>
        </div>
      </div>

      {/* ARTICLES SUGGÉRÉS */}
      {allPosts.length > 0 && (
        <section style={{ background: "var(--bg-primary)", borderTop: "1px solid var(--border-color)", padding: "56px 40px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-.5px", marginBottom: 32 }}>
              À lire aussi
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {allPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "var(--bg-secondary)", border: "1px solid var(--border-color)",
                    borderRadius: 16, padding: "22px 22px 18px",
                    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
                    transition: "box-shadow .22s, transform .22s",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#f0fdf4", color: "#15803d", display: "inline-block", marginBottom: 10 }}>{p.category}</span>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, margin: 0 }}>{p.title}</p>
                    <p style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, marginTop: 12 }}>Lire →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
