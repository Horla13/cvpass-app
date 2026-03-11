import { AppHeader } from "@/components/AppHeader";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-3xl font-bold text-brand-black">Mentions légales</h1>

        <section>
          <h2 className="text-xl font-semibold text-brand-black mb-3">
            Éditeur du site
          </h2>
          <p className="text-brand-gray leading-relaxed">
            CVpass — VertexLab SASU<br />
            Représentant légal : Giovanni Russo<br />
            198 boulevard Ange Martin, 13190 Allauch<br />
            <a href="mailto:contact@cvpass.fr" className="text-brand-green hover:underline">
              contact@cvpass.fr
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-black mb-3">
            Hébergeur
          </h2>
          <p className="text-brand-gray leading-relaxed">
            Vercel Inc.<br />
            340 Pine Street Suite 1002, San Francisco, CA 94104, États-Unis<br />
            <a
              href="https://vercel.com"
              className="text-brand-green hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              vercel.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-black mb-3">
            Traitement des données personnelles (RGPD)
          </h2>
          <div className="space-y-4 text-brand-gray leading-relaxed">
            <p>
              <strong className="text-brand-black">CVs uploadés :</strong>{" "}
              Les CVs uploadés sont traités en mémoire et ne sont pas stockés
              sur nos serveurs. Seules les suggestions générées sont conservées
              le temps de la session.
            </p>
            <p>
              <strong className="text-brand-black">Données d&apos;analyse :</strong>{" "}
              CVpass conserve uniquement des métadonnées anonymisées (score
              avant/après, nombre de suggestions) à des fins statistiques.
            </p>
            <p>
              <strong className="text-brand-black">Mesure d&apos;audience :</strong>{" "}
              Nous utilisons PostHog pour analyser l&apos;utilisation du produit de façon
              anonyme (pages visitées, actions clés). Aucune donnée personnelle
              identifiable n&apos;est transmise. PostHog est conforme au RGPD et les
              données sont hébergées en Europe.
            </p>
            <p>
              <strong className="text-brand-black">IA et sous-traitants :</strong>{" "}
              Le contenu des CVs est transmis à OpenAI (GPT-4o mini) pour
              analyse. OpenAI s&apos;engage à ne pas utiliser ces données pour
              l&apos;entraînement de ses modèles dans le cadre d&apos;une utilisation via
              API.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-black mb-3">
            Vos droits
          </h2>
          <p className="text-brand-gray leading-relaxed">
            Conformément au RGPD (Règlement Général sur la Protection des
            Données), vous disposez d&apos;un droit d&apos;accès, de rectification et
            de suppression de vos données personnelles. Pour exercer ces
            droits, contactez-nous à :{" "}
            <a
              href="mailto:contact@cvpass.fr"
              className="text-brand-green hover:underline"
            >
              contact@cvpass.fr
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-brand-black mb-3">
            Cookies
          </h2>
          <p className="text-brand-gray leading-relaxed">
            CVpass utilise uniquement des cookies strictement nécessaires au
            fonctionnement de l&apos;authentification (Clerk). Aucun cookie
            publicitaire ou de tracking tiers n&apos;est utilisé.
          </p>
        </section>

        <p className="text-xs text-brand-gray border-t border-gray-200 pt-6">
          Dernière mise à jour : mars 2026
        </p>
      </main>
    </div>
  );
}
