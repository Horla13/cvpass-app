import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de cookies — CVpass",
  robots: { index: false, follow: false },
};

const sections = [
  { id: "definition", label: "Qu\u2019est-ce qu\u2019un cookie ?" },
  { id: "cookies-utilises", label: "Cookies utilis\u00e9s par CVpass" },
  { id: "cookies-tiers", label: "Cookies tiers" },
  { id: "gestion", label: "Comment g\u00e9rer vos cookies" },
  { id: "base-legale", label: "Base l\u00e9gale" },
  { id: "modifications", label: "Modifications" },
  { id: "contact", label: "Contact" },
];

const cookiesNecessaires = [
  { nom: "__clerk_db_jwt", fournisseur: "Clerk", finalite: "Authentification \u2014 jeton de session s\u00e9curis\u00e9", duree: "Session", type: "N\u00e9cessaire" },
  { nom: "__session", fournisseur: "Clerk", finalite: "Gestion de la session utilisateur", duree: "Session", type: "N\u00e9cessaire" },
  { nom: "__client_uat", fournisseur: "Clerk", finalite: "\u00c9tat d\u2019authentification du client", duree: "Session", type: "N\u00e9cessaire" },
  { nom: "__cf_bm", fournisseur: "Cloudflare (via Clerk)", finalite: "Protection anti-bot", duree: "30 minutes", type: "N\u00e9cessaire" },
];

const cookiesAnalytics = [
  { nom: "ph_*", fournisseur: "PostHog", finalite: "Analytics anonymis\u00e9es \u2014 pages visit\u00e9es, interactions cl\u00e9s", duree: "1 an", type: "Analytics" },
  { nom: "distinct_id", fournisseur: "PostHog", finalite: "Identifiant anonyme pour le suivi des sessions", duree: "1 an", type: "Analytics" },
];

const thStyle: React.CSSProperties = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 700,
  color: "var(--text-primary)",
  borderBottom: "2px solid var(--border-color)",
  background: "var(--bg-surface)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--text-body)",
  borderBottom: "1px solid var(--border-light)",
  verticalAlign: "top",
};

const tdCodeStyle: React.CSSProperties = {
  ...tdStyle,
  fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
  fontSize: 13,
  color: "var(--text-primary)",
  fontWeight: 500,
};

const badgeNecessaire: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 700,
  padding: "3px 8px",
  borderRadius: 6,
  background: "#dcfce7",
  color: "#15803d",
  letterSpacing: "0.2px",
};

const badgeAnalytics: React.CSSProperties = {
  display: "inline-block",
  fontSize: 11,
  fontWeight: 700,
  padding: "3px 8px",
  borderRadius: 6,
  background: "#eff6ff",
  color: "#1d4ed8",
  letterSpacing: "0.2px",
};

export default function PolitiqueCookiesPage() {
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
            Analyser mon CV &rarr;
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
            <li aria-hidden="true" style={{ color: "var(--text-muted)" }}>&rsaquo;</li>
            <li style={{ color: "var(--text-primary)", fontWeight: 600 }}>Politique de cookies</li>
          </ol>
        </nav>

        {/* TITLE + DATE */}
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 12px", color: "var(--text-primary)" }}>
          Politique de cookies
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 40px" }}>
          Derni&egrave;re mise &agrave; jour : 14 mars 2026
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
        <section id="definition" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            1. Qu&apos;est-ce qu&apos;un cookie&nbsp;?
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            Un cookie est un petit fichier texte d&eacute;pos&eacute; sur votre terminal (ordinateur, smartphone, tablette) lors de votre visite sur un site web. Il permet au site de m&eacute;moriser des informations relatives &agrave; votre navigation (pr&eacute;f&eacute;rences, identifiants de session, etc.) afin de faciliter vos visites ult&eacute;rieures et de rendre le site plus fonctionnel.
          </p>
        </section>

        {/* SECTION 2 */}
        <section id="cookies-utilises" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            2. Cookies utilis&eacute;s par CVpass
          </h2>

          {/* Sub-heading: necessary cookies */}
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 12px" }}>
            Cookies strictement n&eacute;cessaires
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px" }}>
            Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas &ecirc;tre d&eacute;sactiv&eacute;s.
          </p>

          {/* Table: necessary cookies */}
          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Nom du cookie</th>
                  <th style={thStyle}>Fournisseur</th>
                  <th style={thStyle}>Finalit&eacute;</th>
                  <th style={thStyle}>Dur&eacute;e</th>
                  <th style={thStyle}>Type</th>
                </tr>
              </thead>
              <tbody>
                {cookiesNecessaires.map((c) => (
                  <tr key={c.nom}>
                    <td style={tdCodeStyle}>{c.nom}</td>
                    <td style={tdStyle}>{c.fournisseur}</td>
                    <td style={tdStyle}>{c.finalite}</td>
                    <td style={tdStyle}>{c.duree}</td>
                    <td style={tdStyle}><span style={badgeNecessaire}>{c.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sub-heading: analytics cookies */}
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 12px" }}>
            Cookies analytics
          </h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)", margin: "0 0 16px" }}>
            Ces cookies nous permettent de mesurer l&apos;audience du site de mani&egrave;re anonymis&eacute;e.
          </p>

          {/* Table: analytics cookies */}
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Nom du cookie</th>
                  <th style={thStyle}>Fournisseur</th>
                  <th style={thStyle}>Finalit&eacute;</th>
                  <th style={thStyle}>Dur&eacute;e</th>
                  <th style={thStyle}>Type</th>
                </tr>
              </thead>
              <tbody>
                {cookiesAnalytics.map((c) => (
                  <tr key={c.nom}>
                    <td style={tdCodeStyle}>{c.nom}</td>
                    <td style={tdStyle}>{c.fournisseur}</td>
                    <td style={tdStyle}>{c.finalite}</td>
                    <td style={tdStyle}>{c.duree}</td>
                    <td style={tdStyle}><span style={badgeAnalytics}>{c.type}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PostHog privacy note */}
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
            padding: "16px 20px", marginTop: 16,
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-body)", margin: 0 }}>
              <strong style={{ color: "#15803d" }}>Respect de la vie priv&eacute;e&nbsp;:</strong> PostHog est configur&eacute; en mode respectueux de la vie priv&eacute;e&nbsp;: les adresses IP sont anonymis&eacute;es, aucun tracking cross-site n&apos;est effectu&eacute;, et aucune donn&eacute;e personnelle identifiable n&apos;est transmise. Les donn&eacute;es sont h&eacute;berg&eacute;es dans l&apos;Union Europ&eacute;enne (Frankfurt).
            </p>
          </div>
        </section>

        {/* SECTION 3 */}
        <section id="cookies-tiers" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            3. Cookies tiers
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              CVpass n&apos;utilise aucun cookie publicitaire, aucun cookie de remarketing et aucun cookie de r&eacute;seaux sociaux.
            </p>
            <p style={{ margin: 0 }}>
              Lors du paiement, Stripe peut d&eacute;poser des cookies de s&eacute;curit&eacute; sur sa propre page de paiement (<span style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace", fontSize: 13, fontWeight: 500 }}>checkout.stripe.com</span>) &mdash; ces cookies sont r&eacute;gis par la{" "}
              <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>
                politique de confidentialit&eacute; de Stripe
              </a>.
            </p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section id="gestion" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            4. Comment g&eacute;rer vos cookies
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: "0 0 20px" }}>
            Vous pouvez &agrave; tout moment configurer votre navigateur pour accepter ou refuser les cookies. Voici la marche &agrave; suivre pour les principaux navigateurs&nbsp;:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {[
              { name: "Google Chrome", path: "Param\u00e8tres > Confidentialit\u00e9 et s\u00e9curit\u00e9 > Cookies et autres donn\u00e9es de site" },
              { name: "Mozilla Firefox", path: "Param\u00e8tres > Vie priv\u00e9e et s\u00e9curit\u00e9 > Cookies et donn\u00e9es de site" },
              { name: "Safari", path: "Pr\u00e9f\u00e9rences > Confidentialit\u00e9 > G\u00e9rer les donn\u00e9es de site web" },
              { name: "Microsoft Edge", path: "Param\u00e8tres > Cookies et autorisations de site > G\u00e9rer et supprimer les cookies" },
            ].map((browser) => (
              <div key={browser.name} style={{
                display: "flex", alignItems: "baseline", gap: 8,
                fontSize: 15, lineHeight: 1.78, color: "var(--text-body)",
              }}>
                <strong style={{ color: "var(--text-primary)", flexShrink: 0 }}>{browser.name}&nbsp;:</strong>
                <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{browser.path}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: "#fefce8", border: "1px solid #fde68a", borderRadius: 12,
            padding: "16px 20px",
          }}>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "#92400e", margin: 0 }}>
              <strong>Important&nbsp;:</strong> la d&eacute;sactivation des cookies strictement n&eacute;cessaires (Clerk) emp&ecirc;chera la connexion &agrave; votre compte CVpass.
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section id="base-legale" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            5. Base l&eacute;gale
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 600, color: "var(--text-primary)" }}>Cookies strictement n&eacute;cessaires</p>
              <p style={{ margin: 0 }}>
                Exempt&eacute;s de consentement conform&eacute;ment &agrave; l&apos;article 82 de la loi Informatique et Libert&eacute;s (transposition de la directive ePrivacy), car ils sont indispensables &agrave; la fourniture du service express&eacute;ment demand&eacute; par l&apos;utilisateur.
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontWeight: 600, color: "var(--text-primary)" }}>Cookies analytics (PostHog)</p>
              <p style={{ margin: 0 }}>
                D&eacute;pos&eacute;s sur la base de l&apos;int&eacute;r&ecirc;t l&eacute;gitime, les donn&eacute;es &eacute;tant strictement anonymis&eacute;es et ne permettant pas l&apos;identification de l&apos;utilisateur, conform&eacute;ment aux recommandations de la CNIL sur les solutions de mesure d&apos;audience exempt&eacute;es de consentement.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6 */}
        <section id="modifications" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            6. Modifications
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            VertexLab se r&eacute;serve le droit de modifier la pr&eacute;sente Politique de cookies. La date de derni&egrave;re mise &agrave; jour est indiqu&eacute;e en haut de cette page.
          </p>
        </section>

        {/* SECTION 7 */}
        <section id="contact" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            7. Contact
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              Pour toute question relative &agrave; l&apos;utilisation des cookies sur CVpass&nbsp;:{" "}
              <a href="mailto:contact@cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>contact@cvpass.fr</a>
            </p>
            <p style={{ margin: 0 }}>
              Pour plus d&apos;informations sur le traitement de vos donn&eacute;es personnelles, consultez notre{" "}
              <Link href="/politique-confidentialite" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>
                Politique de confidentialit&eacute;
              </Link>.
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
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>&copy; 2026 CVpass</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          <Link href="/mentions-legales" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Mentions l&eacute;gales</Link>
          <Link href="/politique-confidentialite" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Politique de confidentialit&eacute;</Link>
          <Link href="/conditions-generales" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Conditions g&eacute;n&eacute;rales</Link>
          <Link href="/politique-cookies" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>Politique cookies</Link>
          <a href="mailto:contact@cvpass.fr" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>contact@cvpass.fr</a>
        </div>
      </footer>
    </div>
  );
}
