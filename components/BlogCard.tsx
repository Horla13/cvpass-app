"use client";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, string> = {
  "Score ATS": "#f0fdf4",
  "CV Canva": "#fefce8",
  "Guide ATS": "#eff6ff",
  "Mots-clés": "#fdf4ff",
  "Format CV": "#fff7ed",
  Outils: "#f0fdf4",
};
const CATEGORY_TEXT: Record<string, string> = {
  "Score ATS": "#15803d",
  "CV Canva": "#a16207",
  "Guide ATS": "#1d4ed8",
  "Mots-clés": "#7e22ce",
  "Format CV": "#c2410c",
  Outils: "#15803d",
};

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          background: "#fff",
          border: "1px solid rgba(229,231,235,.9)",
          borderRadius: 20,
          padding: "28px 28px 24px",
          height: "100%",
          boxShadow: "0 1px 2px rgba(0,0,0,.04), 0 4px 12px rgba(0,0,0,.05)",
          transition: "box-shadow .25s ease, transform .25s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 12,
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 100,
              background: CATEGORY_COLORS[post.category] ?? "#f0fdf4",
              color: CATEGORY_TEXT[post.category] ?? "#15803d",
            }}
          >
            {post.category}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {post.readTime} de lecture
          </span>
        </div>
        <h2
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.4,
            letterSpacing: "-.3px",
            margin: 0,
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            fontSize: 13.5,
            color: "#6b7280",
            lineHeight: 1.65,
            margin: 0,
            flex: 1,
          }}
        >
          {post.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#16a34a",
            marginTop: 4,
          }}
        >
          Lire l&apos;article
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
