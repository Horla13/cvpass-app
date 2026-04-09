"use client";

import { useState, useRef } from "react";

export default function EmbedScorePage() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 5 Mo)");
      return;
    }
    setLoading(true);
    setError("");
    setFilename(file.name);

    try {
      // Parse the CV
      const formData = new FormData();
      formData.append("file", file);
      const parseRes = await fetch("https://cvpass.fr/api/parse-cv", { method: "POST", body: formData });
      if (!parseRes.ok) throw new Error("Erreur de lecture du CV");
      const { text } = await parseRes.json();

      // Quick score estimation based on text analysis
      let s = 30;
      const lower = text.toLowerCase();
      // Check for key sections
      if (/exp[ée]rience/i.test(text)) s += 8;
      if (/formation|dipl[oô]me/i.test(text)) s += 6;
      if (/comp[ée]tence/i.test(text)) s += 8;
      if (/profil|r[ée]sum[ée]|accroche/i.test(text)) s += 7;
      // Check for contact info
      if (/@/.test(text)) s += 4;
      if (/\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/.test(text)) s += 3;
      // Check for quantification
      const numbers = text.match(/\d+%|\d+\s*(personnes|collaborateurs|clients|projets)/gi);
      if (numbers && numbers.length >= 2) s += 8;
      else if (numbers && numbers.length >= 1) s += 4;
      // Check word count
      const words = text.split(/\s+/).length;
      if (words > 200) s += 5;
      if (words > 400) s += 3;
      // Check for action verbs
      const verbs = lower.match(/pilot[ée]|g[ée]r[ée]|d[ée]velopp|optimis|coordonn|cr[ée][ée]|am[ée]lior|analys|supervis|implement/gi);
      if (verbs && verbs.length >= 3) s += 6;
      // Cap
      s = Math.min(s, 72); // Widget never shows above 72 — full analysis needed
      setScore(s);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = score !== null ? (score < 40 ? "#ef4444" : score < 60 ? "#f59e0b" : "#16a34a") : "#6b7280";

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {score === null ? (
        // Upload state
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -1 }}>
              <span style={{ color: "#111827" }}>CV</span>
              <span style={{ color: "#16a34a" }}>pass</span>
            </span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Score ATS gratuit</span>
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px 24px",
              border: "2px dashed #d1d5db",
              borderRadius: 12,
              background: loading ? "#f9fafb" : "#ffffff",
              cursor: loading ? "wait" : "pointer",
              fontSize: 15,
              fontWeight: 600,
              color: "#374151",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid #16a34a", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite" }} />
                Analyse en cours...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                Testez votre CV gratuitement
              </>
            )}
          </button>
          {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{error}</p>}
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        // Result state
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{filename}</p>
          <div style={{ fontSize: 48, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}<span style={{ fontSize: 20, color: "#9ca3af" }}>/100</span></div>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "8px 0 16px" }}>
            {score < 40 ? "Votre CV risque d&apos;etre filtre par les ATS" : score < 60 ? "Des ameliorations sont possibles" : "Bon score, quelques ajustements recommandes"}
          </p>
          <a
            href="https://cvpass.fr/signup"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "#16a34a",
              color: "#fff",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Voir l&apos;analyse complete gratuite
            <svg width="14" height="14" fill="none"><path d="M3 7h8m0 0L8 4m3 3L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 12 }}>
            Propulse par <a href="https://cvpass.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>CVpass</a>
          </p>
        </div>
      )}
    </div>
  );
}
