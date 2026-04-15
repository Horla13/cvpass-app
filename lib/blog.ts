export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  date: string;
  dateModified?: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "score-ats-cv",
    title: "Score ATS : comment calculer et améliorer le score de ton CV en 2026",
    metaTitle: "Score ATS CV : comment calculer et améliorer ton score en 2026 | CVpass",
    metaDescription:
      "Comprends comment fonctionne le score ATS, ce qui le fait baisser et comment l'améliorer étape par étape. Guide complet 2026 avec exemples concrets.",
    description:
      "Comprends comment fonctionne le score ATS et comment l'améliorer étape par étape.",
    date: "2026-02-10",
    readTime: "7 min",
    category: "Score ATS",
    tags: ["Score ATS", "Optimisation CV", "Guide"],
    image: "/blog/score-ats-cv.svg",
    content: `
## Qu'est-ce qu'un score ATS ?

Quand tu postules à une offre d'emploi, ton CV passe souvent par un logiciel de tri automatisé avant d'atterrir sur le bureau d'un recruteur. Ces logiciels (appelés ATS, pour *Applicant Tracking System*) analysent ton CV et lui attribuent un score.

Ce score reflète à quel point ton CV correspond à l'offre d'emploi : les mots-clés présents, la structure du document, la lisibilité des informations. Un CV avec un score élevé remonte dans la pile. Un CV avec un score faible reste invisible, même si ton profil est excellent.

Le problème : la plupart des candidats ignorent complètement ce mécanisme. Ils soignent la mise en page, investissent dans un beau modèle Canva, et se demandent pourquoi ils n'ont aucune réponse.

## Comment est calculé le score ATS ?

Il n'existe pas un seul standard universel, chaque logiciel ATS a sa propre méthode. Mais la plupart analysent les mêmes critères fondamentaux.

### 1. La correspondance des mots-clés

C'est le critère le plus déterminant. L'ATS extrait les compétences, outils et qualifications mentionnés dans l'offre d'emploi, puis cherche ces mêmes termes dans ton CV.

Si l'offre demande "gestion de projet Agile" et que ton CV dit "méthode Scrum", l'ATS peut ne pas faire le lien, même si c'est la même chose dans les faits. La formulation exacte compte énormément. Consulte notre [guide complet sur les mots-clés CV et ATS](/blog/mots-cles-cv-ats).

### 2. La structure du document

Les ATS lisent les CV comme un parser lit du code. Ils cherchent des sections identifiables : Expérience, Formation, Compétences. Si ton CV utilise des colonnes, des tableaux ou des zones de texte dans une mise en page complexe, le logiciel peut rater des informations entières.

### 3. Le format du fichier

Un CV PDF généré correctement est généralement bien lu. Un CV exporté depuis Canva en PDF image est souvent illisible pour un ATS, le texte n'est pas du texte, c'est une image. Le score tombe à zéro.

### 4. La densité et la pertinence

Certains ATS calculent aussi la densité de mots-clés pertinents. Un CV qui répète les bons termes dans des contextes variés (expérience, compétences, résumé) aura un meilleur score qu'un CV qui les cite une seule fois.

## Pourquoi ton score ATS est probablement plus bas que tu ne le penses

Voici les erreurs les plus fréquentes qui font baisser le score :

**Tu utilises des synonymes au lieu des termes exacts.** Tu écris "pilotage de projet" quand l'offre dit "gestion de projet". Tu écris "chef d'équipe" quand l'offre dit "team leader". L'ATS ne fait pas toujours le rapprochement.

**Tu as un CV générique non adapté à chaque offre.** Un seul CV pour toutes tes candidatures, c'est l'erreur classique. Les mots-clés varient selon les secteurs, les entreprises, les postes. Un CV non adapté aura un score faible même sur des postes qui te correspondent.

**Ta mise en page nuit à la lisibilité machine.** Colonnes côte à côte, en-têtes fancy, icônes dans les sections, tout ça perturbe la lecture automatisée.

**Ton résumé de profil est vague.** Des phrases comme "professionnel dynamique et motivé" n'apportent aucun mot-clé utile à l'ATS.

## Comment améliorer ton score ATS étape par étape

### Étape 1 : Analyse l'offre avant de candidater

Avant de modifier ton CV, lis attentivement l'offre. Identifie les compétences et outils mentionnés plusieurs fois, ce sont les mots-clés prioritaires. Note aussi les qualifications requises et le vocabulaire utilisé par l'entreprise.

### Étape 2 : Adapte chaque candidature

Ce n'est pas une question de réécrire ton CV de zéro. Il s'agit d'ajuster les formulations dans tes expériences pour qu'elles correspondent au vocabulaire de l'offre. Si l'offre parle de "CRM Salesforce" et que tu as utilisé Salesforce, assure-toi que le mot apparaît explicitement dans ton CV.

### Étape 3 : Simplifie la mise en page

Passe à un format simple : une colonne, des sections clairement titrées (Expérience professionnelle, Formation, Compétences), des puces pour les accomplissements. Pas de tableaux, pas d'images, pas de texte dans des zones graphiques.

### Étape 4 : Quantifie tes résultats

Les ATS, et les recruteurs humains, accordent plus de poids aux réalisations chiffrées. "Géré une équipe de 5 personnes" devient "Piloté une équipe de 5 personnes, +30% de productivité sur 6 mois". C'est plus précis et plus riche en contexte.

### Étape 5 : Vérifie avec un outil dédié

Tu ne peux pas calculer ton score ATS à la main. Utilise un [scanner CV ATS](/blog/scanner-cv-gratuit) qui analyse ton CV par rapport à une offre précise et te donne un score objectif.

## Ce que les autres outils ne font pas

La plupart des scanners ATS en ligne te donnent un score et une liste de problèmes. C'est utile. Mais tu te retrouves seul face à ton CV, sans savoir comment reformuler chaque point faible.

**CVpass va plus loin.** Pour chaque problème détecté, l'IA propose une réécriture complète intégrant les mots-clés de ton offre. Tu lis la suggestion, tu cliques Accepter ou Ignorer. Le score remonte en temps réel. Tu télécharges un PDF propre, optimisé pour les ATS.

---

**Prêt à voir ton vrai score ATS ?** [Analyse ton CV gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-canva-ats",
    title:
      "Pourquoi ton CV Canva est invisible pour les recruteurs (et comment le corriger)",
    metaTitle:
      "CV Canva ATS : pourquoi il est invisible pour les recruteurs | CVpass",
    metaDescription:
      "Ton CV Canva est peut-être magnifique mais illisible pour les ATS. Découvre pourquoi et comment le corriger pour qu'il passe enfin les filtres automatiques.",
    description:
      "Ton CV Canva est peut-être magnifique mais illisible pour les ATS.",
    date: "2026-02-14",
    readTime: "6 min",
    category: "CV Canva",
    tags: ["CV Canva", "Format CV", "Erreurs CV"],
    image: "/blog/cv-canva-ats.svg",
    content: `
## Le piège du CV Canva

Canva a révolutionné la création de CV. En 20 minutes, tu peux avoir un CV visuellement impeccable : couleurs harmonieuses, icônes professionnelles, mise en page moderne. Le problème ? Ce CV magnifique est souvent invisible pour les logiciels ATS qui trient les candidatures avant qu'un humain les lise.

Ce n'est pas un défaut de Canva. C'est une incompatibilité fondamentale entre ce que Canva produit et ce que les ATS savent lire.

## Pourquoi les ATS ne lisent pas les CV Canva

### Le problème du PDF image

Quand tu exportes ton CV depuis Canva, le résultat est souvent un **PDF image** (c'est-à-dire que le texte est converti en pixels. Pour toi, ça ressemble à du texte. Pour un ATS, c'est une photo. Notre article [PDF ou Word : quel format passe mieux les ATS](/blog/cv-pdf-word-ats) détaille cette distinction en profondeur.

Les ATS ne peuvent pas extraire du texte d'une image. Ils ne peuvent donc pas détecter tes compétences, tes expériences, tes mots-clés. Résultat : ton CV obtient un score proche de zéro, quel que soit ton profil.

### La mise en page en colonnes

Même si le PDF Canva contient du texte sélectionnable, la structure pose problème. Canva utilise des colonnes côte à côte. La plupart des ATS lisent le texte de gauche à droite, ligne par ligne. Une mise en page en deux colonnes donne une lecture désordonnée : le logiciel mélange le contenu des colonnes, produit des phrases incohérentes, et rate des informations entières.

### Les zones de texte et les formes

Canva place souvent le texte dans des zones indépendantes : un bloc pour le nom, un bloc pour les coordonnées, des formes décoratives avec du texte dedans. Les ATS ont du mal à hiérarchiser ces blocs et peuvent ignorer certains d'entre eux complètement.

### Les icônes et les éléments graphiques

Compétences représentées par des barres de progression, sections avec des icônes personnalisées, en-têtes dans des formes colorées, ces éléments graphiques sont riches visuellement, mais muets pour un ATS. Pire : ils peuvent perturber la lecture du texte adjacent.

## Comment savoir si ton CV Canva a ce problème

### Test simple : copier-coller

Ouvre ton PDF Canva. Sélectionne tout le texte (Ctrl+A ou Cmd+A), copie-le et colle-le dans un éditeur de texte. Si le résultat est illisible, texte mélangé, mots coupés, lignes dans le désordre, c'est que ton CV ne sera pas bien lu par les ATS.

Si tu ne peux pas sélectionner de texte du tout, ton CV est un PDF image. C'est le cas le plus problématique.

### Test avec un scanner ATS

Utilise un outil d'analyse de CV pour voir le score que ton CV obtient. Un score très bas sur un profil pourtant qualifié est souvent le signe d'un problème de lecture du document.

## Comment corriger ton CV Canva

### Solution 1 : Exporter en PDF texte depuis Canva

Dans Canva, quand tu exportes en PDF, assure-toi de choisir "PDF, Impression" et non "PDF, Standard". Vérifie ensuite que le texte est sélectionnable dans le fichier exporté.

Cette solution améliore le problème du PDF image, mais ne résout pas forcément les problèmes de colonnes et de mise en page complexe.

### Solution 2 : Simplifier la mise en page dans Canva

Choisis un modèle Canva à **une seule colonne**, sans zones de texte superposées, sans barres de compétences graphiques. Des modèles minimalistes avec un fond blanc et une typographie simple sont les plus compatibles ATS.

Évite : les modèles à double colonne, les en-têtes dans des formes colorées, les compétences représentées par des étoiles ou des barres.

Préfère : une colonne unique, des sections clairement titrées, des puces simples pour les expériences.

### Solution 3 : Passer à un format Word ou Google Docs pour le fond

Si tu tiens à un beau design visuel pour les candidatures directes (LinkedIn, envoi par email à des contacts), garde ton Canva. Mais pour les candidatures via des plateformes ATS, Indeed, Welcome to the Jungle, LinkedIn Applications, APEC, prépare une version Word ou Google Docs avec une mise en page simple.

Un CV propre et bien structuré dans un format lisible battra presque toujours un CV design illisible pour un ATS.

## Ce que CVpass fait pour les CV Canva

CVpass détecte automatiquement si ton CV est au format image ou si le texte pose des problèmes de lecture. L'outil te guide pour exporter correctement ton CV et analyse ensuite chaque section pour calculer ton score ATS par rapport à l'offre que tu vises.

Pour chaque point faible détecté, l'IA propose une reformulation directement utilisable, tu n'as plus qu'à cliquer Accepter.

---

**Tu as un CV Canva ? Vérifie maintenant s'il passe les ATS.** [Analyse gratuite sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "optimiser-cv-ats-france",
    title:
      "Comment optimiser son CV pour les ATS en France : guide complet 2026",
    metaTitle:
      "Optimiser son CV pour les ATS en France : guide complet 2026 | CVpass",
    metaDescription:
      "Guide complet pour rendre ton CV compatible ATS en France en 2026. Méthodes concrètes, erreurs à éviter, outils recommandés.",
    description:
      "Guide pratique pour rendre ton CV compatible avec les ATS utilisés par les recruteurs français.",
    date: "2026-02-19",
    readTime: "8 min",
    category: "Guide ATS",
    tags: ["Guide ATS", "Optimisation CV", "France"],
    image: "/blog/optimiser-cv-ats-france.svg",
    content: `
## Les ATS en France en 2026 : ce qu'il faut savoir

Le marché de l'emploi français a pleinement adopté les systèmes de gestion des candidatures. Les grandes entreprises, les cabinets de recrutement et même les PME en croissance utilisent aujourd'hui des ATS pour gérer des volumes de candidatures que les équipes RH ne pourraient pas traiter manuellement.

Des plateformes comme Welcome to the Jungle, LinkedIn, APEC et Indeed intègrent leur propre système de filtrage. Les entreprises utilisent des solutions comme Workday, Greenhouse, Lever ou des outils français comme Teamtailor. Chacun a ses particularités, mais tous partagent les mêmes principes fondamentaux de lecture et d'analyse des CV.

Comprendre comment ces systèmes fonctionnent te donne un avantage concret sur la majorité des candidats qui ignorent complètement ce mécanisme. Pour identifier rapidement les problèmes dans ton CV, consulte notre checklist des [10 erreurs CV qui font planter les ATS](/blog/erreurs-cv-ats).

## Les spécificités du marché français

### Le rôle des plateformes emploi

En France, une grande partie des candidatures passe par des plateformes intermédiaires : APEC pour les cadres, Pôle Emploi pour un large spectre, Welcome to the Jungle et LinkedIn pour les profils tech et marketing. Chacune de ces plateformes a son propre système de matching entre CV et offres.

Quand tu postules directement sur le site d'une entreprise, tu passes souvent par un ATS intégré à leur processus RH. Quand tu postules via une plateforme, l'algorithme de la plateforme fait un premier tri avant même que le recruteur ne voie ta candidature.

### La langue et le vocabulaire sectoriel

Les mots-clés en français ne se traduisent pas directement des équivalents anglais. "Product Manager" n'est pas toujours équivalent à "Chef de produit" dans tous les systèmes ATS. Certaines offres utilisent le vocabulaire anglais même pour des postes basés en France, d'autres privilégient les termes français.

La règle : utilise exactement les termes employés dans l'offre à laquelle tu postules, quelle que soit la langue.

## Les 7 erreurs qui rendent un CV invisible pour les ATS en France

### Erreur 1 : Un CV générique non adapté

C'est l'erreur numéro un. Envoyer le même CV pour toutes les candidatures garantit un score ATS faible sur chaque offre. Chaque poste a ses mots-clés spécifiques.

La solution n'est pas de réécrire ton CV entièrement à chaque fois. Il s'agit d'adapter les formulations dans tes expériences et compétences pour qu'elles correspondent au vocabulaire de chaque offre.

### Erreur 2 : Une mise en page trop complexe

Colonnes multiples, tableaux, zones de texte dans des formes graphiques, en-têtes dans des images, tout ça perturbe la lecture automatisée. Les ATS lisent le texte dans un ordre linéaire et ont du mal avec les structures non conventionnelles.

### Erreur 3 : Des compétences vagues ou non quantifiées

"Excellentes compétences en communication" ou "bonne maîtrise d'Excel" n'apportent aucune valeur à un ATS. Il faut des termes précis et, quand c'est possible, des résultats chiffrés.

### Erreur 4 : L'absence de section Compétences

Certains candidats intègrent toutes leurs compétences dans le texte des expériences. C'est bien pour la lecture humaine, mais les ATS cherchent souvent une section "Compétences" ou "Outils" dédiée pour extraire ces informations rapidement.

### Erreur 5 : Des titres de section non standards

"Mon parcours" au lieu d'"Expérience professionnelle", "Ce que je sais faire" au lieu de "Compétences", les ATS cherchent des intitulés standards. Sois conventionnel sur les titres de section.

### Erreur 6 : Un résumé de profil inutile

Un résumé comme "Professionnel dynamique cherchant de nouveaux défis" prend de la place sans apporter de valeur. Un bon résumé de profil pour l'ATS contient les 3-4 compétences clés du poste visé et 1-2 réalisations significatives.

### Erreur 7 : Des lacunes dans les dates

Les ATS extraient les informations de chronologie. Des dates manquantes ou mal formatées peuvent perturber le calcul de ton niveau d'expérience.

## La méthode étape par étape pour optimiser ton CV ATS

### Étape 1 : Décortique l'offre d'emploi

Avant toute modification, analyse l'offre en profondeur. Identifie :

- Les **compétences techniques** mentionnées (logiciels, langages, méthodologies)
- Les **soft skills** explicitement demandés
- Les **qualifications** requises (diplôme, années d'expérience, certifications)
- Les **termes répétés**, ce qui revient plusieurs fois est prioritaire
- Le **vocabulaire sectoriel** propre à l'entreprise ou au secteur

### Étape 2 : Cartographie les correspondances

Compare l'offre avec ton CV actuel. Pour chaque compétence demandée dans l'offre, vérifie si :
- Elle apparaît dans ton CV avec exactement les mêmes termes
- Elle est présente mais formulée différemment
- Elle est absente (dans ce cas, si tu la possèdes réellement, elle doit être ajoutée)

### Étape 3 : Adapte les formulations

Pour chaque compétence présente mais mal formulée, ajuste le texte. Ce n'est pas du mensonge, c'est de la traduction de tes expériences réelles dans le vocabulaire attendu.

### Étape 4 : Enrichis les bullet points

Chaque expérience doit être décrite avec des verbes d'action forts et des résultats chiffrés quand c'est possible. "Géré" devient "Piloté". "Aidé à améliorer" devient "Optimisé avec un résultat X".

### Étape 5 : Vérifie la structure

Assure-toi que :
- Les sections ont des titres standards (Expérience professionnelle, Formation, Compétences)
- Le format est une seule colonne
- Les dates sont cohérentes et présentes
- Pas de tableaux ni de zones graphiques

### Étape 6 : Teste avec un scanner ATS

Analyse ton CV modifié par rapport à l'offre. Le score doit avoir augmenté. Si des points faibles persistent, identifie-les et ajuste.

## Le gain de temps avec CVpass

Toutes ces étapes prennent du temps, souvent 1 à 2 heures par candidature quand elles sont faites manuellement. CVpass automatise les étapes 2 à 6.

Tu colles ton offre, tu uploades ton CV. L'outil identifie les correspondances manquantes, calcule ton score ATS et propose des réécritures pour chaque point faible. Tu cliques Accepter sur les suggestions qui te conviennent. Tu télécharges un PDF propre.

Ce qui prenait 2 heures prend maintenant 20 minutes.

---

**Optimise ton CV pour les ATS dès maintenant.** [Essai gratuit sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "mots-cles-cv-ats",
    title: "Les mots-clés CV que les ATS recherchent vraiment en 2026",
    metaTitle:
      "Mots-clés CV ATS : ce que les recruteurs recherchent vraiment en 2026 | CVpass",
    metaDescription:
      "Quels mots-clés mettre dans son CV pour passer les filtres ATS ? Méthode concrète, exemples par secteur, erreurs à éviter.",
    description:
      "Quels mots-clés mettre dans son CV pour passer les filtres ATS ? Méthode et exemples.",
    date: "2026-02-24",
    readTime: "7 min",
    category: "Mots-clés",
    tags: ["Mots-clés", "Optimisation CV", "Score ATS"],
    image: "/blog/mots-cles-cv-ats.svg",
    content: `
## Pourquoi les mots-clés sont au cœur du score ATS

Un ATS fonctionne comme un moteur de recherche appliqué aux CV. Il extrait les mots-clés de l'offre d'emploi et cherche ces mêmes termes dans ta candidature. Plus la correspondance est forte, plus ton score est élevé.

Ce mécanisme simple a une implication directe : même si tu as toutes les compétences requises pour un poste, ton CV peut être mal classé si ces compétences sont décrites avec des termes différents de ceux utilisés dans l'offre. Pour comprendre comment ce [score ATS est calculé en détail](/blog/score-ats-cv), consulte notre guide dédié.

La maîtrise des mots-clés ATS est donc une compétence à part entière dans la recherche d'emploi moderne.

## Les trois types de mots-clés ATS

### 1. Les mots-clés techniques

Ce sont les compétences concrètes et mesurables : logiciels, langages de programmation, outils, certifications, méthodologies.

Exemples par secteur :
- **Tech / Dev** : JavaScript, React, Python, Docker, API REST, CI/CD, Agile, Scrum, DevOps
- **Marketing** : SEO, Google Analytics, Meta Ads, CRM, copywriting, inbound marketing, A/B testing
- **Finance** : Excel avancé, Power BI, SAP, contrôle de gestion, consolidation, IFRS
- **RH** : SIRH, recrutement, onboarding, gestion des talents, droit du travail, paie
- **Commercial** : Salesforce, prospection B2B, négociation, gestion de portefeuille clients, KPIs

Ces mots-clés doivent apparaître dans ton CV exactement comme ils sont formulés dans l'offre.

### 2. Les mots-clés de rôle et de responsabilité

Ce sont les verbes et expressions qui décrivent ce que tu as fait : "piloté", "développé", "géré", "optimisé", "coordonné", "implémenté".

Un ATS moderne analyse non seulement la présence des compétences, mais aussi le contexte dans lequel elles apparaissent. "Maîtrise de Python" et "Développé des scripts Python pour automatiser les rapports mensuels" n'ont pas le même poids.

### 3. Les mots-clés de qualification

Diplômes, certifications, niveaux d'expérience. "Bac+5", "Ingénieur", "Master", "certifié PMP", "certifié Google Ads", "bilingue anglais". Ces éléments sont souvent des filtres absolus dans les ATS, en dessous d'un certain niveau, la candidature est écartée automatiquement.

## Comment identifier les bons mots-clés pour chaque offre

### Méthode 1 : L'analyse manuelle

Lis l'offre d'emploi attentivement. Identifie les termes qui :
- Apparaissent plusieurs fois (fréquence = priorité)
- Sont dans les critères "requis" plutôt que "souhaités"
- Sont dans le titre du poste lui-même
- Correspondent aux technologies ou outils nommément cités

### Méthode 2 : La comparaison avec des offres similaires

Analyse 5 à 10 offres pour le même type de poste. Les mots-clés qui reviennent dans toutes les offres sont les incontournables du secteur, ils doivent absolument figurer dans ton CV si tu possèdes ces compétences.

### Méthode 3 : L'utilisation d'un outil d'analyse

Des outils comme CVpass analysent automatiquement la correspondance entre ton CV et une offre spécifique. Ils identifient les mots-clés présents dans l'offre mais absents de ton CV, et proposent des reformulations pour les intégrer naturellement.

## Les erreurs classiques avec les mots-clés ATS

### Utiliser des synonymes plutôt que les termes exacts

Tu écris "gestion de projet" quand l'offre dit "project management". Tu écris "développeur front-end" quand l'offre dit "développeur React". Tu écris "analyse de données" quand l'offre dit "data analysis".

La solution : utilise les deux formulations quand c'est naturel. "Gestion de projet (project management)" dans une section compétences couvre les deux cas.

### Bourrer le CV de mots-clés sans contexte

Certains candidats créent une section "Mots-clés" ou copient-collent des listes de compétences sans contexte. Les ATS modernes sont capables de détecter cette technique et peuvent la pénaliser. Surtout, si un recruteur humain lit ton CV après le tri automatique, une liste de mots-clés sans contexte est une mauvaise expérience.

Intègre les mots-clés dans des phrases qui décrivent des réalisations concrètes. "Implémenté une pipeline CI/CD sous GitHub Actions, réduisant les délais de déploiement de 60%" est infiniment plus fort que "CI/CD, GitHub Actions, DevOps" dans une liste.

### Négliger les variantes et acronymes

SQL et "Structured Query Language" ne sont pas forcément équivalents pour un ATS. "IA" et "Intelligence Artificielle", "RH" et "Ressources Humaines", certains systèmes ne font pas le lien. Utilise à la fois l'acronyme et la version développée, au moins une fois chacun.

### Ignorer les mots-clés de soft skills

Les ATS modernes analysent aussi les soft skills : "leadership", "gestion d'équipe", "communication", "autonomie", "rigueur". Ces termes apparaissent souvent dans les offres et doivent figurer dans ton CV, mais toujours avec des preuves, pas juste comme des adjectifs.

## La densité idéale de mots-clés

Il n'y a pas de règle universelle, mais voici une approche pratique : chaque compétence clé de l'offre devrait apparaître au moins 2 fois dans ton CV, dans des contextes différents (section compétences + description d'expérience + résumé de profil si applicable).

Une densité trop faible (1 occurrence) peut être insuffisante. Une densité trop élevée (5+ fois le même terme) n'apporte plus de valeur et peut paraître artificielle.

## Mots-clés universels qui améliorent tout CV

Certains termes sont recherchés dans presque tous les secteurs :

- **Gestion de projet / management de projet**
- **Coordination** et **communication**
- **Résolution de problèmes**
- **Autonomie** et **initiative**
- **Résultats** et **performance** (couplés à des chiffres)
- **Leadership** (pour les postes d'encadrement)
- **Collaboration** et **travail en équipe**

Ces mots-clés ne remplacent pas les compétences techniques spécifiques, mais ils complètent un profil et augmentent la pertinence globale du CV.

## Automatiser l'analyse avec CVpass

L'analyse manuelle des mots-clés prend du temps et demande une certaine expertise. CVpass automatise ce travail : il analyse l'offre d'emploi, extrait les mots-clés prioritaires et identifie les lacunes dans ton CV.

Pour chaque compétence manquante ou mal formulée, l'IA propose une réécriture adaptée. Tu valides les suggestions qui correspondent à ton profil réel. En 20 minutes, ton CV est optimisé pour l'offre précise que tu vises.

---

**Identifie les mots-clés manquants dans ton CV.** [Analyse gratuite sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-pdf-word-ats",
    title: "PDF ou Word : quel format de CV passe mieux les ATS ?",
    metaTitle:
      "Format CV ATS : PDF ou Word, lequel passe mieux les filtres ? | CVpass",
    metaDescription:
      "PDF ou Word pour un CV ATS ? La réponse dépend de comment le fichier est créé. Guide complet pour choisir le bon format selon les recruteurs français.",
    description:
      "PDF ou Word pour un CV ATS ? La réponse n'est pas si simple.",
    date: "2026-02-28",
    readTime: "6 min",
    category: "Format CV",
    tags: ["Format CV", "PDF", "Word"],
    image: "/blog/cv-pdf-word-ats.svg",
    content: `
## La question que tout le monde se pose

PDF ou Word ? C'est l'une des questions les plus fréquentes dans la recherche d'emploi. Et la réponse que tu entends le plus souvent, "le PDF, car il conserve la mise en page", est incomplète et peut te desservir.

La vraie réponse : **ce n'est pas le format qui compte, c'est comment le fichier est créé et ce qu'il contient**.

## Ce que les ATS savent faire (et ce qu'ils ne savent pas faire)

Les ATS doivent extraire du texte de ton CV pour l'analyser. Leur capacité à le faire dépend de la nature du fichier, pas uniquement de son extension.

### PDF texte vs PDF image

Un PDF peut contenir deux types de données très différents :

- **PDF texte** : le texte est encodé dans le fichier, tu peux le sélectionner et le copier. Un ATS peut l'extraire facilement.
- **PDF image** : le document est une capture d'écran ou un scan. Le texte est des pixels. Un ATS ne peut pas l'extraire, il ne voit qu'une image.

Beaucoup de CV créés sur Canva, Photoshop, ou exportés depuis certains logiciels de PAO sont des PDFs images. Résultat : un score ATS proche de zéro, quelle que soit la qualité réelle du candidat. Si tu utilises Canva, consulte notre guide pour [corriger un CV Canva invisible pour les ATS](/blog/cv-canva-ats).

### Le cas Word (DOCX)

Un fichier Word contient du texte structuré, presque toujours lisible par les ATS. L'extraction est généralement fiable. En revanche, une mise en page Word très complexe, tableaux imbriqués, zones de texte, colonnes côte à côte, peut créer des problèmes similaires à ceux d'un PDF mal construit.

## Comparaison pratique des formats

### PDF bien construit (texte sélectionnable, mise en page simple)

- ✓ Lisible par les ATS modernes
- ✓ Mise en page préservée chez tous les destinataires
- ✓ Professionnel et difficile à modifier accidentellement
- ✓ Adapté aux candidatures directes par email
- ⚠ Peut poser problème avec les vieux ATS

### Word (DOCX, mise en page simple)

- ✓ Excellente compatibilité ATS dans presque tous les systèmes
- ✓ Format attendu par certains recruteurs et cabinets de recrutement
- ✓ Facile à modifier rapidement
- ⚠ La mise en page peut être altérée selon la version Word du destinataire
- ⚠ Perçu comme moins soigné par certains recruteurs

### PDF image (Canva, export graphique)

- ✗ Illisible pour les ATS
- ✗ Score ATS proche de zéro
- ✓ Belle mise en page visuelle (mais inutile si personne ne le lit)

## Que recommandent les recruteurs français ?

La pratique en France est généralement cohérente : **le PDF est le format de référence pour les candidatures**, mais à condition qu'il soit construit correctement.

Les cabinets de recrutement demandent parfois explicitement un Word pour pouvoir modifier le CV avant de le transmettre à leurs clients (retrait des coordonnées, harmonisation du format). Dans ce cas, fournis un Word simple et propre.

Pour les candidatures directes sur des plateformes comme Welcome to the Jungle, LinkedIn, ou le site d'une entreprise, un PDF texte bien structuré est le meilleur choix.

## Les règles d'or pour chaque format

### Règle d'or pour le PDF

1. Génère-le depuis Word, Google Docs, LibreOffice ou un éditeur de CV ATS-compatible
2. Vérifie que le texte est sélectionnable (clic dans le PDF, essaie de sélectionner une ligne)
3. Évite les mises en page à deux colonnes, les tableaux, les zones de texte graphiques
4. Une colonne unique, des sections clairement titrées, du texte en puces

### Règle d'or pour le Word

1. Structure simple : une colonne, titres avec styles de titres (Titre 1, Titre 2), pas de tableaux pour la mise en page
2. Évite les zones de texte, utilise des paragraphes normaux
3. Format DOCX (pas DOC, pas ODT)
4. Vérifie que le fichier s'ouvre proprement sur une version différente de Word

## Comment tester la compatibilité ATS de ton CV

### Test 1 : La sélection de texte

Ouvre ton PDF. Clique dans le document et essaie de sélectionner du texte. Si tu peux sélectionner et copier des mots, le texte est extrait. Sinon, ton CV est probablement un PDF image.

### Test 2 : Le copier-coller

Sélectionne tout le texte de ton PDF (Ctrl+A ou Cmd+A) et colle-le dans un éditeur de texte simple (Notepad, TextEdit). Si le résultat ressemble à ton CV, sections dans le bon ordre, texte lisible, c'est bon signe. Si c'est un mélange chaotique de mots, l'ATS aura les mêmes difficultés.

### Test 3 : Un scanner ATS

Le test le plus fiable est d'uploader ton CV dans un outil d'analyse ATS. Il te dira directement si le contenu est lisible et comment le score se compare à une offre.

## Le meilleur workflow en pratique

Si tu cherches activement un emploi, je te recommande d'avoir **deux versions** de ton CV :

**Version ATS** : format simple, une colonne, PDF texte ou Word. C'est celle que tu envoies sur toutes les plateformes emploi et via les formulaires en ligne des entreprises.

**Version visuelle** : ton beau CV Canva ou autre, avec la mise en page soignée. Celle-là, garde-la pour les candidatures directes par email à des personnes que tu connais, pour les salons, ou pour accompagner une version ATS propre.

## CVpass génère le bon format

Quand CVpass optimise ton CV, il produit un PDF sobre et structuré, conçu pour être parfaitement lisible par les ATS. Pas de colonnes, pas d'images, pas de tableaux, juste du contenu bien organisé et optimisé pour l'offre que tu vises.

Tu gardes ton CV visuel pour l'impression et les contacts humains. Tu utilises le PDF CVpass pour toutes les candidatures qui passent par un système automatisé.

---

**Génère un PDF ATS-compatible en 20 minutes.** [Analyse gratuite sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "scanner-cv-gratuit",
    title:
      "Scanner son CV gratuitement : comparatif des meilleurs outils en 2026",
    metaTitle:
      "Scanner CV gratuit : comparatif des meilleurs outils ATS en 2026 | CVpass",
    metaDescription:
      "Comparatif des meilleurs scanners CV gratuits en 2026 : fonctionnalités, limites et lequel choisir pour vraiment optimiser ton CV ATS.",
    description:
      "Comparatif des meilleurs outils gratuits pour scanner et analyser son CV ATS en 2026.",
    date: "2026-03-03",
    readTime: "8 min",
    category: "Outils",
    tags: ["Outils", "Scanner CV", "Comparatif"],
    image: "/blog/scanner-cv-gratuit.svg",
    content: `
## Pourquoi scanner son CV avant de postuler ?

La recherche d'emploi en 2026 demande plus qu'un CV bien présenté. Avant qu'un recruteur humain lise ta candidature, un logiciel ATS analyse automatiquement ton document, extrait les mots-clés et calcule un score de pertinence.

Scanner son CV avant de postuler, c'est comprendre ce que l'ATS va trouver, ou ne pas trouver. Si tu ne sais pas encore ce qu'est un [score ATS et comment il est calculé](/blog/score-ats-cv), commence par là. C'est corriger les problèmes avant qu'ils t'empêchent d'avoir un entretien. Et c'est gagner un avantage concret sur les candidats qui ne font pas cette démarche.

Voici un comparatif honnête des options disponibles.

## Ce qu'un bon scanner de CV doit faire

Avant de comparer les outils, définissons ce qu'on attend d'un vrai scanner ATS :

- **Analyser la correspondance** entre le CV et une offre d'emploi précise (pas juste analyser le CV dans l'absolu)
- **Identifier les mots-clés manquants** par rapport à l'offre
- **Calculer un score** objectif et explicable
- **Indiquer les problèmes de format** (PDF image, colonnes, zones de texte)
- **Proposer des améliorations** concrètes

Un scanner qui te donne juste un score sans te dire quoi corriger est peu utile. Un scanner qui analyse ton CV sans le comparer à une offre précise est encore moins pertinent.

## Les outils disponibles en 2026

### Jobscan

**Principe** : Tu colles le texte de l'offre d'emploi et tu uploades ton CV. Jobscan calcule un score de correspondance et liste les mots-clés de l'offre présents ou absents dans ton CV.

**Points forts** : Interface claire, analyse de correspondance détaillée, suggestions de mots-clés.

**Limites** : Version gratuite très limitée (quelques analyses par mois). Le reste de la valeur est derrière un abonnement payant. Interface en anglais, ce qui peut être un frein pour les candidats francophones.

**Adapté pour** : Les candidats bilingues ou anglophone qui postulent à des entreprises internationales.

### Resume Worded

**Principe** : Analyse le CV selon des critères généraux de qualité (impact des bullet points, clarté des accomplissements, lisibilité).

**Points forts** : Retours qualitatifs sur la formulation, conseils sur la structure.

**Limites** : Analyse générique, pas basée sur une offre d'emploi précise. Ne calcule pas un vrai score ATS au sens strict. Entièrement en anglais.

**Adapté pour** : Améliorer la qualité générale d'un CV avant de l'adapter offre par offre.

### CVcrea / CVDesignR (outils français)

**Principe** : Ces outils permettent de créer un CV et incluent une fonction d'analyse ATS.

**Points forts** : Interface en français, intégration dans un parcours de création de CV.

**Limites** : L'analyse ATS est souvent superficielle. Ces outils te donnent un score et une liste de problèmes, mais tu te retrouves seul pour corriger. Pas de réécriture automatique, pas de suggestions adaptées à une offre précise.

**Adapté pour** : Avoir une première idée des problèmes structurels du CV.

### Les scanners intégrés aux plateformes emploi

LinkedIn, Indeed et Welcome to the Jungle ont leurs propres algorithmes de matching. Ils ne te montrent pas directement un score, mais leur système de "correspondance de profil" repose sur les mêmes principes ATS.

**Limite principale** : Tu ne contrôles pas le processus et tu ne sais pas précisément pourquoi tu as un score élevé ou faible.

### CVpass

**Principe** : CVpass est conçu spécifiquement pour aller au-delà de l'analyse, jusqu'à la correction automatique. Tu uploades ton CV, tu colles l'offre d'emploi. L'IA analyse la correspondance, calcule un score ATS et propose une réécriture complète pour chaque point faible détecté.

**Points forts** :
- Analyse basée sur l'offre précise que tu vises, pas une analyse générique
- Réécriture IA des bullet points faibles, tu n'as qu'à cliquer Accepter
- Score qui remonte en temps réel à chaque suggestion acceptée
- Interface en français, adapté au marché français (APEC, Welcome to the Jungle, LinkedIn FR)
- Export PDF ATS-compatible
- Détection des problèmes de format (PDF image, colonnes)

**Limites** : Les fonctionnalités avancées (éditeur 1-clic, réécriture IA, export PDF) sont dans les plans payants. L'analyse de base est gratuite.

**Adapté pour** : Les candidats qui veulent non seulement comprendre les problèmes de leur CV, mais les corriger rapidement et efficacement. CVpass gère aussi la [lettre de motivation compatible ATS](/blog/lettre-motivation-ats) pour une candidature complète.

## Comparaison directe sur les critères essentiels

| Critère | Jobscan | CVcrea | Resume Worded | CVpass |
|---|---|---|---|---|
| Analyse vs offre précise | ✓ | ✗ | ✗ | ✓ |
| Interface en français | ✗ | ✓ | ✗ | ✓ |
| Réécriture IA des suggestions | ✗ | ✗ | ✗ | ✓ |
| Score en temps réel | ✗ | ✗ | ✗ | ✓ |
| Export PDF ATS | ✓ | ✓ | ✗ | ✓ |
| Gratuit sans limite | ✗ | Partiel | Partiel | Analyse gratuite |

## Quelle approche adopter ?

La bonne stratégie n'est pas forcément d'utiliser un seul outil. Voici une approche en deux temps :

**Première étape, Analyse générale** : utilise un outil comme Resume Worded ou la fonction d'analyse de CVcrea pour identifier les problèmes structurels de ton CV (formulations faibles, manque de chiffres, sections mal titrées). Fais ces corrections une bonne fois pour toutes.

**Deuxième étape, Adaptation par offre** : pour chaque candidature importante, utilise CVpass pour analyser la correspondance avec l'offre précise et corriger les mots-clés manquants. C'est là que se gagne ou se perd chaque candidature.

## Ce que j'attends vraiment d'un scanner CV

La plupart des outils te disent quoi corriger. Très peu te montrent comment corriger. Et aucun, sauf CVpass, ne corrige directement.

C'est la différence entre un médecin qui te dit "vous avez un problème au genou" et un kinésithérapeute qui te guide exercice par exercice. Le diagnostic, c'est bien. L'accompagnement jusqu'à la solution, c'est ce qui change vraiment les résultats.

Si tu envoies 5 à 10 candidatures par semaine, le temps passé à analyser et corriger manuellement chaque CV représente plusieurs heures. Automatiser cette étape n'est pas de la paresse, c'est de l'efficacité.

---

**Essaie CVpass gratuitement, analyse complète, sans carte de crédit.** [Scanner mon CV sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "lettre-motivation-ats",
    title:
      "Lettre de motivation ATS : comment rédiger une lettre qui passe les filtres automatiques",
    metaTitle:
      "Lettre de motivation ATS : rédiger une lettre compatible filtres automatiques | CVpass",
    metaDescription:
      "Comment rédiger une lettre de motivation compatible ATS en 2026. Structure, mots-clés, format et erreurs à éviter pour passer les filtres automatiques.",
    description:
      "Comment rédiger une lettre de motivation compatible ATS en 2026.",
    date: "2026-03-07",
    readTime: "8 min",
    category: "Lettre de motivation",
    tags: ["Lettre de motivation", "Mots-clés", "Candidature"],
    image: "/blog/lettre-motivation-ats.svg",
    content: `
## La lettre de motivation face aux ATS : ce que personne ne t'explique

Quand on parle d'optimisation ATS, tout le monde pense au CV. Pourtant, la lettre de motivation passe elle aussi par les filtres automatiques dans de nombreux cas. Les systèmes de gestion des candidatures, les fameux ATS, analysent l'ensemble des documents que tu soumets, y compris la lettre de motivation quand elle est demandée.

Le problème : la plupart des candidats rédigent leur lettre de motivation ATS comme une dissertation littéraire. Des phrases longues, un style soutenu, des formules de politesse à rallonge, mais aucune stratégie de mots-clés. Résultat : la lettre ne renforce pas la candidature. Elle la plombe parfois.

Comprendre comment les ATS traitent les lettres de motivation change radicalement la façon dont tu dois les rédiger.

## Comment les ATS analysent les lettres de motivation

### L'extraction de texte

Comme pour le CV, l'ATS extrait le texte brut de ta lettre. Si tu envoies un PDF image ou un fichier avec une mise en page complexe, colonnes, en-têtes graphiques, zones de texte décoratives, le logiciel peut rater une partie du contenu.

La première règle est donc la même que pour le CV : le texte doit être sélectionnable, dans un format simple et lisible par une machine.

### L'analyse des mots-clés

L'ATS compare les termes de ta lettre avec ceux de l'offre d'emploi. Une lettre de motivation compatible ATS contient les compétences clés, les outils et le vocabulaire sectoriel mentionnés dans l'offre. Ce n'est pas du bourrage de mots-clés, c'est une correspondance naturelle entre ce que l'entreprise cherche et ce que tu apportes.

### Le poids relatif de la lettre

Dans la plupart des systèmes, le CV a plus de poids que la lettre dans le calcul du score global. Mais la lettre peut faire la différence quand deux candidats ont des CV similaires. Elle peut aussi compenser un mot-clé absent du CV si ce mot-clé apparaît dans la lettre.

Autrement dit : la lettre de motivation n'est pas le document principal, mais elle amplifie ou affaiblit ta candidature. Pour optimiser ton CV en parallèle, découvre notre [comparatif des meilleurs scanners CV gratuits](/blog/scanner-cv-gratuit).

## La structure idéale d'une lettre de motivation ATS

### L'accroche : directe et ciblée

Oublie les formules classiques comme "Suite à votre annonce parue sur...". L'accroche doit poser immédiatement ta valeur ajoutée en utilisant des termes de l'offre.

**Exemple faible** : "Je me permets de vous adresser ma candidature pour le poste publié sur votre site."

**Exemple fort** : "Développeur Python avec 4 ans d'expérience en développement d'API REST et en architecture microservices, je souhaite rejoindre votre équipe technique pour contribuer à vos projets de migration cloud."

L'accroche forte contient déjà trois mots-clés techniques tirés de l'offre. L'ATS les détecte dès la première phrase.

### Le corps : compétences et preuves

Le corps de la lettre doit faire correspondre tes compétences aux besoins de l'offre. Chaque paragraphe du corps devrait répondre à un besoin identifié dans l'annonce.

La méthode la plus efficace pour rédiger une lettre de motivation compatible ATS :

- **Identifie les 3-4 compétences principales** de l'offre
- **Consacre un paragraphe court à chacune**, en décrivant comment tu l'as mise en œuvre dans un contexte professionnel concret
- **Utilise les termes exacts de l'offre** dans tes descriptions, pas des synonymes approximatifs
- **Ajoute un résultat concret** quand c'est possible : un livrable, une amélioration, un projet abouti

### La conclusion : disponibilité et appel à l'action

La conclusion doit rester simple : confirmer ta motivation, mentionner ta disponibilité et inviter à un échange. Évite les formules alambiquées. Une phrase directe comme "Je serais ravi d'échanger avec vous sur ma contribution possible à votre équipe" est plus efficace qu'un paragraphe de politesses formelles.

## Les règles de formatage pour une lettre ATS-compatible

### Le format du fichier

- **PDF texte** (généré depuis Word, Google Docs ou LibreOffice) : le meilleur choix
- **DOCX** : accepté par tous les ATS
- **PDF image** (export Canva graphique) : à éviter absolument

### La mise en page

- **Pas de colonnes**, une seule colonne de texte, alignée à gauche
- **Pas d'en-tête graphique**, tes coordonnées en texte simple en haut du document
- **Pas de tableau** ni de zone de texte flottante
- **Police standard** : Arial, Calibri, Times New Roman, ou toute police sans empattement classique
- **Taille 10 à 12 points**, lisible par l'humain, neutre pour la machine

### La longueur

Une lettre de motivation ATS doit être concise. Les recruteurs consacrent peu de temps à la lecture de chaque candidature. Trois à quatre paragraphes, soit environ 250 à 400 mots, sont suffisants. Chaque phrase doit apporter une information utile.

## Les 5 erreurs qui sabotent ta lettre de motivation ATS

### Erreur 1 : Aucun mot-clé de l'offre

Tu écris une lettre générique que tu envoies à toutes tes candidatures. L'ATS ne trouve aucune correspondance avec l'offre. La lettre n'apporte aucune valeur au score global.

**Comment corriger** : relis l'offre avant chaque lettre. Intègre au minimum 5 à 7 mots-clés techniques ou sectoriels dans le texte.

### Erreur 2 : Un format graphique

Tu utilises un modèle de lettre avec des bordures, des colonnes latérales, un logo personnel, des icônes. L'ATS ne peut pas parser correctement le contenu.

**Comment corriger** : utilise un document texte simple, sans fioritures visuelles.

### Erreur 3 : Des phrases creuses sans contenu concret

"Dynamique et motivé, je souhaite apporter mon expertise à votre entreprise leader dans son domaine." Cette phrase ne contient aucun mot-clé exploitable et aucune information vérifiable.

**Comment corriger** : remplace chaque phrase vague par une affirmation concrète avec un verbe d'action, une compétence identifiable et si possible un contexte réel.

### Erreur 4 : Répéter le CV au lieu de le compléter

Ta lettre paraphrase ton CV point par point. L'ATS détecte les mêmes informations dans les deux documents, mais tu perds l'occasion d'ajouter des mots-clés supplémentaires ou de contextualiser tes compétences différemment.

**Comment corriger** : utilise la lettre pour développer 2-3 expériences clés avec un angle narratif que le format CV ne permet pas. Ajoute des compétences transversales ou des projets pertinents qui n'apparaissent pas dans le CV.

### Erreur 5 : Ignorer la lettre quand elle est "facultative"

Quand une plateforme indique que la lettre de motivation est facultative, beaucoup de candidats la sautent. Pourtant, soumettre une lettre bien rédigée reste un avantage : elle ajoute du contenu analysable par l'ATS et montre au recruteur humain un effort supplémentaire.

**Comment corriger** : rédige toujours une lettre courte (250 mots suffisent) quand l'option est disponible.

## Comment CVpass t'aide à rédiger une lettre de motivation ATS

CVpass ne se limite pas à l'analyse de ton CV. L'outil identifie les mots-clés prioritaires de l'offre d'emploi et t'aide à construire une candidature complète, CV et lettre, qui maximise la correspondance avec les filtres automatiques.

En analysant l'offre et ton profil, CVpass te montre quels termes intégrer dans ta lettre pour compléter les mots-clés déjà présents dans ton CV. Tu obtiens une candidature cohérente où chaque document renforce l'autre.

Le résultat : un score ATS global plus élevé et une candidature qui se démarque aussi bien pour les machines que pour les recruteurs humains.

---

**Optimise ta candidature complète, CV et lettre de motivation.** [Commence ton analyse gratuite sur cvpass.fr →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-par-secteur-ats",
    title:
      "CV ATS par secteur : développeur, commercial, cadre, les règles qui changent tout",
    metaTitle:
      "CV ATS par secteur : développeur, commercial, cadre, guide 2026 | CVpass",
    metaDescription:
      "Les règles ATS changent selon ton secteur. CV développeur, commercial, cadre : mots-clés, structure et erreurs spécifiques à éviter.",
    description:
      "Les règles ATS changent selon ton secteur. CV développeur, commercial, cadre : les différences clés.",
    date: "2026-03-14",
    readTime: "9 min",
    category: "CV par secteur",
    tags: ["CV par secteur", "Développeur", "Commercial"],
    image: "/blog/cv-par-secteur-ats.svg",
    content: `
## Pourquoi un CV ATS par secteur change tout

Un ATS ne fonctionne pas de la même façon selon le poste. Plus précisément, c'est l'offre d'emploi qui détermine les critères de filtrage, et chaque secteur a son propre vocabulaire, ses propres attentes et ses propres pièges.

Un CV ATS développeur n'a rien à voir avec un CV ATS commercial ou un CV ATS cadre dirigeant. Les mots-clés diffèrent. La structure optimale change. Les erreurs fatales ne sont pas les mêmes.

Pourtant, la plupart des guides d'optimisation ATS donnent des conseils génériques qui s'appliquent mal à des profils spécifiques. Ce guide détaille les règles concrètes pour trois profils parmi les plus demandés sur le marché français.

## CV ATS développeur : la technique au premier plan

Pour un guide détaillé, consulte notre article dédié : [CV développeur ATS : guide complet](/blog/cv-developpeur-ats).

### Les mots-clés qui comptent

Pour un développeur, l'ATS cherche avant tout des **compétences techniques précises**. Les langages de programmation, les frameworks, les outils DevOps, les méthodologies de travail, chaque terme est un filtre potentiel.

Les mots-clés à surveiller dans les offres développeur :

- **Langages** : JavaScript, TypeScript, Python, Java, Go, Rust, PHP, C#
- **Frameworks front-end** : React, Next.js, Vue.js, Angular, Svelte
- **Frameworks back-end** : Node.js, Django, Spring Boot, Express, FastAPI
- **Bases de données** : PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
- **DevOps et cloud** : Docker, Kubernetes, AWS, GCP, Azure, CI/CD, GitHub Actions, Terraform
- **Méthodologies** : Agile, Scrum, Kanban, TDD, code review, pair programming

### La structure optimale du CV développeur

Le CV ATS développeur doit mettre en avant une **section Compétences techniques** clairement identifiable. Place-la en haut du CV, juste après le résumé de profil. Liste les technologies par catégories (langages, frameworks, outils, cloud).

Pour les expériences, chaque bullet point doit combiner un **verbe d'action technique**, une **technologie** et un **résultat concret**.

**Exemple faible** : "Développement de fonctionnalités pour l'application web"

**Exemple fort** : "Développé une API REST avec Node.js et Express, servant des données à une application React utilisée par l'équipe commerciale de 40 personnes"

### Les erreurs spécifiques au profil développeur

**Erreur 1 : Lister les technologies sans contexte.** Un bloc "JavaScript, React, Python, Docker, AWS" n'a presque aucun poids pour un ATS avancé. Ces mots-clés doivent aussi apparaître dans les descriptions d'expériences.

**Erreur 2 : Utiliser des versions obsolètes.** Si l'offre demande "React" et que ton CV dit "React.js 16", tu ajoutes une friction inutile. Mentionne la technologie telle qu'elle apparaît dans l'offre, et précise la version uniquement si c'est pertinent.

**Erreur 3 : Omettre les projets open source ou personnels.** Pour les développeurs juniors ou en reconversion, une section "Projets" avec des liens GitHub peut compenser un manque d'expérience professionnelle, et ajouter des mots-clés techniques précieux.

**Erreur 4 : Négliger les soft skills techniques.** Les offres développeur mentionnent souvent "travail en équipe", "code review", "communication avec les équipes produit". Ces termes doivent figurer dans ton CV si tu les pratiques.

## CV ATS commercial : les résultats au centre

Pour un guide détaillé, consulte notre article dédié : [CV commercial ATS : guide complet](/blog/cv-commercial-ats).

### Les mots-clés qui comptent

Pour un profil commercial, l'ATS cherche des **compétences de vente et de relation client**, des **outils CRM** et des **indicateurs de performance**.

Les mots-clés à surveiller dans les offres commerciales :

- **Processus de vente** : prospection B2B, prospection B2C, négociation, closing, fidélisation, cycle de vente, qualification de leads
- **Outils** : Salesforce, HubSpot, Pipedrive, LinkedIn Sales Navigator, CRM
- **Indicateurs** : chiffre d'affaires, objectifs commerciaux, KPIs, taux de conversion, panier moyen, pipeline
- **Techniques** : cold calling, social selling, vente consultative, upselling, cross-selling, gestion de portefeuille clients
- **Secteur** : B2B, B2C, SaaS, grands comptes, PME, retail

### La structure optimale du CV commercial

Le CV ATS commercial doit ouvrir avec un **résumé de profil orienté résultats**. Les chiffres parlent plus que les mots dans ce secteur : années d'expérience, taille du portefeuille géré, types de clients.

Pour chaque expérience, structure tes bullet points autour du modèle **Action + Cible + Résultat** :

**Exemple faible** : "Gestion d'un portefeuille clients et développement commercial"

**Exemple fort** : "Géré un portefeuille de 80 comptes B2B dans le secteur SaaS, avec un objectif annuel atteint chaque année sur les 3 dernières années"

### Les erreurs spécifiques au profil commercial

**Erreur 1 : Des descriptions vagues sans chiffres.** Le monde commercial tourne autour des résultats mesurables. Un CV commercial sans chiffres est un signal faible pour l'ATS et pour le recruteur.

**Erreur 2 : Omettre les outils CRM.** Les offres commerciales mentionnent presque toujours un CRM spécifique. Si tu as utilisé Salesforce, HubSpot ou un autre outil, il doit apparaître explicitement, pas juste "outils CRM".

**Erreur 3 : Confondre responsabilités et accomplissements.** "Responsable du développement commercial zone Île-de-France" décrit un rôle, pas un résultat. L'ATS et le recruteur veulent savoir ce que tu as accompli dans ce rôle.

**Erreur 4 : Ignorer le vocabulaire de l'offre.** Si l'offre parle de "business development" et que tu écris "développement commercial", l'ATS peut ne pas faire le rapprochement. Utilise les termes exacts de l'annonce.

## CV ATS cadre : la vision stratégique

### Les mots-clés qui comptent

Pour un profil cadre ou cadre dirigeant, l'ATS cherche des **compétences de management**, de **pilotage stratégique** et de **transformation organisationnelle**.

Les mots-clés à surveiller dans les offres cadres :

- **Management** : management d'équipe, leadership, gestion des talents, coaching, recrutement, évaluation de la performance
- **Stratégie** : stratégie d'entreprise, plan d'action, feuille de route, transformation digitale, conduite du changement, business plan
- **Finance et pilotage** : P&L, budget, reporting, tableaux de bord, ROI, réduction des coûts, optimisation des processus
- **Gouvernance** : comité de direction, CODIR, conseil d'administration, présentation aux investisseurs, stakeholder management
- **Transversal** : gestion de projet, coordination interservices, relations sociales, conformité réglementaire

### La structure optimale du CV cadre

Le CV ATS cadre dirigeant doit mettre en avant l'**impact stratégique** dès le résumé de profil. Mentionne le périmètre de responsabilité (taille d'équipe, budget géré, chiffre d'affaires supervisé) et les domaines d'expertise.

Pour les expériences, chaque bullet point doit illustrer une **décision stratégique** et son **impact mesurable** :

**Exemple faible** : "Direction de l'équipe marketing et communication"

**Exemple fort** : "Piloté la refonte de la stratégie marketing digital, recrutement et management d'une équipe de 12 personnes, coordination avec les équipes produit et commerciale"

### Les erreurs spécifiques au profil cadre

**Erreur 1 : Trop de jargon interne.** Les cadres utilisent souvent le vocabulaire spécifique de leur entreprise précédente. L'ATS de l'entreprise cible ne connaît pas ces termes. Traduis tes accomplissements dans un vocabulaire universel.

**Erreur 2 : Un CV trop long.** Les profils cadres ont souvent 15 à 25 ans d'expérience et produisent des CV de 3-4 pages. La plupart des ATS lisent l'ensemble, mais les recruteurs humains décrochent après 2 pages. Concentre-toi sur les 10 dernières années en détail.

**Erreur 3 : Négliger la section Formation et Certifications.** Pour les postes cadres en France, le diplôme reste un critère de filtrage important dans les ATS, école de commerce, école d'ingénieur, MBA, certifications sectorielles.

**Erreur 4 : Omettre les compétences transversales.** Les offres cadres mentionnent souvent "conduite du changement", "transformation digitale", "management interculturel". Ces termes doivent apparaître dans le CV s'ils font partie de ton expérience.

## Comment CVpass adapte l'analyse par secteur

CVpass ne fait pas une analyse ATS générique. L'outil compare ton CV à l'offre d'emploi précise que tu vises, ce qui signifie que les mots-clés analysés, les suggestions de réécriture et le score calculé sont toujours adaptés au secteur et au poste.

Que tu sois développeur, commercial ou cadre dirigeant, CVpass identifie les termes spécifiques de ton secteur qui manquent dans ton CV et propose des reformulations adaptées. L'IA comprend la différence entre une suggestion de bullet point pour un développeur ("Implémenté une pipeline CI/CD avec GitHub Actions") et une suggestion pour un cadre ("Piloté la transformation digitale du département avec un budget de 500K€").

Le résultat : un CV ATS par secteur optimisé pour les filtres automatiques de ton domaine, sans passer des heures à reformuler manuellement chaque ligne.

---

**Optimise ton CV pour ton secteur.** [Analyse gratuite et personnalisée sur cvpass.fr →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "erreurs-cv-ats",
    title:
      "Les 10 erreurs CV qui font planter les ATS (et comment les corriger)",
    metaTitle:
      "10 erreurs CV ATS à éviter absolument en 2026 | CVpass",
    metaDescription:
      "Pourquoi ton CV est refusé par les ATS ? Les 10 erreurs les plus fréquentes et comment les corriger pour enfin décrocher des entretiens.",
    description:
      "Les 10 erreurs les plus fréquentes qui font échouer ton CV face aux ATS.",
    date: "2026-03-12",
    readTime: "7 min",
    category: "Erreurs CV",
    tags: ["Erreurs CV", "Optimisation CV", "Score ATS"],
    image: "/blog/erreurs-cv-ats.svg",
    content: `
## Pourquoi ton CV est refusé avant même d'être lu

Tu envoies des dizaines de candidatures. Tu es qualifié pour les postes. Pourtant, tu n'obtiens aucun entretien. Le problème n'est probablement pas ton profil, c'est la façon dont ton CV est lu par les machines.

Les ATS, les logiciels de tri automatique utilisés par les recruteurs, rejettent ou mal classent des candidatures à cause d'erreurs techniques que les candidats ignorent complètement. Ces erreurs CV ATS n'ont rien à voir avec ton expérience ou tes compétences. Elles concernent la façon dont ton CV est construit, formaté et formulé.

Voici les 10 erreurs les plus fréquentes qui font planter les ATS, et comment les corriger une par une.

## Erreur 1 : Un CV au format PDF image

### Le problème

Ton CV est un fichier PDF, mais le texte n'est pas sélectionnable. C'est le cas de nombreux CV exportés depuis Canva, Photoshop ou InDesign sans les bons réglages. Pour l'ATS, c'est une image, il ne peut extraire aucun texte, aucun mot-clé, aucune information. Ton score tombe à zéro.

### Comment corriger

Ouvre ton PDF et essaie de sélectionner du texte. Si tu ne peux pas, ton CV est un PDF image. Recréé-le depuis Word, Google Docs ou LibreOffice et exporte en PDF. Vérifie que le texte est bien sélectionnable dans le fichier exporté.

## Erreur 2 : Une mise en page en colonnes

### Le problème

Les CV à deux ou trois colonnes sont visuellement élégants. Mais les ATS lisent le contenu de gauche à droite, ligne par ligne. Avec des colonnes, le logiciel mélange le texte de la colonne gauche avec celui de la colonne droite, produisant des phrases incohérentes et ratant des informations entières.

### Comment corriger

Passe à un format à **une seule colonne**. Toutes les sections les unes sous les autres, dans un ordre logique. C'est moins spectaculaire visuellement, mais infiniment plus efficace pour les filtres automatiques.

## Erreur 3 : Des en-têtes créatifs ou dans des formes graphiques

### Le problème

Tu as mis ton nom dans un bandeau coloré, tes coordonnées dans une forme ronde, tes titres de section dans des rectangles avec un fond de couleur. L'ATS ne sait pas lire le texte qui se trouve dans ces éléments graphiques. Tes informations de contact, tes titres de section, tout peut être ignoré.

### Comment corriger

Utilise du **texte simple** pour toutes les informations. Ton nom en gras et en taille plus grande suffit. Les titres de section en gras ou en majuscules, sans fond coloré ni forme. Les coordonnées en texte brut en haut du document.

## Erreur 4 : L'absence de mots-clés de l'offre

### Le problème

Tu envoies le même CV pour toutes tes candidatures sans l'adapter à chaque offre. L'ATS compare ton CV à l'offre, si les termes clés de l'annonce ne figurent pas dans ton document, le score de correspondance est faible. Pourquoi ton CV est refusé par les ATS ? Souvent, c'est simplement parce que les bons mots n'y sont pas.

### Comment corriger

Avant chaque candidature, lis attentivement l'offre. Identifie les **compétences, outils et qualifications** mentionnés. Intègre ces termes dans ton CV, dans le résumé de profil, dans les descriptions d'expérience et dans la section compétences. Utilise les formulations exactes de l'offre.

## Erreur 5 : Un CV générique sans personnalisation

### Le problème

Ton CV est bien rédigé, mais il est conçu pour être universel. Il couvre toutes tes compétences de façon équitable, sans mettre en avant celles qui correspondent à un poste précis. Pour un ATS qui cherche des correspondances spécifiques, un CV générique obtient un score moyen sur toutes les offres, et un bon score sur aucune.

### Comment corriger

Garde un CV "maître" complet avec toutes tes expériences et compétences. Pour chaque candidature, crée une version adaptée en **réorganisant les compétences** (les plus pertinentes en premier), en **ajustant les formulations** des bullet points et en **renforçant les expériences** les plus proches du poste visé.

## Erreur 6 : Pas de section Profil ou Résumé

### Le problème

Tu commences ton CV directement par la section Expérience. Tu rates une opportunité précieuse : la section Profil en haut du CV est l'endroit idéal pour concentrer les mots-clés les plus importants de l'offre. C'est aussi la première chose que le recruteur humain lit après le tri ATS.

### Comment corriger

Ajoute un **résumé de profil de 3 à 5 lignes** en haut de ton CV, juste sous tes coordonnées. Ce résumé doit contenir : ton titre professionnel, tes années d'expérience, tes 3-4 compétences clés pour le poste visé et un accomplissement marquant.

## Erreur 7 : Des polices fantaisistes ou décoratives

### Le problème

Tu utilises une police originale pour te démarquer, une police calligraphique, une police display, ou une police rare qui n'est pas installée sur tous les systèmes. L'ATS peut mal interpréter les caractères ou ne pas les lire du tout. Certaines polices décoratives encodent les lettres de façon non standard, rendant le texte partiellement ou totalement illisible pour le parser.

### Comment corriger

Utilise une **police standard** : Arial, Calibri, Helvetica, Times New Roman, Garamond. Ces polices sont lues correctement par tous les ATS. La taille doit être comprise entre 10 et 12 points pour le corps du texte.

## Erreur 8 : Des dates incohérentes ou absentes

### Le problème

Tes expériences n'ont pas de dates, ou les dates sont dans des formats différents ("2022-2024" pour une expérience, "Mars 2020 à Juin 2021" pour une autre, "depuis 3 ans" pour une troisième). L'ATS extrait les dates pour calculer ta durée d'expérience totale et vérifier les critères d'ancienneté. Des dates incohérentes perturbent ce calcul.

### Comment corriger

Utilise un **format de date uniforme** sur tout le CV. Le format "Mois Année – Mois Année" (ex : "Janvier 2022 – Mars 2024") est le plus lisible. Pour le poste en cours, utilise "Depuis Mois Année" ou "Mois Année – Présent".

## Erreur 9 : Des acronymes sans version développée

### Le problème

Tu écris "CRM", "ERP", "KPI", "ROI", "SEO" en supposant que tout le monde sait ce que ça signifie. L'ATS sait peut-être, mais si l'offre utilise "gestion de la relation client" au lieu de "CRM", le rapprochement ne se fait pas. Les erreurs CV ATS liées aux acronymes sont parmi les plus sournoises : tu penses avoir mis le bon mot-clé, mais l'ATS cherche la version complète.

### Comment corriger

Utilise **l'acronyme ET la version développée** au moins une fois dans le CV. Par exemple : "Gestion de la relation client (CRM) via Salesforce". Cela couvre les deux formulations et augmente les chances de correspondance.

## Erreur 10 : Aucun résultat quantifié

### Le problème

Tes bullet points décrivent ce que tu as fait, mais pas ce que tu as accompli. "Géré les réseaux sociaux de l'entreprise" n'apporte aucun contexte mesurable. Les ATS modernes et les recruteurs humains cherchent des résultats concrets.

### Comment corriger

Pour chaque expérience, identifie au moins un **résultat chiffrable**. Pas besoin d'inventer, pense en termes de volume (nombre de projets, taille d'équipe, nombre de clients), de temps (délais réduits, fréquence augmentée) ou d'amélioration (processus optimisé, satisfaction client améliorée). Si tu ne peux pas donner un chiffre exact, décris l'impact de façon concrète : "Refonte du processus d'onboarding, passé de 2 semaines à 3 jours".

## Le récapitulatif : vérifie ton CV en 5 minutes

Avant d'envoyer ta prochaine candidature, passe cette checklist rapide :

- Le texte de ton PDF est-il sélectionnable ?
- Ton CV est-il sur une seule colonne ?
- Les en-têtes sont-ils en texte simple, sans formes graphiques ?
- Les mots-clés de l'offre apparaissent-ils dans ton CV ?
- Le CV est-il adapté à cette offre précise ?
- As-tu un résumé de profil en haut ?
- La police est-elle standard (Arial, Calibri, etc.) ?
- Les dates sont-elles cohérentes et complètes ?
- Les acronymes ont-ils leur version développée ?
- Chaque expérience a-t-elle au moins un résultat concret ?

Si tu coches les 10 points, ton CV a de bonnes chances de passer les filtres ATS. Si tu en rates ne serait-ce que 2 ou 3, ton score peut chuter significativement. Pour une méthode étape par étape, consulte notre [guide complet pour optimiser son CV ATS en France](/blog/optimiser-cv-ats-france).

## CVpass corrige ces erreurs automatiquement

Vérifier manuellement chaque erreur prend du temps. CVpass automatise cette analyse : tu uploades ton CV, tu colles l'offre d'emploi et l'outil identifie immédiatement les problèmes de format, les mots-clés manquants et les formulations à améliorer.

Pour chaque erreur détectée, l'IA propose une correction prête à l'emploi. Tu cliques Accepter, le score remonte en temps réel. En quelques minutes, ton CV passe de "rejeté par l'ATS" à "en haut de la pile du recruteur".

---

**Combien d'erreurs contient ton CV ?** [Fais le test gratuitement sur cvpass.fr →](https://cvpass.fr)
    `.trim(),
  },

  // ─── Articles par métier ────────────────────────────────────────────────────

  {
    slug: "cv-developpeur-ats",
    title: "CV développeur : comment créer un CV ATS qui décroche des entretiens tech en 2026",
    metaTitle: "CV développeur ATS : guide complet pour décrocher en tech 2026 | CVpass",
    metaDescription: "Comment créer un CV développeur optimisé ATS en 2026. Stack technique, projets, mots-clés et structure pour passer les filtres automatiques.",
    description: "Crée un CV développeur optimisé ATS avec la bonne structure, les bons mots-clés et la mise en valeur de ta stack technique.",
    date: "2026-03-14",
    readTime: "8 min",
    category: "CV par métier",
    tags: ["CV par métier", "Développeur", "Tech"],
    image: "/blog/cv-developpeur-ats.svg",
    content: `
## Le CV développeur face aux ATS : un défi spécifique

Le marché tech recrute massivement, mais les grandes entreprises et les ESN utilisent toutes des ATS pour filtrer les candidatures. Un CV développeur qui n'est pas optimisé pour ces systèmes peut être écarté avant même qu'un recruteur technique ne le voie.

Le piège classique : les développeurs créent des CV visuellement originaux (sites web, PDF designés, infographies) qui sont illisibles pour les ATS. L'originalité technique doit se trouver dans le contenu, pas dans le format. Consulte aussi notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats) pour une vue d'ensemble des différences entre profils.

## Structure idéale d'un CV développeur ATS

### En-tête : nom, titre et coordonnées

- **Titre clair** : "Développeur Full-Stack JavaScript" plutôt que "Passionné de code"
- Email, téléphone, ville
- Liens GitHub et LinkedIn (texte, pas d'icônes)

### Résumé technique (3-4 lignes)

C'est la section la plus importante pour l'ATS. Elle doit contenir tes technologies principales et ton niveau d'expérience. Exemple :

"Développeur Full-Stack avec 4 ans d'expérience en React, Node.js et TypeScript. Spécialisé dans le développement d'applications SaaS performantes. Expérience en CI/CD, Docker et déploiement cloud AWS."

### Stack technique

Liste tes technologies par catégories :
- **Frontend** : React, Next.js, TypeScript, Tailwind CSS
- **Backend** : Node.js, Express, PostgreSQL, Redis
- **DevOps** : Docker, GitHub Actions, AWS, Vercel
- **Outils** : Git, Jira, Figma, Postman

### Expériences professionnelles

Pour chaque poste :
- Titre exact du poste + entreprise + dates
- 3-5 réalisations quantifiées
- Technologies utilisées dans le contexte de chaque mission

**Bon exemple** : "Développé une API REST avec Node.js et PostgreSQL servant 50 000 requêtes/jour, réduisant le temps de réponse de 40%."

**Mauvais exemple** : "Développement backend" (trop vague, aucun mot-clé exploitable).

## Les mots-clés tech que les ATS recherchent

Les recruteurs tech configurent les ATS avec des mots-clés très précis. Voici les catégories à couvrir :

- **Langages** : JavaScript, TypeScript, Python, Java, Go, PHP
- **Frameworks** : React, Angular, Vue.js, Next.js, Django, Spring Boot
- **Bases de données** : PostgreSQL, MySQL, MongoDB, Redis
- **Cloud** : AWS, GCP, Azure, Heroku, Vercel
- **Méthodes** : Agile, Scrum, CI/CD, TDD, Code Review
- **Outils** : Git, Docker, Kubernetes, Jenkins, Terraform

Utilise les noms exacts des technologies. "JS" ne sera pas toujours reconnu comme "JavaScript". Écris les deux si possible.

## Erreurs fréquentes des CV développeurs

**Lister uniquement les technologies sans contexte.** Une liste de 30 technologies sans explication n'impressionne ni l'ATS ni le recruteur. Intègre les technologies dans tes expériences.

**Oublier les soft skills techniques.** Les ATS recherchent aussi "travail en équipe", "communication technique", "mentorat", "architecture logicielle".

**Mettre un lien vers un portfolio sans texte.** L'ATS ne visite pas les liens. Décris tes projets en texte dans le CV.

**Utiliser un format non standard.** Un site web comme CV, un README GitHub, un PDF Canva, tout ça échoue face aux ATS. Utilise un PDF texte simple.

## Ce que CVpass fait pour les développeurs

CVpass analyse ton CV développeur par rapport à l'offre d'emploi que tu vises. L'outil identifie les technologies manquantes, les formulations à améliorer et les sections à restructurer. En quelques clics, ton CV passe de "filtré par l'ATS" à "en haut de la pile du recruteur tech".

---

**Ton CV développeur passe-t-il les ATS ?** [Fais le test gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-commercial-ats",
    title: "CV commercial : optimiser son CV pour les ATS et décrocher plus de postes en 2026",
    metaTitle: "CV commercial ATS : guide pour décrocher plus de postes en 2026 | CVpass",
    metaDescription: "Comment créer un CV commercial optimisé ATS en 2026. Chiffres de vente, mots-clés et structure pour passer les filtres automatiques des recruteurs.",
    description: "Optimise ton CV commercial pour les ATS avec les bons chiffres, mots-clés et la structure qui convainc.",
    date: "2026-03-17",
    readTime: "7 min",
    category: "CV par métier",
    tags: ["CV par métier", "Commercial", "Vente"],
    image: "/blog/cv-commercial-ats.svg",
    content: `
## Le CV commercial et les ATS : pourquoi les chiffres comptent double

Dans le monde commercial, les résultats parlent. Et les ATS le savent, ou plutôt, les recruteurs qui configurent les filtres le savent. Un CV commercial sans chiffres est un CV vide pour un ATS configuré pour chercher des indicateurs de performance.

Le problème : beaucoup de commerciaux décrivent leurs missions ("prospection", "gestion de portefeuille") sans jamais quantifier leurs résultats. L'ATS ne trouve pas les signaux qu'il cherche. Pour comparer avec d'autres profils, consulte notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats).

## Structure optimale d'un CV commercial ATS

### Résumé de profil orienté résultats

"Commercial B2B avec 5 ans d'expérience en vente de solutions SaaS. Portefeuille de 120 comptes, CA annuel généré de 800K€. Expertise en prospection, négociation grands comptes et closing."

Ce résumé contient exactement ce que l'ATS cherche : le type de vente (B2B, SaaS), les métriques (120 comptes, 800K€) et les compétences clés.

### Expériences avec KPIs

Pour chaque poste commercial, inclus systématiquement :
- **Chiffre d'affaires** généré ou géré
- **Nombre de clients** dans le portefeuille
- **Taux de conversion** ou de rétention
- **Objectifs atteints** (% du quota)
- **Croissance** du CA sur la période

**Bon exemple** : "Développé un portefeuille de 80 comptes B2B, générant 650K€ de CA annuel (115% de l'objectif). Taux de rétention client de 92%."

**Mauvais exemple** : "Gestion et développement du portefeuille clients."

## Mots-clés commerciaux que les ATS recherchent

- **Types de vente** : B2B, B2C, SaaS, grands comptes, PME, cycle de vente long/court
- **Compétences** : prospection, qualification, négociation, closing, upsell, cross-sell, fidélisation
- **Outils CRM** : Salesforce, HubSpot, Pipedrive, Microsoft Dynamics
- **Métriques** : CA, MRR, ARR, pipe commercial, taux de conversion, NPS
- **Méthodes** : SPIN selling, MEDDIC, Challenger Sale, social selling
- **Certifications** : HubSpot Sales, Salesforce Certified

## Erreurs fréquentes des CV commerciaux

**Des descriptions vagues sans chiffres.** "Responsable du développement commercial" ne dit rien à l'ATS. Chaque ligne doit contenir au moins un chiffre.

**Oublier les outils CRM.** Si l'offre mentionne Salesforce et que tu l'utilises, ce mot doit apparaître dans ton CV.

**Trop de responsabilités, pas assez de résultats.** L'ATS et le recruteur veulent savoir ce que tu as accompli, pas seulement ce que tu faisais au quotidien.

## Ce que CVpass fait pour les commerciaux

CVpass analyse ton CV par rapport à l'offre d'emploi et identifie les métriques manquantes, les mots-clés de vente absents et les formulations trop vagues. L'IA propose des réécritures orientées résultats pour chaque point faible.

---

**Ton CV commercial est-il à la hauteur ?** [Analyse-le gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-chef-projet-ats",
    title: "CV chef de projet : structure ATS et mots-clés pour décrocher en 2026",
    metaTitle: "CV chef de projet ATS : structure et mots-clés 2026 | CVpass",
    metaDescription: "Comment créer un CV chef de projet optimisé ATS en 2026. Méthodologies, certifications, mots-clés et structure pour passer les filtres automatiques.",
    description: "Crée un CV chef de projet ATS-friendly avec les bonnes méthodologies, certifications et mots-clés.",
    date: "2026-03-19",
    readTime: "7 min",
    category: "CV par métier",
    tags: ["CV par métier", "Chef de projet", "Management"],
    image: "/blog/cv-chef-projet-ats.svg",
    content: `
## Le CV chef de projet : un profil où les ATS sont particulièrement exigeants

Le chef de projet est un profil transversal. Les recruteurs cherchent un mélange spécifique de compétences techniques, méthodologiques et managériales. Les ATS sont configurés pour filtrer sur des mots-clés très précis : méthodologies, outils, certifications.

Un CV chef de projet générique, "pilotage de projets dans un environnement international", sera mal classé par l'ATS. Il faut être spécifique. Pour une vue d'ensemble des différences par profil, consulte notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats).

## Structure d'un CV chef de projet ATS

### Résumé de profil

"Chef de projet IT certifié PMP avec 6 ans d'expérience en gestion de projets Agile/Scrum. Pilotage de projets jusqu'à 500K€ de budget et équipes de 15 personnes. Expertise en transformation digitale et déploiement ERP."

### Expériences structurées par projet

Pour chaque expérience, décris les projets pilotés :
- **Scope** : type de projet, nombre de personnes, budget
- **Méthodologie** : Agile, Scrum, Waterfall, SAFe, Prince2
- **Livrables** : ce qui a été produit, les résultats obtenus
- **Outils** : Jira, Confluence, MS Project, Monday, Asana, Trello

**Bon exemple** : "Piloté la refonte du SI commercial (budget 350K€, équipe de 12). Méthodologie Scrum avec sprints de 2 semaines. Livraison dans les délais avec satisfaction client de 4.5/5."

## Mots-clés chef de projet pour les ATS

- **Méthodologies** : Agile, Scrum, Kanban, SAFe, Waterfall, Prince2, Lean, Six Sigma
- **Certifications** : PMP, PSM, PSPO, Prince2, ITIL, SAFe Agilist
- **Outils** : Jira, Confluence, MS Project, Monday.com, Asana, Trello, Notion
- **Compétences** : gestion de budget, planning, roadmap, backlog, sprint, rétrospective, comité de pilotage, cahier des charges, MOA, MOE, AMOA
- **Soft skills recherchés** : coordination, communication, gestion des risques, arbitrage, leadership

## Erreurs fréquentes

**Ne pas mentionner les certifications.** PMP, PSM, ITIL, si tu les as, elles doivent être visibles. Les ATS filtrent dessus.

**Des descriptions sans métriques de projet.** Budget, taille d'équipe, délais respectés, nombre de sprints, les chiffres prouvent ton impact.

**Confondre "coordonner" et "piloter".** L'ATS cherche des termes précis. "Piloté" est plus fort que "participé à".

## Ce que CVpass fait pour les chefs de projet

CVpass identifie les méthodologies et certifications manquantes dans ton CV par rapport à l'offre. L'IA reformule tes expériences pour mettre en avant les métriques de projet et les mots-clés méthodologiques attendus.

---

**Ton CV chef de projet est-il optimisé ?** [Vérifie gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-data-analyst-ats",
    title: "CV data analyst : mots-clés, outils et structure ATS pour 2026",
    metaTitle: "CV data analyst ATS : mots-clés et structure optimale 2026 | CVpass",
    metaDescription: "Comment créer un CV data analyst optimisé ATS en 2026. Outils data, langages, visualisation et mots-clés pour décrocher en analyse de données.",
    description: "Optimise ton CV data analyst pour les ATS avec les bons outils, langages et mots-clés du secteur data.",
    date: "2026-03-21",
    readTime: "7 min",
    category: "CV par métier",
    tags: ["CV par métier", "Data Analyst", "Data"],
    image: "/blog/cv-data-analyst-ats.svg",
    content: `
## Le CV data analyst : un secteur où les mots-clés techniques sont décisifs

Le marché de la data explose en France. Les postes de data analyst se multiplient dans tous les secteurs, finance, retail, santé, tech. Les recruteurs utilisent les ATS pour filtrer sur des compétences techniques très précises : langages, outils de visualisation, bases de données.

Un CV data analyst qui dit "analyse de données" sans préciser les outils utilisés sera mal classé. La spécificité est la clé. Pour comparer avec d'autres profils, consulte notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats).

## Structure d'un CV data analyst ATS

### Résumé technique

"Data Analyst avec 3 ans d'expérience en analyse de données business. Expertise en SQL, Python (Pandas, NumPy) et Power BI. Expérience en modélisation de données, création de dashboards et analyse prédictive pour des équipes marketing et finance."

### Compétences techniques par catégories

- **Langages** : SQL, Python, R
- **Visualisation** : Power BI, Tableau, Looker, Google Data Studio
- **Bases de données** : PostgreSQL, MySQL, BigQuery, Snowflake
- **Outils** : Excel avancé, Google Sheets, Jupyter, dbt
- **Cloud/ETL** : AWS, GCP, Airflow, Talend

### Expériences orientées impact business

**Bon exemple** : "Créé un dashboard Power BI pour le suivi des KPIs marketing (15 métriques). Identifié une opportunité de réduction des coûts d'acquisition de 22%, soit 80K€/an d'économies."

**Mauvais exemple** : "Analyse de données et création de rapports."

## Mots-clés data analyst pour les ATS

- **Hard skills** : SQL, Python, R, Power BI, Tableau, Excel, ETL, data modeling, A/B testing, statistical analysis
- **Concepts** : KPI, data-driven, insight, segmentation, cohort analysis, funnel analysis, data quality
- **Soft skills** : data storytelling, communication des résultats, vulgarisation, collaboration cross-fonctionnelle
- **Certifications** : Google Data Analytics, Microsoft Power BI, Tableau Desktop Specialist

## Erreurs fréquentes des CV data analyst

**Lister les outils sans montrer l'impact.** "Maîtrise de Power BI" ne suffit pas. Montre ce que tu as construit avec et quel problème business ça a résolu.

**Oublier SQL.** C'est le mot-clé n°1 des offres data analyst. Si tu ne le mentionnes pas explicitement, l'ATS te pénalise.

**Pas de résultats chiffrés.** Combien de dashboards créés ? Quel volume de données traité ? Quel impact business ?

## Ce que CVpass fait pour les data analysts

CVpass compare ton CV aux mots-clés de l'offre data analyst que tu vises. L'outil détecte les technologies manquantes, les formulations vagues et propose des réécritures avec impact business chiffré.

---

**Ton CV data analyst passe-t-il les filtres ?** [Teste-le gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-marketing-digital-ats",
    title: "CV marketing digital : structure ATS et mots-clés pour décrocher en 2026",
    metaTitle: "CV marketing digital ATS : structure et mots-clés 2026 | CVpass",
    metaDescription: "Comment créer un CV marketing digital optimisé ATS en 2026. SEO, SEA, social media, analytics : les mots-clés et la structure pour passer les filtres.",
    description: "Optimise ton CV marketing digital pour les ATS avec les bons mots-clés SEO, SEA et analytics.",
    date: "2026-03-24",
    readTime: "7 min",
    category: "CV par métier",
    tags: ["CV par métier", "Marketing digital", "SEO"],
    image: "/blog/cv-marketing-digital-ats.svg",
    content: `
## Le CV marketing digital : un profil où les acronymes comptent

Le marketing digital est un domaine où le vocabulaire technique est dense : SEO, SEA, SEM, CRO, CTR, CPL, ROAS, CAC... Les ATS filtrent massivement sur ces acronymes. Un CV qui dit "responsable de la visibilité en ligne" au lieu de "SEO Manager" sera mal classé. Consulte aussi notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats) pour comparer avec d'autres profils.

## Structure d'un CV marketing digital ATS

### Résumé de profil

"Responsable marketing digital avec 4 ans d'expérience en SEO, SEA et content marketing. Gestion de budgets publicitaires jusqu'à 150K€/mois. Expertise en Google Ads, Meta Ads, Google Analytics 4 et stratégie de contenu B2B."

### Expériences avec métriques marketing

Pour chaque poste :
- **Budget géré** : montant mensuel/annuel
- **Résultats** : trafic organique, conversions, ROAS, CTR, CPL
- **Outils** : plateformes publicitaires, analytics, CMS, automation
- **Campagnes** : type, audience, résultats chiffrés

**Bon exemple** : "Piloté les campagnes Google Ads (budget 80K€/mois, ROAS 4.2x). Augmentation du trafic organique de 180% en 12 mois via stratégie SEO on-page et netlinking."

**Mauvais exemple** : "Gestion des campagnes publicitaires et du référencement."

## Mots-clés marketing digital pour les ATS

- **SEO** : référencement naturel, on-page, off-page, netlinking, audit SEO, Core Web Vitals, Search Console
- **SEA** : Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, programmatique
- **Analytics** : Google Analytics 4, Tag Manager, Data Studio, Hotjar, Mixpanel
- **Content** : content marketing, copywriting, editorial planning, blog, newsletter
- **Automation** : HubSpot, Mailchimp, Brevo, ActiveCampaign, marketing automation
- **CMS** : WordPress, Webflow, Shopify
- **Métriques** : ROAS, CTR, CPC, CPL, CAC, LTV, taux de conversion, taux de rebond

## Erreurs fréquentes des CV marketing

**Des responsabilités sans résultats.** "Gestion des réseaux sociaux" ne dit rien. Combien de followers gagnés ? Quel taux d'engagement ? Quel impact sur le CA ?

**Oublier les outils.** Google Analytics 4, HubSpot, SEMrush, Ahrefs, si tu les utilises, écris-les. L'ATS filtre dessus.

**Un CV trop généraliste.** "Marketing" est trop vague. Précise ta spécialité : SEO, SEA, growth, content, social media.

## Ce que CVpass fait pour les marketeurs

CVpass identifie les acronymes et outils manquants dans ton CV marketing par rapport à l'offre. L'IA reformule tes expériences avec les métriques et mots-clés attendus par les ATS du secteur.

---

**Ton CV marketing passe-t-il les filtres ?** [Vérifie gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-ressources-humaines-ats",
    title: "CV RH : comment optimiser son CV ressources humaines pour les ATS en 2026",
    metaTitle: "CV RH ATS : optimiser son CV ressources humaines en 2026 | CVpass",
    metaDescription: "Comment créer un CV ressources humaines optimisé ATS en 2026. Recrutement, paie, droit social : les mots-clés et la structure pour décrocher.",
    description: "Crée un CV RH optimisé ATS avec les bons mots-clés en recrutement, paie et droit social.",
    date: "2026-03-26",
    readTime: "7 min",
    category: "CV par métier",
    tags: ["CV par métier", "Ressources humaines", "Recrutement"],
    image: "/blog/cv-ressources-humaines-ats.svg",
    content: `
## Le CV RH face aux ATS : l'ironie du recruteur recruté

Les professionnels RH connaissent les ATS mieux que personne, ce sont eux qui les utilisent au quotidien. Pourtant, quand ils cherchent eux-mêmes un emploi, leurs CV souffrent souvent des mêmes problèmes que ceux qu'ils rejettent : formulations vagues, mots-clés manquants, structure non optimale. Pour une vue d'ensemble par profil, consulte notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats).

## Structure d'un CV RH ATS

### Résumé de profil

"Chargée de recrutement avec 5 ans d'expérience en recrutement IT et commercial. 200+ recrutements réalisés, de la définition du besoin à l'intégration. Expertise en sourcing, entretiens structurés et marque employeur. Outils : Workday, LinkedIn Recruiter, Greenhouse."

### Expériences avec métriques RH

- **Volume de recrutement** : nombre de postes pourvus par an
- **Time-to-hire** : délai moyen de recrutement
- **Taux de rétention** : à 6 mois, 1 an
- **Budget formation** : montant géré
- **Effectif géré** : nombre de collaborateurs

**Bon exemple** : "Recruté 45 profils tech et commerciaux en 12 mois (time-to-hire moyen : 28 jours). Mis en place un programme d'onboarding réduisant le turnover de 25% sur la première année."

## Mots-clés RH pour les ATS

- **Recrutement** : sourcing, chasse de tête, entretien structuré, assessment, ATS, jobboard, cooptation
- **Administration** : paie, DPAE, contrats de travail, DSN, mutuelle, prévoyance
- **Droit social** : convention collective, CSE, NAO, rupture conventionnelle, licenciement
- **Formation** : plan de développement des compétences, OPCO, CPF, bilan de compétences
- **Outils** : Workday, SAP SuccessFactors, Talentsoft, PayFit, Silae, LinkedIn Recruiter, Greenhouse
- **Concepts** : marque employeur, QVT/QVCT, RSE, diversité et inclusion, GPEC/GEPP

## Erreurs fréquentes des CV RH

**Des missions génériques.** "Gestion des ressources humaines" ne dit rien. Précise : recrutement, paie, formation, relations sociales ?

**Oublier le volume.** Combien de recrutements ? Quel effectif géré ? Quel budget formation ?

**Pas de mention des outils SIRH.** Les ATS filtrent sur Workday, SAP, PayFit. Si tu les utilises, mentionne-les.

## Ce que CVpass fait pour les RH

CVpass analyse ton CV RH et identifie les mots-clés manquants par rapport à l'offre. L'outil reformule tes expériences avec les métriques et le vocabulaire spécifique attendu.

---

**Ton CV RH est-il à la hauteur ?** [Analyse-le gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-comptable-finance-ats",
    title: "CV comptable / finance : mots-clés ATS et structure pour décrocher en 2026",
    metaTitle: "CV comptable finance ATS : mots-clés et structure 2026 | CVpass",
    metaDescription: "Comment créer un CV comptable ou finance optimisé ATS en 2026. Normes, logiciels, certifications et mots-clés pour passer les filtres automatiques.",
    description: "Optimise ton CV comptable ou finance pour les ATS avec les normes, logiciels et mots-clés du secteur.",
    date: "2026-03-28",
    readTime: "7 min",
    category: "CV par métier",
    tags: ["CV par métier", "Comptabilité", "Finance"],
    image: "/blog/cv-comptable-finance-ats.svg",
    content: `
## Le CV comptable/finance : précision et conformité avant tout

En comptabilité et finance, les recruteurs cherchent des profils rigoureux et techniques. Les ATS sont configurés pour filtrer sur des normes comptables, des logiciels spécifiques et des certifications. Un CV qui ne mentionne pas explicitement ces éléments sera écarté. Consulte aussi notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats) pour comparer avec d'autres profils.

## Structure d'un CV comptable/finance ATS

### Résumé de profil

"Comptable général avec 6 ans d'expérience en comptabilité multi-sociétés. Maîtrise des normes IFRS et PCG. Expertise en clôtures mensuelles, déclarations fiscales (TVA, IS, CVAE) et consolidation. Logiciels : SAP, Sage, Cegid."

### Expériences avec métriques

- **Volume** : nombre de sociétés gérées, CA consolidé
- **Clôtures** : délais de clôture (J+5, J+10)
- **Déclarations** : types (TVA, IS, liasses fiscales)
- **Équipe** : taille de l'équipe supervisée

**Bon exemple** : "Responsable de la comptabilité de 3 filiales (CA consolidé 25M€). Clôtures mensuelles en J+5. Préparation des liasses fiscales et coordination avec les commissaires aux comptes."

## Mots-clés comptabilité/finance pour les ATS

- **Comptabilité** : comptabilité générale, auxiliaire, analytique, tiers, immobilisations, rapprochement bancaire
- **Normes** : PCG, IFRS, US GAAP, normes fiscales françaises
- **Fiscalité** : TVA, IS, CFE, CVAE, liasse fiscale, prix de transfert
- **Logiciels** : SAP (FI/CO), Sage 100/1000, Cegid, Oracle, QuickBooks, Pennylane
- **Certifications** : DEC, DSCG, DCG, CCA
- **Finance** : consolidation, reporting, budget, forecast, trésorerie, BFR, cash-flow
- **Audit** : contrôle interne, commissariat aux comptes, due diligence

## Erreurs fréquentes

**Ne pas mentionner les normes.** IFRS vs PCG, les ATS filtrent dessus. Précise toujours les référentiels que tu maîtrises.

**Oublier les logiciels comptables.** SAP, Sage, Cegid, ce sont des mots-clés critiques. Ne les oublie pas.

**Des descriptions sans volume.** Quel CA ? Combien de factures traitées ? Quel délai de clôture ?

## Ce que CVpass fait pour les comptables

CVpass identifie les normes, logiciels et mots-clés fiscaux manquants dans ton CV par rapport à l'offre. L'IA reformule tes expériences avec la précision attendue dans le secteur.

---

**Ton CV comptable est-il optimisé ?** [Vérifie-le gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "cv-ingenieur-ats",
    title: "CV ingénieur : comment créer un CV ATS qui se démarque en 2026",
    metaTitle: "CV ingénieur ATS : structure et mots-clés pour se démarquer 2026 | CVpass",
    metaDescription: "Comment créer un CV ingénieur optimisé ATS en 2026. Compétences techniques, projets, certifications et mots-clés pour passer les filtres automatiques.",
    description: "Crée un CV ingénieur ATS-friendly qui met en valeur tes compétences techniques et tes projets.",
    date: "2026-03-31",
    readTime: "8 min",
    category: "CV par métier",
    tags: ["CV par métier", "Ingénieur", "Industrie"],
    image: "/blog/cv-ingenieur-ats.svg",
    content: `
## Le CV ingénieur : technique et précision face aux ATS

Les postes d'ingénieur sont parmi les plus filtrés par les ATS. Les recruteurs configurent des mots-clés très techniques : logiciels de CAO, normes industrielles, certifications, langages de programmation embarqué. Un CV ingénieur générique passera rarement les filtres. Pour une vue d'ensemble par profil, consulte notre [guide CV ATS par secteur](/blog/cv-par-secteur-ats).

## Structure d'un CV ingénieur ATS

### Résumé technique

"Ingénieur mécanique avec 5 ans d'expérience en conception produit et industrialisation. Expertise en CAO (CATIA V5, SolidWorks), calcul de structures (ANSYS) et gestion de projets industriels. Certifié Green Belt Lean Six Sigma."

### Formation en premier

Pour les ingénieurs, la formation est souvent un critère de filtrage ATS :
- Nom exact de l'école (INSA, Centrale, Arts et Métiers, Polytech...)
- Spécialisation
- Année de diplôme

### Compétences techniques par catégories

- **CAO/FAO** : CATIA V5/V6, SolidWorks, Creo, AutoCAD, Inventor
- **Simulation** : ANSYS, Abaqus, COMSOL, Matlab/Simulink
- **Normes** : ISO 9001, ISO 14001, IATF 16949, EN 9100
- **Méthodes** : Lean, Six Sigma, AMDEC/FMEA, 5S, Kaizen, PDCA
- **Outils** : SAP, Windchill, TeamCenter, JIRA

### Expériences orientées projets

**Bon exemple** : "Conçu et industrialisé un sous-ensemble moteur (CATIA V5) réduisant le poids de 15% tout en respectant les normes IATF 16949. Coordination avec 3 fournisseurs, livraison dans les délais et budget (250K€)."

## Mots-clés ingénieur pour les ATS

- **Conception** : CAO, FAO, PLM, prototypage, design review, cotation fonctionnelle
- **Production** : industrialisation, process, gamme de fabrication, ligne de production, yield
- **Qualité** : ISO 9001, AMDEC, contrôle qualité, non-conformité, audit interne
- **Management** : gestion de projet technique, coordination fournisseurs, cahier des charges
- **Certifications** : Green Belt, Black Belt, PMP, certifications sectorielles

## Erreurs fréquentes des CV ingénieurs

**Lister les logiciels sans contexte.** "CATIA V5" seul ne suffit pas. Dans quel contexte ? Pour quel type de pièces ? Quel résultat ?

**Oublier les normes.** ISO, IATF, EN, les ATS des grands groupes industriels filtrent systématiquement dessus.

**Ne pas mentionner l'école.** En France, l'école d'ingénieur est un critère de filtrage majeur. Assure-toi qu'elle est bien visible.

## Ce que CVpass fait pour les ingénieurs

CVpass analyse ton CV ingénieur par rapport à l'offre et identifie les logiciels, normes et certifications manquantes. L'IA reformule tes expériences avec les mots-clés techniques attendus.

---

**Ton CV ingénieur passe-t-il les ATS ?** [Teste-le gratuitement sur CVpass →](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "entreprises-ats-france",
    title: "Quelles entreprises utilisent un ATS en France ? La liste qui va vous surprendre",
    metaTitle: "Entreprises qui utilisent un ATS en France : la liste 2026 | CVpass",
    metaDescription: "Quelles entreprises filtrent les CV avec un ATS en France ? LVMH, Decathlon, BNP, startups... Decouvrez qui utilise ces logiciels et comment adapter votre CV.",
    description: "La liste des entreprises francaises qui filtrent les CV avec un logiciel ATS. Et comment ne pas se faire eliminer.",
    date: "2026-04-02",
    readTime: "6 min",
    category: "ATS France",
    tags: ["Guide ATS", "France", "Recrutement"],
    image: "/blog/optimiser-cv-ats-france.svg",
    content: `
## La vraie question que personne ne pose

Quand je discute avec des candidats, ils me demandent souvent "c'est quoi un ATS ?". Mais la question qui devrait venir juste apres, et que personne ne pose, c'est : "est-ce que l'entreprise ou je postule en utilise un ?"

Parce que la reponse change completement la facon dont vous devez preparer votre CV.

Spoiler : si vous postulez dans une boite de plus de 200 salaries, il y a de tres fortes chances que votre CV passe par un filtre automatique avant d'atterrir sur le bureau de qui que ce soit.

## Les grands groupes : 100% sous ATS

La, pas de surprise. Toutes les entreprises du CAC 40 utilisent un ATS. Toutes. Sans exception.

LVMH utilise Workday. L'Oreal aussi. Sanofi est sur Taleo (Oracle). BNP Paribas, Societe Generale, Credit Agricole : ils ont tous leur systeme maison ou un gros editeur du marche.

Decathlon utilise SmartRecruiters. Carrefour est sur SuccessFactors (SAP). Total, Airbus, Safran : pareil.

Ce que ca veut dire concretement : quand vous postulez sur le site carriere de LVMH, votre CV est d'abord lu par un robot. Si le robot ne trouve pas les bons mots-cles, votre candidature est classee en bas de la pile. Vous pouvez etre le candidat parfait, ca ne change rien.

## Les ETI et PME en croissance : la surprise

C'est la ou ca devient interessant. On pourrait penser que les PME recrutent encore "a l'ancienne" avec des piles de CV papier. C'est de moins en moins vrai.

Des qu'une boite depasse 50 recrutements par an, elle investit dans un outil. Pas forcement un monstre comme Workday, mais des solutions plus accessibles : Teamtailor, Recruitee, Flatchr, Taleez.

J'ai discute avec le DRH d'une PME industrielle de 180 salaries en Rhone-Alpes. Ils utilisent Flatchr depuis 2024. Avant, la RH passait 3 heures par jour a trier des CV. Maintenant, le logiciel fait un premier filtre et elle ne regarde que les 20 meilleurs. Les 80 autres ? Elle ne les voit jamais.

Ca fait reflechir.

## Les startups et scale-ups : ca depend

Les startups de moins de 20 personnes recrutent souvent par reseau. Pas d'ATS, pas de filtre. Le fondateur lit les CV lui-meme.

Mais des que la boite leve des fonds et passe en mode croissance, elle s'equipe. Lever, Greenhouse, Ashby : ce sont les outils preferes des startups tech francaises.

Welcome to the Jungle a son propre systeme de matching integre. LinkedIn a son ATS interne (LinkedIn Recruiter). Indeed fait du pre-filtrage algorithmique.

## Les plateformes emploi : le filtre invisible

C'est le point que beaucoup de candidats ignorent. Meme si l'entreprise finale n'a pas d'ATS, la plateforme par laquelle vous postulez en a un.

Quand vous postulez via Indeed, votre CV est filtre par l'algorithme d'Indeed AVANT d'arriver chez l'employeur. Meme chose sur LinkedIn, APEC, ou [Welcome to the Jungle](/blog/postuler-welcome-to-the-jungle).

En gros : meme pour postuler dans une boulangerie qui recrute sur Indeed, votre CV est filtre par un robot.

## Comment savoir si une entreprise utilise un ATS ?

Methode simple : allez sur la page "Carrieres" de l'entreprise. Si le formulaire de candidature vous demande d'uploader un CV et de remplir des champs (nom, experience, competences), c'est un ATS.

Si c'est juste un bouton "Envoyer un email a rh@entreprise.com", il n'y a probablement pas d'ATS.

Autre indice : si l'URL du formulaire contient "workday", "greenhouse", "lever", "smartrecruiters", "teamtailor" ou "recruitee", vous etes sur un ATS.

## Que faire concretement ?

La reponse est simple : partez du principe que CHAQUE candidature en ligne passe par un filtre. Preparez votre CV en consequence.

Ca veut dire : les bons mots-cles du poste, une structure simple, pas de colonnes Canva, pas de PDF image. Les bases que [notre guide complet](/blog/optimiser-cv-ats-france) couvre en detail.

Et si vous voulez savoir exactement comment votre CV sera lu par ces systemes, testez-le. C'est gratuit, ca prend 30 secondes, et vous aurez votre reponse.

---

**Testez votre CV contre les filtres ATS.** [Analyse gratuite sur CVpass](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "postuler-welcome-to-the-jungle",
    title: "Postuler sur Welcome to the Jungle : comment passer les filtres (guide pratique)",
    metaTitle: "Postuler sur Welcome to the Jungle : passer les filtres ATS 2026 | CVpass",
    metaDescription: "Comment postuler efficacement sur Welcome to the Jungle en 2026. Filtres ATS, mots-cles, format CV et erreurs a eviter pour maximiser vos chances.",
    description: "Guide pratique pour postuler sur Welcome to the Jungle et ne pas se faire filtrer par leur systeme.",
    date: "2026-04-05",
    readTime: "7 min",
    category: "Guide ATS",
    tags: ["Guide ATS", "France", "Recrutement"],
    image: "/blog/optimiser-cv-ats-france.svg",
    content: `
## Welcome to the Jungle va bien au-delà du design

Je vais etre honnete : quand j'ai decouvert Welcome to the Jungle, j'ai trouve le concept genial. Des pages entreprise bien designees, des photos d'equipe, des valeurs affichees. Ca donne envie de postuler.

Mais derriere cette interface soignee, il y a un systeme de matching et de filtrage qui fonctionne exactement comme les ATS des grands groupes. Et beaucoup de candidats ne le realisent pas.

Resultat : ils postulent avec un beau CV Canva, recoivent la confirmation "Candidature envoyee" et... silence radio. Pendant des semaines.

## Comment fonctionne le filtrage sur WTTJ

Welcome to the Jungle utilise un systeme de matching proprietaire. Quand vous postulez, votre CV est analyse automatiquement. Le systeme extrait vos competences, votre experience, vos mots-cles et les compare avec les criteres du poste.

Le recruteur voit ensuite un classement des candidatures. Les CV avec la meilleure correspondance apparaissent en haut. Les autres sont en bas, parfois sur la deuxieme ou troisieme page. Et honnement, combien de recruteurs vont jusqu'a la page 3 ? Pas beaucoup.

Ce n'est pas tout a fait un filtre binaire "oui/non" comme Workday ou Taleo. C'est plus un systeme de scoring et de tri. Mais le resultat est le meme : si votre CV ne matche pas, il est enterre.

## Les erreurs qui plombent votre candidature

**Le CV generique.** Vous envoyez le meme CV pour tous les postes sur WTTJ. Le systeme compare votre CV avec les mots-cles specifiques de CHAQUE offre. Un CV generique aura un score moyen sur toutes les offres et un bon score sur aucune.

**Le format Canva multi-colonnes.** WTTJ extrait le texte de votre PDF. Si votre mise en page est en deux colonnes, le texte est melange. "Developpeur 2022-2024 React Paris Node.js" au lieu de "Developpeur React / Node.js, Paris, 2022-2024". Le matching est fausse.

**Les competences implicites.** Vous avez utilise React pendant 3 ans mais le mot "React" n'apparait nulle part dans votre CV parce que vous l'avez mis sous "Technologies web". Le systeme ne fait pas le rapprochement.

**Pas de titre de poste clair.** Le matching commence par le titre. Si votre CV dit "Professionnel motive en quete de nouveaux defis" au lieu de "Developpeur Full-Stack JavaScript", vous partez avec un handicap.

## Comment optimiser votre candidature

### Adaptez votre CV a chaque offre

Je sais, c'est penible. Mais c'est la difference entre etre vu et etre ignore. Lisez l'offre, identifiez les 5-6 competences cles mentionnees et assurez-vous qu'elles apparaissent dans votre CV avec exactement les memes termes.

L'offre dit "gestion de projet Agile" ? Votre CV doit dire "gestion de projet Agile", pas "methodes agiles" ni "Scrum Master".

### Utilisez un format simple

Une colonne. Des sections claires : Experience, Formation, Competences. Pas de tableaux, pas d'icones dans les sections, pas de barres de progression pour les competences.

Un PDF texte genere depuis Word ou Google Docs. Pas un export Canva.

### Soignez la section Competences

WTTJ accorde beaucoup de poids aux competences listees explicitement. Ajoutez une section "Competences" avec 8-12 termes qui correspondent au vocabulaire des offres que vous visez.

Melangez hard skills (les outils, langages, methodes) et soft skills (les competences relationnelles mentionnees dans l'offre).

### Remplissez votre profil WTTJ

Ce que beaucoup oublient : WTTJ a aussi un profil candidat. Remplissez-le completement. Le systeme utilise les infos de votre profil EN PLUS de votre CV pour le matching. Un profil vide = un matching partiel.

## Le test que je recommande

Avant de postuler sur WTTJ, faites le test : analysez votre CV avec un [scanner ATS](/blog/scanner-cv-gratuit). Vous verrez exactement quels mots-cles manquent et comment votre CV sera interprete par le systeme de matching.

Si votre score est en dessous de 60, vous avez du travail. Au-dessus de 75, vous etes en bonne position. L'ideal c'est 80+.

Ce n'est pas une garantie de decrocher le poste. Mais c'est la garantie que votre CV sera VU par un humain. Et c'est deja enorme.

---

**Verifiez que votre CV passe les filtres WTTJ.** [Analyse gratuite sur CVpass](https://cvpass.fr)
    `.trim(),
  },

  {
    slug: "pas-de-reponse-indeed",
    title: "Pas de reponse sur Indeed ? Voila probablement pourquoi",
    metaTitle: "Pas de reponse sur Indeed : 5 raisons et comment y remedier | CVpass",
    metaDescription: "Vous postulez sur Indeed sans jamais recevoir de reponse ? Les 5 raisons les plus courantes et comment corriger votre CV pour enfin etre vu.",
    description: "Pourquoi vos candidatures Indeed restent sans reponse et comment y remedier concretement.",
    date: "2026-04-08",
    readTime: "6 min",
    category: "Guide ATS",
    tags: ["Guide ATS", "France", "Recrutement"],
    image: "/blog/erreurs-cv-ats.svg",
    content: `
## Le silence qui rend fou

Si vous lisez cet article, il y a des chances que vous connaissiez ce sentiment. Vous passez une heure a chercher la bonne offre sur Indeed. Vous adaptez votre CV (ou pas, on en reparlera). Vous cliquez "Postuler". La page de confirmation apparait. Et ensuite... rien.

Pas de reponse. Pas meme un mail automatique de refus. Juste le vide.

Vous recommencez le lendemain. Et le surlendemain. Apres 50 candidatures sans retour, vous commencez a vous demander si le probleme c'est vous.

Spoiler : le probleme c'est probablement pas vous. C'est votre CV. Ou plus precisement, la facon dont votre CV est traite par Indeed.

## Raison 1 : Indeed filtre votre CV avant le recruteur

Ce que beaucoup de gens ne savent pas, c'est qu'Indeed a son propre systeme de filtrage. Quand vous postulez, votre CV est analyse par un algorithme AVANT d'etre transmis a l'employeur.

L'employeur peut configurer des filtres : "minimum 3 ans d'experience", "diplome Bac+5", "competence Excel obligatoire". Si votre CV ne coche pas ces cases selon l'algorithme, votre candidature est filtree.

Le recruteur ne la voit meme pas. Il ne sait meme pas que vous avez postule.

C'est dur a entendre, mais c'est la realite du recrutement en ligne en 2026.

## Raison 2 : Vous envoyez le meme CV partout

C'est l'erreur numero un. Et croyez-moi, je l'ai faite aussi pendant longtemps.

Un CV generique c'est comme un email envoye a "Cher Monsieur/Madame". Ca marche techniquement, mais ca ne convainc personne. Et surtout, ca ne convainc pas les algorithmes.

Chaque offre sur Indeed a ses propres mots-cles. "Gestionnaire de paie" et "Responsable paie" c'est le meme job. Mais si l'offre dit "Gestionnaire de paie" et que votre CV dit "Responsable paie", l'algorithme peut considerer que ca ne matche pas.

Je sais que c'est absurde. Mais c'est comme ca que ces systemes fonctionnent.

La solution : pour chaque candidature importante, verifiez que les termes cles de l'offre apparaissent dans votre CV. Pas besoin de tout reecrire. Juste ajuster les formulations.

## Raison 3 : Votre CV est un PDF image

Si vous avez cree votre CV sur Canva et que vous l'avez exporte en PDF, faites ce test : ouvrez le PDF, essayez de selectionner du texte. Si vous ne pouvez pas le selectionner, votre CV est une image.

Et une image, pour l'algorithme d'Indeed, c'est un fichier vide. Zero mot-cle detecte. Zero competence. Votre candidature part directement a la poubelle numerique.

J'ai vu des candidats avec 10 ans d'experience, un parcours impeccable, se faire filtrer parce que leur [CV Canva etait illisible](/blog/cv-canva-ats) pour le systeme.

## Raison 4 : Vous postulez trop tard

Sur Indeed, les offres recentes recoivent un afflux de candidatures dans les premieres 24 heures. Le recruteur commence a regarder les CV rapidement, parfois le jour meme de la publication.

Si vous postulez 5 jours apres la mise en ligne, votre CV arrive en bas d'une pile de 200 candidatures. Meme sans filtre ATS, vos chances sont faibles.

Mon conseil : activez les alertes Indeed pour vos mots-cles. Postulez dans les 24 premieres heures. Ca fait une difference enorme.

## Raison 5 : Votre profil Indeed est incomplet

Indeed a un systeme de matching similaire a [Welcome to the Jungle](/blog/postuler-welcome-to-the-jungle). Votre profil Indeed est pris en compte dans le classement des candidatures.

Un profil avec juste votre nom et un CV uploade sera moins bien classe qu'un profil complete avec vos competences, votre resume, votre experience detaillee.

Prenez 15 minutes pour remplir votre profil Indeed completement. C'est un investissement qui paie sur chaque candidature.

## Comment corriger le tir

Voila ce que je ferais si j'etais a votre place, dans cet ordre :

Premiere chose : verifiez que votre CV est lisible par un robot. Testez-le avec un [scanner ATS](/blog/scanner-cv-gratuit). Si le score est en dessous de 50, c'est probablement la raison principale de vos non-reponses.

Deuxieme chose : pour vos 3 prochaines candidatures, prenez 5 minutes pour adapter votre CV a chaque offre. Pas une refonte complete. Juste verifier que les [mots-cles de l'offre](/blog/mots-cles-cv-ats) sont dans votre CV.

Troisieme chose : postulez vite. Alertes Indeed activees, candidature dans les 24h.

Ce n'est pas de la magie. Mais j'ai vu des gens passer de 0 reponse en 2 mois a 3 entretiens en 2 semaines juste en appliquant ces trois choses.

---

**Testez votre CV Indeed gratuitement.** [Analyse sur CVpass](https://cvpass.fr)
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS;
}

/** Get all unique tags across all posts */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of BLOG_POSTS) {
    for (const tag of post.tags) tagSet.add(tag);
  }
  return Array.from(tagSet).sort();
}

/** Get tag slug from tag name */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Get posts by tag */
export function getPostsByTag(tagSlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) =>
    p.tags.some((t) => tagToSlug(t) === tagSlug)
  );
}

/** Get tag name from slug */
export function getTagName(tagSlug: string): string | undefined {
  for (const post of BLOG_POSTS) {
    for (const tag of post.tags) {
      if (tagToSlug(tag) === tagSlug) return tag;
    }
  }
  return undefined;
}
