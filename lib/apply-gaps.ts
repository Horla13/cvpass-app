import type { CVData } from "@/lib/pdf-restructure";

/** Apply accepted suggestions to CV data server-side (more reliable than client fuzzy match) */
export function applyGapsToCvData(
  cv: CVData,
  gaps: { texte_original?: string; texte_suggere?: string; category?: string }[]
): CVData {
  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();

  const sub = (text: string, orig: string, suggested: string): string => {
    // Match exact
    if (text.includes(orig)) return text.replace(orig, suggested);
    // Match normalisé (accents, espaces, casse)
    const origNorm = normalize(orig);
    if (normalize(text).includes(origNorm)) {
      if (normalize(text) === origNorm) return suggested;
      return suggested;
    }
    // Fuzzy : >50% des mots significatifs matchent
    const origWords = origNorm.split(" ").filter((w) => w.length > 2);
    const textNorm = normalize(text);
    const matchCount = origWords.filter((w) => textNorm.includes(w)).length;
    if (origWords.length > 0 && matchCount / origWords.length > 0.5) return suggested;
    return text;
  };

  let result = { ...cv };
  for (const gap of gaps) {
    const orig = gap.texte_original?.trim();
    const suggested = gap.texte_suggere?.trim();
    if (!suggested) continue;

    if (orig) {
      result = {
        ...result,
        profil: result.profil ? sub(result.profil, orig, suggested) : result.profil,
        titre: result.titre ? sub(result.titre, orig, suggested) : result.titre,
        experiences: result.experiences.map((exp) => ({
          ...exp,
          poste: sub(exp.poste, orig, suggested),
          missions: exp.missions.map((m) => sub(m, orig, suggested)),
        })),
        competences: result.competences.map((c) => sub(c, orig, suggested)),
      };
    } else {
      const cat = gap.category;
      if (cat === "accroche") {
        result = { ...result, profil: result.profil ? result.profil + "\n" + suggested : suggested };
      } else if (cat === "titre") {
        result = { ...result, titre: suggested };
      } else if (cat === "competence") {
        const newComps = suggested.split(/,\s*/).map((s) => s.trim()).filter(Boolean);
        result = { ...result, competences: [...result.competences, ...newComps] };
      } else if (cat === "experience" && result.experiences.length > 0) {
        result = {
          ...result,
          experiences: result.experiences.map((exp, i) =>
            i === 0 ? { ...exp, missions: [...exp.missions, suggested] } : exp
          ),
        };
      }
    }
  }
  return result;
}
