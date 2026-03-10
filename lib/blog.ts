export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
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
    date: "2026-03-10",
    readTime: "7 min",
    category: "Score ATS",
    content: `
## Qu'est-ce qu'un score ATS ?

Quand tu postules à une offre d'emploi, ton CV passe souvent par un logiciel de tri automatisé avant d'atterrir sur le bureau d'un recruteur. Ces logiciels — appelés ATS, pour *Applicant Tracking System* — analysent ton CV et lui attribuent un score.

Ce score reflète à quel point ton CV correspond à l'offre d'emploi : les mots-clés présents, la structure du document, la lisibilité des informations. Un CV avec un score élevé remonte dans la pile. Un CV avec un score faible reste invisible, même si ton profil est excellent.

Le problème : la plupart des candidats ignorent complètement ce mécanisme. Ils soignent la mise en page, investissent dans un beau modèle Canva, et se demandent pourquoi ils n'ont aucune réponse.

## Comment est calculé le score ATS ?

Il n'existe pas un seul standard universel — chaque logiciel ATS a sa propre méthode. Mais la plupart analysent les mêmes critères fondamentaux.

### 1. La correspondance des mots-clés

C'est le critère le plus déterminant. L'ATS extrait les compétences, outils et qualifications mentionnés dans l'offre d'emploi, puis cherche ces mêmes termes dans ton CV.

Si l'offre demande "gestion de projet Agile" et que ton CV dit "méthode Scrum", l'ATS peut ne pas faire le lien — même si c'est la même chose dans les faits. La formulation exacte compte énormément.

### 2. La structure du document

Les ATS lisent les CV comme un parser lit du code. Ils cherchent des sections identifiables : Expérience, Formation, Compétences. Si ton CV utilise des colonnes, des tableaux ou des zones de texte dans une mise en page complexe, le logiciel peut rater des informations entières.

### 3. Le format du fichier

Un CV PDF généré correctement est généralement bien lu. Un CV exporté depuis Canva en PDF image est souvent illisible pour un ATS — le texte n'est pas du texte, c'est une image. Le score tombe à zéro.

### 4. La densité et la pertinence

Certains ATS calculent aussi la densité de mots-clés pertinents. Un CV qui répète les bons termes dans des contextes variés (expérience, compétences, résumé) aura un meilleur score qu'un CV qui les cite une seule fois.

## Pourquoi ton score ATS est probablement plus bas que tu ne le penses

Voici les erreurs les plus fréquentes qui font baisser le score :

**Tu utilises des synonymes au lieu des termes exacts.** Tu écris "pilotage de projet" quand l'offre dit "gestion de projet". Tu écris "chef d'équipe" quand l'offre dit "team leader". L'ATS ne fait pas toujours le rapprochement.

**Tu as un CV générique non adapté à chaque offre.** Un seul CV pour toutes tes candidatures, c'est l'erreur classique. Les mots-clés varient selon les secteurs, les entreprises, les postes. Un CV non adapté aura un score faible même sur des postes qui te correspondent.

**Ta mise en page nuit à la lisibilité machine.** Colonnes côte à côte, en-têtes fancy, icônes dans les sections — tout ça perturbe la lecture automatisée.

**Ton résumé de profil est vague.** Des phrases comme "professionnel dynamique et motivé" n'apportent aucun mot-clé utile à l'ATS.

## Comment améliorer ton score ATS étape par étape

### Étape 1 : Analyse l'offre avant de candidater

Avant de modifier ton CV, lis attentivement l'offre. Identifie les compétences et outils mentionnés plusieurs fois — ce sont les mots-clés prioritaires. Note aussi les qualifications requises et le vocabulaire utilisé par l'entreprise.

### Étape 2 : Adapte chaque candidature

Ce n'est pas une question de réécrire ton CV de zéro. Il s'agit d'ajuster les formulations dans tes expériences pour qu'elles correspondent au vocabulaire de l'offre. Si l'offre parle de "CRM Salesforce" et que tu as utilisé Salesforce, assure-toi que le mot apparaît explicitement dans ton CV.

### Étape 3 : Simplifie la mise en page

Passe à un format simple : une colonne, des sections clairement titrées (Expérience professionnelle, Formation, Compétences), des puces pour les accomplissements. Pas de tableaux, pas d'images, pas de texte dans des zones graphiques.

### Étape 4 : Quantifie tes résultats

Les ATS — et les recruteurs humains — accordent plus de poids aux réalisations chiffrées. "Géré une équipe de 5 personnes" devient "Piloté une équipe de 5 personnes, +30% de productivité sur 6 mois". C'est plus précis, plus mémorable, et plus riche en contexte.

### Étape 5 : Vérifie avec un outil dédié

Tu ne peux pas calculer ton score ATS à la main. Utilise un outil qui analyse ton CV par rapport à une offre précise et te donne un score objectif.

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
    date: "2026-03-10",
    readTime: "6 min",
    category: "CV Canva",
    content: `
## Le piège du CV Canva

Canva a révolutionné la création de CV. En 20 minutes, tu peux avoir un CV visuellement impeccable : couleurs harmonieuses, icônes professionnelles, mise en page moderne. Le problème ? Ce CV magnifique est souvent invisible pour les logiciels ATS qui trient les candidatures avant qu'un humain les lise.

Ce n'est pas un défaut de Canva. C'est une incompatibilité fondamentale entre ce que Canva produit et ce que les ATS savent lire.

## Pourquoi les ATS ne lisent pas les CV Canva

### Le problème du PDF image

Quand tu exportes ton CV depuis Canva, le résultat est souvent un **PDF image** — c'est-à-dire que le texte est converti en pixels. Pour toi, ça ressemble à du texte. Pour un ATS, c'est une photo.

Les ATS ne peuvent pas extraire du texte d'une image. Ils ne peuvent donc pas détecter tes compétences, tes expériences, tes mots-clés. Résultat : ton CV obtient un score proche de zéro, quel que soit ton profil.

### La mise en page en colonnes

Même si le PDF Canva contient du texte sélectionnable, la structure pose problème. Canva utilise des colonnes côte à côte. La plupart des ATS lisent le texte de gauche à droite, ligne par ligne. Une mise en page en deux colonnes donne une lecture désordonnée : le logiciel mélange le contenu des colonnes, produit des phrases incohérentes, et rate des informations entières.

### Les zones de texte et les formes

Canva place souvent le texte dans des zones indépendantes : un bloc pour le nom, un bloc pour les coordonnées, des formes décoratives avec du texte dedans. Les ATS ont du mal à hiérarchiser ces blocs et peuvent ignorer certains d'entre eux complètement.

### Les icônes et les éléments graphiques

Compétences représentées par des barres de progression, sections avec des icônes personnalisées, en-têtes dans des formes colorées — ces éléments graphiques sont riches visuellement, mais muets pour un ATS. Pire : ils peuvent perturber la lecture du texte adjacent.

## Comment savoir si ton CV Canva a ce problème

### Test simple : copier-coller

Ouvre ton PDF Canva. Sélectionne tout le texte (Ctrl+A ou Cmd+A), copie-le et colle-le dans un éditeur de texte. Si le résultat est illisible — texte mélangé, mots coupés, lignes dans le désordre — c'est que ton CV ne sera pas bien lu par les ATS.

Si tu ne peux pas sélectionner de texte du tout, ton CV est un PDF image. C'est le cas le plus problématique.

### Test avec un scanner ATS

Utilise un outil d'analyse de CV pour voir le score que ton CV obtient. Un score très bas sur un profil pourtant qualifié est souvent le signe d'un problème de lecture du document.

## Comment corriger ton CV Canva

### Solution 1 : Exporter en PDF texte depuis Canva

Dans Canva, quand tu exportes en PDF, assure-toi de choisir "PDF — Impression" et non "PDF — Standard". Vérifie ensuite que le texte est sélectionnable dans le fichier exporté.

Cette solution améliore le problème du PDF image, mais ne résout pas forcément les problèmes de colonnes et de mise en page complexe.

### Solution 2 : Simplifier la mise en page dans Canva

Choisis un modèle Canva à **une seule colonne**, sans zones de texte superposées, sans barres de compétences graphiques. Des modèles minimalistes avec un fond blanc et une typographie simple sont les plus compatibles ATS.

Évite : les modèles à double colonne, les en-têtes dans des formes colorées, les compétences représentées par des étoiles ou des barres.

Préfère : une colonne unique, des sections clairement titrées, des puces simples pour les expériences.

### Solution 3 : Passer à un format Word ou Google Docs pour le fond

Si tu tiens à un beau design visuel pour les candidatures directes (LinkedIn, envoi par email à des contacts), garde ton Canva. Mais pour les candidatures via des plateformes ATS — Indeed, Welcome to the Jungle, LinkedIn Applications, APEC — prépare une version Word ou Google Docs avec une mise en page simple.

Un CV propre et bien structuré dans un format lisible battra presque toujours un CV design illisible pour un ATS.

## Ce que CVpass fait pour les CV Canva

CVpass détecte automatiquement si ton CV est au format image ou si le texte pose des problèmes de lecture. L'outil te guide pour exporter correctement ton CV et analyse ensuite chaque section pour calculer ton score ATS par rapport à l'offre que tu vises.

Pour chaque point faible détecté, l'IA propose une reformulation directement utilisable — tu n'as plus qu'à cliquer Accepter.

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
    date: "2026-03-10",
    readTime: "8 min",
    category: "Guide ATS",
    content: `
## Les ATS en France en 2026 : ce qu'il faut savoir

Le marché de l'emploi français a pleinement adopté les systèmes de gestion des candidatures. Les grandes entreprises, les cabinets de recrutement et même les PME en croissance utilisent aujourd'hui des ATS pour gérer des volumes de candidatures que les équipes RH ne pourraient pas traiter manuellement.

Des plateformes comme Welcome to the Jungle, LinkedIn, APEC et Indeed intègrent leur propre système de filtrage. Les entreprises utilisent des solutions comme Workday, Greenhouse, Lever ou des outils français comme Teamtailor. Chacun a ses particularités, mais tous partagent les mêmes principes fondamentaux de lecture et d'analyse des CV.

Comprendre comment ces systèmes fonctionnent te donne un avantage concret sur la majorité des candidats qui ignorent complètement ce mécanisme.

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

Colonnes multiples, tableaux, zones de texte dans des formes graphiques, en-têtes dans des images — tout ça perturbe la lecture automatisée. Les ATS lisent le texte dans un ordre linéaire et ont du mal avec les structures non conventionnelles.

### Erreur 3 : Des compétences vagues ou non quantifiées

"Excellentes compétences en communication" ou "bonne maîtrise d'Excel" n'apportent aucune valeur à un ATS. Il faut des termes précis et, quand c'est possible, des résultats chiffrés.

### Erreur 4 : L'absence de section Compétences

Certains candidats intègrent toutes leurs compétences dans le texte des expériences. C'est bien pour la lecture humaine, mais les ATS cherchent souvent une section "Compétences" ou "Outils" dédiée pour extraire ces informations rapidement.

### Erreur 5 : Des titres de section non standards

"Mon parcours" au lieu d'"Expérience professionnelle", "Ce que je sais faire" au lieu de "Compétences" — les ATS cherchent des intitulés standards. Sois conventionnel sur les titres de section.

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
- Les **termes répétés** — ce qui revient plusieurs fois est prioritaire
- Le **vocabulaire sectoriel** propre à l'entreprise ou au secteur

### Étape 2 : Cartographie les correspondances

Compare l'offre avec ton CV actuel. Pour chaque compétence demandée dans l'offre, vérifie si :
- Elle apparaît dans ton CV avec exactement les mêmes termes
- Elle est présente mais formulée différemment
- Elle est absente (dans ce cas, si tu la possèdes réellement, elle doit être ajoutée)

### Étape 3 : Adapte les formulations

Pour chaque compétence présente mais mal formulée, ajuste le texte. Ce n'est pas du mensonge — c'est de la traduction de tes expériences réelles dans le vocabulaire attendu.

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

Toutes ces étapes prennent du temps — souvent 1 à 2 heures par candidature quand elles sont faites manuellement. CVpass automatise les étapes 2 à 6.

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
    date: "2026-03-10",
    readTime: "7 min",
    category: "Mots-clés",
    content: `
## Pourquoi les mots-clés sont au cœur du score ATS

Un ATS fonctionne comme un moteur de recherche appliqué aux CV. Il extrait les mots-clés de l'offre d'emploi et cherche ces mêmes termes dans ta candidature. Plus la correspondance est forte, plus ton score est élevé.

Ce mécanisme simple a une implication directe : même si tu as toutes les compétences requises pour un poste, ton CV peut être mal classé si ces compétences sont décrites avec des termes différents de ceux utilisés dans l'offre.

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

Diplômes, certifications, niveaux d'expérience. "Bac+5", "Ingénieur", "Master", "certifié PMP", "certifié Google Ads", "bilingue anglais". Ces éléments sont souvent des filtres absolus dans les ATS — en dessous d'un certain niveau, la candidature est écartée automatiquement.

## Comment identifier les bons mots-clés pour chaque offre

### Méthode 1 : L'analyse manuelle

Lis l'offre d'emploi attentivement. Identifie les termes qui :
- Apparaissent plusieurs fois (fréquence = priorité)
- Sont dans les critères "requis" plutôt que "souhaités"
- Sont dans le titre du poste lui-même
- Correspondent aux technologies ou outils nommément cités

### Méthode 2 : La comparaison avec des offres similaires

Analyse 5 à 10 offres pour le même type de poste. Les mots-clés qui reviennent dans toutes les offres sont les incontournables du secteur — ils doivent absolument figurer dans ton CV si tu possèdes ces compétences.

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

SQL et "Structured Query Language" ne sont pas forcément équivalents pour un ATS. "IA" et "Intelligence Artificielle", "RH" et "Ressources Humaines" — certains systèmes ne font pas le lien. Utilise à la fois l'acronyme et la version développée, au moins une fois chacun.

### Ignorer les mots-clés de soft skills

Les ATS modernes analysent aussi les soft skills : "leadership", "gestion d'équipe", "communication", "autonomie", "rigueur". Ces termes apparaissent souvent dans les offres et doivent figurer dans ton CV — mais toujours avec des preuves, pas juste comme des adjectifs.

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
    date: "2026-03-10",
    readTime: "6 min",
    category: "Format CV",
    content: `
## La question que tout le monde se pose

PDF ou Word ? C'est l'une des questions les plus fréquentes dans la recherche d'emploi. Et la réponse que tu entends le plus souvent — "le PDF, car il conserve la mise en page" — est incomplète et peut te desservir.

La vraie réponse : **ce n'est pas le format qui compte, c'est comment le fichier est créé et ce qu'il contient**.

## Ce que les ATS savent faire (et ce qu'ils ne savent pas faire)

Les ATS doivent extraire du texte de ton CV pour l'analyser. Leur capacité à le faire dépend de la nature du fichier, pas uniquement de son extension.

### PDF texte vs PDF image

Un PDF peut contenir deux types de données très différents :

- **PDF texte** : le texte est encodé dans le fichier, tu peux le sélectionner et le copier. Un ATS peut l'extraire facilement.
- **PDF image** : le document est une capture d'écran ou un scan. Le texte est des pixels. Un ATS ne peut pas l'extraire — il ne voit qu'une image.

Beaucoup de CV créés sur Canva, Photoshop, ou exportés depuis certains logiciels de PAO sont des PDFs images. Résultat : un score ATS proche de zéro, quelle que soit la qualité réelle du candidat.

### Le cas Word (DOCX)

Un fichier Word contient du texte structuré, presque toujours lisible par les ATS. L'extraction est généralement fiable. En revanche, une mise en page Word très complexe — tableaux imbriqués, zones de texte, colonnes côte à côte — peut créer des problèmes similaires à ceux d'un PDF mal construit.

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

Pour les candidatures directes sur des plateformes comme Welcome to the Jungle, LinkedIn, ou le site d'une entreprise — un PDF texte bien structuré est le meilleur choix.

## Les règles d'or pour chaque format

### Règle d'or pour le PDF

1. Génère-le depuis Word, Google Docs, LibreOffice ou un éditeur de CV ATS-compatible
2. Vérifie que le texte est sélectionnable (clic dans le PDF, essaie de sélectionner une ligne)
3. Évite les mises en page à deux colonnes, les tableaux, les zones de texte graphiques
4. Une colonne unique, des sections clairement titrées, du texte en puces

### Règle d'or pour le Word

1. Structure simple : une colonne, titres avec styles de titres (Titre 1, Titre 2), pas de tableaux pour la mise en page
2. Évite les zones de texte — utilise des paragraphes normaux
3. Format DOCX (pas DOC, pas ODT)
4. Vérifie que le fichier s'ouvre proprement sur une version différente de Word

## Comment tester la compatibilité ATS de ton CV

### Test 1 : La sélection de texte

Ouvre ton PDF. Clique dans le document et essaie de sélectionner du texte. Si tu peux sélectionner et copier des mots, le texte est extrait. Sinon, ton CV est probablement un PDF image.

### Test 2 : Le copier-coller

Sélectionne tout le texte de ton PDF (Ctrl+A ou Cmd+A) et colle-le dans un éditeur de texte simple (Notepad, TextEdit). Si le résultat ressemble à ton CV — sections dans le bon ordre, texte lisible — c'est bon signe. Si c'est un mélange chaotique de mots, l'ATS aura les mêmes difficultés.

### Test 3 : Un scanner ATS

Le test le plus fiable est d'uploader ton CV dans un outil d'analyse ATS. Il te dira directement si le contenu est lisible et comment le score se compare à une offre.

## Le meilleur workflow en pratique

Si tu cherches activement un emploi, je te recommande d'avoir **deux versions** de ton CV :

**Version ATS** : format simple, une colonne, PDF texte ou Word. C'est celle que tu envoies sur toutes les plateformes emploi et via les formulaires en ligne des entreprises.

**Version visuelle** : ton beau CV Canva ou autre, avec la mise en page soignée. Celle-là, garde-la pour les candidatures directes par email à des personnes que tu connais, pour les salons, ou pour accompagner une version ATS propre.

## CVpass génère le bon format

Quand CVpass optimise ton CV, il produit un PDF sobre et structuré, conçu pour être parfaitement lisible par les ATS. Pas de colonnes, pas d'images, pas de tableaux — juste du contenu bien organisé et optimisé pour l'offre que tu vises.

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
    date: "2026-03-10",
    readTime: "8 min",
    category: "Outils",
    content: `
## Pourquoi scanner son CV avant de postuler ?

La recherche d'emploi en 2026 demande plus qu'un CV bien présenté. Avant qu'un recruteur humain lise ta candidature, un logiciel ATS analyse automatiquement ton document, extrait les mots-clés et calcule un score de pertinence.

Scanner son CV avant de postuler, c'est comprendre ce que l'ATS va trouver — ou ne pas trouver. C'est corriger les problèmes avant qu'ils t'empêchent d'avoir un entretien. Et c'est gagner un avantage concret sur les candidats qui ne font pas cette démarche.

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

**Principe** : CVpass est conçu spécifiquement pour aller au-delà de l'analyse — jusqu'à la correction automatique. Tu uploades ton CV, tu colles l'offre d'emploi. L'IA analyse la correspondance, calcule un score ATS et propose une réécriture complète pour chaque point faible détecté.

**Points forts** :
- Analyse basée sur l'offre précise que tu vises, pas une analyse générique
- Réécriture IA des bullet points faibles — tu n'as qu'à cliquer Accepter
- Score qui remonte en temps réel à chaque suggestion acceptée
- Interface en français, adapté au marché français (APEC, Welcome to the Jungle, LinkedIn FR)
- Export PDF ATS-compatible
- Détection des problèmes de format (PDF image, colonnes)

**Limites** : Les fonctionnalités avancées (éditeur 1-clic, réécriture IA, export PDF) sont dans les plans payants. L'analyse de base est gratuite.

**Adapté pour** : Les candidats qui veulent non seulement comprendre les problèmes de leur CV, mais les corriger rapidement et efficacement.

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

**Première étape — Analyse générale** : utilise un outil comme Resume Worded ou la fonction d'analyse de CVcrea pour identifier les problèmes structurels de ton CV (formulations faibles, manque de chiffres, sections mal titrées). Fais ces corrections une bonne fois pour toutes.

**Deuxième étape — Adaptation par offre** : pour chaque candidature importante, utilise CVpass pour analyser la correspondance avec l'offre précise et corriger les mots-clés manquants. C'est là que se gagne ou se perd chaque candidature.

## Ce que j'attends vraiment d'un scanner CV

La plupart des outils te disent quoi corriger. Très peu te montrent comment corriger. Et aucun, sauf CVpass, ne corrige directement.

C'est la différence entre un médecin qui te dit "vous avez un problème au genou" et un kinésithérapeute qui te guide exercice par exercice. Le diagnostic, c'est bien. L'accompagnement jusqu'à la solution, c'est ce qui change vraiment les résultats.

Si tu envoies 5 à 10 candidatures par semaine, le temps passé à analyser et corriger manuellement chaque CV représente plusieurs heures. Automatiser cette étape n'est pas de la paresse — c'est de l'efficacité.

---

**Essaie CVpass gratuitement — analyse complète, sans carte de crédit.** [Scanner mon CV sur CVpass →](https://cvpass.fr)
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return BLOG_POSTS;
}
