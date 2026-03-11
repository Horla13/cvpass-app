"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import "../app/styles/landing.css";

const FAQ_ITEMS = [
  {
    q: "CVpass stocke-t-il mon CV ?",
    a: "Non. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Il disparaît automatiquement à la fermeture de votre onglet. Aucune donnée personnelle n'est conservée au-delà de votre session.",
  },
  {
    q: "Ça marche avec les CVs Canva ?",
    a: "Oui. CVpass détecte automatiquement si votre CV est au format image et vous guide pour l'exporter correctement.",
  },
  {
    q: "C'est quoi la différence avec CVDesignR ou CVcrea ?",
    a: "Ces outils vous donnent un score et une liste de problèmes. CVpass va plus loin : il réécrit automatiquement chaque point faible avec les mots-clés de votre offre précise. Vous n'avez qu'à cliquer Accepter.",
  },
  {
    q: "Combien de temps ça prend ?",
    a: "Moins de 5 minutes. Upload du CV, collage de l'offre, validation des suggestions. Votre CV optimisé est prêt à télécharger.",
  },
  {
    q: "Est-ce que ça marche pour tous les secteurs ?",
    a: "Oui. L'IA s'adapte à l'offre que vous collez, qu'il s'agisse d'un poste en marketing, informatique, finance, RH ou autre.",
  },
  {
    q: "CVpass est vraiment gratuit ?",
    a: "Oui, votre première analyse est gratuite, sans carte de crédit. Pour un accès illimité, découvrez nos offres payantes.",
  },
];

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    title: "Analyse ATS complète",
    desc: "Score détaillé, mots-clés manquants, structure du CV — tout en quelques secondes.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Réécriture en 1 clic",
    desc: "L'IA réécrit chaque bullet point faible. Vous acceptez ou ignorez — vous gardez le contrôle.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    title: "Score en temps réel",
    desc: "Votre score ATS remonte à chaque suggestion acceptée. Mesurez l'impact immédiatement.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: "Calibré sur votre offre",
    desc: "Collez une offre Welcome to the Jungle, APEC ou LinkedIn — les suggestions s'adaptent exactement.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    title: "Export PDF sans watermark",
    desc: "Un PDF sobre et propre, parfaitement lisible par les logiciels RH et ATS.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: "Historique des analyses",
    desc: "Retrouvez tous vos CVs analysés, comparez vos scores et suivez votre progression.",
  },
];

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [counterValue, setCounterValue] = useState("plus de 15");

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

  useEffect(() => {
    fetch("/api/count")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.count > 0) setCounterValue(d.count.toLocaleString("fr-FR")); })
      .catch(() => {});
  }, []);

  function toggleFaq(i: number) {
    setOpenFaq(openFaq === i ? null : i);
  }

  return (
    <div className="landing-root">
      {/* NAV */}
      <nav>
        <a href="#" className="logo">CV<span>pass</span></a>
        <div className="nav-right">
          <a href="#features" className="nav-link">Fonctionnalités</a>
          <a href="#pricing" className="nav-link">Tarifs</a>
          <Link href="/blog" className="nav-link">Blog</Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="btn btn-outline">Connexion</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-green">S&apos;inscrire</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="btn btn-green">Mon espace →</Link>
          </Show>
        </div>
      </nav>


      {/* HERO — 2 colonnes */}
      <section className="hero">
        <div className="container">
          <div className="hero-layout">
            {/* Texte gauche */}
            <div className="hero-content fade-up">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                La seule fonctionnalité qui manquait en France
              </div>
              <h1>Corrigez votre CV<br />en <em>1 clic.</em></h1>
              <div className="diff-callout">
                <span className="diff-item diff-bad">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Les autres vous <strong>montrent</strong> les problèmes
                </span>
                <span className="diff-sep">·</span>
                <span className="diff-item diff-good">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  CVpass les <strong>corrige automatiquement</strong>
                </span>
              </div>
              <p className="hero-sub">Collez votre offre d&apos;emploi, uploadez votre CV. CVpass réécrit chaque point faible en un clic et génère un PDF parfait pour les recruteurs.</p>
              <div className="hero-actions">
                <Show when="signed-out">
                  <SignUpButton mode="modal">
                    <button className="btn btn-green btn-lg">Analyser mon CV gratuitement →</button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <Link href="/dashboard" className="btn btn-green btn-lg">Analyser mon CV →</Link>
                </Show>
                <a href="#features" className="btn btn-ghost-sm">Voir les fonctionnalités</a>
              </div>
              <div className="social-counter">
                <div className="social-counter-avatars">
                  <span>MC</span><span>AT</span><span>SF</span>
                </div>
                <span>Déjà <strong>{counterValue}</strong> candidats nous font confiance</span>
              </div>
              <p className="hero-note"><b>Gratuit</b> · Sans carte de crédit · Sans engagement</p>
            </div>

            {/* Preview droite */}
            <div className="hero-preview fade-up">
              <div className="preview-window">
                <div className="preview-topbar">
                  <div className="mock-dots">
                    <div className="mock-dot dot-r"></div>
                    <div className="mock-dot dot-y"></div>
                    <div className="mock-dot dot-g"></div>
                  </div>
                  <div className="preview-title">CVpass — Analyse en cours</div>
                  <div className="mock-score">
                    <span className="score-before">38/100</span>
                    <span className="score-arrow">→</span>
                    <span className="score-after">74/100 ↑</span>
                  </div>
                </div>
                <div className="preview-body">
                  <div className="suggestion-card">
                    <div className="sug-before"><span className="sug-label label-bad">AVANT</span>&quot;Géré une équipe de 5 personnes&quot;</div>
                    <div className="sug-after"><span className="sug-label label-good">APRÈS</span>Piloté une équipe de 5 personnes en méthode Agile, +30% de productivité</div>
                    <div className="sug-actions accepted">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Accepté</span>
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
              {/* Floating badge */}
              <div className="preview-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                Score +36 points en 4 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS BAR */}
      <div className="logos-bar">
        <div className="container">
          <div className="logos-bar-label">Optimisé pour les offres publiées sur</div>
          <div className="logos-list">
            {["Welcome to the Jungle", "LinkedIn", "APEC", "Indeed", "Cadremploi"].map((name) => (
              <div key={name} className="logo-item">{name}</div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header fade-up">
            <div className="eyebrow">Fonctionnalités</div>
            <h2 className="section-title">Tout ce dont vous avez besoin<br />pour décrocher un entretien.</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Un seul outil. Du score ATS à l&apos;export PDF, en passant par la réécriture IA.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card fade-up">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITOR SECTION */}
      <section className="editor-section">
        <div className="container">
          <div className="editor-layout">
            <div className="editor-text fade-up">
              <div className="eyebrow">La fonctionnalité unique</div>
              <h2>Les autres outils vous disent quoi corriger.<br />CVpass le corrige pour vous.</h2>
              <p>Tous les scanners ATS français vous donnent une liste de problèmes. Vous vous retrouvez seul face à votre CV, sans savoir comment formuler autrement. CVpass va plus loin : pour chaque point faible détecté, l&apos;IA propose une réécriture complète. Vous lisez, vous cliquez Accepter. C&apos;est tout.</p>
              <div className="editor-points">
                {[
                  { t: "Avant/Après visible", d: "comparez la version originale et la suggestion IA côte à côte" },
                  { t: "Mots-clés de votre offre intégrés", d: "la réécriture inclut automatiquement les termes de l'annonce" },
                  { t: "Score en temps réel", d: "il remonte à chaque clic sur \"Accepter\"" },
                  { t: "Vous gardez le contrôle", d: "acceptez ou ignorez chaque suggestion individuellement" },
                ].map((p, i) => (
                  <div key={i} className="editor-point">
                    <div className="point-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div><strong>{p.t}</strong> — {p.d}</div>
                  </div>
                ))}
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
                  <div className="sug-actions accepted">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Accepté</span>
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
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div className="eyebrow">Pourquoi CVpass</div>
            <h2 className="section-title">Ce que les autres ne font pas.</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Les scanners ATS existent en France. Aucun ne va aussi loin.</p>
          </div>
          <div className="diff-grid">
            <div className="diff-card fade-up">
              <div className="diff-icon-wrap neutral">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <h3>Les autres : un score et une liste</h3>
              <p>CVDesignR, CVcrea, CVLab vous donnent un score et vous expliquent ce qui ne va pas. Vous êtes seul pour corriger. La plupart des candidats abandonnent à cette étape.</p>
            </div>
            <div className="diff-card featured fade-up">
              <div className="diff-badge">CVpass uniquement</div>
              <div className="diff-icon-wrap green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3>CVpass : l&apos;IA corrige à votre place</h3>
              <p>Pour chaque problème, CVpass génère une réécriture complète intégrant les mots-clés de votre offre. Vous n&apos;avez qu&apos;à cliquer &quot;Accepter&quot;. Aucun outil français ne fait ça.</p>
            </div>
            <div className="diff-card fade-up">
              <div className="diff-icon-wrap neutral">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3>Match précis avec chaque offre</h3>
              <p>Pas d&apos;analyse générique. Vous collez une offre Welcome to the Jungle, APEC ou LinkedIn — CVpass adapte chaque suggestion aux mots-clés exacts de ce poste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TABLEAU COMPARATIF */}
      <section className="comparison-section">
        <div className="container">
          <div className="fade-up" style={{ textAlign: "center" }}>
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
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div className="eyebrow">Fonctionnement</div>
            <h2 className="section-title">Prêt à postuler en 20 minutes.</h2>
            <p className="section-sub" style={{ margin: "0 auto" }}>Quatre étapes, zéro effort de rédaction.</p>
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
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> 1 analyse de CV complète</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Score détaillé</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> 3 problèmes identifiés</div>
                <div className="pf off"><span className="pf-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span> Éditeur 1-clic</div>
                <div className="pf off"><span className="pf-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span> Réécriture IA</div>
                <div className="pf off"><span className="pf-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span> Export PDF</div>
              </div>
              <Link href="/signup" className="btn-full ghost" style={{ display: "block", textAlign: "center" }}>Commencer gratuitement</Link>
            </div>
            <div className="price-card featured fade-up">
              <div className="featured-tag">Le plus populaire</div>
              <div className="price-tier">Pass 48h</div>
              <div className="price-amount">2<span className="sm">,90€</span></div>
              <div className="price-desc">Pour optimiser 3 ou 4 candidatures en urgence. Sans abonnement, sans renouvellement caché.</div>
              <div className="price-feats">
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Scans illimités pendant 48h</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> <strong>Éditeur 1-clic complet</strong></div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> <strong>Réécriture IA des bullet points</strong></div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Match offres illimité</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Export PDF sans watermark</div>
                <div className="pf off"><span className="pf-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span> Historique des CVs</div>
              </div>
              <Link href="/pricing" className="btn-full green" style={{ display: "block", textAlign: "center" }}>Choisir ce Pass</Link>
            </div>
            <div className="price-card fade-up">
              <div className="price-tier">Recherche Active</div>
              <div className="price-amount">14<span className="sm">,90€/mois</span></div>
              <div className="price-desc">Pour une recherche sur plusieurs semaines. Résiliable à tout moment, sans condition.</div>
              <div className="price-feats">
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Tout du Pass 48h</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Historique illimité des CVs</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Génération de lettres de motivation</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Suivi de candidatures</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Support prioritaire</div>
                <div className="pf"><span className="pf-icon ck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></span> Sans engagement</div>
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
            <div className="eyebrow">Témoignages</div>
            <h2 className="section-title">Ils ont testé CVpass.</h2>
          </div>
          <div className="testi-grid">
            {[
              { av:"MC", name:"Marie C.", role:"Chef de projet · Lyon", score:"41 → 89", text:"Ce qui m'a bluffé c'est que l'outil ne me dit pas juste 'verbe trop faible' — il me réécrit <strong>la phrase entière avec les bons mots</strong>. J'ai eu 3 réponses en une semaine." },
              { av:"AT", name:"Antoine T.", role:"Développeur web · Bordeaux", score:"34 → 93", text:"J'avais déjà essayé CVDesignR. Ça me donnait une liste de problèmes, je ne savais pas quoi faire. CVpass <strong>corrige lui-même</strong> — c'est une autre catégorie." },
              { av:"SF", name:"Sophie F.", role:"Reconversion RH · Paris", score:"29 → 86", text:"Le fait que ça intègre les mots-clés de l'offre dans la réécriture c'est génial. Mon CV collait enfin exactement au poste. <strong>Premier entretien 4 jours après.</strong>" },
            ].map((t, i) => (
              <div key={i} className="testi-card fade-up">
                <div className="stars">★★★★★</div>
                <p className="testi-text" dangerouslySetInnerHTML={{ __html: `"${t.text}"` }} />
                <div className="testi-author">
                  <div className="testi-av">{t.av}</div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
                  <div className="score-pill">{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <div className="fade-up" style={{ textAlign: "center" }}>
            <div className="eyebrow">Questions fréquentes</div>
            <h2 className="section-title">Tout ce que vous voulez savoir.</h2>
          </div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item fade-up">
                <button className={`faq-q${openFaq === i ? " open" : ""}`} onClick={() => toggleFaq(i)} aria-expanded={openFaq === i}>
                  <span>{item.q}</span>
                  <span className="faq-chevron">{openFaq === i ? "−" : "+"}</span>
                </button>
                <div className={`faq-a${openFaq === i ? " open" : ""}`}>
                  <div className="faq-a-inner">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" id="cta">
        <div className="container">
          <div className="cta-box fade-up">
            <div className="cta-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h2>Votre prochain entretien<br />commence ici.</h2>
            <Link href="/signup" className="btn btn-green" style={{ fontSize: "1.05rem", marginTop: "1.25rem", marginBottom: "1rem" }}>
              Analyser mon CV gratuitement →
            </Link>
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
