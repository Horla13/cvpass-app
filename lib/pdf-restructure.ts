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

Règles :
- Intègre les modifications acceptées dans les bonnes sections en remplaçant les phrases originales correspondantes.
- Omets les champs vides (string vide) sauf nom.
- missions doit être un tableau de strings (une mission par élément).
- Si un champ est absent du CV, laisse le tableau vide ou omets la clé.
- RÈGLE ABSOLUE : les missions, compétences, profil et TOUTES les sections du CV ne doivent JAMAIS contenir "Je", "J'ai", "Je suis", "J'ai pu", "J'ai développé" ou toute autre formulation à la première personne. Un CV professionnel français s'écrit toujours sans sujet. Utilise systématiquement un verbe d'action à l'infinitif ("Gérer", "Assurer", "Développer") ou au participe passé ("Géré", "Assuré", "Développé"). Exemples : "J'ai géré une équipe" → "Géré une équipe" ; "Je suis capable de lire les plans" → "Lecture et interprétation des plans". Cette règle s'applique à TOUTES les sections sans exception.
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
    model: "gpt-4o-mini",
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
