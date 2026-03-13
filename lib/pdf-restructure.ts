import { getOpenAI } from "@/lib/openai";
import { Gap } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Experience {
  poste: string;
  entreprise?: string;
  lieu?: string;
  periode?: string;
  missions: string[];
}

export interface Formation {
  diplome: string;
  etablissement?: string;
  periode?: string;
}

export interface CVData {
  nom: string;
  titre?: string;
  contact?: { email?: string; telephone?: string; ville?: string };
  profil?: string;
  experiences: Experience[];
  formation: Formation[];
  competences: string[];
  centres_interet: string[];
  informations: string[];
}

export interface LetterMeta {
  senderName?: string;
  senderEmail?: string;
  senderCity?: string;
  senderPhone?: string;
  jobTitle?: string;
}

// ─── GPT restructuring ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es un expert en rédaction de CV ATS.
À partir du texte brut d'un CV et d'une liste de modifications acceptées, restructure et retourne un objet JSON strict avec cette structure exacte :

{
  "nom": "string",
  "titre": "string",
  "contact": { "email": "string", "telephone": "string", "ville": "string" },
  "profil": "string",
  "experiences": [
    { "poste": "string", "entreprise": "string", "lieu": "string", "periode": "string", "missions": ["string"] }
  ],
  "formation": [
    { "diplome": "string", "etablissement": "string", "periode": "string" }
  ],
  "competences": ["string"],
  "centres_interet": ["string"],
  "informations": ["string"]
}

⚠️ TEXTE POTENTIELLEMENT MÉLANGÉ (CV 2 COLONNES) :
Le texte que tu reçois peut être mal ordonné car extrait d'un CV en 2 colonnes. Les informations de différentes sections sont mélangées. Ton travail est de RECONNAÎTRE et TRIER chaque information dans la bonne catégorie, peu importe l'ordre dans lequel elle apparaît dans le texte.

RÈGLES DE RECONNAISSANCE :
- nom : Prénom + Nom (souvent en majuscules, en début de document)
- contact :
  → email : contient @
  → telephone : format XX.XX.XX.XX.XX ou +33...
  → ville : nom de ville + code postal (ex: Allauch, 13190)
- profil : Phrases décrivant l'objectif professionnel ou le candidat (souvent 2-3 lignes, commence par "Professionnel", "Fort de", "Passionné", etc.)
- experiences :
  → Poste = intitulé de métier (Maçon, Employé de magasin, Chef de chantier...)
  → Entreprise = nom de société (Armand Maçonnerie, Métro, Géant...)
  → Lieu = ville
  → Periode = dates (Depuis, 2019, Avril 2018 - Juin 2018...)
  → Missions = phrases décrivant les tâches (commence par verbe ou nom d'action)
- formation :
  → Diplôme = Baccalauréat, BTS, Licence, Master...
  → Etablissement = lycée, école, université
  → Periode = années (2013 - 2017)
- competences : Listes de qualités professionnelles ou compétences techniques (Sens des responsabilités, Ponctualité, Excel, AutoCAD...)
- centres_interet : Loisirs (Football, Cinéma, Voyages...)
- informations : Permis de conduire, mobilité géographique, statut (travailleur handicapé, etc.)

IMPORTANT :
- Ne mets JAMAIS une information dans la mauvaise section.
- Si tu n'es pas sûr, mets dans "informations".
- Ne laisse RIEN dans "profil" qui appartient aux expériences.
- Les dates isolées (Depuis, Octobre 2019) appartiennent à une expérience ou formation, pas à une section séparée.
- Regroupe les missions avec leur expérience correspondante même si elles sont éloignées dans le texte.

Règles générales :
- Intègre les modifications acceptées dans les bonnes sections en remplaçant les phrases originales correspondantes.
- Omets les champs vides (string vide) sauf nom.
- missions doit être un tableau de strings (une mission par élément).
- Si un champ est absent du CV, laisse le tableau vide ou omets la clé.
- RÈGLE ABSOLUE SUR LA RÉDACTION : sur un CV français professionnel, les missions s'écrivent de deux façons uniquement. OPTION A (PRÉFÉRÉ) — Nom d'action : "Gestion d'une équipe de 5 personnes", "Optimisation des procédures de sécurité", "Réalisation des travaux VRD", "Suivi et respect des délais". OPTION B — Infinitif : "Gérer une équipe", "Assurer le respect des consignes". INTERDIT : verbe conjugué ("Gérait", "A géré", "Gère"), participe passé en début de phrase ("Géré une équipe", "Optimisé les délais"), première personne ("Je", "J'ai", "J'"). Transformations : "J'ai géré une équipe" → "Gestion d'une équipe de 5 personnes" ; "Géré les chantiers VRD" → "Gestion des chantiers VRD" ; "Je suis capable de lire les plans" → "Lecture et interprétation des plans d'exécution". Cette règle s'applique à TOUTES les sections sans exception.
- La date de naissance ne doit PAS apparaître dans les informations : elle n'est pas obligatoire sur un CV français moderne. Place uniquement dans informations les éléments pratiques comme le permis de conduire, la mobilité géographique, le statut (travailleur handicapé, etc.).
- Retourne UNIQUEMENT le JSON brut, sans markdown, sans \`\`\`json, sans texte avant ou après.`;

export async function restructureWithGPT(cvText: string, acceptedGaps: Gap[]): Promise<CVData> {
  const openai = getOpenAI();

  const userMessage = `CV BRUT :\n${cvText}\n\nMODIFICATIONS ACCEPTÉES :\n${
    acceptedGaps.length > 0
      ? acceptedGaps
          .map((g) => `• Remplacer : "${g.texte_original}"\n  Par : "${g.texte_suggere}"`)
          .join("\n")
      : "Aucune"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as CVData;
}
