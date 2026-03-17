import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — CVpass",
  robots: { index: false, follow: false },
};

const sections = [
  { id: "editeur", label: "Éditeur du site" },
  { id: "directeur", label: "Directeur de la publication" },
  { id: "hebergeur", label: "Hébergeur" },
  { id: "propriete-intellectuelle", label: "Propriété intellectuelle" },
  { id: "liens-hypertextes", label: "Liens hypertextes" },
  { id: "limitation-responsabilite", label: "Limitation de responsabilité" },
  { id: "droit-applicable", label: "Droit applicable" },
];

export default function MentionsLegalesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", fontFamily: "var(--font-geist-sans), -apple-system, sans-serif", color: "var(--text-primary)" }}>

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
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", fontSize: 14, fontWeight: 700,
            background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff",
            padding: "9px 20px", borderRadius: 10, textDecoration: "none",
            boxShadow: "0 1px 3px rgba(22,163,74,.25)",
          }}>
            Analyser mon CV →
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* BREADCRUMB */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: 32 }}>
          <ol style={{ display: "flex", alignItems: "center", gap: 8, listStyle: "none", padding: 0, margin: 0, fontSize: 13, color: "var(--text-muted)" }}>
            <li>
              <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>Accueil</Link>
            </li>
            <li aria-hidden="true" style={{ color: "var(--text-muted)" }}>›</li>
            <li style={{ color: "var(--text-primary)", fontWeight: 600 }}>Mentions légales</li>
          </ol>
        </nav>

        {/* TITLE + DATE */}
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 12px", color: "var(--text-primary)" }}>
          Mentions légales
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 40px" }}>
          Dernière mise à jour : 14 mars 2026
        </p>

        {/* TABLE OF CONTENTS */}
        <div style={{
          background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: 16,
          padding: "24px 28px", marginBottom: 48,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 14px", letterSpacing: "-0.2px" }}>
            Sommaire
          </p>
          <ol style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {sections.map((s) => (
              <li key={s.id} style={{ fontSize: 14, lineHeight: 1.5 }}>
                <a href={`#${s.id}`} style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* SECTION 1 */}
        <section id="editeur" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            1. Éditeur du site
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)" }}>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: "var(--text-primary)" }}>Nom du site :</strong> CVpass
            </p>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: "var(--text-primary)" }}>URL :</strong>{" "}
              <a href="https://cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>https://cvpass.fr</a>
            </p>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: "var(--text-primary)" }}>Société :</strong> VertexLab SASU
            </p>
            <p style={{ margin: "0 0 8px" }}>
              <strong style={{ color: "var(--text-primary)" }}>Adresse :</strong> 198 boulevard Ange Martin, 13190 Allauch, France
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: "var(--text-primary)" }}>Email :</strong>{" "}
              <a href="mailto:contact@cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>contact@cvpass.fr</a>
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section id="directeur" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            2. Directeur de la publication
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            Giovanni Russo, en qualité de Président de VertexLab SASU.
          </p>
        </section>

        {/* SECTION 3 */}
        <section id="hebergeur" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            3. Hébergeur
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)" }}>
            <p style={{ margin: "0 0 4px", fontWeight: 600, color: "var(--text-primary)" }}>Vercel Inc.</p>
            <p style={{ margin: "0 0 4px" }}>340 Pine Street Suite 701, San Francisco, CA 94104, États-Unis</p>
            <p style={{ margin: 0 }}>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>
                https://vercel.com
              </a>
            </p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section id="propriete-intellectuelle" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            4. Propriété intellectuelle
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              L&apos;ensemble du contenu du site CVpass (textes, graphismes, logiciels, images, bases de données, etc.) est protégé par le droit d&apos;auteur et le droit de la propriété intellectuelle, conformément aux dispositions du Code de la propriété intellectuelle.
            </p>
            <p style={{ margin: 0 }}>
              Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans autorisation écrite préalable de VertexLab SASU.
            </p>
            <p style={{ margin: 0 }}>
              La marque CVpass et le logo associé sont la propriété exclusive de VertexLab SASU. Toute utilisation non autorisée de ces éléments constitue une contrefaçon sanctionnée par la loi.
            </p>
            <p style={{ margin: 0 }}>
              Les CVs uploadés par les utilisateurs restent leur propriété exclusive. CVpass ne revendique aucun droit de propriété sur les documents soumis par ses utilisateurs.
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section id="liens-hypertextes" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            5. Liens hypertextes
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              Le site CVpass peut contenir des liens hypertextes vers d&apos;autres sites internet. CVpass n&apos;exerce aucun contrôle sur le contenu de ces sites tiers et décline toute responsabilité quant à leur contenu, leurs pratiques en matière de protection des données ou leur disponibilité.
            </p>
            <p style={{ margin: 0 }}>
              La mise en place de liens hypertextes vers le site CVpass nécessite une autorisation préalable et écrite de VertexLab SASU. Toute demande peut être adressée à{" "}
              <a href="mailto:contact@cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>contact@cvpass.fr</a>.
            </p>
          </div>
        </section>

        {/* SECTION 6 */}
        <section id="limitation-responsabilite" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            6. Limitation de responsabilité
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              CVpass est un outil d&apos;aide à l&apos;optimisation de CV. Les suggestions générées par l&apos;intelligence artificielle sont fournies à titre indicatif et ne constituent en aucun cas un conseil professionnel garanti. L&apos;utilisateur reste seul responsable de l&apos;utilisation qu&apos;il fait des résultats fournis.
            </p>
            <p style={{ margin: 0 }}>
              VertexLab SASU ne saurait être tenue responsable des décisions prises par les utilisateurs sur la base des résultats fournis par CVpass, ni des conséquences directes ou indirectes pouvant en découler.
            </p>
            <p style={{ margin: 0 }}>
              VertexLab SASU s&apos;efforce de fournir un service disponible 24h/24, 7j/7 mais ne peut garantir une disponibilité continue et sans interruption. Des opérations de maintenance, des mises à jour ou des circonstances indépendantes de notre volonté peuvent entraîner des interruptions temporaires du service.
            </p>
          </div>
        </section>

        {/* SECTION 7 */}
        <section id="droit-applicable" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            7. Droit applicable
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              Le présent site et ses mentions légales sont soumis au droit français.
            </p>
            <p style={{ margin: 0 }}>
              En cas de litige, et après tentative de résolution amiable, les tribunaux compétents seront ceux du ressort du Tribunal de commerce de Marseille.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid var(--border-color)", background: "var(--bg-primary)",
        padding: "24px 40px",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>© 2026 CVpass</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          <Link href="/mentions-legales" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Mentions légales</Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Politique de confidentialité</Link>
          <Link href="/conditions-generales" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Conditions générales</Link>
          <Link href="/politique-cookies" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Politique cookies</Link>
          <a href="mailto:contact@cvpass.fr" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>contact@cvpass.fr</a>
        </div>
      </footer>
    </div>
  );
}
