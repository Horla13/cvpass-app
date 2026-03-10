import Link from "next/link";

export default function AccesRefuse() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        fontFamily: "var(--font-geist-sans, sans-serif)",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.75rem",
          }}
        >
          Cette page n&apos;est pas accessible
        </h1>
        <p
          style={{
            fontSize: "1rem",
            color: "#6b7280",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          Connectez-vous pour accéder à CVpass.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#16a34a",
            color: "#ffffff",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
