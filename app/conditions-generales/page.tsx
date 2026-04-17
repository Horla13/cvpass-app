import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions g\u00e9n\u00e9rales d\u2019utilisation et de vente \u2014 CVpass",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://cvpass.fr/conditions-generales" },
};

const sections = [
  { id: "objet", label: "Objet" },
  { id: "acceptation", label: "Acceptation des conditions" },
  { id: "acces", label: "Acc\u00e8s au service" },
  { id: "offres", label: "Description des offres" },
  { id: "prix", label: "Prix et paiement" },
  { id: "retractation", label: "Droit de r\u00e9tractation et politique de remboursement" },
  { id: "resiliation", label: "R\u00e9siliation" },
  { id: "propriete-intellectuelle", label: "Propri\u00e9t\u00e9 intellectuelle" },
  { id: "limitation-responsabilite", label: "Limitation de responsabilit\u00e9" },
  { id: "donnees-personnelles", label: "Donn\u00e9es personnelles" },
  { id: "modification", label: "Modification des conditions" },
  { id: "droit-applicable", label: "Droit applicable et juridiction comp\u00e9tente" },
];

const planCardStyle: React.CSSProperties = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-color)",
  borderRadius: 14,
  padding: "24px 26px",
};

const planTitleStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: "var(--text-primary)",
  margin: "0 0 10px",
  letterSpacing: "-0.2px",
};

const planListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const planLiStyle: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "var(--text-body)",
};

export default function ConditionsGeneralesPage() {
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
            <li style={{ color: "var(--text-primary)", fontWeight: 600 }}>Conditions g&eacute;n&eacute;rales</li>
          </ol>
        </nav>

        {/* TITLE + DATE */}
        <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 12px", color: "var(--text-primary)" }}>
          Conditions g&eacute;n&eacute;rales d&apos;utilisation et de vente
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

        {/* SECTION 1 — Objet */}
        <section id="objet" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            1. Objet
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales d&apos;Utilisation et de Vente (ci-apr&egrave;s &laquo;&nbsp;CGU/CGV&nbsp;&raquo;) r&eacute;gissent l&apos;utilisation du service CVpass, accessible &agrave; l&apos;adresse{" "}
            <a href="https://cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>https://cvpass.fr</a>, &eacute;dit&eacute; par VertexLab. CVpass est un service en ligne d&apos;analyse et d&apos;optimisation de CV par intelligence artificielle, permettant aux utilisateurs de calculer leur score de compatibilit&eacute; ATS (Applicant Tracking System), de recevoir des suggestions d&apos;am&eacute;lioration personnalis&eacute;es et de g&eacute;n&eacute;rer des documents optimis&eacute;s.
          </p>
        </section>

        {/* SECTION 2 — Acceptation */}
        <section id="acceptation" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            2. Acceptation des conditions
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            L&apos;acc&egrave;s et l&apos;utilisation du service CVpass impliquent l&apos;acceptation pleine et enti&egrave;re des pr&eacute;sentes CGU/CGV. Si vous n&apos;acceptez pas ces conditions, vous ne devez pas utiliser le service. L&apos;utilisation du service apr&egrave;s publication de modifications des pr&eacute;sentes conditions vaut acceptation des nouvelles conditions.
          </p>
        </section>

        {/* SECTION 3 — Acces */}
        <section id="acces" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            3. Acc&egrave;s au service
          </h2>
          <ul style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>L&apos;utilisation de CVpass n&eacute;cessite la cr&eacute;ation d&apos;un compte utilisateur via notre partenaire d&apos;authentification Clerk.</li>
            <li>L&apos;utilisateur s&apos;engage &agrave; fournir des informations exactes et &agrave; maintenir la confidentialit&eacute; de ses identifiants de connexion.</li>
            <li>L&apos;utilisateur est responsable de toute activit&eacute; effectu&eacute;e sous son compte.</li>
            <li>VertexLab se r&eacute;serve le droit de suspendre ou supprimer tout compte en cas de violation des pr&eacute;sentes CGU/CGV ou d&apos;utilisation frauduleuse du service.</li>
          </ul>
        </section>

        {/* SECTION 4 — Offres */}
        <section id="offres" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            4. Description des offres
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Plan Gratuit */}
            <div style={planCardStyle}>
              <p style={planTitleStyle}>Plan Gratuit</p>
              <ul style={planListStyle}>
                <li style={planLiStyle}>2 analyses de CV offertes &agrave; l&apos;inscription</li>
                <li style={planLiStyle}>Score ATS et suggestions d&apos;am&eacute;lioration</li>
                <li style={planLiStyle}>Toutes les fonctionnalit&eacute;s accessibles (analyse, export PDF, lettre de motivation)</li>
                <li style={planLiStyle}>Dur&eacute;e illimit&eacute;e</li>
              </ul>
            </div>

            {/* Coup de pouce */}
            <div style={{ ...planCardStyle, borderColor: "#16a34a", borderWidth: 1.5 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                <p style={{ ...planTitleStyle, margin: 0 }}>Coup de pouce</p>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>2,90&nbsp;&euro; TTC</span>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>paiement unique</span>
              </div>
              <ul style={planListStyle}>
                <li style={planLiStyle}>4 cr&eacute;dits d&apos;analyse ajout&eacute;s au solde existant</li>
                <li style={planLiStyle}>Cr&eacute;dits sans expiration</li>
                <li style={planLiStyle}>Rachetable plusieurs fois</li>
                <li style={planLiStyle}>Toutes les fonctionnalit&eacute;s accessibles (export PDF, lettre de motivation, historique)</li>
              </ul>
            </div>

            {/* Recherche Active */}
            <div style={{ ...planCardStyle, borderColor: "#16a34a", borderWidth: 1.5 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                <p style={{ ...planTitleStyle, margin: 0 }}>Recherche Active</p>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>8,90&nbsp;&euro; TTC/mois</span>
              </div>
              <ul style={planListStyle}>
                <li style={planLiStyle}>Abonnement mensuel avec renouvellement automatique</li>
                <li style={planLiStyle}>Analyses illimit&eacute;es pendant 30 jours</li>
                <li style={planLiStyle}>Export PDF du CV optimis&eacute;</li>
                <li style={planLiStyle}>G&eacute;n&eacute;ration de lettre de motivation IA</li>
                <li style={planLiStyle}>Historique complet des analyses</li>
                <li style={planLiStyle}>R&eacute;siliable &agrave; tout moment, sans p&eacute;nalit&eacute;</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Prix et paiement */}
        <section id="prix" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            5. Prix et paiement
          </h2>
          <ul style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Tous les prix sont indiqu&eacute;s en euros, toutes taxes comprises (TTC).</li>
            <li>Le paiement est s&eacute;curis&eacute; et trait&eacute; exclusivement par Stripe, notre prestataire de paiement certifi&eacute; PCI DSS.</li>
            <li>CVpass ne collecte ni ne stocke aucune donn&eacute;e bancaire (num&eacute;ro de carte, CVV, date d&apos;expiration).</li>
            <li>La facturation est imm&eacute;diate au moment de l&apos;achat pour le pack Coup de pouce (2,90&nbsp;&euro;), et &agrave; chaque d&eacute;but de p&eacute;riode pour l&apos;abonnement Recherche Active (8,90&nbsp;&euro;/mois).</li>
            <li>VertexLab se r&eacute;serve le droit de modifier ses tarifs. Toute modification sera notifi&eacute;e aux abonn&eacute;s actifs 30 jours avant son entr&eacute;e en vigueur.</li>
          </ul>
        </section>

        {/* SECTION 6 — Retractation */}
        <section id="retractation" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            6. Droit de r&eacute;tractation et politique de remboursement
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "20px 24px" }}>
              <p style={{ margin: "0 0 12px" }}>
                En raison de la nature num&eacute;rique et imm&eacute;diatement consommable du service CVpass, conform&eacute;ment &agrave; l&apos;article L221-28 du Code de la consommation, le droit de r&eacute;tractation ne s&apos;applique pas aux contenus num&eacute;riques fournis sur support immat&eacute;riel dont l&apos;ex&eacute;cution a commenc&eacute; avec l&apos;accord pr&eacute;alable expr&egrave;s du consommateur et renoncement expr&egrave;s &agrave; son droit de r&eacute;tractation.
              </p>
              <p style={{ margin: 0 }}>
                En acc&eacute;dant au service apr&egrave;s paiement, l&apos;utilisateur reconna&icirc;t express&eacute;ment :<br />
                (a) que l&apos;ex&eacute;cution du service commence imm&eacute;diatement apr&egrave;s la confirmation du paiement,<br />
                (b) qu&apos;il renonce express&eacute;ment &agrave; son droit de r&eacute;tractation.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
                Pack Coup de pouce (2,90&nbsp;&euro;)
              </h3>
              <p style={{ margin: 0 }}>
                Aucun remboursement n&apos;est accord&eacute; une fois les cr&eacute;dits ajout&eacute;s au compte de l&apos;utilisateur.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
                Abonnement Recherche Active (8,90&nbsp;&euro;/mois)
              </h3>
              <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>La r&eacute;siliation est possible &agrave; tout moment depuis l&apos;espace &laquo;&nbsp;Mon Compte&nbsp;&raquo; ou par email &agrave;{" "}
                  <a href="mailto:contact@cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>contact@cvpass.fr</a>
                </li>
                <li>L&apos;acc&egrave;s au service reste actif jusqu&apos;&agrave; la fin de la p&eacute;riode de facturation en cours</li>
                <li>Aucun remboursement au prorata temporis n&apos;est effectu&eacute;</li>
                <li>Le mois en cours au moment de la r&eacute;siliation n&apos;est pas rembours&eacute;</li>
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px" }}>
                Exceptions
              </h3>
              <p style={{ margin: "0 0 8px" }}>
                Un remboursement peut &ecirc;tre accord&eacute; de mani&egrave;re exceptionnelle uniquement dans les cas suivants :
              </p>
              <ul style={{ margin: "0 0 12px", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>Double facturation av&eacute;r&eacute;e et document&eacute;e</li>
                <li>Impossibilit&eacute; technique totale d&apos;acc&eacute;der au service pendant plus de 24 heures cons&eacute;cutives, imputable exclusivement &agrave; CVpass (hors maintenance programm&eacute;e et cas de force majeure)</li>
              </ul>
              <p style={{ margin: 0 }}>
                Pour toute demande exceptionnelle de remboursement :{" "}
                <a href="mailto:contact@cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>contact@cvpass.fr</a>{" "}
                dans un d&eacute;lai maximum de 7 jours calendaires suivant l&apos;achat.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7 — Resiliation */}
        <section id="resiliation" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            7. R&eacute;siliation
          </h2>
          <ul style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>L&apos;utilisateur peut r&eacute;silier son abonnement &agrave; tout moment depuis son espace &laquo;&nbsp;Mon Compte&nbsp;&raquo; ou par email &agrave;{" "}
              <a href="mailto:contact@cvpass.fr" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>contact@cvpass.fr</a>.
            </li>
            <li>La r&eacute;siliation prend effet &agrave; la fin de la p&eacute;riode de facturation en cours.</li>
            <li>Aucune p&eacute;nalit&eacute; de r&eacute;siliation n&apos;est appliqu&eacute;e.</li>
            <li>Apr&egrave;s r&eacute;siliation, l&apos;utilisateur conserve l&apos;acc&egrave;s au service jusqu&apos;&agrave; la fin de la p&eacute;riode d&eacute;j&agrave; factur&eacute;e.</li>
            <li>VertexLab se r&eacute;serve le droit de r&eacute;silier le compte d&apos;un utilisateur en cas de violation des pr&eacute;sentes CGU/CGV, avec notification pr&eacute;alable par email sauf en cas d&apos;urgence.</li>
          </ul>
        </section>

        {/* SECTION 8 — Propriete intellectuelle */}
        <section id="propriete-intellectuelle" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            8. Propri&eacute;t&eacute; intellectuelle
          </h2>
          <ul style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>L&apos;ensemble des &eacute;l&eacute;ments constituant le service CVpass (logiciel, algorithmes, interface, textes, graphismes, logo, base de donn&eacute;es) est la propri&eacute;t&eacute; exclusive de VertexLab et est prot&eacute;g&eacute; par les lois fran&ccedil;aises et internationales relatives &agrave; la propri&eacute;t&eacute; intellectuelle.</li>
            <li>La marque &laquo;&nbsp;CVpass&nbsp;&raquo; et le logo associ&eacute; sont la propri&eacute;t&eacute; exclusive de VertexLab. Toute reproduction ou utilisation non autoris&eacute;e est interdite.</li>
            <li>Les CVs upload&eacute;s par les utilisateurs restent leur propri&eacute;t&eacute; exclusive. CVpass ne revendique aucun droit de propri&eacute;t&eacute; sur les contenus upload&eacute;s par les utilisateurs.</li>
            <li>L&apos;utilisateur accorde &agrave; CVpass une licence temporaire, limit&eacute;e et non exclusive de traitement de son CV aux seules fins de fourniture du service (analyse, suggestions, export).</li>
          </ul>
        </section>

        {/* SECTION 9 — Limitation de responsabilite */}
        <section id="limitation-responsabilite" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            9. Limitation de responsabilit&eacute;
          </h2>
          <ul style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>CVpass est un outil d&apos;aide &agrave; l&apos;optimisation de CV et ne garantit en aucun cas l&apos;obtention d&apos;un entretien ou d&apos;un emploi.</li>
            <li>Les suggestions g&eacute;n&eacute;r&eacute;es par l&apos;intelligence artificielle sont fournies &agrave; titre indicatif et ne constituent pas un conseil professionnel garanti.</li>
            <li>L&apos;utilisateur reste seul responsable du contenu de son CV et des informations qu&apos;il y fait figurer.</li>
            <li>VertexLab ne saurait &ecirc;tre tenue responsable des d&eacute;cisions de recrutement prises par des tiers sur la base d&apos;un CV analys&eacute; ou optimis&eacute; via CVpass.</li>
            <li>La responsabilit&eacute; totale de VertexLab est limit&eacute;e au montant effectivement pay&eacute; par l&apos;utilisateur au cours des 12 derniers mois.</li>
            <li>VertexLab ne peut &ecirc;tre tenue responsable en cas de force majeure, de dysfonctionnement du r&eacute;seau Internet, ou de toute cause ind&eacute;pendante de sa volont&eacute;.</li>
          </ul>
        </section>

        {/* SECTION 10 — Donnees personnelles */}
        <section id="donnees-personnelles" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            10. Donn&eacute;es personnelles
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            Le traitement des donn&eacute;es personnelles est d&eacute;taill&eacute; dans notre{" "}
            <Link href="/politique-confidentialite" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 500 }}>Politique de confidentialit&eacute;</Link>.
          </p>
        </section>

        {/* SECTION 11 — Modification des conditions */}
        <section id="modification" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            11. Modification des conditions
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", margin: 0 }}>
            VertexLab se r&eacute;serve le droit de modifier les pr&eacute;sentes CGU/CGV. En cas de modification substantielle, les utilisateurs seront notifi&eacute;s par email au moins 30 jours avant l&apos;entr&eacute;e en vigueur des nouvelles conditions. La poursuite de l&apos;utilisation du service apr&egrave;s cette date vaut acceptation des conditions modifi&eacute;es.
          </p>
        </section>

        {/* SECTION 12 — Droit applicable */}
        <section id="droit-applicable" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#16a34a", margin: "0 0 16px", letterSpacing: "-0.3px" }}>
            12. Droit applicable et juridiction comp&eacute;tente
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.78, color: "var(--text-body)", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>
              Les pr&eacute;sentes CGU/CGV sont r&eacute;gies par le droit fran&ccedil;ais. En cas de litige relatif &agrave; l&apos;interpr&eacute;tation ou &agrave; l&apos;ex&eacute;cution des pr&eacute;sentes, les parties s&apos;efforceront de trouver une solution amiable. &Agrave; d&eacute;faut de r&eacute;solution amiable dans un d&eacute;lai de 30 jours, le litige sera soumis aux tribunaux comp&eacute;tents du ressort du Tribunal de commerce de Marseille, France.
            </p>
            <p style={{ margin: 0 }}>
              Conform&eacute;ment aux dispositions de l&apos;article L612-1 du Code de la consommation, le consommateur a le droit de recourir gratuitement &agrave; un m&eacute;diateur de la consommation en vue de la r&eacute;solution amiable du litige.
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
