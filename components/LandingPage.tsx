"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../app/styles/landing.css";

export function LandingPage() {
  const [heroEmail, setHeroEmail] = useState("");
  const [ctaEmail, setCtaEmail] = useState("");
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);
  const [heroLoading, setHeroLoading] = useState(false);
  const [ctaLoading, setCtaLoading] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const [ctaError, setCtaError] = useState(false);

  // Fade-up scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 70);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  async function handleSignup(source: "hero" | "cta") {
    const email = source === "hero" ? heroEmail : ctaEmail;
    const setLoading = source === "hero" ? setHeroLoading : setCtaLoading;
    const setSuccess = source === "hero" ? setHeroSuccess : setCtaSuccess;
    const setError = source === "hero" ? setHeroError : setCtaError;

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError(true);
      setTimeout(() => setError(false), 2500);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: source === "cta" ? "CTA Final" : "Hero",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSuccess(true);
        if (source === "hero") setHeroEmail("");
        else setCtaEmail("");
      } else {
        alert(data.error || "Erreur lors de l'inscription.");
      }
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="landing-root">
      {/* NAV */}
      <nav>
        <a href="#" className="logo">CV<span>pass</span></a>
        <div className="nav-right">
          <a href="#pricing" className="nav-link">Tarifs</a>
          <a href="#cta" className="btn btn-green">Accès gratuit →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">La seule fonctionnalité qui manquait en France</div>
          <h1>Corrigez votre CV<br />en <em>1 clic.</em></h1>
          <div className="diff-callout">
            <span>✕ Les autres outils vous <strong>montrent</strong> les problèmes</span>
            <span className="diff-sep">—</span>
            <span>✓ CVpass les <strong>corrige automatiquement</strong></span>
          </div>
          <p className="hero-sub">Collez votre offre d&apos;emploi, uploadez votre CV. CVpass réécrit chaque point faible en un clic et génère un PDF parfait pour les recruteurs.</p>
          <div className="hero-form">
            <input
              type="email"
              className="input-email"
              placeholder="votre@email.fr"
              value={heroEmail}
              onChange={(e) => setHeroEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSignup("hero"); }}
              style={heroError ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : {}}
            />
            <button
              className="btn btn-green btn-lg"
              onClick={() => handleSignup("hero")}
              disabled={heroLoading}
            >
              {heroLoading ? "Envoi..." : "Corriger mon CV gratuitement →"}
            </button>
          </div>
          {heroSuccess && (
            <div className="success-msg show">✓ Parfait — vous serez parmi les premiers prévenus au lancement !</div>
          )}
          <p className="hero-note"><b>Gratuit</b> · Sans carte de crédit · Sans engagement</p>
        </div>
      </section>

      {/* VS STRIP */}
      <div className="vs-strip">
        <div className="container">
          <div className="vs-inner">
            <div className="vs-item"><span className="vs-icon">⚡</span> Réécriture IA en 1 clic</div>
            <div className="vs-item"><span className="vs-icon">🎯</span> Calibré sur votre offre précise</div>
            <div className="vs-item"><span className="vs-icon">🇫🇷</span> 100% français — APEC, WTJ, Indeed FR</div>
            <div className="vs-item"><span className="vs-icon">🔒</span> CV supprimé après 24h — RGPD</div>
          </div>
        </div>
      </div>

      {/* EDITOR SECTION */}
      <section className="editor-section">
        <div className="container">
          <div className="fade-up">
            <div className="eyebrow">La fonctionnalité unique</div>
          </div>
          <div className="editor-layout">
            <div className="editor-text fade-up">
              <h2>Les autres outils vous disent quoi corriger.<br />CVpass le corrige pour vous.</h2>
              <p>Tous les scanners ATS français vous donnent une liste de problèmes. Vous vous retrouvez seul face à votre CV, sans savoir comment formuler autrement. CVpass va plus loin : pour chaque point faible détecté, l&apos;IA propose une réécriture complète. Vous lisez, vous cliquez Accepter. C&apos;est tout.</p>
              <div className="editor-points">
                <div className="editor-point">
                  <div className="point-icon">✓</div>
                  <div><strong>Avant/Après visible</strong> — comparez la version originale et la suggestion IA côte à côte</div>
                </div>
                <div className="editor-point">
                  <div className="point-icon">✓</div>
                  <div><strong>Mots-clés de votre offre intégrés</strong> — la réécriture inclut automatiquement les termes de l&apos;annonce</div>
                </div>
                <div className="editor-point">
                  <div className="point-icon">✓</div>
                  <div><strong>Score en temps réel</strong> — il remonte à chaque clic sur &quot;Accepter&quot;</div>
                </div>
                <div className="editor-point">
                  <div className="point-icon">✓</div>
                  <div><strong>Vous gardez le contrôle</strong> — acceptez ou ignorez chaque suggestion individuellement</div>
                </div>
              </div>
            </div>
            <div className="editor-mock fade-up">
              <div className="mock-bar">
                <div className="mock-dots">
                  <div className="mock-dot dot-r"></div>
                  <div className="mock-dot dot-y"></div>
                  <div className="mock-dot dot-g"></div>
                </div>
                <div className="mock-score">
                  <span className="score-before">38/100</span>
                  <span className="score-arrow">→</span>
                  <span className="score-after">74/100 ↑</span>
                </div>
              </div>
              <div className="mock-body">
                <div className="suggestion-card">
                  <div className="sug-before"><span className="sug-label label-bad">AVANT</span>&quot;Géré une équipe de 5 personnes&quot;</div>
                  <div className="sug-after"><span className="sug-label label-good">APRÈS</span>Piloté une équipe de 5 personnes en méthode Agile, +30% de productivité</div>
                  <div className="sug-actions" style={{ background: "#f0fdf4", borderTop: "1px solid #bbf7d0" }}>
                    <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>✓ Accepté</span>
                  </div>
                </div>
                <div className="suggestion-card">
                  <div className="sug-before"><span className="sug-label label-bad">AVANT</span>&quot;Responsable des ventes en région&quot;</div>
                  <div className="sug-after"><span className="sug-label label-good">APRÈS</span>Développé un CA de 1,2M€ sur la région Nord, 18% au-dessus des objectifs</div>
                  <div className="sug-actions">
                    <button className="sug-accept">✓ Accepter</button>
                    <button className="sug-ignore">Ignorer</button>
                  </div>
                </div>
                <div className="suggestion-card sug-card-pending">
                  <div className="sug-before"><span className="sug-label label-bad">AVANT</span>&quot;Aidé à améliorer les processus&quot;</div>
                  <div className="sug-after"><span className="sug-label label-good">APRÈS</span>Optimisé les processus internes, réduisant le temps de traitement de 40%</div>
                  <div className="sug-actions">
                    <button className="sug-accept">✓ Accepter</button>
                    <button className="sug-ignore">Ignorer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POURQUOI DIFFÉRENT */}
      <section className="diff-section">
        <div className="container">
          <div className="fade-up">
            <div className="eyebrow">Pourquoi CVpass</div>
            <h2 className="section-title">Ce que les autres ne font pas.</h2>
            <p className="section-sub">Les scanners ATS existent en France. Aucun ne va aussi loin.</p>
          </div>
          <div className="diff-grid">
            <div className="diff-card fade-up">
              <div className="diff-icon">📊</div>
              <h3>Les autres : un score et une liste</h3>
              <p>CVDesignR, CVcrea, CVLab vous donnent un score et vous expliquent ce qui ne va pas. Vous êtes seul pour corriger. La plupart des candidats abandonnent à cette étape.</p>
            </div>
            <div className="diff-card featured fade-up">
              <div className="diff-badge">CVpass uniquement</div>
              <div className="diff-icon">⚡</div>
              <h3>CVpass : l&apos;IA corrige à votre place</h3>
              <p>Pour chaque problème, CVpass génère une réécriture complète intégrant les mots-clés de votre offre. Vous n&apos;avez qu&apos;à cliquer &quot;Accepter&quot;. Aucun outil français ne fait ça.</p>
            </div>
            <div className="diff-card fade-up">
              <div className="diff-icon">🎯</div>
              <h3>Match précis avec chaque offre</h3>
              <p>Pas d&apos;analyse générique. Vous collez une offre Welcome to the Jungle, APEC ou LinkedIn — CVpass adapte chaque suggestion aux mots-clés exacts de ce poste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TABLEAU COMPARATIF */}
      <section className="comparison-section">
        <div className="container">
          <div className="fade-up">
            <div className="eyebrow">Comparaison</div>
            <h2 className="section-title">CVpass vs les autres outils français.</h2>
          </div>
          <div className="comp-table fade-up">
            <div className="comp-row header">
              <div className="comp-cell">Fonctionnalité</div>
              <div className="comp-cell cvpass">CVpass</div>
              <div className="comp-cell">CVDesignR</div>
              <div className="comp-cell">CVcrea</div>
              <div className="comp-cell">CVLab</div>
            </div>
            {[
              ["Score ATS", "✓","✓","✓","✓"],
              ["Match avec une offre précise", "✓","✕","≈","✓"],
              ["Éditeur 1-clic Accept/Decline", "✓","✕","✕","✕"],
              ["Réécriture IA des bullet points", "✓","✕","✕","✕"],
              ["Export PDF ATS-compatible", "✓","✓","≈","✕"],
              ["Pass 48h sans abonnement", "✓","✕","✕","✕"],
            ].map(([feature, ...vals]) => (
              <div key={feature} className="comp-row">
                <div className="comp-cell feature-name" dangerouslySetInnerHTML={{ __html: feature }} />
                {vals.map((v, i) => (
                  <div key={i} className={`comp-cell${i === 0 ? " cvpass" : ""}`}>
                    <span className={v === "✓" ? "tick" : v === "✕" ? "cross" : "partial"}>{v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="how-section">
        <div className="container">
          <div className="fade-up">
            <div className="eyebrow">Fonctionnement</div>
            <h2 className="section-title">Prêt à postuler en 20 minutes.</h2>
            <p className="section-sub">Quatre étapes, zéro effort de rédaction.</p>
          </div>
          <div className="steps-grid">
            {[
              { n:"1", title:"Uploadez votre CV", desc:"PDF ou Word, même créé avec Canva. Notre moteur extrait tout le contenu, même les mises en page complexes." },
              { n:"2", title:"Collez l'annonce", desc:"Welcome to the Jungle, LinkedIn, APEC, Indeed. L'IA extrait les 10 compétences-clés du poste en 5 secondes." },
              { n:"3", title:'Cliquez "Accepter"', desc:'Pour chaque point faible, une réécriture est proposée. Vous acceptez ou ignorez — le score remonte en temps réel.' },
              { n:"4", title:"Téléchargez et postulez", desc:"Un PDF sobre, sans colonnes ni icônes. Conçu pour être parfaitement lu par les logiciels RH." },
            ].map((s) => (
              <div key={s.n} className="step-item fade-up">
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div className="eyebrow">Tarifs</div>
            <h2 className="section-title">Simple. Transparent. Sans piège.</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Pas d&apos;abonnement forcé — payez uniquement quand vous en avez besoin.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card fade-up">
              <div className="price-tier">Gratuit</div>
              <div className="price-amount">0<span className="sm">€</span></div>
              <div className="price-desc">Pour voir ce qui bloque votre CV et comprendre pourquoi vous n&apos;avez pas de réponse.</div>
              <div className="price-feats">
                <div className="pf"><span className="ck">✓</span> 1 analyse de CV complète</div>
                <div className="pf"><span className="ck">✓</span> Score détaillé</div>
                <div className="pf"><span className="ck">✓</span> 3 problèmes identifiés</div>
                <div className="pf off"><span className="ck">✕</span> Éditeur 1-clic</div>
                <div className="pf off"><span className="ck">✕</span> Réécriture IA</div>
                <div className="pf off"><span className="ck">✕</span> Export PDF</div>
              </div>
              <Link href="/signup" className="btn-full ghost" style={{ display: "block", textAlign: "center" }}>Commencer gratuitement</Link>
            </div>
            <div className="price-card featured fade-up">
              <div className="featured-tag">Le plus populaire</div>
              <div className="price-tier">Pass 48h</div>
              <div className="price-amount">4<span className="sm">,90€</span></div>
              <div className="price-desc">Pour optimiser 3 ou 4 candidatures en urgence. Sans abonnement, sans renouvellement caché.</div>
              <div className="price-feats">
                <div className="pf"><span className="ck">✓</span> Scans illimités pendant 48h</div>
                <div className="pf"><span className="ck">✓</span> <strong>Éditeur 1-clic complet</strong></div>
                <div className="pf"><span className="ck">✓</span> <strong>Réécriture IA des bullet points</strong></div>
                <div className="pf"><span className="ck">✓</span> Match offres illimité</div>
                <div className="pf"><span className="ck">✓</span> Export PDF sans watermark</div>
                <div className="pf off"><span className="ck">✕</span> Historique des CVs</div>
              </div>
              <Link href="/pricing" className="btn-full green" style={{ display: "block", textAlign: "center" }}>Choisir ce Pass</Link>
            </div>
            <div className="price-card fade-up">
              <div className="price-tier">Recherche Active</div>
              <div className="price-amount">19<span className="sm">,90€/mois</span></div>
              <div className="price-desc">Pour une recherche sur plusieurs semaines. Résiliable à tout moment, sans condition.</div>
              <div className="price-feats">
                <div className="pf"><span className="ck">✓</span> Tout du Pass 48h</div>
                <div className="pf"><span className="ck">✓</span> Historique illimité des CVs</div>
                <div className="pf"><span className="ck">✓</span> Génération de lettres de motivation</div>
                <div className="pf"><span className="ck">✓</span> Suivi de candidatures</div>
                <div className="pf"><span className="ck">✓</span> Support prioritaire</div>
                <div className="pf"><span className="ck">✓</span> Sans engagement</div>
              </div>
              <Link href="/pricing" className="btn-full ghost" style={{ display: "block", textAlign: "center" }}>Choisir ce Plan</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="testi-section">
        <div className="container">
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div className="eyebrow">Témoignages bêta</div>
            <h2 className="section-title">Ils ont testé CVpass.</h2>
          </div>
          <div className="testi-grid">
            <div className="testi-card fade-up">
              <div className="stars">★★★★★</div>
              <p className="testi-text">&quot;Ce qui m&apos;a bluffé c&apos;est que l&apos;outil ne me dit pas juste &apos;verbe trop faible&apos; — il me réécrit <strong>la phrase entière avec les bons mots</strong>. J&apos;ai eu 3 réponses en une semaine.&quot;</p>
              <div className="testi-author">
                <div className="testi-av">MC</div>
                <div><div className="testi-name">Marie C.</div><div className="testi-role">Chef de projet · Lyon</div></div>
                <div className="score-pill">41 → 89</div>
              </div>
            </div>
            <div className="testi-card fade-up">
              <div className="stars">★★★★★</div>
              <p className="testi-text">&quot;J&apos;avais déjà essayé CVDesignR. Ça me donnait une liste de problèmes, je ne savais pas quoi faire. CVpass <strong>corrige lui-même</strong> — c&apos;est une autre catégorie.&quot;</p>
              <div className="testi-author">
                <div className="testi-av">AT</div>
                <div><div className="testi-name">Antoine T.</div><div className="testi-role">Développeur web · Bordeaux</div></div>
                <div className="score-pill">34 → 93</div>
              </div>
            </div>
            <div className="testi-card fade-up">
              <div className="stars">★★★★★</div>
              <p className="testi-text">&quot;Le fait que ça intègre les mots-clés de l&apos;offre dans la réécriture c&apos;est génial. Mon CV collait enfin exactement au poste. <strong>Premier entretien 4 jours après.</strong>&quot;</p>
              <div className="testi-author">
                <div className="testi-av">SF</div>
                <div><div className="testi-name">Sophie F.</div><div className="testi-role">Reconversion RH · Paris</div></div>
                <div className="score-pill">29 → 86</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-box fade-up">
            <h2>Votre prochain entretien<br />commence ici.</h2>
            <p>500 accès gratuits disponibles au lancement. Inscrivez-vous maintenant pour être prioritaire.</p>
            <div className="cta-form">
              <input
                type="email"
                className="input-email"
                placeholder="votre@email.fr"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSignup("cta"); }}
                style={ctaError ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : {}}
              />
              <button
                className="btn btn-green btn-lg"
                onClick={() => handleSignup("cta")}
                disabled={ctaLoading}
              >
                {ctaLoading ? "Envoi..." : "Je veux accès →"}
              </button>
            </div>
            {ctaSuccess && (
              <div className="success-msg show">✓ C&apos;est noté — vous serez parmi les premiers prévenus !</div>
            )}
            <p className="cta-note">Gratuit · Sans carte de crédit · Résiliation en 1 clic</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-copy">© 2026 CVpass — Tous droits réservés</div>
        <div className="footer-links">
          <Link href="/mentions-legales">Mentions légales</Link>
          <a href="mailto:contact@cvpass.fr">Contact</a>
        </div>
      </footer>
    </div>
  );
}
