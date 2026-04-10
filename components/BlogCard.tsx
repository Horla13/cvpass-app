"use client";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { BlogCardGradient } from "@/components/BlogCardGradient";

const CATEGORY_COLORS: Record<string, string> = {
  "Score ATS": "#f0fdf4",
  "CV Canva": "#fefce8",
  "Guide ATS": "#eff6ff",
  "Mots-clés": "#fdf4ff",
  "Format CV": "#fff7ed",
  Outils: "#f0fdf4",
  "Lettre de motivation": "#fef2f2",
  "CV par secteur": "#f0f9ff",
  "Erreurs CV": "#fef2f2",
  "CV par métier": "#f0f9ff",
};
const CATEGORY_TEXT: Record<string, string> = {
  "Score ATS": "#15803d",
  "CV Canva": "#a16207",
  "Guide ATS": "#1d4ed8",
  "Mots-clés": "#7e22ce",
  "Format CV": "#c2410c",
  Outils: "#15803d",
  "Lettre de motivation": "#dc2626",
  "CV par secteur": "#0369a1",
  "Erreurs CV": "#dc2626",
  "CV par métier": "#0369a1",
};

export function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <article
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05)",
            transition: "box-shadow .25s ease, transform .25s ease",
            cursor: "pointer",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.1)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          {/* Illustration */}
          <div style={{
            position: "relative",
            minHeight: 280,
            overflow: "hidden",
          }}>
            <BlogCardGradient category={post.category} />
          </div>

          {/* Content */}
          <div style={{ padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                padding: "4px 12px", borderRadius: 100,
                background: CATEGORY_COLORS[post.category] ?? "#f0fdf4",
                color: CATEGORY_TEXT[post.category] ?? "#15803d",
              }}>
                {post.category}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.readTime} de lecture</span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.3, letterSpacing: "-.5px", margin: 0 }}>
              {post.title}
            </h2>

            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, flex: 1 }}>
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                    background: "var(--code-bg)", color: "var(--text-secondary)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 700, color: "#16a34a", marginTop: 4 }}>
              Lire l&apos;article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: 20,
          overflow: "hidden",
          height: "100%",
          boxShadow: "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05)",
          transition: "box-shadow .25s ease, transform .25s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 2px 4px rgba(0,0,0,.05), 0 8px 24px rgba(0,0,0,.1)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}
      >
        {/* Illustration */}
        <div style={{
          position: "relative",
          height: 180,
          overflow: "hidden",
          borderBottom: "1px solid var(--border-light)",
        }}>
          <BlogCardGradient category={post.category} />
        </div>

        <div style={{ padding: "20px 24px 22px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 700,
              padding: "4px 12px", borderRadius: 100,
              background: CATEGORY_COLORS[post.category] ?? "#f0fdf4",
              color: CATEGORY_TEXT[post.category] ?? "#15803d",
            }}>
              {post.category}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.readTime} de lecture</span>
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.4, letterSpacing: "-.3px", margin: 0 }}>
            {post.title}
          </h2>

          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, margin: 0, flex: 1 }}>
            {post.description}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5,
                  background: "var(--code-bg)", color: "var(--text-secondary)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#16a34a", marginTop: 2 }}>
            Lire l&apos;article
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
