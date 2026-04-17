import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité | CVpass",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://cvpass.fr/politique-confidentialite" },
};

const sections = [
  { id: "responsable", title: "Responsable du traitement" },
  { id: "donnees-collectees", title: "Données collectées" },
  { id: "finalites", title: "Finalités du traitement" },
  { id: "base-legale", title: "Base légale du traitement" },
  { id: "duree-conservation", title: "Durée de conservation" },
  { id: "sous-traitants", title: "Sous-traitants et transferts de données" },
  { id: "droits", title: "Droits des utilisateurs" },
  { id: "cookies", title: "Cookies" },
  { id: "securite", title: "Sécurité des données" },
  { id: "modifications", title: "Modifications de la politique" },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh" }}>
      {/* Sticky nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg-primary)",
          borderBottom: "1px solid var(--border-color)",
          padding: "16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--text-primary)",
              textDecoration: "none",
            }}
          >
            CV<span style={{ color: "#16a34a" }}>pass</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Breadcrumb */}
        <nav style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>
          <Link
            href="/"
            style={{ color: "#16a34a", textDecoration: "none" }}
          >
            Accueil
          </Link>
          <span style={{ margin: "0 8px" }}>&gt;</span>
          <span>Politique de confidentialité</span>
        </nav>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Politique de confidentialité
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 40 }}>
          Dernière mise à jour : 14 mars 2026
        </p>

        {/* Table of contents */}
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: 8,
            padding: "24px 28px",
            marginBottom: 48,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: 16,
              marginBottom: 12,
            }}
          >
            Sommaire
          </p>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {sections.map((s) => (
              <li key={s.id} style={{ marginBottom: 6, fontSize: 15 }}>
                <a
                  href={`#${s.id}`}
                  style={{ color: "#16a34a", textDecoration: "none" }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Section 1 */}
        <section id="responsable" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>1. Responsable du traitement</h2>
          <p style={paragraph}>
            Le responsable du traitement des données personnelles collectées sur
            le site CVpass est :
          </p>
          <div
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              borderRadius: 8,
              padding: "20px 24px",
              lineHeight: 1.8,
              fontSize: 15,
            }}
          >
            <strong>VertexLab</strong>
            <br />
            Représentée par Giovanni Russo, Président
            <br />
            198 boulevard Ange Martin, 13190 Allauch, France
            <br />
            Email :{" "}
            <a href="mailto:contact@cvpass.fr" style={linkStyle}>
              contact@cvpass.fr
            </a>
            <br />
            Site :{" "}
            <a
              href="https://cvpass.fr"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              https://cvpass.fr
            </a>
          </div>
        </section>

        {/* Section 2 */}
        <section id="donnees-collectees" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>2. Données collectées</h2>
          <p style={paragraph}>
            Dans le cadre de l&apos;utilisation du service CVpass, nous sommes
            amenés à collecter et traiter les catégories de données suivantes :
          </p>
          <ul style={listStyle}>
            <li style={listItem}>
              <strong>Données de compte</strong> (via Clerk) : prénom, nom,
              adresse email, photo de profil.
            </li>
            <li style={listItem}>
              <strong>Données d&apos;utilisation</strong> : score ATS, nombre
              d&apos;analyses effectuées, métadonnées anonymisées.
            </li>
            <li style={listItem}>
              <strong>Données de paiement</strong> : gérées exclusivement par
              Stripe, CVpass ne stocke aucune donnée bancaire (numéro de carte,
              CVV, etc.).
            </li>
            <li style={listItem}>
              <strong>CVs uploadés</strong> : traités exclusivement en mémoire
              vive (RAM) pour la durée de l&apos;analyse, puis supprimés
              immédiatement. Aucun CV n&apos;est stocké sur nos serveurs ni
              transmis à des tiers à des fins autres que l&apos;analyse demandée.
            </li>
            <li style={listItem}>
              <strong>Cookies</strong> : cookies d&apos;authentification (Clerk),
              cookies analytics (PostHog, anonymisés).
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="finalites" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>3. Finalités du traitement</h2>
          <ul style={listStyle}>
            <li style={listItem}>
              Fourniture et fonctionnement du service CVpass (analyse de CV,
              génération de suggestions, export PDF).
            </li>
            <li style={listItem}>
              Amélioration continue du produit via analytics anonymisées.
            </li>
            <li style={listItem}>
              Envoi d&apos;emails transactionnels (confirmations de paiement,
              notifications de compte).
            </li>
            <li style={listItem}>
              Gestion de la facturation et des abonnements via Stripe.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="base-legale" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>4. Base légale du traitement</h2>
          <ul style={listStyle}>
            <li style={listItem}>
              <strong>Exécution du contrat</strong> : nécessaire à la fourniture
              du service (article 6.1.b du RGPD).
            </li>
            <li style={listItem}>
              <strong>Intérêt légitime</strong> : analytics anonymisées pour
              l&apos;amélioration du service (article 6.1.f du RGPD).
            </li>
            <li style={listItem}>
              <strong>Consentement</strong> : communications marketing
              optionnelles (article 6.1.a du RGPD).
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="duree-conservation" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>5. Durée de conservation</h2>
          <ul style={listStyle}>
            <li style={listItem}>
              <strong>Données de compte</strong> : conservées jusqu&apos;à la
              suppression du compte par l&apos;utilisateur.
            </li>
            <li style={listItem}>
              <strong>Métadonnées d&apos;analyses</strong> : 24 mois après la
              dernière activité sur le compte.
            </li>
            <li style={listItem}>
              <strong>CVs uploadés</strong> : supprimés immédiatement après
              l&apos;analyse (traitement en mémoire vive uniquement).
            </li>
            <li style={listItem}>
              <strong>Données de paiement</strong> : conservées par Stripe
              conformément à leurs obligations légales et réglementaires.
            </li>
            <li style={listItem}>
              <strong>Logs techniques</strong> : 12 mois maximum.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section id="sous-traitants" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>
            6. Sous-traitants et transferts de données
          </h2>
          <p style={paragraph}>
            CVpass fait appel aux sous-traitants suivants pour le fonctionnement
            du service :
          </p>
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "var(--bg-surface)",
                    borderBottom: "2px solid var(--border-color)",
                  }}
                >
                  <th style={thStyle}>Sous-traitant</th>
                  <th style={thStyle}>Service</th>
                  <th style={thStyle}>Localisation</th>
                  <th style={thStyle}>Garanties</th>
                </tr>
              </thead>
              <tbody>
                {subProcessors.map((row, i) => (
                  <tr
                    key={row.name}
                    style={{
                      borderBottom: "1px solid var(--border-color)",
                      background: i % 2 === 1 ? "var(--bg-surface)" : "var(--bg-primary)",
                    }}
                  >
                    <td style={tdStyle}>
                      <strong>{row.name}</strong>
                    </td>
                    <td style={tdStyle}>{row.service}</td>
                    <td style={tdStyle}>{row.location}</td>
                    <td style={tdStyle}>{row.guarantees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
            }}
          >
            Les transferts de données hors de l&apos;Union Européenne sont
            encadrés par les Clauses Contractuelles Types (CCT) adoptées par la
            Commission Européenne, conformément à l&apos;article 46.2.c du RGPD.
          </p>
        </section>

        {/* Section 7 */}
        <section id="droits" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>7. Droits des utilisateurs</h2>
          <p style={paragraph}>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez des droits suivants sur vos données
            personnelles :
          </p>
          <ul style={listStyle}>
            <li style={listItem}>
              <strong>Droit d&apos;accès</strong> (article 15 du RGPD) : obtenir
              la confirmation que des données vous concernant sont traitées et en
              obtenir une copie.
            </li>
            <li style={listItem}>
              <strong>Droit de rectification</strong> (article 16) : corriger des
              données inexactes ou incomplètes.
            </li>
            <li style={listItem}>
              <strong>Droit à l&apos;effacement</strong> (article 17) : demander
              la suppression de vos données personnelles.
            </li>
            <li style={listItem}>
              <strong>Droit à la portabilité</strong> (article 20) : recevoir vos
              données dans un format structuré et lisible.
            </li>
            <li style={listItem}>
              <strong>Droit d&apos;opposition</strong> (article 21) : vous
              opposer au traitement de vos données pour des motifs légitimes.
            </li>
            <li style={listItem}>
              <strong>Droit de limitation</strong> (article 18) : demander la
              limitation du traitement dans certains cas.
            </li>
          </ul>
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 8,
              padding: "20px 24px",
              marginTop: 20,
              fontSize: 15,
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Pour exercer ces droits :</strong>{" "}
              <a href="mailto:contact@cvpass.fr" style={linkStyle}>
                contact@cvpass.fr
              </a>
            </p>
            <p style={{ margin: "8px 0 0" }}>
              <strong>Délai de réponse :</strong> 30 jours ouvrés maximum.
            </p>
            <p style={{ margin: "8px 0 0" }}>
              En cas de litige non résolu, vous pouvez introduire une réclamation
              auprès de la{" "}
              <strong>
                CNIL (Commission Nationale de l&apos;Informatique et des
                Libertés)
              </strong>{" "}
              :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
              >
                www.cnil.fr
              </a>
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="cookies" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>8. Cookies</h2>
          <ul style={listStyle}>
            <li style={listItem}>
              <strong>Cookies strictement nécessaires</strong> : Clerk
              (authentification, gestion de session), ne peuvent pas être
              désactivés.
            </li>
            <li style={listItem}>
              <strong>Cookies analytics</strong> : PostHog, données anonymisées,
              aucun tracking cross-site, aucune donnée personnelle identifiable
              transmise.
            </li>
            <li style={listItem}>
              <strong>Aucun cookie publicitaire</strong> n&apos;est utilisé sur
              CVpass.
            </li>
          </ul>
          <p style={paragraph}>
            Pour plus de détails, consultez notre{" "}
            <Link href="/politique-cookies" style={linkStyle}>
              Politique de cookies
            </Link>
            .
          </p>
        </section>

        {/* Section 9 */}
        <section id="securite" style={{ marginBottom: 40 }}>
          <h2 style={sectionTitle}>9. Sécurité des données</h2>
          <p style={paragraph}>
            CVpass met en place les mesures de sécurité suivantes pour protéger
            vos données personnelles :
          </p>
          <ul style={listStyle}>
            <li style={listItem}>
              Chiffrement HTTPS/TLS sur l&apos;ensemble du site.
            </li>
            <li style={listItem}>
              Authentification sécurisée via Clerk (gestion des sessions, MFA
              disponible).
            </li>
            <li style={listItem}>
              Aucun stockage de données bancaires (délégué à Stripe, certifié PCI
              DSS).
            </li>
            <li style={listItem}>
              Aucun stockage de CVs sur nos serveurs.
            </li>
            <li style={listItem}>
              Accès aux données de production restreint aux administrateurs
              autorisés.
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section id="modifications" style={{ marginBottom: 0 }}>
          <h2 style={sectionTitle}>10. Modifications de la politique</h2>
          <p style={paragraph}>
            VertexLab se réserve le droit de modifier la présente politique
            de confidentialité. En cas de modification substantielle, les
            utilisateurs seront informés par email ou par une notification sur le
            site. La date de dernière mise à jour est indiquée en haut de cette
            page.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-color)",
          padding: "32px 24px",
          fontSize: 14,
          color: "var(--text-secondary)",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px 24px",
            }}
          >
            <Link href="/mentions-legales" style={footerLink}>
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" style={footerLink}>
              Politique de confidentialité
            </Link>
            <Link href="/conditions-generales" style={footerLink}>
              Conditions générales
            </Link>
            <Link href="/politique-cookies" style={footerLink}>
              Politique de cookies
            </Link>
            <a href="mailto:contact@cvpass.fr" style={footerLink}>
              contact@cvpass.fr
            </a>
          </div>
          <p style={{ margin: 0 }}>&copy; 2026 CVpass</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── Style constants ─── */

const sectionTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: "#16a34a",
  marginBottom: 16,
  marginTop: 0,
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.75,
  marginBottom: 16,
};

const listStyle: React.CSSProperties = {
  paddingLeft: 20,
  margin: 0,
  listStyleType: "disc",
};

const listItem: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.75,
  marginBottom: 10,
};

const linkStyle: React.CSSProperties = {
  color: "#16a34a",
  textDecoration: "underline",
  textUnderlineOffset: 2,
};

const footerLink: React.CSSProperties = {
  color: "var(--text-secondary)",
  textDecoration: "none",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  fontWeight: 600,
  color: "var(--text-primary)",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  verticalAlign: "top",
};

/* ─── Sub-processors data ─── */

const subProcessors = [
  {
    name: "Clerk",
    service: "Authentification",
    location: "États-Unis",
    guarantees: "CCT + DPA",
  },
  {
    name: "Supabase",
    service: "Base de données",
    location: "Union Européenne (Frankfurt)",
    guarantees: "RGPD natif",
  },
  {
    name: "OpenAI",
    service: "Analyse IA des CVs",
    location: "États-Unis",
    guarantees: "CCT + DPA + API data not used for training",
  },
  {
    name: "Stripe",
    service: "Paiement sécurisé",
    location: "États-Unis",
    guarantees: "CCT + certification PCI DSS",
  },
  {
    name: "Brevo",
    service: "Emails transactionnels",
    location: "France / Union Européenne",
    guarantees: "RGPD natif",
  },
  {
    name: "Vercel",
    service: "Hébergement",
    location: "États-Unis",
    guarantees: "CCT + DPA",
  },
  {
    name: "PostHog",
    service: "Analytics anonymisées",
    location: "Union Européenne (Frankfurt)",
    guarantees: "RGPD natif",
  },
];
